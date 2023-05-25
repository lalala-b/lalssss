import {
  BarChart,
  LineChart
} from 'echarts/charts'
import {
  deepClone,
  merge
} from '@/utils'
import ChartMixin from '../mixins/charts'
import Echarts from '../helper'
import Vue from 'vue'

Echarts.use([BarChart, LineChart])

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
    data: [{
        name: '',
        icon: 'circle'
      },
      {
        name: '',
        icon: 'circle'
      },
      {
        name: '',
        icon: 'circle'
      }
    ],
    bottom: 0
  },
  grid: [{
    left: 50,
    right: 50,
    top: '5%',
    height: '35%'
  }, {
    left: 50,
    right: 50,
    top: '40%',
    height: '35%'
  }],
  xAxis: [{
      type: 'category',
      boundaryGap: 'false',
      axisLine: {
        show: true
      },
      data: [],
      axisLabel: {
        show: false
      }
    },
    {

      gridIndex: 1,
      type: 'category',
      position: 'top',
      offset: -190,
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      boundaryGap: 'false'
    }
  ],
  yAxis: [{
      show: false,
      type: 'value',
      splitLine: {
        show: true
      },
      axisTick: {
        show: false
      }
    },
    {
      show: false,
      gridIndex: 1,
      type: 'value',
      inverse: true,
      splitLine: {
        show: true
      },
      axisTick: {
        show: false
      }
    }
  ],
  series: [{
      type: 'bar',
      barWidth: '70%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'top'
          },
          color: '#2b8fff'
        }
      },
      barGap: '0%',
      data: []
    },
    {
      type: 'bar',
      xAxisIndex: 1,
      yAxisIndex: 1,
      barWidth: '70%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'bottom'
          },
          color: '#6BC7EC'
        }
      },
      data: []
    },
    {
      type: 'bar',
      barWidth: '70%',
      itemStyle: {
        normal: {
          label: {
            show: true,
            position: 'top'
          },
          color: '#5AD8A6'
        }
      },
      data: []
    }
  ]
}

export default Vue.extend({
  name: 'Splicebar',
  mixins: [ChartMixin],

  created() {
    this.options = deepClone(merge({}, DEF_LINE_CHART_OPTIONS, this.config))
  },
  methods: {
    _formmate() {
      try {
        const cates = this.data.cates || []
        const yData = this.data.values || []
        const xData = this.data.term || []
        if (cates) {
          this.options.legend.data.forEach((item, index) => {
            item.name = cates[index].typeName
          })
        }
        if (yData) {
          this.options.series.forEach((item, index) => {
            item.data = yData[index]
            item.name = cates[index].typeName
            item.itemStyle.normal.label.formatter = (item) => {
              if (item.data > 10000) {
                const val = (item.data / 10000).toFixed(2) + 'w'
                return val
              } else {
                return item.data
              }
            }
          })
        }
        if (xData) {
          this.options.xAxis.forEach((item, index) => {
            item.data = xData
          })
        }
        this.options.series.length = cates.length
      } catch (err) {
        console.log(err)
      }
    }
  }
})
