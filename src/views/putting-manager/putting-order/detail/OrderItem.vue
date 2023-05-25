<template>
  <Wrap>
    <div data-bold class="flex flex-justify-between flex-align-center m-b-20">
      <h2 class="title">订单申请信息</h2>
      <EditItem
        v-if="showAction"
        v-model="isEdit"
        :show-edit-btn="showEditBtn"
        @handleSave="handleSaveClick"
        @handleCancel="handleCancel"
      >
        <el-button
          v-if="showPriceEditBtn"
          type="danger"
          icon="el-icon-edit"
          size="small"
          @click="handlePriceChange"
        >
          订单改价
        </el-button>
      </EditItem>
    </div>
    <OrderInfo ref="orderInfo" :line="4" :show-edit-btn="showEditBtn" :page-type="pageType" :form-data="formData" @handleOrderDetail="handleOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
  </Wrap>
</template>
<script>
import EditItem from './_com/EditItem'
import OrderInfo from '../../component/OrderInfo'
export default {
  components: {
    EditItem,
    OrderInfo
  },
  data() {
    return {
      isEdit: false,
      isPrice: false
    }
  },
  inject: ['$orderData'],
  computed: {
    // 是否显示右上角操作按钮
    showAction() {
      return this.showPriceEditBtn || this.showEditBtn || this.showComadnBtn && this.$orderData.businessStatus !== 9
    },
    // 是否显示编辑按钮
    showEditBtn() {
      return this.$orderData.midDeliveryVideoNewBaseInfoBO.editAuth === 1
    },
    // 口令编辑
    showComadnBtn() {
      return this.$orderData.midDeliveryVideoNewBaseInfoBO.commandEditAuth
    },
    // 是否显示订单改价按钮
    showPriceEditBtn() {
      // 5-待下单付款 6-待发布提交 7-待资金核算  审核通过后，资金核算前
      return [5, 6, 7, 17].includes(this.$orderData.businessStatus) && this.$permission('putting_order_edit_price')
    },
    formData() {
      return { ...this.$orderData.midDeliveryVideoNewBaseInfoBO }
    },
    // normal 默认编辑 || price 订单改价 || command 口令编辑 || complete 订单完成状态 || fail 订单驳回状态 || place 下单
    pageType() {
      if (!this.isEdit) {
        return 'detail'
      }
      const businessStatus = this.$orderData.businessStatus
      if (this.isPrice) {
        // 订单改价
        return 'price'
      }
      if (this.showEditBtn) {
        if (businessStatus === 10) {
          // 订单完成状态
          return 'complete'
        }
        if (businessStatus === 8) {
          return 'fail'
        }
      } else if (this.$orderData.midDeliveryVideoNewBaseInfoBO.commandEditAuth) {
        return 'command'
      }
      return 'normal'
    }
    // editAuth() {
    //   return this.$orderData.midDeliveryVideoNewBaseInfoBO.editAuth || (this.$orderData.midDeliveryVideoNewBaseInfoBO.commandEditAuth ? 1 : 2)
    // }
  },
  watch: {
    isEdit(value) {
      this.$refs.orderInfo.clearValidate()
    }
  },
  methods: {
    handlePriceChange(e) {
      e.stopPropagation()
      this.isEdit = true
      this.isPrice = true
    },
    handleSaveClick(fn, successFn) {
      this.$refs.orderInfo.handleEditSave().then(res => {
        if (res) {
          this.$orderData.midDeliveryVideoNewBaseInfoBO = res
          this.isEdit = false
          this.$emit('update')

          typeof successFn === 'function' ? successFn() : null
        }
      }).finally(fn)
    },
    handleCancel() {
      this.isPrice = false
    },
    handleOrderDetail() {
      this.$emit('update')
    },
    handleBusinessDialog(val) {
      this.$emit('handleBusinessDialog', val)
    }
  }
}
</script>
