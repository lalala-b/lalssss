
<template>
  <div class="table-view">
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      @sort-change="doSort"
    >
      <el-table-column label="排行" type="index" />

      <el-table-column prop="orgName" label="组织">
        <template slot-scope="{ row }">
          {{
            [row.orgName, row.businessTeamName].filter((item) => item).join('-') || '--'
          }}
        </template>
      </el-table-column>

      <el-table-column prop="businessUserName" label="商务人员" />

      <el-table-column
        prop="opportunityCount"
        label="总商机数"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{ row.opportunityCount === null ? '--' : row.opportunityCount }}
        </template>
      </el-table-column>

      <el-table-column prop="successRatio" label="商机成功率" :sortable="true">
        <template slot-scope="{ row }">
          {{ row.successRatio === null ? '--' : `${row.successRatio}%` }}
        </template>
      </el-table-column>

      <el-table-column
        prop="accountWinRatio"
        label="账号中标率"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{ row.accountWinRatio === null ? '--' : `${row.accountWinRatio}%` }}
        </template>
      </el-table-column>

      <el-table-column prop="confirmCount" label="确认合作" :sortable="true">
        <template slot-scope="{ row }">
          {{ row.confirmCount === null ? '--' : row.confirmCount }}
        </template>
      </el-table-column>

      <el-table-column prop="waitCount" label="等待结果" :sortable="true">
        <template slot-scope="{ row }">
          {{ row.waitCount === null ? '--' : row.waitCount }}
        </template>
      </el-table-column>

      <el-table-column prop="suspendCount" label="暂不合作" :sortable="true">
        <template slot-scope="{ row }">
          {{ row.suspendCount === null ? '--' : row.suspendCount }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleGoDetail(row)">明细</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="50"
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
import { $getOpportunityRankList } from '@/api/bussiness-manage'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    }
  },
  components: {},
  setup(props, { emit }) {
    const { $message, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: []
    })

    const getList = function() {
      // state.loading = true
      const searchData = copy(props.searchData)
      return $getOpportunityRankList({
        ...searchData,
        size: 50
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data || []
            state.total = res.total
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

    const handleGoDetail = ({ type, businessUserId }) => {
      // let activeName = ''
      // if (type === 0) {
      //   // mcn
      //   activeName = 'Mcn'
      // } else {
      //   // 向乾
      //   activeName = 'XiangQian'
      // }
      // $router.push({
      //     path: `/bussiness-manage/business_opportunity_manage`,
      //     query: {
      //       activeName,
      //       id: businessUserId,
      //       _blank: true
      //     }
      //   })

      emit('replace', { activeName: 'CommercialOpportunity', id: businessUserId })
      // const url = `/#?activeName=${activeName}&id=${businessUserId || ''}`
      // // emit('replace', { activeName, id: businessUserId })
      // window.location.href = url
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
