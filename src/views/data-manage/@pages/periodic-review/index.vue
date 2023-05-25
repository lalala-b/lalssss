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
import FundWeekData from '../fund-week-data'
import FundMonthData from '../fund-month-data'

export default {
  components: {
    FundWeekData,
    FundMonthData
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'FundWeekData',
        label: '周复盘',
        permissionName: 'pirate_putting_week'
      },
      {
        name: 'FundMonthData',
        label: '月复盘',
        permissionName: 'pirate_putting_month'
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

  .el-tabs__header {
    margin-bottom: 30px;
    position: sticky;
    top: -24px;
    z-index: 222;
  }
}
</style>
