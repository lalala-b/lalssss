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
import { $getKuaishouTrafficBoostSummary } from '@/api/traffic-boost'

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
        key: 'totalTaskOrders',
        val: 0,
        text: '任务订单量'
      },
      // {
      //   key: 'totalPlay',
      //   val: 0,
      //   text: '流量'
      // },
      {
        key: 'totalSupplementOrderNo',
        val: 0,
        text: '流量助推订单量'
      },
      {
        key: 'totalConsumeAmount',
        val: 0,
        text: '实际消耗金额',
        discription: '（流量助推）'
      },
      {
        key: 'totalConversionCount',
        val: 0,
        text: '激活数',
        discription: '（流量助推）'
      },
      {
        key: 'voCpa',
        val: 0,
        text: '激活单价',
        discription: '（流量助推）'
      }
    ])
    const getClickCount = function() {
      loading.value = true
      return $getKuaishouTrafficBoostSummary({ ...props.searchData, platOwner: props.platOwner })
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
<style lang="scss" scoped>
