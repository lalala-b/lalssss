<!--
 * @Author: Luoxd
 * @Description: 
 * @Date: 2019-06-13 09:44:36
 * @LastEditTime: 2020-09-17 18:32:55
 * @LastEditors: Luoxd
 -->
<template>
  <div class="flex-rows">
    <slot></slot>
  </div>
</template>
<script>
export default {
  props: {

  },
}
</script>
<style lang="scss" scoped>
  .flex-rows {
    > * { margin-right: 10px;margin-bottom: 10px;display: inline-block;
      &:last-child { margin-right: 0; }
    }
  }
</style>
