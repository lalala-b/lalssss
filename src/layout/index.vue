<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-09-26 15:17:39
 * @LastEditors: Linjie
-->
<template>
  <el-container :class="classObj" class="app-wrapper">
    <Header class="fixed-header" />
    <el-container class="main-container">
      <Sidebar />
      <AppMain />
      <!-- <el-footer class="footer-container" height="48">{{ copyright }}</el-footer> -->
    </el-container>
    <ChangePas v-if="passwordLimitFlag === 1" />
  </el-container>
  <!-- 组织架构选择弹框 -->
</template>

<script>
import { mapState } from 'vuex'
import { AppMain, Header, Sidebar } from './components'
import ChangePas from '@/layout/_com/ChangePas'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Header,
    Sidebar,
    ChangePas
  },
  data() {
    return {
      copyright: '乾派文化传播有限公司提供技术支持',
      organizeVisible: false,
      hasShowRouter: false,
      hasShowOrganize: false
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      passwordLimitFlag: state => state.user.userInfo.passwordLimitFlag
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/variables.scss";
  @import "~@/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    .main-container {
      padding-top: 64px;
    }

    .footer-container {
        height: 48px;
        color: #c0c4cc;
        line-height: 48px;
        text-align: center;
        vertical-align: middle;
        &::before,
        &::after {
            content: "";
            height: 1px;
            width: 40px;
            font-size: 0;
            margin: 0 10px 4px;
            overflow: hidden;
            position: relative;
            background: #D9D9D9;
            display: inline-block;
        }
    }
  }
</style>
