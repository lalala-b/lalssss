<template>
  <div v-loading="loading" class="C-putting-order-data">
    <!-- <div v-loading="loading" class="data-num-view">
      <ul>
        <li v-for="item in data" :key="item.key">
          <span>{{ item.text }}</span>
          <strong>{{ (item.value || 0) | toThousandFilter }}</strong>
        </li>
      </ul>
    </div> -->
    <div class="data-cols">
      <div v-for="(item, index) in cols" :key="index" class="cols-item">{{ item }}</div>
    </div>
    <div class="data-list">
      <div class="data-item">
        <div class="item-key" data-bold>订单数量</div>
        <div class="item-values">
          <span data-num>{{ (data[0].totalOrderNum || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[0].waitOrderReviewerNum || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[0].waitVideoSubmitNum || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[0].finishVideoSubmitNum || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[0].orderCancelNum || 0) | toThousandsW }}</span>
        </div>
      </div>
      <div class="data-item">
        <div class="item-key" data-bold>平台消耗金额</div>
        <div class="item-values">
          <span data-num>{{ (data[1].totalOrderAmount || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[1].waitOrderReviewerAmount || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[1].waitVideoSubmitAmount || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[1].finishVideoSubmitAmount || 0) | toThousandsW }}</span>
          <span data-num>{{ (data[1].orderCancelAmount || 0) | toThousandsW }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    },
    cols: {
      type: Array,
      default() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-data {
    padding: 16px 0;
    background: rgba(0, 95, 246, 0.05);
    border-radius: 8px;
    .data-cols {
      margin-left: 120px;
      display: flex;
      .cols-item {
        line-height: 22px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        flex: 1;
        text-align: center;
      }
    }
    .data-list {
      margin-top: 16px;
      .data-item {
        display: flex;
        margin-top: 4px;
        .item-key {
          width: 120px;
          font-size: 16px;
          text-align: right;
          color: rgba(0, 0, 0, 0.85);
          line-height: 22px;
        }
        .item-values {
          flex: 1;
          display: flex;
          span {
            flex: 1;
            text-align: center;
            font-size: 30px;
            color: $--color-primary;
            line-height: 32px;
          }
        }
      }
    }
  }
</style>
