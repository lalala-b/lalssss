<template>
  <div :id="`line${id}`" class="line" />
</template>

<script>
import { defineComponent, onMounted, watch, computed } from '@vue/composition-api'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    id: {
      type: String | Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    // const lineData = computed(() => props.data)

    // watch(lineData, (val) => {
    //   console.info('--val', val)
    // })
    onMounted(() => {
      if (!props.data.length) return
      const dom = document.getElementById(`line${props.id}`)
      const myChart = echarts.init(dom)

      const option = {
        xAxis: {
          type: 'category',
          data: [],
          show: false
        },
        yAxis: {
          type: 'category',
          data: [],
          show: false
        },
        tooltip: {
          show: true,
          position: ['10%', '10%'],
          extraCssText: 'width:170px; white-space:pre-wrap',
          formatter: (params) => {
            const { key, value } = params.data
            return `${key}：\n¥${!value ? 0 : value}`
          }
        },
        series: [
          {
            data: props.data,
            type: 'line'
          }
        ]
      }

      myChart.setOption(option)
    })
  },
})
</script>

<style lang="scss" scoped>
.line {
  width: 200px;
  height: 200px;
}
</style>
