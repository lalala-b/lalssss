<template>
  <el-dialog
    class="P-advertisingLaunchDialog"
    width="690px"
    :title="dialogTitle"
    :visible.sync="show"
    @close="onCancel"
  >
    <div class="add-form">
      <el-form
        ref="addForm"
        label-width="120px"
        :model="addForm"
        :rules="addFormRules"
      >
        <!-- <template v-if="isEdit || from === 'recommend'">
          <el-form-item label="平台名称" prop="platType">
            {{ addForm.platName || accountInfo.platName }}
          </el-form-item>
          <el-form-item class="mr90">
            <img :src="addForm.accountImg || accountInfo.accountImg" style="width: 100px;" alt="">
            <p>{{ addForm.accountName || accountInfo.accountName }}</p>
          </el-form-item>
        </template> -->

        <template v-if="isEdit || from === 'recommend'">
          <el-form-item label="账号信息" prop="platType">
            <AccountCard :info="addForm" :show-tags="false">
              <!-- <span class="account-id">{{ addForm.platName }}号{{ addForm.uniqueId || addForm.eid || addForm.getDataUrl }}</span> -->
            </AccountCard>
          </el-form-item>
        </template>

        <template v-else>
          <el-form-item v-if="!isEdit" label="平台名称" prop="platId">
            <el-select
              v-model="addForm.platId"
              :disabled="addForm.accountId != ''"
              @change="handlePlatType"
            >
              <el-option
                v-for="item in platInfo"
                :key="item.plat_id"
                :value="item.plat_id"
                :label="item.plat_name"
              />
            </el-select>
            <div v-if="addForm.platId" class="plat-info flex flex-align-center">
              <img :src="platMap[addForm.platId].plat_logo" class="m-r-5" alt>账号授权,请输入平台下分享出来的链接
            </div>
          </el-form-item>
          <el-form-item v-if="userInfo" class="mr90">
            <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
            <p>{{ userInfo.user_name }}</p>
          </el-form-item>

          <el-form-item v-if="addForm.platId === 25 || addForm.platId === 26" label="账号检索">
            <el-select
              v-model="addForm.eid"
              class="account-search"
              filterable
              remote
              reserve-keyword
              placeholder="请输入关键词"
              :remote-method="remoteMethod"
              :loading="accountLoading"
              :popper-append-to-body="false"
              no-data-text="暂无结果，请在下方粘贴URL链接授权添加"
              style="width: 100%;"
              @change="handleAccountChange"
            >
              <el-option v-for="(item) in accountList" :key="item.user_id" :label="item.user_name" :value="item.eid">
                <div class="flex">
                  <img class="account-img" :src="item.avatar_uri" alt="">
                  <div class="account-info flex flex-dir-col flex1 flex-justify-center">
                    <p class="account-text1 account-name">{{ item.user_name }}</p>
                    <p class="account-text2">ID:{{ item.eid }}</p>
                  </div>
                  <div class="account-info account-fans flex flex-dir-col flex-justify-center">
                    <p class="account-text1">粉丝量</p>
                    <p class="account-text2">{{ item.fans_num | toThousandsW }}</p>
                  </div>
                </div>
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="URL" prop="userUrl">
            <div class="flex">
              <el-input v-model="addForm.userUrl" autocomplete="off" @change="handleUserUrl" />
              <el-button :loading="empowerLoading" :disabled="empowerDisabled" size="small" style="margin-left: 10px;" @click="empower">授权</el-button>
            </div>
          </el-form-item>
        </template>

        <el-form-item label="达人类型" prop="inputTags">
          <template v-if="addForm.sysAccountTag">
            <el-tag
              v-for="tag in addForm.sysAccountTag.split(',')"
              :key="tag"
              class="m-r-5"
              size="small"
              @close="handleClose(tag)"
            >{{ tag }}</el-tag>
          </template>
          <el-tag
            v-for="tag in addForm.inputTags"
            :key="tag"
            closable
            class="m-r-5"
            size="small"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-select
            ref="tag"
            v-model="tagInputValue"
            size="small"
            filterable
            clearable
            allow-create
            default-first-option
            class="input-new-tag"
            placeholder="限长4个字符(仅中英文)"
            @change="handleAddTag"
          >
            <el-option
              v-for="item in tagList"
              :key="item"
              :value="item"
              :label="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="达人等级" prop="mechanismLevel">
          <el-select
            v-model="addForm.mechanismLevel"
            filterable
            clearable
          >
            <el-option
              v-for="item in talentLevelList"
              :key="item.levelId"
              :value="item.levelId"
              :label="item.levelName"
            />
          </el-select>
        </el-form-item>
        <el-row>
          <el-col :span="24">
            <el-form-item label="省市地址">
              <el-input v-model="addForm.provNameAndCityName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="21-60s报价" prop="quotePrice">
              <el-input-number
                v-model="addForm.quotePrice"
                :min="0"
                :max="9999999999"
                :precision="0"
              />
              <IconTip
                content="抖音账号数据来源为星图平台，系统每月自动更新一次（每月第二日），可能存在一定偏差，支持编辑校准。其他平台数据以用户编辑数值为准。"
                icon-class="iconwenhao"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="返点" prop="rebate">
              <el-input-number
                v-model="addForm.rebate"
                :max="100"
                :min="0"
              /> %
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="所属供应商" prop="mechanismId">
              <VSelect
                v-model="addForm.mechanismId"
                :config="belongs"
                @sChange="getUserIdByMeduimOrgId"
              />
              <el-button type="primary" size="small" @click="handleAddMediuOrg">新增媒介供应商</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号对接人" prop="accountContacts">
              <div class="flex">
                <el-input
                  v-model.trim="addForm.accountContacts"
                  maxlength="15"
                  placeholder="请输入账号联系人"
                  @input="addForm.accountContacts = arguments[0].replace(/[^\u0391-\uFFE5A-Za-z]/g, '')"
                />
                <IconTip
                  content="账号联系人"
                  icon-class="iconwenhao"
                />

              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input
                v-model.trim="addForm.phone"
                maxlength="20"
                placeholder="请输入账号联系方式"
                @input="addForm.phone = arguments[0].replace(/[^0-9A-Za-z]/g, '')"
              />
            </el-form-item>
          </el-col>
          <el-col v-if="isEdit" :span="12">
            <el-form-item label="媒介采买人" prop="meetUserId">
              <el-select v-model="addForm.meetUserId" filterable clearable>
                <el-option
                  v-for="item in userList"
                  :key="item.userId"
                  :value="item.userId"
                  :disabled="item.disabled"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="addForm.remark" type="textarea" maxlength="100" row="8" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </div>
    <AddMediumOrg
      v-if="showAddMeduiuDialog"
      v-model="showAddMeduiuDialog"
    />
  </el-dialog>
</template>
<script>
import request from '@/http'
import { PYTHON_HOST as HOST } from '@/const'
import { $getUserAccount, $getBaseInfo } from '@/api/account-manage'
import { $getUserIdByMeduimOrgId, $addMedAccount, $editMedAccount, $getIntermediaryCondition, $getEditDetail, $addMedRecommendAccount } from '@/api/bussiness-manage'
import { copy } from '@/utils'
import VSelect from '@/components/Select'
import AddMediumOrg from '../../_pages/medium-org-manage/AddMediumOrg.vue'
import { IconTip, AccountCard } from 'components'
export default {
  components: {
    VSelect,
    AddMediumOrg,
    IconTip,
    AccountCard
  },
  props: {
    accountId: {
      type: Number,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    userList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Boolean,
      default: false
    },
    from: {
      type: String,
      default: ''
    },
    accountInfo: {
      type: Object,
      default() {
        return {
          platName: '',
          accountImg: '',
          accountName: ''
        }
      }
    }
  },
  data() {
    const validateTag = (rule, value, callback) => {
      if (!value || value.length === 0 && !this.addForm.sysAccountTag) {
        callback(new Error('请添加达人类型'))
      } else {
        callback()
      }
    }
    return {
      talentLevelList: [
        {
          levelId: 'S级',
          levelName: 'S级'
        },
        {
          levelId: 'A级',
          levelName: 'A级'
        },
        {
          levelId: 'B级',
          levelName: 'B级'
        },
        {
          levelId: 'C级',
          levelName: 'C级'
        },
        {
          levelId: 'D级',
          levelName: 'D级'
        }
      ],
      addFormRules: {
        platId: [{ required: true, message: '请选择平台', trigger: 'change' }],
        userUrl: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        provNameAndCityName: [{ required: true, message: '请输入省区地址', trigger: 'blur' }],
        eid: [{ required: true, message: '请选择账号', trigger: 'blur' }],
        inputTags: [{ required: true, validator: validateTag, trigger: 'change' }],
        provId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        mechanismId: [{ required: true, message: '请选择所属供应商', trigger: 'change' }],
        accountContacts: [{ required: true, message: '请输入账号对接人', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        // remark: [{ required: true, message: '请输入备注', trigger: 'blur' }],
        quotePrice: [{ required: true, message: '请输入60s星图报价', trigger: 'blur' }],
        rebate: [{ required: true, message: '请输入返点', trigger: 'blur' }],
        meetUserId: [{ required: true, message: '请选择媒介采买人', trigger: 'change' }],
        mechanismLevel: [{ required: true, message: '请选择达人类型', trigger: 'change' }]
      },
      tagInputValue: '',
      addForm: {
        searchType: '1',
        accountId: '',
        platId: '',
        tagValue: '',
        mechanismId: '',
        userUrl: '',
        provNameAndCityName: '',
        meetUserId: '',
        phone: '',
        remark: '',
        rebate: '',
        accountContacts: '',
        quotePrice: '',
        inputTags: [],
        mechanismLevel: ''
      },
      platMap: {},
      platInfo: [],
      accountList: [],
      tagList: [],
      userInfo: null,
      empowerDisabled: false,
      accountLoading: false,
      empowerLoading: false,
      showAddMeduiuDialog: false,
      belongs: {
        conf: {
          placeholder: '所属供应商',
          filterable: true
        },
        optionLabelKey: 'mcnName',
        optionValKey: 'id',
        data: []
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑' : '添加'
    },
    show: {
      get() {
        return this.value
      },
      set(val) {
        console.log(val)
        this.$emit('input', val)
      }
    }
  },
  created() {
    if (this.isEdit) {
      this.getAccountDetail()
    }
    if (!this.isEdit || !this.accountId) {
      this.getPlatList()
    }
    this.getCondition()
    this.$bus.$on('updateMediumOrg', this.getCondition)
  },
  beforeDestroy() {
    this.$bus.$off('updateMediumOrg')
  },
  methods: {
    limitTag() {
      // const tag = this.$refs.tag
      // tag.query = tag.previousQuery = tag.selectedLabel = tag.selectedLabel.replace(/[^\u4E00-\u9FA5A-Za-z]/g, '')
      // if (tag.selectedLabel.length >= 4) {
      //   tag.previousQuery = tag.query = tag.selectedLabel = tag.selectedLabel.slice(0, 4)
      // }
      // this.$nextTick(() => {
      //   this.tagInputValue = tag.query
      // })
    },
    getAccountDetail() {
      const accountId = this.accountId
      $getEditDetail({ accountId }).then(res => {
        if (res.code === 1) {
          if (res.data.tagValue) {
            this.addForm.inputTags = res.data.tagValue.split(',')
          }
          let hasRepeat = false
          for (let index = 0; index < this.userList.length; index++) {
            const element = this.userList[index]
            if (element.userId === res.data.meetUserId) {
              hasRepeat = true
              break
            }
          }

          if (!hasRepeat) {
            this.userList.push({
              userId: res.data.meetUserId,
              realname: res.data.realName,
              disabled: true
            })
          }
          this.addForm = Object.assign(this.addForm, res.data, { accountId })
          // this.addForm.mechanismId = Number(this.addForm.mechanismId)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getCondition() {
      $getIntermediaryCondition().then(res => {
        if (res.code === 1) {
          this.tagList = res.data.tagValues
          this.belongs.data = res.data.belongs
        }
      })
    },
    onCancel() {
      this.show = false
    },
    handleUserUrl() {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.empowerDisabled = false
    },
    handleAddTag(val) {
      // return
      if (val.length > 4 || /[^\u4E00-\u9FA5A-Za-z]/g.test(val)) {
        this.$message.info('限长4个字符(仅中英文)')
        this.$refs.addForm.validateField('inputTags')
        this.tagInputValue = ''
        return
      }
      if (this.addForm.inputTags.indexOf(val) === -1) {
        this.addForm.inputTags.push(val)
      }
      this.$refs.addForm.validateField('inputTags')
      this.tagInputValue = ''
    },
    // 删除达人类型
    handleClose(tag) {
      this.addForm.inputTags.splice(this.addForm.inputTags.indexOf(tag), 1)
      this.$refs.addForm.validateField('inputTags')
    },
    handlePlatType(val) {
      this.addForm.userUrl = ''
      this.addForm.eid = ''
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      // console.log(val)
      switch (val) {
          case 25:
            this.hasAccount = false
            this.addForm.searchType = '1'
            break
          default:
            this.hasAccount = true
            this.addForm.searchType = '2'
      }
    },
    getPlatList() {
      $getUserAccount({ account_type: 4 }).then(res => {
        if (res.code === 1) {
          this.platMap = res.data.reduce((t, n) => {
            t[n.plat_id] = n
            return t
          }, {})
          this.platInfo = res.data
        } else {
          this.$message.error(res.message)
        }
      })
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
      this.addForm.eid = data.eid
      this.addForm.userUrl = data.index_url
      // this.$refs.addForm
      this.$refs.addForm.validateField('eid')
      this.$refs.addForm.validateField('userUrl')
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
    },

    /**
     * 授权
    */
    async empower() {
      const platId = this.addForm.platId
      if (!platId) {
        this.$message.error('请选择平台')
        return
      }
      this.empowerLoading = true
      const { platMap } = this
      const row = platMap[this.addForm.platId]
      let type = ''
      this.userInfo = null // 清空用户信息
      const params = { index_url: this.addForm.userUrl, realname: this.realname }
      try {
        const res = await request.get(`${HOST}${row.api1}`, { params: params })
        type = res.code === 1 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type
        })
        if (res.code === 1) {
          this.userInfo = res.data
        }
      } catch (err) {
        this.$message.error({
          message: err.msg
        })
      }
      this.empowerLoading = false
    },

    getUserIdByMeduimOrgId(val) {
      if (!this.isEdit) return
      $getUserIdByMeduimOrgId({ mechanismId: val }).then(res => {
        if (res.code === 1) {
          this.addForm.meetUserId = res.data
        }
      })
    },

    dialogConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          const params = copy(this.addForm)
          params.tagValue = this.addForm.inputTags.join(',')
          if (this.isEdit) {
            // 编辑
            this.editAccount(params)
          } else {
            params.userId = params.eid
            this.addAccount(params)
          }
        }
      })
    },
    editAccount(params) {
      params.accountType = 5
      delete params.accountLoginUrl
      $editMedAccount(params).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.message || '编辑成功')
          // this.showDialog = false
          this.onCancel()
          this.$emit('update')
          this.$bus.$emit('upLog', { accountId: params.accountId, operation_module: '编辑确定' })
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 新增媒介账号
    addAccount(params) {
      let $api = $addMedAccount
      if (this.from === 'recommend') {
        // 媒介推荐账号添加
        $api = $addMedRecommendAccount
        params.accountId = this.accountId
      } else {
        if (!this.userInfo) {
          this.$message.error('请授权账号')
        }
        const { platMap } = this
        const row = platMap[this.addForm.platId]
        params.accountType = 5
        params.thirdUserId = this.userInfo.user_id
        params.accountLoginUrl = this.userInfo.index_url
        const pattern = /_([a-z])/gi
        for (const key in this.userInfo) {
          const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
          params[k] = this.userInfo[key]
        }
        params.platName = row.plat_name
      }
      $api(params).then((res) => {
        if (res.code === 1) {
          this.$message.success(res.message || '编辑成功')
          // this.showDialog = false
          this.onCancel()
          this.$emit('update')
          this.$bus.$emit('upLog', { operation_module: '添加确定' })
        } else {
          this.$message.error(res.message)
        }
      })
    },

    handleAddMediuOrg() {
      this.showAddMeduiuDialog = true
    }
  }
}
</script>

<style lang="scss" scoped>
  .plat-info {
    margin-top: 10px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .input-new-tag {
    width: 200px;
  }
  .account-img {
    width: 40px;
    border-radius: 50%;
    margin-right: 8px;
  }
  .account-name {
    font-weight: 700;
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .account-text1 {
    font-size: 14px;
    line-height: 1.2;
  }
  .account-text2 {
    line-height: 1.2;
    font-size: 12px;
    margin-top: 6px;
  }
  ::v-deep {
    .el-select-dropdown__item {
      padding: 10px 20px;
    }
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
</style>
