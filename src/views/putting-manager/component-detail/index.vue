<template>
  <div>
    <AnchorLayout :anchor="anchor">
      <template v-slot:anchor0>
        <ul class="flex flex-wrap video-detail-content__list m-b-20 grey">
          <li>平台订单ID：{{ otherData.platOrderId || '--' }}</li>
          <li>平台任务名称：{{ otherData.platOrderName || '--' }}</li>
          <li>平台任务创建时间：{{ otherData.platCreatetime || '--' }}</li>
          <li v-if="type !== 'self'">
            乾数据订单号：{{ otherData.qsjOrderNumber || '--' }}
          </li>
        </ul>

        <div
          v-if="type !== 'self'"
          v-loading="orderDetailLoading"
          class="video-detail-content"
        >
          <h3 data-bold class="h3">
            投放订单信息
            <span
              class="video-detail-content__time"
            >最近编辑时间：{{ basicData.updateTime || '--' }}</span>
          </h3>
          <ul class="flex flex-wrap video-detail-content__list">
            <li>广告师：{{ basicData.advertiserRealname || '--' }}</li>
            <li>投放专员：{{ basicData.deliveryName || '--' }}</li>
            <li>品牌标签：{{ basicData.videoTag || '--' }}</li>
            <li>业务标签：{{ basicData.businessTag || '--' }}</li>
            <li>视频类型：{{ basicData.junType || '--' }}</li>
            <li v-if="basicData.businessTag === 'B2C'">产品型号：{{ basicData.b2cPhoneModel || '--' }}</li>
            <li>内容类别：{{ basicData.contentType || '--' }}</li>
            <li>口令：{{ basicData.orderCommand || '--' }}</li>
            <li>
              组件类型：{{ basicData.linkUseType || '--' }}
              <img
                v-if="basicData.componentIcon"
                class="componentIcon"
                :src="basicData.componentIcon"
              >
              <template v-if="basicData.linkUseType!=='网服组件'">
                <el-link
                  v-if="basicData.componentTitle"
                  :href="basicData.componentLink"
                  target="_blank"
                />
              </template>
              <span v-else>{{ basicData.componentTitle }}</span>
            </li>
            <li>组件渠道号：{{ basicData.androidDeliveryName || '--' }}</li>
            <!-- <li>投放价格：{{ basicData.deliveryMoney | toThousands }}</li>
            <li>CPM：{{ basicData.cpm | toThousands }}</li>
            <li>CPC：{{ basicData.cpc | toThousands }}</li>
            <li>安卓新增激活：{{ basicData.appNewDeviceQty | toThousands }}</li>
            <li>组件点击新增激活：{{ basicData.activeUV | toThousands }}</li>
            <li>CPA：{{ basicData.cpa | toThousands }} -->
            <!-- <IconTip
              type="popover"
              content="抖音/头条：CPA=投放价格/组件点击新增激活，快手：CPA=投放价格/安卓新增激活。"
              icon-class="iconwenhao"
            /> -->
          </ul>
        </div>
        <div v-else v-loading="orderDetailLoading">
          <ul class="flex flex-wrap video-detail-content__list">
            <li>编辑人员：{{ basicData.editName || '--' }}</li>
            <li>剪辑人员：{{ basicData.cutName || '--' }}</li>
            <li>品牌标签：{{ basicData.videoTag || '--' }}</li>
            <li>视频类型：{{ basicData.junType || '--' }}</li>
            <li>组件类型：{{ basicData.linkUseType || '--' }}</li>
          </ul>
        </div>
        <Statistics
          v-loading="orderDetailLoading"
          class="statistics data-wrap"
          :data="summaryItems"
        />

        <h3 data-bold class="h3 m-t-20">订单视频</h3>
        <div class="video-detail">
          <div
            v-for="videoItem in videoList"
            :key="videoItem.titleName"
            class="video-detail-header"
          >
            <VideoInfo
              :info="{
                coverImg: videoItem.videoCoverUrl,
                title: videoItem.titleName,
                addTime: timestampToTime(videoItem.addTime),
                url: videoItem.videoIndexUrl,
                isDeleted: videoItem.isDeleted,
              }"
            >
              <div class="m-t-8">
                <a
                  v-if="videoItem.recTitle"
                  :href="videoItem.recLink"
                  target="_blank"
                  class="rec-title"
                >
                  <svg-icon icon-class="ele" />
                  {{ videoItem.recTitle }}
                </a>
                <a
                  v-if="
                    videoItem.videoServiceTitle &&
                      videoItem.videoServiceType === 1001
                  "
                  :href="videoItem.videoServiceUrl"
                  target="_blank"
                  class="rec-title"
                >
                  <svg-icon icon-class="menu" />
                  {{ videoItem.videoServiceTitle }}
                </a>
              </div>
              <div class="flex flex-align-center m-t-8">
                <AccountCard :info="videoItem" />
                <span class="m-l-16 video-detail-header__fans">
                  <i class="iconfont iconfensi_fill" />{{
                    Number(videoItem.fansNum) | toThousands
                  }}</span>
              </div>
              <ul class="flex flex1 flex-align-end video-detail-header__data">
                <li>
                  <i class="iconfont iconliuliang_fil" /><span data-num>{{
                    videoItem.flowCount | toThousands
                  }}</span>
                </li>
                <li>
                  <i class="iconfont icondianzan_fill" /><span data-num>{{
                    videoItem.thumbUpCount | toThousands
                  }}</span>
                </li>
                <li>
                  <i class="iconfont iconpinglun_fill" /><span data-num>{{
                    videoItem.commentCount | toThousands
                  }}</span>
                </li>
                <li>
                  <i class="iconfont iconzhuanfa_fill" /><span data-num>{{
                    videoItem.forwardedCount | toThousands
                  }}</span>
                </li>
              </ul>
            </VideoInfo>
          </div>
        </div>
      </template>
      <template v-slot:anchor1>
        <h3 data-bold class="h3 m-b-20">转化表现</h3>
        <!-- <el-radio-group v-model="dataType" size="small" class="m-b-12" @change="handlePoints">
          <el-radio-button :label="1">分日数据</el-radio-button>
          <el-radio-button :label="2">分时数据</el-radio-button>
        </el-radio-group> -->

        <div class="flex m-b-10">
          <div class="flex1">
            <!-- <template v-if="basicData.platId === 25"> -->
            <template>
              <div class="flex m-b-10">
                <el-radio-group v-model="trend" size="small">
                  <el-radio-button label="playChart">播放趋势</el-radio-button>
                  <el-radio-button label="linkChart">点赞趋势</el-radio-button>
                  <el-radio-button
                    v-if="
                      model === 'new_douyin' ||
                        model === 'new_kuaishou' ||
                        type === 'self'
                    "
                    label="clickTrendComponents"
                  >组件点击趋势</el-radio-button>
                </el-radio-group>
              </div>
              <div
                v-if="chartsData[trend].updatedTime"
                class="updated-time m-b-20"
              >
                数据更新时间:{{ chartsData[trend].updatedTime }}
              </div>
              <VChart
                :data="chartsData[trend]"
                :config="lineConfig"
                :loading="chartLoading"
              />
            </template>
            <!-- <template v-else> -->
            <!-- <template>
              <Title title="点赞趋势" icon="icondianzan_fill" />
              <VChart
                :data="chartsData.digChart"
                :config="lineConfig"
                :loading="chartLoading"
              />
            </template> -->
          </div>
          <div
            v-if="
              (model === 'old_douyin' || model === 'old_kuaishou') &&
                type !== 'self'
            "
            class="flex1"
          >
            <el-button
              class="m-b-20"
              type="primary"
              size="small"
              plain
            >安卓新增激活</el-button>
            <div
              v-if="chartsData.appNewDeviceQty.updatedTime"
              class="updated-time m-b-20"
            >
              数据更新时间:{{ chartsData.appNewDeviceQty.updatedTime }}
            </div>
            <VChart
              :data="chartsData.appNewDeviceQty"
              :config="lineConfig"
              :loading="chartLoading"
            />
          </div>
          <div
            v-if="
              model === 'new_douyin' ||
                model === 'new_kuaishou' ||
                type === 'self'
            "
            class="flex1"
          >
            <div>
              <el-button
                class="m-b-20 m-r-10"
                type="primary"
                size="small"
                plain
              >组件点击拉新促活</el-button>
              <IconTip
                class="iconTip"
                type="popover"
                content="统计口径为有点击组件的可监测用户，含新增用户和促活老用户，用户仅当日去重，多日未去重。系统每日更新一次。"
                icon-class="iconwenhao"
              />
            </div>
            <div
              v-if="chartsData.pullNew.updatedTime"
              class="updated-time m-b-20"
            >
              数据更新时间:{{ chartsData.pullNew.updatedTime }}
            </div>
            <VChart
              :data="chartsData.pullNew"
              :config="lineConfig"
              :loading="chartLoading"
            />
          </div>

          <div
            v-if="
              model === 'new_douyin' ||
                model === 'new_kuaishou' ||
                type === 'self'
            "
            class="flex1"
          >
            <div>
              <el-button
                class="m-b-20 m-r-10"
                type="primary"
                size="small"
                plain
              >新增激活</el-button>
              <IconTip
                class="iconTip"
                type="popover"
                content="2022年8月2日快手改为曝光口径"
                icon-class="iconwenhao"
              />
            </div>
            <div
              v-if="chartsData.componentClick.updatedTime"
              class="updated-time m-b-20"
            >
              数据更新时间:{{ chartsData.componentClick.updatedTime }}
            </div>
            <VChart
              :data="chartsData.componentClick"
              :config="lineConfig"
              :loading="chartLoading"
            />
          </div>
        </div>
        <!-- v-loading="coreLoading" -->
        <div>
          <template>
            <template
              v-if="[25,26].includes(+platId) || !(detailType === 'D')"
            >
              <h3 data-bold class="h3 m-b-10">
                端内核心指标
                <!-- （{{
                  model === 'new_douyin' || model === 'new_kuaishou'
                    ? '组件点击回传监测'
                    : 'link组件渠道号监测'
                }}） -->
                <span
                  class="video-detail-content__time"
                >最近更新时间：{{ b2cDeliveryInfo.updateTime || '--' }}</span>
              </h3>

              <!-- <ul class="flex flex-wrap video-detail-content__list">
                <template v-if="+core.type == 1">
                  <template
                    v-if="['new_douyin', 'new_kuaishou'].indexOf(model) > -1"
                  >
                    <li>总下载激活用户数：{{ core.activeUv | emptyFill }}</li>
                    <li>
                      新增激活：{{ core.newActiveUv | toThousands }}
                    </li>

                    <li>新媒体app日活：{{ core.reachUsrUv | emptyFill }}</li>
                    <li>C2B回收日活：{{ core.recPageUv | emptyFill }}</li>

                    <li>C2B回收首页UV：{{ core.recHomePageUv | emptyFill }}</li>
                    <li>
                      C2B估计结果页UV（APP回收）：{{
                        core.recSubmitPageUv | emptyFill
                      }}
                    </li>

                    <li>
                      C2B总订单量(含app+上门+到店)：{{
                        core.recAllSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B总收件量(含app+上门+到店)：{{
                        core.recAllReceiveOrderQty | emptyFill
                      }}
                    </li>

                    <li>
                      C2B总成交量(含app+上门+到店)：{{
                        core.recAllFinishOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B总成交额：{{ core.recAllFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      B2C商品曝光UV：{{ core.b2cGoodsExhibitUv | emptyFill }}
                    </li>

                    <li>
                      B2C商品详情UV：{{ core.b2cGoodsDetailPageUv | emptyFill }}
                    </li>
                    <li>
                      B2C确认下单页UV：{{ core.b2cSureOrderPageUv | emptyFill }}
                    </li>

                    <li>
                      B2C手机下单订单量：{{
                        core.b2cPhoneSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C手机净支付数量：{{
                        core.b2cPhoneNetPayOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C手机净支付金额：{{ core.b2cPhoneNetPayAmt| emptyFill }}
                    </li>
                    <li>
                      B2C老3C下单订单量：{{
                        core.b2c3cSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C老3C净支付数量：{{
                        core.b2c3cNetPayOrderQty | emptyFill
                      }}
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      安卓新增激活：{{ core.appNewDeviceQty | emptyFill }}
                    </li>
                    <li>
                      新增用户注册：{{ core.appNewRegUsrQty | emptyFill }}
                    </li>
                    <li>APP首页UV：{{ core.homePageUv | emptyFill }}</li>

                    <li>商详UV：{{ core.goodsDetailPageUv | emptyFill }}</li>
                    <li>
                      确定订单页UV：{{ core.sureOrderPageUv | emptyFill }}
                    </li>

                    <li>
                      商城3C净支付订单量：{{
                        core.scNetPayOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      商城3C净支付金额：{{ core.scNetPayOrderAmt | emptyFill }}
                    </li>

                    <li>
                      靓选净支付订单量：{{ core.lxNetPayOrderQty | emptyFill }}
                    </li>
                    <li>
                      靓选净支付金额：{{ core.lxNetPayOrderAmt | emptyFill }}
                    </li>

                    <li>回收日活UV：{{ core.recHomePageUv | emptyFill }}</li>
                    <li>
                      回收提交订单页UV：{{
                        core.recSubmitOrderPageUv | emptyFill
                      }}
                    </li>

                    <li>回收收件量：{{ core.recBackOrderQty | emptyFill }}</li>
                    <li>
                      回收交易成交量：{{ core.recFinishOrderQty | emptyFill }}
                    </li>

                    <li>租赁首页UV：{{ core.leaHomePageUv | emptyFill }}</li>
                    <li>
                      租赁提交订单量：{{ core.leaSubmitOrderQty | emptyFill }}
                    </li>
                    <li>
                      租赁订单净支付数：：{{
                        core.leaNetPayOrderQty | emptyFill
                      }}
                    </li>
                  </template>
                </template>
                <template v-else>
                  <template
                    v-if="['new_douyin', 'new_kuaishou'].indexOf(model) > -1"
                  >
                    <li>总下载激活用户数：{{ core.activeUv | emptyFill }}</li>
                    <li>
                      新增激活：{{ core.newActiveUv | toThousands }}
                    </li>

                    <li>新媒体app日活：{{ core.reachUsrUv | emptyFill }}</li>
                    <li>
                      C2B保卖入口UV：{{ core.recEntryPageUv | emptyFill }}
                    </li>

                    <li>
                      C2B估价成功UV：{{ core.recEvaluateSucUv | emptyFill }}
                    </li>
                    <li>
                      C2B提交订单UV：{{ core.recSubmitPageUv | emptyFill }}
                    </li>

                    <li>
                      C2B总订单量(含app+上门+到店)：{{
                        core.recAllSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B总收件量(含app+上门+到店)：{{
                        core.recAllReceiveOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B总成交量(含app+上门+到店)：{{
                        core.recAllFinishOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B总成交额：{{ core.recAllFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      B2C商品曝光UV：{{ core.b2cGoodsExhibitUv | emptyFill }}
                    </li>

                    <li>
                      B2C商品详情UV：{{ core.b2cGoodsDetailPageUv | emptyFill }}
                    </li>
                    <li>
                      B2C确认下单页UV：{{ core.b2cSureOrderPageUv | emptyFill }}
                    </li>

                    <li>
                      B2C手机下单订单量：{{
                        core.b2cPhoneSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C手机净支付数量：{{
                        core.b2cPhoneNetPayOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C手机净支付金额：{{ core.b2cPhoneNetPayAmt| emptyFill }}
                    </li>
                    <li>
                      B2C老3C下单订单量：{{
                        core.b2cOld3cSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C老3C净支付数量：{{
                        core.b2cOld3cNetPayOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C扩品类下单订单量：{{
                        core.b2cExt3cSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C扩品类净支付数量：{{
                        core.b2cExt3cNetPayOrderQty | emptyFill
                      }}
                    </li>
                    <li>C2C入口UV：{{ core.c2cEntryPageUv | emptyFill }}</li>
                    <li>
                      C2C闲置有效发布商品数：{{
                        core.c2cEffReleaseGoodsQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2C闲置有效发布商品数_手机：{{
                        core.c2cEffReleasePhoneQty | emptyFill
                      }}
                    </li>
                  </template>
                  <template v-else>
                    <li>
                      安卓新增激活：{{ core.appNewDeviceQty | emptyFill }}
                    </li>
                    <li>新增用户注册：{{ core.zzAppNewUsrQty | emptyFill }}</li>
                    <li>APP访问UV：{{ core.zzAppDau | emptyFill }}</li>
                    <li>
                      B2C商详UV手机：{{
                        core.zzB2cPhoneGoodsDetailPageUv | emptyFill
                      }}
                    </li>
                    <li>
                      B2C商详页UV__3C：{{
                        core.zzB2c3cGoodsDetailPageUv | emptyFill
                      }}
                    </li>

                    <li>
                      B2C下单数量_手机：{{
                        core.zzB2cPhoneSubmitOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C下单数量_3C：{{
                        core.zzB2c3cSubmitOrderQty | emptyFill
                      }}
                    </li>

                    <li>
                      B2C支付数量_手机：{{
                        core.zzB2cPhonePayOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      B2C支付数量_3C：{{ core.zzB2c3cPayOrderQty | emptyFill }}
                    </li>

                    <li>
                      保卖下单页UV：{{
                        core.zzC2bBmSureOrderPageUv | emptyFill
                      }}
                    </li>
                    <li>
                      C2B保卖下单订单数：{{
                        core.zzC2bBmSubmitOrderQty | emptyFill
                      }}
                    </li>

                    <li>
                      C2B保卖发货订单数：{{
                        core.zzC2bBmSendOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B保卖签收订单数：{{
                        core.zzC2bBmReceiveOrderQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2B保卖支付订单数：{{
                        core.zzC2bBmPayTimeOrderQty | emptyFill
                      }}
                    </li>

                    <li>
                      C2C闲置有效发布人数：{{
                        core.zzC2cValidPubUsrQty | emptyFill
                      }}
                    </li>
                    <li>
                      C2C闲置有效发布商品数：{{
                        core.zzC2cValidPubGoodsQty | emptyFill
                      }}
                    </li>
                  </template>
                </template>
              </ul> -->
              <div class="indicators-box">
                <div v-loading="b2cDelivertLoading">
                  <h4 class="core-title m-b-12">B2C</h4>
                  <ul class="indicators-box-left">
                    <li>
                      B2C商品曝光UV：{{ b2cDeliveryInfo.b2cGoodsExhibitUv| emptyFill }}
                    </li>
                    <li>
                      B2C商品详情UV：{{ b2cDeliveryInfo.b2cGoodsDetailPageUv| emptyFill }}
                    </li>
                    <li>
                      B2C确认下单页UV：{{ b2cDeliveryInfo.b2cSureOrderPageUv| emptyFill }}
                    </li>
                    <li>
                      B2C订单客单价：{{ b2cDeliveryInfo.b2cOrderCustomerUnitPrice| emptyFill }}
                    </li>
                    <li>
                      B2C-GPM：{{ b2cDeliveryInfo.b2cGPM| emptyFill }}
                    </li>
                    <li />
                    <li>
                      B2C总净支付数量：{{ b2cDeliveryInfo.b2cAllNetPayOrderQty| emptyFill }}
                    </li>
                    <li>
                      B2C手机净支付数量：{{ b2cDeliveryInfo.b2cPhoneNetPayOrderQty| emptyFill }}
                    </li>
                    <li>
                      B2C新3C净支付数量：{{ b2cDeliveryInfo.b2cNew3cNetPayOrderQty| emptyFill }}
                    </li>
                    <li>
                      B2C多品类净支付数量：{{ b2cDeliveryInfo.b2cExt3cNetPayOrderQty| emptyFill }}
                    </li>
                    <li>
                      B2C总GMV：{{ b2cDeliveryInfo.b2cTotalGmv| emptyFill }}
                    </li>
                    <li>
                      B2C3天总GMV：{{ b2cDeliveryInfo.b2cTotalGmvFront3Day| emptyFill }}
                    </li>
                    <li>
                      B2C7天总GMV：{{ b2cDeliveryInfo.b2cTotalGmvFront7Day| emptyFill }}
                    </li>
                    <li>
                      B2C14天总GMV：{{ b2cDeliveryInfo.b2cTotalGmvFront14Day| emptyFill }}
                    </li>
                    <li>
                      B2C手机GMV：{{ b2cDeliveryInfo.b2cPhoneGmv| emptyFill }}
                    </li>
                    <li>
                      B2C新3CGMV：{{ b2cDeliveryInfo.b2cNew3cNetPayAmt| emptyFill }}
                    </li>
                    <li>
                      B2C多品类GMV：{{ b2cDeliveryInfo.b2cMultiCategoryGmv| emptyFill }}
                    </li>
                    <li>
                      B2C总GMV-ROI：{{ b2cDeliveryInfo.b2cTotalGmvRoi| emptyFill }}
                    </li>
                    <li>
                      B2C手机GMV-ROI：{{ b2cDeliveryInfo.b2cPhoneGmvRoi| emptyFill }}
                    </li>
                    <li>
                      B2C新3CGMV-ROI：{{ b2cDeliveryInfo.b2cNew3cNetPayAmtRoi| emptyFill }}
                    </li>
                    <li>
                      B2C多品类GMV-ROI：{{ b2cDeliveryInfo.b2cMultiCategoryGmvRoi| emptyFill }}
                    </li>
                    <li>
                      B2C总利润：{{ b2cDeliveryInfo.b2cTotalProfit| emptyFill }}
                    </li>
                    <li>
                      B2C手机利润：{{ b2cDeliveryInfo.b2cPhoneProfit| emptyFill }}
                    </li>
                    <li>
                      B2C新3C利润：{{ b2cDeliveryInfo.b2cNew3cNetPayAmtProfit| emptyFill }}
                    </li>
                    <li>
                      B2C多品类利润：{{ b2cDeliveryInfo.b2cMultiCategoryProfit| emptyFill }}
                    </li>
                    <li>
                      B2C总利润ROI：{{ b2cDeliveryInfo.b2cTotalProfitRoi| emptyFill }}
                    </li>
                    <li>
                      B2C手机利润ROI：{{ b2cDeliveryInfo.b2cPhoneProfitRoi| emptyFill }}
                    </li>
                    <li>
                      B2C新3C利润ROI：{{ b2cDeliveryInfo.b2cNew3cNetPayAmtProfitRoi| emptyFill }}
                    </li>
                    <li>
                      B2C多品类利润ROI：{{ b2cDeliveryInfo.b2cMultiCategoryProfitRoi| emptyFill }}
                    </li>
                  </ul>
                </div>
                <div v-loading="c2bDelivertLoading">
                  <h4 class="core-title m-l-12 m-b-12">C2B</h4>
                  <ul class="indicators-box-right">
                    <li>
                      C2B保卖入口UV：{{ c2bDeliveryInfo.recEntryPageUv| emptyFill }}
                    </li>
                    <li>
                      C2B估价成功UV：{{ c2bDeliveryInfo.recEvaluateSucUv| emptyFill }}
                    </li>
                    <li>
                      C2B提交订单UV：{{ c2bDeliveryInfo.recSubmitPageUv| emptyFill }}
                    </li>
                    <li>
                      C2B回收客单价：{{ c2bDeliveryInfo.c2bOrderCustomerUnitPrice| emptyFill }}
                    </li>
                    <li>
                      C2B-GPM：{{ c2bDeliveryInfo.c2bGPM| emptyFill }}
                    </li>
                    <li>
                      C2B回收价格区间：
                      <el-popover trigger="hover" placement="top" width="390">
                        <div v-if="c2bDeliveryInfo.recAllFinishOrderQtyProportionList&&c2bDeliveryInfo.recAllFinishOrderQtyProportionList.length">
                          <div class="popver-box">
                            <div>价格区间</div>
                            <div>回收量</div>
                            <div>占比</div>
                          </div>
                          <div v-for="(item,index) in c2bDeliveryInfo.recAllFinishOrderQtyProportionList||[]" :key="index" class="popver-box">
                            <div>{{ item.priceRange||'--' }}</div>
                            <div>{{ item.recAllFinishOrderQty||emptyFill }}</div>
                            <div>{{ item.proportion||'--' }}</div>
                          </div>
                        </div>
                        <template v-else>暂无数据</template>
                        <span slot="reference" style="color:#2c64ff;cursor: pointer;">查看</span>
                      </el-popover>
                    </li>
                    <li>
                      C2B总回收数：{{ c2bDeliveryInfo.c2bTotalRecovery| emptyFill }}
                    </li>
                    <li>
                      C2B上门总回收数：{{ c2bDeliveryInfo.recSmhsFinishOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B邮寄总回收数：{{ c2bDeliveryInfo.recC2bFinishOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B手机回收数：{{ c2bDeliveryInfo.c2bPhoneTotalRecovery| emptyFill }}
                    </li>
                    <li>
                      C2B笔记本回收数：{{ c2bDeliveryInfo.recBookReceiveOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B平板回收数：{{ c2bDeliveryInfo.recPadReceiveOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B新3C回收数：{{ c2bDeliveryInfo.recNew3cReceiveOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B多品类回收数：{{ c2bDeliveryInfo.recExt3cReceiveOrderQty| emptyFill }}
                    </li>
                    <li>
                      C2B总GMV：{{ c2bDeliveryInfo.c2bTotalGmv| emptyFill }}
                    </li>
                    <li>
                      C2B上门总GMV：{{ c2bDeliveryInfo.recSmhsFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B邮寄总GMV：{{ c2bDeliveryInfo.recC2bFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B3天总GMV：{{ c2bDeliveryInfo.c2bTotalGmvFront3Day| emptyFill }}
                    </li>
                    <li>
                      C2B7天总GMV：{{ c2bDeliveryInfo.c2bTotalGmvFront7Day| emptyFill }}
                    </li>
                    <li>
                      C2B14天总GMV：{{ c2bDeliveryInfo.c2bTotalGmvFront14Day| emptyFill }}
                    </li>
                    <li>
                      C2B手机GMV：{{ c2bDeliveryInfo.c2bPhoneGmv| emptyFill }}
                    </li>
                    <li>
                      C2B笔记本GMV：{{ c2bDeliveryInfo.recBookFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B平板GMV：{{ c2bDeliveryInfo.recPadFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B新3CGMV：{{ c2bDeliveryInfo.recNew3cFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B多品类GMV：{{ c2bDeliveryInfo.recExt3cFinishOrderAmt| emptyFill }}
                    </li>
                    <li>
                      C2B总GMV-ROI：{{ c2bDeliveryInfo.c2bTotalGmvRoi| emptyFill }}
                    </li>
                    <li>
                      C2B上门总GMV-ROI：{{ c2bDeliveryInfo.recSmhsFinishOrderAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B邮寄总GMV-ROI：{{ c2bDeliveryInfo.recC2bFinishOrderAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B手机GMV-ROI：{{ c2bDeliveryInfo.c2bPhoneGmvRoi| emptyFill }}
                    </li>
                    <li>
                      C2B新3CGMV-ROI：{{ c2bDeliveryInfo.recNew3cFinishOrderAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B多品类GMV-ROI：{{ c2bDeliveryInfo.recExt3cFinishOrderAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B总预估利润：{{ c2bDeliveryInfo.c2bRecAllPredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B上门总预估利润：{{ c2bDeliveryInfo.recSmhsPredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B邮寄总预估利润：{{ c2bDeliveryInfo.recC2bPredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B手机预估利润：{{ c2bDeliveryInfo.c2bRecPhonePredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B新3C预估利润：{{ c2bDeliveryInfo.recNew3cPredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B多品类预估利润：{{ c2bDeliveryInfo.recExt3cPredictProfitAmt| emptyFill }}
                    </li>
                    <li>
                      C2B总预估利润ROI：{{ c2bDeliveryInfo.c2bRecAllPredictProfitAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B上门总预估利润ROI：{{ c2bDeliveryInfo.recSmhsPredictProfitAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B邮寄总预估利润ROI：{{ c2bDeliveryInfo.recC2bPredictProfitAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B手机预估利润ROI：{{ c2bDeliveryInfo.c2bRecPhonePredictProfitAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B新3C预估利润ROI：{{ c2bDeliveryInfo.recNew3cPredictProfitAmtRoi| emptyFill }}
                    </li>
                    <li>
                      C2B多品类预估利润ROI：{{ c2bDeliveryInfo.recExt3cPredictProfitAmtRoi| emptyFill }}
                    </li>
                  </ul>
                </div>
              </div>
            </template>
            <template v-else>
              <h3 class="m-t-20 m-b-20" style="font-size: 16px">
                未监测到转化数据。
              </h3>
            </template>
          </template>

          <!-- <template v-else>
            <h3 data-bold class="h3 m-b-10">
              {{ core.title }}（组件点击回传监测）
              <span
                class="video-detail-content__time"
              >最近更新时间：{{ core.updatedTime || '--' }}</span>
            </h3>

            <ul class="flex flex-wrap video-detail-content__list">
              <template v-if="+core.type == 1">
                <template>
                  <li>总下载激活用户数：{{ core.activeUv | emptyFill }}</li>
                  <li>
                    新增激活：{{ core.newActiveUv | toThousands }}
                  </li>

                  <li>新媒体app日活：{{ core.reachUsrUv | emptyFill }}</li>
                  <li>C2B回收日活：{{ core.recPageUv | emptyFill }}</li>

                  <li>C2B回收首页UV：{{ core.recHomePageUv | emptyFill }}</li>
                  <li>
                    C2B估计结果页UV（APP回收）：{{
                      core.recSubmitPageUv | emptyFill
                    }}
                  </li>

                  <li>
                    C2B总订单量(含app+上门+到店)：{{
                      core.recAllSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2B总收件量(含app+上门+到店)：{{
                      core.recAllReceiveOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2B总成交量(含app+上门+到店)：{{
                      core.recAllFinishOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2B总成交额：{{ core.recAllFinishOrderAmt| emptyFill }}
                  </li>
                  <li>
                    B2C商品曝光UV：{{ core.b2cGoodsExhibitUv | emptyFill }}
                  </li>

                  <li>
                    B2C商品详情UV：{{ core.b2cGoodsDetailPageUv | emptyFill }}
                  </li>
                  <li>
                    B2C确认下单页UV：{{ core.b2cSureOrderPageUv | emptyFill }}
                  </li>

                  <li>
                    B2C手机下单订单量：{{
                      core.b2cPhoneSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C手机净支付数量：{{
                      core.b2cPhoneNetPayOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C手机净支付金额：{{ core.b2cPhoneNetPayAmt| emptyFill }}
                  </li>
                  <li>
                    B2C老3C下单订单量：{{
                      core.b2c3cSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C老3C净支付数量：{{
                      core.b2c3cNetPayOrderQty | emptyFill
                    }}
                  </li>
                </template>
              </template>
              <template v-else>
                <template>
                  <li>总下载激活用户数：{{ core.activeUv | emptyFill }}</li>
                  <li>
                    新增激活：{{ core.newActiveUv | toThousands }}
                  </li>

                  <li>新媒体app日活：{{ core.reachUsrUv | emptyFill }}</li>
                  <li>C2B保卖入口UV：{{ core.recEntryPageUv | emptyFill }}</li>

                  <li>
                    C2B估价成功UV：{{ core.recEvaluateSucUv | emptyFill }}
                  </li>
                  <li>C2B提交订单UV：{{ core.recSubmitPageUv | emptyFill }}</li>

                  <li>
                    C2B总订单量(含app+上门+到店)：{{
                      core.recAllSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2B总收件量(含app+上门+到店)：{{
                      core.recAllReceiveOrderQty | emptyFill
                    }}
                  </li>

                  <li>
                    C2B总成交量(含app+上门+到店)：{{
                      core.recAllFinishOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2B总成交额：{{ core.recAllFinishOrderAmt| emptyFill }}
                  </li>
                  <li>
                    B2C商品曝光UV：{{ core.b2cGoodsExhibitUv | emptyFill }}
                  </li>

                  <li>
                    B2C商品详情UV：{{ core.b2cGoodsDetailPageUv | emptyFill }}
                  </li>
                  <li>
                    B2C确认下单页UV：{{ core.b2cSureOrderPageUv | emptyFill }}
                  </li>

                  <li>
                    B2C手机下单订单量：{{
                      core.b2cPhoneSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C手机净支付数量：{{
                      core.b2cPhoneNetPayOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C手机净支付金额：{{ core.b2cPhoneNetPayAmt| emptyFill }}
                  </li>
                  <li>
                    B2C老3C下单订单量：{{
                      core.b2cOld3cSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C老3C净支付数量：{{
                      core.b2cOld3cNetPayOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C扩品类下单订单量：{{
                      core.b2cExt3cSubmitOrderQty | emptyFill
                    }}
                  </li>
                  <li>
                    B2C扩品类净支付数量：{{
                      core.b2cExt3cNetPayOrderQty | emptyFill
                    }}
                  </li>
                  <li>C2C入口UV：{{ core.c2cEntryPageUv | emptyFill }}</li>
                  <li>
                    C2C闲置有效发布商品数：{{
                      core.c2cEffReleaseGoodsQty | emptyFill
                    }}
                  </li>
                  <li>
                    C2C闲置有效发布商品数_手机：{{
                      core.c2cEffReleasePhoneQty | emptyFill
                    }}
                  </li>
                </template>
              </template>
            </ul>
          </template> -->
        </div>
      </template>
      <template v-slot:anchor2>
        <h3 data-bold class="h3 m-b-10">
          观众画像
          <span
            class="video-detail-content__time"
          >最近更新时间：{{ chartsTime || '--' }}</span>
        </h3>
        <template
          v-if="
            ([
              'new_douyin',
              'new_kuaishou',
              'old_douyin',
              'old_kuaishou',
            ].indexOf(model) <= -1 &&
              type !== 'self') ||
              detailType === 'C' ||
              detailType === 'D'
          "
        >
          <h3 class="m-t-20 m-b-20" style="font-size: 16px">暂无数据！</h3>
        </template>
        <template v-else>
          <div class="flex chartsBox">
            <div>
              <Title :title="map.title" class="p-0 m-b-16" />
              <VChart
                :type="map.type"
                :config="map.config || {}"
                :data="map.data"
                :loading="userChartsLoading"
              />
            </div>
            <div>
              <Title
                :title="+platId === 26 ? '地域占比Top10' : '城市占比Top10'"
                class="p-0 m-b-16"
              />
              <div v-if="+platId === 25" class="flex m-b-20">
                <!-- <div v-if="+platId !== 25" class="flex m-b-20"> -->
                <el-radio-group
                  v-model="regionalType"
                  size="small"
                  @change="handleChangeRadio"
                >
                  <el-radio-button label="area">省份</el-radio-button>
                  <el-radio-button label="city">城市</el-radio-button>
                </el-radio-group>
              </div>
              <!-- <div v-if="regionalType === 'area'"> -->
              <VChart
                type="bar"
                :config="cityData.config"
                :data="cityData.data"
                :loading="userChartsLoading"
              />
              <!-- </div> -->
              <!-- <div v-if="regionalType === 'city'">
              <VChart type="bar" :config="cityData.config" :data="cityData.data" />
            </div> -->
            </div>
            <div>
              <Title :title="gender.title" class="p-0 m-b-16" />
              <VChart
                :type="gender.type"
                :config="gender.config || {}"
                :data="gender.data"
                :loading="userChartsLoading"
              />
            </div>
            <div>
              <Title :title="age.title" class="p-0 m-b-16" />
              <VChart
                :type="age.type"
                :config="age.config || {}"
                :data="age.data"
                :loading="userChartsLoading"
              />
            </div>
            <div>
              <Title :title="mobile.title" class="p-0 m-b-16" />
              <VChart
                :type="mobile.type"
                :config="mobile.config || {}"
                :data="mobile.data"
                :loading="userChartsLoading"
              />
            </div>
            <div>
              <Title :title="active.title" class="p-0 m-b-16" />
              <VChart
                :type="active.type"
                :config="active.config || {}"
                :data="active.data"
                :loading="userChartsLoading"
              />
            </div>
          </div>
        </template>
      </template>
    </AnchorLayout>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  computed,
  getCurrentInstance
} from '@vue/composition-api'
import {
  Statistics,
  VideoInfo,
  AccountCard,
  Title,
  VChart,
  IconTip
} from 'components'
import { timestampToTime } from '@/utils'
import AnchorLayout from '@/components/AnchorLayout'
import {
  $getFundOrderBasicData,
  $getFundDouyinBackData,
  $getFundKuaiShouBackData,
  $getFundClickPullData,
  $getFundClickAddData,
  $getLinkData,
  $getLinkDouyinData,
  $getFundDouyinBackCoreData,
  $getFundKuaiShouBackCoreData,
  $getFundDouyinLinkCoreData,
  $getFundKuaiShouLinkCoreData,
  $getSelfOrderBasicData,
  $getSelfDouyinBackData,
  $getSelfKuaiShouBackData,
  $getSelfClickPullData,
  $getSelfClickAddData,
  $getSelfDouyinBackCoreData,
  $getSelfKuaiShouBackCoreData,
  $getFunsPortraitData,
  $getC2BOrderConversionDataVO,
  $getB2COrderConversionDataVO,
  $getB2CSelfOrderConversionDataVO,
  $getC2BSelfOrderConversionDataVO
} from '@/api/putting-manager'

const pieConfig = {
  legend: {
    show: false
  },
  tooltip: {
    show: false
  },
  seriesConfig: {
    type: 'pie',
    label: {
      formatter: '{b}\n {d}%'
    }
  }
}

const barConfig = {
  legend: {
    show: false
  },
  yAxis: {
    // show: true,
    type: 'category',
    axisLabel: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    }
  },
  xAxis: {
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true
    },
    // axisLabel: {
    //   show: false
    // },
    splitLine: {
      show: false
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: '{b}：{c}%'
  },
  seriesConfig: {
    type: 'bar',
    label: {
      show: true,
      position: 'right',
      formatter: '{c}%'
    },
    showBackground: true
  }
}

export default defineComponent({
  components: {
    AnchorLayout,
    Statistics,
    VideoInfo,
    AccountCard,
    Title,
    VChart,
    IconTip
  },
  setup() {
    const { $message, $route } = getCurrentInstance().proxy

    const storage =
      !JSON.parse(localStorage.getItem('detail')) ||
      JSON.parse(localStorage.getItem('detail')) === 'null'
        ? {}
        : JSON.parse(localStorage.getItem('detail'))

    const route = reactive({
      // 类型，新旧抖快，非抖快
      model: $route.query.model,
      // 订单id
      orderId: $route.query.orderId,
      // flowId
      flowId: $route.query.flowId,
      // 组件渠道号
      name: $route.query.name,
      // 基金还是自营
      type: $route.query.type,
      // 区分详情a,b,c
      detailType: $route.query.detailType,
      // 平台id
      platId: $route.query.platId,
      // platOrderId
      thirdId: $route.query.thirdId
    })

    let key = $route.query.orderId

    if ($route.query.type === 'self') {
      key = `self_${$route.query.thirdId}`
    }

    const otherData = reactive({
      platOrderId: (storage[key] || {}).platOrderId,
      platOrderName: (storage[key] || {}).platOrderName,
      platCreatetime: (storage[key] || {}).platCreatetime,
      qsjOrderNumber: (storage[key] || {}).qsjOrderNumber
    })

    const basicDetail = reactive({
      anchor: [
        {
          buttonText: '订单信息'
        },
        {
          buttonText: '转化表现'
        },
        {
          buttonText: '观众画像'
        }
      ],
      basicData: {},
      orderDetailLoading: false,
      summaryItems: [
        {
          key: 'videoCount',
          val: 0,
          text: '标题'
        },
        {
          key: 'flowCount',
          val: 0,
          text: '总流量'
        },
        {
          key: 'deliveryMoney',
          val: 0,
          text: '投放价格'
        },
        {
          key: 'cpm',
          val: 0,
          text: 'CPM',
          tip: 'CPM=投放价格/（流量/1000）'
        },
        {
          key: 'cptClick',
          val: 0,
          text: '组件点击量'
        },
        {
          key: 'allNewActiveUV',
          val: 0,
          text: '新增激活',
          tip: '2022年8月2日快手改为曝光口径'
        },
        {
          key: 'cpa',
          val: 0,
          text: 'CPA',
          tip: 'CPA=投放价格/新增激活'
        }
      ],
      videoList: []
    })

    const coversion = reactive({
      lineConfig: {
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ]
        // grid: {
        //   left: '80px'
        // }
      },
      chartsData: {
        digChart: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        },
        appNewDeviceQty: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        },
        componentClick: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        },
        pullNew: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        },
        playChart: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        },
        clickTrendComponents: {
          cates: [],
          values: [],
          terms: [],
          updatedTime: ''
        }
      },
      core: '',
      coreLoading: false,
      trend: 'playChart',
      trendForMH: 'playChartForFiveMinute',
      chartLoading: false,
      b2cDelivertLoading: false,
      b2cDeliveryInfo: {},
      c2bDelivertLoading: false,
      c2bDeliveryInfo: {}
    })

    const charts = reactive({
      gender: {
        data: {
          terms: [],
          values: [],
          cates: {}
        },
        title: '性别分布占比',
        config: pieConfig,
        type: 'pie',
        key: 0
      },
      age: {
        data: {
          cates: ['年龄分布占比'],
          terms: [],
          values: []
        },
        title: '年龄分布占比',
        config: barConfig,
        type: 'bar',
        key: 1
      },
      mobile: {
        data: {
          cates: ['设备分布'],
          terms: [],
          values: []
        },
        title: '设备分布',
        config: barConfig,
        type: 'bar',
        key: 3
      },
      active: {
        data: {
          terms: [],
          values: [],
          cates: []
        },
        title: '活跃度分布',
        config: pieConfig,
        type: 'pie',
        key: 0
      },
      map: {
        data: {
          cates: [],
          terms: [],
          values: []
        },
        title: '全国省份分布',
        config: {},
        type: 'map',
        key: 2
      },

      area: {
        data: {
          cates: [],
          terms: [],
          values: []
        },
        title: '城市占比Top10',
        config: barConfig,
        type: 'bar',
        key: 9
      },
      city: {
        data: {
          cates: [],
          terms: [],
          values: []
        },
        title: '城市占比Top10',
        config: barConfig,
        type: 'bar',
        key: 8
      },
      chartsTime: '',
      regionalType: 'area',
      userChartsLoading: false,
      changeCount: 0
    })

    const handleChangeRadio = () => {
      charts.changeCount = charts.changeCount + 1
    }

    const getBasicData = async() => {
      basicDetail.orderDetailLoading = true
      if (route.type !== 'self') {
        try {
          const { code, data, message } = await $getFundOrderBasicData({
            orderId: route.orderId
          })
          basicDetail.orderDetailLoading = false

          if (+code === 1) {
            basicDetail.basicData = data.baseDeliveryOrderInfo

            basicDetail.summaryItems.forEach((item) => {
              item.val = data.videoDetailInfoDataBO[item.key]
            })

            basicDetail.videoList = data.videoDetailInfoBO || []
          } else {
            $message.error(message)
          }
        } catch (e) {
          basicDetail.orderDetailLoading = false
          $message.error(e)
        }
      } else {
        try {
          const { code, data, message } = await $getSelfOrderBasicData({
            platId: route.platId,
            thirdOrderId: route.thirdId
          })
          basicDetail.orderDetailLoading = false

          if (+code === 1) {
            basicDetail.basicData = data.baseDeliveryOrderInfo || {}

            basicDetail.summaryItems.forEach((item) => {
              item.val = data.videoDetailInfoDataBO[item.key]
            })

            basicDetail.videoList = data.videoDetailInfoBO || []
          } else {
            $message.error(message)
          }
        } catch (e) {
          basicDetail.orderDetailLoading = false
          $message.error(e)
        }
      }
    }

    const formatDyChartsOprions = (chartsData) => {
      coversion.chartsData.playChart = {
        values:
          !(chartsData.flowIncrs.num || []).length &&
          !(chartsData.flowTotals.num || []).length
            ? []
            : [chartsData.flowIncrs.num, chartsData.flowTotals.num],
        terms: [
          ...new Set([
            ...chartsData.flowTotals.date,
            ...chartsData.flowIncrs.date
          ])
        ],
        cates: ['播放增量', '播放总量'],
        updatedTime: chartsData.flowTotals.updatedTime
      }
      coversion.chartsData.linkChart = {
        values:
          !(chartsData.agreeIncrs.num || []).length &&
          !(chartsData.agreeTotals.num || []).length
            ? []
            : [chartsData.agreeIncrs.num, chartsData.agreeTotals.num],
        terms: [
          ...new Set([
            ...chartsData.agreeTotals.date,
            ...chartsData.agreeIncrs.date
          ])
        ],
        cates: ['点赞增量', '点赞总量'],
        updatedTime: chartsData.agreeTotals.updatedTime
      }

      coversion.chartsData.clickTrendComponents = {
        values:
          !(chartsData.componentClickIncrs.num || []).length &&
          !(chartsData.componentClickTotals.num || []).length
            ? []
            : [
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
        updatedTime: chartsData.componentClickTotals.updatedTime
      }
    }

    const getConversionData = async() => {
      coversion.chartLoading = true

      if (route.type === 'self') {
        try {
          let res = ''
          if (+route.platId === 25) {
            res = await $getSelfDouyinBackData({
              platId: route.platId,
              thirdOrderId: route.thirdId
            })
          } else {
            res = await $getSelfKuaiShouBackData({
              platId: route.platId,
              thirdOrderId: route.thirdId
            })
          }

          if (+res.code === 1) {
            formatDyChartsOprions(res.data)
          } else {
            $message.error(res.message)
          }

          const pullNewRes = await $getSelfClickPullData({
            platId: route.platId,
            thirdOrderId: route.thirdId
          })
          if (+pullNewRes.code === 1) {
            coversion.chartsData.pullNew = {
              values:
                !(
                  pullNewRes.data.activeUvListBO
                    .componentClickPullNewAndPromoteActivitys || []
                ).length &&
                !(
                  pullNewRes.data.dayDistinctHistActiveUvsListBO
                    .componentClickPullNewAndPromoteActivitys || []
                ).length
                  ? []
                  : [
                      pullNewRes.data.activeUvListBO
                        .componentClickPullNewAndPromoteActivitys,
                      pullNewRes.data.dayDistinctHistActiveUvsListBO
                        .componentClickPullNewAndPromoteActivitys
                    ],
              terms: [
                ...new Set([
                  ...pullNewRes.data.activeUvListBO.statDates,
                  ...pullNewRes.data.dayDistinctHistActiveUvsListBO.statDates
                ])
              ],
              cates: ['拉新促活增量', '拉新促活总量'],
              updatedTime: pullNewRes.data.activeUvListBO.updatedTime
            }
          } else {
            $message.error(pullNewRes.message)
          }

          const clickRes = await $getSelfClickAddData({
            platId: route.platId,
            thirdOrderId: route.thirdId
          })
          if (+clickRes.code === 1) {
            coversion.chartsData.componentClick = {
              values:
                !(clickRes.data.newActiveUvListBO.activeUvs || []).length &&
                !(clickRes.data.activeUvListBO.activeUvs || []).length
                  ? []
                  : [
                      clickRes.data.newActiveUvListBO.activeUvs,
                      clickRes.data.activeUvListBO.activeUvs
                    ],
              terms: [
                ...new Set([
                  ...clickRes.data.newActiveUvListBO.statDates,
                  ...clickRes.data.activeUvListBO.statDates
                ])
              ],
              cates: ['新增激活增量', '新增激活总量'],
              updatedTime: clickRes.data.activeUvListBO.updatedTime
              // updatedTime: res.data.activeUvListBO.updatedTime
            }
          } else {
            $message.error(clickRes.message)
          }

          coversion.chartLoading = false
        } catch (e) {
          $message.error(e)
          coversion.chartLoading = false
        }
      } else {
        if (route.model === 'new_douyin' || route.model === 'new_kuaishou') {
          try {
            let res = ''
            if (route.model === 'new_douyin') {
              res = await $getFundDouyinBackData({ orderId: route.orderId })
            } else {
              res = await $getFundKuaiShouBackData({ orderId: route.orderId })
            }
            if (+res.code === 1) {
              formatDyChartsOprions(res.data)
            } else {
              $message.error(res.message)
            }

            const pullNewRes = await $getFundClickPullData({
              orderId: route.orderId
            })
            if (+pullNewRes.code === 1) {
              coversion.chartsData.pullNew = {
                values:
                  !(
                    pullNewRes.data.activeUvListBO
                      .componentClickPullNewAndPromoteActivitys || []
                  ).length &&
                  !(
                    pullNewRes.data.dayDistinctHistActiveUvsListBO
                      .componentClickPullNewAndPromoteActivitys || []
                  ).length
                    ? []
                    : [
                        pullNewRes.data.activeUvListBO
                          .componentClickPullNewAndPromoteActivitys,
                        pullNewRes.data.dayDistinctHistActiveUvsListBO
                          .componentClickPullNewAndPromoteActivitys
                      ],
                //       [
                //   pullNewRes.data.activeUvListBO
                //     .componentClickPullNewAndPromoteActivitys,
                //   pullNewRes.data.dayDistinctHistActiveUvsListBO
                //     .componentClickPullNewAndPromoteActivitys
                // ],
                terms: [
                  ...new Set([
                    ...pullNewRes.data.activeUvListBO.statDates,
                    ...pullNewRes.data.dayDistinctHistActiveUvsListBO.statDates
                  ])
                ],
                cates: ['拉新促活增量', '拉新促活总量'],
                updatedTime: pullNewRes.data.activeUvListBO.updatedTime
              }
            } else {
              $message.error(pullNewRes.message)
            }

            const clickRes = await $getFundClickAddData({
              orderId: route.orderId
            })
            if (+clickRes.code === 1) {
              coversion.chartsData.componentClick = {
                values:
                  !(clickRes.data.newActiveUvListBO.activeUvs || []).length &&
                  !(clickRes.data.activeUvListBO.activeUvs || []).length
                    ? []
                    : [
                        clickRes.data.newActiveUvListBO.activeUvs,
                        clickRes.data.activeUvListBO.activeUvs
                      ],
                terms: [
                  ...new Set([
                    ...clickRes.data.newActiveUvListBO.statDates,
                    ...clickRes.data.activeUvListBO.statDates
                  ])
                ],
                cates: ['新增激活增量', '新增激活总量'],
                updatedTime: clickRes.data.activeUvListBO.updatedTime
                // updatedTime: res.data.activeUvListBO.updatedTime
              }
            } else {
              $message.error(clickRes.message)
            }

            coversion.chartLoading = false
          } catch (e) {
            $message.error(e)
            coversion.chartLoading = false
          }
        } else {
          try {
            let oldDouyinRes = ''

            if (route.model === 'old_douyin') {
              oldDouyinRes = await $getLinkDouyinData({
                flowId: route.flowId
              })
            }

            const res = await $getLinkData({
                flowId: route.flowId,
                androidDeliveryName: route.name
              })

            const { code, data, message } = res

            if (+code === 1) {
              if (route.model === 'old_kuaishou') {
                coversion.chartsData.playChart = {
                  values:
                    !(data.values[4] || []).length &&
                    !(data.values[5] || []).length
                      ? []
                      : [data.values[4], data.values[5]],
                  terms: data.terms[2],
                  cates: ['播放增量', '播放总量'],
                  updatedTime: data.cates[4].updatedTime
                }

                coversion.chartsData.linkChart = {
                  values:
                    !(data.values[0] || []).length &&
                    !(data.values[1] || []).length
                      ? []
                      : [data.values[0], data.values[1]],
                  terms: data.terms[0],
                  cates: ['点赞增量', '点赞总量'],
                  updatedTime: data.cates[0].updatedTime
                }
              } else {
                if (+oldDouyinRes.code === 1) {
                  coversion.chartsData.playChart = {
                    values:
                      !(oldDouyinRes.data.flowIncrs.num || []).length &&
                      !(oldDouyinRes.data.flowTotals.num || []).length
                        ? []
                        : [oldDouyinRes.data.flowIncrs.num, oldDouyinRes.data.flowTotals.num],
                    terms: oldDouyinRes.data.flowIncrs.date,
                    cates: ['播放增量', '播放总量'],
                    updatedTime: oldDouyinRes.data.flowIncrs.updatedTime
                  }

                  coversion.chartsData.linkChart = {
                    values:
                      !(oldDouyinRes.data.agreeIncrs.num || []).length &&
                      !(oldDouyinRes.data.agreeTotals.num || []).length
                        ? []
                        : [oldDouyinRes.data.agreeIncrs.num, oldDouyinRes.data.agreeTotals.num],
                    terms: oldDouyinRes.data.agreeIncrs.date,
                    cates: ['点赞增量', '点赞总量'],
                    updatedTime: oldDouyinRes.data.agreeIncrs.updatedTime
                  }
                } else {
                  $message.error(oldDouyinRes.message)
                }
              }

              if (
                route.model === 'old_douyin' ||
                route.model === 'old_kuaishou'
              ) {
                coversion.chartsData.appNewDeviceQty = {
                  values:
                    !(data.values[2] || []).length &&
                    !(data.values[3] || []).length
                      ? []
                      : [data.values[2], data.values[3]],
                  terms: data.terms[1],
                  cates: ['安卓新增激活增量', '安卓新增激活总量'],
                  updatedTime: data.cates[2].updatedTime
                }
              }
            } else {
              $message.error(message)
            }

            coversion.chartLoading = false
          } catch (e) {
            $message.error(e)
            coversion.chartLoading = false
          }
        }
      }
    }

    const getCoreData = async() => {
      let res = ''
      if (route.type === 'self') {
        try {
          coversion.coreLoading = true

          if (+route.platId === 25) {
            res = await $getSelfDouyinBackCoreData({
              platId: route.platId,
              thirdOrderId: route.thirdId
            })
          } else {
            res = await $getSelfKuaiShouBackCoreData({
              platId: route.platId,
              thirdOrderId: route.thirdId
            })
          }

          const { code, data = {}, message } = res

          if (+code === 1) {
            coversion.core = data || {}
          } else {
            $message.error(message)
          }
          coversion.coreLoading = false
        } catch (e) {
          $message.error(e)
          coversion.coreLoading = false
        }
      } else {
        if (
          ['new_douyin', 'new_kuaishou', 'old_douyin', 'old_kuaishou'].indexOf(
            route.model
          ) <= -1 ||
          route.detailType === 'D'
        ) {
          return
        }
        coversion.coreLoading = true
        try {
          if (route.model === 'new_douyin') {
            res = await $getFundDouyinBackCoreData({ orderId: route.orderId })
          } else if (route.model === 'new_kuaishou') {
            res = await $getFundKuaiShouBackCoreData({ flowId: route.flowId })
          } else if (route.model === 'old_douyin') {
            res = await $getFundDouyinLinkCoreData({
              androidDeliveryName: route.name
            })
          } else if (route.model === 'old_kuaishou') {
            res = await $getFundKuaiShouLinkCoreData({
              androidDeliveryName: route.name
            })
          }

          const { code, data, message } = res

          if (+code === 1) {
            coversion.core = data || {}
          } else {
            $message.error(message)
          }
          coversion.coreLoading = false
        } catch (e) {
          coversion.coreLoading = false
          $message.error(e)
        }
      }
    }

    const getChartsData = async() => {
      if (
        (['new_douyin', 'new_kuaishou', 'old_douyin', 'old_kuaishou'].indexOf(
          route.model
        ) <= -1 &&
          route.type !== 'self') ||
        route.detailType === 'D'
      ) {
        return
      }

      charts.userChartsLoading = true
      try {
        const {
          code,
          data = {},
          message
        } = await $getFunsPortraitData({
          platId: route.platId,
          thirdOrderId: route.thirdId
        })

        if (+code !== 1) {
          $message.error(message)
          charts.userChartsLoading = false
          return
        }
        charts.chartsTime = data.updatedTime

        const genderTerms = []
        const genderValues = []

        for (const k in JSON.parse(data.genderPercentageStr)) {
          genderTerms.push(k === 'male' ? '男性' : k === 'female' ? '女性' : k)
          genderValues.push(JSON.parse(data.genderPercentageStr)[k])
        }
        charts.gender.data.terms = genderTerms
        charts.gender.data.values = genderValues

        const ageTerms = []
        const ageValues = []

        for (const k in JSON.parse(data.agePercentageStr)) {
          ageTerms.push(k)
          ageValues.push(
            (JSON.parse(data.agePercentageStr)[k] * 100).toFixed(2)
          )
        }
        charts.age.data.terms = ageTerms.reverse()
        charts.age.data.values = ageValues.reverse()

        let phoneArr = []

        for (const k in JSON.parse(data.mobilePercentageStr)) {
          phoneArr.push({
            key: k,
            value: (JSON.parse(data.mobilePercentageStr)[k] * 100).toFixed(2)
          })
        }

        phoneArr = phoneArr
          .sort((a, b) => b.value - a.value)
          .splice(0, 10)
          .sort((a, b) => a.value - b.value)

        charts.mobile.data.terms = phoneArr.map((item) => item.key)
        charts.mobile.data.values = phoneArr.map((item) => item.value)

        const activeTerms = []
        const activeValues = []

        for (const k in JSON.parse(data.fanActivePercentageStr)) {
          const item = k.includes('活跃') ? k : `${k}活跃`
          activeTerms.push(item)
          activeValues.push(JSON.parse(data.fanActivePercentageStr)[k])
        }

        charts.active.data.terms = activeTerms
        charts.active.data.values = activeValues

        let areaArr = []
        const mapTerms = []
        const mapValues = []

        for (const k in JSON.parse(data.areaPercentageStr)) {
          areaArr.push({
            key: k,
            value: (JSON.parse(data.areaPercentageStr)[k] * 100).toFixed(2)
          })
          mapTerms.push(k)
          mapValues.push(
            (JSON.parse(data.areaPercentageStr)[k] * 100).toFixed(2)
          )
        }

        areaArr = areaArr
          .sort((a, b) => b.value - a.value)
          .splice(0, 10)
          .sort((a, b) => a.value - b.value)
        charts.area.data.terms = areaArr.map((item) => item.key)
        charts.area.data.values = areaArr.map((item) => item.value)

        charts.map.data.terms = mapTerms
        charts.map.data.values = mapValues

        let cityArr = []

        for (const k in JSON.parse(data.cityPercentageStr)) {
          cityArr.push({
            key: k,
            value: (JSON.parse(data.cityPercentageStr)[k] * 100).toFixed(2)
          })
        }

        cityArr = cityArr
          .sort((a, b) => b.value - a.value)
          .splice(0, 10)
          .sort((a, b) => a.value - b.value)

        charts.city.data.terms = cityArr.map((item) => item.key)
        charts.city.data.values = cityArr.map((item) => item.value)

        charts.userChartsLoading = false
      } catch (e) {
        $message.error(e)
        charts.userChartsLoading = false
      }
    }

    const cityData = computed(() => {
      let data = {}
      if (charts.regionalType === 'area') {
        data = {
          cates: charts.area.data.cates,
          terms: charts.area.data.terms,
          values: charts.area.data.values
        }
      } else {
        data = {
          cates: charts.city.data.cates,
          terms: charts.city.data.terms,
          values: charts.city.data.values
        }
      }
      return {
        type: 'bar',
        config: {
          ...barConfig,
          yAxis: {
            // show: true,
            type: 'category',
            axisLabel: {
              show: !charts.changeCount
                ? false
                : charts.regionalType === 'area'
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          },
          xAxis: {
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisLabel: {
              show: !charts.changeCount ? true : charts.regionalType === 'area'
            },
            // axisLabel: {
            //   show: false
            // },
            splitLine: {
              show: false
            }
          }
        },
        data
        // loading,
      }
    })
    // 投放的B2C和C2B的核心数据
    const getC2BOrderConversionDataVO = () => {
      coversion.c2bDelivertLoading = true
      $getC2BOrderConversionDataVO({ orderId: route.orderId })
        .then((res) => {
          if (res.code === 1) {
            coversion.c2bDeliveryInfo = res.data || {}
            console.info('c2bDeliveryInfo', res.data)
          } else {
            $message.error(res.message)
          }
          coversion.c2bDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          $message.error(err.message)
          coversion.c2bDelivertLoading = false
        })
    }
    const getB2COrderConversionDataVO = () => {
      coversion.b2cDelivertLoading = true
      $getB2COrderConversionDataVO({ orderId: route.orderId })
        .then((res) => {
          if (res.code === 1) {
            coversion.b2cDeliveryInfo = res.data || {}
          } else {
            $message.error(res.message)
          }
          coversion.b2cDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          $message.error(err.message)
          coversion.b2cDelivertLoading = false
        })
    }

    // 自营的B2C和C2B核心数据
    const getB2CSelfOrderConversionDataVO = () => {
      coversion.b2cDelivertLoading = true
      $getB2CSelfOrderConversionDataVO({
        platId: route.platId,
        thirdOrderId: route.thirdId
       })
        .then((res) => {
          if (res.code === 1) {
            coversion.b2cDeliveryInfo = res.data || {}
          } else {
            $message.error(res.message)
          }
          coversion.b2cDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          $message.error(err.message)
          coversion.b2cDelivertLoading = false
        })
    }

    const getC2BSelfOrderConversionDataVO = () => {
      coversion.c2bDelivertLoading = true
      $getC2BSelfOrderConversionDataVO({
        platId: route.platId,
        thirdOrderId: route.thirdId
       })
        .then((res) => {
          if (res.code === 1) {
            coversion.c2bDeliveryInfo = res.data || {}
          } else {
            $message.error(res.message)
          }
          coversion.c2bDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          $message.error(err.message)
          coversion.c2bDelivertLoading = false
        })
    }

    // const dataType = ref(1)
    const handlePoints = (val) => {
      console.log(val)
    }

    onMounted(() => {
      getBasicData()
      getConversionData()
      getCoreData()
      getChartsData()
      if (route.orderId) {
        getC2BOrderConversionDataVO()
        getB2COrderConversionDataVO()
      } else {
        getC2BSelfOrderConversionDataVO()
        getB2CSelfOrderConversionDataVO()
      }
    })

    return {
      ...toRefs(route),
      ...toRefs(basicDetail),
      ...toRefs(coversion),
      ...toRefs(charts),
      // dataType,
      otherData,
      barConfig,
      cityData,
      timestampToTime,
      handleChangeRadio,
      handlePoints
    }
  }
})
</script>

<style lang="scss" scoped>
.video-detail {
  display: flex;
  flex-wrap: wrap;

  &-header {
    padding: 24px;
    border-bottom: none;
    width: 50%;

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
      justify-content: space-between;

      > li {
        // margin-right: 50px;
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
    padding: 00px;
    > h3 {
      font-size: 16px;
      font-weight: 500;
      color: #272727;
      line-height: 24px;
    }
    &__time {
      margin-left: 36px;
      font-size: 14px;
      font-weight: 400;
      color: #595959;
      line-height: 18px;
    }
    &__list {
      > li {
        width: 25%;
        margin-top: 16px;
        font-size: 14px;
        color: #595959;
        line-height: 18px;
      }
    }
  }
  .container {
    > li {
      display: inline-block;
      width: 33.33%;
      margin-top: 16px;
    }
  }
}

.h3 {
  font-size: 16px;
  font-weight: 500;
  color: #272727;
  line-height: 24px;
}

.data-wrap {
  background: rgba(0, 95, 246, 0.05);
  margin-top: 20px;
}

.grey {
  & > li {
    color: #aaa;
    margin: 0;
  }
}

.chartsBox {
  flex-wrap: wrap;

  & > div {
    width: 50%;
    margin-bottom: 20px;
  }
}

.delete {
  background: #888;
}

.iconTip {
  font-size: 16px;
}

.componentIcon {
  width: 12px;
  vertical-align: -2px;
  margin-right: 6px;
}

.updated-time {
  font-size: 12px;
  color: #8c8c8c;
}
.indicators-box{
  .core-title{
    color: #2c64ff;
    text-align: center;
    width: 50px;
    border-bottom:2px solid #2c64ff;
  }
  display: flex;
  justify-content: space-between;
  li{
      display: inline-block;
      width: 33.3%;
      line-height: 32px;
    }
  &-left{
    margin-right: 12px;
    padding: 12px;
    border: 1px solid #aaa;
  }
  &-right{
    padding: 12px;
    margin-left: 12px;
    border: 1px solid #aaa;
  }
}
.popver-box{
  display: flex;
  justify-content: space-between;
  div{
    width: 33.3%;
    text-align: center;
  }
}
</style>
