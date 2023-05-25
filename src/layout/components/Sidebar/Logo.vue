<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-22 15:30:32
 * @LastEditTime: 2020-12-24 10:11:01
 * @LastEditors: Linjie
-->
<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="miniLogo" class="sidebar-logo">
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
      </router-link>
    </transition>
  </div>
</template>

<script>
const logo = require('./_src/new-logo.png')
const miniLogo = require('./_src/mini-logo.png')

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    // const logo =
    return {
      logo: logo,
      miniLogo: miniLogo
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.sidebar-logo-container {
  display: flex;
  align-items: center;
  height: 60px;
  background: #26344B;
  color: #fff;
  box-sizing: border-box;
  img {
    display: block;
    margin: 0 auto;
  }
}
</style>
