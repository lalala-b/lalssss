<template>
  <el-dialog
    v-if="value"
    class="P-advertisingLaunchDialog"
    width="50%"
    :title="from==='newDylibrary'?'绑定账号':editType === 'edit' ? '编辑' : '新增'"
    :visible="value"
    @close="onCancel"
  >
    <div v-loading="loading" class="add-form">
      <p v-if="isAffirm" class="color-danger">请确认账号信息是否准确，若相关信息有变动请修正</p>
      <el-form ref="addForm" label-width="120px" :model="addForm" :rules="addFormRules">
        <el-form-item v-if="editType === 'add' && !addbackfill" label="平台名称" prop="platType">
          <el-select
            v-model="addForm.platType"
            :disabled="editType === 'edit'"
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
            <img :src="platMap[platType].plat_logo" alt>账号授权,请输入平台下分享出来的链接
          </div>
        </el-form-item>
        <el-form-item v-else label="账号信息">
          <AccountCard :info="addForm" :show-tags="false">
            <div class="account-id">{{ addForm.platName }}号：{{ addForm.uniqueId || addForm.eid || addForm.getDataUrl || '--' }}</div>
          </AccountCard>
        </el-form-item>
        <!-- <el-form-item v-else label="平台名称" prop="platType">
          {{ addForm.platName }}
        </el-form-item> -->
        <el-form-item v-if="userInfo" class="mr90">
          <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
          <p>{{ userInfo.user_name }}</p>
        </el-form-item>

        <!-- <el-form-item v-else-if="editType === 'edit'" class="mr90">
          <img :src="addForm.accountImg" style="width: 100px;" alt="">
          <p>{{ addForm.accountName }}</p>
        </el-form-item> -->

        <!-- <el-form-item label="搜索类型" v-if="editType !== 'edit'">
          <el-radio-group v-model="addForm.searchType" size="small" @change="handleSearchType">
            <el-radio-button label="1" :disabled="hasAccount">搜索</el-radio-button>
            <el-radio-button label="2">URL</el-radio-button>
          </el-radio-group>
        </el-form-item> -->

        <el-form-item v-if="editType !== 'edit' && !addbackfill && (addForm.platType === '25-抖音' || addForm.platType === '26-快手')" label="账号检索">
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
            style="width: 100%;"
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

        <el-form-item v-if="editType !== 'edit' && !addbackfill" label="URL" prop="accountLoginUrl">
          <div class="flex">
            <el-input v-model="addForm.accountLoginUrl" autocomplete="off" @change="handleUserUrl" />
            <el-button :loading="empowerLoading" :disabled="empowerDisabled" size="small" style="margin-left: 10px;" @click="onEmpower">授权</el-button>
          </div>
        </el-form-item>

        <el-form-item prop="inputTags" label="达人类型">
          <template v-if="editData && addForm.sysAccountTag">
            <el-tag
              v-for="tag in addForm.sysAccountTag.split(',')"
              :key="tag"
              :disable-transitions="false"
              class="m-r-10"
              size="small"
            >{{ tag }}</el-tag>
          </template>

          <el-tag
            v-for="tag in inputTags"
            :key="tag"
            :closable="!isBlockAccount"
            :disable-transitions="false"
            class="m-r-10"
            size="small"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model.trim="inputValue"
            class="input-new-tag"
            size="small"
            maxlength="4"
            placeholder="限长4个字符(仅中英文)"
            @keyup.native="inputValue=inputValue.replace(/[^\u4E00-\u9FA5A-Za-z]/g, '')"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 达人类型</el-button>
        </el-form-item>
        <el-row>

          <!-- <el-col v-if="showMeetUser" :span="12">
            <el-form-item label="对接人" prop="meetUserId">
              <el-select v-model="addForm.meetUserId" filterable clearable :disabled="!editData.seeAndEditContactAuth">
                <el-option
                  v-for="item in meetUserData"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row v-if="showMeetUser">
          <el-col :span="8">
            <el-form-item label="C2B对接人">

              <!-- isAdvertiserUserFlag:广告师标志,true:是 false:否 -->
              <!-- 对接人存在则不可清空， editC2bOppositeUserIdFlag判断是否为军长或者本人-->
              <el-select v-model="addForm.c2bOppositeUserId" filterable :clearable="c2bOppositeUserId?false:true" :disabled="!addForm.editC2bOppositeUserIdFlag">
                <el-option
                  v-for="item in meetUserData"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="B2C对接人">
              <el-select v-model="addForm.b2cOppositeUserId" filterable :clearable="b2cOppositeUserId?false:true" :disabled="!addForm.editB2cOppositeUserIdFlag">
                <el-option
                  v-for="item in meetUserData"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="C2C对接人">
              <el-select v-model="addForm.c2cOppositeUserId" filterable :clearable="c2cOppositeUserId?false:true" :disabled="!addForm.editC2cOppositeUserIdFlag">
                <el-option
                  v-for="item in meetUserData"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="星图报价" prop="xingtuPrice">
              <el-input-number
                v-model="addForm.xingtuPrice"
                :min="0"
                :precision="0"
                @input.native="limitQuotePriceLen"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属机构" prop="belongTeam">
              <el-select
                v-model="addForm.belongTeam"
                :disabled="disabledTeam"
                placeholder="所属机构"
                clearable
                filterable
                allow-create
                :filter-method="belongTeamSearch"
              >
                <el-option
                  v-for="item in mcnList"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="联系方式" prop="phone">
              <el-input v-model.trim="addForm.phone" />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phone">
              <div slot="label">
                手机号码
                <!-- <svg-icon icon-class="shouji" />手机号码 -->
              </div>
              <el-input :value="addForm.phone" maxlength="11" minlength="11" @input="addForm.phone = arguments[0].replace(/\D/g, '')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wechatNumber">
              <div slot="label">
                微信号
                <!-- <svg-icon icon-class="weixin" />微信号 -->
              </div>
              <el-input v-model="addForm.wechatNumber" minlength="6" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ" prop="qqNumber">
              <div slot="label">
                QQ
                <!-- <svg-icon icon-class="QQ" />QQ -->
              </div>
              <el-input :value="addForm.qqNumber" minlength="6" maxlength="50" @input="addForm.qqNumber = arguments[0].replace(/\D/g, '')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <div slot="label">
                <!-- <svg-icon icon-class="youxiang" />邮箱 -->
                邮箱
              </div>
              <el-input v-model.trim="addForm.email" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="座机号码" prop="fixedPhone">
              <div slot="label">
                座机号码
                <!-- <svg-icon icon-class="zuoji" />座机号码 -->
              </div>
              <flex-row>
                <el-input v-model.trim="addForm.fixedPhoneCode" style="width: 100px;" />
                <span>-</span>
                <el-input v-model.trim="addForm.fixedPhoneNumber" />
              </flex-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他" prop="otherContact">
              <div slot="label">
                <!-- <svg-icon icon-class="qita" />其他 -->
                其他
              </div>
              <el-input v-model.trim="addForm.otherContact" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="editType!=='edit'">
          <el-form-item prop="businessLines" class="business-line">
            <div slot="label">
              <IconTip
                type="popover"
                content="根据选择的业务线归属，指定业务线对接人为首次添加账号的人员，和相应对接保护期。【示例】若小明只勾选B2C，那么B2C对接人为小明且B2C对接保护期为3日。C2B对接人、C2B对接保护期、C2C对接人、C2C对接保护期都为空。"
                icon-class="iconwenhao"
              />
              业务线归属
            </div>
            <div class="flex">
              <el-checkbox-group v-model="addForm.businessLines">
                <el-checkbox label="C2B" />
                <el-checkbox label="B2C" />
                <el-checkbox label="C2C" />
              </el-checkbox-group>
            </div>
          </el-form-item>
          <p v-if="from==='newDylibrary'" class="red-tip">备注：新增账号后，创建人自动绑定该账号</p>
        </el-row>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button :loading="addLoading" type="primary" @click="onSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { $putAccountPutting, $postAccountPutting, $getRequirementAccountInfo, $getMcnName } from '@/api/bussiness-manage'
import { $getFundUsers } from '@/api/putting-manager'
import { $getUserAccount, $getBaseInfo, $getMatchingMcnName } from '@/api/account-manage'
import request from '@/http'
import flexRow from '@/components/public/flex-row/flex-row.vue'

import { PYTHON_HOST as HOST } from '@/const'
import { mapGetters } from 'vuex'
import { AccountCard, IconTip } from 'components'
import { lego } from '@zz-common/lego'
export default {
  components: { flexRow, AccountCard, IconTip },
  props: {
    isAffirm: {
      type: Boolean,
      default: false
    },
    editType: {
      type: String,
      default: ''
    },
    addbackfill: {
      type: Boolean,
      default: false
    },
    value: Boolean,
    editData: {
      type: Object,
      default: null
    },
    saveInterface: {
      type: Function
    },
    editInterface: {
      type: Function
    },
    from: {
      type: String,
      default: ''
    }
    // meetUserData: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // }
  },
  data() {
    return {
      extFields: {
        belongTeam: { status: false, chnName: '所属机构' },
        phone: { status: false, chnName: '联系方式' }
      },
      showLanchInfo: false,
      platInfo: [],
      addForm: {
        accountId: '',
        userId: '',
        platId: '',
        tagValue: '',
        belongTeam: '',
        phone: '',
        accountLoginUrl: '',
        meetUserId: '',
        xingtuPrice: '',
        addressName: '',
        addressPhone: '',
        provId: '',
        cityId: '',
        areaId: '',
        detailAddress: '',
        canEdit: undefined,
        searchType: '1',
        qqNumber: '',
        email: '',
        otherContact: '',
        fixedPhoneCode: '',
        fixedPhoneNumber: '',
        wechatNumber: '',
        meetUserData: [],
        businessLines: []
      },
      addFormRules: {
        platId: [{ required: true, message: '请选择平台', trigger: 'blur' }],
        accountLoginUrl: [{ required: true, message: '请输入链接', trigger: 'blur' }],
        businessLines: [{ required: true, validator: (rule, value, cb) => {
          return cb()
        }, trigger: ['blur', 'change'] }],
        // belongTeam: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        phone: [{ validator: (rule, value, cb) => {
          if (value && value.trim().length < 11) {
            return cb(new Error('请输入正确的手机号码'))
          }
          return cb()
        }, trigger: 'blur' }],
        wechatNumber: [{ validator: (rule, value, cb) => {
          if (value && value.trim().length < 6) {
            return cb(new Error('请输入正确的微信号'))
          }
          return cb()
        }, trigger: 'blur' }],
        qqNumber: [{ validator: (rule, value, cb) => {
          if (value && value.trim().length < 6) {
            return cb(new Error('请输入正确的QQ号'))
          }
          return cb()
        }, trigger: 'blur' }],
        email: [{ validator: (rule, value, cb) => {
          if (value) {
            var myreg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!myreg.test(value)) {
              return cb(new Error('请输入正确的邮箱'))
            }
          }
          return cb()
        }, trigger: 'blur' }],
        fixedPhone: [{ validator: (rule, value, cb) => {
          const { fixedPhoneCode, fixedPhoneNumber } = this.addForm
          if (fixedPhoneCode || fixedPhoneNumber) {
            if (fixedPhoneCode.trim().length < 4) {
              return cb(new Error('请输入正确的座机号'))
            }
            if (fixedPhoneNumber.trim().length < 7) {
              return cb(new Error('请输入正确的座机号'))
            }
          }
          return cb()
        }, trigger: 'blur' }]
        // inputTags: [{ required: true, validator: (rule, value, cb) => {
        //   if (this.inputTags.length === 0 && this.editData && !this.editData.sysAccountTag) {
        //     cb(new Error('请输入达人类型'))
        //   } else {
        //     return cb()
        //   }
        // }, trigger: 'change' }],
        // meetUserId: [{ required: true, message: '请选择对接人', trigger: 'change' }],
      },
      formConf: {},
      // searchData: { ...SEARCH_QUERY_DATA_MODEL },
      inputVisible: false,
      inputValue: '',
      inputTags: [],
      optionsData: {
        userList: []
      },
      orderItem: {
        platName: '',
        accountName: '',
        accountId: '',
        platId: ''
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
      hasMailDialog: false,
      empowerDisabled: false,
      // canEditMeet: false,
      disabledTeam: false,
      isBlockAccount: 0,
      c2bOppositeUserId: '',
      b2cOppositeUserId: '',
      c2cOppositeUserId: '',
      meetUserData: []
    }
  },
  computed: {
    ...mapGetters(['id', 'user']),
    showMeetUser() {
      return this.editType === 'edit' && !this.isAffirm
    },
    currentUserId() {
      return this.$store.state.user.userInfo.id
    }
  },
  created() {
    this.getPlatList()
    if (this.editData && this.editType === 'edit') {
      this.getFundUsers()
      this.getAccountInfo()
      this.getMcnName()
    }

    if (this.addbackfill) {
      // this.loading = true
      this.getFundUsers()
      // this.getAccountInfo()
      this.getMcnName()
      this.addForm = {
        ...this.editData,
        phone: '',
        wechatNumber: '',
        qqNumber: '',
        fixedPhoneCode: '',
        fixedPhoneNumber: ''
      }
      // this.inputTags = this.editData.inputTags
    }
  },
  methods: {
    belongTeamSearch(query) {
      if (query) {
        this.mcnList = this._mcnList?.filter(item => item.includes(query))?.splice(0, 300)
      } else {
        this.mcnList = this._mcnList?.splice(0, 300)
      }
    },
    getMcnName() {
      this.mcnList = []
      $getMcnName({ platId: this.addForm.platId || this.editData.platId }).then(res => {
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
    getAccountInfo() {
      this.loading = true
      $getRequirementAccountInfo({
        accountId: this.editData.accountId
      }).then(res => {
        this.loading = false
        if (res.code === 1 && res.data) {
          this.addForm = res.data
          this.c2bOppositeUserId = res.data.c2bOppositeUserId
          this.c2cOppositeUserId = res.data.c2cOppositeUserId
          this.b2cOppositeUserId = res.data.b2cOppositeUserId
          this.inputTags = res.data.tagValue ? res.data.tagValue.split(',') : []
          this.addForm.meetUserId === 0 && (this.addForm.meetUserId = null)
          // if (res.data.meetUserId === this.id || !res.data.meetUserId) {
          //   this.canEditMeet = true
          // }
          this.isBlockAccount = res.data.isBlockAccount
        }
      })
    },
    handleUserUrl() {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      this.empowerDisabled = false
    },
    // 删除达人类型
    handleClose(tag) {
      this.inputTags.splice(this.inputTags.indexOf(tag), 1)
    },
    handleInputConfirm() {
      const inputValue = this.inputValue.replace(/[^\u4E00-\u9FA5A-Za-z]/g, '')
      if (inputValue && !this.inputTags.includes(inputValue)) {
        this.inputTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      if (this.inputTags.length > 0) {
        this.$refs.addForm.clearValidate('inputTags')
      }
    },
    async getPlatList() {
      const res = await $getUserAccount({ account_type: 3 })
      if (res.code === 1) {
        const { platMap } = this
        res.data.forEach(t => {
          this.$set(platMap, t.plat_id, t)
        })
        this.platInfo = res.data
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
      const params = { index_url: this.addForm.accountLoginUrl, realname: this.realname }
      try {
        const res = await request.get(`${HOST}${row.api1}`, { params })
        type = res.code === 1 ? 'success' : 'error'
        this.$message({
          message: res.msg,
          type
        })
        if (res.code === 1) {
          this.userInfo = res.data
          this.getMatchingMcnName({ platId: this.addForm.platId, getDataUrl: this.userInfo.user_id })
        }
      } catch (err) {
        err.msg && this.$message.error({
          message: err.msg
        })
      }
      this.empowerLoading = false
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    onCancel() {
      this.$emit('input', false)
    },
    onSave() {
      // 添加但不回填 校验
      if ((!this.userInfo && this.editType === 'add' && !this.addbackfill)) {
        this.$message.error('请授权之后再试')
        return
      }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (this.editType !== 'edit' && !this.addForm.businessLines.length) {
            this.$message.error('请至少选择1个业务线')
            return
          }
          // if (!(phone || wechatNumber || qqNumber || email || fixedPhone && fixedPhoneCode)) {
          //   this.$message.error('请填写至少一种联系方式：手机号、微信号、QQ号、邮箱、座机号')
          //   return
          // }
          const params = JSON.parse(JSON.stringify(this.addForm))
           if (params.b2cOppositeUserId === this.b2cOppositeUserId) {
            delete params.b2cOppositeUserId
            delete params.b2cOppositeUserName
          }
          if (params.c2cOppositeUserId === this.c2cOppositeUserId) {
            delete params.c2cOppositeUserId
            delete params.c2cOppositeUserName
          }
          if (params.c2bOppositeUserId === this.c2bOppositeUserId) {
            delete params.c2bOppositeUserId
            delete params.c2bOppositeUserName
          }
          params.tagValue = this.inputTags.join(',')
          if (this.editType === 'edit') {
            // 编辑
            // 精准找号,新增
            if (!this.editData.deliveryAccountLibraryFlag && this.from === 'newDylibrary') {
              this.addAccount(params)
            } else {
              this.editAccount(params)
            }
          } else {
            this.addAccount(params)
          }
        }
      })
    },
    formatParams(params) {
      if (params.platType) {
        const platSplit = params.platType.split('-')
        params.platId = platSplit[0]
        params.platName = platSplit[1]
      }
    },
    editAccount(params) {
      this.addLoading = true
      // this.formatParams(params)
      if (this.addForm.canEdit) {
        params.isCourier = 1
      }
      params.isAffirm = this.isAffirm
      // delete params.accountTag

      let api = $putAccountPutting

      if (this.editInterface) {
        api = this.editInterface
      }
      if (this.from === 'newDylibrary') {
        lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          sortId: 12,
          sortName: '绑定账号-编辑-确认触发',
          accountId: `【${this.addForm.platId}】${this.addForm.accountId}`
        }
        })
      }
      api(params).then(res => {
        if (res.code === 1) {
          this.$message.success('编辑成功')
          this.$emit('input', false)
           // 精准找号-埋点区分
          if (this.from === 'newDylibrary') {
            this.$emit('updateData', { sortId: 10, sortName: '绑定账号-编辑-确认', accountId: `【${this.addForm.platId}】${this.addForm.accountId}` })
          } else {
            this.$emit('updateData')
          }
        } else {
          this.$message.error(res.message)
        }
        this.addLoading = false
      }).catch(err => {
        // this.$emit('input', false)
      })
    },
    // 添加投放账号
    addAccount(params) {
      this.addLoading = true
      this.formatParams(params)
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
        params[k] = this.userInfo[key]
      }
      params.thirdUserId = (this.userInfo || {}).user_id
      // 如果是添加回填信息
      if (this.addbackfill) {
        params.thirdUserId = (this.userInfo || {}).user_id || this.editData.getDataUrl
        params.userName = params.userName || this.editData.accountName
      }

      params.accountSourceType = 1

      let api = $postAccountPutting

      if (this.saveInterface) {
        api = this.saveInterface
      }
      if (this.from === 'newDylibrary') {
        lego.send({
        actiontype: 'R1804',
        pagetype: 'zpmclick',
        backup: {
          token: this.user.userInfo.userid,
          uid: this.user.userInfo.id,
          sortId: 11,
          sortName: '绑定账号-新增-确认触发',
          accountId: `【${this.addForm.platId}】${this.addForm.accountName}`
        }
        })
      }
      api(params).then(res => {
        if (res.code === 1) {
          this.$message.success('添加成功')
          // this.value = false
          // this.onSubmit({})
          // this.$bus.$emit('upLog', { operation_module: '添加投放账号确定' })
          this.$emit('input', false)
          // 精准找号-埋点区分
          if (this.from === 'newDylibrary') {
            this.$emit('updateData', { sortId: 8, sortName: '绑定账号-新增-确认', accountId: `【${this.addForm.platId}】${this.addForm.accountName}` })
          } else {
            this.$emit('updateData')
          }
        } else {
          this.$message.error(res.message)
        }
        this.addLoading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.addLoading = false
        this.$message.error(err.message)
      })
    },
    handleSearchType(val) {
      this.userInfo = null
      this.accountList = []
      this.addForm.userId = ''
      switch (val) {
          case '1':
            this.addForm.accountLoginUrl = ''
            break
          case '2':
            this.addForm.accountId = ''
            break
      }
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
      this.getMatchingMcnName({ platId: this.addForm.platId, getDataUrl: this.userInfo.user_id })
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
    getMatchingMcnName({ platId, getDataUrl }) {
      $getMatchingMcnName({ platId, getDataUrl }).then(res => {
        if (res.code === 1) {
          if (res.data) {
            this.disabledTeam = true
            this.addForm.belongTeam = res.data
          } else {
            this.disabledTeam = false
            this.addForm.belongTeam = ''
          }
        } else {
          this.disabledTeam = false
          this.addForm.belongTeam = ''
        }
      })
    },
    getFundUsers() {
      $getFundUsers().then(res => {
        if (res.code === 1) {
          this.meetUserData = res.data
        }
      })
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
    ::v-deep{
      .business-line{
        .el-form-item__label{
          display: flex;
        }
      }
    }
</style>
