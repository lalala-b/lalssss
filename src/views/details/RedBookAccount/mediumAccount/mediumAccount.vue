<template>
  <div>
    <BusinessInfo :data="businessInfo" :loading="loading" />
    <Cooperation class="m-t-16" />
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import BusinessInfo from './businessInfo.vue'
import Cooperation from '../_com/cooperation'
import { useAccountBusinessInfo, ACCOUNT_TYPE_MAP } from '../hooks'

export default defineComponent({
  components: { BusinessInfo, Cooperation },
  props: {
    meetUserTableData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, ctx) {
    const { $route, $message } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const { getBaseData } = useAccountBusinessInfo()
     const states = reactive({
      businessInfo: {},
      loading: true
    })
    getBaseData({ accountId, accountType: ACCOUNT_TYPE_MAP.MEDIUM_ACCOUNT }).then(res => {
      states.businessInfo = res || {}
      states.loading = false
    }).catch(e => {
      states.loading = false
      $message.error(e.message)
    })
    return {
      ...toRefs(states)
    }
  }
})
</script>
