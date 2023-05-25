<template>
  <el-dialog
    :title="title"
    :visible="show"
    width="880px"
    @close="handleClose"
  >
    <el-form
      ref="form"
      v-loading="loading"
      class="modal-form"
      label-position="right"
      :model="addForm"
      label-width="130px"
      :rules="rules"
    >
      <el-row>
        <el-col :span="6">
          <el-form-item label="团队：">{{ addForm.businessGroupName }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="创作者：">{{ addForm.businessUserName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台-账号：">
            <el-tag v-if="addForm.platAccount">{{ addForm.platAccount }}</el-tag>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="品牌：">{{ addForm.brandName }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="合作产品：">{{ addForm.quotientName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合作类型：">{{ addForm.workType }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="执行人小组：">{{ addForm.executeGroup }}</el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="执行人：">{{ addForm.executeName }}</el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="商单号：">{{ addForm.quotientId }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="标题：">
            <el-input v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1" v-model="addForm.title" maxlength="50" />
            <template v-else>{{ addForm.title }}</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="链接：">
            <el-input v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1" v-model="addForm.url" :disabled="addForm._isOver" maxlength="200" />
            <a v-else :href="addForm.url" :undeline="false" target="_blank">{{ addForm.url }}</a>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="履约完成时间：" prop="finishTime">
            <el-date-picker
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.finishTime"
              type="date"
              value-format="yyyy-MM-dd"
            />
            <template v-else>{{ addForm.finishTime }}</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流量：" prop="flowCount">
            <el-input
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.flowCount"
              type="Number"
              maxlength="10"
            />
            <template v-else>{{ addForm.flowCount }}</template>

          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="工单状态：">
            <el-select v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1" v-model="addForm.isOver" :disabled="!hasEditRight">
              <el-option :value="0" label="未完成" />
              <el-option :value="1" label="已完成" />
            </el-select>
            <template v-else>{{ addForm.isOver === 0 ? '未完成': '已完成' }}</template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="销售收入：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.workMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ addForm.workMoney }}</template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对公返点：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.discount"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="addForm.workMoney"
            />
            <template v-else>{{ addForm.discount }}</template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="对公返点：必须走合同和发票返点给客户的金额，即为对公返点金额。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="12">
          <el-form-item label="对私返点：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.discountPrivate"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="addForm.workMoney"
            />
            <template v-else>{{ addForm.discountPrivate }}</template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="对私返点：必须通过高灯打款支付给客户个人账户的金额，无需走合同和发票，即为对私金额，填写无需加高灯服务费。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="折扣金额：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.rebateMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ addForm.rebateMoney }}</template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="折扣金额：客户自行下单，为通过线上改价方式返还给客户的金额；代客下单，为提前从合作金额扣除的返点金额，即不需以打款方式向客户支付的返点。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="抖+成本：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.douMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ addForm.douMoney }}</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台手续费：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.platMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ addForm.platMoney }}</template>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="其他成本：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.otherMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ addForm.otherMoney }}</template>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="销售成本：">
            {{ countTotalInfo.costMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="销售成本：对公返点+对私返点+ 扣金额+抖+成本+平台手续费 + 其他成本；若是合同成单，则无返点金额；若是客户自行下单，则无平台手续费，返点金额视谈判结果而可有可无"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="执行金额：">
            {{ countTotalInfo.executeMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="执行金额=销售收入-销售成本"
              icon-class="iconwenhao"
            />
            <!-- </el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="达人分成成本：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.outMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>{{ countTotalInfo.outMoney }}</template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="达人分成成本：（销售收入-销售成本）*达人分成比例"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="绩效营收：">
            <!-- <el-input
                v-model="countTotalInfo.performanceMoney"
                disabled
              > -->
            {{ countTotalInfo.performanceMoney }}
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="绩效营收=执行金额-达人分成成本"
              icon-class="iconwenhao"
            />
            <!-- </el-input> -->
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="收款日期：">
            <el-date-picker
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.collectionDate"
              value-format="yyyy-MM-dd"
              placeholder=""
            />
            <span v-else class="video-form-item-value">{{ addForm.collectionDate }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="线下补款：">
            <el-input-number
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.offlineAddMoney"
              :disabled="!hasEditRight"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>
              {{ addForm.offlineAddMoney }}
            </template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="线下补款：客户自行平台下单（不含代客下单和不走平台的私单的情况）还需线下补款，则录入补款金额。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="绩效月：" prop="monthMoneyNew">
            <el-date-picker
              v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
              v-model="addForm.monthMoneyNew"
              :disabled="!hasEditRight"
              type="month"
              value-format="yyyy-MM"
            />
            <template v-else>{{ addForm.monthMoneyNew }}</template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="已付客户返点：" prop="customerRebatePaid">
            <el-input-number
              v-if="diaLogType === 'edit' && $permission('rebates_paid')"
              v-model="addForm.customerRebatePaid"
              :min="0"
              :precision="2"
              :max="99999999"
            />
            <template v-else>
              {{ addForm.customerRebatePaid }}
            </template>
            <IconTip
              type="popover"
              placement="top-start"
              width="300"
              trigger="hover"
              content="已付客户返点：该工单公司已实际支付给客户的返点金额，由财务人员录入。"
              icon-class="iconwenhao"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="财务是否核账：">
            <el-radio-group v-if="diaLogType === 'edit' && $permission('workorder_financial')" v-model="addForm.reconciliationStatus">
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是，已到账</el-radio>
            </el-radio-group>
            <template v-else>
              {{ addForm.reconciliationStatus === 1 ? '是，已到账' : '否' }}
            </template>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="是否已开发票：">
          <el-radio-group v-if="diaLogType === 'edit' && $permission('is_invoice')" v-model="addForm.receiptStatus">
            <el-radio :label="0">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
          <template v-else>
            {{ addForm.receiptStatus === 1 ? '是' : '否' }}
          </template>
        </el-form-item>
      </el-row>
      <el-row>
        <el-col :span="10">
          <el-form-item label="OA合同编号:">
            {{ addForm.oaContractNo|emptyFill }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item label="备注：">
          <el-input
            v-if="diaLogType === 'edit' && RECONCILIATION_STATUS!==1"
            v-model="addForm.note"
            :disabled="!hasEditRight"
            type="textarea"
            maxlength="500"
            placeholder="请输入备注内容"
          />
          <template v-else>{{ addForm.note }}</template>
        </el-form-item>
      </el-row>
    </el-form>
    <div v-if="diaLogType === 'edit'" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" :disabled="loading" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getSpecialWorkOrderInfo, $updateSpecialWorkOrder } from '@/api/bussiness-manage'
import { IconTip } from 'components'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    diaLogType: String,
    specialWorkId: {
      type: Number | String
    },
    value: Boolean
  },
  components: { IconTip },
  setup(props, { emit }) {
    const { $message, $bus, $permission, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const addForm = ref({})
    const loading = ref(false)
    const RECONCILIATION_STATUS = ref(0)
    const getOrderInfo = () => {
      loading.value = true
      $getSpecialWorkOrderInfo({ specialWorkId: props.specialWorkId }).then(res => {
        if (res.code === 1) {
          res.data.monthMoneyNew = res.data.monthMoneyNew || undefined
          addForm.value = res.data
          RECONCILIATION_STATUS.value = res.data.reconciliationStatus
        } else {
          $message.error(res.message)
        }
        loading.value = false
      }).catch(err => {
        if (err.__CANCEL__) return
        loading.value = false
      })
    }
    getOrderInfo()

    const title = computed(() => {
      switch (props.diaLogType) {
        case 'detail':
          return '查看工单详情'
        case 'edit':
          return '编辑工单信息'
      }
    })

    const countCost = (obj) => {
      return ['discount', 'discountPrivate', 'rebateMoney', 'douMoney', 'platMoney', 'otherMoney'].reduce((t, n) => {
        t += obj[n] || 0
        return t
      }, 0)
    }

    const countTotalInfo = computed(() => {
      if (props.diaLogType === 'edit') {
        const countResult = copy(addForm.value)
        // 销售成本 = 对公返点 + 对私返点 + 折扣金额 + 抖+成本 + 平台手续费 + 其他成本
        countResult.costMoney = countCost(countResult)
        // 执行金额 = 销售收入 - 销售成本
        countResult.executeMoney = (countResult.workMoney || 0) - (countResult.costMoney || 0)
        // 绩效营收 = 执行金额 - 达人分成成本
        countResult.performanceMoney = (countResult.executeMoney || 0) - (countResult.outMoney || 0)
        return countResult
      } else {
        return addForm.value
      }
    })
    const rules = {
      finishTime: [{ required: true, message: '请选择履约完成时间', trigger: 'change' }],
      monthMoneyNew: [{ required: true, message: '请输入绩效月', trigger: 'change' }],
      customerRebatePaid: [{
        required: false,
        trigger: 'change',
        validator: (rule, value, callback) => {
            if (value && addForm.value.workMoney < value) {
              callback(new Error('已付客户返点不能大于工单销售收入'))
              return
            }
            callback()
          }
      }]
    }

    const checkRule = () => {
      return $refs.form.validate()
    }

    const btnLoading = ref(false)
    const handleConfirm = async() => {
      await checkRule()
      btnLoading.value = true
      $updateSpecialWorkOrder(addForm.value).then(res => {
        if (res.code === 1) {
          $message.success('修改成功')
          handleClose()
          emit('success')
          $bus.$emit('upLog', { quotientId: addForm.value.quotientId, operation_module: '编辑确定' })
          btnLoading.value = false
        } else {
          $message.error(res.message)
          btnLoading.value = false
        }
      })
    }

    const hasEditRight = computed(() => {
      return $permission('middleground')
    })

    return {
      rules,
      btnLoading,
      loading,
      title,
      show,
      handleClose,
      addForm,
      hasEditRight,
      countTotalInfo,
      handleConfirm,
      RECONCILIATION_STATUS
    }
  }
})
</script>

