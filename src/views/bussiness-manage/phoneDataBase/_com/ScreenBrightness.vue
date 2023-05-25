<template>
  <div>
    <VChart
      type="bar"
      :config="testConfig"
      :formater="configFomatter"
      :data="echartsData"
      :vh="vh"
    />
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { VChart } from 'components'
export default defineComponent({
  components: {
    VChart
  },
  props: {
    posterType: {
      type: String,
      default: '3'
    },
    echartsData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    const posterType = props.posterType
    const states = reactive({
      vh: 240,
      testConfig: {
        color: ['#01a0e9', '#41f940'],
        title: [
          {
            x: 'center',
            text: '手机屏幕亮度排名'
          },
          {
            right: '100',
            text: '单位：（nit）',
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
              name: '手机屏幕亮度排名',
              pixelRatio: 10
            }
          }
        },
        legend: {
          padding: [40, 0, 20, 0],
          right: '200'
        },
        xAxis: {
          type: 'value',
          inverse: true,
          boundaryGap: [1, 1],
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          }
        },
        yAxis: {
          type: 'category'
        }
      }
    })
    watch(
       () => props.echartsData,
       (val) => {
         if (val && Object.keys(val).length) {
           if (val.terms && val.terms.length) {
             states.vh = val.terms.length >= 3 ? val.terms.length * 20 * 2 + 140 : 240
           }
         }
       }
     )
   switch (posterType) {
      case '3':
        states.testConfig.title[0].text = '手机屏幕亮度排名'
        states.testConfig.toolbox.feature.saveAsImage.name = '手机屏幕亮度排名'
        break
      case '4':
        states.testConfig.title[0].text = '折叠屏手机屏幕亮度排名（内屏）'
        states.testConfig.toolbox.feature.saveAsImage.name =
          '折叠屏手机屏幕亮度排名（内屏）'
        break
      case '5':
        states.testConfig.title[0].text = '折叠屏手机屏幕亮度排名（外屏）'
        states.testConfig.toolbox.feature.saveAsImage.name =
          '折叠屏手机屏幕亮度排名（外屏）'
        break
      default:
        states.testConfig.title[0].text = '1%~100%充电速度排名'
        states.testConfig.toolbox.feature.saveAsImage.name =
          '1%~100%充电速度排名'
        states.testConfig.title[1].text = '单位：（min）'
        break
    }
    const configFomatter = (params) => {
      params.grid = {
        top: 100,
        containLabel: true
      }
      if (Number(posterType) === 6) {
        params.xAxis.axisLabel = {
          show: true,
          formatter: '{value}' + 'min'
        }
      } else {
        params.xAxis.axisLabel = {
          show: true,
          formatter: '{value}' + 'nit'
        }
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
