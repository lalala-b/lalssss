<template>
  <Statistics
    v-loading="loading"
    class="statistics"
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
import { $getClickConversionCount } from '@/api/putting-manager'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    platOwner: {
      type: String,
      default: '投放'
    }
  },
  components: { Statistics },
  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const loading = ref(false)
    const summaryItems = reactive([
      {
        key: 'orderCount',
        val: 0,
        text: '订单量'
      },
      {
        key: 'priceCount',
        val: 0,
        text: '投放价格'
      },
      {
        key: 'flowCount',
        val: 0,
        text: '流量'
      },
      {
        key: 'cpmCount',
        val: 0,
        text: 'CPM',
        tip: 'CPM=投放价格/（流量/1000）'
      },
      {
        key: 'componentClickNewActiveCount',
        val: 0,
        text: '新增激活',
        tip: '2022年8月2日快手改为曝光口径'
      },
      {
        key: 'cpaCount',
        val: 0,
        text: 'CPA',
        tip: 'CPA=投放价格/新增激活'
      },
      {
        key: 'c2bReceiverCount',
        val: 0,
        text: 'C2B总收件量'
      }
    ])

   const getClickCount = function() {
      loading.value = true
      const searchData = copy(props.searchData)
      if (searchData.platId !== 26) delete searchData.conversionSource
      return $getClickConversionCount({
        ...searchData,
        platOwner: props.platOwner
      })
        .then((res) => {
          loading.value = false
          if (res.code === 1) {
            summaryItems.forEach((item) => {
              item.val = res.data[item.key]
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
