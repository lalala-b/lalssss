<template>
  <div class="video-card">
    <div class="video-card__head" :style="{ height: headHeight ? headHeight + 'px' : '' }">
      <img :src="data.flowImg" alt="" class="video-card__image">
      <p class="video-card__label">{{ data.flowContent }}</p>
      <div class="video-card__comment">
        <div class="video-card__icon">
          <i class="iconfont icondianzan_fill" />
          <p>{{ data.thumbUpCount | toThousandsW }}</p>
        </div>
        <div class="video-card__icon">
          <i class="iconfont iconpinglun_fill" />
          <p>{{ data.commentCount | toThousandsW }}</p>
        </div>
        <div class="video-card__icon">
          <i class="iconfont iconzhuanfa_fill" />
          <p>{{ data.forwardedCount | toThousandsW }}</p>
        </div>
      </div>
      <div class="video-card__introduce">
        <div style="padding: 16px;">
          <p class="video-card__title">{{ data.titleName }}</p>
          <p class="video-card__date">{{ data.addTime }}</p>
        </div>
      </div>
      <div class="video-card__hoverHead">
        <slot name="hoverHead" />
      </div>
    </div>
    <div class="video-card__account">
      <div class="video-card__avatar">
        <img :src="data.accountImg" alt="">
      </div>
      <div class="video-card__accountInfo">
        <p class="video-card__name">{{ data.accountName }}</p>
        <p class="video-card__dy">抖音号: {{ data.uniqueId || data.eid || data.getDataUrl || '--' }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    headHeight: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-card {
    // width: 248px;
    // display: inline-block;
    border-radius: 8px;
    overflow: hidden;
    line-height: 1.25;
    box-shadow: 0 10px 10px #eee;
    &__head {
      padding-bottom: 130%;
      position: relative;
      overflow: hidden;
      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
        background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, .8) 100%);
      }
      &:hover {
        .video-card__hoverHead {
          opacity: 1;
        }
      }
    }
    &__hoverHead {
      transition: .2s;
      opacity: 0;
      z-index: 5;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
    }
    &__image {
      width: 100%;
      position: absolute;
      top: 0;
      // z-index: 3;
      left: 0;
      // right: 0;
      // height: 320px;
    }
    &__label {
      position: absolute;
      z-index: 3;
      top: 0;
      left: 0;
      background-color: $--color-primary;
      color: #ffffff;
      font-size: 16px;
      padding: 6px 8px;
      border-radius: 8px  2px  8px  2px;
    }
    &__comment {
      position: absolute;
      right: 0;
      top: 50%;
      z-index: 3;
      transform: translateY(-50%);
    }
    &__icon {
      z-index: 3;
      text-align: center;
      margin-bottom: $--font-size-base;
      &:last-child {
        margin-bottom: 0;
      }
      i {
        color: #fff;
        font-size: 21px;
        margin-bottom: 3px;
      }
      p {
        color: #fff;
        font-size: $--font-size-base;
      }
    }
    &__introduce {
      position: absolute;
      z-index: 3;
      bottom: 0;
      left: 0;
      width: 100%;
    }
    &__title {
      font-size: $--font-size-base;
      line-height: 20px;
      color: #fff;
      opacity: .9;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    &__date {
      font-size: $--font-size-medium;
      line-height: 16px;
      opacity: .65;
      color: #fff;
    }
    &__account {
      background-color: #fff;
      padding: $--font-size-medium;
      display: flex;
    }
    &__avatar {
      width: 36px;
      margin-right: 8px;
      img {
        max-width: 100%;
        border-radius: 50%;
      }
    }
    &__accountInfo {
      flex: 1;
    }
    &__name {
      font-size: $--font-size-base;
      color: $--color-text-primary;
      line-height: 20px;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
    }
    &__dy {
      color: $--color-text-secondary;
      font-size: $--font-size-medium;
      line-height: 16px;
    }
  }
</style>
