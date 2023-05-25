<template>
  <Wrap class="account-data m-t-16">
    <h3 class="account-data__title flex flex-justify-between">
      <span>账号大盘</span>
    </h3>
    <ul class="account-data__list m-t-24">
      <li class="w-50">
        <h4>粉丝量</h4>
        <p data-num>{{ accountData.fans | toThousandsW }}</p>
      </li>
      <li class="w-50">
        <h4>视频量</h4>
        <p data-num>{{ accountData.videoNum | toThousandsW }}</p>
      </li>
      <li v-if="isInWard">
        <h4>集均播放量</h4>
        <p data-num>{{ accountData.avgPlay | toThousandsW }}</p>
      </li>
      <li :class="{ 'w-50': !isInWard }">
        <h4>集均点赞量</h4>
        <p data-num>{{ accountData.avgLike | toThousandsW }}</p>
      </li>
      <li :class="{ 'w-50': !isInWard }">
        <h4>集均评论量</h4>
        <p data-num>{{ accountData.avgComment | toThousandsW }}</p>
      </li>
    </ul>
  </Wrap>
</template>
<script>

export default {
  props: {
    accountData: {
      type: Object,
      default: () => {}
    },
    accountType: {
      type: [Number, String],
      default: ''
    },
    platIdProp: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isInWard: false
    }
  },
  computed: {
    // isInWard() {
    //   // const accountType = [2, 30]
    //   // return !accountType.includes(Number(this.accountType))
    //   console.log('computed')
    //   return this.platId === 25
    // }
  },
  watch: {
    platIdProp: {
      handler(val) {
        this.platId = val
        if (this.platId === 25) {
          this.isInWard = true
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped lang="scss">
  @include themify($themes) {
    .account-data {
      &__title {
        line-height: 24px;
        font-size: 16px;
        color: #272727;
      }
    &__list {
        display: flex;
        flex-wrap: wrap;
        background: #F5F7F8;
        border-radius: 2px;
        li {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          flex-direction: column;
          padding: 0 16px;
          height: 84px;
          box-sizing: border-box;
          &.w-50 {
            width: 50%;
          }
          width: 33.33%;
          text-align: center;
          h4 {
            font-size: 14px;
            line-height: 20px;
            color: #999999;
          }
          p {
            margin-top: 8px;
            font-size: 24px;
            line-height: 24px;
            font-weight: bold;
            color: #272727;
          }
        }
      }
    }
  }
</style>
