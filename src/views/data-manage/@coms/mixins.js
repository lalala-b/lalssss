import {
  $getHistoryList
} from '@/api/data'
import BaseTheme from '@/components/VChart/theme'
import {
  isArray,
  isNumber
} from '@/utils'
import header from './header'

export default {
  components: {
    VHeader: header
  },
  data() {
    const axisLabelFormat = {
      axisLabel: {
        formatter: '{value} w'
      }
    }
    this.barChartConfig = {
      xAxis: {
        boundaryGap: true
      }
    }
    this.barChartConfigType = {
      ...this.barChartConfig,
      yAxis: {
        type: 'category',
        ...axisLabelFormat
      }
    }
    this.barChartConfigAb = {
      ...this.barChartConfig,
      yAxis: {
        type: 'value',
        ...axisLabelFormat
      }
    }

    this.barAndLineChartConfig = {
      ...this.barChartConfig,
      seriesConfig: {
        label: {
          show: true,
          position: 'top',
          color: 'inherit'
        }
      }
    }
    this.rowBarChartConfig = {
      ...this.barChartConfig,
      yAxis: {
        type: 'category'
      },
      legend: {
        show: false
      }
    }
    this.toolTipUnit = {
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
              return `${index === 0 ? `${item.name}<br>` : ''}<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${item.seriesName} ${data}万<br>`
            } else {
              return `${index === 0 ? `${item.name}<br>` : ''}<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span> ${item.seriesName} ${item.value}<br>`
            }
          })
          if (format.length > 1) {
            return format[0] + format[1]
          } else {
            return format[0]
          }
        }
      }
    }
    this.rowBarChartConfigType = {
      ...this.barChartConfig,
      yAxis: {
        type: 'category',
        ...axisLabelFormat
      },
      legend: {
        show: false
      }
    }
    this.rowBarChartConfigTypeYF = {
      ...this.barChartConfig,
      ...this.toolTipUnit,
      yAxis: {
        type: 'category',
        show: false
      },
      legend: {
        show: false
      }
    }

    // 垂直bar
    this.rowBarChartConfigTypeVertical = {
     ...this.toolTipUnit,
      grid: {
        left: '5%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: 'false'
      },
      yAxis: {
        show: false,
        axisLabel: {
          show: false
        },
        type: 'value'
      },
      legend: {
        show: false
      },
      seriesConfig: {
        label: {
          show: true,
          position: 'top'
        }
      }
    }
    this.rowBarChartHiddenConfig = {
      ...this.rowBarChartConfig,
      axisLabel: {
        formatter(val) {
          const size = 6
          if (val.length > size) {
            val = val.substr(0, size)
            return `${val}...`
          }
          return val + 'w'
        }
      }
    }
    this.rowBarChartHiddenConfigType = {
      ...this.rowBarChartConfigType,
      axisLabel: {
        formatter(val) {
          const size = 6
          if (val.length > size) {
            val = val.substr(0, size)
            return `${val}...`
          }
          return val
        }
      }
    }
    this.barStackChartConfig = {
      ...this.barChartConfig,
      seriesConfig: {
        stack: 'one'
      }
    }
    this.barStackChartConfigType = {
      ...this.barChartConfig,
      seriesConfig: {
        stack: 'one'
      },
      yAxis: {
        type: 'value',
        ...axisLabelFormat
      }
    }
    this.barStackLegendRightChartConfig = {
      ...this.barStackChartConfig,
      legend: {
        orient: 'vertical',
        right: '24',
        top: '3%'
      },
      grid: {
        right: '140',
        top: '3%'
      }
    }
    this.barStackLegendRightChartConfigType = {
      ...this.barStackChartConfig,
      legend: {
        orient: 'vertical',
        right: '24',
        top: '3%'
      },
      grid: {
        right: '140',
        top: '3%'
      },
      yAxis: {
        type: 'value',
        ...axisLabelFormat
      }
    }
    this.pieChartConfig = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}({d}%)'
      }
    }

    this.lineChartCondig = {
      dataZoom: [{
        show: false
      }]
    }
    this.splicebarConfig = {
      // tooltip: {
      //   trigger: 'item'
      // },
      // grid: [{
      //   left: 50,
      //   right: 50,
      //   top: '10%',
      //   height: '40%'
      // }, {
      //   left: 50,
      //   right: 50,
      //   top: '50%',
      //   height: '40%'
      // }],
      // xAxis: [
      //   {
      //     type: 'category',
      //     data: [],
      //     axisPointer: {
      //       type: 'shadow'
      //     }
      //   },
      //   {
      //     gridIndex: 1,
      //     type: 'category',
      //     axisPointer: {
      //       type: 'shadow'
      //     },
      //     position: 'top',
      //     offset: -180,
      //     axisTick: { show: false },
      //     axisLine: { show: false }
      //   }
      // ],
      // yAxis: [
      //   {
      //     type: 'value',
      //     splitLine: { show: false },
      //     axisTick: { show: false }
      //   },
      //   {
      //     gridIndex: 1,
      //     type: 'value',
      //     inverse: true,
      //     splitLine: { show: false },
      //     axisTick: { show: false }
      //   }
      // ],
      // series: [
      //   {
      //     type: 'bar',
      //     barWidth: 14,
      //     itemStyle: {
      //       normal: {
      //         color: '#2b8fff'
      //       }
      //     },
      //     barGap: '0%',
      //     data: []
      //   },
      //   {
      //     type: 'bar',
      //     barWidth: 14,
      //     itemStyle: {
      //       normal: {
      //         color: '#15bafe'
      //       }
      //     },
      //     data: []
      //   },
      //   {
      //     type: 'bar',
      //     xAxisIndex: 1,
      //     yAxisIndex: 1,
      //      barWidth: 14,
      //     itemStyle: {
      //       color: '#F5BD17'
      //     },
      //     data: []
      //   }

      // ]
    }
    const flowChartConfig = {
      height: 600,
      setColor: 'orange',
      legend: {
        show: true
      },
      grid: {
        containLabel: true,
        left: '1%',
        right: '1%'
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category'
      },
      one: false
    }
    return {
      pageLoading: false,
      rankConfig: {
        height: 600,
        legend: {
          show: true
        },
        grid: {
          left: '-80',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        category: {
          axisLabel: {
            align: 'left',
            margin: 110
          }
        },
        one: false,
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            return info.map((item, index) => {
              return `<span>${item.name}</span><br><span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}万`
            })
          }
        }
      },
      showLabelFlowChart: {
        height: 600,
        setColor: 'orange',
        legend: {
          show: true
        },
        grid: {
          containLabel: true,
          left: '2%',
          right: '5%'
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        one: false,
        labelPosition: 'right',
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            return info.map((item, index) => {
              if (index === 0) {
                return `<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}万`
              }
              return `<br><span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}万`
            })
          }
        }
      },
      flowChartConfig: {
        ...flowChartConfig,
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            return info.map((item, index) => {
              if (index === 0) {
                return `<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}万`
              }
              return `<br><span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}万`
            })
          }
        }
      },
      flowChartConfig1: {
        ...flowChartConfig,
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            return info.map((item, index) => {
              if (index === 0) {
                return `<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}元`
              }
              return `<br><span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}元`
            })
          }
        }
      },
      flowChartConfig2: {
        ...flowChartConfig,
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            return info.map((item, index) => {
              if (index === 0) {
                return `<span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}`
              }
              return `<br><span style="background:${item.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${item.seriesName}:${item.value}`
            })
          }
        }
      },
      transferChart: {
        color: ['#409EFF'],
        legend: {
          show: false
        },
        grid: {
          left: 90,
          right: 40,
          top: 10,
          bottom: 20
        },
        category: {
          axisLabel: {
            formatter(val) {
              const size = 6
              if (val.length > size) {
                val = val.substr(0, size)
                return `${val}...`
              }
              return val
            }
          }
        },
        tooltip: {
          formatter: function(info) {
            if (!info || !info.length) {
              return
            }
            const data = this.chartsData[`o_${info[0].seriesName}`]
            if (!data) {
              return
            }

            const item = data[data.length - info[0].dataIndex - 1]
            if (!item || !info || !info[0]) {
              return
            }
            switch (info[0].seriesName) {
              case 'accountFans':
                return [
                  `账号: ${item.accountName}`,
                  `平台: ${item.platName}`,
                  `分组：${item.belongTeam}`,
                  `新增粉丝: ${item.addFans}`
                ].join('<br />')

              case 'accountFlow':
                return [
                  `账号: ${item.accountName}`,
                  `平台: ${item.platName}`,
                  `新增流量: ${info[0].data}万`
                ].join('<br />')
              case 'titleFlow':
                return [
                  `标题: ${item.title}`,
                  `账号: ${item.accountName}`,
                  `平台: ${item.platName}`,
                  `总流量: ${info[0].data}万`,
                  `发布时间: ${item.publishTime}`
                ].join('<br />')
              case 'advFlowTop':
                return [
                  `标题: ${item.title}`,
                  `账号: ${item.accountName}`,
                  `平台: ${item.platName}`,
                  `分组：${item.belongTeam}`,
                  `流量：${info[0].data}万`
                ].join('<br />')
              case 'flowTop':
                return [
                  `标题: ${item.title}`,
                  `账号: ${item.accountName}`,
                  `平台: ${item.platName}`,
                  `分组：${item.belongTeam}`,
                  `流量：${info[0].data}万`
                ].join('<br />')
              case 'qpMoneyFlow':
                return [`${info[0].name}:${info[0].data}元`]
              case 'qpFlowNumber':
                return [`${info[0].name}:${info[0].data}`]
              default: {
                return [`${info[0].name}:${info[0].data}万`]
              }
            }
          }.bind(this),
          confine: true
        },
        onClick: function(res, chart) {
          if (chart.conf.name === 'video') {
            const data = this.chartsData[`o_${res.seriesName}`]
            if (!data) {
              return
            }
            const item = data[data.length - res.dataIndex - 1]
            if (item && item.url) {
              const win = window.open(item.url)
              if (!win) {
                this.$tip('请允许在本页打开新窗口')
              }
            }
          }
        }.bind(this)
      },
      historys: [],
      pageTime: {
        startTime: '',
        endTime: ''
      },
      monthTime: '',
      showHistory: false,
      currentHistory: 0 // 记录当前选择的时间段
    }
  },
  computed: {
    rowBarChartConfigByUnit() {
      return (unit) => {
        const config = {
          tooltip: {
            formatter: function(info) {
              return `<span>${info.name}</span><br><span style="background:${info.color};display:inline-block;width:10px;height:10px;border-radius:50%;"></span>${info.seriesName}:${info.value}${unit}`
            }
          }
        }
        return Object.assign({}, this.rowBarChartConfig, config)
      }
    },
    rowBarChartConfigShowLabelByUnit() {
      return (unit) => {
        return Object.assign({}, this.rowBarChartConfig, {
          seriesConfig: {
            label: {
              show: true,
              position: 'right',
              formatter: `{c}${unit}`
            }
          }
        })
      }
    },
    rowBarChartConfigShowLabelByUnitType() {
      return (unit) => {
        return Object.assign({}, this.rowBarChartConfigType, {
          seriesConfig: {
            label: {
              show: true,
              position: 'right',
              formatter: `{c}${unit}`
            }
          }
        })
      }
    }
  },
  created() {},
  methods: {
    processScoreData(values) {
      if (values[0] && Array.isArray(values[0])) {
        // 多维数组
        values = values.map((item) => {
          return this.maintain2(item)
        })
      } else {
        values = this.maintain2(values)
      }
      return values
    },
    maintain2(data) {
      return data.map((item) => {
        return Array.isArray(item) ? item.map(d => d.toFixed(2)) : item.toFixed(2)
      })
    },
    handleChangeTime(index, currentData) {
      this.currentHistory = index
      const timeArr = currentData.startEnd.split('----')
      this.pageTime = {
        startTime: timeArr[0],
        endTime: timeArr[1]
      }
      this.showHistory = false
      this.monthTime = currentData.monthTime
      this.getDataFlowScore()
      this.getPageData()
    },
    handleHeaderTimeChange(pageTime, monthTime) {
      this.pageTime = pageTime
      this.monthTime = monthTime
      this.getDataFlowScore()
      this.getPageData()
    },
    getHistoryList(typeFlag) {
      this.pageLoading = true
      $getHistoryList({
        typeFlag
      }).then((res) => {
        if (res.code === 1) {
          this.historys = [...res.data]
          this.handleChangeTime(0, res.data[0]) // 默认选中第一个
        }
      }).finally(() => {
        this.pageLoading = false
      })
    },
    lineAndBarformater(options) {
      options.yAxis = [{
        ...options.yAxis,
        show: false
      }, {
        type: 'value',
        show: false
      }]
      options.legend.data = options.legend.data.map(item => item.typeName)
      options.series.forEach((item, index) => {
        item.name = options.legend.data[index]
      })
      options.series[2].type = 'line'
      options.series[2].yAxisIndex = 1
      options.series[2].smooth = false
      return options
    },
    tooltipFormaterUnit(unit, dividend = 1) {
      return (options) => {
        let formatter = ''
        let s = ''
        if (options.seriesConfig.type === 'pie') {
          s = '({d}%)'
        }
        if (isArray(options.series)) {
          formatter = `{b}<br />` + options.series.map((item, index) => `<span style="background:${BaseTheme.color[index]};display:inline-block;width:10px;height:10px;border-radius:50%; margin-right:6px"></span>{a${index}}: {c${index}}${unit}${s}`).join('<br />')
        } else {
          formatter = `{b}<br /><span style="background:${BaseTheme.color[0]};display:inline-block;width:10px;height:10px;border-radius:50%; margin-right:6px"></span>{a0}: {c}${unit}${s}`
        }
        options.tooltip.formatter = formatter
        if (dividend !== 1 && isNumber(dividend)) {
          options.series.forEach(item => {
            item.data.forEach(d => {
              d.value = (d.value / dividend).toFixed(2)
            })
          })
        }
        return options
      }
    },
    tooltipFormaterVideo(options) {
      const formatter = function(info) {
        if (!info || !info.length) {
          return
        }
        const data = this.chartsData[`o_${info[0].seriesName}`]
        if (!data) {
          return
        }

        const item = data[data.length - info[0].dataIndex - 1]
        if (!item || !info || !info[0]) {
          return
        }
        switch (info[0].seriesName) {
          case 'accountFans':
            return [
              `账号: ${item.accountName}`,
              `平台: ${item.platName}`,
              item.belongTeam ? `分组：${item.belongTeam}` : '',
              `新增粉丝: ${item.addFans}`
            ].join('<br />')

          case 'accountFlow':
            return [
              `账号: ${item.accountName}`,
              `平台: ${item.platName}`,
              `新增流量: ${info[0].data}万`
            ].join('<br />')
          case 'titleFlow':
            return [
              `标题: ${item.title}`,
              `账号: ${item.accountName}`,
              `平台: ${item.platName}`,
              `总流量: ${info[0].data}万`,
              `发布时间: ${item.publishTime}`
            ].join('<br />')
          case 'advFlowTop':
            return [
              `标题: ${item.title}`,
              `账号: ${item.accountName}`,
              `平台: ${item.platName}`,
              `分组：${item.belongTeam}`,
              `流量：${info[0].data}万`
            ].join('<br />')
          case 'flowTop':
            return [
              `标题: ${item.title}`,
              `账号: ${item.accountName}`,
              `平台: ${item.platName}`,
              `分组：${item.belongTeam}`,
              `流量：${info[0].data}万`
            ].join('<br />')
          case 'qpMoneyFlow':
            return [`${info[0].name}:${info[0].data}元`]
          case 'qpFlowNumber':
            return [`${info[0].name}:${info[0].data}`]
          default: {
            return [`${info[0].name}:${info[0].data}万`]
          }
        }
      }
      options.tooltip.formatter = formatter.bind(this)
      return options
    },
    handleVideoChartClick(res) {
      const data = this.chartsData[`o_${res.seriesName}`]

      if (!data) {
        return
      }
      const item = data[data.length - res.dataIndex - 1]
      if (item && item.url) {
        const win = window.open(item.url)
        if (!win) {
          this.$tip('请允许在本页打开新窗口')
        }
      }
    }
  }
}
