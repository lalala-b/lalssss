<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-31 10:19:44
 * @LastEditTime: 2020-11-24 16:50:52
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <keep-alive>
          <component :is="`v-${activeName}`" v-if="activeName === item.name && $permission(item.permissionName)" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VPerson from './@pages/personal'
import VTeam from './@pages/team'
export default {
  components: {
    'v-person': VPerson,
    'v-team': VTeam
  },
  data() {
    return {
      activeName: 'person'
    }
  },
  computed: {
    tabs() {
      const tabs = [
        {
          name: 'person',
          label: '我的对标视频'
        },
        {
          name: 'team',
          label: '团队对标视频',
          permissionName: 'mark_video_team'
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
    handleClick(e) {
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
