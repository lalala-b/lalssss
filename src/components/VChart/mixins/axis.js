import { isArray, copy } from '@/utils'
export default {
  mounted() {
      if (this.options && !this.options.yAxis) {
        this.options.yAxis = {}
      }
  },
  methods: {
    _formmate() {
      try {
        this.options.xAxis.data = this.data[this.map.x]
        const yData = this.data[this.map.y]
        const cates = this.data[this.map.cates]
        let series = null

        if (isArray(this.options.yAxis)) {
          // 多轴
          series = []
          if (!isArray(yData[0])) {
            console.error(`数据格式不对`)
            return
          }
          for (let i = 0; i < yData.length;) {
            this.options.yAxis.forEach((_, index) => {
            // 多轴
              const item = {
                ...(this.options.seriesConfig || { type: 'line' }),
                data: yData[i] || [],
                yAxisIndex: index,
                name: cates[i]
              }
              _.name = cates[i]

              let max = Math.ceil(Math.max(...yData[i]) / 5) * 5
              const min = Math.floor(Math.min(...yData[i]) / 5) * 5
              if (max === min) max += 50

              _.max = max
              _.min = min
              _.interval = Math.ceil((max - min) / 5)
              item.min = min
              item.max = max
              series.push({ ...item })
              i++
            })
          }
        } else {
          if (isArray(yData[0])) {
            series = []
            yData.forEach((_, index) => {
              series.push({
                ...(this.options.seriesConfig || { type: 'line' }),
                data: _,
                name: cates[index]
              })
            })
          } else {
            series = {
              ...(this.options.seriesConfig || {}),
              data: yData,
              name: cates[0]
            }
          }
        }
        this.options.series = copy(series)
        this.options.legend = {
          ...(this.options.legend || {}),
          data: cates
        }
        if (this.options.yAxis.type === 'category') {
          const xAxis = this.options.yAxis
          this.options.yAxis = { ...this.options.xAxis }
          this.options.yAxis.type = 'category'
          this.options.xAxis = { ...xAxis }
          this.options.xAxis.type = 'value'
        }
        // if (this.options.legend.show === false) {
          // this.options.grid.top = '3%'
        // }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
