<template>
  <el-dialog
    class="video-detail"
    width="960px"
    title="视频详细信息"
    :visible="show"
    @close="onCancel"
  >
    <div v-loading="loading" class="video-detail-header">
      <VideoInfo
        :info="{
          coverImg: dialogData.videoCoverUrl,
          title: dialogData.titleName,
          addTime: dialogData.addTime,
          url: dialogData.url,
          isDeleted: dialogData.isDeleted,
        }"
      >
        <div class="m-t-8">
          <a
            v-if="dialogData.recTitle"
            :href="dialogData.recLink"
            target="_blank"
            class="rec-title"
          >
            <svg-icon icon-class="ele" />
            {{ dialogData.recTitle }}
          </a>
          <a
            v-if="
              dialogData.videoServiceTitle &&
                dialogData.videoServiceType === 1001
            "
            :href="dialogData.videoServiceUrl"
            target="_blank"
            class="rec-title"
          >
            <svg-icon icon-class="menu" />
            {{ dialogData.videoServiceTitle }}
          </a>
        </div>
        <div class="flex flex-align-center m-t-8">
          <AccountCard :info="dialogData" />
          <span class="m-l-16 video-detail-header__fans">
            <i class="iconfont iconfensi_fill" />{{
              Number(dialogData.fansNum) | toThousands
            }}</span>
        </div>
        <ul class="flex flex1 flex-align-end video-detail-header__data">
          <li>
            <i class="iconfont iconliuliang_fil" /><span data-num>{{
              dialogData.flowCount | toThousands
            }}</span>
          </li>
          <li>
            <i class="iconfont icondianzan_fill" /><span data-num>{{
              dialogData.thumbUpCount | toThousands
            }}</span>
          </li>
          <li>
            <i class="iconfont iconpinglun_fill" /><span data-num>{{
              dialogData.commentCount | toThousands
            }}</span>
          </li>
          <li>
            <i class="iconfont iconzhuanfa_fill" /><span data-num>{{
              dialogData.forwardedCount | toThousands
            }}</span>
          </li>
        </ul>
      </VideoInfo>
    </div>
    <div v-loading="loading" class="video-detail-content">
      <h3 data-bold>
        投放订单信息
        <span
          class="updated-time"
        >最近编辑时间：{{ dialogData.updateTime | emptyFill }}</span>
      </h3>
      <ul class="flex flex-wrap video-detail-content__list">
        <li>广告师：{{ dialogData.advertiserRealname | emptyFill }}</li>
        <li>投放专员：{{ dialogData.deliveryName | emptyFill }}</li>
        <li>编导人员：{{ dialogData.choreographerName | emptyFill }}</li>
        <li>品牌标签：{{ dialogData.videoTag | emptyFill }}</li>
        <li>业务标签：{{ dialogData.businessTag | emptyFill }}</li>
        <li>视频类型：{{ dialogData.junType | emptyFill }}</li>
        <li v-if="dialogData.businessTag === 'B2C'">产品型号：{{ dialogData.b2cPhoneModel || '--' }}</li>
        <li>内容类别：{{ dialogData.contentType | emptyFill }}</li>
        <li>口令：{{ dialogData.orderCommand | emptyFill }}</li>
        <li>组件类型：{{ dialogData.linkUseType | emptyFill }}</li>
        <li>组件渠道号：{{ dialogData.androidDeliveryName | emptyFill }}</li>
        <li>组件标题：
          {{ dialogData.componentTitle | emptyFill }}
          <img v-if="dialogData.componentIcon" class="svgIcon" :src="dialogData.componentIcon">
        </li>
        <li>组件点击量：{{ dialogData.cptClick | toThousands }}</li>
        <li>投放价格：{{ dialogData.deliveryMoney | toThousands }}</li>
        <li>CPM：{{ dialogData.cpm | toThousands }}</li>
        <li>
          CPA：{{ dialogData.cpa | toThousands }}
          <IconTip
            type="popover"
            content="抖音/快手：CPA=投放价格/新增激活，头条：CPA=投放价格/安卓新增激活。"
            icon-class="iconwenhao"
          />
        </li>
        <li>CPC：{{ dialogData.cpc | toThousands }}</li>

        <li>安卓新增激活：{{ dialogData.appNewDeviceQty | toThousands }}</li>
        <li>新增激活：{{ dialogData.activeUV | toThousands }}</li>

      </ul>
    </div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="数据表现" name="data">
        <div class="flex">
          <div class="flex1">
            <template
              v-if="dialogData.platId === 25 || dialogData.platId === 26"
            >
              <div
                :class="
                  ['new_kuaishou', 'new_douyin'].includes(
                    rowInfo.monitoringModeType
                  )
                    ? ''
                    : 'flex flex-justify-between flex-align-center m-b-16'
                "
              >
                <div class="flex flex-dir-col">
                  <el-radio-group v-model="trend" class="m-b-16" size="small">
                    <!-- link抖音无播放趋势 -->
                    <el-radio-button label="playChart">播放趋势</el-radio-button>
                    <el-radio-button label="linkChart">点赞趋势</el-radio-button>
                    <el-radio-button
                      v-if="
                        ['new_kuaishou', 'new_douyin'].includes(
                          rowInfo.monitoringModeType
                        )
                      "
                      label="clickTrendComponents"
                    >组件点击趋势</el-radio-button>
                  </el-radio-group>
                  <!-- <el-radio-group v-model="dataType" size="small">
                    <el-radio-button :label="1">分日数据</el-radio-button>
                    <el-radio-button :label="2">分时数据</el-radio-button>
                  </el-radio-group> -->
                </div>
                <div
                  v-if="chartsData[trend].updatedTime"
                  class="updated-time m-r-24"
                >
                  数据更新时间:{{ chartsData[trend].updatedTime }}
                </div>
              </div>
              <VChart
                :data="chartsData[trend]"
                :config="lineConfig"
                :loading="chartLoading"
              />
            </template>
            <template v-else>
              <div
                class="flex flex-justify-between flex-align-center m-b-16"
                style="height: 40px"
              >
                <Title title="点赞趋势" icon="icondianzan_fill" />
                <!-- <el-radio-group v-model="dataType" size="small" @change="handlePoints">
                  <el-radio-button :label="1">分日数据</el-radio-button>
                  <el-radio-button :label="2">分时数据</el-radio-button>
                </el-radio-group> -->
                <div
                  v-if="chartsData.digChart.updatedTime"
                  class="updated-time m-r-24"
                >
                  数据更新时间:{{ chartsData.digChart.updatedTime }}
                </div>
              </div>
              <VChart
                :data="chartsData.digChart"
                :config="lineConfig"
                :loading="chartLoading"
              />
            </template>
          </div>
          <div
            v-if="
              [25, 26].includes(dialogData.platId) &&
                ['new_kuaishou', 'new_douyin'].includes(
                  rowInfo.monitoringModeType
                )
            "
            class="flex1"
          >
            <div>
              <el-button
                type="primary"
                size="small"
                plain
              >新增激活</el-button>
              <!-- <br> -->
              <!-- <el-radio-group v-model="dataType" size="small" class="m-t-12" @change="handlePoints">
                <el-radio-button :label="1">分日数据</el-radio-button>
                <el-radio-button :label="2">分时数据</el-radio-button>
              </el-radio-group> -->
              <div
                v-if="chartsData.componentClick.updatedTime"
                class="m-t-16 updated-time"
              >
                数据更新时间:{{ chartsData.componentClick.updatedTime }}
              </div>
            </div>
            <VChart
              :data="chartsData.componentClick"
              :config="lineConfig"
              :loading="chartLoading"
            />
          </div>
          <div v-else class="flex1">
            <div
              class="flex flex-justify-between flex-align-center m-b-16"
              style="height: 40px"
            >
              <Title title="安卓新增激活" icon="iconbofang_fill" />
              <div
                v-if="chartsData.appNewDeviceQty.updatedTime"
                class="m-r-24 updated-time"
              >
                数据更新时间:{{ chartsData.appNewDeviceQty.updatedTime }}
              </div>
            </div>
            <VChart
              :data="chartsData.appNewDeviceQty"
              :config="lineConfig"
              :loading="chartLoading"
            />
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="
          (rowInfo.androidDeliveryName &&
            rowInfo.androidDeliveryName != '暂无') ||
            dialogData.platId === 25
        "
        label="业务转化详情"
        name="analyze"
      >
        <template v-if="deliveryInfo.type == 1">
          <div class="flex flex-align-center">
            <h3 data-bold>
              找靓机侧核心指标<span
                class="updated-time"
              >（{{
                isComponent ? '组件点击回传监测' : 'link组件渠道号监测'
              }}）</span>
            </h3>
            <div v-if="deliveryInfo.updatedTime" class="m-l-24 updated-time">
              最近更新时间:{{ deliveryInfo.updatedTime }}
            </div>
          </div>
          <ul v-loading="delivertLoading" class="container">
            <template
              v-if="
                [25, 26].includes(dialogData.platId) &&
                  ['new_kuaishou', 'new_douyin'].includes(
                    rowInfo.monitoringModeType
                  )
              "
            >
              <li>总下载激活用户数：{{ deliveryInfo.activeUv | emptyFill }}</li>
              <!-- <li>
                新增激活：{{
                  deliveryInfo.newActiveUv | toThousands
                }}
              </li> -->

              <li>新媒体app日活：{{ deliveryInfo.reachUsrUv | emptyFill }}</li>
              <li>C2B回收日活：{{ deliveryInfo.recPageUv | emptyFill }}</li>

              <li>C2B回收首页UV：{{ deliveryInfo.recHomePageUv | emptyFill }}</li>
              <li>
                C2B估计结果页UV（APP回收）：{{
                  deliveryInfo.recSubmitPageUv | emptyFill
                }}
              </li>

              <li>
                C2B总订单量(含app+上门+到店)：{{
                  deliveryInfo.recAllSubmitOrderQty| emptyFill
                }}
              </li>
              <li>
                C2B总收件量(含app+上门+到店)：{{
                  deliveryInfo.recAllReceiveOrderQty| emptyFill
                }}
              </li>
              <li>
                C2B总成交量(含app+上门+到店)：{{
                  deliveryInfo.recAllFinishOrderQty| emptyFill
                }}
              </li>
              <li v-if="isComponent">C2B总成交额：{{ deliveryInfo.recAllFinishOrderAmt| emptyFill }}</li>
              <li>B2C商品曝光UV：{{ deliveryInfo.b2cGoodsExhibitUv| emptyFill }}</li>

              <li>B2C商品详情UV：{{ deliveryInfo.b2cGoodsDetailPageUv| emptyFill }}</li>
              <li>B2C确认下单页UV：{{ deliveryInfo.b2cSureOrderPageUv| emptyFill }}</li>

              <li>
                B2C手机下单订单量：{{ deliveryInfo.b2cPhoneSubmitOrderQty| emptyFill }}
              </li>
              <li>
                B2C手机净支付数量：{{ deliveryInfo.b2cPhoneNetPayOrderQty| emptyFill }}
              </li>
              <li v-if="isComponent">
                B2C手机净支付金额：{{ deliveryInfo.b2cPhoneNetPayAmt | emptyFill }}
              </li>
              <li>B2C老3C下单订单量：{{ deliveryInfo.b2c3cSubmitOrderQty| emptyFill }}</li>
              <li>B2C老3C净支付数量：{{ deliveryInfo.b2c3cNetPayOrderQty| emptyFill }}</li>
            </template>
            <template v-else>
              <!-- <li>安卓新增激活：{{ deliveryInfo.appNewDeviceQty| emptyFill }}</li> -->
              <li>新增用户注册：{{ deliveryInfo.appNewRegUsrQty| emptyFill }}</li>
              <li>APP首页UV：{{ deliveryInfo.homePageUv| emptyFill }}</li>

              <li>商详UV：{{ deliveryInfo.goodsDetailPageUv| emptyFill }}</li>
              <li>确定订单页UV：{{ deliveryInfo.sureOrderPageUv | emptyFill }}</li>

              <li>商城3C净支付订单量：{{ deliveryInfo.scNetPayOrderQty| emptyFill }}</li>
              <li>商城3C净支付金额：{{ deliveryInfo.scNetPayOrderAmt| emptyFill }}</li>

              <li>靓选净支付订单量：{{ deliveryInfo.lxNetPayOrderQty| emptyFill }}</li>
              <li>靓选净支付金额：{{ deliveryInfo.lxNetPayOrderAmt| emptyFill }}</li>

              <li>回收日活UV：{{ deliveryInfo.recHomePageUv| emptyFill }}</li>
              <li>回收提交订单页UV：{{ deliveryInfo.recSubmitOrderPageUv| emptyFill }}</li>

              <li>回收收件量：{{ deliveryInfo.recBackOrderQty| emptyFill }}</li>
              <li>回收交易成交量：{{ deliveryInfo.recFinishOrderQty| emptyFill }}</li>

              <li>租赁首页UV：{{ deliveryInfo.leaHomePageUv | emptyFill }}</li>
              <li>租赁提交订单量：{{ deliveryInfo.leaSubmitOrderQty| emptyFill }}</li>
              <li>租赁订单净支付数：：{{ deliveryInfo.leaNetPayOrderQty| emptyFill }}</li>
            </template>
          </ul>
        </template>
        <template v-else>
          <div class="flex flex-align-center">
            <h3 data-bold>
              转转侧核心指标<span
                class="updated-time"
              >（{{
                isComponent ? '组件点击回传监测' : 'link组件渠道号监测'
              }}）</span>
            </h3>
            <div v-if="deliveryInfo.updatedTime" class="m-l-24 updated-time">
              最近更新时间:{{ deliveryInfo.updatedTime }}
            </div>
          </div>
          <ul v-loading="delivertLoading" class="container">
            <template
              v-if="
                [25, 26].includes(dialogData.platId) &&
                  ['new_kuaishou', 'new_douyin'].includes(
                    rowInfo.monitoringModeType
                  )
              "
            >
              <li>总下载激活用户数：{{ deliveryInfo.activeUv| emptyFill }}</li>
              <!-- <li>
                新增激活：{{ deliveryInfo.newActiveUv | toThousands }}
              </li> -->

              <li>新媒体app日活：{{ deliveryInfo.reachUsrUv| emptyFill }}</li>
              <li>C2B保卖入口UV：{{ deliveryInfo.recEntryPageUv| emptyFill }}</li>

              <li>C2B估价成功UV：{{ deliveryInfo.recEvaluateSucUv| emptyFill }}</li>
              <li>C2B提交订单UV：{{ deliveryInfo.recSubmitPageUv| emptyFill }}</li>

              <li>
                C2B总订单量(含app+上门+到店)：{{
                  deliveryInfo.recAllSubmitOrderQty| emptyFill
                }}
              </li>
              <li>
                C2B总收件量(含app+上门+到店)：{{
                  deliveryInfo.recAllReceiveOrderQty| emptyFill
                }}
              </li>

              <li>
                C2B总成交量(含app+上门+到店)：{{
                  deliveryInfo.recAllFinishOrderQty| emptyFill
                }}
              </li>
              <li v-if="isComponent">C2B总成交额：{{ deliveryInfo.recAllFinishOrderAmt| emptyFill }}</li>
              <li>B2C商品曝光UV：{{ deliveryInfo.b2cGoodsExhibitUv| emptyFill }}</li>

              <li>B2C商品详情UV：{{ deliveryInfo.b2cGoodsDetailPageUv| emptyFill }}</li>
              <li>B2C确认下单页UV：{{ deliveryInfo.b2cSureOrderPageUv| emptyFill }}</li>

              <li>
                B2C手机下单订单量：{{ deliveryInfo.b2cPhoneSubmitOrderQty| emptyFill }}
              </li>
              <li>
                B2C手机净支付数量：{{ deliveryInfo.b2cPhoneNetPayOrderQty| emptyFill }}
              </li>
              <li v-if="isComponent">
                B2C手机净支付金额：{{ deliveryInfo.b2cPhoneNetPayAmt | emptyFill }}
              </li>
              <li>
                B2C老3C下单订单量：{{ deliveryInfo.b2cOld3cSubmitOrderQty| emptyFill }}
              </li>
              <li>
                B2C老3C净支付数量：{{ deliveryInfo.b2cOld3cNetPayOrderQty| emptyFill }}
              </li>
              <li>
                B2C扩品类下单订单量：{{ deliveryInfo.b2cExt3cSubmitOrderQty| emptyFill }}
              </li>
              <li>
                B2C扩品类净支付数量：{{ deliveryInfo.b2cExt3cNetPayOrderQty| emptyFill }}
              </li>
              <li>C2C入口UV：{{ deliveryInfo.c2cEntryPageUv| emptyFill }}</li>
              <li>
                C2C闲置有效发布商品数：{{ deliveryInfo.c2cEffReleaseGoodsQty| emptyFill }}
              </li>
              <li>
                C2C闲置有效发布商品数_手机：{{
                  deliveryInfo.c2cEffReleasePhoneQty| emptyFill
                }}
              </li>
            </template>
            <template v-else>
              <!-- <li>安卓新增激活：{{ deliveryInfo.appNewDeviceQty| emptyFill }}</li> -->
              <li>新增用户注册：{{ deliveryInfo.zzAppNewUsrQty| emptyFill }}</li>
              <li>APP访问UV：{{ deliveryInfo.zzAppDau| emptyFill }}</li>
              <li>
                B2C商详UV手机：{{ deliveryInfo.zzB2cPhoneGoodsDetailPageUv| emptyFill }}
              </li>
              <li>
                B2C商详页UV__3C：{{ deliveryInfo.zzB2c3cGoodsDetailPageUv| emptyFill }}
              </li>

              <li>
                B2C下单数量_手机：{{ deliveryInfo.zzB2cPhoneSubmitOrderQty| emptyFill }}
              </li>
              <li>B2C下单数量_3C：{{ deliveryInfo.zzB2c3cSubmitOrderQty| emptyFill }}</li>

              <li>
                B2C支付数量_手机：{{ deliveryInfo.zzB2cPhonePayOrderQty| emptyFill }}
              </li>
              <li>B2C支付数量_3C：{{ deliveryInfo.zzB2c3cPayOrderQty| emptyFill }}</li>

              <li>保卖下单页UV：{{ deliveryInfo.zzC2bBmSureOrderPageUv| emptyFill }}</li>
              <li>
                C2B保卖下单订单数：{{ deliveryInfo.zzC2bBmSubmitOrderQty| emptyFill }}
              </li>

              <li>C2B保卖发货订单数：{{ deliveryInfo.zzC2bBmSendOrderQty| emptyFill }}</li>
              <li>
                C2B保卖签收订单数：{{ deliveryInfo.zzC2bBmReceiveOrderQty| emptyFill }}
              </li>
              <li>
                C2B保卖支付订单数：{{ deliveryInfo.zzC2bBmPayTimeOrderQty| emptyFill }}
              </li>

              <li>
                C2C闲置有效发布人数：{{ deliveryInfo.zzC2cValidPubUsrQty | emptyFill }}
              </li>
              <li>
                C2C闲置有效发布商品数：{{ deliveryInfo.zzC2cValidPubGoodsQty| emptyFill }}
              </li>
            </template>
          </ul>
        </template>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
import { VideoInfo, AccountCard, Title, VChart, IconTip } from 'components'

import {
  $getVideoPutting,
  $getOrderVideoData,
  $getOrderVideoConversionData,
  $getTiktokVideoSpreadTrend_Dnew,
  $getTiktokVideoSpreadTrend_Knew
} from '@/api/bussiness-manage'
import {
  $getNewActiveUvData_Dnew,
  $getNewOrderVideoConversionData_Dnew
} from '@/api/putting-manager'
export default {
  components: {
    VideoInfo,
    AccountCard,
    Title,
    VChart,
    IconTip
  },
  props: {
    rowInfo: {
      type: Object,
      default() {
        return {
          flowId: '',
          androidDeliveryName: '',
          orderId: '',
          platId: null
        }
      }
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // dataType: 1,
      dialogData: {},
      activeName: 'data',
      chartsData: {
        digChart: {
          cates: [],
          values: [],
          terms: []
        },
        appNewDeviceQty: {
          cates: [],
          values: [],
          terms: []
        },
        componentClick: {
          cates: [],
          values: [],
          terms: []
        },
        playChart: {
          cates: [],
          values: [],
          terms: []
        },
        clickTrendComponents: {
          cates: [],
          values: [],
          terms: []
        }
      },
      lineConfig: {
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ],
        grid: {
          left: '8%',
          right: '8%'
        }
      },
      trend: 'playChart',
      loading: true,
      chartLoading: true,
      delivertLoading: true,
      deliveryInfo: {},
      clickNewActivationComponent: true,
      playTrendData: false
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        return this.$emit('input', value)
      }
    },
    isComponent() {
      return ['new_kuaishou', 'new_douyin'].includes(
        this.rowInfo.monitoringModeType
      )
    }
  },
  created() {
    this.activeName = 'data'
    const { flowId, androidDeliveryName, orderId, monitoringModeType } =
      this.rowInfo
    this.getVideoPutting({ orderId, flowId })
    // 抖音新版/老版
    if (this.rowInfo.platId === 25) {
      if (monitoringModeType === 'new_douyin') {
        this.getDyVideoCharts({ flowId })
        // 新增激活
        this.getDyNewActiveUvData({ flowId })
        // 抖音新版 业务详情
        this.getOrderDyVideoConversionData({ flowId })
      } else {
        this.getDyVideoCharts({ flowId })
        // 抖音 老版 仅获取安卓新增激活
        this.getOrderVideoData({ flowId, androidDeliveryName })
        // 抖音老版 业务详情
        this.getOrderVideoConversionData({ androidDeliveryName })
      }
    } else if (this.rowInfo.platId === 26) {
      if (monitoringModeType === 'new_kuaishou') {
        this.getKSVideoCharts({ flowId })
        this.getDyNewActiveUvData({ flowId })
        this.getOrderDyVideoConversionData({ flowId })
      } else {
        // 旧版会获取播放趋势/点赞趋势 及安卓新增激活
        this.getOrderVideoData({ flowId, androidDeliveryName })
        this.getOrderVideoConversionData({ androidDeliveryName })
      }
    } else {
      this.getOrderVideoData({ flowId, androidDeliveryName })
      if (androidDeliveryName && androidDeliveryName !== '暂无') {
        this.getOrderVideoConversionData({ androidDeliveryName })
      }
    }
  },
  methods: {
    // 获取基本数据
    getVideoPutting({ orderId, flowId }) {
      this.loading = true
      $getVideoPutting({ orderId, flowId })
        .then((res) => {
          if (res.code === 1) {
            this.dialogData = res.data
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.loading = false
        })
    },
    getDyVideoCharts({ flowId }) {
      this.chartLoading = true
      // 抖音新版new_douyin 数据表现
      // getTiktokVideoSpreadTrend_Dold
      $getTiktokVideoSpreadTrend_Dnew({ flowId })
        .then((res) => {
          if (res.code === 1) {
            if (res.data) {
              this.formatDyChartsOprions(res.data)
            }
          } else {
            this.$message.error(res.message || '出错了～')
          }
          this.chartLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.chartLoading = false
        })
    },
    getKSVideoCharts({ flowId }) {
      this.chartLoading = true
      // 快手新版new_douyin 数据表现
      // getTiktokVideoSpreadTrend_Dold
      $getTiktokVideoSpreadTrend_Knew({ flowId })
        .then((res) => {
          if (res.code === 1) {
            if (res.data) {
              this.formatDyChartsOprions(res.data)
            }
          } else {
            this.$message.error(res.message || '出错了～')
          }
          this.chartLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.chartLoading = false
        })
    },
    // 抖音新版new_douyin 新增激活
    getDyNewActiveUvData({ flowId }) {
      $getNewActiveUvData_Dnew({ flowId }).then((res) => {
        if (res.code === 1 && res.data) {
          this.chartsData.componentClick = {
            values: [
              res.data.newActiveUvListBO.activeUvs,
              res.data.activeUvListBO.activeUvs
            ],
            terms: [
              ...new Set([
                ...res.data.newActiveUvListBO.statDates,
                ...res.data.activeUvListBO.statDates
              ])
            ],
            cates: ['新增激活增量', '新增激活总量'],
            updatedTime: res.data.activeUvListBO.updatedTime
          }
        } else {
          this.clickNewActivationComponent = !!res.data
        }
      })
    },

    // 抖音旧版 安卓新增激活 快手：点赞 播放 安卓新增激活
    getOrderVideoData({ flowId, androidDeliveryName }) {
      this.chartLoading = true
      $getOrderVideoData({ flowId, androidDeliveryName })
        .then((res) => {
          if (res.code === 1) {
            this.formatChartsOptions(res.data)
          } else {
            this.playTrendData = false
            this.$message.error(res.message)
          }
          this.chartLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.chartLoading = false
        })
    },
    // 抖音老版 业务转化详情
    getOrderVideoConversionData({ androidDeliveryName }) {
      this.delivertLoading = true
      $getOrderVideoConversionData({ androidDeliveryName })
        .then((res) => {
          if (res.code === 1) {
            this.deliveryInfo = res.data || []
          } else {
            this.$message.error(res.message)
          }
          this.delivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.delivertLoading = false
        })
    },
    // 抖音新版 业务转化详情
    getOrderDyVideoConversionData({ flowId }) {
      this.delivertLoading = true
      $getNewOrderVideoConversionData_Dnew({ flowId })
        .then((res) => {
          if (res.code === 1) {
            this.deliveryInfo = res.data || []
          } else {
            this.$message.error(res.message)
          }
          this.delivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.delivertLoading = false
        })
    },
    // 格式化数据
    formatChartsOptions(chartsData) {
      if (this.rowInfo.platId !== 25) {
        if (chartsData.terms[0] && chartsData.terms[0].length > 0) {
          this.chartsData.digChart = {
            values: [chartsData.values[0], chartsData.values[1]],
            terms: chartsData.terms[0],
            cates: [chartsData.cates[0].typeName, chartsData.cates[1].typeName],
            updatedTime: chartsData.cates[0].updatedTime
          }
        }
        this.chartsData.linkChart = this.chartsData.digChart
        if (chartsData.terms[2] && chartsData.terms[2].length > 0) {
          this.chartsData.playChart = {
            values: [chartsData.values[4], chartsData.values[5]],
            terms: chartsData.terms[2],
            cates: [chartsData.cates[4].typeName, chartsData.cates[5].typeName],
            updatedTime: chartsData.cates[4].updatedTime
          }
        }
      }
      if (chartsData.terms[1] && chartsData.terms[1].length > 0) {
        this.chartsData.appNewDeviceQty = {
          values: [chartsData.values[2], chartsData.values[3]],
          terms: chartsData.terms[1],
          cates: [chartsData.cates[2].typeName, chartsData.cates[3].typeName],
          updatedTime: chartsData.cates[2].updatedTime
        }
      }
    },
    formatDyChartsOprions(chartsData) {
      this.chartsData.playChart = {
        values: [chartsData.flowIncrs.num, chartsData.flowTotals.num],
        terms: [
          ...new Set([
            ...chartsData.flowTotals.date,
            ...chartsData.flowIncrs.date
          ])
        ],
        cates: ['播放增量', '播放总量'],
        updatedTime: chartsData.flowIncrs.updatedTime
      }
      this.chartsData.linkChart = {
        values: [chartsData.agreeIncrs.num, chartsData.agreeTotals.num],
        terms: [
          ...new Set([
            ...chartsData.agreeTotals.date,
            ...chartsData.agreeIncrs.date
          ])
        ],
        cates: ['点赞增量', '点赞总量'],
        updatedTime: chartsData.agreeIncrs.updatedTime
      }
      this.chartsData.clickTrendComponents = {
        values: [
          chartsData.componentClickIncrs.num,
          chartsData.componentClickTotals.num
        ],
        terms: [
          ...new Set([
            ...chartsData.componentClickTotals.date,
            ...chartsData.componentClickIncrs.date
          ])
        ],
        cates: ['组件点击增量', '组件点击总量'],
        updatedTime: chartsData.componentClickIncrs.updatedTime
      }
    },
    /**
     * 浮层取消
     */
    onCancel() {
      this.show = false
    },
    /**
     * 播放视频
     * @param  {String}  url  视频地址
     */
    playVideo(url) {
      if (url) {
        window.open(url)
      }
    },
    handlePoints(val) {
      console.log(val)
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    padding: 0;
  }
  .el-tab-pane {
    padding: 24px 24px 8px;
  }
  .img-layer {
    font-size: 20px !important;
  }
}
.video-detail {
  &-header {
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    &__fans {
      font-size: 14px;
      color: #d9d9d9;
      .iconfont {
        font-size: 14px;
        margin-right: 4px;
      }
    }
    &__data {
      font-size: 20px;
      color: #272727;
      line-height: 20px;
      > li {
        margin-right: 50px;
      }
      .iconfont {
        margin-right: 5px;
        font-size: 18px;
        color: #d9d9d9;
      }
    }
    ::v-deep {
      .video-info {
        &-coverImg {
          width: 100px;
          height: 134px;
          border-radius: 6px;
          margin-right: 12px;
        }
        &-right__title {
          margin-bottom: 8px;
        }
      }
    }
  }
  &-content {
    padding: 24px;
    > h3 {
      font-size: 14px;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    &__time {
      margin-left: 36px;
      font-size: 12px;
      font-weight: 400;
      color: #595959;
      line-height: 16px;
    }
    &__list {
      > li {
        width: 25%;
        margin-top: 16px;
        font-size: 12px;
        color: #595959;
        line-height: 16px;
      }
    }
  }
  .container {
    > li {
      display: inline-block;
      width: 33.33%;
      margin-top: 16px;
    }
    margin-bottom: 16px;
  }
}
.updated-time {
  color: #8c8c8c;
  font-size: 12px;
}
.m-t-8 {
  margin-top: 8px;
}

.svgIcon {
  width: 14px;
  vertical-align: -2px;
}
</style>
