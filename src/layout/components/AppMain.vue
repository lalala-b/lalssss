<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-09-23 10:19:43
 * @LastEditors: Luoxd
-->
<template>
  <el-main id="appMain" class="app-main">
    <transition name="fade-transform" mode="out-in">
      <!-- <keep-alive> -->
      <router-view :key="key" />
    <!-- </keep-alive> -->
    </transition>
  </el-main>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-main {
    position: relative;
    padding: 24px 20px 20px;
    width: 100%;
    // min-width: 1314px;
    min-width: 1224px;
    overflow: hidden auto;
    background: #f5f5f5;
  }
</style>
