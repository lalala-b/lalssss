<template>
  <div id="qp-microApp" />
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  onUnmounted,
  onBeforeUnmount,
  getCurrentInstance,
  watch
} from '@vue/composition-api'
import { loadMicroApp } from 'qiankun'

export default defineComponent({
  setup() {
    const { $componentId, $store } = getCurrentInstance().proxy
    const state = reactive({
      microapp: null
    })

    watch(
      () => $store.state.user.clearMicroapp,
      (val) => {
        if (val) {
          state.microapp && state.microapp.update({ clearMicroapp: val })
        }
      }
    )

    onMounted(() => {
      state.microapp = loadMicroApp(
        {
          name: 'qianshuju_qp',
          entry: '//qp.zhuanspirit.com',
          container: '#qp-microApp',
          props: {
            data: { ...$store.state, componentId: $componentId }
          }
        },
        {
          singular: true
        }
      )
    })

    onBeforeUnmount(() => {
      state.microapp.unmount()
    })

    onUnmounted(() => {
      state.microapp.unmount()
    })
  }
})
</script>
