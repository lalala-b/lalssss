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
    echartsData: {
      type: Object,
      defalut: () => {}
    }
  },
  setup(props) {
    const states = reactive({
      vh: 400,
      defaultList: [],
      testConfig: {
        title: {
          text: '5小时重度续航测试',
          textStyle: {
            lineHeight: '30'
          },
          x: 'center',
          subtext:
            '（测试条件：室温25℃，屏幕亮度300nit，音量50%，0后台运行，5GWiFi，单位：%）',
          subtextStyle: {
            // 副标题的属性
            color: '#333'
            // 其他属性类比主标题
          }
        },
        backgroundColor: '#fff',
        tooltip: {
          show: false
          // trigger: 'axis',
          // formatter: function(val) {
          //   return ''
          // }
        },
        toolbox: {
          right: '20',
          width: '80',
          feature: {
            saveAsImage: {
              type: 'png',
              name: '5小时重度续航测试',
              pixelRatio: 10
            }
          }
        },
        legend: {
          padding: [70, 10]
        },
        grid: {
          top: 160,
          containLabel: true,
           bottom: '20px'
        },
        xAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#333'
            }
          },
          inverse: true
        },
        yAxis: {
          type: 'category',
          inverse: true
        },
        series: {
          type: 'bar',
          stack: 'total',
          label: {
            show: true,
            color: '#000'
          },
          emphasis: {
            focus: 'series'
          }
        }
      }
    })
    watch(
      () => props.echartsData,
      (val) => {
        if (val && Object.keys(val).length) {
          if (val.terms && val.terms.length) {
            states.vh = val.terms.length * 20 + 200
            const temp = 20
            val.terms.forEach((item) => {
              states.defaultList.push(temp)
            })
          }
        }
      }
    )
    const series1 = []
    const colorList = [
      '#01a0e9',
      '#41f940',
      '#f8b551',
      '#f7616d',
      '#60f7f2',
      '#f892c2',
      '#f261f8',
      '#8a61f6',
      '#818182'
    ]
    const configFomatter = (params) => {
      const data3 = states.defaultList
      const textList = props.echartsData.otherInfo
      const series = params.series || []
      if (series) {
        series.forEach((item, i) => {
          series1.push({
            name: item.name,
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              color: '#000',
              fontStyle: 'normal',
              fontWeight: '400',
              formatter: function(val) {
                return val.value || ''
              }
            },
            emphasis: {
              focus: 'series'
            },
            itemStyle: {
              color: colorList[i]
            },
            barGap: 7,
            data: item.data
          })
        })
        series1.push({
          name: '',
          type: 'bar',
          stack: 'total',
          emphasis: {
            focus: 'series'
          },
          label: {
            normal: {
              show: true,
              position: 'insideLeft',
              formatter: function(val) {
                const str = textList[val.dataIndex]
                if (str.length > 10) {
                  return str.slice(0, 8) + '\n' + str.slice(8)
                } else {
                  return textList[val.dataIndex]
                }
              },
              color: '#000'
            }
          },
          itemStyle: {
            normal: {
              color: 'rgba(128, 128, 128, 0)'
            }
          },
          data: data3
        })
      }
      params.xAxis = {
        type: 'value',
        // show: false,
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        }
      }
      params.series = series1
      return params
    }
    return {
      ...toRefs(states),
      configFomatter
    }
  }
})
</script>
