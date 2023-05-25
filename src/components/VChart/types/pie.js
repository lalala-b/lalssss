import { PieChart } from 'echarts/charts'
import ChartMixin from '../mixins/charts'
import Echarts from '../helper'
import Vue from 'vue'

Echarts.use([PieChart])

const DEF_LINE_CHART_OPTIONS = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b} : ({d}%)'
  },
  legend: {
    orient: 'vertical',
    right: '24'
  },
  seriesConfig: { type: 'pie', right: 100 }
}

export default Vue.extend({
  name: 'PieChart',
  mixins: [ChartMixin],

  created() {
    this.options = { ...DEF_LINE_CHART_OPTIONS, ...this.config }
  },
  methods: {
    _formmate() {
      this.options.series = [
        {
            name: this.data.mainName || '',
            radius: ['40%', '60%'],
            ...this.options.seriesConfig,
            data: this.data.terms.map((item, index) => {
              return {
                name: item,
                value: this.data.values[index]
              }
            }),
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }
      ]
    }
  }
})
