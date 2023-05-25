import { LineChart } from 'echarts/charts'
import { isNumber, isArray, formatNum } from '@/utils'
import ChartMixin from '../mixins/charts'
import AxisMinxi from '../mixins/axis'
import Echarts from '../helper'
import Vue from 'vue'

Echarts.use([LineChart])

const DEF_LINE_CHART_OPTIONS = {
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'solid'
      }
    }
  },
  dataZoom: [
    {
      type: 'slider',
      show: true,
      xAxisIndex: 0,
      height: 17,
      left: '80',
      right: '80'
    }
  ],
  grid: {
    left: '6%',
    right: '6%',
    bottom: '12%',
    containLabel: true
  }
}

export default Vue.extend({
  name: 'LineChart',
  mixins: [ChartMixin, AxisMinxi],

  created() {
    this.options = { ...DEF_LINE_CHART_OPTIONS, ...this.config }
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
      this.options.yAxis && (this.options.yAxis.axisLabel = axisLabel)
    }
  }
})
