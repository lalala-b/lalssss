<template>
  <el-dialog
    class="M-benchmarkAuthDialog"
    title="添加对标账号"
    :visible="status"
    @close="onDialogCancel()"
  >
    <el-form ref="auth" :model="model" :rules="rules" :label-width="formLabelWidth">
      <div class="M-benchmarkAuthDialogRows">
        <el-form-item label="平台名称" required>
          <el-select
            v-model="model.platType"
            placeholder="请选择平台"
            @change="handlePlatType"
          >
            <el-option
              v-for="item in platInfo"
              :key="item.plat_id"
              :label="item.plat_name"
              :value="item.plat_id + '-' + item.plat_name"
            />
          </el-select>
        </el-form-item>
        <div v-if="platType" class="M-benchmarkAuthDialogInfo">
          <dl>
            <dt><img :src="platMap[platType].plat_logo"></dt>
            <dd>
              <p
                v-log="{ operation_module: '添加对标账号-账号授权'}"
                class="tp"
              > 账号授权</p>
              <p>{{ PLAT_MODE_TIP[platMap[platType].add_mode] }}</p>
            </dd>
          </dl>
        </div>

        <el-form-item v-if="userInfo" class="mr90">
          <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
          <p>{{ userInfo.user_name }}</p>
        </el-form-item>

        <template v-if="platType">
          <!-- <el-form-item label="搜索类型">
            <el-radio-group v-model="model.searchType" size="small" @change="handleSearchType">
              <el-radio-button label="1" :disabled="hasAccount">搜索</el-radio-button>
              <el-radio-button label="2">URL</el-radio-button>
            </el-radio-group>
          </el-form-item> -->

          <el-form-item v-if="showSearch" label="账号检索">
            <el-select
              v-model="model.accountId"
              class="account-search"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="accountLoading"
              :popper-append-to-body="false"
              no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
              @change="handleAccountChange"
            >
              <el-option v-for="(item) in accountList" :key="item.user_id" :label="item.user_name" :value="item.eid">
                <flex-row>
                  <img class="account-img" :src="item.avatar_uri" alt="">
                  <div class="account-info">
                    <p class="account-text1 account-name">{{ item.user_name }}</p>
                    <p class="account-text2">ID:{{ item.eid }}</p>
                  </div>
                  <div class="account-info account-fans">
                    <p class="account-text1">粉丝量</p>
                    <p class="account-text2">{{ item.fans_num | toThousandsW }}</p>
                  </div>
                </flex-row>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="URL" prop="user_url">
            <div class="flex">
              <el-input v-model="model.user_url" autocomplete="off" @change="handleChangeUrl" />
              <el-button :loading="empowerLoading" :disabled="empowerDisabled" size="small" style="margin-left: 10px;" @click="onEmpower">授权</el-button>
            </div>
          </el-form-item>
        </template>

        <el-form-item v-if="platType" label="账号标签:">
          <el-tag
            v-for="tag in tags"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            v-show="tags.length < MAX_TAG"
            v-model="inputTag"
            class="input-new-tag"
            size="small"
            placeholder="输入标签"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <p>输入标签名称，按 回车键 生成标签</p>
        </el-form-item>
      </div>
    </el-form>

    <div v-if="platType" class="M-benchmarkAuthDialogFns">
      <el-button @click="onDialogCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onDialogConfirm">确定</el-button>
    </div>
    <Notice v-if="platType" />
  </el-dialog>

</template>
<script>
import { mapGetters } from 'vuex'
import './auth.scss'
import { Notice } from 'components'
import { $getUserAccount, $postAccountPutting, $getBaseInfo } from '@/api/account-manage'
import request from '@/http'

import { PYTHON_HOST as HOST } from '@/const'

const DEF_AUTH_MODEL = {
  user_id: '',
  belong_name: '',
  platName: '',
  note: '',
  platType: '',
  user_url: '',
  searchType: '1',
  accountId: ''
}

const PLAT_MODE_TIP = {
  1: '请点击授权使用客户端扫码',
  2: '请填写以下信息',
  3: '请填写以下信息',
  4: '请输入平台下分享出来的链接'
}

// 最多添加的 tag 数量
const MAX_TAG = 6

export default {
  components: { Notice },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    userid: {
      type: Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      model: {
        ...DEF_AUTH_MODEL
      },
      accountList: [],
      formLabelWidth: '88px',
      platInfo: [],
      platMap: {},
      PLAT_MODE_TIP,
      empowerLoading: false,
      userInfo: null,
      searchData: null,
      // 表单验证规则
      rules: {
        user_url: {
          required: true, 'message': 'URL 不能为空', 'trigger': 'blur'
        }
      },
      loading: false,
      accountLoading: false,
      hasAccount: false,
      tags: [],
      inputTag: '',
      MAX_TAG,
      empowerDisabled: false
    }
  },
  computed: {
    platType() {
      // console.log(this.model.platType, '--this.model.platType')
      return this.model.platType ? this.model.platType.split('-')[0] : ''
    },
    platName() {
      return this.model.platType ? this.model.platType.split('-')[1] : ''
    },
    showSearch() {
      return this.model.platType === '25-抖音' || this.model.platType === '26-快手'
    },
    ...mapGetters([
      'realname'
    ])
  },
  watch: {
    status(nVal, oVal) {
      if (nVal === true) {
        this.getPlats()
          .then(re => {
            if (re) {
              Object.keys(DEF_AUTH_MODEL).forEach(key => {
                let val
                if (key === 'user_id') {
                  val = this.userid || this.user.muid
                } else {
                  val = ''
                }
                this.model[key] = val
              })
            }
          })
      }
    }
  },
  created() {
    this.getPlats()
  },
  methods: {
    handleChangeUrl() {
      this.userInfo = null
      this.accountList = []
      this.model.accountId = ''
      this.empowerDisabled = false
      this.validateField('user_url')
    },
    handleSearchType(val) {
      this.userInfo = null
      this.model.accountId = ''
      this.accountList = []
      switch (val) {
          case '1':
            this.model.user_url = ''
            break
          case '2':
            this.model.accountId = ''
            break
      }
    },
    handlePlatType(val) {
      this.model.user_url = ''
      this.model.accountId = ''
      this.userInfo = null
      this.accountList = []
      // switch (val) {
      //     case '25-抖音':
      //       this.hasAccount = false
      //       this.model.searchType = '1'
      //       break
      //     default:
      //       this.hasAccount = true
      //       this.model.searchType = '2'
      // }
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
      this.model.user_url = data.index_url
    },
    remoteMethod(query) {
      if (query !== '') {
        this.accountLoading = true
        this.getBaseInfo(query)
      } else {
        this.accountList = []
      }
    },
    onEmpower() {
      this.empower()
    },
    async getBaseInfo(keyword) {
      const res = await $getBaseInfo({
        keyword,
        platId: this.model.platType.split('-')[0]
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
      this.accountLoading = false
    },
    /**
     * 授权
     */
    async empower() {
      if (this.empowerLoading) {
        return
      }
      const contentParams = {
        realname: this.realname
      }
      this.empowerLoading = true
      const { platMap } = this
      const row = platMap[this.platType]
      let type = ''
      this.userInfo = null // 清空用户信息
      const params = { index_url: this.model.user_url, ...contentParams }
      const res = await request.get(`${HOST}${row.api1}`, { params: params })
      type = res.code === 1 ? 'success' : 'error'
      this.$message({
        message: res.msg,
        type
      })
      if (res.code === 1) {
        this.userInfo = res.data
      }
      this.empowerLoading = false
    },

    /**
     * 获取支持的平台
     * @return {Object}  Promise 对象
     */
    getPlats() {
      return $getUserAccount({
        account_type: 2
      })
        .then(re => {
          if (re.code === 1) {
            const { platMap } = this
            re.data.forEach(t => {
              this.$set(platMap, t.plat_id, t)
            })
            this.platInfo = re.data
            return true
          }
          return false
        })
    },
    /**
     * 浮层取消响应函数
     */
    onDialogCancel() {
      if (this.$req) {
        try {
          this.$req.abort()
        } catch (e) {
          console.error(e)
        }
        this.$req = null
      }
      this.model = { ...DEF_AUTH_MODEL }
      // this.platType = null
      this.tags = []
      this.inputTag = ''
      this.$emit('close')
      this.$emit('update:status', false)
    },
    /**
     * 浮层确认响应函数
     * @param  {String} type 取消类型
     */
    async onDialogConfirm(type, pass) {
      if (!this.userInfo) {
        this.$message.error('请授权之后再试')
        return
      }
      this.$refs.auth.validate(valid => {
        if (valid) {
          const params = this.model
          params.tagValue = this.tags.join()
          params.avatarUri = this.userInfo.avatar_uri
          params.userName = this.userInfo.userName
          params.note = this.userInfo.note
          params.eid = this.userInfo.eid
          params.secUid = this.userInfo.sec_uid
          params.thirdUserId = this.userInfo.user_id
          params.accountLoginUrl = this.userInfo.index_url
          this.addAccount(params)
        }
      })

      // var form = this.$refs.auth

      // // 再做一次表单验证
      // var validateResult
      // try {
      //   validateResult = await form.validate()
      // } catch (e) {
      //   validateResult = false
      // }
      // if (!validateResult) {
      //   return
      // }
      // var data = copy(this.model)
      // data.note = this.tags.join(',')
      // data.platId = this.platType.val
      // var re = await this.addAccount(data)
    },
    formatParams(params) {
      if (params.platType) {
        const platSplit = params.platType.split('-')
        params.platId = platSplit[0]
        params.platName = platSplit[1]
      }
    },
    addAccount(params) {
      if (this.loading) {
        return false
      }
      this.loading = true
      this.formatParams(params)
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
        params[k] = this.userInfo[key]
      }
      params.thirdUserId = this.userInfo.user_id
      $postAccountPutting(params).then(res => {
        if (res.code === 1) {
          this.$message.success('添加成功')
          this.$emit('close')
          this.$emit('update:status', false)
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    },
    /**
     * 添加文章账号
     * @param  {Object}  data  请求参数
     * @return {Object}  Promise 对象
     */
    // addAccount(data) {
    //   if (this.loading) {
    //     return false
    //   }
    //   this.loading = true
    //   var way = this.platType._defWay
    //   var url = this.getReqUrl(this.platType.monitor_url)
    //   url = url[0]

    //   this.$req = this.$request({
    //     url,
    //     'method': 'post',
    //     data,
    //     'raw': true
    //   })
    //     .then(
    //       re => {
    //         this.loading = false
    //         this.$tip(re.msg || '添加成功', 'success')
    //         this.$req = null
    //         this.$emit('auth:add', true)
    //         return true
    //       }
    //       , err => {
    //         this.loading = false
    //         this.$req = null
    //         this.$emit('auth:add', false)
    //         return false
    //       }
    //     )
    //     .catch(err => {
    //       this.loading = false
    //       this.$req = null
    //       this.$emit('auth:add', false)
    //       console.error(err)
    //     })
    //   return this.$req
    // },
    // 删除标签
    handleClose(tag) {
      this.tags.splice(
        this.tags.indexOf(tag), 1
      )
    },
    validateField(props) {
      this.$refs.auth.validateField(props)
    },
    // 确认标签输入
    handleInputConfirm() {
      if (this.tags.length > MAX_TAG) {
        this.$tip(`最多只能添加 ${MAX_TAG} 个标签`)
        return
      }
      var inputTag = this.inputTag
      if (inputTag && this.tags.indexOf(inputTag) === -1) {
        this.tags.push(inputTag)
      }
      this.inputTag = ''
    }
  }
}
</script>
<style lang="scss">
  .M-benchmarkAuthDialog {
    .flex {
      display: flex;
    }
    .account-search {
      width: 100%;
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
    }
  }
  // }
</style>
