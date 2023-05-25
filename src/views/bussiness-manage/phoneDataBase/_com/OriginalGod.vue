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
      defalut: () => {
        return {}
      }
    }
  },
  setup(props) {
    const states = reactive({
     vh: 390,
      testConfig: {
        color: ['#ffce00', '#51a7e2', '#6dcc81'],
        title: {
          text: '原神半小时表现',
          textStyle: {
            lineHeight: '30'
          },
          x: 'center',
          subtext: '（测试条件：室温25℃，屏幕亮度300nit，音量50%，0后台运行）',
          subtextStyle: {
            // 副标题的属性
            color: '#333'
            // 其他属性类比主标题
          }
        },
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
              name: '原神半小时表现',
              pixelRatio: 10
            }
          }
        },
        xAxis: {
          inverse: true,
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          }
        },
        yAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false
          }
        },
        legend: {
          padding: [70, 10],
          x: 'right'
        }
      }
    })
    watch(
      () => props.echartsData,
      (val) => {
        if (val && Object.keys(val).length) {
          if (val.terms && val.terms.length) {
            states.vh = val.terms.length * 20 * 3 + 100
          }
        }
      }
    )
    const configFomatter = (params) => {
      params.grid = {
        top: 120,
        containLabel: true
      }
      params.series.forEach((item, i) => {
        item.barGap = 0
        item.itemStyle = {
          normal: {
            label: {
              show: true,
              position: 'right',
              color: '#000',
              formatter: function(val) {
                return val.value || ''
              }
            }
          }
        }
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
