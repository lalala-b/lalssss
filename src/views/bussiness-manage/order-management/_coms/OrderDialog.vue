<template>
  <el-dialog
    :title="type === 'view' ? '查看' : '编辑'"
    :visible="showAddDialog"
    width="1280px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <div class="add-form">
      <el-form
        ref="addForm"
        v-loading="loading"
        :model="formData"
        class="form-view"
        :rules="addFormRules"
        label-width="130px"
      >
        <p class="form-title">商业信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="订单名称：">
                {{ formData.orderName | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型：">
                {{
                  projectTypeMap.get(formData.projectType)
                    ? projectTypeMap.get(formData.projectType)
                    : '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="账号平台：">
                {{ formData.platName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="下单账号：">
                {{ formData.accountName | emptyFill }}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="商务小组：">
                {{ formData.businessGroupName | emptyFill }}
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="商务对接人：">
                {{ formData.businessUserName | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="已定档期：" prop="finishTimeConfirm">
                <el-date-picker
                  v-model="formData.finishTimeConfirm"
                  :disabled="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4"
                  type="date"
                  value-format="yyyy-MM-dd"
                  size="small"
                  clearable
                  @focus="handleToGetCurVal"
                  @change="handleToJudgeDq"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单状态：">
                {{
                  orderStatusMap.get(formData.workerStatus)
                    ? orderStatusMap.get(formData.workerStatus)
                    : '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="工单ID：">
                {{ formData.workId | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="form-title m-t-20">订单信息（由商务填写）</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="销售收入:">
                {{ (formData.businessMoneyInfoBO || {}).flowMoney | emptyFill }}
                <IconTip
                  type="popover"
                  content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对公返点:">
                {{ formData.businessMoneyInfoBO.discount | emptyFill }}
                <IconTip
                  type="popover"
                  content="对公返点：必须走合同和发票返点给客户的金额，即为对公返点金额。"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="对私返点:">
                {{ formData.businessMoneyInfoBO.discountPrivate | emptyFill }}
                <IconTip
                  type="popover"
                  content="对私返点：必须通过高灯打款支付给客户个人账户的金额，无需走合同和发票，即为对私金额，填写无需加高灯服务费。"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="折扣金额:">
                {{ formData.businessMoneyInfoBO.rebateMoney | emptyFill }}
                <IconTip
                  type="popover"
                  content="折扣金额：客户自行下单，为通过线上改价方式返还给客户的金额；代客下单，为提前从合作金额扣除的返点金额，即不需以打款方式向客户支付的返点。"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="抖荚成本:">
                {{ formData.businessMoneyInfoBO.douMoney | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="平台手续费:">
                {{ formData.businessMoneyInfoBO.platMoney | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="其他成本:">
                {{ formData.businessMoneyInfoBO.otherMoney | emptyFill }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="线下补款:">
                {{ formData.businessMoneyInfoBO.offlineAddMoney | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="form-title m-t-20">订单信息（由工作室账号负责人填写）</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="平台下单价：" prop="platOrderMoney">
                <el-input-number v-model="formData.platOrderMoney" size="small" :precision="2" :step="0.1" :min="0" :disabled="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4" @change="handleChangePlatformPrice" />
                <IconTip
                  type="popover"
                  content="实际在平台中下单给达人的价格"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="执行金额：" prop="executeMoney">
                {{ formData.executeMoney | emptyFill }}
                <IconTip
                  type="popover"
                  content="执行金额=销售收入-对公返点-对私返点-折扣金额-抖荚成本-平台手续费-其他成本"
                  icon-class="iconwenhao"
                />
              </el-form-item>
            </el-col>
            <el-col v-if="(formData.platName==='抖音' && +formData.quotientType!==4) || (formData.platName==='B站' && +formData.quotientType!==4)" :span="8">
              <el-form-item label="平台任务ID：" prop="platTaskId">
                <el-input
                  v-model="formData.platTaskId"
                  :disabled="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4"
                  placeholder="请输入"
                  maxlength="100"
                  size="small"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="锁定金额：">
                <div class="flex flex-align-center">
                  <el-switch
                    v-model="formData.lockMoney"
                    :active-value="1"
                    :disabled="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4"
                    :inactive-value="0"
                    class="m-r-5"
                  />
                  <IconTip
                    type="popover"
                    placement="top-start"
                    width="300"
                    trigger="hover"
                    content="订单信息填写完毕并核对无误后，可通过锁定金额的方式防止商务后期未经沟通擅改金额"
                    icon-class="iconwenhao"
                  />
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-if="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4" label="绑定视频：">
                <div v-if="formData.video.url" class="video flex">
                  <div v-if="formData.video.isDeleted" class="flex del-txt">
                    <span>(已删除)</span>
                    <div class="video-title text-over-hidden-1">{{ formData.video.titleName }}</div>
                  </div>
                  <el-link
                    v-else
                    type="primary"
                    class="text-over-hidden-1"
                    :href="formData.video.url"
                    :underline="false"
                    target="_blank"
                  >
                    {{ formData.video.titleName }}
                  </el-link>
                </div>
                <span v-else>--</span>
              </el-form-item>
              <el-form-item v-else label="绑定视频：">
                <el-button
                  v-if="!formData.video.titleName"
                  type="primary"
                  @click="handleShowVideoDialog"
                >选择视频</el-button>
                <div v-else class="video flex">
                  <div v-if="formData.video.isDeleted" class="flex del-txt">
                    <span>(已删除)</span>
                    <div class="video-title text-over-hidden-1">{{ formData.video.titleName }}</div>
                  </div>
                  <el-link
                    v-else
                    type="primary"
                    class="text-over-hidden-1"
                    :href="formData.video.url"
                    :underline="false"
                    target="_blank"
                  >{{ formData.video.titleName }}</el-link>
                  <el-link
                    v-if="+formData.workerStatus !== 3"
                    type="danger"
                    :underline="false"
                    @click="handleDelect"
                  >删除</el-link>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="视频发布时间：">
                {{ formData.video.addTime | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="撤单：">
                <template v-slot:label>
                  <span>撤单</span>
                  <IconTip
                    type="popover"
                    content="订单状态为已核账时，订单不支持再勾选为撤单，若需撤单，需先联系财务取消已核账的选项"
                    icon-class="iconwenhao"
                  />
                </template>
                <template v-if="type === 'view'">
                  {{ formData.cancelOrderStatus ? '是' : '否' }}
                </template>
                <template v-else>
                  <el-checkbox
                    v-model="formData.cancelOrderStatus"
                    :disabled="+formData.workerStatus === 3"
                    :true-label="1"
                    :false-label="null"
                  />
                </template>
              </el-form-item>
            </el-col>

            <el-col v-if="formData.cancelOrderStatus" :span="12">
              <el-form-item label="撤单原因：" prop="cancelOrderReason">
                <template v-if="type === 'view'">
                  {{ formData.cancelOrderReason || '--' }}
                </template>
                <template v-else>
                  <el-input
                    v-model="formData.cancelOrderReason"
                    placeholder="请输入撤单原因"
                    type="textarea"
                    :disabled="+formData.workerStatus === 3"
                    maxlength="100"
                    show-word-limit
                  />
                </template>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <p class="form-title m-t-20">财务信息</p>
        <div class="form-border">
          <el-row>
            <el-col :span="8">
              <el-form-item label="销售收入：">
                {{ (formData.businessMoneyInfoBO || {}).flowMoney | emptyFill }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="销售成本：">{{
                formData.costMoney | emptyFill
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                label="执行金额："
              >{{ formData.executeMoney | emptyFill }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="达人分成：">{{
                formData.allOutMoney | emptyFill
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="绩效营收：">{{
                formData.performanceMoney | emptyFill
              }}</el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="已付客户返点：">{{
                formData.customerRebatePaid | emptyFill
              }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="是否已开发票：">
                {{
                  [0, 1].includes(formData.receiptStatus)
                    ? formData.receiptStatus
                      ? '是'
                      : '否'
                    : '--'
                }}
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="财务是否核账：">{{
                [0, 1].includes(formData.reconciliationStatus)
                  ? formData.reconciliationStatus
                    ? '是'
                    : '否'
                  : '--'
              }}</el-form-item>
            </el-col>
          </el-row>

          <!-- <OrderRemind v-if="$permission('order_remind')" ref="orderRemind" type="3" :work-id="+workId" /> -->
        </div>
        <p class="m-t-16 form-title">备注</p>
        <el-input
          v-model="formData.selfNote"
          maxlength="100"
          :disabled="type === 'view' || +formData.workerStatus === 3 || +formData.workerStatus === 4"
          class="note-input"
          type="textarea"
          placeholder="请输入备注"
          show-word-limit
        />
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="dialogConfirm"
      >确 定</el-button>
    </div>
    <VideoDialog
      v-if="showVideoDialog"
      v-model="showVideoDialog"
      :plat-id="formData.platId"
      :account-id="formData.accountId"
      :selected-video="formData.video"
      @success="handleChangeVideo"
    />
  </el-dialog>
</template>
<script>
import {
  defineAsyncComponent,
  defineComponent,
  ref,
  reactive,
  toRefs,
  getCurrentInstance,
  watch
} from '@vue/composition-api'
import day from 'dayjs'
import { UploadImg, IconTip, OrderRemind } from 'components'
import { $getOrderDetail, $editOrderDetail, $getDateStatus } from '@/api/proprietary-orders'
import { commonData } from '../_coms/hooks'
export default defineComponent({
  props: {
    workId: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    showAddDialog: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: Number,
      default: 0
    }
  },
  components: {
    VideoDialog: defineAsyncComponent(() =>
      import(
        '@/views/sign-manage/@pages/cooperative-project/_com/videoListDialog.vue'
      )
    ),
    UploadImg,
    IconTip,
    OrderRemind
  },
  setup(props, { emit }) {
    const { $message, $nextTick, $refs, $confirm, $alert } = getCurrentInstance().proxy
    const { projectTypeMap, orderStatusMap } = commonData()
    const formData = ref({
      video: {},
      finishTimeConfirm: '',
      cancelOrderStatus: '',
      cancelOrderReason: '',
      talentSharingRatio: 1,
      platOrderMoney: 0,
      businessMoneyInfoBO: {}
    })
    const states = reactive({
      loading: false,
      showVideoDialog: false,
      curFinishTime: ''
    })

    const addForm = ref('')
    const addFormRules = reactive({
      finishTimeConfirm: [
        {
          required: true,
          message: '请选择已定档期',
          trigger: 'change'
        }
      ],
      cancelOrderReason: [
        { required: true, message: '请输入撤单原因', trigger: ['change', 'blur'] }
      ],
      platOrderMoney: [
        {
          required: true,
          message: '请选择平台下单价',
          trigger: 'change'
        }
      ],
      platTaskId: [
        {
          required: true,
          message: '请输入平台任务ID',
          trigger: 'blur'
        }
      ]
    })
    const handleShowVideoDialog = () => {
      states.showVideoDialog = true
    }
    const handleChangeVideo = (selectVideo) => {
      formData.value.video = selectVideo.value
    }
    const handleDelect = () => {
      formData.value.video = {}
    }

    // 格式化数据 后端要求id和name都需要传递
    const formatData = () => {
      const { flowId, titleName, title, url } = formData.value.video
      const params = {
        workId: props.workId,
        finishTimeConfirm: formData.value.finishTimeConfirm,
        platTaskId: formData.value.platTaskId,
        lockMoney: formData.value.lockMoney,
        talentSharingRatio: formData.value.talentSharingRatio,
        platOrderMoney: formData.value.platOrderMoney,
        flowId,
        url,
        selfNote: formData.value.selfNote || '',
        title: titleName || title,
        cancelOrderStatus: formData.value.cancelOrderStatus,
        cancelOrderReason: formData.value.cancelOrderStatus ? formData.value.cancelOrderReason : ''
      }
      return params
    }
    const dialogConfirm = async() => {
      // try {
        await addForm.value.validate()
      // } catch (e) {
        // if ($refs.orderRemind.$refs.orderRemindForm) {
        //   await $refs.orderRemind.$refs.orderRemindForm.validate()
        // }
        // return
      // }

      // if ($refs.orderRemind.$refs.orderRemindForm) {
      //   await $refs.orderRemind.$refs.orderRemindForm.validate()
      // }

      const params = formatData()
      if (params.titleName) {
        params.title = params.titleName
        delete params.titleName
      }

      if (!(+params.cancelOrderStatus)) {
        params.cancelOrderReason = ''
        params.cancelOrderStatus = 0
      }

      // if ($refs.orderRemind.$refs.orderRemindForm) {
      //   const { reminderUserBOS, msg } = $refs.orderRemind.form
      //   params.feishuMsgSendRequest = {
      //     workId: props.workId,
      //     reminderUserBOS,
      //     msg
      //   }
      // }

      try {
        const res = await $editOrderDetail(params)
        states.loading = false
        if (res && res.code === 1) {
          emit('getList')
          emit('getStatistics')
          close()
           $message.success(res.message)
        } else {
          $message.error(res.message || '系统错误')
        }
      } catch (err) {
        $message.error('系统错误')
      }
    }
    const close = () => {
      emit('close')
    }
    if (['edit', 'view'].includes(props.type)) {
      states.loading = true
    }

    const handleToGetCurVal = (val) => {
      states.curFinishTime = val.displayValue
    }

    const handleToJudgeDq = (val) => {
      $getDateStatus({
        accountId: props.accountId,
        slotDate: val
      }).then(res => {
        const { status } = res.data
        if (status === 1) {
            $confirm(`该账号所选中的档期已存在工单，确认要继续选择${val}该天的档期？`, {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            }).then(() => {
              $message({
                type: 'success',
                message: '操作成功!'
              })
            }).catch(() => {
              $message({
                type: 'info',
                message: '操作失败'
              })
              formData.value.finishTimeConfirm = states.curFinishTime
            })
          } else if (status === 2) {
            $alert(`该账号所选中的档期显示已被封档，请选择其他日期`, {
              confirmButtonText: '确定',
              callback: () => {
                formData.value.finishTimeConfirm = states.curFinishTime
              }
            })
          }
        })
    }

    const getOrderDetail = async() => {
      if (['edit', 'view'].includes(props.type)) {
        try {
          const res = await $getOrderDetail({ workId: props.workId })
          if (res && res.code === 1) {
            const { projectType, title, url, addTime, flowId, isDeleted } =
              res.data || {}
            formData.value = res.data || {}
            formData.value = {
              ...formData.value,
              projectType: String(projectType),
              video: {
                titleName: title,
                url,
                flowId: flowId,
                addTime: addTime
                  ? day(addTime).format('YYYY-MM-DD HH:mm:ss')
                  : '',
                isDeleted: isDeleted || false
              }
            }
            if (!formData.value.video.titleName) {
              console.log('no video')
              addFormRules.platTaskId[0].required = false
            }
            console.log(addFormRules.platTaskId[0].required, 'addFormRules.platTaskId[0].required')
            console.log(formData.value, 'formData')
            $nextTick(() => {
              states.loading = false
            })
          }
        } catch (err) {
          $message.error('系统错误')
        }
      }
    }

    const handleChangeTalentSharingRatio = (val) => {
      formData.value.talentSharingRatio = val
    }

    const handleChangePlatformPrice = (val) => {
      formData.value.platOrderMoney = val
    }

     watch(() => formData.value.video, (newVal, oldVal) => {
        if (!oldVal.titleName && !newVal.titleName) {
          addFormRules.platTaskId[0].required = false
        } else if (oldVal.titleName && !newVal.titleName) {
          addFormRules.platTaskId[0].required = false
        } else {
          addFormRules.platTaskId[0].required = true
        }
      }, {
        deep: true
        // immediate: true
      })

    getOrderDetail()
    return {
      close,
      ...toRefs(states),
      addFormRules,
      formData,
      addForm,
      dialogConfirm,
      handleShowVideoDialog,
      handleChangeVideo,
      handleDelect,
      projectTypeMap,
      orderStatusMap,
      handleChangeTalentSharingRatio,
      handleChangePlatformPrice,
      handleToJudgeDq,
      handleToGetCurVal
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  &-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
  &-border {
    background: #eee;
    padding: 16px 32px;
  }
}
::v-deep {
  .video {
    .el-link--primary {
      width: 200px;
      font-size: 12px;
    }
    .el-link--danger {
      font-size: 12px;
      margin-left: 20px;
    }
  }
}
.del-txt {
  width: 48px;
  font-size: 12px;
  color: #aaa5a5;
}
.video-title{
  width: 200px;
}
</style>
