<template>
  <div class="C-putting-order-list">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <template v-if="item.name==='ToAuditDemand'" slot="label">
          {{ item.label }}<i v-if="count" v-loading="tabNumLoading" class="icon-high">{{ count }}</i>
        </template>
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" @getCount="getWaitAuditRequireCount" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import MyDemand from './components/MyDemand.vue'
import MyWaitDemand from './components/MyWaitDemand.vue'
import AllWaitDemand from './components/AllWaitDemand.vue'
import CooperationInHall from './components/CooperationInHall.vue'
import TaskInHall from './components/TaskInHall.vue'
import ToAuditDemand from './components/toAuditDemand.vue'
import { $getWaitAuditRequireCount } from '@/api/putting-manager'
export default {
  components: {
    MyDemand,
    MyWaitDemand,
    AllWaitDemand,
    CooperationInHall,
    TaskInHall,
    ToAuditDemand
  },
  setup(props) {
    // 1-建联中、2-议价中、3-已下单（需求完结）、4-议价失败、5-建联失败 6-已取消',
    const { $message, $permission, $route } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'AllWaitDemand',
        label: '全部待处理需求',
        permissionName: 'all_wait_demand'
      },
      {
        name: 'MyWaitDemand',
        label: '我的待处理需求',
        permissionName: 'my_wait_demand'
      },
      {
        name: 'TaskInHall',
        label: '建联任务大厅',
        permissionName: 'task_in_hall'
      },
      {
        name: 'MyDemand',
        label: '我的需求',
        permissionName: 'my_demand'
      },
      {
        name: 'CooperationInHall',
        label: '提报合作大厅',
        permissionName: 'cooperation_in_hall'
      },
      {
        name: 'ToAuditDemand',
        label: '待审核需求',
        permissionName: 'to_audit_demand'
      }
    ].filter(_ => $permission(_.permissionName))
    const states = reactive({
      tabNumLoading: false,
      count: 0
    })
    const { queryActiveName } = $route.query
    const activeName = queryActiveName || ref(tabs[0].name)
    const getWaitAuditRequireCount = async() => {
      states.tabNumLoading = true
      const res = await $getWaitAuditRequireCount()
      states.tabNumLoading = false
      if (res.code === 1 && res.data) {
        states.count = Number(res.data.waitExamineRequirementCount)
      } else {
        $message.error(res.message || '网络错误')
        return Promise.reject()
      }
    }

    getWaitAuditRequireCount()
    return {
      tabs,
      activeName,
      ...toRefs(states),
      getWaitAuditRequireCount
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
  .C-putting-order-list {
    // ::v-deep .cell { text-align: center; }
    ::v-deep .el-tabs__content {
      overflow: initial;
    }
    .icon-high {
      background-color: #f00;
      color: #fff;
      padding: 0 4px;
      height: 16px;
      line-height: 16px;
      display: inline-block;
      text-align: center;
      border-radius: 10px;
      ::v-deep .el-loading-spinner {
        margin-top: -10px;
        .circular {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>

