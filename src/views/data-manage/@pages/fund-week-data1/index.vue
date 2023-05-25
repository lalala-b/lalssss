<template>
  <div style="positon: relative">
    <AnchorLayout1 :is-top="true" :anchor="anchors">
      <template v-slot:anchorBefore>
        <v-header
          :tip="headTips"
          :historys="historys"
          types="week"
          title="一周广告视频数据"
          @change="handleHeaderTimeChange"
        />
        <Summary v-loading="loading.summary" :list="summary" class="m-t-24">
          <template v-slot:more>
            <div class="data-info m-l-24 m-t-24">
              <el-row>
                <el-col
                  :span="5"
                >视频条数：
                  <span>{{
                    weekDataInfo.titleCount | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >流量：
                  <span>{{
                    weekDataInfo.flowCount | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >投放金额：
                  <span>{{
                    weekDataInfo.deliveryMoney | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >组件点击量：
                  <span>{{
                    weekDataInfo.cptClick | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="4"
                >新增激活：
                  <span>{{
                    weekDataInfo.newActiveUv | toFloorThousandsW
                  }}</span></el-col>
              </el-row>
              <el-row>
                <el-col
                  :span="5"
                >总下载激活：
                  <span>{{
                    weekDataInfo.activeUv | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >C2B提交订单量：
                  <span>{{
                    weekDataInfo.recAllSubmitOrderQty | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >C2B签收订单量：
                  <span>{{
                    weekDataInfo.recAllReceiveOrderQty | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="5"
                >C2B成交订单量：
                  <span>{{
                    weekDataInfo.recAllFinishOrderQty | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="4"
                >B2C手机净支付量：
                  <span>{{
                    weekDataInfo.b2cPhoneNetPayOrderQty | toFloorThousandsW
                  }}</span></el-col>
              </el-row>
              <el-row>
                <el-col
                  :span="5"
                >C2C闲置发布商品数：
                  <span>{{
                    weekDataInfo.c2cEffReleaseGoodsQty | toFloorThousandsW
                  }}</span></el-col>
                <el-col
                  :span="6"
                >C2C闲置有效发布商品数_手机：
                  <span>{{
                    weekDataInfo.c2cEffReleasePhoneQty | toFloorThousandsW
                  }}</span></el-col>
              </el-row>
            </div>
          </template>
        </Summary>
      </template>
      <template v-slot:anchor0>
        <div id="onNumberOf">
          <h2>投放数量情况</h2>
          <div class="echart-wrap m-t-16">
            <div>
              <!-- 内容投放条数占比 -->
              <div class="echart-wrap-head">
                {{ amountInfo.distributeByContent.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater1"
                :data="amountInfo.distributeByContent"
                :loading="loading.amount"
              />
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ amountInfo.distributeByPlat.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="amountInfo.distributeByPlat"
                :loading="loading.amount"
              />
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ amountInfo.distributeByBusinessTag.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="amountInfo.distributeByBusinessTag"
                :loading="loading.amount"
              />
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ amountInfo.distributeByBrand.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="amountInfo.distributeByBrand"
                :loading="loading.amount"
              />
            </div>
          </div>
          <div>
            <div class="echart-wrap m-t-16">
              <div class="w-50">
                <div class="echart-wrap-head">
                  {{ amountInfo.distributeByContentDesc.mainName }}
                </div>
                <VChart
                  :loading="loading.amount"
                  type="bar"
                  :data="amountInfo.distributeByContentDesc"
                  :config="rowBarChartConfigTypeYF"
                  :formater="barLableFormater"
                />
              </div>
              <div class="w-50">
                <div class="echart-wrap-head">
                  {{ amountInfo.distributeByVideoType.mainName }}
                </div>
                <VChart
                  :loading="loading.amount"
                  type="bar"
                  :config="rowBarChartConfigTypeVertical"
                  :formater="barFormater"
                  :data="amountInfo.distributeByVideoType"
                />
              </div>
            </div>
            <div class="echart-wrap m-t-16">
              <div class="w-50">
                <div class="echart-wrap-head">
                  {{ amountInfo.distributeAllByF.mainName }}
                </div>
                <VChart
                  :loading="loading.rank"
                  type="bar"
                  :data="amountInfo.distributeAllByF"
                  :config="rowBarChartConfigTypeYF"
                  :formater="barLableFormater"
                />
              </div>
              <div class="w-50">
                <div class="echart-wrap-head">
                  {{ amountInfo.distributeAllByDDesc.mainName }}
                </div>
                <VChart
                  :loading="loading.amount"
                  type="morebar"
                  :data="amountInfo.distributeAllByDDesc"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:anchor1>
        <div id="onTraffic" class="m-t-24">
          <h2>投放流量情况</h2>
          <div class="echart-wrap m-t-16">
            <!-- 平台流量占比 -->
            <div>
              <div class="echart-wrap-head">
                {{ flowInfo.platFlowPercentage.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="flowInfo.platFlowPercentage"
                :loading="loading.flow"
              />
            </div>
            <!--  业务流量占比 -->
            <div>
              <div class="echart-wrap-head">
                {{ flowInfo.businessPercentage.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="flowInfo.businessPercentage"
                :loading="loading.flow"
              />
            </div>
            <!-- 品牌流量占比 -->
            <div>
              <div class="echart-wrap-head">
                {{ flowInfo.brandPercentage.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="flowInfo.brandPercentage"
                :loading="loading.flow"
              />
            </div>
            <!-- 等级流量占比 -->
            <div>
              <div class="echart-wrap-head">
                {{ flowInfo.levelPercentage.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="flowInfo.levelPercentage"
                :loading="loading.flow"
              />
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ flowInfoRank.contentFlowRank.mainName }}
              </div>
              <VChart
                :loading="loading.rank"
                type="bar"
                :data="flowInfoRank.contentFlowRank"
                :config="rowBarChartConfigTypeYF"
                :formater="barLableFormater"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ flowInfoRank.videoFlowRank.mainName }}
              </div>
              <VChart
                :loading="loading.rank"
                type="bar"
                :data="flowInfoRank.videoFlowRank"
                :config="rowBarChartConfigTypeVertical"
                :formater="barFormater"
              />
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ flowInfoRank.armyFlowRank.mainName }}
              </div>
              <VChart
                :loading="loading.rank"
                type="bar"
                :data="flowInfoRank.armyFlowRank"
                :config="rowBarChartConfigTypeYF"
                :formater="barLableFormater"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ flowInfoRank.groupFlowRank.mainName }}
              </div>
              <VChart
                :loading="loading.rank"
                type="morebar"
                :data="flowInfoRank.groupFlowRank"
              />
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ flowFIdInfo.mainName }}
              </div>
              <VChart
                :loading="loading.flowFId"
                type="bar"
                :config="rowBarChartConfigTypeYF"
                :data="flowFIdInfo"
                :formater="twoBarFormater"
              />
            </div>
          </div>
        </div>
      </template>
      <template v-slot:anchor2>
        <div id="onAmountOf" class="m-t-24">
          <h2>投放金额情况</h2>
          <div class="echart-wrap m-t-16">
            <div>
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByContent.mainName }}
              </div>
              <VChart
                type="pie"
                :formater="pieFormater1"
                :data="fundMoneyInfo.distributeByContent"
                :loading="loading.fundMoney"
              />
            </div>
            <div>
              <div class="echart-wrap-head">
                <IconTip :label="fundMoneyInfo.distributeByPlat.mainName" />
              </div>
              <VChart
                type="pie"
                :formater="pieFormater"
                :data="fundMoneyInfo.distributeByPlat"
                :loading="loading.fundMoney"
              />
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByBiz.name }}
              </div>
              <PieG2 v-if="noData" :data-list="fundMoneyInfo.distributeByBiz" />
              <div v-else class="no-data">暂无数据</div>
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByContentDesc.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="bar"
                :data="fundMoneyInfo.distributeByContentDesc"
                :config="rowBarChartConfigTypeYF"
                :formater="barLableFormater"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByVideoType.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="bar"
                :data="fundMoneyInfo.distributeByVideoType"
                :config="rowBarChartConfigTypeVertical"
                :formater="barFormater"
              />
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeAllByDDesc.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="bar"
                :data="fundMoneyInfo.distributeAllByDDesc"
                :config="rowBarChartConfigTypeYF"
                :formater="barLableFormater"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeAllByF.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="morebar"
                :data="fundMoneyInfo.distributeAllByF"
              />
            </div>
          </div>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByC2BContent.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="splicebarlr"
                :data="fundMoneyInfo.distributeByC2BContent"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByPlatWithCpm.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="splicebarlr"
                :data="fundMoneyInfo.distributeByPlatWithCpm"
              />
            </div>
          </div>
        </div>
        <div id="onAmountOf" class="m-t-24">
          <h2>投放金额情况-条数-客单价</h2>
          <div class="echart-wrap m-t-16">
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeAllByDWithUnitPrice.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="splicebar"
                :config="splicebarConfig"
                :data="fundMoneyInfo.distributeAllByDWithUnitPrice"
              />
            </div>
            <div class="w-50">
              <div class="echart-wrap-head">
                {{ fundMoneyInfo.distributeByPlatWithUnitPrice.mainName }}
              </div>
              <VChart
                :loading="loading.fundMoney"
                type="splicebar"
                :config="splicebarConfig"
                :data="fundMoneyInfo.distributeByPlatWithUnitPrice"
              />
            </div>
          </div>
          <Wrap class="m-t-16">
            <div class="echart-wrap-head">
              {{ fundMoneyInfo.distributeByVideoTypeWithUnitPrice.mainName }}
            </div>
            <VChart
              :loading="loading.fundMoney"
              type="splicebar"
              :config="splicebarConfig"
              :data="fundMoneyInfo.distributeByVideoTypeWithUnitPrice"
            />
          </Wrap>
        </div>
      </template>
      <template v-slot:anchor3>
        <div id="onEffectOf" class="m-t-24">
          <h2>投放效果指标</h2>
          <Wrap class="m-t-16">
            <div class="effect-title m-l-24">
              筛选业务标签：
              <el-select
                v-model="effectForm.label"
                placeholder="请选择业务标签"
                multiple
                collapse-tags
                @change="handleEffectLabel"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.dictValue"
                  :label="item.dictValue"
                  :value="item.dictValue"
                />
              </el-select>
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ distributeAllByD.mainName }}
              </div>
              <VChart
                :loading="loading.effect"
                type="splicebar"
                :config="splicebarConfig"
                :data="distributeAllByD"
              />
            </div>
          </Wrap>
          <Wrap class="m-t-24">
            <div class="m-l-24 effect-title">
              筛选分类纬度：
              <el-select
                v-model="effectForm.type"
                placeholder="请选择分类"
                @change="handleEffectType"
              >
                <el-option
                  v-for="item in latitudeList"
                  :key="item.type"
                  :label="item.label"
                  :value="item.type"
                />
              </el-select>
            </div>
            <div>
              <div class="echart-wrap-head">
                {{ effectData.mainName }}
              </div>
              <VChart
                :loading="loading.effect"
                type="splicebar"
                :config="splicebarConfig"
                :data="effectData"
              />
            </div>
          </Wrap>
        </div>
      </template>
    </AnchorLayout1>
  </div>
</template>

<script>
import {
  $getEffectVideoType,
  $getHeadWeekData,
  $getFundPutMoney,
  $getJunFlowAndUser,
  $getAmountData,
  $getFlowRanking,
  $getFlowPercentage
} from '@/api/data'
import commonMixin from '../../@coms/mixins'
import Summary from '../../@coms/Summary'
import { IconTip, VChart, AnchorLayout1, PieG2 } from 'components'
import { copy } from '@/components/common'
import { isArray } from '@/utils'
export default {
  components: {
    Summary,
    IconTip,
    VChart,
    AnchorLayout1,
    PieG2
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
      anchors: [
        { buttonText: '投放数量情况' },
        { buttonText: '投放流量情况' },
        { buttonText: '投放金额情况' },
        { buttonText: '投放效果指标' }
      ],
      summary: {
        cpm: {
          text: 'cpm',
          val: null,
          tip: 'cpm=投放金额/(流量/1000)，即千次播放价格'
        },
        cpa: {
          text: 'cpa',
          val: null,
          tip: 'CPA=投放金额/新增激活，即拉新用户的广告成本；其中点击新增激活统计口径为有点击组件且历史从未安装app的可监测新用户，快手侧数据为曝光口径，因此快手新增激活统计口径为曝光用户下载App的监测用户量'
        },
        cps: {
          text: 'cps',
          val: null,
          tip: 'cps=投放金额/C2B签收订单量，即C2B签收订单的广告成本'
        },
        flowCountForNewRatio: {
          text: '流量拉新率',
          val: null,
          tip: '流量拉新率 = 新增激活/（流量/10000），即每1w播放带来的新增激活用户数'
        }
      },
      loading: {
        summary: true,
        rank: true,
        fundMoney: true,
        flow: true,
        flowFId: true,
        amount: true,
        effect: true
      },
      headTips: '',
      activeIndex: '',
      amountInfo: {
        distributeByContent: '', // 内容投放条数占比
        distributeByPlat: '', // 平台投放条数占比
        distributeByBusinessTag: '', // 业务类型投放条数占比
        distributeByBrand: '', // 品牌投放占比
        distributeByContentDesc: '', // 内容条数排行
        distributeByVideoType: '', // 视频类型条数排行
        distributeAllByDDesc: '', // 军视频条数排行
        distributeAllByF: '' // 团视频条数
      },
      effectForm: {
        label: ['C2B'],
        type: 'distributeByPlat'
      },
      typeList: [
        { dictValue: 'C2B' },
        { dictValue: 'C2C' },
        { dictValue: 'B2C' },
        { dictValue: 'C2C秒杀' },
        { dictValue: 'B2C秒杀' },
        { dictValue: 'C2B秒杀' },
        { dictValue: 'APP拉新促活' }
      ],
      latitudeList: [
        {
          label: '视频类型',
          type: 'distributeByVideoType'
        },
        {
          label: '平台',
          type: 'distributeByPlat'
        },
        {
          label: '内容类别',
          type: 'distributeByContent'
        }
      ],
      // C2B\C2C\C2B\C2C秒杀\B2C秒杀\C2B秒杀\APP拉新促活

      weekDataInfo: {},
      fundMoneyInfo: {
        distributeByContent: '',
        distributeByPlat: '',
        distributeByBiz: {},
        distributeByContentDesc: '',
        distributeByVideoType: '',
        distributeAllByDDesc: '',
        distributeAllByF: '',
        distributeByC2BContent: '',
        distributeByPlatWithCpm: '',
        distributeAllByDWithUnitPrice: '',
        distributeByPlatWithUnitPrice: '',
        distributeByVideoTypeWithUnitPrice: ''
      },
      flowInfo: {
        platFlowPercentage: '', // 平台流量占比
        businessPercentage: '', // 业务流量占比
        brandPercentage: '', // 品牌流量占比
        levelPercentage: '' // 等级流量占比
      },
      flowFIdInfo: [],
      flowInfoRank: {
        armyFlowRank: '',
        contentFlowRank: '',
        groupFlowRank: '',
        videoFlowRank: ''
      },
      effectInfo: {
        distributeAllByD: [],
        distributeByPlat: [], // 平台
        distributeByContent: [],
        distributeByVideoType: []
      },
      distributeAllByD: {},
      effectData: {},
      noData: true
    }
  },
  created() {
    this.getHistoryList('week')
  },
  methods: {
    barFormater(options) {
      options.series.label = {
        show: true,
        position: 'top',
        formatter: (item) => {
          if (item.data > 10000) {
            return (item.data / 10000).toFixed(2) + 'w'
          } else {
            return item.data
          }
        }
      }
      return options
    },
    barLableFormater(options) {
      options.series.label = {
        show: true,
        position: 'right',
        formatter: (item) => {
          if (item.data > 10000) {
            return (item.data / 10000).toFixed(2) + 'w'
          } else {
            return item.data
          }
        }
      }
      return options
    },
    twoBarFormater(options) {
      if (isArray(options.series)) {
        options.series.forEach((item) => {
          item.label = {
            show: true,
            position: 'right',
            formatter: (item) => {
              if (item.data > 10000) {
                return (item.data / 10000).toFixed(2) + 'w'
              } else {
                return item.data
              }
            }
          }
        })
      }
      return options
    },
    pieFormater(options) {
      options.legend = {
        bottom: 20
      }
      options.series.forEach((item) => {
        item.bottom = '24%'
        item.right = '0'
        item.radius = ['20%', '40%']
        item.label = {
          normal: {
            show: true,
            position: 'outer',
            formatter(info) {
              var data = info.value
              if (Number(info.value) > 10000) {
                data = (Number(info.value) / 10000).toFixed(2)
                return `${info.name}\n${data}万\n${info.percent}%`
              } else {
                return `${info.name}\n${data}\n${info.percent}%`
              }
            }
          }
        }
      })
      return options
    },
    pieFormater1(options) {
      options.legend = {
        bottom: 20
      }
      options.tooltip = {}
      options.series.forEach((item) => {
        item.bottom = '24%'
        item.right = '0'
        item.radius = ['20%', '40%']
        item.label = {
          normal: {
            show: true,
            position: 'outer',
            formatter: '{b}\n{d}%'
          }
        }
      })
      return options
    },
    // 投放效果指标
    getEffectVideoType() {
      this.loading.effect = true
      $getEffectVideoType(this.pageTime)
        .then((res) => {
          this.loading.effect = false
          if (res.code === 1 && res.data) {
            this.distributeAllByD = res.data['distributeAllByD']
            this.effectInfo = res.data
            this.effectData = res.data['distributeByPlat']
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.loading.effect = false
        })
    },
    // 筛选分类纬度
    handleEffectType(val) {
      if (!val) return
      this.effectData = this.effectInfo[val]
    },
    handleEffectLabel(val) {
      if (!val) return
      this.loading.effect = true
      $getEffectVideoType({ ...this.pageTime, businessTag: val })
        .then((res) => {
          this.loading.effect = false
          if (res.code === 1 && res.data) {
            this.distributeAllByD = res.data['distributeAllByD']
            this.effectInfo = res.data
            this.effectData = res.data[this.effectForm.type]
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.loading.effect = false
        })
    },
    getDataFlowScore() {
      this.getAmountData()
      this.getFundPutMoney()
      this.getJunFlowAndUser()
      this.getEffectVideoType()
      this.getFlowPercentage()
      this.getFlowRanking()
    },
    // 周 统计头部指标数据
    getPageData() {
      this.loading.summary = true
      $getHeadWeekData(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            this.weekDataInfo = res.data
            for (const key in this.summary) {
              this.summary[key].val = res.data[key]
            }
          }
          this.loading.summary = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.summary = false
        })
    },
    // 投放数量情况
    getAmountData() {
      this.loading.amount = true
      $getAmountData(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            const data = res.data
            for (const k in data) {
              if (k === 'distributeAllByDDesc') {
                data[k].terms = data[k].terms ? data[k].terms : []
                data[k].values = data[k].values ? data[k].values : []
              } else {
                data[k].values = data[k].values ? data[k].values[0] : []
                data[k].terms = data[k].term ? data[k].term : []
              }
              this.amountInfo[k] = data[k]
            }
          }
          this.loading.amount = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.amount = false
        })
    },
    // 投放流量占比
    getFlowPercentage() {
      this.loading.flow = true
      $getFlowPercentage(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            const data = copy(res.data)
            for (const k in data) {
              data[k].values = data[k].values ? data[k].values[0] : []
            }
            this.flowInfo = data
          }
          this.loading.flow = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.flow = false
        })
    },
    // 投放金额情况
    getFundPutMoney() {
      this.loading.fundMoney = true
      $getFundPutMoney(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            const data = copy(res.data)
            for (const k in data) {
              if (
                [
                  'distributeAllByF',
                  'distributeByPlatWithCpm',
                  'distributeByC2BContent',
                  'distributeAllByDWithUnitPrice',
                  'distributeByPlatWithUnitPrice',
                  'distributeByVideoTypeWithUnitPrice'
                ].includes(k)
              ) {
                data[k].terms = data[k].terms ? data[k].terms : []
                data[k].values = data[k].values ? data[k].values : []
              } else {
                data[k].values = data[k].values ? data[k].values[0] : []
                data[k].terms = data[k].term ? data[k].term : []
                if (
                  [
                    'deliveryMoneyByDDesc',
                    'deliveryMoneyByContentDesc'
                  ].includes(data[k].mainCode)
                ) {
                  data[k].values.reverse()
                  data[k].terms.reverse()
                }
              }
              this.fundMoneyInfo[k] = data[k]
            }
            var Biz = copy(res.data.distributeByBiz)
            this.noData =
              !!Biz &&
              ((Biz.barData && Biz.barData.length) ||
                (Biz.distributeByBiz && Biz.distributeByBiz.length))
            this.fundMoneyInfo.distributeByBiz = Biz
          }
          this.loading.fundMoney = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.fundMoney = false
        })
    },
    // 军-C2B流量与C2B新增用户数排行
    getJunFlowAndUser() {
      this.loading.flowFId = true
      $getJunFlowAndUser(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            this.flowFIdInfo = res.data
            this.flowFIdInfo.cates = res.data.cates.map((d) => d.typeName)
          }
          this.loading.flowFId = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.flowFId = false
        })
    },
    getFlowRanking() {
      this.loading.rank = true
      $getFlowRanking(this.pageTime)
        .then((res) => {
          if (res.code === 1 && res.data) {
            const data = res.data
            for (const k in data) {
              if (k === 'groupFlowRank') {
                data[k].terms = data[k].terms ? data[k].terms : []
                data[k].values = data[k].values ? data[k].values : []
              } else {
                data[k].values = data[k].values ? data[k].values[0] : []
                data[k].terms = data[k].term ? data[k].term : []
              }
              this.flowInfoRank[k] = data[k]
            }
          }
          this.loading.rank = false
        })
        .catch((err) => {
          console.error(err)
          this.loading.rank = false
        })
    }
  }
}
</script>

<style lang="scss">
@import '../../@coms/common.scss';

.data-info {
  color: rgba(0, 0, 0, 0.8);
  font-size: 14px;
  .el-row {
    margin-bottom: 8px;
  }
}

.effect-title {
  font-size: 14px;
}
.no-data {
  text-align: center;
  line-height: 380px;
  color: #8c8c8c;
}
</style>
