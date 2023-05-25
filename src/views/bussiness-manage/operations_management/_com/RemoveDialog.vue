<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    width="700px"
    :before-close="handleClose"
  >
    <div v-loading="loading">
      <AccountCard :info="row">
        <template v-slot>
          <p v-if="row.platId" class="account-txt">{{ [25,26].includes(row.platId)?row.platName+'号':'ID' }}：{{ row.uniqueId || row.eid || row.getDataUrl || '--' }}</p>
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
      <div>
        <p class="title m-t-24 m-b-12">当前信息</p>
        <el-form
          ref="form"
          :model="formData"
          :rules="rules"
          label-width="100px"
          label-position="left"
        >
          <el-form-item label="运营负责人:">
            {{ row.curOperatorName | emptyFill }}
          </el-form-item>
          <el-form-item label="账号归属:">
            {{ row.accountBelong | emptyFill }}
          </el-form-item>
          <el-form-item label="手机号:">
            {{ row.phone | emptyFill }}
          </el-form-item>
          <el-form-item label="账号统一名称:">
            {{ row.belongName | emptyFill }}
          </el-form-item>
          <template v-if="dialogType !== 'modify'">
            <el-form-item label="移交给:" prop="newOperatorId">
              <el-select
                v-model="formData.newOperatorId"
                placeholder="请选择人员"
                clearable
                filterable
                class="m-r-16"
              >
                <el-option
                  v-for="item in personnelList"
                  :key="item.userId"
                  :label="item.realname"
                  :value="item.userId"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="移交原因:" prop="transferReason">
              <el-input
                v-model="formData.transferReason"
                type="textarea"
                placeholder="选填，限长100字"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </template>
          <template v-else>
            <p class="title">修改内容</p>
            <el-row
              v-for="(item, index) in modifyList"
              :key="index"
              class="m-t-16 flex"
            >
              <el-col :span="6">
                <el-select
                  v-model="item.typeId"
                  placeholder="请选择修改类型"
                  clearable
                  filterable
                  @change="handleModifyType"
                >
                  <el-option
                    v-for="inner in typeList"
                    :key="inner.value"
                    :label="inner.title"
                    :value="inner.value"
                    :disabled="selectIds.includes(inner.value)"
                  />
                </el-select>
              </el-col>
              <el-col :span="14">
                <div class="modify-wrapper">
                  <el-form-item
                    :prop="modifyList[index].typeId"
                    :rules="modifyRules"
                  >
                    <el-input
                      v-if="selectIds[index] !== 'realCelebrityId'"
                      v-model="item.editContent"
                      placeholder="填写具体的修改内容"
                      :maxlength="modifyLength(selectIds[index])"
                    />
                    <el-select
                      v-else
                      v-model="item.editContent"
                      class="real-name"
                      placeholder="请选择实名人姓名"
                      clearable
                      filterable
                    >
                      <el-option
                        v-for="inner1 in userCards"
                        :key="inner1.userId"
                        :value="inner1.userId"
                        :label="inner1.realname"
                      />
                    </el-select>
                  </el-form-item>
                </div>
              </el-col>
              <el-col :span="4" class="flex flex-align-center">
                <i
                  v-if="modifyList.length > 1"
                  class="el-icon-delete delete-icon"
                  @click="handleDelete(index)"
                />
                <el-tooltip
                  v-if="
                    index === modifyList.length - 1 && modifyList.length < 4
                  "
                  class="item"
                  effect="dark"
                  :disabled="isAdd"
                  content="修改内容填写完成，才能添加下一项"
                  placement="top-end"
                >
                  <i class="el-icon-circle-plus plus-icon" @click="handleAdd" />
                </el-tooltip>
              </el-col>
            </el-row>
          </template>
        </el-form>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="save"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import {
  $remove,
  $getTransferInfo,
  $modifyReport,
  $getPirateUser,
  $handoverQP
} from '@/api/operating-manage'
import { AccountCard, IconTip } from 'components'
import { useToggle } from '@/hook'
import { copy } from '@/utils'
const SHEN_FEN_EXP = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
const PHONE_EXP = /^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/
export default defineComponent({
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    value: Boolean,
    dialogType: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
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
      loading: true,
      btnLoading: false,
      personnelList: [],

      typeList: [
        {
          title: '绑定手机号',
          value: 'inventoryPhone'
        },
        {
          title: '实名人',
          value: 'realCelebrityId'
        },
        {
          title: '实名人身份证',
          value: 'idCardNum'
        },
        {
          title: '提现绑定账户',
          value: 'withdrawalBoundAccount'
        }
      ],
      modifyRules: [],
      rules: {
        newOperatorId: [
          {
            required: true,
            message: '请选择移交人员',
            trigger: ['change', 'blur']
          }
        ]
      },
      modifyList: [{ typeId: '', editContent: '' }],
      userCards: [],
      accountReportingInfo: {}
    })
    const modifyLength = (val) => {
      switch (val) {
        case 'withdrawalBoundAccount':
          return 30
        case 'idCardNum':
          return 18
        case 'inventoryPhone':
          return 11
      }
    }
    const title = computed(() => {
      switch (props.dialogType) {
        case 'modify':
          return '修改报备申请'
        case 'remove':
          return '移交申请'
      }
    })
    const getPirateUser = () => {
      states.loading = true
      $getPirateUser()
        .then((res) => {
          if (res.code === 1) {
            states.userCards = res.data || []
            states.loading = false
          }
        })
        .catch((err) => {
          states.loading = false
          if (err.__CANCEL__) {
            return
          }
        })
    }
    const getTransferInfo = async function() {
      try {
        // orgType = 1海盗 orgType = 2乾派
        states.loading = true
        const orgType = props.source === 'studio' ? 2 : 1
        const res = await $getTransferInfo({ orgType })
        if (res.code === 1 && res.data) {
          states.personnelList = res.data
        } else {
          $message.error(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }
    const formModifyData = () => {
      if (props.dialogType === 'remove') return true
      states.accountReportingInfo = {}
      states.modifyList.forEach((item) => {
        if (item.typeId) {
          states.accountReportingInfo[item.typeId] = item.editContent
        }
      })
    }
    const validateReportingInfo = () => {
      if (props.dialogType === 'remove') return true
      let flag = false
      const arr = states.modifyList
      for (var i = 0; i < arr.length; i++) {
        flag = dynamicCheck(arr[i].typeId, arr[i].editContent)
        if (!flag) {
          break
        }
      }
      return flag
    }
    const dynamicCheck = (key, value) => {
      if (
        (states.modifyList.length > 1 &&
          ((key && !value) || (!key && value))) ||
        (states.modifyList.length === 1 && (!key || !value))
      ) {
        $message.error('修改内容不能为空')
        return false
      }
      switch (key) {
        case 'idCardNum':
          if (value && !SHEN_FEN_EXP.test(value)) {
            $message.error('请输入正确的身份证号码')
            return false
          } else {
            return true
          }
        case 'inventoryPhone':
          if (value && !PHONE_EXP.test(value)) {
            $message.error('请输入正确的手机号码')
            return false
          } else {
            return true
          }
        default:
          return true
      }
    }
    const save = async function() {
      try {
        await $refs.form.validate()
        if (!validateReportingInfo()) {
          return
        }
        formModifyData()
        states.btnLoading = true
        let $api = null
        if (props.dialogType === 'remove') {
          if (props.source === 'studio') {
            $api = $handoverQP
          } else {
            $api = $remove
          }
        } else {
          $api = $modifyReport
        }
        const params = {
          accountId: props.row.accountId,
          ...states.formData,
          accountReportingInfo: Object.keys(states.accountReportingInfo).length ? { ...states.accountReportingInfo } : ''
        }
        const res = await $api(params)
        if (res.code === 1) {
          emit('getList')
          emit('close')
          emit('checkAllAccountTransfer')
          $message.success('操作成功')
        } else {
          $message.error(res.message)
        }
        states.btnLoading = false
      } catch (err) {
        $message.error(err)
        states.btnLoading = false
      }
    }
    const selectIds = computed(() => {
      const arr = []
      states.modifyList.forEach((item) => {
        arr.push(item.typeId)
      })
      return arr
    })
    const handleDelete = (index) => {
      states.modifyList.splice(index, 1)
    }
    const isAdd = computed(() => {
      const l = states.modifyList.length
      return !!states.modifyList[l - 1].editContent
    })
    const handleAdd = () => {
      isAdd.value && states.modifyList.push({ typeId: '', editContent: '' })
    }
    const handleModifyType = (val) => {
      const arr = copy(states.modifyList)
      arr.forEach((item) => {
        if (item.typeId === val) {
          item.editContent = ''
        }
      })
      states.modifyList = arr
    }
    getTransferInfo()
    if (props.dialogType === 'modify') {
       getPirateUser()
    }
    return {
      ...toRefs(states),
      show,
      handleClose,
      title,
      save,
      handleAdd,
      selectIds,
      handleDelete,
      modifyLength,
      isAdd,
      handleModifyType
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .account-card__image {
    height: 58px;
    width: 58px;
  }
}
.title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.delete-icon {
  font-size: 20px;
  color: red;
  margin-left: 12px;
}
.plus-icon {
  margin-left: 12px;
  font-size: 20px;
  color: #2c64ff;
}
.real-name {
  width: 100%;
}
.account-txt{
  color: rgb(141, 141, 141);
  font-size: 14px;
  margin:8px 0;
}
.modify-wrapper {
  ::v-deep {
    .el-form-item {
      margin-bottom: 0px;
    }
    .el-form-item__content {
      margin-left: 12px !important;
    }
  }
}
</style>
