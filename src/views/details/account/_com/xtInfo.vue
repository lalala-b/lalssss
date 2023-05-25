<template>
  <Wrap class="m-t-16 xt-info" :has-shadow="true">
    <!-- <h3 class="xt-info__title flex flex-justify-between">
      <span data-bold>巨量星图信息</span>
      <el-tooltip class="item" effect="dark" content="数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。" placement="top-start">
        <span class="xt-info__title-tip">数据说明<i class="iconfont iconwenhao" /></span>
      </el-tooltip>
    </h3>
    <ul class="xt-info__data m-t-16 m-b-24">
      <li class="flex flex1 flex-center flex-dir-col">
        <h4>预期播放量</h4>
        <p>{{ xtInfo.expectPlayVolume | toThousandsW }}</p>
      </li>
      <li class="flex flex1 flex-center flex-dir-col">
        <h4>预期CPM</h4>
        <p>{{ xtInfo.expectCpm || '--' }}</p>
      </li>
      <li class="flex flex1 flex-center flex-dir-col">
        <h4>作品互动率</h4>
        <p>{{ xtInfo.workInteractionRate ? (xtInfo.workInteractionRate * 100).toFixed(2) + '%' : '--' }}</p>
      </li>
    </ul> -->
    <h3 class="xt-info__title" data-bold>星图报价</h3>
    <el-table
      v-if="xtInfo.xtPriceList && xtInfo.xtPriceList.length"
      v-scrollbar
      class="xt-info__price"
      :data="xtInfo.xtPriceList"
      :border="true"
    >
      <el-table-column label="视频时长" prop="label" />
      <el-table-column label="视频报价(元)" prop="value" class-name="xt-info__price-num" data-num />
    </el-table>
    <!-- <ul  class="xt-info__price-list">
      <li v-for="item in xtInfo.xtPriceList" :key="item.label" class="flex flex-justify-between flex-align-center">{{ item.label }}<strong>￥{{ item.value }}</strong></li>
    </ul> -->
    <p v-else class="no-data flex flex-center">暂无数据</p>
  </Wrap>
</template>
<script>

export default {
  components: {
  },
  props: {
    xtInfo: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">

  .xt-info {
    &__price {
      margin-top: 8px;

      ::v-deep {
        .el-table__header {
          .cell {
            color: #999999;
          }
        }
        .xt-info__price-num {
          color: #FF4746;
          font-weight: bold;
        }
      }
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
      display: flex;
      flex-wrap: wrap;
      background: #F5F7F8;
      border-radius: 2px;
      li {
        height: 84px;
        text-align: center;
        h4 {
          font-size: 14px;
          line-height: 20px;
          color: #999999;
          margin-bottom: 8px;
        }
        p {
          font-size: 24px;
          line-height: 32px;
          font-weight: bold;
          color: #272727;
        }
      }
    }
  }
  .no-data {
    height: 100px;
  }
</style>
