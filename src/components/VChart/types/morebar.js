import {
  BarChart
} from 'echarts/charts'
import {
  deepClone,
  merge
} from '@/utils'
import ChartMixin from '../mixins/charts'
import Echarts from '../helper'
import Vue from 'vue'

Echarts.use([BarChart])
const DEF_LINE_CHART_OPTIONS = {
  seriesConfig: {
    type: 'morebar'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter(params) {
      if (params[0].value > 10000) {
        const data = (params[0].value / 10000).toFixed(2)
        return `<span>${params[0].seriesName}</span><br><span style="background:${params[0].color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${params[0].name} ${data}万`
      } else {
        return `<span>${params[0].seriesName}</span><br><span style="background:${params[0].color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${params[0].name} ${params[0].value}`
      }
    }
  },
  legend: {
    data: [],
    bottom: 10,
    width: 600,
    itemWidth: 8
  },
  grid: [],
  xAxis: [],
  yAxis: [],
  series: []
}
// 保留一位小数，不含四舍五入
function formatNumOne(num) {
  if (num === 0) return
  var str = num.toString().split('.')
  if (str.length > 1) {
    var floatN = str[1][0]
  }
  var num1 = str[0] + (floatN === '0' ? '' : `.${floatN}`)
  return num1
}
export default Vue.extend({
  name: 'Morebar',
  mixins: [ChartMixin],

  created() {
    this.options = deepClone(merge({}, DEF_LINE_CHART_OPTIONS, this.config))
  },
  methods: {
    _formmate() {
      try {
        const names = this.data.cates || []
        const xData = this.data.terms || []
        const values = this.data.values || []

        const colors = ['#5B8FF9', '#5AD8A6', '#F5BD17', '#E8684A', '#5D7093', '#6CC7EC', '#9270CA', '#259A99', '#FF9D4D', '#FE99C3', '#91CC75']
        if (names.length && xData.length && values.length) {
          const max = Math.max(...values.flat())
          const barCount = xData.flat().length
          const barW = formatNumOne(96 / barCount)
          names.forEach((item, k) => {
            this.options.legend.data[k] = {
              name: item.typeName,
              icon: 'circle'
            }
            const gridW = barW * xData[k].length
            let offesetL = 0
            for (var i = 0; i < k; i++) {
              offesetL += barW * xData[i].length
            }
            this.options.grid[k] = {
              top: '10%',
              left: 3 + offesetL + '%',
              width: gridW + '%',
              height: '70%'
            }
            this.options.xAxis[k] = {
              gridIndex: k,
              type: 'category',
              data: xData[k],
              boundaryGap: 'false',
              axisLabel: {
                rotate: 40
              }
            }

            this.options.yAxis[k] = {
              gridIndex: k,
              show: false,
              type: 'value',
              min: 0,
              max: max,
              axisLabel: {
                show: false // 不显示y轴坐标
              },
              axisLine: {
                show: false
              }
            }
            this.options.series[k] = {
              name: item.typeName,
              xAxisIndex: k,
              yAxisIndex: k,
              type: 'bar',
              barWidth: '70%',
              itemStyle: {
                normal: {
                  label: {
                    show: true,
                    formatter: (item) => {
                      if (item.data > 10000) {
                        const val = (item.data / 10000).toFixed(2) + 'w'
                        return val
                      } else {
                        return item.data
                      }
                    },
                    position: 'top',
                    textStyle: {
                      color: '#333',
                      fontSize: 10
                    }
                  },
                  color: colors[k] || '#2b8fff'
                }
              },
              barGap: '0%',
              data: values[k]
            }
          })
        }
      } catch (err) {
        console.error(err)
      }
    }
  }
})
