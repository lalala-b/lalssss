<template>
  <div :id="`pie${pieId}`" class="pie" />
</template>

<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import * as echarts from 'echarts'

export default defineComponent({
  props: {
    pieId: {
      type: String | Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { data } = props
    if (!data.length) return

    const drawEchart = () => {
      const dom = document.getElementById(`pie${props.pieId}`)
      const myChart = echarts.init(dom)

      const formatToolTip = (params) => {
        const { name, value } = params.data
        return `
          <div class="flex" style="flex-direction: column">
            <div>${name}</div>
            <div>占比：${value}%</div>
          </div>
        `
      }

      // const formatLegend = (params) => {
      //   const obj = {}
      //   data.forEach(item => {
      //     const objTemp = {}
      //     objTemp.name = item.name
      //     objTemp.value = item.value
      //     obj[item.name] = objTemp
      //   })
      //   return `
      //     {a| ${params}(${obj[params]['value']}%)}
      //   `
      // }

      const option = {
          tooltip: {
            trigger: 'item',
            confine: true,
            backgroundColor: 'rgba(0,0,0,.6)',
            textStyle: {
              color: '#fff'
            },
            formatter: (params) => {
              return formatToolTip(params)
            }
          },
          // grid: {
          //   width: '100%'
          // },
          legend: {
            bottom: 0,
            icon: 'circle',
            selectedMode: false
            // formatter: (params) => {
            //   return formatLegend(params)
            // },
            // textStyle: {
            //   rich: {
            //     a: {
            //       textAlign: 'left'
            //     }
            //   }
            // }
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
              label: {
                show: false
              },
              labelLine: {
                show: false
              },
              // top: 0,
              data: props.data
              // itemStyle: {
              //     normal: {
              //         label: {
              //             show: true,
              //             formatter: '{b}:{c}%'
              //         },
              //         labelLine: { show: true },
              //         emphasis: {
              //           show: false
              //         }
              //     }
              // }
            }
          ]
      }

      myChart.setOption(option)
    }

    onMounted(() => {
      drawEchart()
    })
  }
})
</script>

<style lang="scss" scoped>
.pie {
  width: 200px;
  height: 280px;
}
</style>
