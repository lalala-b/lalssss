import {
  ref,
  reactive,
  toRefs,
  getCurrentInstance
} from '@vue/composition-api'
import BaseTheme from '@/components/VChart/theme'
import {
  isArray,
  isNumber
} from '@/utils'
import {
  $getHistoryList,
  $getWeekAllData
} from '@/api/data'
export const useTime = function() {
  const { $message } = getCurrentInstance().proxy
  const states = reactive({
    pageLoading: false,
    historys: [],
    pageTime: {
      startTime: '',
      endTime: ''
    },
    monthTime: '',
    showHistory: false,
    currentHistory: 0 // 记录当前选择的时间段
  })
  const summary = ref({
    sumTitle: {
      text: 'cpm',
      val: null,
      tip: 'cpm=投放金额/(流量/1000)，即千次播放价格'
    },
    sumFlow: {
      text: 'cpa',
      val: null,
      tip: 'CPA=投放金额/新增激活，即拉新用户的广告成本；其中点击新增激活统计口径为有点击组件且历史从未安装app的可监测新用户，快手侧数据为曝光口径，因此快手新增激活统计口径为曝光用户下载App的监测用户量'
    },
    sumScore: {
      text: 'cps',
      val: null,
      tip: 'cps=投放金额/C2B签收订单量，即C2B签收订单的广告成本'
    },
    sumMoney: {
      text: '流量拉新率',
      val: null,
      tip: '流量拉新率 = 新增激活/（流量/10000），即每1w播放带来的新增激活用户数'
    }
  })

  const handleChangeTime = (index, currentData) => {
    states.currentHistory = index
    const timeArr = currentData.startEnd.split('----')
    states.pageTime = {
      startTime: timeArr[0],
      endTime: timeArr[1]
    }
    states.showHistory = false
    states.monthTime = currentData.monthTime
    getDataFlowScore()
    getPageData()
  }
  const getDataFlowScore = () => {}

  const getHistoryList = (typeFlag) => {
    states.pageLoading = true
    $getHistoryList({
      typeFlag
    }).then((res) => {
      if (res.code === 1) {
        states.historys = [...res.data]
        handleChangeTime(0, res.data[0]) // 默认选中第一个
      }
    }).finally(() => {
      states.pageLoading = false
    })
  }
  const getPageData = () => {
    // states.loading.summary = true
    $getWeekAllData(states.pageTime)
      .then((re) => {
        if (re.code === 1) {
          for (const key in summary) {
            summary[key].val = re.data[key]
          }
          states.headTips = re.data.tips
        } else {
          $message.error(re.message)
        }
        // states.loading.summary = false
      })
      .catch((err) => {
        if (err.__CANCEL__) return
        // states.loading.summary = false
      })
  }
  const handleHeaderTimeChange = (pageTime, monthTime) => {
    states.pageTime = pageTime
    states.monthTime = monthTime
    getDataFlowScore()
    getPageData()
  }
  return {
    summary,
    getHistoryList,
    ...toRefs(states),
    handleHeaderTimeChange
  }
}
export const ChartFormatMethods = function() {
  const tooltipFormaterUnit =
    (unit, dividend = 1) => {
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
    }
  return {
    tooltipFormaterUnit
  }
}
