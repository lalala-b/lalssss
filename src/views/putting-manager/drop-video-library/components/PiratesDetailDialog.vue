<template>
  <div>
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
      <div v-if="dialogData.platId === 25 || dialogData.platId === 26" class="flex playTrendWrapForHour">
        <div class="flex1">
          <div>
            <div class="flex flex-justify-between flex-align-center">
              <el-radio-group v-model="trendForMH" class="m-b-16" size="small" @change="handleChangeTrendForMH">
                <!-- link抖音无播放趋势 -->
                <el-radio-button label="playChartForFiveMinute">播放趋势（5分钟）</el-radio-button>
                <el-radio-button label="playChartForHour">播放趋势（分时）</el-radio-button>
              </el-radio-group>

              <div class="datePickerWrap">
                <div class="datePickerItem">
                  <el-date-picker
                    v-model="playTrendStartDate"
                    type="date"
                    size="small"
                    :clearable="false"
                    :editable="false"
                    :picker-options="pickerOptionsForDate"
                    placeholder="选择开始日期"
                    @change="handleChangePlayTrendStartDate"
                  />
                  <el-time-select
                    v-model="playTrendStartTime"
                    size="small"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptionsForTime"
                    placeholder="选择开始时间"
                    @change="handleChangePlayTrendStartTime"
                  />
                </div>
                <div class="separator">至</div>
                <div class="datePickerItem">
                  <el-date-picker
                    v-model="playTrendEndDate"
                    type="date"
                    size="small"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptionsForDate"
                    placeholder="选择结束日期"
                    @change="handleChangePlayTrendEndDate"
                  />
                  <el-time-select
                    v-model="playTrendEndTime"
                    size="small"
                    :editable="false"
                    :clearable="false"
                    :picker-options="pickerOptionsForTime"
                    placeholder="选择结束时间"
                    @change="handleChangePlayTrendEndTime"
                  />
                </div>
              </div>

            </div>
            <div
              v-if="chartsData[trendForMH].updatedTime"
              class="updated-time m-r-24"
            >
              数据更新时间：{{ chartsData[trendForMH].updatedTime }}
            </div>
          </div>
          <VChart
            :data="chartsData[trendForMH]"
            :config="lineConfig"
            :loading="chartForMHLoading"
          />
        </div>
      </div>
    </div>
    <div v-loading="loading" class="video-detail-content">
      <h3 data-bold>
        投放订单信息
        <span
          class="updated-time"
        >最近编辑时间：{{ dialogData.updateTime | emptyFill }}</span>
      </h3>
      <ul class="flex flex-wrap video-detail-content__list">
        <li>广告师：{{ dialogInfoData.advertiserRealname | emptyFill }}</li>
        <li>投放专员：{{ dialogInfoData.deliveryName | emptyFill }}</li>
        <li>编导人员：{{ dialogInfoData.choreographerName | emptyFill }}</li>
        <li>品牌标签：{{ dialogInfoData.videoTag | emptyFill }}</li>
        <li>业务标签：{{ dialogInfoData.businessTag | emptyFill }}</li>
        <li>视频类型：{{ dialogInfoData.junType | emptyFill }}</li>
        <li v-if="dialogInfoData.businessTag === 'B2C'">产品型号：{{ dialogInfoData.b2cPhoneModel || '--' }}</li>
        <li>内容类别：{{ dialogInfoData.contentType | emptyFill }}</li>
        <li>口令：{{ dialogInfoData.orderCommand | emptyFill }}</li>
        <li>组件类型：{{ dialogInfoData.linkUseType | emptyFill }}</li>
        <li>组件渠道号：{{ dialogInfoData.androidDeliveryName | emptyFill }}</li>
        <li>组件标题：
          {{ dialogInfoData.componentTitle | emptyFill }}
          <img v-if="dialogInfoData.componentIcon" class="svgIcon" :src="dialogInfoData.componentIcon">
        </li>
        <li>组件点击量：{{ dialogInfoData.cptClick | toThousands }}</li>
        <li>投放价格：{{ dialogInfoData.deliveryMoney | toThousands }}</li>
        <li>CPM：{{ dialogInfoData.cpm | toThousands }}</li>
        <li>
          CPA：{{ dialogInfoData.cpa | toThousands }}
        </li>
        <li>
          新增促活成本：{{ dialogInfoData.newActivationCosts | toThousands }}
        </li>
        <li>CPC：{{ dialogInfoData.cpc | toThousands }}</li>
        <li>总新增：{{ dialogInfoData.allNewReachUv | toThousands }}</li>
        <li>总促活：{{ dialogInfoData.allRecallReachUv | toThousands }}</li>
        <li>曝光新增：{{ dialogInfoData.showNewReachUv | toThousands }}</li>
        <li>曝光促活：{{ dialogInfoData.showRecallReachUv | toThousands }}</li>
        <li>组件点击新增：{{ dialogInfoData.clickNewReachUv | toThousands }}</li>
        <li>组件促活：{{ dialogInfoData.clickRecallReachUv | toThousands }}</li>

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
                    <el-radio-button label="playChart">播放趋势（分日）</el-radio-button>
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
        <div class="flex flex-align-center">
          <h3 data-bold>
            端内核心指标
          </h3>
          <div v-if="b2cDeliveryInfo.updatedTime" class="m-l-24 updated-time">
            最近更新时间:{{ b2cDeliveryInfo.updatedTime }}
          </div>
        </div>
        <h4 class="core-title">B2C</h4>
        <ul v-loading="b2cDelivertLoading" class="container">
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
        <h4 class="core-title">C2B</h4>
        <ul v-loading="c2bDelivertLoading" class="container">
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
              <template v-if="c2bDeliveryInfo.recAllFinishOrderQtyProportionList&&c2bDeliveryInfo.recAllFinishOrderQtyProportionList.length">
                <div class="popver-box">
                  <div>价格区间</div>
                  <div>回收量</div>
                  <div>占比</div>
                </div>
                <div v-for="(item,index) in c2bDeliveryInfo.recAllFinishOrderQtyProportionList||[]" :key="index" class="popver-box">
                  <div>{{ item.priceRange||'--' }}</div>
                  <div>{{ item.recAllFinishOrderQty | emptyFill }}</div>
                  <div>{{ item.proportion||'--' }}</div>
                </div>
              </template>
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

        <!-- <ul v-loading="delivertLoading" class="container">
            <template
              v-if="
                [25, 26].includes(dialogData.platId) &&
                  ['new_kuaishou', 'new_douyin'].includes(
                    rowInfo.monitoringModeType
                  )
              "
            >
              <li>总下载激活用户数：{{ deliveryInfo.activeUv| emptyFill }}</li>
              <li>
                新增激活：{{ deliveryInfo.newActiveUv | toThousands }}
              </li>

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
              <li>安卓新增激活：{{ deliveryInfo.appNewDeviceQty| emptyFill }}</li>
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
          </ul> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { VideoInfo, AccountCard, Title, VChart } from 'components'

import {
  $getVideoPutting,
  $getOrderVideoData,
  $getOrderVideoConversionData,
  $getTiktokVideoSpreadTrend_Dnew,
  $getTiktokVideoSpreadTrend_Knew,
  $getVideoSpreadTrendForMH
} from '@/api/bussiness-manage'
import {
  $getNewActiveUvData_Dnew,
  $getNewOrderVideoConversionData_Dnew,
  $getSinglePuttingVideoInfoNew,
  $getB2COrderConversionDataVO,
  $getC2BOrderConversionDataVO
} from '@/api/putting-manager'
export default {
  components: {
    VideoInfo,
    AccountCard,
    Title,
    VChart
    // IconTip
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
      dialogInfoData: {},
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
        },
        playChartForFiveMinute: {
          cates: [],
          values: [],
          terms: []
        },
        playChartForHour: {
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
      trendForMH: 'playChartForHour',
      loading: true,
      chartLoading: true,
      chartForMHLoading: true,
      delivertLoading: true,
      deliveryInfo: {},
      clickNewActivationComponent: true,
      playTrendData: false,
       b2cDeliveryInfo: {},
      b2cDelivertLoading: false,
      c2bDeliveryInfo: {},
      c2bDelivertLoading: false,
      playTrendStartDate: new Date(),
      playTrendEndDate: new Date(),
      playTrendStartTime: '00:00',
      playTrendEndTime: '00:00',
      pickerOptionsForDate: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      pickerOptionsForTime: {
        start: '00:00',
        end: '23:59',
        step: '01:00'
      }
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
    const { flowId, androidDeliveryName, orderId, monitoringModeType, videoCreateTime } =
      this.rowInfo
    this.getVideoPutting({ orderId, flowId })
    console.info('-----------------', this.rowInfo)
    this.playTrendStartDate = new Date(videoCreateTime)
    this.playTrendEndDate = new Date(dayjs(videoCreateTime).add(1, 'day'))
    this.pickerOptionsForDate = {
      disabledDate: (time) => {
        // 禁用当前视频发布时间3天后的日期 或 发布时间之前的日期
        return time.getTime() < new Date(videoCreateTime).getTime() - 1 * 24 * 3600 * 1000 ||
          time.getTime() > new Date(videoCreateTime).getTime() + 3 * 24 * 3600 * 1000
      }
    }
    this.getSinglePuttingVideoInfoNew({ orderId, flowId })
    this.getVideoChartForMH({
      flowId,
      publishTime: `${dayjs(videoCreateTime).format('YYYY-MM-DD')} 00:00`,
      endTime: `${dayjs(videoCreateTime).add(1, 'day').format('YYYY-MM-DD')} 00:00` })

    // 抖音新版/老版
    if (this.rowInfo.platId === 25) {
      if (monitoringModeType === 'new_douyin') {
        this.getDyVideoCharts({ flowId })
        // 新增激活
        this.getDyNewActiveUvData({ flowId })
        // 抖音新版 业务详情
        // this.getOrderDyVideoConversionData({ flowId })
      } else {
        this.getDyVideoCharts({ flowId })
        // 抖音 老版 仅获取安卓新增激活
        this.getOrderVideoData({ flowId, androidDeliveryName })
        // 抖音老版 业务详情
        // this.getOrderVideoConversionData({ androidDeliveryName })
      }
    } else if (this.rowInfo.platId === 26) {
      if (monitoringModeType === 'new_kuaishou') {
        this.getKSVideoCharts({ flowId })
        this.getDyNewActiveUvData({ flowId })
        // this.getOrderDyVideoConversionData({ flowId })
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
    if ([25, 26].includes(+this.rowInfo.platId)) {
      // eslint-disable-next-line no-undef
     this.getB2CVideoConversionDataVO({ orderId })
      // eslint-disable-next-line no-undef
      this.getC2BVideoConversionDataVO({ orderId })
    }
  },
  methods: {
    // 获取视频详细信息-投放订单信息
    getSinglePuttingVideoInfoNew({ orderId, flowId }) {
      this.loading = true
      $getSinglePuttingVideoInfoNew({ orderId, flowId })
        .then((res) => {
          if (res.code === 1) {
            this.dialogInfoData = res.data
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
    getB2CVideoConversionDataVO({ orderId }) {
      this.b2cDelivertLoading = true
      $getB2COrderConversionDataVO({ orderId })
        .then((res) => {
          if (res.code === 1) {
            this.b2cDeliveryInfo = res.data || {}
          } else {
            this.$message.error(res.message)
          }
          this.b2cDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.b2cDelivertLoading = false
        })
    },
    getC2BVideoConversionDataVO({ orderId }) {
      this.c2bDelivertLoading = true
      $getC2BOrderConversionDataVO({ orderId })
        .then((res) => {
          if (res.code === 1) {
            this.c2bDeliveryInfo = res.data || {}
          } else {
            this.$message.error(res.message)
          }
          this.c2bDelivertLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.c2bDelivertLoading = false
        })
    },
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

    // 获取数据表现中播放趋势（5分钟/分时）的数据（抖音/快手）
    getVideoChartForMH({ flowId, publishTime, endTime }) {
      this.chartForMHLoading = true
      // 抖音/快手新版 数据表现(5分钟/分时)
      $getVideoSpreadTrendForMH({ flowId, publishTime, endTime })
        .then((res) => {
          if (res.code === 1) {
            if (res.data) {
              this.formatDyChartsForMHOprions(res.data)
            }
          } else {
            this.$message.error(res.message || '出错了～')
          }
          this.chartForMHLoading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) return
          this.$message.error(err.message)
          this.chartForMHLoading = false
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
    // 格式化播放趋势为5分钟/分时的图表数据
    formatDyChartsForMHOprions(chartsData) {
      // console.info(chartsData, 'chartsData-----')
      // 发布时间后3天最后一天的可选择时间
      const { videoCreateTime } = this.rowInfo
      const lastSelectTime = new Date(videoCreateTime).getTime() + 3 * 24 * 3600 * 1000
      this.chartsData.playChartForFiveMinute = {
        values: [chartsData.per5min.incrs.num, chartsData.per5min.totals.num],
        terms: [
          ...new Set([
            ...chartsData.per5min.totals.date.map(item => item.slice(5)),
            ...chartsData.per5min.incrs.date.map(item => item.slice(5))
          ])
        ],
        cates: ['播放增量', '播放总量'],
        updatedTime: new Date().getTime() > lastSelectTime
          ? `${new Date(lastSelectTime).toLocaleString().replaceAll('/', '-').split(' ')[0]} 23:59`
          : new Date().toLocaleString().replaceAll('/', '-')
      }

      this.chartsData.playChartForHour = {
        values: [chartsData.per1hour.incrs.num, chartsData.per1hour.totals.num],
        terms: [
          ...new Set([
            ...chartsData.per1hour.totals.date.map(item => item.slice(5)),
            ...chartsData.per1hour.incrs.date.map(item => item.slice(5))
          ])
        ],
        cates: ['播放增量', '播放总量'],
        updatedTime: new Date().getTime() > lastSelectTime
          ? `${new Date(lastSelectTime).toLocaleString().replaceAll('/', '-').split(' ')[0]} 23:59`
          : new Date().toLocaleString().replaceAll('/', '-')
      }
    },
    // 更改播放趋势的类型
    handleChangeTrendForMH(val) {
      if (val === 'playChartForFiveMinute') {
        this.pickerOptionsForTime = {
          ...this.pickerOptionsForTime,
          step: '00:05'
        }
      } else {
        this.pickerOptionsForTime = {
          ...this.pickerOptionsForTime,
          step: '01:00'
        }
      }
    },
    // 更改播放趋势的数据显示开始日期
    handleChangePlayTrendStartDate(time) {
      const { flowId, videoCreateTime } = this.rowInfo
      // 最后一天可选时间
      const lastSelectTime = new Date(videoCreateTime).getTime() + 3 * 24 * 3600 * 1000
      // 下一天的时间
      const nextSelectTime = new Date(time).getTime() + 1 * 24 * 3600 * 1000
      // 结束的时间
      const endSelectTime = new Date(this.playTrendEndDate).getTime()
      // 选择的时间
      const selectTime = new Date(time).getTime()
      this.playTrendStartDate = time
      if (endSelectTime === selectTime || selectTime < endSelectTime) { // 结束时间等于选择的开始时间 或 选择的开始时间小于结束时间，结束时间不变
        this.playTrendEndDate = new Date(endSelectTime)

        // 若选择的时间等于最后一天可选时间，结束时间为最后一天可选择时间的第二天0点
        if (dayjs(selectTime).format('YYYY-MM-DD') === dayjs(lastSelectTime).format('YYYY-MM-DD')) {
          this.playTrendEndDate = new Date(dayjs(lastSelectTime).add(1, 'day'))
          this.playTrendEndTime = '00:00'
        }
      } else {
        if (nextSelectTime > lastSelectTime) { // 选择的开始时间的下一天时间大于最后一天可选择的时间，结束时间为最后一天可选择时间的第二天0点
          this.playTrendEndDate = new Date(dayjs(lastSelectTime).add(1, 'day'))
          this.playTrendEndTime = '00:00'
        } else { // 否则，结束时间为选择的开始时间的下一天时间
          this.playTrendEndDate = new Date(nextSelectTime)
        }
      }
      this.getVideoChartForMH({ flowId, publishTime: `${dayjs(time).format('YYYY-MM-DD')} ${this.playTrendStartTime}`, endTime: `${dayjs(this.playTrendEndDate).format('YYYY-MM-DD')} ${this.playTrendEndTime}` })
    },
    // 更改播放趋势的数据显示结束日期
    handleChangePlayTrendEndDate(time) {
      const { flowId, videoCreateTime } = this.rowInfo
       // 第一天可选时间
      const firstSelectTime = new Date(videoCreateTime).getTime()
      // 上一天的时间
      const perSelectTime = new Date(time).getTime() - 1 * 24 * 3600 * 1000
      // 开始的时间
      const startSelectTime = new Date(this.playTrendStartDate).getTime()
      // 选择的时间
      const selectTime = new Date(time).getTime()
      this.playTrendEndDate = time
      if (startSelectTime === selectTime || selectTime > startSelectTime) { // 开始时间等于选择的结束时间 或 选择的结束时间大于开始时间，开始时间不变
        this.playTrendStartDate = new Date(startSelectTime)
      } else {
        if (perSelectTime < firstSelectTime) { // 选择的结束时间的前一天时间小于第一天可选择的时间，开始时间为第一天可选择的时间
          this.playTrendStartDate = new Date(firstSelectTime)
        } else { // 否则，开始时间为选择的结束时间的前一天时间
          this.playTrendStartDate = new Date(perSelectTime)
        }
      }
      this.getVideoChartForMH({ flowId, publishTime: `${dayjs(this.playTrendStartDate).format('YYYY-MM-DD')} ${this.playTrendStartTime}`, endTime: `${dayjs(time).format('YYYY-MM-DD')} ${this.playTrendEndTime}` })
    },
    // 更改播放趋势的数据显示开始时间
    handleChangePlayTrendStartTime(time) {
      const { flowId } = this.rowInfo
      this.playTrendStartTime = time
      this.getVideoChartForMH({ flowId, publishTime: `${dayjs(this.playTrendStartDate).format('YYYY-MM-DD')} ${time}`, endTime: `${dayjs(this.playTrendEndDate).format('YYYY-MM-DD')} ${this.playTrendEndTime}` })
    },
    // 更改播放趋势的数据显示结束时间
    handleChangePlayTrendEndTime(time) {
      const { flowId } = this.rowInfo
      this.playTrendEndTime = time
      this.getVideoChartForMH({ flowId, publishTime: `${dayjs(this.playTrendStartDate).format('YYYY-MM-DD')} ${this.playTrendStartTime}`, endTime: `${dayjs(this.playTrendEndDate).format('YYYY-MM-DD')} ${time}` })
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
.core-title{
  margin-top: 12px;
  color: #2c64ff;
  text-align: center;
  width: 50px;
  border-bottom:2px solid #2c64ff;
}
.popver-box{
  width: 390px;
  display: flex;
  justify-content: space-between;
  div{
    width: 33.3%;
    text-align: center;
  }
}

.playTrendWrapForHour {
  margin-top: 30px;

  .el-radio-group {
    flex: 3;
  }

  .datePickerWrap {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .datePickerItem {
      display: flex;
    }

    .separator {
      margin: 0 6px;
    }

    .el-date-editor.el-input {
      width: 144px;

      &:last-child {
        width: 96px;
      }
    }
  }
}
</style>
