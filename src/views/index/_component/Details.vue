<template>
  <Wrap class="summary">
    <!-- <div class="summary__logo">
      <img :src="summary.img">
    </div> -->
    <div v-for="(dat, i) in summary.items" :key="i" class="summary-info" :data-c="i">
      <p>{{ dat.text }}</p>
      <strong data-num>{{ dat.all | toThousandFilter }}</strong>
      <div v-if="roleRang !== 1" class="summary-info-plat" data-num>
        <span><i class="iconfont icondouyin_fill" />{{ dat.tiktok | toThousandFilter }}</span>
        <span><i class="iconfont iconziyuan1" />{{ dat.kuai | toThousandFilter }}</span>
      </div>
    </div>
  </Wrap>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    summary: {
      type: Object,
      default() {
        return {}
      }
    },
    roleRang: {
      type: Number,
      default: 0
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  }
}
</script>
<style lang="scss" scoped>
  .summary {
    display: flex;
    height: 162px;
    padding-left: 0;
    padding-right: 0;
    &-info {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      &::after {
        content: "";
        position: absolute;
        right: 0;
        top: 50%;
        width: 1px;
        height: 71px;
        background: #CCCCCC;
        transform: translateY(-50%);
      }
      &:last-child::after {
        display: none;
      }
      > p {
        font-size: 18px;
        color: #333;
        font-weight: bold;
        font-family: MicrosoftYaHei, 'PingFangSC-Medium';
      }
      > strong {
      margin-top: 13px;
      line-height: 30px;
      padding: 0 30px;
      border-radius: 15px;
      color: #Fff;
      font-size: 18px;
      font-family: MicrosoftYaHei;
      font-weight: bold;
      background: linear-gradient(-45deg, #669BF1, #8EB4FF);

      }
      &-plat {
        display: flex;
        margin-top: 14px;
        > span {
        display: inline-flex;
        align-items: center;
        font-size: 14px;
        font-weight: bold;
        font-family: MicrosoftYaHei;
        color: #AFAFAF;
        line-height: 16px;
        &:first-child {
          margin-right: 18px;
        }
        i {
          font-size: 16px;
          margin-right: 4px;
          &.icondouyin_fill {
            color: #210D1D;
          }
          &.iconziyuan1 {
            color: #FF4906;
          }
        }
        }
      }
    }
  }
</style>
