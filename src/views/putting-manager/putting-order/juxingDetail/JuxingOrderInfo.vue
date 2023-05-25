<template>
  <Wrap class="m-b-12 juxing-info">
    <h3 class="m-b-20">订单信息</h3>
    <el-card class="m-b-20">
      <p>任务：{{ detail.taskName }}</p>
      <div class="juxing-info-ID">
        <span class="m-r-24">任务ID：{{ detail.taskId }}</span>
        <span class="m-r-24">订单ID：{{ detail.orderId }}</span>
        <span class="m-r-24">期望发布时间：{{ detail.hopeReleaseTime }}</span>
        <span class="m-r-24">订单结束时间：{{ detail.orderEndTime }}</span>
      </div>
      <div class="flex talent flex-justify-between m-t-24">
        <div class="flex flex-justify-between">
          <img class="juxing-info-photo" :src="detail.headUrl">
          <div>
            <p>{{ detail.userName }}</p>
            <p class="talent-title">达人ID：{{ detail.userId }}</p>
            <p>
              <span class="talent-title">联系方式：{{ detail.starPhone }}</span>
              <!-- <span>在线联系达人</span> -->
            </p>
          </div>
        </div>
        <div class="flex">
          <div class="info-item-money">
            <div>
              {{
                detail.totalOrderPrice === 0 || detail.totalOrderPrice
                  ? detail.totalOrderPrice
                  : '-'
              }}
            </div>
            <div class="money-name">订单总金额(元)</div>
          </div>
          <div class="info-item-money">
            <div>
              {{
                detail.oldOrderPrice === 0 || detail.oldOrderPrice
                  ? detail.oldOrderPrice
                  : '-'
              }}
            </div>
            <div class="money-name">订单冻结金额(元)</div>
          </div>
          <div class="m-l-16">
            <div>
              {{
                detail.consumptionOrderAmount === 0 ||
                  detail.consumptionOrderAmount
                  ? detail.consumptionOrderAmount
                  : '-'
              }}
            </div>
            <div class="money-name">订单消耗金额(元)</div>
          </div>
        </div>
      </div>
    </el-card>
    <div class="juxing-info-box">
      <h4 class="m-b-20">视频要求</h4>
      <el-form label-width="120px" label-position="left">
        <el-form-item label="视频要求">
          {{ detail.videoRequest | emptyFill }}
        </el-form-item>
        <el-form-item label="文案上传方式">
          {{ detail.captionType | emptyFill }}
        </el-form-item>
        <el-form-item v-if="detail.caption" label="文案内容">
          {{ detail.caption }}
        </el-form-item>
        <el-form-item label="投放广告">
          {{ detail.openAdServing | emptyFill }}
        </el-form-item>
      </el-form>
    </div>
    <div class="juxing-info-box">
      <h4 class="m-b-20">效果保障</h4>
      <el-form label-width="120px" label-position="left">
        <el-form-item label="转化组件">
          <span>
            {{
              detail.conversionType
                ? conversionMap.get(detail.conversionType)
                : '--'
            }}
            ｜ {{ detail.conversionDesc }}
          </span>
          <span
            v-if="detail.conversionType"
            class="more-txt"
            @click="handleShowMore"
          >更多
            <i
              :class="`${
                showProductInfo ? 'show' : 'fold'
              } icon-more  iconfont iconyoushuangjiantou`"
            />
          </span>
        </el-form-item>
        <el-form-item v-if="showProductInfo && detail.conversionType">
          <ProductMoreInfo
            :detail="detailInfo"
            :conversion-type="detail.conversionType"
          />
        </el-form-item>
        <el-form-item label="第三方监控">
          {{ detail.thirdMonitor | emptyFill }}
        </el-form-item>
      </el-form>
    </div>
    <div class="juxing-info-box">
      <h4 class="m-b-20">产品信息</h4>
      <el-form label-width="120px" label-position="left">
        <el-form-item label="任务名称">
          {{ detail.taskName | emptyFill }}
        </el-form-item>
        <el-form-item label="产品介绍">
          {{ detail.productDesc | emptyFill }}
        </el-form-item>
        <el-form-item label="所属行业">
          {{ detail.baseIndustryName }}
        </el-form-item>
        <el-form-item label="产品链接">
          {{ detail.productUrl | emptyFill }}
        </el-form-item>
        <el-form-item label="产品图片">
          <template v-if="detail.productImage">
            <img style="width: 140px" :src="detail.productImage" alt="">
          </template>
          <template v-else>--</template>
        </el-form-item>
        <el-form-item label="投放资质">
          {{ detail.deliveryQualification | emptyFill }}
        </el-form-item>
      </el-form>
    </div>
  </Wrap>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import ProductMoreInfo from './ProductMoreInfo.vue'
export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ProductMoreInfo
  },
  setup(props, { emit }) {
    const states = reactive({
      showProductInfo: false,
      detailInfo: {}
    })
    watch(
      () => props.detail,
      (val) => {
        states.detailInfo = val
      }
    )
    const conversionMap = new Map([
      ['1', '应用下载'],
      ['2', '应用下载'],
      ['3', '品牌推广']
    ])
    // const { $message } = getCurrentInstance().proxy
    const handleShowMore = () => {
      states.showProductInfo = !states.showProductInfo
    }
    return {
      handleShowMore,
      ...toRefs(states),
      conversionMap
    }
  }
})
</script>
<style lang="scss" scoped>
.juxing-info {
  &-ID {
    padding-bottom: 16px;
    border-bottom: 1px solid #f3f3f3;
  }
  &-photo {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 16px;
  }
  .talent-title {
    color: #888;
  }
  .info-item-money {
    padding-right: 16px;
    border-right: 1px solid #f3f3f3;
    margin-left: 16px;
  }
  .money-name {
    color: #888;
    margin-top: 16px;
  }
  &-box {
    border-bottom: 1px solid #f3f3f3;
    margin-top: 32px;
    padding-bottom: 24px;
  }
  &-box:last-child {
    border-bottom: none;
  }
  .more-txt {
    color: #2c64ff;
    margin-left: 24px;
    cursor: pointer;
  }
  .icon-more {
    display: inline-block;
    color: #2c64ff;
    font-size: 14px;
  }
  .show {
    rotate: 270deg;
  }
  .fold {
    rotate: 90deg;
  }
}
</style>
