<template>
  <el-dialog
    class="C-launch-account"
    width="50%"
    title="添加为投放账号"
    :visible="value"
    @close="$emit('input', false)"
  >
    <div class="add-form">
      <el-form ref="addForm" label-width="140px" :model="addForm" :rules="addFormRules">
        <el-form-item label="账号信息">
          <AccountCard :info="data" :show-tags="false">
            <div class="account-id">{{ data.platName }}号：{{ data.uniqueId || data.eid || data.getDataUrl || '--' }}</div>
          </AccountCard>
        </el-form-item>
        <el-form-item prop="inputTags" label="达人类型">
          <template v-if="data.sysAccountTag">
            <el-tag v-for="item in data.sysAccountTag.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>
          <el-tag
            v-for="tag in inputTags"
            :key="tag"
            closable
            :disable-transitions="false"
            size="mini"
            class="m-r-5 m-b-5"
            @close="handleClose(tag)"
          >{{ tag }}</el-tag>
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model.trim="inputValue"
            class="input-new-tag"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 达人类型</el-button>
        </el-form-item>
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
          <!-- <el-col :span="12">
            <el-form-item label="对接人" prop="meetUserId">
              <el-select v-model="addForm.meetUserId" filterable clearable>
                <el-option
                  v-for="item in meetUserIds"
                  :key="item.userId"
                  :value="item.userId"
                  :label="item.realname"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
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
                <svg-icon icon-class="shouji" />手机号码
              </div>
              <el-input :value="addForm.phone" maxlength="11" minlength="11" @input="addForm.phone = arguments[0].replace(/\D/g, '')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="微信号" prop="wechatNumber">
              <div slot="label">
                <svg-icon icon-class="weixin" />微信号
              </div>
              <el-input v-model="addForm.wechatNumber" minlength="6" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="QQ" prop="qqNumber">
              <div slot="label">
                <svg-icon icon-class="QQ" />QQ
              </div>
              <el-input :value="addForm.qqNumber" minlength="6" @input="addForm.qqNumber = arguments[0].replace(/\D/g, '')" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <div slot="label">
                <svg-icon icon-class="youxiang" />邮箱
              </div>
              <el-input v-model.trim="addForm.email" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="座机号码" prop="fixedPhone">
              <div slot="label">
                <svg-icon icon-class="zuoji" />座机号码
              </div>
              <flex-row>
                <el-input v-model.trim="addForm.fixedPhoneCode" style="width: 90px;" />
                <span>-</span>
                <el-input v-model.trim="addForm.fixedPhoneNumber" />
              </flex-row>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="其他" prop="otherContact">
              <div slot="label">
                <svg-icon icon-class="qita" />其他
              </div>
              <el-input v-model.trim="addForm.otherContact" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item class="business-line" prop="businessLines">
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
        </el-row>
      </el-form>
      <div slot="footer" class="flex flex-justify-end">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { $addRecommandAccount, $getMcnName } from '@/api/bussiness-manage'
import { $getMatchingMcnName } from '@/api/account-manage'
import { AccountCard, IconTip } from 'components'

export default {
  components: {
    AccountCard,
    IconTip
  },
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    pageType: {
      type: String,
      default: ''
    },
    // 账号来源
    accountSourceType: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      disabledTeam: false,
      userInfo: null,
      empowerLoading: false,
      loading: false,
      inputVisible: false,
      platInfo: [],
      inputValue: '',
      platMap: {},
      inputTags: [],
      // meetUserIds: null,
      addForm: {
        refuseId: '',
        accountId: '',
        belongTeam: '',
        // meetUserId: '',
        phone: '',
        tagValue: '',
        xingtuPrice: '',
        qqNumber: '',
        email: '',
        otherContact: '',
        fixedPhoneCode: '',
        fixedPhoneNumber: '',
        wechatNumber: '',
        businessLines: []
      },
      mcnList: [],
      addFormRules: {
        // belongTeam: [{ required: true, message: '请输入所属机构', trigger: 'blur' }],
        // phone: [{ required: true, message: '请输入联系方式', trigger: 'blur' }],
        // meetUserId: [{ required: true, validator: (rule, value, cb) => {
        //   if (!value) {
        //     cb(new Error('请输入对接人'))
        //   } else {
        //     return cb()
        //   }
        // }, trigger: 'change' }],
        businessLines: [{ required: true, validator: (rule, value, cb) => {
          return cb()
        }, trigger: ['blur', 'change'] }],
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
            var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
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
        //   if (this.inputTags.length === 0 && !this.data.sysAccountTag) {
        //     cb(new Error('请输入达人类型'))
        //   } else {
        //     return cb()
        //   }
        // }, trigger: 'change' }]
      }
    }
  },
  created() {
    // this.getAccountCondition()
    if (this.data) {
      for (const key in this.addForm) {
        this.addForm[key] = this.data[key]
      }
      this.addForm.businessLines = []
    }
    this.getMcnName()
    this.getMatchingMcnName({ platId: this.data.platId, getDataUrl: this.data.getDataUrl })
  },
  methods: {
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
    belongTeamSearch(query) {
      if (query) {
        this.mcnList = this._mcnList?.filter(item => item.includes(query))?.splice(0, 300)
      } else {
        this.mcnList = this._mcnList?.splice(0, 300)
      }
    },
    getMcnName() {
      console.log(this.addForm)
      this.mcnList = []
      $getMcnName({ platId: this.data.platId }).then(res => {
        if (res.code === 1) {
          this.mcnList = res.data.splice(0, 300)
          this._mcnList = res.data
        }
      })
    },
    /**
     * 查询条件列表
     */
    // async getAccountCondition() {
    //   const res = await $getAccountCondition()
    //   if (res.code === 1) {
    //     this.meetUserIds = res.data.simpleUserInfo
    //   }
    // },
    handleClose(tag) {
      this.inputTags.splice(this.inputTags.indexOf(tag), 1)
      if (this.inputTags.length === 0) {
        this.$refs.addForm.validateField('inputTags')
      }
    },
    limitQuotePriceLen(e) {
      let xingtuPrice = e.target.value
      xingtuPrice = xingtuPrice.replace(/[^\d]/g, '')
      if (xingtuPrice.length > 10) {
        xingtuPrice = xingtuPrice.slice(0, 10)
      }
      this.addForm.xingtuPrice = xingtuPrice
    },
    // 添加投放账号
    addAccount(params) {
      this.loading = true
      $addRecommandAccount(params).then(res => {
        if (res.code === 1) {
          // this.$message.success('添加成功')
          this.$emit('input', false)
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        this.$message.error(err?.message || '网络出错')
        this.loading = false
      })
    },
   dialogConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          if (!this.addForm.businessLines.length) {
            this.$message.error('请至少选择1个业务线')
            return
          }
          const params = this.addForm
          params.tagValue = this.inputTags.join(',')
          params.accountSourceType = this.accountSourceType
          this.addAccount(params)
        }
      })
    },
    showInput() {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue && !this.inputTags.includes(inputValue) && !this.data.sysAccountTag.includes(inputValue)) {
        this.inputTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
      if (this.inputTags.length > 0) {
        this.$refs.addForm.clearValidate('inputTags')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-launch-account {
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
    ::v-deep .svg-icon {
      margin-right: 6px;
      font-size: 16px;
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
