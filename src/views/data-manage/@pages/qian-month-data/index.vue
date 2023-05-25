<template>
  <div>
    <v-header
      :time="pageTime"
      tip="（广告视频统计范围：广告库内数据）"
      :historys="historys"
      :title="`${monthTime}月数据`"
      @change="handleHeaderTimeChange"
    />
    <Summary v-loading="loading.summary" :list="summary" class="m-t-24" />
    <el-tabs v-model="activeName">
      <el-tab-pane label="平台流量分布" name="platFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">月流量平台占比</span>
            </div>
            <!-- 月流量平台占比 -->
            <VChart
              :formater="tooltipFormaterUnit('万')"
              type="pie"
              :data="chartsData.platSpreadPie"
              :loading="loading.platSpread"
            />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">周流量平台分布</span>
            </div>
            <!-- 周流量平台分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackLegendRightChartConfigType"
              :data="chartsData.platSpread"
              :loading="loading.platSpread"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="工作室和上上签数据分布" name="videoFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签流量占比</span>
            </div>
            <!-- 工作室上上签流量占比 -->
            <VChart
              :formater="tooltipFormaterUnit('万')"
              type="pie"
              :data="chartsData.flowResPie"
              :loading="loading.flow"
            />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签流量分布</span>
            </div>
            <!-- 工作室上上签流量分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackLegendRightChartConfigType"
              :data="chartsData.flowRes"
              :loading="loading.flow"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告流量占比</span>
            </div>
            <!-- 工作室上上签广告流量占比 -->
            <VChart
              type="pie"
              :data="chartsData.advFlowResPie"
              :formater="tooltipFormaterUnit('万')"
              :loading="loading.flow"
            />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告流量分布</span>
            </div>
            <!-- 工作室上上签广告流量分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackLegendRightChartConfigType"
              :data="chartsData.advFlowRes"
              :loading="loading.flow"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告执行金额占比</span>
            </div>
            <!-- 工作室上上签广告执行金额占比 -->
            <VChart
              :formater="tooltipFormaterUnit('元')"
              type="pie"
              :data="chartsData.advMoneyResPie"
              :loading="loading.flow"
            />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告执行金额分布</span>
            </div>
            <!-- 工作室上上签广告执行金额分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('元')"
              :config="barStackLegendRightChartConfig"
              :data="chartsData.advMoneyRes"
              :loading="loading.flow"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告视频数占比</span>
            </div>
            <!-- 工作室上上签广告视频数占比 -->
            <VChart
              type="pie"
              :config="pieChartConfig"
              :data="chartsData.flowNumberResPie"
              :loading="loading.flow"
            />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">工作室上上签广告视频数</span>
            </div>
            <!-- 工作室上上签广告视频数 -->
            <VChart
              type="bar"
              :config="barStackLegendRightChartConfig"
              :data="chartsData.flowNumberRes"
              :loading="loading.flow"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="广告金额分布" name="quotientFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">月流量平台占比</span>
            </div>
            <!-- CRM小组合作金额及占比 -->
            <VChart
              type="pie"
              :config="pieLabelChartConfig"
              :data="chartsData.quotientResPie"
              :formater="tooltipFormaterUnit('万')"
              :loading="loading.quotient"
            />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head">
              <IconTip
                placement="top-start"
                trigger="hover"
                content="2021年1月4日之前系统划分商单归属小组时以执行人小组划分，2021年1月4日起系统划分商单归属小组时以商务小组划分。"
                type="popover"
                icon-class="iconwenhao"
                label="商务小组合作金额趋势分布"
              />
            </div>

            <!-- CRM小组合作金额趋势分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackChartConfigType"
              :data="chartsData.quotientRes"
              :loading="loading.quotient"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-24">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">行业类别金额及占比</span>
            </div>
            <!-- 行业类别金额及占比 -->
            <VChart
              type="pie"
              :config="pieLabelChartConfig"
              :data="chartsData.fieldResPie"
              :formater="tooltipFormaterUnit('万')"
              :loading="loading.quotient"
            />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head" />
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackChartConfig"
              :data="chartsData.fieldRes"
              :loading="loading.quotient"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="本月榜单" name="week" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">视频流量top10</span>
            </div>
            <!-- 视频流量top10 -->
            <VChart
              :loading="loading.top"
              type="bar"
              :config="rowBarChartHiddenConfigType"
              :formater="tooltipFormaterVideo"
              :data="chartsData.flowTop"
              @click="handleVideoChartClick"
            />
          </div>

          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">广告视频流量top10</span>
            </div>
            <!-- 广告视频流量top10 -->
            <VChart
              :loading="loading.top"
              type="bar"
              :config="rowBarChartHiddenConfigType"
              :formater="tooltipFormaterVideo"
              :data="chartsData.advFlowTop"
              @click="handleVideoChartClick"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">账号涨粉top10</span>
            </div>
            <!-- 账号涨粉top10 -->
            <VChart
              :loading="loading.top"
              type="bar"
              :config="rowBarChartHiddenConfig"
              :formater="tooltipFormaterVideo"
              :data="chartsData.accountFans"
              @click="handleVideoChartClick"
            />
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Summary from '../../@coms/Summary'
import { VChart, IconTip } from 'components'
import { getWithDec } from '@/components/common'
import commonMixin from '../../@coms/mixins'
import { $getMonthQpData, $getMonthQpMonthFlow, $getMonthQpPlatSpread, $getMonthQpQuotientData, $getMonthQpAccountFlow } from '@/api/data'

export default {
  components: {
    Summary,
    IconTip,
    VChart
  },
  mixins: [commonMixin],
  props: {
    permission: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    this.pieLabelChartConfig = {
      ...this.pieChartConfig,
      label: {
        alignTo: 'edge',
        formatter: '{name|{b}}\n{val|销售收入：{c}万}\n{val|销售占比：{d}%}',
        minMargin: 5,
        edgeDistance: 10,
        lineHeight: 15,
        rich: {
          val: {
            fontSize: 12,
            color: '#999'
          }
        }
      }
    }
    return {
      loading: {
        summary: true,
        platSpread: true,
        flow: true,
        quotient: true,
        top: true
      },
      activeName: 'platFlow',
      summary: {
        sumTitle: {
          text: '标题',
          val: ''
        },
        sumFlow: {
          text: '流量',
          val: ''
        },
        avgFlow: {
          text: '集均播放量',
          val: ''
        },
        sumAdvTitle: {
          text: '广告标题',
          val: ''
        },
        sumAdvFlow: {
          text: '广告流量',
          val: ''
        },
        quotientMoney: {
          text: '商单销售收入',
          val: ''
        },
        advMoney: {
          text: '广告执行金额',
          val: ''
        }
      },
      chartsData: {
        platSpread: null,
        platSpreadPie: null,
        teamFlow: null,
        teamScore: null,

        flowRes: null,
        flowResPie: null,
        advFlowRes: null,
        advFlowResPie: null,
        advMoneyRes: null,
        advMoneyResPie: null,
        flowNumberRes: null,
        flowNumberResPie: null,
        accountFans: null,

        accountFlow: null,
        titleFlow: null,

        quotientRes: null,
        quotientResPie: null
      }
    }
  },
  computed: {
    exportMonthUrl() {
      return this.$request.buildUrl('/hdjt/month_back/export_excel')
    }
  },
  created() {
    this.getHistoryList('month')
  },
  methods: {
    // 导出报表数据
    handleCommand(command) {
      const paramsStr = `?start_time=${this.pageTime.start_time}&end_time=${this.pageTime.end_time}&main_code=${command}&monthTime=${this.monthTime}`
      window.open(`${this.exportMonthUrl}${paramsStr}`)
    },
    formateChartData(res, type) {
      this.chartsData[`${type}Pie`] = {
        terms: res.cates.map(item => item.typeName),
        values: res.values.map(item => {
          return item.reduce((sum, num) => sum + num).toFixed(2)
        }),
        cates: res.cates.map(item => item.typeName)
      }
      this.chartsData[type] = {
        cates: res.cates.map(item => item.typeName),
        terms: (res.terms || res.term).map(item => this.formatTimeStr(item)),
        values: res.values
      }
    },
    formatTimeStr(start_end) {
      // 2020-05-01----2020-05-02 -> 2020.05.01~2020.05.02
      const dateArr = start_end.split('----')
      return dateArr
        .map(item => {
          return item
            .split('-')
            .slice(1)
            .join('.')
        })
        .join('~')
    },
    processMid(data, keyValueMap) {
      keyValueMap = keyValueMap || {
        accountFans: {
          text: 'accountName',
          val: 'addFans',
          name: '涨粉'
        },
        accountFlow: {
          text: 'accountName',
          val: 'addFlow',
          name: '新增流量'
        },
        titleFlow: {
          text: 'title',
          val: 'flowCount',
          name: '广告视频流量'
        }
      }
      Object.keys(data).forEach((key) => {
        const mapItem = keyValueMap[key]
        const dat = {
          terms: [],
          values: [],
          cates: [key]
        }

        const valDat = []
        data[key].forEach(function(item) {
          dat.terms.push(item[mapItem.text])
          valDat.push(item[mapItem.val])
        })
        dat.terms.reverse()
        valDat.reverse()
        dat.values = valDat
        this.chartsData[key] = dat
        this.chartsData[`o_${key}`] = data[key]
      })
    },
    getDataFlowScore() {
      this.loading.summary = true
      $getMonthQpData(this.pageTime).then((res) => {
        if (res.code === 1) {
          res = res.data
          for (const key in res) {
            this.summary[key].val = res[key]
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading.summary = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.summary = false
      })
    },

    getPageData() {
      this.getPlatSpread()
      this.getMonthFlow()
      this.getQuotientFlow()
      this.getBottomCharts()
    },
    getPlatSpread() {
      this.loading.platSpread = true
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getMonthQpPlatSpread(query).then(res => {
        if (res.code === 1) {
          res = res.data
          this.formateChartData(res, 'platSpread')
        } else {
          this.$message.error(res.message)
        }
        this.loading.platSpread = false
      }).catch(err => {
        if (err.__CANCEL__) return
         this.loading.platSpread = false
      })
    },
    getBottomCharts() {
      this.loading.top = true
      $getMonthQpAccountFlow(this.pageTime).then((res) => {
        if (res.code === 1) {
          res = res.data
          this.processMid(res, {
            accountFans: {
              text: 'accountName',
              val: 'addFans',
              name: '账号涨粉top10'
            },
            advFlowTop: {
              text: 'title',
              val: 'flowCount',
              name: '广告视频流量top10'
            },
            flowTop: {
              text: 'title',
              val: 'flowCount',
              name: '视频流量top10'
            }
          }
          )
        }
        this.loading.top = false
      }).catch(err => {
        if (err.__CANCEL__) return
         this.loading.platSpread = false
      })
    },
    // 工作室和上上签流量分布
    getMonthFlow() {
      this.loading.flow = true
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getMonthQpMonthFlow(query).then(re => {
        if (re.code === 1) {
          re = re.data
          this.formateChartData(re.advFlowRes, 'advFlowRes')
          this.formateChartData(re.flowRes, 'flowRes')
          this.formateChartData(re.advMoneyRes, 'advMoneyRes')
          this.formateChartData(re.flowNumberRes, 'flowNumberRes')
        } else {
          this.$message.error(re.message)
        }
        this.loading.flow = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.flow = false
      })
    },
    // 广告金额分布
    getQuotientFlow() {
      this.loading.quotient = true
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getMonthQpQuotientData(query).then(re => {
        if (re.code === 1) {
          re = re.data
          for (const key in re) {
            this.formateChartData(re[key], key)
          }
        }
        this.loading.quotient = false
      }).catch(err => {
         this.loading.quotient = false
      })
    },
    setPieConfig(unit = '', multiple = 1) {
      return {
        height: 600,
        legend: {
          show: true,
          right: '20%',
          top: '1%'
        },
        grid: {
          left: 90
        },
        tooltip: {
          trigger: 'item',
          formatter: function(info) {
            return `${info.name}<br />${getWithDec(info.value / multiple, 2)}${unit} (${info.percent}%)`
          }
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../@coms/common.scss';
  ::v-deep {
    .el-tabs__header {
      background: transparent;
    }
  }
</style>
