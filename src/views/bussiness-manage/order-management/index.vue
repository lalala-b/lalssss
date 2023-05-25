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
import { ref } from '@vue/composition-api'
import Management from './components/Management'

export default {
  components: {
    Management
  },
  setup(props) {
    const tabs = [
      {
        name: 'management',
        label: '订单管理'
      }
    ]

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
