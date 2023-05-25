<template>
  <div>
    <v-header
      :tip="headTips"
      :historys="historys"
      types="week"
      title="一周广告视频数据"
      @change="handleHeaderTimeChange"
    />
    <Summary v-loading="loading.summary" :list="summary" class="m-t-24" />

    <div class="echart-wrap m-t-16">
      <div>
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="teamData.titleRate.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="teamData.titleRate.mainName"
          />
        </div>
        <!-- 视频数量占比 -->
        <VChart type="pie" :data="teamData.titleRate" :loading="loading.team" />
      </div>
      <div>
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="teamData.flowRate.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="teamData.flowRate.mainName"
          />
        </div>
        <!-- 军团流量占比 -->
        <VChart type="pie" :data="teamData.flowRate" :loading="loading.team" />
      </div>
      <div>
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="teamData.moneyRate.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="teamData.moneyRate.mainName"
          />
        </div>
        <!-- 投放金额占比 -->
        <VChart type="pie" :data="teamData.moneyRate" :loading="loading.team" />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-66">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="cpmData.teamCps.tips"
            type="popover"
            icon-class="iconwenhao"
            label="各团队投放效果"
          />
        </div>
        <!-- 各团队投放效果 -->
        <VChart
          type="bar"
          :formater="lineAndBarformater"
          :map="{
            x: 'term',
            y: 'values',
            cates: 'cates'
          }"
          :config="barAndLineChartConfig"
          :data="cpmData.teamCps"
          :loading="loading.cpm"
        />
      </div>
      <div>
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="cpmData.contentCps.tips"
            type="popover"
            icon-class="iconwenhao"
            label="内容投放效果"
          />
        </div>
        <!-- 内容投放效果 -->
        <VChart
          type="bar"
          :formater="lineAndBarformater"
          :map="{
            x: 'term',
            y: 'values',
            cates: 'cates'
          }"
          :config="barAndLineChartConfig"
          :data="cpmData.contentCps"
          :loading="loading.cpm"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="rankData.flowRes.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="rankData.flowRes.mainName"
          />
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="flowRes">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 团队流量 -->
        <VChart
          :loading="loading.rank"
          type="bar"
          :config="rowBarChartConfigType"
          :formater="tooltipFormaterUnit('万')"
          :data="rankData.flowRes"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="rankData.scoreRes.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="rankData.scoreRes.mainName"
          />
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-log="{operation_module: '导出' + rankData.scoreRes.mainName}" command="scoreRes">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 团队军功 -->
        <VChart
          :loading="loading.rank"
          type="bar"
          :config="rowBarChartConfig"
          :data="rankData.scoreRes"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="rankData.fFlow.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="`${rankData.fFlow.mainName}排行`"
          />
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-log="{operation_module: '导出' + rankData.fFlow.mainName}" command="fFlow">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 团流量排行 -->
        <VChart
          :loading="loading.rank"
          type="bar"
          :config="rowBarChartConfigType"
          :data="rankData.fFlow"
          :formater="tooltipFormaterUnit('万')"
        />
      </div>
      <div class="w-50">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="rankData.typeFlowSoilder.tips"
            type="popover"
            icon-class="iconwenhao"
            :label="`${rankData.typeFlowSoilder.mainName}`"
          />
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-log="{operation_module: '导出' + rankData.typeFlowSoilder.mainName}" command="typeFlowSoilder">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 视频类型流量军功 -->
        <VChart
          :loading="loading.rank"
          type="bar"
          :config="rowBarChartConfigType"
          :data="rankData.typeFlowSoilder"
          :formater="tooltipFormaterUnit('万')"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-100">
        <div class="echart-wrap-head">
          <IconTip
            placement="top-start"
            trigger="hover"
            :content="chartsData.titleFlow && chartsData.titleFlow.tips"
            type="popover"
            icon-class="iconwenhao"
            label="投放视频流量TOP10"
          />
        </div>
        <!-- 投放视频流量TOP10 -->
        <VChart
          :loading="loading.titleFlow"
          type="bar"
          :config="rowBarChartHiddenConfig"
          :data="chartsData.titleFlow"
          :formater="tooltipFormaterVideo.bind(this)"
          @click="handleVideoChartClick"
        />
      </div>
    </div>

    <div class="chart-export-item">
      <div data-bold>一键导出个人军功流量明细表</div>
      <el-button v-log="{operation_module: '导出个人军功流量明细表'}" type="primary" @click="exportScore">导出</el-button>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import { $getWeekFundData, $getWeekFlowSoilder, $getWeekFundCpmData, $getWeekFundTeamData, $getWeekDeliveryTop } from '@/api/data'
import commonMixin from '../../@coms/mixins'
import Summary from '../../@coms/Summary'
import { IconTip, VChart } from 'components'

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
    return {
      summary: {
        sumTitle: {
          text: '标题',
          val: null
        },
        sumFlow: {
          text: '流量',
          val: null
        },
        sumSoilderFlow: {
          text: '军功播放量',
          val: null
        },
        sumScore: {
          text: '军功',
          val: null
        },
        sumMoney: {
          text: '投放金额',
          val: null
        },
        sumCpm: {
          text: '总CPM',
          val: ''
        }
      },
      teamData: {
        titleRate: {},
        flowRate: {},
        moneyRate: {}
      },
      cpmData: {
        contentCps: {},
        teamCps: {}
      },
      rankData: {
        flowRes: {},
        scoreRes: {},
        fFlow: {},
        typeFlowSoilder: {}
      },
      chartsData: {},
      loading: {
        summary: true,
        team: true,
        cpm: true,
        rank: true
      },
      headTips: '',
      dataList: {
        pieList: [
          { type: '微博', value: 93.33 },
          { type: '其他', value: 6.67 }
        ],
        accountedForList: [
          { type: '论坛', value: 1.77 },
          { type: '网站', value: 1.44 },
          { type: '微信', value: 1.12 },
          { type: '客户端', value: 1.05 },
          { type: '新闻', value: 0.81 }
        ]
      }
    }
  },
  created() {
    this.getHistoryList('week')
  },
  methods: {
    handleCommand(command) {
      const query = qs.stringify(Object.assign({}, this.pageTime, { monthTime: this.monthTime }))
      switch (command) {
          // 团队军功
          case 'scoreRes':
            window.open(`/api/pirate/data/trend/week/exportFundTeamScore?${query}`)
            break
          // 视频类型流量军功
          case 'typeFlowSoilder':
            window.open(`/api/pirate/data/trend/week/exportSoldierGroupByJunType?${query}`)
            break
          // 团队流量
          case 'flowRes':
            window.open(`/api/pirate/data/trend/week/exportFundTeamFlow?${query}`)
            break
          case 'fFlow':
            window.open(`/api/pirate/data/trend/week/exportTeamFlowTrend?${query}&exportType=2`)
            break
          default:
            break
      }
    },
    exportScore() {
      const query = qs.stringify(Object.assign({}, this.pageTime, { monthTime: this.monthTime }))
      window.open(`/api/pirate/data/trend/week/soilderExcel?${query}`)
    },
    getDataFlowScore() {
      this.getTeamData()
      this.getCpmData()
      this.getRankData()
      this.getTopData()
    },
    getTeamData() {
      this.loading.team = true
      $getWeekFundTeamData(this.pageTime).then(res => {
        if (res.code === 1) {
          res = res.data
          res.forEach(item => {
            item.values = item.values[0]
            this.teamData[item.mainCode] = item
          })
        }
        this.loading.team = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.team = false
      })
    },
    getPageData() {
      this.loading.summary = true
      $getWeekFundData(this.pageTime).then(re => {
        if (re.code === 1) {
          for (const key in this.summary) {
            this.summary[key].val = re.data[key]
          }
          this.headTips = re.data.tips
        } else {
          this.$message.error(re.message)
        }
        this.loading.summary = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.summary = false
      })
    },
    getCpmData() {
      this.loading.cpm = true
      $getWeekFundCpmData(this.pageTime).then(res => {
        if (res.code === 1) {
          res = res.data
          this.cpmData = res
        }
        this.loading.cpm = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.cpm = false
      })
    },
    getRankData() {
      this.loading.rank = true
      $getWeekFlowSoilder(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          // 需要转换数据展示的图表
          const needFormatDataCharts = ['scoreRes', 'typeFlowSoilder', 'flowRes']

          re.forEach(item => {
            let values = item.values.map(item => {
              return item.reverse()
            })

            if (needFormatDataCharts.includes(item.mainCode)) {
              values = this.processScoreData(values)
            }

            this.rankData[item.mainCode] = {
              mainName: item.mainName,
              cates: item.cates.map(d => d.typeName),
              terms: item.terms.reverse(),
              values,
              tips: item.tips
            }
          })
        }
        this.loading.rank = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.rank = false
      })
    },
    getTopData() {
      this.loading.top = true
      $getWeekDeliveryTop(this.pageTime).then(re => {
        if (re.code === 1) {
          re = re.data
          const keyValueMap = {
            titleFlow: {
              needTransfer: true,
              text: 'title',
              val: 'flowCount',
              name: '广告视频流量'
            }
          }
          Object.keys(keyValueMap).forEach(key => {
            const mapItem = keyValueMap[key]
            const dat = {
              terms: [],
              values: [],
              cates: [key],
              tips: re.tips
            }
            const valDat = []
            re[key].forEach(item => {
              item.title = item.titleName
              dat.terms.push(item[mapItem.text])
              const val = item[mapItem.val]
              valDat.push(val)
            })
            dat.terms.reverse()
            valDat.reverse()
            dat.values.push(valDat)
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
<style lang="scss">
  @import '../../@coms/common.scss';
</style>
