<template functional>
  <div class="video-text">
    <div class="video-text__image">
      <img :src="props.data.videoCoverUrl" alt="">
    </div>
    <div class="video-text__info">
      <p class="video-text__title">{{ props.data.titleName }}</p>
      <p class="video-text__date">{{ props.data.addTime }}</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  .video-text {
    display: flex;
    line-height: 1.2;
    &:hover {
      &__title {
        color: $--color-primary;
      }
    }
    &__image {
      width: 48px;
      height: 62px;
      margin-right: 8px;
      // overflow: hidden;
      img {
        max-width: 100%;
      }
    }
    &__info {
      flex: 1;
      overflow: hidden;
    }
    &__title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: $--font-size-base;
    }
    &__date {
      font-size: 12px;
      color: $--color-text-secondary;
      margin-top: 5px;
    }
  }
</style>
