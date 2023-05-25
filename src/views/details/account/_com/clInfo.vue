<template>
  <Wrap class="m-t-16 xt-info" :has-shadow="true">
    <!-- <h3 class="xt-info__title flex flex-justify-between">
      <span data-bold>磁力聚星信息</span>
      <el-tooltip class="item" effect="dark" content="数据来源为磁力聚星，通常每周更新一次，可能存在一定延迟偏差，仅供参考，最新数据以磁力聚星平台的为准。" placement="top-start">
        <span class="xt-info__title-tip">数据说明<i class="iconfont iconwenhao" /></span>
      </el-tooltip>
    </h3>
    <div class="xt-info__data m-t-16 m-b-24">
      <ul>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.expectExposureNum | toThousandsW }}</p>
          <h4>预期曝光量</h4>
        </li>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.expectPlayVolume | toThousandsW }}</p>
          <h4>预期播放量</h4>
        </li>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.expectCpm || '--' }}</p>
          <h4>预期CPM</h4>
        </li>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.avgWorksWeek || '--' }}</p>
          <h4>周均发布作品数</h4>
        </li>
      </ul>
      <h3>商业数据</h3>
      <ul>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.receiveOrderRate ? Number((info.receiveOrderRate * 100).toFixed(2)) + '%' : '--' }}</p>
          <h4 class="flex flex-align-center">达人接单率 <el-tag v-if="info.receiveOrderRateDesc" class="m-l-5" type="info" size="mini">{{ info.receiveOrderRateDesc }}</el-tag></h4>
        </li>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.completeOrderRate ? Number((info.completeOrderRate * 100).toFixed(2)) + '%' : '--' }}</p>
          <h4 class="flex flex-align-center">达人完单率 <el-tag v-if="info.completeOrderRateDesc" class="m-l-5" type="info" size="mini">{{ info.completeOrderRateDesc }}</el-tag></h4>
        </li>
        <li class="flex flex1 flex-center flex-dir-col">
          <p>{{ info.completeOrderNum || '--' }}</p>
          <h4>达人完单数</h4>
        </li>
      </ul>
    </div> -->
    <h3 class="xt-info__title" data-bold>历史合作行业</h3>
    <div v-if="info.historyIndustryCategoryTag" class="m-t-5">
      <el-tag v-for="item in info.historyIndustryCategoryTag.split(',')" :key="item" class="m-b-5 m-r-5" size="mini" type="info">{{ item }}</el-tag>
    </div>
    <p v-else class="no-data flex flex-center">暂无数据</p>
    <div class="flex flex-justify-between m-t-16">
      <h3 class="xt-info__title" data-bold>快接单报价</h3>
      <strong class="xt-info__price-num">¥{{ info.kuaishouPrice | toThousands }}</strong>
    </div>

    <!-- <ul  class="xt-info__price-list">
      <li v-for="item in info.xtPriceList" :key="item.label" class="flex flex-justify-between flex-align-center">{{ item.label }}<strong>￥{{ item.value }}</strong></li>
    </ul> -->
    <!-- <p class="no-data flex flex-center">暂无数据</p> -->
  </Wrap>
</template>
<script>

export default {
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">

  .xt-info {
    &__price-num {
      font-size: 16px;
      color: #FF4746;
      font-weight: bold;
    }
    &__title {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      color: #272727;
      &-tip {
        margin-right: 4px;
        font-weight: 400;
        cursor: pointer;
      }
    }
    &__data {
      // padding: 0 4px;
      background: #F5F7F8;
      border-radius: 2px;
      > ul {
        display: flex;
        flex-wrap: wrap;
      }
      li {
        height: 84px;
        text-align: center;
        h4 {
          font-size: 12px;
          line-height: 20px;
          color: #999999;
          // margin-bottom: 8px;
        }
        p {
          font-size: 18px;
          line-height: 32px;
          font-weight: bold;
          color: #272727;
        }
      }
      h3 {
        padding-left: 10px;
      }
    }
  }
  .no-data {
    height: 30px;
  }
</style>
