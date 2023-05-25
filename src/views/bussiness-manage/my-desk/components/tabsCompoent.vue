<template>
  <div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleChage">
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
import {
  getCurrentInstance,
  onMounted,
  reactive,
  ref
} from '@vue/composition-api'
import Customer from '@/views/bussiness-manage/customer-manage/customer-manage.vue'
import Concat from '@/views/bussiness-manage/client-manage/client-manage.vue'
import Opportunities from '@/views/bussiness-manage/business_opportunity/index.vue'
import Invoice from '@/views/bussiness-manage/bill-manage/bill-manage.vue'
import Order from '@/views/bussiness-manage/workorder/index.vue'
export default {
  components: {
    Customer,
    Concat,
    Opportunities,
    Invoice,
    Order
  },
  props: {
    from: {
      type: String,
      default: 'group'
    }
  },
  setup(props) {
    const { $route, $router } = getCurrentInstance().proxy
    const states = reactive({
      title: '团队'
    })
    states.title = props.from === 'group' ? '团队' : '我的'
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'Customer',
        label: states.title + '客户'
      },
      {
        name: 'Concat',
        label: states.title + '客户联系人'
      },
      {
        name: 'Opportunities',
        label: states.title + '商机'
      },
      {
        name: 'Invoice',
        label: states.title + '商单'
      },
      {
        name: 'Order',
        label: states.title + '工单'
      }
    ].filter((_) => $permission(_.permissionName))
    const activeName = ref(tabs[0].name)
    onMounted(() => {
      if (!Object.keys($route.query).length) {
        $router.replace({
          query: {
            activeName: activeName.value,
            tabName: tabs[0].label
          }
        })
      }
      console.log('-----$route', $route)
    })

    const handleChage = (val) => {
      // activeName=order&tabName=视频工单
      console.log('----', val)
    }
    return {
      tabs,
      activeName,
      handleChage
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
