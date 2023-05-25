<template>
  <Statistics
    v-loading="loading"
    class="statistics data-wrap"
    :data="summaryItems"
  />
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref
} from '@vue/composition-api'
import { Statistics } from 'components'
import { $getSummaryData } from '@/api/medium-manage'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    }
  },
  components: { Statistics },
  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const loading = ref(false)
    const summaryItems = reactive([
      {
        key: 'workOrderCount',
        val: 0,
        text: '订单数量'
      },
      {
        key: 'totalCooperationQuotation',
        val: 0,
        text: '合作报价总额'
      },
      {
        key: 'totalMediaRebate',
        val: 0,
        text: '媒介返点总额'
      },
      {
        key: 'performanceRevenue',
        val: 0,
        text: '绩效营收'
      },
      {
        key: 'mediaProfitMargin',
        val: 0,
        text: '媒介利润率'
      },
      {
        key: 'projectProfitMargin',
        val: 0,
        text: '项目利润率'
      }
    ])

    const getClickCount = function() {
      loading.value = true
      const searchData = copy(props.searchData)

      return $getSummaryData({
        ...searchData
      })
        .then((res) => {
          loading.value = false
          if (res.code === 1) {
            summaryItems.forEach((item) => {
              if (
                item.key === 'mediaProfitMargin' ||
                item.key === 'projectProfitMargin'
              ) {
                item.val = res.data[item.key] + '%'
              } else {
                item.val = res.data[item.key]
              }
            })
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          loading.value = false
          $message.error(err.message || '网络错误')
        })
    }
    return {
      loading,
      summaryItems,
      getClickCount
    }
  }
})
</script>
<style lang="scss" scoped>
.data-wrap {
  background: rgba(0, 95, 246, 0.05);
}
</style>
