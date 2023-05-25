<template>
  <Wrap class="table-view m-t-16">
    <div v-if="source === 'pending'" class="flex flex-justify-end m-b-12">
      <el-button v-if="$permission('batch_receive') && showReceiveBatchBtn && total" type="primary" size="small" @click="handleReceiveBatchAccount">批量接收</el-button>
    </div>
    <el-table
      v-loading="loading"
      v-scrollbar
      header-row-class-name="table-header"
      :data="tableData"
      @sort-change="doSort"
      @select-all="handleSelectAll"
      @selection-change="handleListSelect"
    >
      <template v-if="source === 'pending' && showReceiveBatchBtn">
        <el-table-column type="selection" fixed="left" />
      </template>
      <el-table-column prop="applyOrderRecord" label="申请单记录" width="170" />
      <el-table-column label="账号信息" width="240" align="left">
        <template slot-scope="{ row }">
          <AccountCard :info="row" />
        </template>
      </el-table-column>
      <el-table-column prop="operationType" label="类型" />
      <el-table-column prop="curOperatorName" label="发起人" />
      <el-table-column
        prop="curHandlerName"
        label="当前处理人"
      />
      <el-table-column
        label="审批状态"
      >
        <template slot-scope="{row}">
          {{ approvalStatusType.get(row.transferOrderStatus) ||'--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
        sortable="custom"
        width="168"
      />
      <el-table-column label="操作" fixed="right">
        <template slot-scope="{row}">
          <div class="flex flex-justify-center">
            <IconTip
              content="查看"
              icon-class="iconxiangqing"
              @click="handleGoDetail(row)"
            />
            <IconTip
              v-if="source==='myApplication'&&showCancel(row)"
              content="撤销申请"
              icon-class="iconchexiaoshenqingdanguanli"
              @click="handleRepeal(row)"
            />
            <IconTip
              v-if="source==='pending'"
              content="进入审批"
              icon-class="iconjinrushenpi"
              @click="handleApproval(row)"
            />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagenation-view">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </Wrap>
</template>

<script>
import { AccountCard, IconTip } from 'components'
import { useTableSort } from '@/hook'
import { getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import { commonData } from './hooks'
import { copy } from '@/utils'
import {
  $getApplicationList,
  $getWaitList,
  $cancelHandover,
  $reportCancel,
  $getAllList,
  $getAllSoonReceivedId
} from '@/api/operating-manage'

export default {
  components: {
    IconTip,
    AccountCard
    // RepealDialog
  },
  props: {
    source: {
      type: String,
      default: ''
    },
    searchData: {
      type: Object,
      default() {
        return {}
      }
    },
    showReceiveBatchBtn: { // 是否显示批量接收按钮
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $message, $confirm, $router } = getCurrentInstance().proxy
    const { approvalStatusType } = commonData()
    const states = reactive({
      tableData: [],
      total: 0,
      loading: false,
      row: {},
      selectionArr: [],
      showReceiveBatchModal: false
    })
    const showCancel = (row) => {
      switch (row.operationType) {
        case '账号移交':
        return row.transferOrderStatus === 1
        case '账号运营':
        return row.transferOrderStatus === 3
        case '账号修改报备':
        return row.transferOrderStatus === 4
        default:
          return false
      }
    }
    const getList = function(source) {
      const type = props.source || source
      const searchData = copy(props.searchData)
      states.loading = true
      let $api
      switch (type) {
        case 'myApplication':
          $api = $getApplicationList
          break
        case 'pending':
          $api = $getWaitList
          searchData.tagType = 0
          break
         case 'processed':
          $api = $getWaitList
          searchData.tagType = 1
          break
          case 'allAgent':
          $api = $getAllList
          // searchData.tagType = 1
          break
      }
      return $api({
        ...searchData
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data
            states.total = res.total || 0
          } else {
            states.tableData = []
            states.total = 0
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    // 取消订单
    const handleRepeal = async(row) => {
      const str = row.operationType === '账号移交' ? '确定撤销移交申请？' : '确定撤销修改报备申请？'
      await $confirm(str, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      const $api = row.operationType === '账号移交' ? $cancelHandover : $reportCancel
      $api({
        transferOrderId: row.transferOrderId,
        examineStatus: row.examineStatus
      }).then((res) => {
        if (res.code === 1) {
          $message.success('撤销成功')
          getList()
        } else {
          $message.error(res.message)
        }
      })
    }
    const handleGoDetail = (row) => {
      $router.push({
        path: '/operations_management/transfer_application',
        query: {
          type: 'view',
          _blank: true,
          operationType: row.operationType,
          transferOrderId: row.transferOrderId
        }
      })
    }
    const handleApproval = (row) => {
      $router.push({
        path: '/operations_management/transfer_application',
        query: {
          type: 'approval',
          transferOrderId: row.transferOrderId,
          operationType: row.operationType,
          _blank: true
        }
      })
    }

    // 用户全选状态的改变
    const handleSelectAll = async() => {
      try {
        const res = await $getAllSoonReceivedId()
        if (+res.code === 1) {
          states.selectionArr = res.data
        }
      } catch (err) {
        $message.error(err.message)
      }
    }

    // 用户选择状态的改变
    const handleListSelect = async(selection) => {
      states.selectionArr = selection.map(item => item.transferOrderId)
    }

    // 批量接收
    const handleReceiveBatchAccount = () => {
      if (!states.selectionArr.length) {
        $message.warning('你还没勾选哦')
        return
      }
      states.showReceiveBatchModal = true
    }

    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      ...toRefs(states),
      doSort,
      getList,
      handleRepeal,
      handleGoDetail,
      handleApproval,
      approvalStatusType,
      showCancel,
      handleListSelect,
      handleSelectAll,
      handleReceiveBatchAccount
    }
  }
}
</script>
