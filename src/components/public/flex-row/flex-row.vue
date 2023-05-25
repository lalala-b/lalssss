<!--
 * @Author: Luoxd
 * @Description: 
 * @Date: 2019-06-13 09:44:36
 * @LastEditTime: 2020-09-17 18:26:40
 * @LastEditors: Luoxd
 -->
<template>
  <div class="flex-row" :class="{ 'no-bottom': noBottom, [className]: true }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {
    noBottom: {
      type: Boolean,
      default: false
    },
    className: {
      type: String,
      default: ''
    }
  },
}
</script>
<style lang="scss" scoped>
  .flex-row { display: flex;
    > * { margin-right: 10px;margin-bottom: 10px;
      &:last-child { margin-right: 0; }
    }
    &.no-bottom {
      > * {
        margin-bottom: 0;
      }
    }
  }
</style>
