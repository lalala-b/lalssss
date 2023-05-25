<template>
  <div class="video-item">
    <a :href="item.url" target="_blank">
      <img class="video-item-img" :src="item.videoCoverUrl" alt="">
    </a>
    <div class="flex flex-justify-between flex-dir-col flex1">
      <a class="video-item-title" :href="item.url" target="_blank">{{ item.titleName }}</a>
      <div class="flex flex-justify-between video-item-center">
        <div class="video-item-time">{{ item.addTime }}</div>
        <div class="video-item-digg">
          <i class="iconfont iconbofang_fill1" />
          <span>{{ item.flowCount | toFloorThousandsW }}</span>
        </div>
      </div>
      <div class="flex flex-justify-between" @click="handleClick(item)">
        <div class="video-item-user flex flex-align-center">
          <img :src="item.accountImg" alt="">
          <span class="text-over-hidden-1 flex1">{{ item.accountName }}</span>
        </div>
        <img class="video-item-ranking" :src="item.rankImg">
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  methods: {
    handleClick(item) {
      const { accountId, platId } = item
      if (!accountId || !platId) return
      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          _blank: true
        }
      })
    }
  }
})
</script>
<style lang="scss" scoped>
.video {
  &-item {
    display: flex;
    height: 106px;
    &-img {
      flex-shrink: 0;
      width: 78px;
      height: 106px;
      margin-right: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    &-title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      font-size: $--font-size-base;
      font-weight: bold;
      height: 33px;
      line-height: 16px;
      color:#333333;
      &:hover {
        color: $--color-primary;
      }
    }
    &-time {
      color: #AFAFAF;
      font-size: $--font-size-base;
    }
    &-user {
      color: #AFAFAF;
      font-size: 12px;
      cursor: pointer;
      &:hover {
        color: $--color-primary;
      }
      img {
        width: 26px;
        height: 26px;
        border-radius: 50%;
        border: 1px solid #f0f0f0;
        margin-right: 4px;
      }
    }
    &-digg {
      i {
        margin-right: 4px;
        font-size: $--font-size-base;
        color: #AFAFAF;
      }
      span {
        font-size: $--font-size-base;
        color: #AFAFAF;
      }
    }
    &-center{
      margin-bottom: 14px;
      margin-top: 10px;
    }
    &-ranking{
      width: 29px;
      height: 29px;
    }
  }
}
</style>
