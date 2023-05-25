<template>
  <div :id="`bar${barId}`" class="bar" />
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from '@vue/composition-api'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    barId: {
      type: String | Number,
      default: 0
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const { barId, data } = props

    if (!Object.keys(data).length) return

    const states = reactive({
      data: {},
      flag: false
    })

    const drawEchart = () => {
      const dom = document.getElementById(`bar${barId}`)
      const myChart = echarts.init(dom)

      states.flag = true

      const terms = []
      const valueData = []

      Object.keys(states.data).sort((a, b) => states.data[a] - states.data[b]).forEach(item => {
        terms.push(item)
        valueData.push(data[item])
      })

      const option = {
          // legend: {
          //   // left: '15%',
          //   icon: 'circle',
          //   selectedMode: false
          // },
          grid: {
            top: 30,
            bottom: 30,
            left: '15%'
          },
          xAxis: {
            type: 'value',
            axisTick: {
              show: false
            },
            show: false,
            axisLabel: {
              formatter: () => {
                  return ''
              }
            },
            max: 100
          },
          yAxis: {
            type: 'category',
            boundaryGap: true,
            data: terms,
            axisTick: {
              show: false
            },
            interval: 0,
            offset: 4,
            axisLine: {
              lineStyle: {
                width: 0
              }
            },
            axisLabel: {
              fontWeight: '700'
            }
          },
          series: [
              {
                type: 'bar',
                showBackground: true,
                barCategoryGap: '40%',
                label: {
                  show: true,
                  color: '#33bdf5',
                  position: 'right',
                  formatter: (params) => {
                    return `${params.data}%`
                  }
                },
               itemStyle: {
                  barBorderRadius: [0, 5, 5, 0], // 圆角
                  color: '#33bdf5'
                },
                data: valueData
              }
            ]
        }

        myChart.setOption(option)
    }

    watch(() => props.data, (val) => {
      states.data = val
      if (states.flag) {
        drawEchart()
      }
    }, {
      immediate: true
    })

    onMounted(() => {
      drawEchart()
    })
  }
})
</script>

<style lang="scss" scoped>
.bar {
  width: 100%;
  height: 100%;
}
</style>
