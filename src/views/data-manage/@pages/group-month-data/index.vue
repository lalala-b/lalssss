<template>
  <div>
    <v-header
      :time="pageTime"
      tip="（广告视频统计范围：SABC类的所有视频）"
      :historys="historys"
      :title="`${monthTime}月数据`"
      @change="handleHeaderTimeChange"
    />
    <Summary v-loading="loading.summary" :list="summary" class="m-t-24">
      <template slot-scope="{item}">
        <p class="detail-num" data-num>广告:{{ (item.otherValues ? Math.ceil(item.otherValues.advResult * 100) / 100 : 0) | toThousands }}</p>
        <p class="detail-num" data-num>非广告:{{ (item.otherValues ? Math.ceil(item.otherValues.notAdvResult * 100) / 100 : 0)| toThousands }}</p>
      </template>
    </Summary>
    <el-tabs v-model="activeName" class="m-t-24">
      <el-tab-pane label="平台流量分布" name="platFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">月流量平台占比</span>
            </div>
            <!-- 月流量平台占比 -->
            <VChart type="pie" :data="chartsData.platSpreadPie" :loading="loading.platSpread" />
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
      <el-tab-pane label="视频类型流量分布" name="videoFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div>
            <div class="echart-wrap-head">
              <span class="tooltip-label">月流量视频等级占比</span>
            </div>
            <!-- 月流量视频等级占比 -->
            <VChart type="pie" :data="chartsData.typeLevel" :loading="loading.type" />
          </div>
          <div class="w-66">
            <div class="echart-wrap-head">
              <span class="tooltip-label">视频类型月流量排行</span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="typeFlow">导出excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 视频类型月流量排行 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="rowBarChartConfigType"
              :data="chartsData.typeFlow"
              :loading="loading.type"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div class="w-100">
            <div class="echart-wrap-head">
              <span class="tooltip-label">广告视频周流量</span>
            </div>
            <!-- 广告视频周流量 -->
            <VChart
              type="bar"
              :config="barChartConfigAb"
              :data="chartsData.typeSabc"
              :formater="tooltipFormaterUnit('万')"
              :loading="loading.type"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="军团流量分布" name="soilderFlow" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">月流量团队占比</span>
            </div>
            <!-- 月流量团队占比 -->
            <VChart type="pie" :data="chartsData.soilderFlowPie" :loading="loading.soilder" />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">周流量团队分布</span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="flowData">导出excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 周流量团队分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackChartConfigType"
              :data="chartsData.soilderFlowStack"
              :loading="loading.soilder"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">军团周流量趋势图</span>
            </div>
            <!-- 月流量团队占比 -->
            <VChart
              type="line"
              :config="lineChartCondig"
              :data="chartsData.soilderFlowLine"
              :loading="loading.soilder"
            />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">团流量排行</span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="flowData">导出excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 周流量团队分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="rowBarChartConfigShowLabelByUnitType('万')"
              :data="chartsData.teamFlow"
              :loading="loading.soilder"
            />
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="军团军功分布" name="soilderScore" :lazy="true">
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">月军功团队占比</span>
            </div>
            <!-- 月军功团队占比 -->
            <VChart type="pie" :data="chartsData.soilderScorePie" :loading="loading.soilder" />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">周军功团队分布</span>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                  <i class="el-icon-more" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="flowData">导出excel</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 周军功团队分布 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="barStackChartConfigType"
              :data="chartsData.soilderScoreStack"
              :loading="loading.soilder"
            />
          </div>
        </div>
        <div class="echart-wrap m-t-16">
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">军团周军功趋势图</span>
            </div>
            <!-- 军团周军功趋势图 -->
            <VChart
              type="line"
              :config="lineChartCondig"
              :data="chartsData.soilderScoreLine"
              :loading="loading.soilder"
            />
          </div>
          <div class="w-50">
            <div class="echart-wrap-head">
              <span class="tooltip-label">团军功排行</span>
            </div>
            <!-- 团军功排行 -->
            <VChart
              type="bar"
              :formater="tooltipFormaterUnit('万')"
              :config="rowBarChartConfigShowLabelByUnitType('万')"
              :data="chartsData.teamScore"
              :loading="loading.soilder"
            />
          </div>
        </div>
        <div v-if="$permission('export_group_month_military')" class="chart-export-item">
          <div data-bold>一键导出个人军功流量明细表：</div>
          <el-button v-log="{operation_module: '导出个人军功流量明细表'}" type="primary" @click="exportScore">导出</el-button>
        </div>
        <div v-if="$permission('export_group_month_plat_military')" class="chart-export-item">
          <div data-bold>一键导出个人平台分发数量和流量明细表：</div>
          <el-button v-log="{operation_module: '一键导出个人平台分发数量和流量明细表'}" type="primary" @click="exportPlatScore">导出</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="本月榜单" name="week" :lazy="true">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import qs from 'qs'
import { $getAdvFlowScore, $getPlatSpread, $getVideoTypeSpread, $getFlowsSoilders, $getTeamlowSoilder, $getAccountFlow } from '@/api/data'
import commonMixin from '../../@coms/mixins'
import Summary from '../../@coms/Summary'
import { VChart } from 'components'

export default {
  components: {
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
    return {
      loading: {
        summary: true,
        type: true,
        platSpread: true,
        soilder: true,
        top: true
      },
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
      chartsData: {},
      activeName: 'platFlow'
    }
  },
  created() {
    this.getHistoryList('month')
  },
  methods: {
    getDataFlowScore() {
      this.loading.summary = true
      $getAdvFlowScore(this.pageTime).then(res => {
        if (res.code === 1) {
          res = res.data
          for (const key in res) {
            // 保留小数点两位小数
            console.log(key)
            this.summary[key].val = res[key].sumResult
            this.summary[key].otherValues = {
              advResult: res[key].advResult,
              notAdvResult: res[key].notAdvResult
            }
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
    // 导出报表数据
    handleCommand(command) {
      const query = qs.stringify(Object.assign({}, this.pageTime, { monthTime: this.monthTime }))
      switch (command) {
          // 视频类型月流量排行
          case 'typeFlow':
            window.open(`/api/pirate/data/trend/month/exportTypeFlowMonth?${query}`)
            break
          // 周流量团队分布
          case 'flowData':
            window.open(`/api/pirate/data/trend/month/exportTeamFlowDataMonth?${query}`)
            break
          // 周军功团队分布
          case 'scoreData':
            window.open(`/api/pirate/data/trend/month/exportTeamScoreDataMonth?${query}`)
            break
          case 'fFlow':
            window.open(`/api/pirate/data/trend/week/exportTeamFlowTrend?${query}&exportType=1`)
            break
          default:
            break
      }
    },
    // 导出个人军工流量明细表
    exportScore() {
      window.open(`/api/pirate/data/trend/week/flowScoreExcel?${qs.stringify(this.pageTime)}`)
    },
    // 导出个人平台分发数量和流量明细表
    exportPlatScore() {
      window.open(`/api/pirate/data/trend/week/exportPersonPlatData?${qs.stringify(this.pageTime)}`)
    },
    formatTimeStr(startEnd) {
      // 2020-05-01----2020-05-02 -> 2020.05.01~2020.05.02
      const dateArr = startEnd.split('----')
      return dateArr.map(item => {
          return item
            .split('-')
            .slice(1)
            .join('.')
        }).join('~')
    },
    getPlatSpread() {
      this.loading.platSpread = true
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getPlatSpread(query).then(res => {
        if (res.code === 1) {
          res = res.data
          this.chartsData.platSpreadPie = {
            terms: res.cates.map(item => item.typeName),
            values: res.values.map(item => {
              return item.reduce((sum, num) => sum + num)
            }),
            mainName: '月流量平台占比'
          }
          this.chartsData.platSpread = {
            cates: res.cates.map(item => item.typeName),
            terms: res.terms.map(item => this.formatTimeStr(item)),
            values: res.values
          }
        } else {
          this.$message.error(res.message)
        }
        this.loading.platSpread = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.platSpread = false
      })
    },
    getMonthVideoSpread() {
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      this.loading.type = true
      $getVideoTypeSpread(query).then(res => {
        if (res.code === 1) {
          res = res.data
          this.chartsData.typeLevel = {
            terms: res.typeLevel.terms,
            values: res.typeLevel.values[0],
            mainName: '月流量视频等级占比'
          }
          this.chartsData.typeFlow = {
            cates: ['流量'],
            terms: res.typeFlow.terms.reverse(),
            values: [res.typeFlow.values[0].reverse()]
          }
          this.chartsData.typeSabc = {
            cates: res.typeSabc.cates.map(item => item.typeName),
            terms: res.typeSabc.terms,
            values: res.typeSabc.values
          }
        }
        this.loading.type = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.type = false
      })
    },
    getMonthSoilderFlow() {
      this.loading.soilder = true
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getFlowsSoilders(query).then(res => {
        if (res.code === 1) {
          res = res.data
          this.chartsData.soilderFlowPie = {
            terms: res.flowData.cates.map(item => item.typeName),
            values: res.flowData.values.map(item => {
              return item.reduce((sum, next) => sum + next)
            }),
            mainName: '月流量团队占比'
          }
          this.chartsData.soilderFlowStack = {
            cates: res.flowData.cates.map(item => item.typeName),
            values: res.flowData.values,
            terms: res.flowData.terms.map(item => this.formatTimeStr(item))
          }
          this.chartsData.soilderFlowLine = {
            cates: res.flowData.cates.map(item => item.typeName),
            terms: res.flowData.terms.map(item => this.formatTimeStr(item)),
            values: res.flowData.values
          }
          this.chartsData.soilderScorePie = {
            terms: res.scoreData.cates.map(item => item.typeName),
            values: res.scoreData.values.map(item => {
              return item.reduce((sum, next) => sum + next)
            })
          }
          const values = this.processScoreData(res.scoreData.values)
          this.chartsData.soilderScoreStack = {
            cates: res.scoreData.cates.map(item => item.typeName),
            values,
            terms: res.scoreData.terms.map(item => this.formatTimeStr(item))
          }
          this.chartsData.soilderScoreLine = {
            cates: res.scoreData.cates.map(item => item.typeName),
            terms: res.scoreData.terms.map(item => this.formatTimeStr(item)),
            values
          }
        }
        this.loading.soilder = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loading.soilder = false
      })
    },
    getMonthTeamSoilder() {
      const query = Object.assign({}, this.pageTime, {
        monthTime: this.monthTime
      })
      $getTeamlowSoilder(query).then(res => {
        if (res.code === 1) {
          res = res.data
          this.chartsData.teamFlow = {
            terms: res.flowRes.terms.reverse(),
            cates: ['流量'],
            values: [res.flowRes.values[0].reverse()]
          }
          this.chartsData.teamScore = {
            terms: res.scoreRes.terms.reverse(),
            cates: ['军功'],
            values: [this.processScoreData(res.scoreRes.values[0]).reverse()]
          }
        }
      })
    },
    getAccountFlow() {
      this.loading.top = true
      $getAccountFlow(this.pageTime).then((res) => {
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
    getPageData() {
      this.getPlatSpread()
      this.getMonthVideoSpread()
      this.getMonthSoilderFlow()
      this.getMonthTeamSoilder()
      this.getAccountFlow()
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
