/** 全局基础设置 */
const BaseTheme = {
  legend: {},
  yAxis: {},
  // 折线图
  line: {
    itemStyle: {
      borderWidth: 1
    },
    lineStyle: {
      width: 2
    },
    symbolSize: 4,
    symbol: 'emptyCircle',
    smooth: true
  },
  // 柱图
  bar: {
    itemStyle: {
      barBorderWidth: 0,
      barBorderColor: '#ccc'
    },
    barMaxWidth: 40,
    barMinWidth: 4
  },
  // 饼图
  pie: {
    itemStyle: {
      borderWidth: 0,
      borderColor: '#ccc'
    }
  },
  // 类目轴
  categoryAxis: {
    boundaryGap: false,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisLabel: {
      show: true,
      color: '#87888a'
    },
    splitLine: {
      show: false
    },
    splitArea: {
      show: false
    }
  },
  // 数值轴
  valueAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisLabel: {
      show: true,
      color: '#87888a'
    },
    splitLine: {
      show: true
    },
    splitArea: {
      show: false
    }
    // min: 'dataMin'
  },
  // 对数轴
  logAxis: {
    axisLine: {
      show: false,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisTick: {
      show: false,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisLabel: {
      show: true,
      color: '#87888a'
    },
    splitLine: {
      show: true
    },
    splitArea: {
      show: false
    }
  },
  // 时间轴
  timeAxis: {
    boundaryGap: false,
    axisLine: {
      show: true,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisTick: {
      show: true,
      lineStyle: {
        color: '#87888a'
      }
    },
    axisLabel: {
      show: true,
      color: '#87888a'
    },
    splitLine: {
      show: false
    },
    splitArea: {
      show: false
    }
  },
  resize: false,
  color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16', '#E8684A', '#6DC8EC', '#9270CA', '#FF9D4D', '#269A99', '#FF99C3', '#6c81d8', '#ec66a9']
}
export default BaseTheme
