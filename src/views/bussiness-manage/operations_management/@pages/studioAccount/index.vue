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
import MyOperate from './myOperate'
import AllOperate from './allOperate'
export default {
  components: {
    MyOperate,
    AllOperate
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'MyOperate',
        label: '我运营的账号',
        _permissionName: 'studio_my_operate'
      },
      {
        name: 'AllOperate',
        label: '乾派工作室账号',
        _permissionName: 'studio_all_operate'
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
