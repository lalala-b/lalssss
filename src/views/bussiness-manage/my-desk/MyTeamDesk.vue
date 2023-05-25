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
  onUnmounted,
  ref
} from '@vue/composition-api'
import Customer from '@/views/bussiness-manage/customer-manage/customer-manage.vue'
import Concat from '@/views/bussiness-manage/client-manage/client-manage.vue'
import Opportunities from '@/views/bussiness-manage/business_opportunity/CommercialOpportunity.vue'
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
  props: {},
  setup(props) {
    localStorage.setItem('deskType', '1')
    const { $route, $router, $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'Customer',
        label: '团队客户'
      },
      {
        name: 'Concat',
        label: '团队客户联系人'
      },
      {
        name: 'Opportunities',
        label: '团队商机'
      },
      {
        name: 'Invoice',
        label: '团队商单'
      },
      {
        name: 'Order',
        label: '团队工单'
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
      } else {
        const name = $route.query.activeName
        switch (name) {
          case 'allInvoice':
          case 'noCheckInvoice':
          case 'waitCheckInvoice':
          case 'checkInvoice':
            activeName.value = 'Invoice'
            break
          case 'order':
          case 'specialOrder':
          case 'evaluate':
          case 'entryOrder':
            activeName.value = 'Order'
            break
          default:
            activeName.value = name
            break
        }
      }
    })
    onUnmounted(() => {
      localStorage.removeItem('deskType')
    })
    const handleChage = (val) => {
      let name = val.name
      let label = val.label
      if (val.name === 'Invoice') {
        name = 'allInvoice'
        label = '全部商单'
      }
      if (val.name === 'Order') {
        name = 'order'
        label = '视频工单'
      }
      $router.replace({
        query: {
          activeName: name,
          tabName: label
        }
      })
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
