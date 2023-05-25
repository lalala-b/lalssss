<template>
  <el-dialog
    :title="isEdit ? '编辑账号盘点信息' : '查看账号盘点信息'"
    :visible.sync="show"
    width="820px"
    :before-close="handleClose"
  >
    <div class="account-wrapper">
      <AccountCard :info="row">
        <template v-slot>
          <div
            v-if="row.upUpNameAndLeader"
            class="m-t-5"
            style="text-align: left"
          >
            <el-tag size="mini" type="danger">{{
              row.upUpNameAndLeader
            }}</el-tag>
          </div>
        </template>
      </AccountCard>
      <p class="m-t-16 bind-id">ID:{{ getID(row) }}</p>
      <div class="m-t-12">
        <el-form ref="form" :model="formData" :inline="true" :rules="rules">
          <el-row>
            <el-col :span="12">
              <el-form-item label="账号当前状态：">
                {{ getAccountStatusName(row.accountStatus) }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总粉丝量：">
                {{ row.fansNum | toThousandsW }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="MCN机构：">
                <template v-if="row.mcnName">
                  <div class="mac-wrapper">
                    <AccountCard
                      v-if="row.mcnAvatarUri"
                      :info="{
                        accountName: row.mcnName,
                        accountImg: row.mcnAvatarUri,
                      }"
                    />
                    <span v-else>{{ row.mcnName }}</span>
                  </div>
                </template>
                <template v-else> -- </template>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否加入乾派MCN完成对公认证：">
                <el-switch
                  v-if="isEdit"
                  v-model="formData.joinMcnFlagCertification"
                  :active-value="1"
                  :inactive-value="0"
                  class="m-r-5"
                />
                <div v-else>
                  {{ formData.joinMcnFlagCertification ? '是' : '否' }}
                </div>
              </el-form-item>
              <p class="text-red">
                注：完全通过乾派的银行账户收款才选择是已加入乾派MCN完成对公认证
              </p>
            </el-col>
            <el-col :span="12">
              <el-form-item label="是否公司手机卡：">
                <el-radio-group v-if="isEdit" v-model="formData.corporationPhoneFlag">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
                <div v-else>
                  {{ formData.corporationPhoneFlag ? '是' : '否' }}
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item class="item-phone" label="手机号：" prop="phone">
                <el-input
                  v-if="isEdit"
                  v-model="formData.phone"
                  maxlength="11"
                  placeholder="请输入开通注册账号的手机号"
                  @input="formData.phone = arguments[0].replace(/\D/g, '')"
                />
                <div v-else>{{ formData.phone | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机卡使用人：">
                <el-select
                  v-if="isEdit"
                  v-model="formData.userPhoneUserId"
                  placeholder="请选择手机卡使用人"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in userCards"
                    :key="item.userId"
                    :value="item.userId"
                    :label="item.realname"
                  />
                </el-select>
                <div v-else>{{ formData.userPhoneUserName | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号统一名称：">{{
                row.belongName | emptyFill
              }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运营负责人：">{{ row.operatorName | emptyFill }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号归属：">{{
                row.accountBelong | emptyFill
              }}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="绑定记录：">
                <div class="flex">
                  <div v-if="bindList.split(',').length > 2" class="flex">
                    <div
                      v-for="(tag, index) in bindList.split(',')"
                      :key="index"
                    >
                      <span
                        v-if="index < 2"
                      >{{ tag }}<i v-if="index <= 1">,</i></span>
                    </div>
                    <span>...</span>
                  </div>
                  <p v-else>
                    {{ bindList }}
                  </p>
                  <i
                    class="iconfont iconlianxiren realname-iocn"
                    @click="showRecord"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实名人姓名：">
                <el-select
                  v-if="isEdit"
                  v-model="formData.realCelebrityId"
                  placeholder="请选择实名人姓名"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in userCards"
                    :key="item.userId"
                    :value="item.userId"
                    :label="item.realname"
                  />
                </el-select>
                <div v-else>{{ formData.realCelebrityName | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实名人身份证：" prop="idCardNum">
                <el-input
                  v-if="isEdit"
                  v-model.trim="formData.idCardNum"
                  maxlength="18"
                  placeholder="请输入实名人身份证"
                />
                <div v-else>{{ formData.idCardNum | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="星图实名人：">
                <el-select
                  v-if="isEdit"
                  v-model="formData.xingtuPersionId"
                  placeholder="请选择星图实名人"
                  clearable
                  filterable
                >
                  <el-option
                    v-for="item in userCards"
                    :key="item.userId"
                    :value="item.userId"
                    :label="item.realname"
                  />
                </el-select>
                <div v-else>{{ formData.xingtuPersionName | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="星图实名人身份证：" prop="xingtuIdCardNum">
                <el-input
                  v-if="isEdit"
                  v-model.trim="formData.xingtuIdCard"
                  maxlength="18"
                  placeholder="请输入实名人身份证"
                />
                <div v-else>{{ formData.xingtuIdCard | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <!-- </el-row>
          <el-row> -->
            <el-col :span="12">
              <el-form-item label="提现绑定账户：">
                <el-input
                  v-if="isEdit"
                  v-model.trim="formData.withdrawalBoundAccount"
                  maxlength="30"
                  placeholder="请输入提现绑定账户"
                />
                <div v-else>
                  {{ formData.withdrawalBoundAccount | emptyFill }}
                </div>
              </el-form-item>
            </el-col>
            <el-col v-if="!isEdit && formData.refreshTime" :span="12">
              <div class="update-time">
                最近更新时间：<span class="m-l-12">{{
                  formData.refreshTime
                }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-form-item label="账号保管部门：">
                <el-cascader
                  v-if="isEdit"
                  v-model="formData.careOrgId"
                  placeholder="请选择账号保管部门"
                  :options="orgInfoConditionVOS"
                  :props="{
                    checkStrictly: true,
                    value: 'id',
                    label: 'orgName',
                    children: 'childOrgList',
                    emitPath: false,
                  }"
                  clearable
                  filterable
                />
                <div v-else>{{ formData.careOrgName | emptyFill }}</div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="UID：">
                <el-input
                  v-if="isEdit"
                  v-model.trim="formData.uid"
                  min="0"
                  placeholder="请输入UID"
                  oninput="value=value.replace(/[^\d]/g,'')"
                />
                <div v-else>{{ formData.uid | emptyFill }}</div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col v-if="isEdit" :span="18">
              <el-form-item label="备注：">
                <el-input
                  v-model.trim="formData.remark"
                  maxlength="20"
                  placeholder="请输入备注"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="!isEdit && formData.remark">
              <div class="update-time">
                备注：<span class="m-l-12">{{
                  formData.remark
                }}</span>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div v-if="isEdit" slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="editSave"
      >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { $updateAccountInventory, $getAccountBindInfo } from '@/api/account-manage'
import { AccountCard, IconTip } from 'components'
import { useToggle } from '@/hook'
import { getAccountStatusName, getID } from './hook'
import { copy } from '@/utils'
const SHEN_FEN_EXP = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
export default defineComponent({
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    value: Boolean,
    isEdit: {
      type: Boolean,
      default: false
    },
    userCards: {
      type: Array,
      default() {
        return []
      }
    },
    orgInfoConditionVOS: {
      type: Array,
      default() {
        return []
      }
    }
  },
  components: {
    AccountCard,
    IconTip
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const states = reactive({
      formData: {},
      loading: false,
      bindList: ''
    })
    const rules = {
      idCardNum: [
        {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !SHEN_FEN_EXP.test(value)) {
              callback(new Error('请输入正确的身份证号码'))
              return
            }
            callback()
          }
        }
      ],
      xingtuIdCardNum: [
        {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !SHEN_FEN_EXP.test(value)) {
              callback(new Error('请输入正确的身份证号码'))
              return
            }
            callback()
          }
        }
      ],
      phone: [
        { required: false, message: '请输入手机号码', trigger: 'blur' },
        {
          pattern:
            /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }
      ]
    }

    watch(
      () => props.row,
      (val) => {
        if (val) {
          if (!val.realCelebrityId) {
            val.realCelebrityId = ''
          }
          states.formData = { ...val }
        }
      },
      { immediate: true }
    )
    const showRecord = () => {
      emit('handleRecords', props.row)
    }
    const getName = (id) => {
      const item = (props.userCards || []).find(
        (item) => Number(item.userId) === Number(id)
      )
      return item ? item.realname : ''
    }
    const getAccountBindInfo = async function() {
      try {
        const res = await $getAccountBindInfo({
          accountId: props.row.accountId
        })
        if (res.code === 1 && res.data) {
          const data = res.data.accountBindUserInfo || []
          const bindList = []
          data.forEach(item => {
            bindList.push(item.bindUserName)
          })
          states.bindList = String(bindList)
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
      }
    }
    const editSave = async() => {
      try {
        await $refs.form.validate()
        const params = copy(states.formData)
        params.realCelebrityName = params.realCelebrityId
          ? getName(params.realCelebrityId)
          : ''
        params.userPhoneUserName = params.userPhoneUserId
          ? getName(params.userPhoneUserId)
          : ''

        params.xingtuPersionName = params.xingtuPersionId
          ? getName(params.xingtuPersionId)
          : ''

        params.careOrgName = params.careOrgId
          ? getName(params.careOrgId)
          : ''

        states.loading = true
        const res = await $updateAccountInventory(params)
        if (res && res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }
    getAccountBindInfo()
    return {
      rules,
      ...toRefs(states),
      show,
      handleClose,
      editSave,
      showRecord,
      getAccountStatusName,
      getID
    }
  }
})
</script>
<style scoped lang="scss">
.iconlianxiren {
  color: #2c64ff !important;
}
::v-deep {
  .account-wrapper {
    .account-card__image {
      height: 48px;
      width: 48px;
    }
  }
  .mac-wrapper {
    .account-card__image {
      height: 48px;
      width: 68px;
    }
  }
  .item-phone {
    .el-input {
      width: 200px;
    }
  }
}
.bind-id {
  font-size: 12px;
  color: #837e7e;
}
.update-time {
  margin-top: 8px;
  font-size: 14px;
  color: #918e8e;
}
.text-red {
  margin-top: -24px;
  margin-bottom: 16px;
  font-size: 12px;
  letter-spacing: -1px;
  color: rgb(255, 73, 73);
}
</style>

