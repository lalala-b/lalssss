<template>
  <!-- <el-aside class=""> -->
  <!-- <el-scrollbar class="sidebar-container"> -->
  <el-menu
    ref="menu"
    :default-active="activeMenu"
    :collapse="isCollapse"
    :collapse-transition="false"
    :background-color="variables.menuBg"
    :text-color="variables.menuText"
    :active-text-color="variables.menuActiveText"
    :unique-opened="true"
    :router="true"
    mode="vertical"
    class="slidebar-menu"
  >
    <sidebar-item v-for="route in permissionRoutes" :key="route.componentId" :item="route" :base-path="route.path" />
  </el-menu>
  <!-- </el-scrollbar> -->
  <!-- </el-aside> -->
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'permissionRoutes',
      'sidebar'
    ]),
    activeMenu() {
      const route = this.$route
      console.log(route)
      const { meta, path } = route
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="scss">
  @import '@/styles/variables.scss';
    // .sidebar-container {

    .slidebar-menu {
      flex-shrink: 0;
      overflow-y: auto;
      overflow-x: hidden;
      background-color: $menuBg;
      height: 100%;
      border: 0;
      box-shadow: 3px 0px 8px 0px rgba(0, 21, 41, 0.12);
      &::-webkit-scrollbar {
        display: none;
      }
      &:not(.el-menu--collapse) {
        width: $menuWidth;
        .el-submenu__title .menu-text, .el-submenu__icon-arrow {
          visibility: initial;
        }
      }
      .el-submenu {
        &__title .menu-text, &__icon-arrow {
          visibility: hidden;
        }
        &__title, .el-menu-item {
          width: 100%;
          &:hover {
            background-color: $subMenuHover !important;
          }
        }

        &.is-active > .el-submenu__title {
          color: $menuActiveText!important;
        }
      }
      .el-menu-item {
        background-color: $subMenuBg !important;
        &.is-active {
          position: relative;
          background-color: $subMenuHover !important;
          &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            width: 4px;
            background: #0152D9;
          }
        }
      }
      .sub-el-icon {
        margin-right: 8px;
      }
      .el-scrollbar__bar.is-vertical {
        display: none;
      }

      .el-scrollbar {
        flex-shrink: 0;
        height: 100%;
      }
    }

    // }
</style>
