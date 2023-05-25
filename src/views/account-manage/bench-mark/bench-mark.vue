<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-25 09:45:52
 * @LastEditTime: 2020-11-24 17:31:54
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <keep-alive>
          <component :is="`v-${activeName}`" v-if="activeName === item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import VPersonal from './@pages/personal.vue'
import VTeam from './@pages/team.vue'
import commonMixin from './_mods/mixin'
export default {
  components: {
    'v-personal': VPersonal,
    'v-team': VTeam
  },
  mixins: [commonMixin],
  data() {
    return {
      activeName: 'personal'
    }
  },
  computed: {
    tabs() {
      const tabs = [
        {
          name: 'personal',
          component: '',
          label: '我的对标账号'
        },
        {
          name: 'team',
          label: '团队对标账号',
          permissionName: 'bench_mark_team'
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
