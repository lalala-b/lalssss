<template>
  <div>
    <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane
        v-for="item in tabs"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <keep-alive>
          <component :is="activeName" v-if="activeName === item.name" :from="item.from" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import MineDesk from './MineDesk.vue'
import MyTeamDesk from './MineDesk.vue'
import Rank from '@/views/bussiness-manage/business_opportunity/Rank.vue'
export default {
  components: {
    MineDesk,
    MyTeamDesk,
    Rank
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'MyTeamDesk',
        label: '我的团队',
        from: 'group',
        permissionName: 'my-team-desk'
      },
      {
        name: 'MineDesk',
        label: '我的',
        from: 'mine',
        permissionName: 'mine-desk'
      },
       {
        name: 'Rank',
        label: '商机榜单',
        permissionName: 'rank_business_opportunity'
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
