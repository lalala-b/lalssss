<template>
  <div>
    <Search ref="Search" tab-name="detail" @onSubmit="onSubmit" @onExport="onExport" />
    <Wrap class="m-t-24">
      <Statistics
        v-loading="statisticsLoading"
        class="statistics data-wrap"
        :data="detailStatistics"
      />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-end">
        <el-button
          v-if="$permission('add_order')"
          class="m-b-10"
          icon="el-icon-circle-plus-outline"
          size="small"
          type="primary"
          @click="hanleAddClick"
        >添加合作订单</el-button>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="工单号" align="left">
          <template slot-scope="{ row }">
            {{ row.workId | emptyFill }}
          </template>
        </el-table-column>

        <el-table-column prop="projectName" label="订单名称" align="left" />

        <el-table-column prop="projectTypeName" label="订单类型" align="left" />
        <el-table-column prop="workerStatus" align="center" width="110px">
          <template slot="header">
            <div>
              工单状态
              <IconTip
                type="popover"
                content="仅视频工单支持按照工单状态筛选，海盗订单和达人私单没有工单状态"
                icon-class="iconwenhao"
              />
            </div>
          </template>
          <template slot-scope="{ row }">
            {{
              orderStatusMap.get(row.workerStatus)
                ? orderStatusMap.get(row.workerStatus)
                : '--'
            }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="createdTime"
          label="创建时间"
          width="170"
          align="left"
        /> -->

        <!-- <el-table-column label="商单号">
          <template slot-scope="{ row }">
            {{ row.quotientId | emptyFill }}
          </template>
        </el-table-column> -->

        <el-table-column label="商务信息" align="left" width="130px">
          <template slot-scope="{ row }">
            <template v-if="row.businessGroupName || row.businessUserName">
              {{ row.businessGroupName }}-{{ row.businessUserName }}
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="signTeamName"
          label="签约信息"
          align="left"
          width="180px"
        >
          <template slot-scope="{ row }">
            {{ row.signGroupName }}-{{ row.signTeamName }}-{{
              row.signUserName
            }}
          </template>
        </el-table-column>
        <el-table-column label="账号信息" width="200" align="left">
          <template slot-scope="{ row }">
            <div class="flex flex-align-center">
              <AccountCard :info="row">
                <template slot="last">
                  <div v-if="row.upUpNameAndLeader" style="text-align: left">
                    <el-tag size="mini" type="danger">{{
                      row.upUpNameAndLeader
                    }}</el-tag>
                  </div>
                </template>
              </AccountCard>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="joinMcnFlag"
          label="是否加入乾派MCN"
          width="90"
          align="center"
        >
          <template slot-scope="scope">
            {{
              [0, 1].includes(scope.row.joinMcnFlag)
                ? scope.row.joinMcnFlag
                  ? '是'
                  : '否'
                : '--'
            }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="已定档期"
          align="center"
          prop="finishTime"
          width="110px"
          sortable
        >
          <template slot-scope="{ row }">
            {{ row.finishTime | emptyFill }}
          </template>
        </el-table-column>

        <el-table-column
          label="绩效月"
          align="center"
          prop="monthMoney"
          width="110px"
          sortable
        >
          <template slot-scope="{ row }">
            {{ row.monthMoney | emptyFill }}
          </template>
        </el-table-column>

        <el-table-column
          label="订单流水"
          header-align="center"
          align="left"
          width="110"
          prop="orderMoney"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{
              row.orderMoney
                ? row.orderMoney
                : row.orderMoney !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>

        <el-table-column label="绩效营收" align="left">
          <template slot-scope="{ row }">
            {{
              row.centerMoney
                ? row.centerMoney
                : row.centerMoney !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>

        <el-table-column label="视频" width="110" align="left">
          <template slot-scope="{ row }">
            <div v-if="row.dynamicLink">
              <el-link
                type="primary"
                class="text-over-hidden-1"
                :href="row.dynamicLink"
                :underline="false"
                target="_blank"
              >
                {{ row.dynamicLink }}
              </el-link>
            </div>
            <VideoList
              v-else
              :list-data="row.video"
              :options="{
                coverImg: 'videoCoverUrl',
                title: 'titleName',
              }"
              :show-video-img="false"
            />
          </template>
        </el-table-column>

        <el-table-column label="款项状态">
          <template slot-scope="{ row }">
            {{ row.paymentStatusName || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          width="200px"
          label="款项截图"
          align="left"
        >
          <template slot-scope="{ row }">
            <ScreenshotsList :picture-list="row.list" />
          </template>
        </el-table-column>

        <el-table-column label="其他信息" header-align="center" align="left" width="180px">
          <template slot-scope="{ row }">
            <p class="other">内容协助：{{ [1].includes(row.contentAssist) ? '需要' : '--' }}</p>
            <p class="other">是否加入乾派mcn：{{
              [0, 1].includes(row.joinMcnFlag)
                ? row.joinMcnFlag
                  ? '是'
                  : '否'
                : '--'
            }}
            </p>
            <p class="other">商单号：{{ row.quotientId | emptyFill }}</p>
          </template>
        </el-table-column>

        <!-- <el-table-column label="达人分成比例" align="left">
          <template slot-scope="{ row }">
            {{
              row.outMoneyRatio
                ? `${row.outMoneyRatio}%`
                : row.outMoneyRatio !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column label="账号单价" align="left">
          <template slot-scope="{ row }">
            {{ row.accountUnitPrice | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="客户返点比例" align="left">
          <template slot-scope="{ row }">
            {{
              row.refundRatio
                ? `${row.refundRatio}%`
                : row.refundRatio !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column label="客户返点金额" align="left">
          <template slot-scope="{ row }">
            {{
              row.refundMoney
                ? row.refundMoney
                : row.refundMoney !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>

        <el-table-column label="达人实际营收" align="left">
          <template slot-scope="{ row }">
            {{
              row.outMoney ? row.outMoney : row.outMoney !== null ? '0' : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="其他费用"
          align="center"
          prop="otherMoney"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{
              row.otherMoney
                ? row.otherMoney
                : row.otherMoney !== null
                  ? '0'
                  : '--'
            }}
          </template>
        </el-table-column>

        <el-table-column
          prop="addTime"
          label="视频发布时间"
          width="160"
          align="left"
        >
          <template slot-scope="{ row }">
            {{ row.addTime ? row.addTime : '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="flowCount"
          label="播放量"
          align="center"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.flowCount | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cpm"
          label="cpm"
          align="center"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.cpm | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="refundFlag" label="是否返款" align="center">
          <template slot-scope="scope">
            {{
              [0, 1].includes(scope.row.refundFlag)
                ? scope.row.refundFlag
                  ? '是'
                  : '否'
                : '--'
            }}
          </template>
        </el-table-column>
        <el-table-column prop="transferFlag" label="是否到账" align="center">
          <template slot-scope="scope">
            {{
              [0, 1].includes(scope.row.joinMcnFlag)
                ? scope.row.joinMcnFlag
                  ? '是'
                  : '否'
                : '--'
            }}
          </template>
        </el-table-column> -->

        <el-table-column label="备注" width="120" align="left">
          <template slot-scope="{ row }">
            <OverPopover :content="row.remark" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" fixed="right">
          <template slot-scope="scope">
            <IconTip
              content="查看"
              icon-class="iconxiangqing"
              class="m-r-10"
              @click="handleShow(scope.row, 'view')"
            />
            <template v-if="scope.row.editAuth">
              <IconTip
                v-if="
                  ([2, 3, 4].includes(scope.row.projectType) ||
                    (scope.row.projectType === 1 &&
                      [1, 2, null, 4].includes(scope.row.workerStatus))) || (+scope.row.workerStatus === 3 && $permission('invoice_status_select'))
                "
                content="编辑"
                icon-class="iconbianji"
                class="m-r-10"
                @click="handleShow(scope.row, 'edit')"
              />
              <IconTip
                v-if="!scope.row.workId"
                content="删除"
                icon-class="iconshanchu"
                @click="handleDetele(scope.row)"
              />
            </template>
          </template>
        </el-table-column>
      </el-table>
    </Wrap>
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
    <AddProjectDialog
      v-if="showAddDialog"
      :order-id="orderId"
      :project-type="projectType"
      :type="type"
      :work-id="workId"
      :worker-status="workerStatus"
      :show-add-dialog="showAddDialog"
      @getList="getList"
      @getStatisticsList="getStatisticsList"
      @close="showAddDialog = false"
    />
    <NewEditDialog
      v-if="showNewEditDialog"
      :order-id="orderId"
      :project-type="projectType"
      :type="type"
      :work-id="workId"
      :worker-status="workerStatus"
      :show-add-dialog="showNewEditDialog"
      :account-id="accountId"
      @getList="getList"
      @getStatisticsList="getStatisticsList"
      @close="showNewEditDialog = false"
    />
  </div>
</template>
<script>
import wrap from '@/views/details/_com/wrap.vue'
import {
  Statistics,
  IconTip,
  VideoList,
  ScreenshotsList,
  OverPopover,
  AccountCard
} from 'components'
import AddProjectDialog from '../_com/addProjectDialog.vue'
import NewEditDialog from '../_com/newEditDialog.vue'
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted
} from '@vue/composition-api'
import Search from '../_com/Search.vue'
import { copy, getMonthStartEnd } from '@/utils'
import { useTableSort } from '@/hook'
import { useStatistics, useMapData } from '../_com/hooks'
import qs from 'qs'
import {
  $getCooperationProjectList,
  $signOrderListStatistics,
  $deleteProjectRow
} from '@/api/sign-contract'
export default defineComponent({
  components: {
    wrap,
    ScreenshotsList,
    VideoList,
    IconTip,
    Search,
    Statistics,
    AddProjectDialog,
    NewEditDialog,
    OverPopover,
    AccountCard
  },
  setup() {
    const { $message, $confirm, $route, $refs, $set, $nextTick } = getCurrentInstance().proxy
    const searchData = reactive({})

    const states = reactive({
      total: 0,
      loading: false,
      showAddDialog: false,
      showNewEditDialog: false,
      tableData: [],
      type: 'add',
      orderId: '',
      projectType: 0,
      workerStatus: null,
      workId: '',
      statisticsLoading: false,
      accountId: 0
    })

    onMounted(async() => {
      const { workId, type } = $route.query

      if (workId && type === 'edit') {
        const { data } = await $getCooperationProjectList({ workId })
        if (data.length) {
          handleShow(data[0], 'edit')
        }
      }

      getList()
    })

    const onSubmit = (data) => {
      data.platIdList = [...(data.platId || [])]
      delete data.platId
      data.pageNum = 1
      Object.assign(searchData, data)
      if (+searchData.hideRevokeOrder === 1) {
        const refs = $refs.Search.$refs
        searchData.workerStatusList = []
        $set(refs.search.form, 'workerStatusList', [])
      }

      $nextTick(() => {
        getStatisticsList(searchData)
        getList()
        searchData.value = {}
      })
    }
    const onExport = (data) => {
      data.platIdList = [...(data.platId || [])]
      delete data.platId
      Object.assign(searchData, data)
      if (+searchData.hideRevokeOrder === 1) {
        const refs = $refs.Search.$refs
        searchData.workerStatusList = []
        $set(refs.search.form, 'workerStatusList', [])
      }

      for (const key in searchData) {
        if (searchData[key] === null || searchData[key] === undefined || searchData[key] === '') {
          delete searchData[key]
        }
      }

      window.open(
        `/api/sign/contract/account/order/downloadSignOrderList?${qs.stringify(
          searchData
        )}`
      )
      searchData.value = {}
    }
    const hanleAddClick = () => {
      states.type = 'add'
      states.showAddDialog = true
      states.projectType = 0
    }
    const initTime = (params) => {
      if (!params.scheduledBegin && !params.scheduledEnd) {
        const time = getMonthStartEnd()
        params.scheduledBegin = time.firstDay
        params.scheduledEnd = time.lastDay + ' 23:59:59'
      }
      if (params.empty) {
        delete params.scheduledBegin
        delete params.scheduledEnd
      }
      delete params.empty
    }
    const initWorkStatus = (params) => {
      if (!params.workerStatusList) {
        params.workerStatusList = [0, 1, 2, 3]
      }
    }
    const getList = () => {
      states.loading = true
      const params = copy(searchData)
      console.log(params, 'paramsList')
      initTime(params)
      initWorkStatus(params)
      $getCooperationProjectList(params)
        .then((res) => {
          if (res.code === 1) {
            const dataList = copy(res.data) || []
            const list = dataList.map((item) => {
              item.list = JSON.parse(item.collectionScreenshots || '[]')
              if (item.titleName) {
                item.video = [
                  {
                    titleName: item.titleName,
                    url: item.url,
                    videoCoverUrl: item.videoCoverUrl
                  }
                ]
              }
              return item
            })
            states.total = res.total
            states.tableData = list
          } else {
            $message.error(res.message)
          }
          states.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          states.loading = false
        })
    }
    const { detailStatistics } = useStatistics()
    const getStatisticsList = () => {
      const params = copy(searchData)
      initTime(params)
      initWorkStatus(params)
      states.statisticsLoading = true
      $signOrderListStatistics(params).then((res) => {
        if (res.code === 1) {
          states.statisticsLoading = false
          if (res.data) {
            detailStatistics.forEach((item) => {
              item.val = res.data[item.key]
                ? res.data[item.key]
                : res.data[item.key] === null
                ? '--'
                : 0
            })
          }
        } else {
          states.statisticsLoading = false
          $message.error(res.message)
        }
      })
    }
    const handleShow = (row, type) => {
      // 新的且是视频工单 进入新弹窗
      // if (+row.versionNum === 1 && +row.projectType === 1) {
      if (+row.projectType === 1) {
        states.showNewEditDialog = true
      } else {
        states.showAddDialog = true
      }

      states.orderId = row.orderId + ''
      states.type = type
      states.workId = row.workId ? String(row.workId) : ''
      states.workerStatus = row.workerStatus
      states.projectType = row.projectType
      states.accountId = row.accountId
    }
    const handleDetele = async(row) => {
      await $confirm('确认删除这条数据吗？')
      $deleteProjectRow({ orderId: row.orderId }).then((res) => {
        if (res.code === 1) {
          getList()
          getStatisticsList()
        } else {
          $message.error(res.message)
        }
      })
    }
    const { doSort } = useTableSort(searchData, getList)
    const { orderStatusMap } = useMapData()
    getStatisticsList()

    return {
      onSubmit,
      onExport,
      doSort,
      getList,
      detailStatistics,
      searchData,
      ...toRefs(states),
      hanleAddClick,
      handleDetele,
      handleShow,
      getStatisticsList,
      orderStatusMap
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .iconshanchu:before {
    color: red;
  }
}

.other {
  font-size: 12px;
}
</style>

