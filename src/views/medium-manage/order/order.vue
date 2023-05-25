<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
        <keep-alive>
          <component :is="activeName" v-if="activeName===item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import Detail from '../components/Detail'

export default {
  components: {
    Detail
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'Detail',
        title: '订单管理',
        permissionName: 'medium-order-detail'
      },
      // {
      //   name: 'Detail',
      //   title: '订单管理',
      //   permissionName: 'medium-order-detail'
      // }
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

  .is-top {
    transform: translateX(0) !important;
  }
}
</style>
