<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-09-23 10:19:43
 * @LastEditors: Luoxd
-->
<template>
  <router-view :key="key" />
</template>
<script>
export default {
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>
