<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
        <!-- <keep-alive> -->
        <component :is="activeName" v-if="activeName===item.name" @replace="handleReplace" />
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref, onMounted } from '@vue/composition-api'
// import Mcn from './Mcn'
// import XiangQian from './XiangQian'
import CommercialOpportunity from './CommercialOpportunity.vue'
import Rank from './Rank'

export default {
  components: {
    // Mcn,
    // XiangQian,
    CommercialOpportunity,
    Rank
  },
  setup(props) {
    const { $permission, $route, $router } = getCurrentInstance().proxy
    const tabs = [
      // {
      //   name: 'Mcn',
      //   title: 'MCN商机',
      //   permissionName: 'mcn_business_opportunity'
      // },
      {
        name: 'CommercialOpportunity',
        title: '商机',
        permissionName: 'shangji_business_opportunity'
      },
      {
        name: 'Rank',
        title: '商机榜单',
        permissionName: 'rank_business_opportunity'
      }
    ].filter(_ => $permission(_.permissionName))
    const activeName = ref(tabs[0].name)

    onMounted(() => {
      const { query } = $route
      if (query.activeName) {
        activeName.value = query.activeName
      } else {
        activeName.value = tabs[0].name
      }
    })

    const handleClick = (e) => {
      const activeName = e.name
      $router.replace({
        query: {
          activeName
        }
      })
    }

    const handleReplace = (params) => {
      activeName.value = params.activeName
      $router.replace({
        query: params
      })
    }

    return {
      tabs,
      activeName,
      handleClick,
      handleReplace
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
