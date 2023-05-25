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
import { ref, getCurrentInstance } from '@vue/composition-api'
import Pending from './pending.vue'
import Processed from './processed.vue'
import AllAgents from './allAgent.vue'
export default {
  components: {
    Pending,
    Processed,
    AllAgents
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'Pending',
        label: '待处理'
      },
      {
        name: 'Processed',
        label: '已处理'
      },
      {
        name: 'AllAgents',
        label: '全部待办',
        _permissionName: 'my_all_agents'
      }
    ].filter(_ => $permission(_.permissionName))
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

  .el-tabs__header {
    margin-bottom: 30px;
    position: sticky;
    top: -24px;
    z-index: 222;
  }
}
</style>
