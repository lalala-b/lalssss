<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-09 10:48:48
 * @LastEditTime: 2020-11-27 17:32:15
 * @LastEditors: Linjie
-->
<template>
  <el-tabs
    v-model="activeName"
    class="P-militaryManageVideoMarkTab"
    @tab-click="handleTabClick"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
      class="P-militaryManageVideoMarkCon"
    >
      <keep-alive>
        <component :is="`v-${activeName}`" v-if="activeName === item.name" />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import VManual from './@pages/manual'
import VSys from './@pages/sys'
import VDelivery from './@pages/delivery'
export default {
  components: {
    VManual,
    VSys,
    VDelivery
  },
  data() {
    return {
      activeName: 'sys'
    }
  },
  computed: {
    tabs() {
      const tabs = [
        {
          name: 'sys',
          label: '系统采集视频'
        },
        {
          name: 'delivery',
          label: '投放视频',
          permissionName: 'military_search_delivery'
        },
        {
          name: 'manual',
          label: '手工录入视频',
          permissionName: 'military_search_entering'
        }
      ]
      const permissionTabs = tabs.filter(item => this.$permission(item.permissionName))
      return permissionTabs
    }
  },
  created() {
    this.activeName = this.$route.query.activeName || this.tabs[0].name
    const tabName = this.$route.query.tabName || this.tabs[0].label
    this.$router.replace({
      query: {
        activeName: this.activeName,
        tabName
      }
    })
  },
  methods: {
    handleTabClick(e) {
      const activeName = e.name
      const tabName = e.label
      this.$router.push({
        query: {
          activeName,
          tabName
        }
      })
    }
  }
}
</script>

<style>
</style>

