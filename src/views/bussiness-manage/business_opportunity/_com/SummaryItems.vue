
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
import { $getBusinessOpportunitySummary } from '@/api/bussiness-manage'
import { $getDeskBusinessOpportunitySummary } from '@/api/business-desk'

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
        key: 'totalOpportunitySum',
        val: 0,
        text: '总商机数'
      },
      {
        key: 'confirmOpportunitySum',
        val: 0,
        text: '确认合作'
      },
      {
        key: 'waitOpportunitySum',
        val: 0,
        text: '等待结果'
      },
      {
        key: 'refuseOpportunitySum',
        val: 0,
        text: '暂不合作'
      },
      {
        key: 'successOpportunityRatio',
        val: 0,
        text: '商机成功率',
        tip: '商机成功率=确认合作的商机数÷总商机数'
      },
      {
        key: 'accountWinTenderRatio',
        val: 0,
        text: '账号中标率',
        tip: '账号中标率=确认合作的订单的最终合作账号之和 ÷ 总商机推荐的账号之和'
      }
    ])

    const getClickCount = function() {
      loading.value = true
      const searchData = copy(props.searchData)
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        searchData.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskBusinessOpportunitySummary : $getBusinessOpportunitySummary
      return $api({
        ...searchData
      })
        .then((res) => {
          loading.value = false
          if (res.code === 1) {
            summaryItems.forEach((item) => {
              if (item.key === 'successOpportunityRatio') {
                item.val = res.data[item.key] + '%'
              } else if (item.key === 'accountWinTenderRatio') {
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
