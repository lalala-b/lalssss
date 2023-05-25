<template>
  <div
    :class="[className, 'detail-card', { 'detail-card__shadow': hasShadow }]"
  >
    <template v-if="loading">
      <div class="detail-card__loading">加载中<i class="icon el-icon-loading" /></div>
    </template>
    <slot v-else />
  </div>
</template>
<script>
export default {
  name: 'Card',
  props: {
    className: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: ''
    },
    hasShadow: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped lang="scss">
  @include themify($themes) {
    .detail-card {
      position: relative;
      width: 100%;
      padding: 15px;
      background: themed('card_bg');
      border-radius: $card_radius;
      color: themed('font_color');
      &__shadow {
        box-shadow: themed('card_shadow');
      }
      &__loading {
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: 16px;
        color: rgb(64, 158, 255);
        transform: translate(-50%, -50%);
      }
    }
  }
</style>
