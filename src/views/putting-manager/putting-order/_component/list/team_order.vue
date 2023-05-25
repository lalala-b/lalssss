<template>
  <div class="C-putting-order-my">
    <!-- 筛选 -->
    <orderSearch :plat-data="platData" :account-data="accountData" :delivery-data="deliveryData" :org-info="orgInfo" :tab-type="type" export-permission="putting_order_team_export" :show-dialog="showDialog" @getTableData="getSearchData" @handleBulkImport="handleBulkImport" />
    <!-- 数据汇总 -->
    <orderData :data="orderData" :cols="orderDataCols" :loading="orderLoading" />
    <!-- 状态 -->
    <div class="tab-body">
      <orderTable ref="orderTable" :has-back="true" :data="tableData" :tab-type="type" :loading="loading" @update="getTableData" @sort="sort" />
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
    <!-- 批量导入弹窗 -->
    <ImportDialog v-if="showDialog" :show-dialog="showDialog" @close="showDialog=false" />
  </div>
</template>
<script>
import orderSearch from './order_search.vue'
import orderData from './order_data.vue'
import orderTable from './order_table.vue'
import { $getGroupOrder } from '@/api/putting-manager'
import ImportDialog from './import_dialog'
const defaultOrderNum = { key: '订单数量', finishVideoSubmitNum: 0, orderCancelNum: 0, totalOrderNum: 0, waitOrderReviewerNum: 0, waitVideoSubmitNum: 0 }
const defaultOrderAmount = { key: '平台消耗金额', finishVideoSubmitAmount: 0, orderCancelAmount: 0, totalOrderAmount: 0, waitOrderReviewerAmount: 0, waitVideoSubmitAmount: 0 }

export default {
  components: {
    orderSearch, orderData, orderTable, ImportDialog
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
      activeName: '',
      params: {},
      orderDataCols: ['申请订单', '待处理审批', '待发布视频', '已发布视频', '已取消订单'],
      orderData: [
        { ...defaultOrderNum },
        { ...defaultOrderAmount }
      ],
      tableData: [],
      pageNum: 1,
      size: 10,
      total: 0,
      determined: '',
      businessStatus: '',
      searchData: null,
      showDialog: false
    }
  },
  created() {
    this.businessStatus = this.activeName
    this.getTableData()
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

    getGroupOrder(params) {
      return new Promise(async(resolve, reject) => {
        const res = await $getGroupOrder(params)
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
      params = Object.assign({}, this.searchData, params || {}, { pageNum: this.pageNum, size: this.size, determined: this.determined })
      // console.log(params, '---params')
      this.params = params
      this.getGroupOrder(params).then(data => {
        const { orderNumVO, platConsumeAmountVO } = data
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

        if (data.singleOrderInfos) {
          this.tableData = data.singleOrderInfos
        } else {
          this.tableData = []
        }
        this.total = data.total
        this.loading = false
        this.orderLoading = false
      })
    },
    handleBulkImport(params) {
      this.showDialog = params
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-my {
    .tab-body {
      // padding: 24px;
      // background-color: #fff;
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
    .pagenation-view {
      text-align: right;
      margin-top: 10px;
    }
  }
</style>
