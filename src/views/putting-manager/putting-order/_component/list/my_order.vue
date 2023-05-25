<template>
  <div class="C-putting-order-my">
    <!-- 筛选 -->
    <orderSearch :plat-data="platData" :account-data="accountData" :delivery-data="deliveryData" :tab-type="type" :business-status="activeName" @getTableData="getSearchData" />
    <!-- 数据汇总 -->
    <orderData :data="orderData" :cols="orderDataCols" :loading="orderLoading" />
    <!-- 状态 -->
    <div class="tab-body">
      <div class="flex">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane v-for="item in tabs" :key="item.name" :name="item.name">
            <span slot="label">
              <template v-if="item.hasHigh && item.val">
                {{ item.label }} <i class="icon-high">{{ `${typeof item.val === 'number' ? `${item.val || 0}` : ''}` }}</i>
              </template>
              <template v-else>
                {{ item.label }} {{ `${typeof item.val === 'number' ? `(${item.val || 0})` : ''}` }}
              </template>
            </span>
          </el-tab-pane>
        </el-tabs>

        <div class="m-l-24 flex">
          <div>
            <span class="m-r-10">是否审批下单付款通过</span>
            <el-radio-group
              v-model="orderPaymentFlag"
              :disabled="+activeName !== 5"
              @change="handleChangeOrderPaymentFlag"
            >
              <el-radio :label="1">
                是
                <IconTip
                  class="iconTip"
                  type="popover"
                  content="审批通过，已在星图/磁力平台下单但未填写平台订单ID，若为改价单则需联系达人先同意改价。"
                  icon-class="iconwenhao"
                />
              </el-radio>
              <el-radio :label="0">
                否
                <IconTip
                  class="iconTip"
                  type="popover"
                  content="订单尚未进行审批，未在星图/磁力平台下单。"
                  icon-class="iconwenhao"
                />
              </el-radio>
            </el-radio-group>
            <el-button :disabled="+activeName !== 5" type="text" class="clearButton" @click="handleClearOrderPaymentFlag">清除</el-button>
          </div>
          <div>
            <span class="m-r-10">是否编导确认视频</span>
            <el-radio-group
              v-model="videoPublishFlag"
              :disabled="+activeName !== 6"
              @change="handleChangeVideoPublishFlag"
            >
              <el-radio :label="1">
                是
              </el-radio>
              <el-radio :label="0">
                否
              </el-radio>
            </el-radio-group>
            <el-button :disabled="+activeName !== 6" type="text" class="clearButton" @click="handleClearVideoPublishFlag">清除</el-button>
          </div>
        </div>
      </div>
      <!-- <orderSort @update="getTableData" /> -->
      <orderTable
        ref="orderTable"
        class="m-t-16"
        :has-back="true"
        :data="tableData"
        :tab-type="type"
        :loading="loading"
        :active-name="activeName"
        @update="getTableData"
        @sort="sort"
      />
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="size"
          :total="total"
          :current-page.sync="pageNum"
          @current-change="getPageData"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { IconTip } from 'components'
import orderSearch from './order_search.vue'
import orderData from './order_data.vue'
import orderTable from './order_table.vue'
// import orderSort from './order_sort.vue'
import { $getSelfOrder } from '@/api/putting-manager'

const defaultOrderNum = { key: '订单数量', finishVideoSubmitNum: 0, orderCancelNum: 0, totalOrderNum: 0, waitOrderReviewerNum: 0, waitVideoSubmitNum: 0 }
const defaultOrderAmount = { key: '平台消耗金额', finishVideoSubmitAmount: 0, orderCancelAmount: 0, totalOrderAmount: 0, waitOrderReviewerAmount: 0, waitVideoSubmitAmount: 0 }
const defaultTabs = [
  {
    name: '',
    label: '全部',
    val: null
  },
  {
    name: '1,2',
    label: '待审核',
    val: null
  },
  {
    name: '5',
    label: '待下单付款',
    val: null
  },
  {
    name: '6',
    label: '待发布提交',
    val: null
  },
  {
    name: '7',
    label: '待资金核算',
    val: null
  },
  {
    name: '8',
    label: '已驳回',
    val: null
  },
  {
    name: '9',
    label: '已取消'
  },
  {
    name: '10',
    label: '已完成'
  }
]

export default {
  components: {
    orderSearch, orderData, orderTable, IconTip
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    platData: {
      type: Array,
      default() {
        return []
      }
    },
    accountData: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      orderLoading: false,
      activeName: '',
      params: {},
      orderDataCols: ['申请订单', '待处理审批', '待发布视频', '已发布视频', '已取消订单'],
      orderData: [
        { ...defaultOrderNum },
        { ...defaultOrderAmount }
      ],
      tableData: [],
      tabs: JSON.parse(JSON.stringify(defaultTabs)),
      pageNum: 1,
      size: 10,
      total: 0,
      waitFundRevieweFlag: 0,
      determined: '',
      businessStatus: '',
      searchData: null,
      orderPaymentFlag: '',
      videoPublishFlag: ''
    }
  },
  created() {
    this.businessStatus = this.activeName
    this.getTableData({
      businessStatus: this.activeName
    })
  },
  methods: {
    getSearchData(params) {
      this.searchData = params
      this.getTableData(params)
    },
    sort(order) {
      this.pageNum = 1
      this.determined = order
      this.getTableData({}, false)
    },
    getPageData(pageNum) {
      // console.log(pageNum, '--pageNum')
      this.getTableData()
    },
    handleClick(e) {
      this.determined = ''
      this.$refs.orderTable.$refs.table.clearSort()
      this.businessStatus = e.name
      this.orderPaymentFlag = ''
      this.videoPublishFlag = ''
      this.pageNum = 1
      this.getTableData({
        businessStatus: e.name,
        orderPaymentFlag: '',
        videoPublishFlag: ''
      }, false)
    },

    // 是否审批下单付款通过
    handleChangeOrderPaymentFlag(e) {
      this.getTableData({
        orderPaymentFlag: e
      }, false)
    },

    // 是否广告师确认视频
    handleChangeVideoPublishFlag(e) {
       this.getTableData({
        videoPublishFlag: e
      }, false)
    },

    // 清除是否审批下单付款通过的选项
    handleClearOrderPaymentFlag() {
      this.orderPaymentFlag = ''
      this.getTableData({
        orderPaymentFlag: ''
      }, false)
    },

    // 清除是否广告师确认视频的选项
    handleClearVideoPublishFlag() {
      this.videoPublishFlag = ''
      this.getTableData({
        videoPublishFlag: ''
      }, false)
    },

    getSelfOrder(params) {
      // console.log('getSelfOrder')
      // eslint-disable-next-line no-async-promise-executor
      return new Promise(async(resolve, reject) => {
        const res = await $getSelfOrder(params)
        if (res.code === 1) {
          resolve(res.data)
        } else {
          reject()
        }
      })
    },
    getTableData(params, hasOrderLoading = true) {
      this.loading = true
      if (hasOrderLoading) {
        this.orderLoading = true
      }
      params = Object.assign({}, this.searchData, params || {}, { pageNum: this.pageNum, size: this.size, determined: this.determined, businessStatus: this.businessStatus })
      if (params.businessStatus) {
        params.businessStatus = params.businessStatus == 0 ? null : params.businessStatus
      }
      this.params = params
      this.getSelfOrder(params).then(data => {
        const { orderNumVO, platConsumeAmountVO, orderConditionCountVO } = data
        if (orderNumVO) {
          const { finishVideoSubmitNum, orderCancelNum, totalOrderNum, waitOrderReviewerNum, waitVideoSubmitNum } = orderNumVO
          this.$set(this.orderData, 0, {
            key: '订单数量', finishVideoSubmitNum, orderCancelNum, totalOrderNum, waitOrderReviewerNum, waitVideoSubmitNum
          })
        } else {
          this.$set(this.orderData, 0, { ...defaultOrderNum })
        }

        if (platConsumeAmountVO) {
          const { finishVideoSubmitAmount, orderCancelAmount, totalOrderAmount, waitOrderReviewerAmount, waitVideoSubmitAmount } = platConsumeAmountVO
          this.$set(this.orderData, 1, {
            key: '平台消耗金额', finishVideoSubmitAmount, orderCancelAmount, totalOrderAmount, waitOrderReviewerAmount, waitVideoSubmitAmount
          })
        } else {
          this.$set(this.orderData, 1, { ...defaultOrderAmount })
        }

        if (orderConditionCountVO) {
          this.$set(this.tabs[1], 'val', orderConditionCountVO.reviewerOrderCount)
          this.$set(this.tabs[1], 'hasHigh', !!orderConditionCountVO.reviewerOrderFlag)

          this.$set(this.tabs[2], 'val', orderConditionCountVO.waitOrderPayCount)
          this.$set(this.tabs[2], 'hasHigh', orderConditionCountVO.waitOrderPayFlag)

          this.$set(this.tabs[3], 'val', orderConditionCountVO.waitVideoSubmitCount)
          this.$set(this.tabs[3], 'hasHigh', !!orderConditionCountVO.waitVideoSubmitFlag)

          this.$set(this.tabs[4], 'val', orderConditionCountVO.waitFundRevieweCount)
          this.$set(this.tabs[4], 'hasHigh', orderConditionCountVO.waitFundRevieweFlag)

          this.$set(this.tabs[5], 'val', orderConditionCountVO.orderRejectCount)
          this.$set(this.tabs[5], 'hasHigh', !!orderConditionCountVO.orderRejectFlag)

          this.$set(this.tabs[6], 'val', orderConditionCountVO.orderCancelCount)
          this.$set(this.tabs[6], 'hasHigh', orderConditionCountVO.orderCancelFlag)
        } else {
          this.tabs = JSON.parse(JSON.stringify(defaultTabs))
        }

        if (data.singleOrderInfos) {
          // this.tableData = data.singleOrderInfos
          this.tableData = data.singleOrderInfos.map(item => {
            item.thirdOrderStatusStr = item.thirdOrderStatusStr ? item.thirdOrderStatusStr?.split('（').join('<br/>（') : '--'
            return item
          })
        } else {
          this.tableData = []
        }
        this.total = data.total
        this.loading = false
        this.orderLoading = false
      }).catch((e) => {
        this.loading = false
        this.orderLoading = false
        console.info(e)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-my {
    .tab-body {
      margin-top: 24px;
      ::v-deep .el-table {
        overflow: initial;
      }
      ::v-deep {
        .el-tabs__header {
          background: #fff;
          // .el-tabs__item.is-active {
          //   border-bottom: 2px solid $--color-primary;
          // }
        }
        .el-table__header-wrapper {
          position: sticky;
          top: -24px;
          z-index: 2;
        }
      }
    }
    .icon-high {
      background-color: #f00;
      color: #fff;
      // width: 16px;
      padding: 0 4px;
      height: 16px;
      line-height: 16px;
      display: inline-block;
      text-align: center;
      border-radius: 10px;
    }
    .pagenation-view {
      text-align: right;
      margin-top: 10px;
    }
  }

  .m-l-24 {
    align-items: center;
  }

  .iconTip {
    vertical-align: -1px;
  }

  .clearButton {
    margin-bottom: 4px;
    margin-left: 6px;
  }
</style>
