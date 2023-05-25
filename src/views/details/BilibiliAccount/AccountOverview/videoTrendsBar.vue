<template>
  <div :id="`bar${barId}`" class="bar" />
</template>

<script>
import { defineComponent, onMounted, reactive, watch } from '@vue/composition-api'
import * as echarts from 'echarts'
import { toThousandsW } from '@/filters'

export default defineComponent({
  props: {
    barId: {
      type: String | Number,
      default: 0
    },
    data: {
      type: Array,
      default: () => ([])
    },
    curType: {
      type: String,
      default: ''
    },
    curMedian: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const { data } = props
    if (!props.data.length) return

    const states = reactive({
      chartsData: [],
      flag: false
    })

    const drawEchart = () => {
      const dom = document.getElementById(`bar${props.barId}`)
      const myChart = echarts.init(dom)

      states.flag = true

        // echarts的点击事件
      myChart.getZr().on('click', (params) => {
        const pointInPixel = [params.offsetX, params.offsetY]
        if (myChart.containPixel('grid', pointInPixel)) {
            const xIndex = myChart.convertFromPixel({ seriesIndex: 0 }, [
                params.offsetX,
                params.offsetY
            ])[0]
            const { bvId } = data[xIndex]
            window.open(`https://www.bilibili.com/video/${bvId}/`, '_blank')
        }
      })

      const getCurTypeText = (type) => {
        let text = ''
        switch (type) {
          case 'playTrendCnt':
            text = '播放量'
            break
          case 'likeTrendCnt':
            text = '点赞量'
            break
          case 'commentTrendCnt':
            text = '评论量'
            break
          case 'barrageTrendCnt':
            text = '弹幕量'
            break
          default:
            break
        }

        return text
      }

      const formatToolTip = (params) => {
        const echartsData = props.data
        const curType = props.curType
        const target = echartsData.filter(item => item[curType] === params[0].data)[0]

        return `
          <div class="flex" style="flex-direction: column">
            <div>${target?.title}</div>
            <div>${getCurTypeText(curType)}：${toThousandsW(target?.[curType])}</div>
            <div>${target?.pubTime}</div>
          </div>
        `
      }

      const option = {
          tooltip: {
            trigger: 'axis',
            confine: true,
            formatter: (params) => {
              return formatToolTip(params)
            },
            axisPointer: {
              type: 'none'
            }
          },
          // legend: {
          //   // left: '15%',
          //   icon: 'circle',
          //   selectedMode: false
          // },
          grid: {
            bottom: '8%'
          },
          xAxis: {
            boundaryGap: true,
            type: 'category',
            axisLabel: {
              formatter: function() {
                return ''
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            axisLabel: {
              formatter: function(val) {
                // return val / 10000 >= 1 ? parseInt(val / 10000) + 'w' : val
                return toThousandsW(val)
              }
            }
          },
          series: [
              {
                type: 'bar',
                barWidth: '20%',
                label: {
                  show: true,
                  // color: '#33bdf5',
                  position: 'top',
                  formatter: (params) => {
                    return toThousandsW(params.data)
                  }
                },
                itemStyle: {
                  color: '#33bdf5',
                  borderRadius: [5, 5, 0, 0]
                },
                data: states.chartsData,
                // 标线
                markLine: {
                  symbol: 'none',
                  data: [
                    {
                      type: 'average',
                      name: '中位数',
                      label: {
                        normal: {
                          color: '#33bdf5',
                          fontWeight: 'bold',
                          fontSize: 14,
                          formatter: function(params) {
                            return toThousandsW(props.curMedian)
                          }
                        }
                      }
                    }
                  ]
                  // silent: true
                }
              }
            ]
        }

        myChart.setOption(option, true)
    }

    watch(() => props.curType, (val) => {
        states.chartsData = data.map(item => {
          return item[val]
        })
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
  height: 380px;
}
</style>
