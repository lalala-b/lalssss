<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 13:43:02
 * @LastEditTime: 2020-12-14 17:10:49
 * @LastEditors: Linjie
-->
<template>
  <div class="P-advertising">
    <div class="P-advertisingTab">
      <el-tabs v-model="activeName" @tab-click="handleAct">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
          <keep-alive>
            <component :is="`v-${activeName}`" v-if="activeName === item.name" />
          </keep-alive>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import Adlib from './_pages/adlib'
import Launch from './_pages/launch'
import MediumAccount from './_pages/medium-account'
import MediumRecommend from './_pages/medium-recommend'
import MediumVideo from './_pages/medium-video'
import LaunchOrders from './_pages/lanuch-orders'
import MediumOrgManage from './_pages/medium-org-manage'

export default {
  components: {
    'vAdlib': Adlib,
    'vLaunch': Launch,
    'VMediumAccount': MediumAccount,
    'VMediumVideo': MediumVideo,
    'VLaunchOrders': LaunchOrders,
    'VMediumOrgManage': MediumOrgManage,
    'VMediumRecommend': MediumRecommend
  },
  data() {
    return {
      activeName: null,
      tabs: []
    }
  },
  created() {
    const tabs = [
      {
        title: '广告库',
        name: 'adlib',
        permissionName: 'adlib'
      },
      // {
      //   title: '推荐投放账号',
      //   name: 'account-recommend',
      //   permissionName: 'bussiness_account_recommend'
      // },
      // {
      //   title: '投放账号库',
      //   name: 'account',
      //   permissionName: 'bussiness_adv_account'
      // },
      // {
      //   title: '投放订单',
      //   name: 'launch-orders',
      //   permissionName: 'bussiness_adv_order'
      // },
      // {
      //   title: '投放视频库',
      //   name: 'launch',
      //   permissionName: 'bussiness_adv_video'
      // },
      {
        title: '推荐媒介账号',
        name: 'medium-recommend',
        permissionName: 'medium-recommend'
      },
      {
        title: '媒介账号库',
        name: 'medium-account',
        permissionName: 'medium_account'
      },
      {
        title: '媒介视频库',
        name: 'medium-video',
        permissionName: 'adv_medium_video'
      },
      {
        title: '媒介供应商管理',
        name: 'medium-org-manage',
        permissionName: 'medium_org_manage'
      }
    ]
    this.tabs = tabs.filter((item) => (this.$permission(item.permissionName)))
    this.activeName = this.$route.query.activeName || this.tabs[0].name
    const tabName = this.$route.query.tabName || this.tabs[0].title
    this.$router.replace({
      query: {
        activeName: this.activeName,
        tabName
      }
    })
  },
  methods: {
    /**
     * 类型切换响应函数
     * @param  {String} name 类型名称
     */
    handleAct(e) {
      const activeName = e.name
      const label = e.label
      this.$router.replace({
        query: {
          activeName,
          tabName: label
        }
      })
    }
  }
}
</script>
