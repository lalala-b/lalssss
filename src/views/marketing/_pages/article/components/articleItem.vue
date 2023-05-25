<template functional>
  <div class="article-item">
    <div class="article-item__image">
      <a :href="props.data.url" target="_blank">
        <img :src="props.data.image" alt="">
      </a>
    </div>
    <div class="article-item__info">
      <div class="article-item__title">
        <span class="article-item__label">{{ props.data.label }}</span>
        <el-link
          v-if="props.data.url"
          type="primary"
          data-burry_btn_name="content"
          :data-burry_title="props.data.title"
          :underline="false"
          :href="props.data.url"
          target="_blank"
        >{{ props.data.title }}</el-link>
        <span v-else class="article-item__name">{{ props.data.title }}</span>
      </div>
      <!-- <div class="article-item__text">
        苹果 iOS 14.5 更新将支持 Apple Watch 苹果 iOS 14.5 更新将支持 Apple Watch
        苹果 iOS 14.5 更新将支持 Apple Watch 苹果 iOS 14.5 更新将支持 Apple Watch
      </div> -->
    </div>
    <div class="article-item__date">发布时间：{{ props.data.pushedTime }}</div>
  </div>
</template>
<style lang="scss" scoped>
  .article-item {
    display: flex;
    padding: 16px;
    border-bottom: 1px solid $--border-color-lighter;
    &__image {
      width: 103px;
      height: 62px;
      margin-right: 12px;
      overflow: hidden;
      img {
        max-width: 100%;
      }
    }
    &__info {
      flex: 1;
    }
    &__title {
      display: inline-flex;
      align-items: center;
    }
    &__label {
      text-align: center;
      height: 22px;
      padding: 0 8px;
      background-color: rgba(0, 0, 0, .04);
      color: rgba(0, 0, 0, .65);
      border-radius: $--button-border-radius;
      border: 1px solid rgba(0, 0, 0, .15);
      display: inline-block;
      margin-right: 5px;
    }
    &__name {
      font-size: $--font-size-extra-medium;
      color: rgba(0, 0, 0, .85);
      // margin-bottom: 3px;
    }
    &__text {
      font-size: $--font-size-small;
      color: $--color-text-placeholder;
    }
    &__date {
      width: 205px;
      color: $--color-text-placeholder;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
