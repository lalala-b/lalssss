<template>
  <VChart
    type="map"
    :config="config"
    :data="mapData"
  />
</template>

<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { VChart } from 'components'

export default defineComponent({
  props: {
    // mapId: {
    //   type: String | Number,
    //   default: 0
    // },
    data: {
      type: Array | Object,
      default: () => ({})
    }
  },
  components: {
    VChart
  },
  setup(props) {
    const { data } = props
    if (!Object.keys(data).length) return

    const states = reactive({
      mapData: {},
      config: {
        tooltip: {
          show: false
        }
      }
    })

    // watch(() => props.data, (data) => {
      const terms = []
      const values = []
      Object.keys(data).forEach(item => {
        terms.push(item)
        values.push(data[item])
      })
      states.mapData.terms = terms
      states.mapData.values = values
    // })

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
}
</style>
