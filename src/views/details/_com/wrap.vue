<template>
  <div class="detail">
    <div class="detail-left" :class="{ scroll: hasScroll }">
      <slot name="left" />
    </div>
    <div class="detail-right">
      <slot name="right" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hasScroll: Boolean
  }
}
</script>
<style lang="scss" scoped>
  @import "@/assets/var";
  @include themify($themes) {
    .detail {
      min-height: 100%;
      // max-height: 100%;
      display: flex;

        &-left {
          flex-shrink: 0;

          max-width: 320px;
          width: 320px;
          margin-right: 10px;
          box-sizing: border-box;
          &.scroll {
            overflow-y: auto;
            min-height: 100%;
          }
          &::-webkit-scrollbar {
            display: none;
          }
        }
        &-right {
          position: relative;
          // overflow: auto;
          flex: 1;
          min-height: 100%;
          padding: 0 10px;
        }
    }
  }
</style>
