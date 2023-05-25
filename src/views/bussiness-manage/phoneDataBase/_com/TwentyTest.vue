<template>
  <VChart
    type="bar"
    :config="testConfig"
    :formater="configFomatter"
    :data="echartsData"
    :vh="vh"
  />
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { VChart } from 'components'
export default defineComponent({
  components: {
    VChart
  },
  props: {
    echartsData: {
      type: Object,
      default: () => {
        return {
      }
      }
    }
  },
  setup(props) {
    const states = reactive({
      vh: 200,
      defaultList: [],
      testConfig: {
        color: '#01a0e9',
        title: [
          {
            x: 'center',
            text: '20款应用测试'
          },
          {
            right: '150',
            text: '（测试条件：室温25℃，默认性能模式）',
            textStyle: {
              lineHeight: '85',
              fontSize: '12',
              fontWeight: '400'
            }
          }
        ],
        backgroundColor: '#fff',
        tooltip: {
          show: false
        },
        toolbox: {
          right: '20',
          width: '80',
          feature: {
            saveAsImage: {
              type: 'png',
              name: '20款应用测试',
              pixelRatio: 10
            }
          }
        },
        grid: {
          containLabel: true
        },
        legend: {
          padding: [40, 50],
          x: 'right'
        },
        xAxis: {
          type: 'value',
          inverse: true,
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          }
        },
        yAxis: {
          show: false,
          type: 'category'
        }
      }
    })
    watch(() => props.echartsData, (val) => {
        if (val && Object.keys(val).length) {
          if (val.terms && val.terms.length) {
            states.vh = val.terms.length > 2 ? val.terms.length * 30 + 140 : 200
            let temp = 15
            if (val.values && val.values[0] && val.values[0].length) {
              temp = Math.max.apply(null, val.values[0]) / 2
            }
            val.terms.forEach(item => {
              states.defaultList.push(temp)
            })
          }
        }
      })
    const configFomatter = (params) => {
      params.grid = {
        top: 100,
        containLabel: true
      }
      const data3 = states.defaultList
      const textList = props.echartsData.otherInfo
      params.series[0].stack = 'total'
      params.series[0].label = {
        show: true,
        position: 'insideRight'
      }
       params.series.forEach(item => {
        item.label = {
            show: true,
            position: 'right',
            color: '#000',
            formatter: function(val) {
              return val.value || ''
            }
        }
       })
      params.series.push({
        name: '',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        label: {
          normal: {
            show: true,
            formatter: function(val) {
              return textList[val.dataIndex]
            },
            color: '#000',
            offset: [30, 0]
          }
        },
        itemStyle: {
          normal: {
            color: 'rgba(128, 128, 128, 0)'
          }
        },
        data: data3
      })

      return params
    }
    return {
      ...toRefs(states),
      configFomatter
    }
  }
})
</script>
