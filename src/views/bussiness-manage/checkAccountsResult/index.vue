
<template>
  <div>
    <wrap>
      <Statistics
        v-loading="loading"
        class="statistics data-wrap"
        direction="top"
        :data="summaryItems"
      />
    </wrap>

    <wrap class="m-t-10">
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name" />
      </el-tabs>

      <div class="flex flex-justify-end">
        <el-button class="m-t-10" type="primary" @click="handleExport">导出</el-button>
      </div>
      <div class="table-view">
        <el-table
          v-scrollbar
          v-loading="loading"
          class="m-t-10"
          :data="tableData"
          header-row-class-name="table-header"
          row-key="id"
          default-expand-all
          :tree-props="{children: 'childWorkOrderList', hasChildren: '(childWorkOrderList || []).length'}"
        >
          <el-table-column prop="workId" label="工单号" width="120px">
            <template slot-scope="{ row }">
              <span v-if="(row.childWorkOrderList || []).length" class="deductionWorker">
                相抵扣的工单
              </span>
              <span v-else>
                {{ row.workId || '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="orderName" label="订单名称">
            <template slot-scope="{ row }">
              {{ row.orderName || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="businessName" label="商务信息">
            <template slot-scope="{ row }">
              {{ row.businessName || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="orderAscriptionName" label="订单归属">
            <template slot-scope="{ row }">
              {{ row.orderAscriptionName || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="paymentResultName" label="应收或应付">
            <template slot-scope="{ row }">
              {{ row.paymentResultName || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="outTradeNo" label="交易流水号">
            <template slot-scope="{ row }">
              {{ row.outTradeNo || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="matchingTradeStatus" label="交易流水号匹配结果">
            <template slot-scope="{ row }">
              <span :class="[row.outTradeNo ? row.matchingTradeStatus === null ? '' : row.matchingTradeStatus === 1 ? 'success' : 'error' : '']">
                {{ row.outTradeNo ? row.matchingTradeStatus === null ? '--' : row.matchingTradeStatus === 1 ? '匹配' : '无匹配结果' : '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="tradeType" label="支付渠道">
            <template slot-scope="{ row }">
              {{ row.outTradeNo ? ['--', '支付宝', '微信', '银行转账'][row.tradeType] || '--' : '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="matchingTradeTypeStatus"
            label="支付渠道匹配结果"
          >
            <template slot-scope="{ row }">
              <span :class="[row.outTradeNo ? row.matchingTradeTypeStatus ? +row.matchingTradeTypeStatus === 1 ? 'success' : 'error' : '' : '']">
                {{ row.outTradeNo ? row.matchingTradeTypeStatus ? +row.matchingTradeTypeStatus === 1 ? '匹配' : '不匹配' : '--' : '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="collectionMoney" label="应收金额">
            <template slot-scope="{ row }">
              {{ row.outTradeNo ? row.collectionMoney || '--' : '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="collectionMoney" label="应付金额">
            <template slot-scope="{ row }">
              {{ row.outTradeNo ? row.collectionMoneyOut || '--' : '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="matchingMoneyStatus" label="应收金额匹配结果">
            <template slot-scope="{ row }">
              <span :class="[row.matchingMoneyStatus ? +row.matchingMoneyStatus === 1 ? 'success' : 'error' : '']">
                {{ row.matchingMoneyStatus ? +row.matchingMoneyStatus === 1 ? '匹配' : '不匹配' : '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="outTradeMoney" label="实际交易金额">
            <template slot-scope="{ row }">
              {{ row.outTradeMoney || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="outTradeTime" label="实际交易时间">
            <template slot-scope="{ row }">
              {{ row.outTradeTime || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="platTaskId" label="平台任务ID">
            <template slot-scope="{ row }">
              {{ row.platTaskId || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="matchingTaskIdStatus" label="平台任务ID匹配结果">
            <template slot-scope="{ row }">
              <span :class="[row.outTradeNo ? '' : row.matchingTaskIdStatus === null ? '' : row.matchingTaskIdStatus === 1 ? 'success' : 'error']">{{ row.outTradeNo ? '--' : row.matchingTaskIdStatus === null ? '--' : row.matchingTaskIdStatus === 1 ? '匹配' : '无匹配结果' }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderMoney" label="平台下单价">
            <template slot-scope="{ row }">
              {{ row.orderMoney || '--' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="matchingOrderMoneyStatus"
            label="下单金额匹配结果"
          >
            <template slot-scope="{ row }">
              <span :class="[row.matchingOrderMoneyStatus ? +row.matchingOrderMoneyStatus === 1 ? 'success' : 'error' : '']">
                {{ row.matchingOrderMoneyStatus ? +row.matchingOrderMoneyStatus === 1 ? '匹配' : '不匹配' : '--' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="outOrderMoney" label="实际下单金额">
            <template slot-scope="{ row }">
              {{ row.outOrderMoney || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="billStatus" label="核账状态">
            <template slot-scope="{ row }">
              <span :class="[row.billStatus === 1 ? 'success' : row.billStatus === 2 ? 'error' : '']">
                {{ ['未核账', '核账成功', '核账失败'][row.billStatus] || '--' }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="110" fixed="right">
            <template slot-scope="{ row }">
              <span v-if="!((row.childWorkOrderList || []).length || +row.billStatus === 1)">
                <el-button v-if="!+row.checkRemindFlag" type="text" @click="handleShowRemind(row)">添加异常提醒</el-button>
                <span v-else>已添加</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div>
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getList"
          />
        </div>
      </div>
    </wrap>

    <RemindDialog
      :show="showRemindDialog"
      :work-id="workId"
      @close="showRemindDialog = false"
      @success="getList"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  watch
} from '@vue/composition-api'
import qs from 'qs'
import { Statistics } from 'components'
import { $getBillListPage } from '@/api/bussiness-manage'
import { copy } from '@/utils'
import RemindDialog from './remindDialog.vue'

export default defineComponent({
  components: {
    Statistics,
    RemindDialog
  },
  setup(props) {
    const { $message, $nextTick, $componentId } = getCurrentInstance().proxy
    const loading = ref(false)

    const searchData = reactive({
      pageNum: 1
    })

    const states = reactive({
      tableData: [],
      total: 0,
      activeName: '',
      tabs: [{
        title: '核账无误工单',
        name: ''
      }, {
        title: '交易流水号不匹配',
        name: 'outTradeNoNotMatching'
      }, {
        title: '支付渠道不匹配',
        name: 'tradeTypeNotMatching'
      }, {
        title: '交易金额不匹配',
        name: 'tradeMoneyNotMatching'
      }, {
        title: '平台任务ID不匹配',
        name: 'platTaskIdNotMatching'
      }, {
        title: '下单金额不匹配',
        name: 'orderMoneyNotMatching'
      }],
      showRemindDialog: false,
      workId: 0
    })

    const summaryItems = reactive([
      {
        key: 'workerAllTotal',
        val: 0,
        text: '参与核账工单总数'
      },
      {
        key: 'billStatusSuccessTotal',
        val: 0,
        text: '核账工单无误总数'
      },
      {
        key: 'outTradeNoNotMatchingTotal',
        val: 0,
        text: '交易流水号不匹配',
        type: 'error'
      },
      {
        key: 'tradeTypeMatchingTotal',
        val: 0,
        text: '支付渠道不匹配',
        type: 'error'
      },
      {
        key: 'outTradeMoneyNotMatchingTotal',
        val: 0,
        text: '交易金额不匹配',
        type: 'error'
      },
      {
        key: 'platTaskIdNotMatchingTotal',
        val: 0,
        text: '平台任务ID不匹配',
        type: 'error'
      },
      {
        key: 'orderMoneyNotMatchingTotal',
        val: 0,
        text: '下单金额不匹配',
        type: 'error'
      }
    ])

    watch(() => states.activeName, (val) => {
      if (+val === 0) {
        searchData.outTradeNoNotMatching = ''
        searchData.tradeTypeNotMatching = ''
        searchData.tradeMoneyNotMatching = ''
        searchData.platTaskIdNotMatching = ''
        searchData.orderMoneyNotMatching = ''
      } else {
        searchData.outTradeNoNotMatching = ''
        searchData.tradeTypeNotMatching = ''
        searchData.tradeMoneyNotMatching = ''
        searchData.platTaskIdNotMatching = ''
        searchData.orderMoneyNotMatching = ''
        searchData[val] = 2
      }

      searchData.pageNum = 1

      $nextTick(() => {
        getList()
      })
    })

    const getList = function() {
      const workIdList = JSON.parse(localStorage.getItem('workIdList'))
      const parentWorkIdList = JSON.parse(localStorage.getItem('parentWorkIdList'))
      if (!(workIdList || []).length && !(parentWorkIdList || []).length) {
        return
      }
      loading.value = true

      const params = {
        workIdList,
        parentWorkIdList,
        ...searchData
      }

      if (+states.activeName === 0) {
        params.billStatus = 1
      }

      return $getBillListPage(params)
        .then((res) => {
          loading.value = false
          if (res.code === 1) {
            states.tableData = (res.data.list || []).map(item => {
              const newItem = { ...item }
              if ((newItem.childWorkOrderList || []).length) {
                newItem.childWorkOrderList.map((it, idx) => {
                  it.id = `${item.id}_${idx}`
                  return it
                })
              }

              return newItem
            })
            states.total = res.data.total || 0
            summaryItems.forEach((item) => {
              item.val = res.data[item.key]
            })
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          loading.value = false
          $message.error(err.message || '网络错误')
        })
    }

    const handleExport = () => {
      const workIdList = JSON.parse(localStorage.getItem('workIdList'))
      const parentWorkIdList = JSON.parse(localStorage.getItem('parentWorkIdList'))
      if (!(workIdList || []).length && !(parentWorkIdList || []).length) {
        return
      }

      const params = {
        workIdList,
        parentWorkIdList,
        ...searchData
      }

      window.open(`/api/finance/bill/exportBill?${qs.stringify(
        params
      )}&componentId=${$componentId}`)
    }

    const handleShowRemind = (row) => {
      states.workId = row.workId
      states.showRemindDialog = true
    }

    getList()
    return {
      ...toRefs(states),
      loading,
      summaryItems,
      getList,
      handleExport,
      handleShowRemind,
      searchData
    }
  }
})
</script>
<style lang="scss" scoped>
.data-wrap {
  background: rgba(0, 95, 246, 0.05);
}

.success {
  color: #67C23A;
}

.error {
  color: #F56C6C;
}

::v-deep {
  .el-table__row--level-1 {
    background: oldlace;
  }

  .el-icon-arrow-right:before {
    content: "\e6dc";
    font-size: 16px;
    color: #409EFF;
    // margin-left: 16px;
  }

  .el-table__row--level-0 {
    .cell {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: row-reverse;
    }
  }
}

.deductionWorker {
  color: #409EFF;
}
</style>
