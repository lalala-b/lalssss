<template>
  <div class="C-putting-order-my">
    <!-- 筛选 -->
    <orderSearch :org-info="orgInfo" :plat-data="platData" :account-data="accountData" :delivery-data="deliveryData" :tab-type="type" :business-status="activeName" @getTableData="getSearchData" @updateSearchData="updateSearchData" />
    <div class="radioWrap">
      <span class="m-r-8">是否编导确认视频</span>
      <el-radio-group
        v-model="videoPublishFlag"
        class="m-r-16"
        @change="(val)=>handleChangeVideoPublishRadio(val,'videoPublishFlag')"
      >
        <el-radio :label="1">
          是
        </el-radio>
        <el-radio :label="0">
          否
        </el-radio>
      </el-radio-group>
      <span class="m-r-8 m-l-8">仅待付款/待确认价格的订单</span>
      <el-checkbox
        v-model="waitPaymentFlag"
        :true-label="1"
        @change="handleChangeWaitPayment"
      />
      <span class="m-r-8">未设置视频发布时间</span>
      <el-checkbox
        v-model="videoReleaseFlag"
        :true-label="0"
        @change="(val)=>handleChangeVideoPublishRadio(val,'videoReleaseFlag')"
      />
      <span class="m-r-8">未确认价格</span>
      <el-checkbox
        v-model="confirmPriceFlag"
        :true-label="0"
        @change="(val)=>handleChangeVideoPublishRadio(val,'confirmPriceFlag')"
      />

      <el-button type="text" class="clearButton" @click="handleClearVideoPublishFlag">清除</el-button>
    </div>
    <!-- 数据汇总 -->
    <!-- <orderData :data="orderData" :cols="orderDataCols" :loading="orderLoading" /> -->
    <!-- 状态 -->
    <div class="tab-body">
      <orderTable ref="orderTable" class="m-t-16" :data="tableData" :tab-type="type" :loading="loading" @update="getTableData" @sort="sort" />
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
import orderSearch from './order_search.vue'
// import orderData from './order_data.vue'
import orderTable from './order_table.vue'
import { $getWaitApprovalOrder } from '@/api/putting-manager'

const defaultOrderNum = { key: '订单数量', finishVideoSubmitNum: 0, orderCancelNum: 0, totalOrderNum: 0, waitOrderReviewerNum: 0, waitVideoSubmitNum: 0 }
const defaultOrderAmount = { key: '平台消耗金额', finishVideoSubmitAmount: 0, orderCancelAmount: 0, totalOrderAmount: 0, waitOrderReviewerAmount: 0, waitVideoSubmitAmount: 0 }
const defaultTabs = [
  {
    name: '1,2',
    label: '待审核',
    val: null,
    valKey: 'reviewerOrderCount',
    highKey: 'reviewerOrderFlag',
    permission: 'putting_order_wait_tab2'
  },
  {
    name: '5',
    label: '待下单付款',
    val: null,
    valKey: 'waitOrderPayCount',
    highKey: 'waitOrderPayFlag',
    permission: 'putting_order_wait_payment'
  },
  {
    name: '6',
    label: '待发布提交',
    val: null,
    valKey: 'waitVideoSubmitCount',
    highKey: 'waitVideoSubmitFlag',
    permission: 'putting_order_wait_payment'
  },
  {
    name: '7',
    label: '待资金核算',
    val: null,
    valKey: 'waitFundRevieweCount',
    highKey: 'waitFundRevieweFlag',
    permission: 'putting_order_wait_money'
  }
]

export default {
  components: {
    orderSearch, orderTable
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
    },
    orgInfo: {
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
      activeName: '6',
      params: {},
      orderDataCols: ['申请订单', '待处理审批', '待发布视频', '已发布视频', '已取消订单'],
      orderData: [
        { ...defaultOrderNum },
        { ...defaultOrderAmount }
      ],
      tableData: [],
      tabs: (() => {
        const tab = defaultTabs
        // if (!this.$permission('putting_order_wait')) {
        //   tab.splice(1, 1)
        // }
        return tab.filter(t => this.$permission(t.permission))
        // return tab
      })(),
      pageNum: 1,
      size: 10,
      total: 0,
      determined: '',
      businessStatus: '',
      searchData: {},
      videoPublishFlag: '',
      waitPaymentFlag: '',
      videoReleaseFlag: '',
      confirmPriceFlag: ''
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
      Object.assign(this.searchData, params)
      this.getTableData(params)
    },
    updateSearchData(params) {
      Object.assign(this.searchData, params)
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
      this.getTableData({
        businessStatus: e.name
      }, false)
    },
    async getWaitApprovalOrder(params) {
      const res = await $getWaitApprovalOrder(params)
      if (res.code === 1) {
        return res.data
      } else {
        return Promise.reject(res)
      }
    },
    getTableData(params = {}, hasOrderLoading = true) {
      this.loading = true
      if (hasOrderLoading) {
        this.orderLoading = true
      }
      const determined = this.determined || (this.videoPublishFlag ? 'videoPublishTime' : '')
      params = Object.assign({}, this.searchData, params || {}, { pageNum: this.pageNum, size: this.size, determined: determined, businessStatus: this.businessStatus })
      // if (this.type === 'WaitOrder' && params.businessStatus === '7') {

      // } else {
      params.confirmContractExistFlag = ''
      params.rebateAmountFlag = ''
      params.rebateScreenshotFlag = ''
      params.addAmountFlag = ''
      params.contractUrlFlag = ''
      // }
      this.params = params
      this.$emit('setTabOnlyLoading', {
        name: 'PublishSubmit',
        val: true
      })
      this.getWaitApprovalOrder({ ...params, videoPublishFlag: this.videoPublishFlag }).then(data => {
        const { orderConditionCountVO } = data
        this.$emit('changeTabNum', {
          name: 'PublishSubmit',
          val: orderConditionCountVO?.waitVideoSubmitCount
        })
        this.$emit('setTabOnlyLoading', {
          name: 'PublishSubmit',
          val: false
        })
        if (orderConditionCountVO) {
          // this.tabs.forEach(t => {
          //   this.$set(t, 'val', orderConditionCountVO[t.valKey])
          //   this.$set(t, 'hasHigh', orderConditionCountVO[t.highKey])
          // })
        } else {
          this.tabs = JSON.parse(JSON.stringify(defaultTabs))
        }

        if (data.singleOrderInfos) {
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
      }).catch(err => {
        this.loading = true
      })
    },

    handleChangeVideoPublishRadio(e, type) {
      this.pageNum = 1
      const params = {}
      switch (type) {
        case 'videoPublishFlag':
          params.videoPublishFlag = e === 0 ? e : ''
          break
        case 'videoReleaseFlag':
          params.videoReleaseFlag = e === 0 ? e : ''
          break
        default:
          params.confirmPriceFlag = e === 0 ? e : ''
          break
      }
       if (type === 'videoPublishFlag' && e) {
        this.determined = ''
        this.$refs.orderTable.$refs.table.clearSort()
      }
      this.updateSearchData(params)
      this.getTableData({
        ...params
      })
    },

    handleChangeWaitPayment(e) {
      this.pageNum = 1
      this.updateSearchData({ waitPaymentFlag: e ? 1 : '' })
      this.getTableData({
        waitPaymentFlag: e ? 1 : ''
      })
    },

     // 清除是否广告师确认视频的选项
    handleClearVideoPublishFlag() {
      this.videoPublishFlag = ''
      this.waitPaymentFlag = ''
      this.confirmPriceFlag = ''
      this.videoReleaseFlag = ''
      this.pageNum = 1
      const params = {
        videoPublishFlag: '',
        waitPaymentFlag: '',
        confirmPriceFlag: '',
        videoReleaseFlag: ''
      }
      this.updateSearchData(params)
      this.getTableData(params)
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
      ::v-deep .el-table__header-wrapper {
        position: sticky;
        top: -24px;
        z-index: 2;
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

  .radioWrap {
    span {
      font-size: 14px;
    }
  }
  ::v-deep{
    .el-radio {
     margin-right: 8px;
    }
    .el-radio__label{
      padding-left: 0px;
    }
  }
  .clearButton {
    margin-left: 12px;
  }
</style>
