<template>
  <div>
    <BusinessInfo :data="bussinessInfo" />
    <OrderVideo class="m-t-16" />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import BusinessInfo from './businessInfo.vue'
import OrderVideo from './orderVideo.vue'
import { useAccountBusinessInfo, ACCOUNT_TYPE_MAP } from '../hooks'
export default defineComponent({
  components: { BusinessInfo, OrderVideo },
  setup(props, ctx) {
    const { $route } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const { getBaseData } = useAccountBusinessInfo()
    const bussinessInfo = ref({})
    getBaseData({ accountId, accountType: ACCOUNT_TYPE_MAP.ORDRT_ACCOUNT }).then(res => {
      bussinessInfo.value = res
    })

    return {
      bussinessInfo
    }
  }
})
</script>
