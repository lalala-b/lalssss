<template>
  <VChart
    type="bar"
    :config="rowBarChartConfigType"
    :data="data"
    :formater="tooltipFormaterUnit('万', unit)"
  />
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from '@vue/composition-api'
import { VChart } from 'components'
import BaseTheme from '@/components/VChart/theme'
import { isNumber, copy, formatUnit } from '@/utils'
export default defineComponent({
  components: {
    VChart
  },
  props: {
    echartsData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    source: {
      type: String,
      default: ''
    },
    industryType: {
      type: String,
      default: '1'
    },
    searchData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    unit: {
      type: Number,
      default: 10000
    }
  },
  setup(props) {
    const { $router, $route } = getCurrentInstance().proxy
    const states = reactive({
      rowBarChartConfigType: {
        legend: {
          bottom: 0,
          selectedMode: false
        },
        tooltip: {
          // triggerOn: 'click',
          enterable: true,
          formatter: function(params) {
            return formatToolTip(params)
          },
          trigger: 'axis'
        },
        grid: {
          bottom: '8%'
        },
        xAxis: {
          boundaryGap: true,
          type: 'category',
          axisLabel: {
            rotate: 60,
            color: '#222',
            formatter: function(value, index) {
              // if (+props.type === 1) {
              //  const platId = props.echartsData.platIds[index]
              //  return `{img${platId}|}\n{value|${value}}`
              // } else {
              //  return `{value|${value}}`
              // }
              return value
            }
            // 坐标轴x文本展示图标
            // rich: {
            //   img25: {
            //     height: 20,
            //     width: 20,
            //     lineHeight: 30,
            //     backgroundColor: { image: 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_25.png' }
            //   },
            //   img26: {
            //     height: 20,
            //     width: 20,
            //     lineHeight: 30,
            //     backgroundColor: { image: 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_26.png' }
            //   },
            //   img2: {
            //     height: 20,
            //     width: 20,
            //     lineHeight: 30,
            //     backgroundColor: { image: 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_2.png' }
            //   },
            //   img45: {
            //     height: 20,
            //     width: 20,
            //     lineHeight: 30,
            //     backgroundColor: { image: 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_45.png' }
            //   }
            // }
          }
        },
        yAxis: {
          axisLabel: {
            formatter: function(val) {
              return props.unit === 1 ? val : val + 'w'
            }
          }
        }
      },
      data: {},
      linkData: []
    })
    if ($route.name === 'bussiness-analysis') {
      states.rowBarChartConfigType.tooltip.triggerOn = 'click'
    }
    watch(
      () => props.echartsData,
      (val) => {
        if (val && Object.keys(val).length) {
          const obj = copy(val)
          if (obj.terms.length > 15) {
            obj.terms = obj.terms.slice(0, 15)
          }
          states.data = obj
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    window.echartBarClick = function(industryType = 1) {
      const data = window.echartItemData
      const { groupId, teamId, belongMonthList = '' } = props.searchData
      const industry = +industryType === 1 ? { firstField: data[0].axisTitle } : { secondField: data[0].axisTitle }
      $router.push({
        path: `/bussiness-manage/account-track`,
        query: {
            ...industry,
            months: belongMonthList ? JSON.stringify(belongMonthList) : '',
            groupId: groupId || '',
            teamId: teamId || '',
            _blank: true
          }
      })
    }
    const findData = (term, month, type) => {
      const dataObj = props.echartsData
      const indexTerm = type && type === 'accountId' ? Number(dataObj.accountIds.indexOf(term)) : Number(dataObj.terms.indexOf(term))
      const indexMonth = Number(dataObj.cates.indexOf(month))
      const item = dataObj.values[indexMonth][indexTerm] || {}
      return item.value
    }
    const formatToolTip = (params) => {
      const unit = props.unit
      const list = params
      const arr = []
      const accountIds = props.echartsData.accountIds
      if (accountIds && accountIds.length) {
        list.forEach((item, index) => {
          arr.push({ axisTitle: item.axisValueLabel, ...item.data, month: item.seriesName, accountId: accountIds[list[0].dataIndex] })
        })
      } else {
        list.forEach((item) => {
          arr.push({ axisTitle: item.axisValueLabel, ...item.data, month: item.seriesName })
        })
      }

      window.echartItemData = arr
      const title = list.length ? list[0].axisValueLabel : ''
      const totalObj = totalFormat(title, arr)
      const a = arr.map(
        (item, index) => {
            item.value = item.accountId ? findData(item.accountId, item.month, 'accountId') : findData(item.axisTitle, item.month)
            const value = formatUnit(item.value)
            return `<div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;"><div class="flex flex-align-center"><div style="width:10px;height: 10px;background:${BaseTheme.color[index]};border-radius: 50%;"></div><div style="width:70px;margin-left:6px;color:${BaseTheme.color[index]}">${item.month}</div></div><div style="width:${unit === 1 ? 30 : 60}px;margin-left:8px;text-align:center">${value}</div><div style="width:50px;margin-left:16px;display:${props.type ? 'none' : 'block'}">${((item.percent || 0) * 100).toFixed(2)}%</div></div>`
          }
      )
      const totalValue = Number(String(totalObj.value).split('.')[0]) > 100000000 ? (totalObj.value / 100000000).toFixed(2) + '亿' : `${unit === 1 ? totalObj.value : (totalObj.value / unit).toFixed(2) + 'w'}`
       let imgUrl = ''
      if (props.type) {
        imgUrl = `https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${props.echartsData.platIds[params[0].dataIndex]}.png`
      }
      return `
      <div class="flex" style="justify-content: ${props.type ? 'flex-start' : 'space-between'}">
        <img src="${imgUrl}" style="display:${props.type ? 'inline-block' : 'none'};width:18px;height:18px">
        <div style="color:#333;margin:0 0 4px 6px">${title}</div>
        <div style="display:${props.source ? 'block' : 'none'};margin-left:10px;font-weight:500;font-size:13px;color:#3b8ef9" onclick="echartBarClick(${props.industryType})">账号赛道分布<i class="iconfont iconyoushuangjiantou" style="font-weight:500;font-size:13px"></i></div>
      </div>
      <div style="display:flex;flex-direction:row;align-items:center;justify-content:space-between;font-weight:500;color:#000"><div style="width:80px;margin-left:6px">总计</div> <div style="width:${unit === 1 ? 30 : 60}px;margin-left:8px;text-align:center">
      ${totalValue}</div><div style="width:50px;margin-left:16px;display:${props.type ? 'none' : 'block'}">${(totalObj.percent * 100).toFixed(2)}%</div></div>
      ${a.join('')}`
    }
    const totalFormat = (val, arr) => {
      let accountId = ''
      if (arr && arr.length) {
        accountId = arr[0].accountId
      }
      const index = accountId ? states.data.accountIds.findIndex((item) => item === accountId) : states.data.terms.findIndex((item) => item === val)
      return states.data.termTotal[index]
    }
    const tooltipFormaterUnit = (unit = '', dividend) => {
      return (options) => {
        if (dividend !== 1 && isNumber(dividend)) {
          options.series.forEach((item) => {
            item.data.forEach((d) => {
              d.value = (d.value / dividend).toFixed(2)
            })
          })
        }
        return options
      }
    }
    return {
      ...toRefs(states),
      tooltipFormaterUnit
    }
  }
})
</script>

<style scoped>
.data-title {
  font-size: 16px;
  font-weight: 500;
  margin-right: 4px;
}
.data-time {
  font-size: 12px;
  color: #939090;
  margin-left: 14px;
}
</style>
