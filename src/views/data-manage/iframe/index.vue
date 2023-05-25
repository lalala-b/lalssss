<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-10 18:24:26
 * @LastEditTime: 2020-12-18 14:16:56
 * @LastEditors: Linjie
-->
<template>
  <div class="iframe-wrap" style="height: 100%;">
    <iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" :src="url" />
  </div>
</template>

<script>
export default {
  data() {
    const url = this.$route.meta.url || ''
    return {
      url
    }
  }
}
</script>
<style lang="scss" scoped>
  .iframe-wrap {
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
</style>
