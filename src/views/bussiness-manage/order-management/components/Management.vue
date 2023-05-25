<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <el-form-item>
            <el-select
              v-model="target.model.isMoney"
              placeholder="是否到款"
              clearable
            >
              <el-option :value="1" label="是" />
              <el-option :value="0" label="否" />
            </el-select>
          </el-form-item>
          <el-form-item label="到款时间">
            <el-date-picker
              v-model="target.model.isMoneyTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.createdaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="target.model.videodaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="已定档期">
            <el-date-picker
              v-model="target.model.isSetSchedule"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <Statistics
        v-loading="loading"
        class="statistics data-wrap"
        :data="summaryItems"
      />
    </wrap>
    <wrap class="table-view m-t-24">
      <el-table
        v-scrollbar
        v-loading="tableLoading"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column prop="createdTime" align="left" label="创建时间" width="160px" />
        <el-table-column prop="workId" label="工单号" width="100px" />
        <el-table-column label="商单号">
          <template slot-scope="{ row }">
            {{ row.quotientId || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="orderName" label="订单名称" width="100px" />
        <el-table-column label="工单状态">
          <template slot-scope="{ row }">
            {{ orderStatusMap.get(row.workerStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="businessGroupName" label="商务小组" />
        <el-table-column prop="businessUserName" label="商务对接人" />
        <el-table-column label="账号负责人">
          <template slot-scope="{ row }">
            {{ row.bindUser | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="下单账号" width="200" align="left">
          <template slot-scope="s">
            <AccountCard :info="s.row" />
          </template>
        </el-table-column>
        <el-table-column prop="accountBelong" label="订单归属" />
        <el-table-column
          prop="finishTimeConfirm"
          label="已定排期"
          width="160px"
        >
          <template slot-scope="{ row }">
            {{ row.finishTimeConfirm | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="moneyCount"
          label="执行金额"
          sortable
        >
          <template slot-scope="{ row }">
            {{ row.moneyCount | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="视频发布时间" width="160px">
          <template slot-scope="{ row }">
            {{ row.addTime | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="isMoney" label="是否到款">
          <template slot-scope="{ row }">
            {{ +row.isMoney ? '是' : '否' }}
          </template>
        </el-table-column>
        <el-table-column prop="isMoneyTime" label="到款时间" width="160px">
          <template slot-scope="{ row }">
            {{ row.isMoneyTime | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120" align="left">
          <template slot-scope="{ row }">
            <OverPopover :content="row.selfNote" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template slot-scope="scope">
            <IconTip
              content="查看"
              icon-class="iconxiangqing"
              class="m-r-10"
              @click="handleShow(scope.row, 'view')"
            />
            <template v-if="scope.row.editAuth">
              <IconTip
                content="编辑"
                icon-class="iconbianji"
                class="m-r-10"
                @click="handleShow(scope.row, 'edit')"
              />
            </template>
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
    </wrap>
    <OrderDialog
      v-if="showAddDialog"
      :work-id="workId"
      :type="type"
      :account-id="accountId"
      :show-add-dialog="showAddDialog"
      @getList="getList"
      @getStatistics="getStatistics"
      @close="showAddDialog = false"
    />
  </div>
</template>
<script>
import OrderDialog from '../_coms/OrderDialog'
import {
  Search,
  Statistics,
  IconTip,
  OverPopover,
  AccountCard
} from 'components'
import { getCurrentInstance, reactive, ref, toRefs, onMounted } from '@vue/composition-api'

import qs from 'qs'
import {
  $getSearchList,
  $getOrderList,
  $getStatistics,
  $getMedAccounts,
  $getMoreSelfAccounts
} from '@/api/proprietary-orders'
import { useTableSort } from '@/hook'
import { copy, getMonthStartEnd } from '@/utils'
import { commonData } from '../_coms/hooks'

export default {
  components: {
    AccountCard,
    Search,
    Statistics,
    OverPopover,
    OrderDialog,
    IconTip
  },
  setup() {
    const { $permission, $message, $route, $set, $refs, $nextTick } = getCurrentInstance().proxy
    const states = reactive({
      loading: false,
      tableData: [],
      total: 0,
      showAddDialog: false,
      workId: 0,
      type: 'view',
      tableLoading: false,
      accountId: ''
    })
    const { orderStatusMap } = commonData()
    const formConf = reactive({
      normal: [],
      // hasExport: $permission('order-export')
      hasExport: $permission('manager_export')
    })
    const searchData = ref({
      pageNum: 1
    })

    onMounted(() => {
      const { workId, type } = $route.query
      if (workId && type === 'edit') {
        states.workId = workId
        states.type = 'edit'
        states.showAddDialog = true
      }

      const time = getMonthStartEnd()
      const timeArr = [
        `${time.firstDay}`,
        `${time.lastDay}`
      ]
      $set($refs.search.form, 'isSetSchedule', timeArr)

      $set($refs.search.form, 'workerStatus', [0, 1, 2, 3])

      const data = {
        isSetSchedule: timeArr,
        workerStatus: '0,1,2,3'
      }
      const res = formatData(data)
      Object.assign(searchData.value, res)

      $nextTick(() => {
        getList()
      })
    })

    // // 默认筛选为当月
    // $nextTick(() => {

    // })

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'workerStatus',
          data: [
            {
              text: '商业信息待录入',
              val: 0
            },
            {
              text: '待履约',
              val: 1
            },
            {
              text: '已履约',
              val: 2
            },
            {
              text: '已核账',
              val: 3
            },
            {
              text: '撤单',
              val: 4
            }
          ],
          conf: {
            placeholder: '工单状态',
            multiple: true,
            deCollapseTags: false
          }
        },
        {
          type: 'select',
          key: 'businessGroupIdList',
          data: [],
          conf: {
            placeholder: '商务小组',
            multiple: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'dId',
          data: [],
          conf: {
            placeholder: '工作室',
            hidden: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id',
          permissionName: 'studio-code'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '平台',
            multiple: true
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '账号'
          }
        },
        {
            type: 'input',
            key: 'orderName',
            conf: {
              placeholder: '订单名称',
              maxLength: 30
            }
          },
          {
            type: 'input',
            key: 'workId',
            conf: {
              placeholder: '工单号或商单号',
              maxLength: 30
            }
          }
      ]
      normal = normal.filter(function(item, index) {
        if (item.permissionName && !$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const summaryItems = reactive([
      {
        key: 'countWorkerOrder',
        val: 0,
        text: '订单数量'
      },
      {
        key: 'sumExecuteMoney',
        val: 0,
        text: '执行金额总和'
      },
      {
        key: 'sumPerformanceMoney',
        val: 0,
        text: '绩效金额总和'
      }
    ])
    const onChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'platId':
          model.accountId = ''
          normalFormItemMap.accountId.data = []
          getMoreSelfAccounts(val)
          break
      }
    }

    const getMoreSelfAccounts = (platId) => {
      $getMoreSelfAccounts({ platList: (platId || []) }).then((res) => {
        if (res.code === 1) {
          normalFormItemMap.accountId.data = res.data || []
        }
      })
    }

    const getMedAccounts = function(platId) {
      $getMedAccounts({ platId: (platId || []).join(','), methodId: 3 }).then((res) => {
        if (res.code === 1) {
          normalFormItemMap.accountId.data = res.data || []
        }
      })
    }
    const getStatistics = function() {
      states.loading = true
      // return $getStatistics({
      //   ...searchData.value
      // })
      return $getStatistics(searchData.value)
        .then((res) => {
          states.loading = false
          if (res.code === 1) {
            summaryItems.forEach((item) => {
              item.val = res.data[item.key]
            })
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const getSearchList = (orgId) => {
      $getSearchList({ orgId })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.businessGroupIdList.data =
              res.data.businessInfoList || []
            normalFormItemMap.platId.data = res.data.plats || []
            if (normalFormItemMap.dId) {
              normalFormItemMap.dId.data = res.data.selfOperateTeamList || []
              if ((res.data.selfOperateTeamList || []).length > 1) {
                normalFormItemMap.dId.conf = {
                  ...normalFormItemMap.dId.conf,
                  hidden: false
                }
              } else {
                normalFormItemMap.dId.conf = {
                  ...normalFormItemMap.dId.conf,
                  hidden: true
                }
              }
            }
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const getList = () => {
      states.tableLoading = true
      $getOrderList(searchData.value)
        .then((res) => {
          if (res.code === 1) {
            states.tableData = res.data
            states.total = res.total
          }
          states.tableLoading = false
          // searchData.value = {}
        })
        .catch((err) => {
          states.tableLoading = false
          console.error(err)
        })
    }
    // 时间添加时分秒
    const formatData = (data) => {
      const params = copy(data)
      if (params.videodaterange) {
        // 视频发布时间
        params.addTimeStart = params.videodaterange[0]
        params.addTimeEnd = params.videodaterange[1] + ' 23:59:59'
        delete params.videodaterange
      } else {
        params.addTimeStart = ''
        params.addTimeEnd = ''
      }

      if (params.isMoneyTime) {
        // 到款时间
        params.isMoneyTimeBegin = params.isMoneyTime[0]
        params.isMoneyTimeEnd = params.isMoneyTime[1] + ' 23:59:59'
        delete params.isMoneyTime
      } else {
        params.isMoneyTimeBegin = ''
        params.isMoneyTimeEnd = ''
      }

      if (params.isSetSchedule) {
        // 已定档期
        params.finishTimeStart = params.isSetSchedule[0]
        params.finishTimeEnd = params.isSetSchedule[1] + ' 23:59:59'
        delete params.isSetSchedule
      } else {
        params.finishTimeStart = ''
        params.finishTimeEnd = ''
      }

      if (params.createdaterange) {
        // 创建时间
        params.createdTimeStart = params.createdaterange[0]
        params.createdTimeEnd = params.createdaterange[1] + ' 23:59:59'
        delete params.createdaterange
      } else {
        params.createdTimeStart = ''
        params.createdTimeEnd = ''
      }

      return params
    }

    const handleShow = (row, type) => {
      states.accountId = row.accountId
      states.workId = row.workId + ''
      states.type = type
      states.showAddDialog = true
    }

    const onSubmit = (data) => {
      const params = formatData(data)
      if ((params.workerStatus || []).length) {
        params.workerStatus = (params.workerStatus || []).join(',')
      }

      params.platIdList = [...(params.platId || [])]
      delete params.platId

      Object.assign(searchData.value, params)

      searchData.value.pageNum = 1

      $nextTick(() => {
        getStatistics()
        getList()
      })
    }

    const onExport = (data) => {
      const params = formatData(data)
      if ((params.workerStatus || []).length) {
        params.workerStatus = (params.workerStatus || []).join(',')
      }

      params.platIdList = [...(params.platId || [])]
      delete params.platId

      Object.assign(searchData.value, params)
      console.log('导出传参-----', searchData.value)
      window.open(
        `/api/worker/order/selfOperate/downloadSelfOperateOrder?${qs.stringify(
          searchData.value
        )}`
      )
    }

    buildFormConf()
    getMedAccounts('')
    getSearchList()
    getStatistics()

    const { doSort } = useTableSort(searchData.value, getList)
    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      summaryItems,
      getList,
      getStatistics,
      doSort,
      handleShow,
      ...toRefs(states),
      orderStatusMap,
      onChange
    }
  }
}
</script>
