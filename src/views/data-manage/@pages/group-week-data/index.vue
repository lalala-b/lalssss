<template>
  <div v-loading="pageLoading" class="page-container">
    <v-header
      :time="pageTime"
      tip="（广告视频统计范围：SABC类的所有视频）"
      :historys="historys"
      :title="`一周广告视频数据`"
      @change="handleHeaderTimeChange"
    />
    <Summary v-loading="loading.summary" :list="summary" class="m-t-24">
      <template slot-scope="{item}">
        <p class="detail-num" data-num>广告:{{ (item.otherValues ? Math.ceil(item.otherValues.advResult * 100) / 100 : 0) | toThousands }}</p>
        <p class="detail-num" data-num>非广告:{{ (item.otherValues ? Math.ceil(item.otherValues.notAdvResult * 100) / 100 : 0)| toThousands }}</p>
      </template>
    </Summary>
    <div class="echart-wrap m-t-16">
      <div>
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.platFlow && chartsData.platFlow.mainName }}</span>
        </div>
        <!-- 平台流量占比 -->
        <VChart type="pie" :data="chartsData.platFlow" :loading="loading.flow" />
      </div>
      <div>
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.levelFlow && chartsData.levelFlow.mainName }}</span>
        </div>
        <!-- 军团流量占比 -->
        <VChart type="pie" :data="chartsData.levelFlow" :loading="loading.flow" />
      </div>
      <div>
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.flowStock && chartsData.flowStock.mainName }}</span>
        </div>
        <!-- 投放金额占比 -->
        <VChart type="pie" :data="chartsData.flowStock" :loading="loading.flow" />
      </div>
    </div>
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.flowRes && chartsData.flowRes.mainName }}</span>
          <el-dropdown v-loading="loading.rank" @command="handleCommand">
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
          :loading="loading.flow"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnitType('万')"
          :formater="tooltipFormaterUnit('万')"
          :data="chartsData.flowRes"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.scoreRes && chartsData.scoreRes.mainName }}</span>
          <el-dropdown v-loading="loading.rank" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="scoreRes">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 团队军功 -->
        <VChart
          :loading="loading.flow"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnit('')"
          :data="chartsData.scoreRes"
        />
      </div>
    </div>
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.fFlow && chartsData.fFlow.mainName }}</span>
          <el-dropdown v-loading="loading.rank" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="fFlow">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 团流量排行 -->
        <VChart
          :loading="loading.flow"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnitType('万')"
          :formater="tooltipFormaterUnit('万')"
          :data="chartsData.fFlow"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">{{ chartsData.typeFlowSoilder && chartsData.typeFlowSoilder.mainName }}</span>
          <el-dropdown v-loading="loading.rank" @command="handleCommand">
            <span class="el-dropdown-link">
              <i class="el-icon-more" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="typeFlowSoilder">导出excel</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 视频类型流量军功 -->
        <VChart
          :loading="loading.flow"
          type="bar"
          :config="rowBarChartConfigType"
          :data="chartsData.typeFlowSoilder"
        />
      </div>
    </div>

    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">账号涨粉TOP10</span>
        </div>
        <!-- 账号涨粉TOP10 -->
        <VChart
          :loading="loading.top"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnit('')"
          :formater="tooltipFormaterVideo"
          :data="chartsData.accountFans"
        />
      </div>

      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">账号新增流量TOP10</span>
        </div>
        <!-- 账号新增流量TOP10 -->
        <VChart
          :loading="loading.top"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnitType('万')"
          :formater="tooltipFormaterVideo"
          :data="chartsData.accountFlow"
        />
      </div>
    </div>
    <div class="echart-wrap m-t-16">
      <div class="w-50">
        <div class="echart-wrap-head">
          <span class="tooltip-label">广告视频流量TOP10</span>
        </div>
        <!-- 广告视频流量TOP10 -->
        <VChart
          :loading="loading.top"
          type="bar"
          :config="rowBarChartConfigShowLabelByUnitType('万')"
          :formater="tooltipFormaterVideo"
          :data="chartsData.titleFlow"
          @click="handleVideoChartClick"
        />
      </div>
    </div>
    <div v-if="$permission('export_group_week_military')" class="chart-export-item">
      <div data-bold>一键导出个人军功流量明细表：</div>
      <el-button v-log="{operation_module: '导出个人军功流量明细表'}" type="primary" @click="exportScore">导出</el-button>
    </div>
    <div v-if="$permission('export_group_week_plat_military')" class="chart-export-item">
      <div data-bold>一键导出个人平台分发数量和流量明细表：</div>
      <el-button v-log="{operation_module: '导出个人平台分发数量和流量明细表'}" type="primary" @click="exportPlatScore">导出</el-button>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
import commonMixin from '../../@coms/mixins'
import Summary from '../../@coms/Summary'
import { VChart } from 'components'
import { $getWeekAdvFlowScore, $getWeekAccountFlow, $getWeekPlatLevel } from '@/api/data'
export default {
  components: {
    VChart,
    Summary
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
        allTitle: {
          text: '标题',
          val: ''
        },
        allFlow: {
          text: '流量',
          val: ''
        },
        allJunFlow: {
          text: '军功播放量',
          val: ''
        },
        allScore: {
          text: '军功值',
          val: ''
        }
      },
      chartsData: {
        platFlow: null,
        levelFlow: null,
        typeFlowSoilder: null,
        fFlow: null,
        flowStock: null,
        flowRes: null,
        scoreRes: null,
        accountFans: null,
        accountFlow: null,
        titleFlow: null
      },
      loading: {
        summary: false,
        top: false,
        flow: false
      }
    }
  },
  created() {
    this.getHistoryList('week')
  },
  methods: {
    // 导出报表数据
    handleCommand(command) {
      const query = qs.stringify(this.pageTime)
      // console.log(command)
      switch (command) {
          // 团队流量
          case 'flowRes':
            window.open(`/api/pirate/data/trend/week/exportTeamFlow?${query}`)
            break
          // 团队军工
          case 'scoreRes':
            window.open(`/api/pirate/data/trend/week/exportTeamSoldierScore?${query}`)
            break
          // 视频类型流量军工
          case 'typeFlowSoilder':
            window.open(`/api/pirate/data/trend/week/exportTypeFlowAndScore?${query}`)
            break
          case 'fFlow':
            window.open(`/api/pirate/data/trend/week/exportTeamFlowTrend?${query}&exportType=1`)
            break
          default:
            break
      }
      // const paramsStr = `?startTime=${this.pageTime.startTime}&endTime=${this.pageTime.endTime}&mainCode=${command}`
      // window.open(`${this.exportWeekUrl}${paramsStr}`)
    },
    // 导出个人军工流量明细表
    exportScore() {
      window.open(`/api/pirate/data/trend/week/flowScoreExcel?${qs.stringify(this.pageTime)}`)
    },
    // 导出个人平台分发数量和流量明细表
    exportPlatScore() {
      window.open(`/api/pirate/data/trend/week/exportPersonPlatData?${qs.stringify(this.pageTime)}`)
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
        if (!mapItem) return
        const dat = {
          terms: [],
          values: [],
          cates: [key]
        }

        data[key].forEach(function(item) {
          dat.terms.push(item[mapItem.text])
          dat.values.push(item[mapItem.val])
        })
        dat.terms.reverse()
        dat.values.reverse()
        this.chartsData[key] = dat
        this.chartsData[`o_${key}`] = data[key]
      })
    },
    getDataFlowScore() {
      this.getWeekPlatLevel()
      this.getBottomCharts()
    },
    getBottomCharts() {
      this.loading.top = true
      $getWeekAccountFlow(this.pageTime).then(res => {
        if (res.code === 1) {
          res = res.data
          this.processMid(res)
        }
        this.loading.top = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.top = false
      })
    },
    getWeekPlatLevel() {
      this.loading.flow = true
      $getWeekPlatLevel(this.pageTime).then(res => {
        if (res.code === 1) {
          res = res.data
          res.forEach(item => {
            // 为修复视频类型流量军工显示反的问题
            this.chartsData[item.mainCode] = {
              cates: item.mainCode === 'typeFlowSoilder' ? item.cates.map(item => item.typeName) : item.cates.map(item => item.typeName).reverse(),
              values: item.values.length === 1 ? item.values[0].reverse() : item.values.map(item => item.reverse()),
              terms: item.terms.reverse(),
              mainName: item.mainName
            }
          })
        }
        this.loading.flow = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.flow = false
      })
    },
    getPageData() {
      this.loading.summary = true
      $getWeekAdvFlowScore(this.pageTime).then((res) => {
        if (res.code === 1) {
          res = res.data
          for (const key in res) {
            // 保留小数点两位小数
            this.summary[key].val = res[key].sumResult
            this.summary[key].otherValues = {
              advResult: res[key].advResult,
              notAdvResult: res[key].notAdvResult
            }
          }
        }
        this.loading.summary = false
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.loading.summary = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import '../../@coms/common.scss';
</style>
