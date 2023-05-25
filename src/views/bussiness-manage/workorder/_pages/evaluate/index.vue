
<template>
  <wrap>
    <div class="table-view">
      <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">

        <el-table-column
          prop="workerStatus"
          label="工单状态"
        >
          <template slot-scope="{ row }">
            {{ workArr[row.workerStatus] || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="monthMoneyNew"
          label="工单绩效月"
          sortable="custom"
          width="120"
        >
          <template slot-scope="{ row }">
            {{ row.monthMoneyNew || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          label="账号信息"
          width="180"
          align="left"
        >
          <template slot-scope="{ row }">
            <!-- {{ row. || '--' }} -->
            <AccountCard :info="row" />
          </template>
        </el-table-column>

        <el-table-column
          prop="accountBelong"
          label="订单归属"
        >
          <template slot-scope="{ row }">
            {{ row.accountBelong || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          label="合作产品-品牌"
          width="120"
        >
          <template slot-scope="{ row }">
            <div>
              {{ [row.quotientName, row.brandName].filter(item => item).join('-') || '--' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="crmGroupName"
          label="商务信息"
        >
          <template slot-scope="{ row }">
            <div>
              {{ [row.crmName, row.crmTeamName, row.crmGroupName].filter(item => item).join('-') || '--' }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="recordsTime"
          label="录单耗时"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.recordsTime || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="executeName"
          label="执行人"
        >
          <template slot-scope="{ row }">
            {{ row.executeName || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="quotientType"
          label="商单类型"
        >
          <template slot-scope="{ row }">
            {{ quotientArr[row.quotientType] || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="quotientId"
          label="商单号"
          sortable="custom"
          width="200"
        >
          <template slot-scope="{ row }">
            {{ row.quotientId || '--' }}
          </template>
        </el-table-column>

        <el-table-column
          prop="productTime"
          label="商单成单日期"
          sortable="custom"
          width="170"
        >
          <template slot-scope="{ row }">
            {{ row.productTime || '--' }}
          </template>
        </el-table-column>

        <el-table-column label="视频" width="105" align="left">
          <template slot-scope="{ row }">
            <VideoList
              :list-data="row.videos"
              :options="{
                coverImg: 'videoCoverUrl',
                title: 'titleName',
              }"
              :show-video-count="1"
              :show-video-img="false"
            >
              <div
                v-if="row.videos && row.videos.length > 1"
                slot="more"
                class="more-video"
                @click="handleShow(row, 'detail')"
              >
                更多
              </div>
            </VideoList>
          </template>
        </el-table-column>

        <el-table-column
          prop="executeMoney"
          label="执行金额"
          sortable="custom"
          width="126"
        >
          <template slot="header">
            <IconTip
              content="执行金额=销售收入-销售成本"
              label="执行金额"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <span :class="{ 'tip-red': row.executeMoney < 0 }">
              {{ row.executeMoney }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="120"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <IconTip
              v-log="{ quotientId: row.quotientId }"
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(row, 'detail')"
            />
            <el-button type="text" class="evaluateButton" @click="handleShowEvaluateDialog(row)">立即评价</el-button>
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

    <EditDialog
      v-if="showDialog"
      v-model="showDialog"
      :work-id="workId"
      :dia-log-type="diaLogType"
      :account-type="accountType"
      @success="getList"
    />

    <NewEditDialog
      v-if="showNewDialog"
      v-model="showNewDialog"
      :work-id="workId"
      :dia-log-type="diaLogType"
      @success="getList"
    />

    <EvaluateDialog
      :show="showEvaluateDialog"
      :data="rowData"
      @close="handleCloseEvaluateDialog"
      @success="handleSuccessEvaluate"
    />
  </wrap>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { VideoList, IconTip, AccountCard } from 'components'
import { $getEvaluateList } from '@/api/bussiness-manage'
import { $getDeskEvaluateList } from '@/api/business-desk'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'
import EvaluateDialog from './dialog.vue'
import EditDialog from '../order/EditDialog.vue'
import NewEditDialog from '../order/NewEditDialog.vue'

export default defineComponent({
  components: {
    VideoList,
    EvaluateDialog,
    EditDialog,
    NewEditDialog,
    AccountCard,
    IconTip
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy

    const state = reactive({
      total: 0,
      loading: false,
      tableData: [],
      pageNum: 1,
      workArr: ['商业信息待录入', '待履约', '已履约', '已核账'],
      quotientArr: ['--', '客户自行下单', '代客下单', '平台营收', '不走平台的私单'],
      workId: '',
      showDialog: false,
      accountType: '',
      showNewDialog: false,
      diaLogType: '',
      showEvaluateDialog: false,
      rowData: {}
    })

    const searchData = reactive({
      pageNum: 1
    })

    const handleGoDetail = (row) => {}

    const getList = function() {
      state.loading = true
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        searchData.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskEvaluateList : $getEvaluateList
      return $api({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (+res.code === 1) {
            state.tableData = res.data || []
            state.total = res.total || 0
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    // 查看显示
    const handleShow = (rowData, diaLogType = 'detail') => {
      const { workId, versionNum, accountTypeForJump } = rowData
      state.workId = workId
      if (+versionNum) {
        if (+accountTypeForJump === 2) {
          state.showDialog = true
          state.accountType = +accountTypeForJump
        } else {
          state.showNewDialog = true
        }
      } else {
        state.showDialog = true
      }
      state.diaLogType = diaLogType
    }

    const handleShowEvaluateDialog = (row) => {
      state.rowData = row
      state.showEvaluateDialog = true
    }

    const handleCloseEvaluateDialog = () => {
      state.showEvaluateDialog = false
    }

    const handleSuccessEvaluate = () => {
      getList()
      emit('changeTabNum')
    }

    // 排序
    const { doSort } = useTableSort(searchData, getList)

    getList()
    return {
      ...toRefs(state),
      searchData,
      doSort,
      getList,
      handleShow,
      handleGoDetail,
      handleShowEvaluateDialog,
      handleCloseEvaluateDialog,
      handleSuccessEvaluate
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .table-view {
    margin-top: 20px;
  }

  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}

.evaluateButton {
  vertical-align: 2px;
}
</style>

