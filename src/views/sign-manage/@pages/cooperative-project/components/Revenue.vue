<template>
  <div>
    <Wrap class="search-view">
      <Search
        tab-name="revenue"
        @onSubmit="onSubmit"
        @onExport="onExport"
        @onMonthPayment="onMonthPayment"
      />
    </Wrap>
    <Wrap v-if="$permission('center-revenues-statistical')" class="m-t-24">
      <Statistics
        v-loading="statisticsLoading"
        class="statistics data-wrap"
        :data="revenueStatistics1"
      />
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics
        v-loading="statisticsLoading"
        class="statistics data-wrap"
        :data="revenueStatistics2"
      />
    </Wrap>
    <Wrap v-if="list.length" v-loading="loading" class="table-view m-t-24">
      <div class="flex flex-justify-center m-b-16">各组成员营收明细</div>
      <div class="flex">
        <el-table
          v-for="(item, itemIndex) in list"
          :key="itemIndex"
          v-scrollbar
          class="table"
          :data="item.memberDetails"
          border
        >
          <el-table-column
            :label="list[itemIndex].orgName"
            prop="userName"
            align="left"
          />
          <el-table-column
            :label="list[itemIndex].orderMoneySumName"
            prop="orderMoneySum"
            align="left"
          />
        </el-table>
      </div>
    </Wrap>
    <MonthlyPaymentsDialog
      v-if="showMonthDialog"
      :show-month-dialog="showMonthDialog"
      @getList="getList"
      @getStatisticsList="getStatisticsList"
      @close="showMonthDialog = false"
    />
  </div>
</template>
<script>
import wrap from '@/views/details/_com/wrap.vue'
import MonthlyPaymentsDialog from '../_com/monthlyPaymentsDialog.vue'
import { getMonthStartEnd } from '@/utils'
import { Statistics } from 'components'
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import Search from '../_com/revenueSearch.vue'
import { copy } from '@/utils'
import { useTableSort } from '@/hook'
import { useStatistics } from '../_com/hooks'
import qs from 'qs'
import dayjs from 'dayjs'
import {
  $getRevenueDetailList,
  $getRevenueStatistics
} from '@/api/sign-contract'
export default defineComponent({
  components: { wrap, Search, Statistics, MonthlyPaymentsDialog },
  setup() {
    const { $message } = getCurrentInstance().proxy
    const searchData = reactive({})
    const states = reactive({
      total: 0,
      loading: false,
      showMonthDialog: false,
      statisticsLoading: false,
      list: []
    })
    const onSubmit = (data) => {
      Object.assign(searchData, data)
      getStatisticsList(searchData)
      getList()
    }
    const onExport = (data) => {
      Object.assign(searchData, data)
      window.open(`?${qs.stringify(searchData)}`)
    }
    const onMonthPayment = () => {
      states.showMonthDialog = true
    }
    const { revenueStatistics1, revenueStatistics2 } = useStatistics()
    const initTime = (params) => {
      if (!params.scheduledBegin && !params.scheduledEnd) {
        const time = getMonthStartEnd()
        params.scheduledBegin = time.firstDay
        params.scheduledEnd = time.lastDay + ' 23:59:59'
      }
      if (!params.startTime) {
        const performanceMonth = dayjs().format('YYYY-MM')
        params.startTime = performanceMonth
        params.endTime = performanceMonth
      }
      if (params.empty) {
        delete params.scheduledBegin
        delete params.scheduledEnd
      }
      if (params.performance) {
        delete params.startTime
        delete params.endTime
      }
      delete params.empty
      delete params.performance
    }
    const getStatisticsList = () => {
      const params = copy(searchData)
      initTime(params)
      states.statisticsLoading = true
      $getRevenueStatistics(params).then((res) => {
        if (res.code === 1) {
          states.statisticsLoading = false
          const projectSumStatisticsDataBO = res.data.projectSumStatisticsDataBO
          const projectSumStatisticsSubBO = res.data.projectSumStatisticsSubBO
          if (projectSumStatisticsDataBO) {
            revenueStatistics1.forEach((item) => {
              item.val = projectSumStatisticsDataBO[item.key]
                ? projectSumStatisticsDataBO[item.key]
                : projectSumStatisticsDataBO[item.key] === null
                ? '--'
                : 0
            })
          }
          if (projectSumStatisticsSubBO) {
            revenueStatistics2.forEach((item) => {
              item.val = projectSumStatisticsSubBO[item.key]
                ? projectSumStatisticsSubBO[item.key]
                : projectSumStatisticsSubBO[item.key] === null
                ? '--'
                : 0
              if (item.key === 'orderMoneyCompleteRatio' && item.val !== '--') {
                item.val = item.val + '%'
              }
            })
          }
        } else {
          states.statisticsLoading = false
          $message.error(res.message)
        }
      }).catch(err => {
        states.statisticsLoading = false
        console.log(err)
      })
    }
    const getList = () => {
      states.loading = true
      const parmas = copy(searchData)
      initTime(parmas)
      $getRevenueDetailList(parmas)
        .then((res) => {
          if (res.code === 1) {
            states.list = res.data
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
    const { doSort } = useTableSort(searchData, getList)
    getList()
    getStatisticsList()
    return {
      onSubmit,
      onExport,
      doSort,
      getList,
      revenueStatistics1,
      revenueStatistics2,
      searchData,
      ...toRefs(states),
      onMonthPayment,
      getStatisticsList
    }
  }
})
</script>
<style lang="scss" scoped>
.table {
  &:not(:first-child) {
    border-left: none !important;
  }
}
</style>
