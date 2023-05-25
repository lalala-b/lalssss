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
import StudioAccountAnalysis from './StudioAccountAnalysis.vue'
import StudioTrackAnalysis from './StudioTrackAnalysis.vue'

export default {
  components: {
    StudioAccountAnalysis,
    StudioTrackAnalysis
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'StudioTrackAnalysis',
        label: '赛道分析',
        permissionName: 'studio_track_analysis'
      },
      {
        name: 'StudioAccountAnalysis',
        label: '账号分析',
        permissionName: 'studio_account_analysis'
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
