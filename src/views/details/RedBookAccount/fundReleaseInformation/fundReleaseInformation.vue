<template>
  <div>
    <BusinessInfo :data="businessInfo" :loading="loading" />
    <OrderVideo class="m-t-16" />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import BusinessInfo from './businessInfo.vue'
import OrderVideo from './orderVideo.vue'
import { useAccountBusinessInfo, ACCOUNT_TYPE_MAP } from '../hooks'
export default defineComponent({
  components: { BusinessInfo, OrderVideo },
  setup(props, ctx) {
    const { $route, $message } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const { getBaseData } = useAccountBusinessInfo()
    const states = reactive({
      businessInfo: {},
      loading: true
    })
    getBaseData({ accountId, accountType: ACCOUNT_TYPE_MAP.ORDRT_ACCOUNT }).then(res => {
      states.businessInfo = res || {}
      states.loading = false
    }).catch(e => {
      states.loading = false
      $message.error(e)
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>
