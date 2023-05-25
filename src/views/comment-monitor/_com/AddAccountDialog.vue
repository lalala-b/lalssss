<template>
  <el-dialog
    v-if="value"
    class="P-advertisingLaunchDialog"
    width="50%"
    title="新增"
    :visible="value"
    @close="onCancel"
  >
    <div v-loading="loading" class="add-form">
      <el-form
        ref="addForm"
        label-width="120px"
        :model="addForm"
        :rules="addFormRules"
      >
        <el-form-item label="平台名称" prop="platType">
          <el-select
            v-model="addForm.platType"
            clearable
            @change="handlePlatType"
          >
            <el-option
              v-for="item in platInfo"
              :key="item.plat_id"
              :value="item.plat_id + '-' + item.plat_name"
              :label="item.plat_name"
            />
          </el-select>
          <div v-if="addForm.plat_id" class="plat-info">
            <img
              :src="platMap[platType].plat_logo"
              alt
            >账号授权,请输入平台下分享出来的链接
          </div>
        </el-form-item>
        <el-form-item v-if="userInfo" class="mr90">
          <img :src="userInfo.avatar_uri" style="width: 100px" alt="">
          <p>{{ userInfo.user_name }}</p>
        </el-form-item>
        <el-form-item
          v-if="
            addForm.platType === '25-抖音' || addForm.platType === '26-快手'
          "
          label="账号检索"
        >
          <el-select
            v-model="addForm.userId"
            class="account-search"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod"
            :loading="accountLoading"
            :popper-append-to-body="false"
            no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
            style="width: 100%"
            @change="handleAccountChange"
          >
            <el-option
              v-for="item in accountList"
              :key="item.user_id"
              :label="item.user_name"
              :value="item.eid"
            >
              <flex-row>
                <img class="account-img" :src="item.avatar_uri" alt="">
                <div class="account-info">
                  <p class="account-text1 account-name">{{ item.user_name }}</p>
                  <p class="account-text2">ID:{{ item.eid }}</p>
                </div>
                <div class="account-info account-fans">
                  <p class="account-text1">粉丝量</p>
                  <p class="account-text2">
                    {{ item.fans_num | toThousandsW }}
                  </p>
                </div>
              </flex-row>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="URL" prop="accountLoginUrl">
          <div class="flex">
            <el-input
              v-model="addForm.accountLoginUrl"
              autocomplete="off"
              @change="handleUserUrl"
            />
            <el-button
              :loading="empowerLoading"
              :disabled="empowerDisabled"
              size="small"
              style="margin-left: 10px"
              @click="onEmpower"
            >授权</el-button>
          </div>
        </el-form-item>
        <el-row />
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button
        :loading="addLoading"
        type="primary"
        @click="onSave"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { $getMcnName } from '@/api/bussiness-manage'
import { $getUserAccount, $getBaseInfo } from '@/api/account-manage'
import { $addMonitor, $getCommentPlatInfo } from '@/api/comment-monitor'

import request from '@/http'
import flexRow from '@/components/public/flex-row/flex-row.vue'

import { PYTHON_HOST as HOST } from '@/const'
import { copy } from '@/components/common'

export default {
  components: { flexRow },
  props: {
    editType: {
      type: String,
      default: ''
    },
    value: Boolean
  },
  data() {
    return {
      platInfo: [],
      addForm: {
        accountId: '',
        userId: '',
        platId: '',
        accountLoginUrl: ''
      },
      addFormRules: {
        platId: [{ required: true, message: '请选择平台', trigger: 'blur' }],
        accountLoginUrl: [
          { required: true, message: '请输入链接', trigger: 'blur' }
        ]
      },
      mcnList: [],
      userInfo: null,
      platMap: {},
      empowerLoading: false,
      loading: false,
      accountList: [],
      addLoading: false,
      accountLoading: false,
      hasAccount: false,
      empowerDisabled: false
    }
  },
  created() {
    this.getPlatList()
  },
  methods: {
    belongTeamSearch(query) {
      if (query) {
        this.mcnList = this._mcnList
          ?.filter((item) => item.includes(query))
          ?.splice(0, 300)
      } else {
        this.mcnList = this._mcnList?.splice(0, 300)
      }
    },
    getMcnName() {
      this.mcnList = []
      $getMcnName({ platId: this.addForm.platId }).then((res) => {
        if (res.code === 1) {
          this.mcnList = res.data.splice(0, 300)
          this._mcnList = res.data
        }
      })
    },
    limitQuotePriceLen(e, type, len = 8, k, index) {
      let value = e.target.value
      value = value.replace(/[^\d]/g, '')
      if (value.length > len) {
        value = value.slice(0, len)
      }
      if (k) {
        this.addForm[type][index][k] = value
      } else {
        this.addForm[type] = value
      }
    },
    handleUserUrl() {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.empowerDisabled = false
    },
    async getPlatList() {
      const res = await $getUserAccount({ account_type: 3 })
      if (res.code === 1) {
        const { platMap } = this
        const platIdList = [(res.data || []).find((item) => item.plat_id === 25)]
        platIdList.forEach((t) => {
          this.$set(platMap, t.plat_id, t)
        })
        this.platInfo = platIdList
      }
    },
    /**
     * 授权
     */
    async onEmpower() {
      if (this.empowerLoading) {
        return
      }
      if (!this.addForm.platType) {
        this.$message.error('请先选择平台')
        return
      }
      this.empowerLoading = true
      const { platMap } = this
      const row = platMap[this.addForm.platType.split('-')[0]]
      let type = ''
      this.userInfo = null // 清空用户信息
      const params = {
        index_url: this.addForm.accountLoginUrl,
        realname: this.realname
      }
      try {
        const res = await request.get(`${HOST}${row.api1}`, { params })
        type = res.code === 1 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type
        })
        if (res.code === 1) {
          this.userInfo = res.data
          this.getMatchingMcnName({
            platId: this.addForm.platId,
            getDataUrl: this.userInfo.user_id
          })
        }
      } catch (err) {
        err.msg &&
          this.$message.error({
            message: err.msg
          })
      }
      this.empowerLoading = false
    },
    onCancel() {
      this.$emit('input', false)
    },
    onSave() {
      if (!this.userInfo && this.editType !== 'edit') {
        this.$message.error('请授权之后再试')
        return
      }
      const params = JSON.parse(JSON.stringify(this.addForm))
      this.addAccount(params)
    },
    formatParams(params) {
      if (params.platType) {
        const platSplit = params.platType.split('-')
        params.platId = platSplit[0]
        params.platName = platSplit[1]
      }
    },
    // 添加投放账号
    addAccount(params) {
      this.addLoading = true
      this.formatParams(params)
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => l.toUpperCase())
        params[k] = this.userInfo[key]
      }
      params.thirdUserId = this.userInfo.user_id
      params.accountSourceType = 1
      $addMonitor(params)
        .then((res) => {
          if (res.code === 1) {
            this.$message.success('添加成功')
            this.$emit('update')
            this.$emit('close')
          } else {
            this.$message.error(res.message)
          }
          this.addLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.addLoading = false
          this.$message.error(err.message)
        })
    },
    handlePlatType(val) {
      this.addForm.accountLoginUrl = ''
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.addForm.platId = val.split('-')[0]
      this.addForm.belongTeam = ''
      this.getMcnName()
      switch (val) {
        case '25-抖音':
          this.hasAccount = false
          this.addForm.searchType = '1'
          break
        default:
          this.hasAccount = true
          this.addForm.searchType = '2'
      }
    },
    handleAccountChange(userId) {
      this.empowerDisabled = true
      let data = null
      for (let index = 0; index < this.accountList.length; index++) {
        const element = this.accountList[index]
        if (element.eid === userId) {
          data = element
          break
        }
      }
      this.userInfo = data
      this.addForm.accountLoginUrl = data.index_url
      this.getMatchingMcnName({
        platId: this.addForm.platId,
        getDataUrl: this.userInfo.user_id
      })
    },
    remoteMethod(query) {
      if (query !== '') {
        // console.log(query, '--query')
        this.accountLoading = true
        this.getBaseInfo(query)
      } else {
        this.accountList = []
      }
    },
    async getBaseInfo(keyword) {
      const res = await $getBaseInfo({
        keyword,
        platId: this.addForm.platId
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
      this.accountLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.P-advertisingLaunchDialog {
  ::v-deep .svg-icon {
    margin-right: 6px;
    font-size: 16px;
  }
}
.input-new-tag {
  width: 248px;
}
.el-select-dropdown {
  .el-select-dropdown__item {
    height: auto !important;
    line-height: 1.2 !important;
    padding: 10px;
    .flex-row > * {
      margin: initial;
    }
    .account-img {
      width: 40px;
      border-radius: 50%;
      margin-right: 8px;
    }

    .account-info {
      display: flex;
      flex: 1;
      justify-content: center;
      flex-direction: column;
      // align-items: center;
      margin-right: 10px;
    }
    .account-fans {
      flex: initial;
      width: 80px;
    }
    .account-text1 {
      font-size: 14px;
    }
    .account-text2 {
      font-size: 12px;
      margin-top: 6px;
    }
    .account-name {
      font-weight: bold;
      width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
::v-deep {
  .business-line {
    .el-form-item__label {
      display: flex;
    }
  }
}
</style>
