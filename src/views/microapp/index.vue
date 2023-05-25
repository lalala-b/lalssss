<template>
  <div id="mcroApp" />
</template>
<script>
import {
  defineComponent,
  onMounted,
  reactive,
  onUnmounted,
  getCurrentInstance
} from '@vue/composition-api'
import { loadMicroApp } from 'qiankun'

export default defineComponent({
  setup() {
    const { $store, $permission } = getCurrentInstance().proxy

    const state = reactive({
      microapp: null
    })

    onMounted(() => {
      state.microapp = loadMicroApp({
        name: 'qianshuju_qp',
        entry: process.env.NODE_ENV === 'development' ? '//qp.zhuanspirit.com/#/qp/home' : '//qp.zhuanspirit.com',
        container: '#mcroApp',
        props: {
          data: $store.state
        }
      }, {
        singular: true
      })
    })

    onUnmounted(() => {
      state.microapp.unmount()
    })
  }
})
</script>
