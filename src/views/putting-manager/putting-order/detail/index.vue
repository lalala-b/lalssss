<template>
  <div v-loading="loading">
    <Wrap>
      <h2 data-bold class="order-status flex flex-align-center flex-justify-between m-b-20">{{ tipText }}
        <div class="order-status-right">
          <el-button v-if="orderData.businessStatus === 8 && orderData.examineAuth === 1" :loading="recLoading" type="primary" size="small" @click="handleReSubmitOrder">重新提交审核</el-button>
          <el-button
            v-if="(orderData.businessStatus == 2 || orderData.businessStatus == 1 || orderData.businessStatus == 8) && orderData.midDeliveryVideoNewBaseInfoBO.editAuth === 1"
            type="primary"
            size="small"
            @click="handleOrderCancel"
          >取消订单</el-button>
        </div>
      </h2>
      <div class="flex flex-align-center order-info-data m-t-24">
        <span>订单号：{{ orderData.midDeliveryVideoNewBaseInfoBO.orderNumber }}</span>
        <template v-if="orderData.midDeliveryVideoNewBaseInfoBO.requirementId">
          <span>广告师：{{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserRealname }}({{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserorgNameD }}-{{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserOrgNameF }})</span>
          <span>投放专员：{{ orderData.midDeliveryVideoNewBaseInfoBO.deliveryName }}</span>
        </template>

        <span v-else>申请人：{{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserRealname }}（{{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserorgNameD }}-{{ orderData.midDeliveryVideoNewBaseInfoBO.advertiserOrgNameF }}）</span>
        <span>订单创建时间：{{ orderData.midDeliveryVideoNewBaseInfoBO.createdTime }}</span>
      </div>
      <el-steps v-if="showSteps" class="m-t-24" :active="active" finish-status="success" :align-center="true">
        <el-step title="投放申请" />
        <el-step title="订单审核" />
        <el-step title="下单付款" />
        <el-step title="提交视频" />
        <template v-if="[25,26].includes(+queryPlatId)">
          <el-step title="平台订单完成" />
        </template>
        <el-step title="资金核算" />
        <el-step title="订单完成" />
      </el-steps>
    </Wrap>
    <!-- 订单申请信息 -->
    <OrderItem class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    <!-- 审核信息 -->
    <CheckOrder class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    <!-- 订单付款信息 -->
    <PayItem class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    <template v-if="+orderData.midDeliveryVideoNewBaseInfoBO.platId===26">
      <!-- 第三方视频信息:快手 -->
      <ThirdVideoItemKs class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    </template>
    <template v-if="+orderData.midDeliveryVideoNewBaseInfoBO.platId===25">
      <!-- 第三方视频信息:抖音 -->
      <ThirdVideoItemDy class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    </template>
    <!-- 视频信息 -->
    <ViedeoItem class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    <!-- 资金核算 -->
    <CheckMoney class="card-wrap m-t-16" @update="getOrderDetail" @handleBusinessDialog="handleBusinessDialog" />
    <businessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="orderData.midDeliveryVideoNewBaseInfoBO.accountId" :business-line="orderData.midDeliveryVideoNewBaseInfoBO.businessTag" :business-line-date="businessLineDate" />
  </div>
</template>
<script>
import { $getOrderDetail, $cancelOrder, $reSubmitOrder } from '@/api/putting-manager'
import OrderItem from './OrderItem'
import PayItem from './PayItem'
import CheckOrder from './CheckOrder'
import ThirdVideoItemKs from './ThirdVideoItemKs'
import ThirdVideoItemDy from './ThirdVideoItemDy'
import ViedeoItem from './ViedeoItem.vue'
import CheckMoney from './CheckMoney'
import businessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'

const TIP_TEXT = {
  '1': ['请尽快审核订单！', '等待订单审核！'],
  '2': ['请尽快审核订单！', '等待订单审核！'],
  '5': ['订单已审核通过，请及时在星图/快接单等第三方平台完成下单付款！', '等待订单审批完成下单付款！'],
  '6': ['已在星图/快接单等第三方平台完成下单付款！请尽快联系达人发布视频，然后提交视频相关信息！', '等待达人发布视频后提交视频相关信息！'],
  '7': ['请及时核算补款/返款/合同等信息，确认订单资金流已完结！', '等待订单资金收支确认！'],
  '8': ['订单已被驳回，请修改订单信息重新提交或取消订单！', '订单已被驳回。'],
  '9': ['申请人已取消订单！', '达人放弃合作，订单已取消！', '我司放弃合作，订单已取消！'],
  '10': ['可直接查看视频投放效果！', '达人放弃合作，订单已取消！', '我司放弃合作，订单已取消！']
}
// 没有平台订单完成状态的步骤映射值
const ACTIVE_MAP = {
  '1': 1,
  '2': 1,
  '5': 2,
  '6': 3,
  '7': 5,
  '17': 4, // 该状态仅抖音和快手有
  '10': 7
}
export default {
  components: {
    OrderItem,
    CheckOrder,
    PayItem,
    ViedeoItem,
    ThirdVideoItemKs,
    ThirdVideoItemDy,
    CheckMoney,
    businessLinePutDialog
  },
  data() {
    return {
      recLoading: false,
      showPlayingDialog: false,
      isEditOfOrderInfo: false,
      orderData: {
        examineAuth: 2,
        businessStatus: 1, // 订单状态 1：一级待审核（1.5W以下需一级审核）2：二级待审核（1.5W及以上需二级审核）5：待下单付款 6：待发布提交7：待资金核算8：已驳回 9：已取消 10：已完成',
        midDeliveryVideoNewBaseInfoBO: {}, // 订单基本信息
        deliveryExamineRecordVO: null, // 审核信息
        orderPaymentInfoVO: null, // 下单付款信息
        videoExamineInfoVO: null, // 视频审核信息
        fundAccountingInfoVO: null, // 资金核算信息
        thirdPlatVideoInfo: null // 第三方平台信息
      },
      queryPlatId: '',
      loading: true,
      showBusinessLineDialog: false,
      businessLineDate: ''
    }
  },
  computed: {
    active() {
        return ACTIVE_MAP[this.orderData.businessStatus]
    },
    showSteps() {
      return [1, 2, 5, 6, 7, 10, 17].includes(this.orderData.businessStatus)
    },
    tipText() {
      const text = TIP_TEXT[this.orderData.businessStatus]
      if (text) {
        if (this.orderData.businessStatus === 9) {
          // 已取消
          if (this.orderData.videoExamineInfoVO) {
            if (+this.orderData.videoExamineInfoVO.orderCooperationStatus === 2) {
              return text[2]
            } else {
              return text[1]
            }
          }
          return text[0]
        }
        if (text.length === 1) {
          return text[0]
        }
        if (this.orderData.businessStatus === 10) {
          if (this.orderData.videoExamineInfoVO && +this.orderData.videoExamineInfoVO.orderCooperationStatus === 1) {
            return text[1]
          } else if (this.orderData.videoExamineInfoVO && +this.orderData.videoExamineInfoVO.orderCooperationStatus === 2) {
            return text[2]
          } else {
            return text[0]
          }
        }
        return this.orderData.examineAuth === 1 ? text[0] : text[1]
      }
      return ''
    }
  },
  async created() {
    this.loading = true
    this.orderId = this.$route.query.orderId
    this.queryPlatId = this.$route.query.platId
    await this.getOrderDetail()
    this.$nextTick(() => {
      const scroll = this.$route.query.scroll
      if (!scroll) {
        return
      }
      document.querySelectorAll('.card-wrap')[scroll].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'start'
      })
    })
  },
  provide() {
    return {
      $orderData: this.orderData
    }
  },
  methods: {
    getOrderDetail(cb) {
      return new Promise((resolve, reject) => {
        this.loading = true
        const orderId = this.orderId
        $getOrderDetail({ orderId }).then(res => {
          if (res.code === 1) {
            const baseInfo = res.data.midDeliveryVideoNewBaseInfoBO
            if (baseInfo && baseInfo.deliveryWordOfCommandBOList) {
              baseInfo.deliveryWordOfCommandBOList = {
                list: baseInfo.deliveryWordOfCommandBOList,
                beDependentOrderNumber: baseInfo.beDependentOrderNumber,
                addCommandType: baseInfo.addCommandType
              }
            }
            for (const key in this.orderData) {
              this.orderData[key] = res.data[key]
            }
            this.$nextTick(() => {
              resolve()
              typeof cb === 'function' ? cb() : null
              this.$bus.$emit('handleCancel')
            })
          } else {
            this.$message.error(res.message)
            reject()
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }

          this.$message.error(err.message || '网络错误')
          reject()
        }).finally(_ => {
          this.loading = false
        })
      })
    },
    // 重新申请
    handleReSubmitOrder() {
      this.recLoading = true
      $reSubmitOrder({
        orderId: this.orderId
      }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.getOrderDetail()
        } else {
          this.$message.error(res.message || '网络错误')
        }
        this.recLoading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message || '网络错误')
      })
    },
    // 取消订单
    async handleOrderCancel() {
      const orderId = this.orderId
      await this.handleConfirm('确定取消订单?')
      $cancelOrder({ orderId }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.getOrderDetail()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    handleConfirm(title) {
      return this.$confirm(title, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    handleBusinessDialog(val) {
      // 业务线投放上线接口参数时间调整,
      // 1.取handleBusinessDialog有传递值
      // 2.如果有视频则取视频的最小时间，否则取当前详情的预计发布时间，
      this.showBusinessLineDialog = true
      if (val) {
        this.businessLineDate = val
      } else {
        this.businessLineDate = this.$orderData.midDeliveryVideoNewBaseInfoBO.preReleaseVideoTime
        if (this.$orderData.videoExamineInfoVO && this.$orderData.videoExamineInfoVO.deliveryRelationVideoDetailBOList.length) {
          const list = []
          this.$orderData.videoExamineInfoVO.deliveryRelationVideoDetailBOList.forEach(item => {
            list.push(item.addTime)
          })
          this.businessLineDate = list.sort((a, b) => a - b)[0]
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .card-wrap {
    ::v-deep {
      .el-form {
        &-item__label {
          color: rgba(0, 0, 0, 0.85);
          font-size: 14px;
        }
        .el-input,
        .el-select,
        .el-input-number {
          width: 200px;
        }
        .el-textarea {
          width: 614px;
        }
      }
      .title {
        font-size: 20px;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 24px;
      }
      .check-tip {
        font-size: 16px;
        color: #999999;
        margin-left: 11px;
      }
      .check-info-wrap {
        h3 {
          font-size: 16px;
          color: #272727;
          line-height: 22px;
          margin-bottom: 24px;
          &.check-pass {
          color: $--color-success;
          }
          &.check-reject {
            color: $--color-danger;
          }
        }
      }
      .check-info-data {
        p {
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
          line-height: 20px;
          &:nth-child(n+2) {
            margin-left: 231px;
          }
        }
      }
      .status-tip {
        font-size: 16px;
        color: #8C8C8C;
        line-height: 22px;
        margin-top: 20px;
      }
      .check-note {
        margin-top: 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        line-height: 20px;
      }
      .m-b-20 {
        margin-bottom: 20px
      }
    }
  }
  .order-info-data {
    > span {
      margin-right: 157px;
      font-size: 14px;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>
