<template>
  <Wrap>
    <div data-bold class="flex flex-justify-between">
      <h2 class="title">订单付款信息</h2>
      <EditItem v-if="showAction || shouldShowAction" v-model="isEdit" @handleSave="handleSave" @handleCancel="handleCancel" />
      <div v-else-if="$orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.reAddOrderCount === 1" class="flex flex-justify-end">
        <el-button :loading="recLoading" size="mini" type="primary" class="order-again" @click="handleOrderAgain">达人未接单<br>申请重新下单</el-button>
      </div>
    </div>
    <div class="flex flex-dir-col flex-justify-center flex1">
      <PayDialog v-if="showType === 1 || showPayDialog" ref="payDialog" :show.sync="showPayDialog" :is-edit="isEdit" @handleShowLink="handleShowLink" @handleBusinessDialog="handleBusinessDialog" />
      <div v-if="showType === 2" class="check-info-wrap">
        <h3 class="check-reject">订单申请被驳回，请修改订单信息后重新提交！</h3>
        <div class="flex check-info-data">
          <p>审核人：{{ $orderData.orderPaymentInfoVO.userName }}</p>
          <p>审核时间：{{ $orderData.orderPaymentInfoVO.createdTime }}</p>
        </div>
        <p v-if="$orderData.orderPaymentInfoVO.note" class="check-note">驳回原因：{{ $orderData.orderPaymentInfoVO.note }}</p>
      </div>
      <p v-if="showType === 3" class="status-tip">未开始</p>

      <ButtonItem v-if="showType === 4 && !showPayDialog && !showReject" title="订单审批通过进行下单付款？" :is-disabled="!!$orderData.midDeliveryVideoNewBaseInfoBO.defriendFlag" @success="handlePassClick" @reject="handleRejectClick" />
      <p v-if="showType === 5" class="status-tip">订单审批下单付款处理中...</p>
      <Reject v-if="showReject" ref="reject" v-model="note" />
    </div>
    <LinkInfo v-if="showLink" :show.sync="showLink" />
  </Wrap>
</template>
<script>
import { $updatePayMoney, $reAddOrder } from '@/api/putting-manager'
import ButtonItem from './_com/ButtonItem'
import PayDialog from './PayDialog'
import EditItem from './_com/EditItem'
import Reject from './Reject'
import LinkInfo from './LinkInfo'
export default {
  components: {
    ButtonItem,
    PayDialog,
    EditItem,
    Reject,
    LinkInfo
  },
  data() {
    return {
      showAction: false,
      isEdit: false,
      showPayDialog: false,
      showReject: false,
      note: '',
      showLink: false,
      recLoading: false
    }
  },
  inject: ['$orderData'],
  computed: {
    showType() {
      if (this.$orderData.orderPaymentInfoVO) {
        if (this.$orderData.orderPaymentInfoVO.xtAccountId) {
          // 显示付款信息
          return 1
        } else {
          // 显示驳回信息
          return 2
        }
      } else if (this.$orderData.businessStatus === 5) {
        if (this.$orderData.examineAuth === 1) {
          // 有操作权限 显示按钮
          return 4
        } else {
          // 显示等待等待审核
          return 5
        }
      } else {
        return 3
      }
    },
    shouldShowAction() {
      // businessStatus 1：一级待审核（1.5W以下需一级审核）2：二级待审核（1.5W及以上需二级审核）5：待下单付款 6：待发布提交7：待资金核算8：已驳回 9：已取消 10：已完成',
      return !([10, 9, 8].includes(this.$orderData.businessStatus)) && this.$orderData.orderPaymentInfoVO && this.$orderData.orderPaymentInfoVO.editAuth === 1
    }
  },
  methods: {
    // 点击通过按钮
    handlePassClick() {
      this.isEdit = true
      this.showPayDialog = true
      this.showAction = true
    },
    // 点击驳回按钮
    handleRejectClick() {
      this.isEdit = true
      this.showAction = true
      this.showReject = true
    },
    handleSave(fn) {
      const orderId = this.$route.query.orderId
      if (this.showPayDialog || this.showType === 1) {
        // 通过保存
        this.$refs.payDialog.handleSave().then(_ => {
          this.showPayDialog = true
          this.isEdit = false
          this.$emit('update')
        }).finally(fn)
      } else {
        if (!this.note) {
          fn()
          return this.$message.error('请填写驳回原因')
        }
        // 驳回保存
        this.updateCheckPay({
          examineStatus: 2,
          orderId,
          note: this.note
        }).then(res => {
          this.showAction = false
        }).finally(fn)
      }
    },
    updateCheckPay(params) {
      return $updatePayMoney(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.isEdit = false
          this.showReject = false
          this.$emit('update')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleCancel() {
      if (this.$orderData.orderPaymentInfoVO) {
        // 已点击通过/驳回
        this.isEdit = false
      } else {
        this.showPayDialog = false
        this.showAction = false
        this.showReject = false
      }
    },
    handleShowLink() {
      this.showLink = true
    },
    // 重新下单
    handleOrderAgain() {
      this.$confirm('是否确认达人未接单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.recLoading = true
         $reAddOrder({ orderId: this.$orderData.midDeliveryVideoNewBaseInfoBO.orderId }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$emit('update')
        } else {
          this.$message.error(res.message)
        }
        this.recLoading = false
      }).catch(err => {
        this.$message.error(err.message)
        this.recLoading = false
      })
      })
    },
    handleBusinessDialog() {
      this.$emit('handleBusinessDialog')
    }
  }
}
</script>
<style lang="scss">
  .status-tip {
    font-size: 16px;
  }
</style>
