<template>
  <div>
    <BusinessInfo :data="bussinessInfo" type="sign" />
    <Cooperation class="m-t-16" />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import BusinessInfo from './businessInfo.vue'
import Cooperation from '../_com/cooperation'
import { useAccountBusinessInfo, ACCOUNT_TYPE_MAP } from '../hooks'
export default defineComponent({
  components: { BusinessInfo, Cooperation },
  setup(props, ctx) {
    const { $route } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const { getBaseData } = useAccountBusinessInfo()
    const bussinessInfo = ref({})
    getBaseData({ accountId, accountType: ACCOUNT_TYPE_MAP.SIGN_ACCOUNT }).then(res => {
      bussinessInfo.value = res
    })

    return {
      bussinessInfo
    }
  }
})
</script>
