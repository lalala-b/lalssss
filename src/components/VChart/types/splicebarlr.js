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
    type: 'splicebar'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function(params) {
      if (!params && !params.length) return
      const format = params.map((item, index) => {
        if (item.value > 10000) {
          const data = (item.value / 10000).toFixed(2)
          return `${index === 0 ? `${item.name}<br>` : ''}<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${item.seriesName}${data}万<br>`
        } else {
          return `${index === 0 ? `${item.name}<br>` : ''}<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${item.seriesName}${item.value}<br>`
        }
      })
      if (format.length > 1) {
        return format[0] + format[1]
      } else {
        return format[0]
      }
    }
  },
  legend: {
    data: [],
    bottom: 20
  },
  grid: [{
      top: '0%',
      left: '56%',
      height: '88%'
    },
    {
      top: '0%',
      right: '55%',
      height: '88%'
    }
  ],
  yAxis: [{
      type: 'category',
      boundaryGap: 'false'
    },
    {
      show: false,
      gridIndex: 1,
      type: 'category',
      boundaryGap: 'false'
    }
  ],
  xAxis: [
    {
      show: false,
      type: 'value',
      min: 0,
      splitLine: {
        show: true
      }
    },
    {
      gridIndex: 1,
      type: 'value',
      show: false,
      splitLine: {
        show: true
      },
      inverse: true
    }
  ],
  series: [{
      type: 'bar',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#333',
              fontSize: 10
            }
          },
          color: '#5AD8A6'
        }
      }
    },
    {
      xAxisIndex: 1,
      yAxisIndex: 1,
      type: 'bar',
      barWidth: '50%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'left',
            textStyle: {
              color: '#333',
              fontSize: 10
            }
          },
          color: '#5B8FF9'
        }
      }
    },
    {
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'right',
            textStyle: {
              color: '#333',
              fontSize: 10
            }
          },
          color: '#6BC7EC'
        }
      }
    }
  ]

}

export default Vue.extend({
  name: 'Splicebarlr',
  mixins: [ChartMixin],

  created() {
    this.options = deepClone(merge({}, DEF_LINE_CHART_OPTIONS, this.config))
  },
  methods: {
    _formmate() {
      try {
        const names = this.data.cates || []
        const yData = this.data.values || []
        const xData = this.data.term || []
        if (names.length) {
          const max = Math.max(...yData.slice(0, 1).flat()) || 0
          const max1 = Math.max(...yData.slice(1, 3).flat()) || 0
          names.forEach((item, index) => {
            this.options.legend.data[index] =
            {
              name: item.typeName,
              icon: 'circle'
            }
            this.options.series[index].name = item.typeName
            this.options.series[index].data = yData[index]
            this.options.series[index].itemStyle.normal.label.formatter = (item) => {
              if (item.data > 10000) {
                const val = (item.data / 10000).toFixed(2) + 'w'
                return val
              } else {
                return item.data
              }
            }
            this.options.xAxis[0].max = max
            this.options.xAxis[1].max = max1
            if (index < 2) {
              this.options.yAxis[index].data = xData
            }
          })
        }
        this.options.series.length = names.length
      } catch (err) {
        console.log(err)
      }
    }
  }
})
