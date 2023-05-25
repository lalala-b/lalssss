<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import AccountAnalysis from './AccountAnalysis.vue'
import TrackAnalysis from './TrackAnalysis.vue'

export default {
  components: {
    AccountAnalysis,
    TrackAnalysis
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'TrackAnalysis',
        label: '赛道分析',
        permissionName: 'track_data_analysis'
      },
      {
        name: 'AccountAnalysis',
        label: '账号分析',
        permissionName: 'account_data_analysis'
      }
    ].filter((_) => $permission(_.permissionName))
    const activeName = ref(tabs[0].name)
    return {
      tabs,
      activeName
    }
  }
}
</script>
