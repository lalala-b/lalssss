<template>
  <Wrap class="table-view">
    <h2>数据概况</h2>
    <div class="flex flex-justify-between flex-align-center m-t-10">
      <div>时间范围：<el-date-picker
        v-model="daterange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        size="small"
        :picker-options="pickerOptions"
        @change="handleSearch"
      /></div>
      <div class="bus-wrap">
        <el-button :class="{'select': businessLine === ''}" size="small" @click="handleChanfeBusiness('')">全部应用</el-button>
        <el-button :class="{'select': businessLine === 'zz'}" size="small" @click="handleChanfeBusiness('zz')">转转</el-button>
        <el-button :class="{'select': businessLine === 'zlj'}" size="small" @click="handleChanfeBusiness('zlj')">找靓机</el-button>
      </div>
    </div>
    <div class="m-t-10">
      <el-select v-model="platId" placeholder="平台" size="small" @change="handleSearch">
        <el-option label="全部平台" value="" />
        <el-option v-for="item in platList" :key="item.platId" :label="item.platName" :value="item.platId" />
      </el-select>
    </div>
    <ul class="sum-wrap flex m-t-24">
      <li class="flex flex-align-center flex-dir-col">
        <p class="flex flex-align-center">
          <span>
            总消耗
          </span>
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            content="广告投放总共付出的费用成本，当天数据可能会有波动，次日稳定实际花费请以各平台财务记录为准。"
          >
            <div slot="reference">
              <i class="el-icon-question" />
            </div>
          </el-popover>
        </p>
        <div>{{ sum.sumCost || '--' }}</div>
      </li>
      <li class="flex flex-align-center flex-dir-col">
        <p class="flex flex-align-center">
          <span>APP拉新激活</span>
          <el-popover
            placement="top"
            width="300"
            trigger="hover"
            content="用户安装app完成并第一次打开app（对接量API，激活数是被认可且回传成功的激活数）。"
          >
            <div slot="reference">
              <i class="el-icon-question" />
            </div>
          </el-popover></p>
        <div>{{ sum.sumActivatedCount || '--' }}</div>
      </li>
    </ul>
    <div class="m-t-24">
      <el-select v-model="leftTarget" size="small" @change="handleTargetChange">
        <el-option
          v-for="item in targetList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
          :disabled="item.value === rightTarget"
        />
      </el-select>
      <span> 对比 </span>
      <el-select v-model="rightTarget" size="small" @change="handleTargetChange">
        <el-option
          v-for="item in targetList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
          :disabled="item.value === leftTarget"
        />
      </el-select>
    </div>
    <VChart :data="chartData" :config="lineConfig" :loading="chartLoading" />
    <!-- <div v-if="isEmpty" class="empty-wrap">暂无数据</div>
    <div v-show="!isEmpty">
      <div ref="chart" class="chart-wrap" />
    </div> -->
    <div class="m-t-24">
      <div class="flex flex-justify-between">
        <h2>明细数据</h2>
        <a class="expott-btn" @click="handleExport">导出</a>
      </div>
      <el-table
        v-scrollbar
        class="m-t-10"
        :data="tableData"
      >
        <el-table-column label="时间" prop="dataDate" align="center" />
        <el-table-column label="消耗" prop="sumCost" align="center">
          <template slot="header">
            <div class="flex flex-justify-center">
              消耗
              <el-popover
                placement="top"
                width="300"
                trigger="hover"
                content="广告投放费用成本,当天数据可能会有波动,次日稳定，实际花费请以各平台财务记录为准。"
              >
                <div slot="reference">

                  <i class="el-icon-question" />
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="展示" prop="sumViewCount" align="center" />
        <el-table-column label="平均千次展现费用" prop="sumThousandDisplayPrice">
          <template slot="header">
            <div class="flex flex-justify-center">
              平均千次展现费用
              <el-popover
                placement="top"
                width="300"
                trigger="hover"
                content="平均每一千次所展现付出的费用，计算公式是：花费/曝光量*1000。"
              >
                <div slot="reference">
                  <i class="el-icon-question" />
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="点击" prop="sumValidClickCount" align="center" />
        <el-table-column label="平均点击单价" prop="sumCpc" align="center">
          <template slot="header">
            <div class="flex flex-justify-center">
              平均点击单价
              <el-popover
                placement="top"
                width="300"
                trigger="hover"
                content="每次点击付出的费用成本，计算公式是：花费/点击量。"
              >
                <div slot="reference">
                  <i class="el-icon-question" />
                </div>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="APP拉新激活" prop="sumActivatedCount" align="center">
          <template slot="header">
            <div class="flex flex-justify-center">
              APP拉新激活
              <el-popover
                placement="top"
                width="300"
                trigger="hover"
                content="用户安装app完成并第一次打开app（对接量API，激活数是被认可且回传成功的激活数）。"
              >
                <div slot="reference">
                  <i class="el-icon-question" />
                </div>
              </el-popover>
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
          :current-page.sync="pageNum"
          @current-change="getDetailData"
        />
      </div>
    </div>
    <div class="flex flex-align-center m-t-24">一键导出各账户消耗明细
      <el-button v-log="{operation_module: '一键导出各账户消耗明细'}" class="m-l-10" type="primary" @click="handleAllExport">导出</el-button>
    </div>
  </Wrap>
</template>
<script>
import { onMounted, reactive, toRefs } from '@vue/composition-api'
import { VChart } from 'components'
import { $getDetailData, $getTrendChart, $getCondition, BASE_URL } from '@/api/information'
import dayjs from 'dayjs'
import qs from 'qs'
export default {

  components: {
    VChart
  },

  setup(props, ctx) {
    function useSearch() {
      const state = reactive({
        daterange: [dayjs().format('YYYY-MM-DD'), dayjs().format('YYYY-MM-DD')],
        platId: '',
        platList: [],
        pickerOptions: {
          shortcuts: [
            {
              text: '今日',
              onClick(picker) {
                const end = dayjs().format('YYYY-MM-DD')
                const start = dayjs().format('YYYY-MM-DD')
                picker.$emit('pick', [start, end])
              }
            },
            {
              text: '昨日',
              onClick(picker) {
                const start = dayjs().add(-1, 'day').format('YYYY-MM-DD')
                picker.$emit('pick', [start, start])
              }
            }, {
              text: '最近一周',
              onClick(picker) {
                const end = dayjs().format('YYYY-MM-DD')
                const start = dayjs().add(-1, 'week').format('YYYY-MM-DD')
                picker.$emit('pick', [start, end])
              }
            }, {
              text: '最近一个月',
              onClick(picker) {
                const end = dayjs().format('YYYY-MM-DD')
                const start = dayjs().add(-1, 'month').format('YYYY-MM-DD')
                picker.$emit('pick', [start, end])
              }
            }]
        },
        businessLine: '',
        pageNum: 0
      })
      $getCondition().then(res => {
        state.platList = res && res.platInfo
      })
      function handleChanfeBusiness(businessLine) {
        state.businessLine = businessLine || ''
        handleSearch()
      }
      return {
        state,
        handleChanfeBusiness
      }
    }

    const { state: searchData, handleChanfeBusiness } = useSearch()

    function useEchart() {
      const state = reactive({
        targetList: [{
          text: '消耗数',
          value: 'sumCost'
        }, {
          text: '展示数',
          value: 'sumViewCount'
        }, {
          text: '点击数',
          value: 'sumValidClickCount'
        }, {
          text: 'APP拉新激活数',
          value: 'sumActivatedCount'
        }],
        leftTarget: 'sumCost',
        rightTarget: 'sumValidClickCount',
        chartData: {
          terms: [],
          values: [],
          cates: ['消耗数', '点击数']
        },
        lineConfig: {
          yAxis: [{
            type: 'value'
          }, {
            type: 'value'
          }]
          // cols: [{}, {}]
        },
        chartLoading: true
      })

      const chartMap = {
        sumActivatedCount: {
          text: 'APP拉新激活数',
          value: []
        },
        sumCost: {
          text: '消耗数',
          value: []
        },
        sumValidClickCount: {
          text: '点击数',
          value: []
        },
        sumViewCount: {
          text: '展示数',
          value: []
        }
      }
      function getEchart() {
        state.chartLoading = true
        const dateStart = `${searchData.daterange[0]}`
        const dateEnd = `${searchData.daterange[1]} 23:59:59`
        state.chartData = {
          values: [],
          cates: [],
          terms: []
        }
        $getTrendChart({
          dateStart,
          dateEnd,
          platId: searchData.platId,
          businessLine: searchData.businessLine
        }).then(res => {
          for (const key in chartMap) {
            chartMap[key].value = []
          }
          if (!res || res.length === 0) {
            state.chartLoading = false
            return
          }
          for (const key in chartMap) {
            chartMap[key].value = []
          }
          const terms = []
          res.forEach(item => {
            terms.push(item.dataDate)
            for (const key in chartMap) {
              chartMap[key].value.push(item[key])
            }
          })
          state.chartData.terms = terms
          ctx.root.$nextTick(() => {
            buildData()
            state.chartLoading = false
          })
        })
      }

      function buildData() {
        state.chartData.values = [chartMap[state.leftTarget].value, chartMap[state.rightTarget].value]
        state.chartData.cates = [chartMap[state.leftTarget].text, chartMap[state.rightTarget].text]

        // state.options.yAxis[0].name = chartMap[state.leftTarget].text
        // state.options.yAxis[1].name = chartMap[state.rightTarget].text
        // state.options.xAxis.data = [...state.chartData.terms]
        // state.options.legend.data = [chartMap[state.leftTarget].text, chartMap[state.rightTarget].text]
      }

      function handleTargetChange() {
        state.chartLoading = true
        buildData()
        ctx.root.$nextTick(() => {
          state.chartLoading = false
        })
        state.chartLoading = false
      }

      return {
        getEchart,
        buildData,
        handleTargetChange,
        state
      }
    }

    const { getEchart, handleTargetChange, state: chartState } = useEchart()

    const state = reactive({
      sum: {},
      tableData: [],
      total: 0
    })

    function getDetailData() {
      const dateStart = `${searchData.daterange[0]}`
      const dateEnd = `${searchData.daterange[1]} 23:59:59`
      $getDetailData({
        businessLine: searchData.businessLine,
        platId: searchData.platId,
        dateStart,
        dateEnd,
        pageNum: searchData.pageNum
      }).then(res => {
        state.sum = res.adPlatAdvertisingGroupDataStaticBO || {}
        state.tableData = res.list || []
        state.total = res.total
      }).catch(err => {
        ctx.root.$message(err.message)
      })
    }

    onMounted(() => {
      handleSearch()
    })

    function handleSearch() {
      getDetailData()
      getEchart()
    }

    function handleExport() {
      const params = {
        dateStart: `${searchData.daterange[0]}`,
        dateEnd: `${searchData.daterange[1]} 23:59:59`,
        platId: searchData.platId,
        businessLine: searchData.businessLine
      }
      window.open(`${BASE_URL}/adpi/export?${qs.stringify(params)}`)
    }

    function handleAllExport() {
      const params = {
        dateStart: `${searchData.daterange[0]}`,
        dateEnd: `${searchData.daterange[1]} 23:59:59`,
        platId: searchData.platId,
        businessLine: searchData.businessLine
      }
      window.open(`${BASE_URL}/adpi/exportDetail?${qs.stringify(params)}`)
    }

    return {
      handleSearch,
      handleTargetChange,
      handleChanfeBusiness,
      handleAllExport,
      handleExport,
      getDetailData,
      ...toRefs(state),
      ...toRefs(searchData),
      ...toRefs(chartState)
    }
  }
}
</script>
<style lang="scss" scoped>
  .sum-wrap {
    li {
      width: 200px;
      padding: 20px;
      border: 1px solid rgb(220, 223, 230);
      margin-right: 50px;
      text-align: center;
      border-radius: 4px;
      > p {
        position: relative;
        font-size: 14px;
        i {
          // position: absolute;
          // font-size: 14px;
          // right: -24px;
          // top: 50%;
          // transform: translateY(-50%);
        }
      }
      > div {
        margin-top: 10px;
        font-size: 24px;
      }
    }
  }
  .chart-wrap {
    height: 400px;
  }
  .empty-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 400px;
  }
  .bus-wrap {
    .select {
      color: #e5586a;
      background: #ffeded;
      border-color: #ffeded;
    }
    > button {
      &:hover {
        color: #e5586a;
        background: #ffeded;
        border-color: #ffeded;
      }
    }
  }
  .expott-btn {
    font-size: 14px;
  }
</style>
