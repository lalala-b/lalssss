<template>
  <Wrap v-loading="loading">
    <div data-bold class="flex flex-justify-between m-b-20">
      <h2 class="title flex flex-algin-center">审核信息<p class="check-tip">*平台消耗金额 < 3w的订单由团长审核，平台消耗金额 >= 3w的订单由军长审核。</p></h2>
      <EditItem
        v-if="showAction"
        v-model="isEdit"
        @handleSave="handleSave"
        @handleCancel="handleCancel"
        @changeShowPass="changeShowPass"
      />
    </div>
    <template v-if="!showReject">
      <div v-if="showType === 1" class="check-info-wrap">
        <h3 v-if="$orderData.deliveryExamineRecordVO.examineStatus === 1" class="check-pass">订单申请已通过！</h3>
        <h3 v-else class="check-reject">订单申请被驳回，请修改订单信息后重新提交！</h3>
        <!-- <EditDirector v-if="isEdit&&$orderData.deliveryExamineRecordVO.editDirectorAuth&&$orderData.deliveryExamineRecordVO.examineStatus !== 2" ref="EditDirector" v-model="choreographerId" /> -->
        <EditDirector v-if="showEditDirector" ref="EditDirector" v-model="choreographerId" :fund-list="fundList" />
        <div class="flex check-info-data">
          <p v-if="!showEditDirector&&$orderData.deliveryExamineRecordVO.choreographerName"><span class="red-tip">* </span>编导人员：{{ $orderData.deliveryExamineRecordVO.choreographerName }}</p>
          <p>审核人：{{ $orderData.deliveryExamineRecordVO.userName }}</p>
          <p>审核时间：{{ $orderData.deliveryExamineRecordVO.createdTime }}</p>
        </div>
        <p v-if="$orderData.deliveryExamineRecordVO.note || $orderData.deliveryExamineRecordVO.examineStatus !== 1" class="check-note">{{ title }}：{{ $orderData.deliveryExamineRecordVO.note }}</p>
      </div>
      <EditDirector v-if="showPass" ref="EditDirector" v-model="choreographerId" :fund-list="fundList" />
      <p v-if="showType === 4" class="status-tip">订单审核处理中…</p>
      <p v-if="showType === 2" class="status-tip">已取消</p>
      <ButtonItem v-if="showType === 3&&!showPass" :loading="loading" :is-disabled="!!$orderData.midDeliveryVideoNewBaseInfoBO.defriendFlag" @success="handlePassClick" @reject="handleRejectClick">
        <template slot="title">
          <p v-if="$orderData.midDeliveryVideoNewBaseInfoBO.accountLimitAlarmFlag" class="flex flex-align-center">
            该账号{{ $orderData.midDeliveryVideoNewBaseInfoBO.curOrderMonth }}已有{{ $orderData.midDeliveryVideoNewBaseInfoBO.curOrderPuttingCount || 0 }}条审核通过的有效订单（不含已取消/已驳回）！
            <el-link type="primary" :underline="false" style="font-size: 16px" @click="showAccountOrderList = true"><i class="el-icon-view el-icon--right" />查看详情</el-link>
          </p>
          <p class="btn-item_tip">该订单是否审核通过？</p>
        </template>
      </ButtonItem>
    </template>
    <Reject v-if="showReject" v-model="note" />
    <AccountOrderList v-if="showAccountOrderList" v-model="showAccountOrderList" :info="$orderData.midDeliveryVideoNewBaseInfoBO" />
  </Wrap>
</template>
<script>
import { $updateCheckOrder, $editChoreographer, $getFundUsers } from '@/api/putting-manager'
import ButtonItem from './_com/ButtonItem'
import EditItem from './_com/EditItem'
import Reject from './Reject'
import EditDirector from './EditDirector.vue'
import AccountOrderList from './AccountOrderList'
// businessStatus:
// 1：一级待审核（1.5W以下需一级审核）
// 2：二级待审核（1.5W及以上需二级审核）
// 5：待下单付款
// 6：待发布提交
// 7：待资金核算
// 8：已驳回
// 9：已取消
// 10：已完成
export default {
  components: { ButtonItem, Reject, EditItem, AccountOrderList, EditDirector },
  data() {
    return {
      showReject: false,
      isEdit: true,
      note: '',
      loading: false,
      showAccountOrderList: false,
      personnelList: [],
      choreographerId: '',
      formData: {},
      showPass: false,
      showEditDirector: false,
      fundList: []
    }
  },
  inject: ['$orderData'],
  computed: {
    showType() {
      if (this.$orderData.deliveryExamineRecordVO) {
        // 显示审核信息
        return 1
      } else if (this.$orderData.businessStatus === 8) {
        // 审核前取消 显示订单已取消
        return 2
      } else if (this.$orderData.examineAuth === 1) {
        // 有操作权限 显示按钮
        return 3
      } else {
        // 显示等待等待审核
        return 4
      }
    },
    showAction() {
      // examineStatus:1通过 2不通过
      // editDirectorAuth:编辑编导的权限，0-无权限 1-有权限]
      const obj = this.$orderData.deliveryExamineRecordVO || {}
      // 待资金核算之前都可以修改编导人员
      return this.showReject || this.showPass || !!obj.editDirectorAuth && +obj.examineStatus === 1 && this.$orderData.businessStatus < 7
    },
    title() {
      return this.$orderData.deliveryExamineRecordVO && this.$orderData.deliveryExamineRecordVO.examineStatus === 1 ? '备注' : '驳回原因'
    }
  },
  watch: {
    $orderData: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.deliveryExamineRecordVO) {
          const choreographerId = val.deliveryExamineRecordVO.choreographerId
          this.choreographerId = choreographerId || ''
        }
      }
    }
  },
  created() {
    this.getFundUser()
  },
  methods: {
    changeShowPass(val) {
      this.showEditDirector = val
    },
    // 审核通过
    handlePassClick() {
      this.showPass = true
      this.isEdit = true
    },
    handleRejectClick() {
      this.showReject = true
    },
    // 驳回保存
    async handleSave(fn) {
      if ((this.showPass || this.isEdit) && !this.showReject) {
        if (!this.choreographerId) {
          fn()
          const $editDirector = this.$refs.EditDirector
          await $editDirector.validateForm()
        }
        try {
          const deliveryExamineRecordVO = this.$orderData.deliveryExamineRecordVO || {}
          if (+deliveryExamineRecordVO.examineStatus === 1) {
            await this.editChoreographer()
            fn()
            this.showEditDirector = false
            this.isEdit = false
          } else {
            await this.updateCheckOrder(1)
            fn()
          }
        } catch (err) {
          console.error(err)
          fn()
        }
      } else {
      if (!this.note) {
        fn()
        return this.$message.error('请输入备注')
      }
      try {
        await this.updateCheckOrder(2, this.note)
        this.showReject = false
      } catch (err) { console.error(err) }
      fn()
       }
    },
    // 驳回取消
    handleCancel() {
      this.showReject = false
      this.showPass = false
    },
    // 编辑编导人员
    editChoreographer() {
      this.loading = true
      return $editChoreographer({
        orderId: this.$route.query.orderId,
        choreographerId: this.choreographerId
      }).then(res => {
         this.loading = false
        if (res.code === 1) {
          this.$emit('update')
          this.$message.success('修改成功')
        } else {
          const message = res.message || ''
          if (message.indexOf('投放次数' || '已达上限') > -1) {
            this.$emit('handleBusinessDialog')
          } else {
            this.$message.error(res.message)
          }
          return Promise.reject()
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message || '网络出错')
      }).finally(_ => {
      })
    },
    // 审核
    updateCheckOrder(examineStatus, note) {
      this.loading = true
      return $updateCheckOrder({
        orderId: this.$route.query.orderId,
        examineStatus: examineStatus,
        note: note,
        choreographerId: this.showPass ? this.choreographerId : ''
      }).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$emit('update')
          this.$message.success('操作成功')
        } else {
          this.$message.error(res.message)
          return Promise.reject()
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message || '网络出错')
      }).finally(_ => {
        this.loading = false
      })
    },
    getFundUser() {
      $getFundUsers().then(res => {
        if (+res.code === 1) {
          this.fundList = res.data || []
        }
      })
    }
  }
}
</script>
