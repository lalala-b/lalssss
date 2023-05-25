
<template>
  <div class="table-view">
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      @sort-change="doSort"
    >
      <el-table-column type="index" label="序号" />

      <el-table-column prop="crmGroupName" label="商务小组">
        <template slot-scope="{ row }">
          {{ row.crmGroupName || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="realname" label="商务人员">
        <template slot-scope="{ row }">
          {{ row.realname || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="avgRecordsTime" label="平均耗时" sortable="custom">
        <template slot-scope="{ row }">
          {{ row.avgRecordsTime || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="maxRecordsTime"
        label="单个工单最长耗时"
        sortable="custom"
      >
        <template slot-scope="{ row }">
          {{ row.maxRecordsTime || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="orderTotal" label="视频工单数量" sortable="custom">
        <template slot-scope="{ row }">
          {{ row.orderTotal || '--' }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleGoDetail(row)"
          >工单明细</el-button>
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
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $getEntryRankingList } from '@/api/bussiness-manage'
import { $getDeskEntryRankingList } from '@/api/business-desk'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  setup(props) {
    const { $message, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: []
    })

    const handleGoDetail = (row) => {
      // const href = `/#/bussiness-manage/workorder?activeName=order&tabName=视频工单&id=${row.businessUserId}`
      // window.location.href = href
      const query = {
        activeName: 'order',
        tabName: '视频工单',
        userId: row.businessUserId,
        _blank: true
      }
      const { productTimeBegin, productTimeEnd, monthMoneyNewStart, monthMoneyNewEnd } = props.searchData
      if (productTimeBegin && productTimeEnd) {
        query.bTime = `${productTimeBegin},${productTimeEnd}`
      }

      if (monthMoneyNewStart && monthMoneyNewEnd) {
        query.oTime = `${monthMoneyNewStart},${monthMoneyNewEnd}`
      }
      if (localStorage.getItem('deskType')) {
         $router.push({
        path: `/bussiness-manage/my-team-desk`,
        query
      })
      } else {
        $router.push({
        path: `/bussiness-manage/workorder`,
        query
        })
      }
    }

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        searchData.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskEntryRankingList : $getEntryRankingList
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
    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      ...toRefs(state),
      doSort,
      getList,
      handleGoDetail
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
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
</style>

