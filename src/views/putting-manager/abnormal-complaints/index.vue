<template>
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import MyComplaint from './components/MyComplaint'
import AllComplaint from './components/AllComplaint'
export default {
  components: {
    MyComplaint,
    AllComplaint
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'MyComplaint',
        label: '我的申诉',
        permissionName: 'abnormal_complaints_my'
      },
      {
        name: 'AllComplaint',
        label: '全部申诉',
        permissionName: 'abnormal_complaints_all'
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
