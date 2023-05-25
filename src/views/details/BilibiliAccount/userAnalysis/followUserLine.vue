<template>
  <div :id="`line${lineId}`" class="line" />
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from '@vue/composition-api'
import * as echarts from 'echarts'
import { toThousandsW } from '@/filters'

export default defineComponent({
  props: {
    lineId: {
      type: String | Number,
      default: 0
    },
    data: {
      type: Object | Array,
      default: () => ({})
    },
    curType: {
      type: String,
      default: 'total'
    }
  },
  setup(props) {
    const { lineId, data } = props
    if (!Object.keys(data).length) return

    const states = reactive({
      xData: [],
      yData: [],
      flag: false
    })

    const drawEchart = () => {
      const dom = document.getElementById(`line${lineId}`)
      const myChart = echarts.init(dom)

      states.flag = true

      const getCurTypeText = (type) => {
        let text = ''
        switch (type) {
          case 'total':
            text = '总量'
            break
          case 'increment':
            text = '增量'
            break
          default:
            break
        }

        return text
      }

      const formatToolTip = (params) => {
        return `
          <div class="flex" style="flex-direction: column">
            <div>日期：${params[0].name}</div>
            <div>粉丝${getCurTypeText(props.curType)}：${toThousandsW(params[0].data)}</div>
          </div>
        `
      }

      const option = {
        tooltip: {
          trigger: 'axis',
          confine: true,
          formatter: (params) => {
            return formatToolTip(params)
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: states.xData,
           axisLine: {
            lineStyle: {
              width: 0
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
              formatter: function(val) {
                return toThousandsW(val)
              }
          },
          min: (value) => {
            return value.min
          }
        },
        series: [
          {
            data: states.yData,
            type: 'line',
            // symbol: '',
            areaStyle: {},
            showSymbol: false
          }
        ]
      }

        myChart.setOption(option, true)
    }

    watch(() => props.curType, (val) => {
        states.xData = data.terms
        if (val === 'total') {
          states.yData = data.values[0]
        } else {
          states.yData = data.values[1]
        }
        // console.info(states.yData, 'yData')
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
.line {
  width: 100%;
  height: 100%;
}
</style>
