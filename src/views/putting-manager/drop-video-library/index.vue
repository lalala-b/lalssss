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
import Pirates from './components/Pirates'
import Proprietary from './components/Proprietary'
import TrafficBoost from './components/TrafficBoost'

export default {
  components: {
    Pirates,
    Proprietary,
    TrafficBoost
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'Pirates',
        label: '海盗基金',
        permissionName: 'component_click_pirates'
      },
      {
        name: 'Proprietary',
        label: '海盗自营',
        permissionName: 'component_click_proprietary'
      },
      {
        name: 'TrafficBoost',
        label: '流量助推订单',
        permissionName: 'component_click_trafficBoost'
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

<style lang="scss" scoped>
::v-deep {
  .table-view .el-link {
    margin-right: 0px;
  }
}
</style>
