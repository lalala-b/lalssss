<template>
  <div>
    <v-header
      :time="pageTime"
      tip="（广告视频统计范围：广告库内数据）"
      title="一周广告视频数据"
      :historys="historys"
      @change="handleHeaderTimeChange"
    />
    <Summary v-loading="loading.summary" :list="summary" class="m-t-24" />
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.platFlow && chartsData.platFlow.mainName }}</span>
        </div>
        <!-- 平台流量占比 -->
        <VChart
          type="pie"
          :config="pieChartConfig"
          :data="chartsData.platFlow"
          :formater="tooltipFormaterUnit('万', 10000)"
          :loading="loading.plat"
        />
      </div>
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.qpFlow && chartsData.qpFlow.mainName }}占比</span>
        </div>
        <!-- 工作室上上签流量占比 -->
        <VChart
          type="pie"
          :formater="tooltipFormaterUnit('万')"
          :data="chartsData.qpFlow"
          :loading="loading.plat"
        />
      </div>
    </div>
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.qpAdvFlow && chartsData.qpAdvFlow.mainName }}占比</span>
        </div>
        <!-- 工作室上上签广告流量占比 -->
        <VChart
          type="pie"
          :config="pieChartConfig"
          :data="chartsData.qpAdvFlow"
          :formater="tooltipFormaterUnit('万', 10000)"
          :loading="loading.plat"
        />
      </div>
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.qpFlowNumber && chartsData.qpFlowNumber.mainName }}占比</span>
        </div>
        <!-- 工作室上上签广告视频数占比 -->
        <VChart
          type="pie"
          :config="pieChartConfig"
          :data="chartsData.qpFlowNumber"
          :loading="loading.plat"
        />
      </div>
    </div>
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">工作室上上签流量</span>
        </div>
        <!-- 工作室上上签流量 -->
        <VChart
          :loading="loading.plat"
          type="bar"
          :config="rowBarChartConfig"
          :formater="tooltipFormaterUnit('万')"
          :data="chartsData.qpFlow"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">工作室上上签广告流量</span>
        </div>
        <!-- 工作室上上签广告流量 -->
        <VChart
          :loading="loading.plat"
          type="bar"
          :config="rowBarChartConfig"
          :formater="tooltipFormaterUnit('万')"
          :data="chartsData.qpAdvFlow"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">工作室上上签广告执行金额</span>
        </div>
        <!-- 工作室上上签广告执行金额 -->
        <VChart
          :loading="loading.plat"
          type="bar"
          :config="rowBarChartConfig"
          :formater="tooltipFormaterUnit('元')"
          :data="chartsData.qpMoneyFlow"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">工作室上上签广告视频数</span>
        </div>
        <!-- 工作室上上签广告视频数 -->
        <VChart
          :loading="loading.plat"
          type="bar"
          :config="rowBarChartConfig"
          :data="chartsData.qpFlowNumber"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            content="2021年1月4日之前系统划分商单归属小组时以执行人小组划分，2021年1月4日起系统划分商单归属小组时以商务小组划分。"
            type="popover"
            icon-class="iconwenhao"
            :label="chartsData.qpBusinessMoney && chartsData.qpBusinessMoney.mainName"
          />
        </div>
        <!-- CRM小组合作金额及占比 -->
        <VChart
          type="pie"
          :config="pieLabelChartConfig"
          :data="chartsData.qpBusinessMoney"
          :loading="loading.quotient"
        />
      </div>
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.qpFieldMoney && chartsData.qpFieldMoney.mainName }}</span>
        </div>
        <!-- 行业类别金额及占比 -->
        <VChart
          type="pie"
          :config="pieLabelChartConfig"
          :data="chartsData.qpFieldMoney"
          :loading="loading.quotient"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">视频流量top10</span>
        </div>
        <!-- 视频流量top10 -->
        <VChart
          :loading="loading.top"
          type="bar"
          :config="rowBarChartHiddenConfig"
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
          :config="rowBarChartHiddenConfig"
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

  </div>
</template>

<script>
import commonMixin from '../../@coms/mixins'
import { copy } from '@/utils'
import Summary from '../../@coms/Summary'
import { VChart, IconTip } from 'components'
import { $getWeekQpData, $getWeekPlatAdv, $getWeekQuotientData, $getWeekQpAccountFlow } from '@/api/data'

export default {
  components: {
    IconTip,
    Summary,
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
        formatter: '{name|{b}}\n{val|销售收入：{c}}\n{val|销售占比：{d}%}',
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
      platData: {
        platFlow: {},
        qpFlow: {},
        qpAdvFlow: {},
        qpFlowNumber: {}
      },
      cpmData: {},
      rankData: {},
      chartsData: {},
      loading: {
        summary: false,
        plat: false,
        cpm: false,
        rank: false,
        top: false
      }
    }
  },
  created() {
    this.getHistoryList('week')
  },
  methods: {
    getDataFlowScore() {
      this.loading.summary = true
      $getWeekQpData(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          for (const key in this.summary) {
            this.summary[key].val = re[key]
          }
        }
        this.loading.summary = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.summary = false
      })
    },
    getPageData() {
      this.getPlatData()
      this.getQuotientData()
      this.getTopData()
    },
    getPlatData() {
      this.loading.plat = true
      $getWeekPlatAdv(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          re.forEach(item => {
            const data = copy(item)
            data.cates = data.cates.map(item => item.typeName)
            data.values = data.values[0].reverse()
            data.terms = data.terms.reverse()
            this.chartsData[item.mainCode] = data
          })
        }
      }).finally(() => {
        this.loading.plat = false
      })
    },
    getQuotientData() {
      this.loading.quotient = true
      $getWeekQuotientData(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          re.forEach(item => {
            item.values = item.values[0]
            this.chartsData[item.mainCode] = item
          })
        }
         this.loading.quotient = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.quotient = false
      })
    },
    getTopData() {
      this.loading.top = true
      $getWeekQpAccountFlow(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          const keyValueMap = {
            flowTop: {
              needTransfer: true,
              text: 'title',
              val: 'flowCount',
              name: '视频流量top10'
            },
            advFlowTop: {
              needTransfer: true,
              text: 'title',
              val: 'flowCount',
              name: '广告视频流量top10'
            },
            accountFans: {
              needTransfer: true,
              text: 'accountName',
              val: 'addFans',
              name: '账号涨粉top10'
            }
          }
          Object.keys(re).forEach((key) => {
            const mapItem = keyValueMap[key]
            if (!mapItem) return
            const dat = {
              terms: [],
              values: [],
              cates: [key]
            }

            re[key].forEach(function(item) {
              dat.terms.push(item[mapItem.text])
              dat.values.push(item[mapItem.val])
            })
            dat.terms.reverse()
            dat.values.reverse()
            this.chartsData[key] = dat
            this.chartsData[`o_${key}`] = re[key]
          })
        }
        this.loading.top = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.top = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
    @import '../../@coms/common.scss';
</style>
