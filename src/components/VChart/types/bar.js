import { BarChart, LineChart } from 'echarts/charts'
import { isNumber, isArray, formatNum, deepClone, merge } from '@/utils'
import ChartMixin from '../mixins/charts'
import AxisMinxi from '../mixins/axis'
import Echarts from '../helper'
import Vue from 'vue'

Echarts.use([BarChart, LineChart])

const DEF_LINE_CHART_OPTIONS = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    confine: true
  },
  xAxis: {
    align: 'center',
    type: 'category'
  },
  seriesConfig: {
    type: 'bar'
  },
  grid: {
    top: '7%',
    left: '3%',
    right: '60',
    bottom: '3%',
    containLabel: true
  }
}

export default Vue.extend({
  name: 'BarChart',
  mixins: [ChartMixin, AxisMinxi],

  created() {
    this.options = deepClone(merge({}, DEF_LINE_CHART_OPTIONS, this.config))
    const axisLabel = {
      formatter: (value) => {
        if (!isNumber(value)) return value
        return formatNum(value)
      }
    }
    if (isArray(this.options.yAxis)) {
      this.options.yAxis.forEach(item => {
        item.min = item => Math.ceil(item.min - item.min * 0.01)
        item.axisLabel = axisLabel
      })
    } else {
      if (this.options && !this.options.yAxis) {
        this.options.yAxis = {}
      }
      Object.assign(axisLabel, this.options.yAxis.axisLabel || {})
    }
  }
})
