import { deepClone, merge } from '@/utils'
import ChartMixin from '../mixins/charts'
// import Echarts from '../helper'
import Vue from 'vue'
import BaseTheme from '../theme'
import { gradientColors } from '@/utils/color'
require('../map/china')

const COLOR_STEP = 34
const DEF_MAP_OPTIONS = {
  series: [{
    name: '数据',
    type: 'map',
    mapType: 'china',
    roam: false, // 禁止拖动地图
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: true,
        position: 'inside'
      }
    },
    itemStyle: { borderColor: '#eef' },
    data: [] // 传入的数据
  }],
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: '{c}%'
  },
  visualMap: {
    precision: 1,
    calculable: true,
    realtime: true,
    // align: 'top',
    inRange: {
      color: gradientColors('#e1effe', BaseTheme.color[0], COLOR_STEP)
    },
    min: 0,
    max: 20,
    left: 'center',
    bottom: '0',
    orient: 'horizontal'
  }

}

export default Vue.extend({
  name: 'MapChart',
  mixins: [ChartMixin],

  created() {
    this.options = deepClone(merge({}, DEF_MAP_OPTIONS, this.config))
  },
  methods: {
    _formmate() {
      const data = []
      const max = Math.max(...this.data.values)
      const min = Math.min(...this.data.values)
      this.options.visualMap.max = max
      this.options.visualMap.min = min
      let hasNanHai = false
      let hasTaiwan = false
      this.data.values.forEach((item, index) => {
        if (this.data.terms[index] === '南海诸岛') hasNanHai = true
        if (this.data.terms[index] === '台湾') hasTaiwan = true
        data.push({
          value: item,
          name: this.data.terms[index]
        })
      })
      if (!hasNanHai) {
        data.push({
          value: 0,
          name: '南海诸岛'
        })
      }
      if (!hasTaiwan) {
        data.push({
          value: 0,
          name: '台湾'
        })
      }
      this.options.series[0].data = data
    }
  }
})
