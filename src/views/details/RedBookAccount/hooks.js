// import { reactive, ref, getCurrentInstance } from '@vue/composition-api'

// import { $getTikTokAccountFansInfo } from '@/api/details'
import { $orderPutAccountDetail } from '@/api/bussiness-manage'
// import dayjs from 'dayjs'

// export const echartMaps = function() {
//   const pieConfig = {
//     legend: {
//       show: false
//     },
//     tooltip: {
//       show: false
//     },
//     seriesConfig: {
//       type: 'pie',
//       radius: ['35%', '55%'],
//       label: {
//         formatter: '{b}\n {c}%'
//       }
//     }
//   }
//   const barConfig = {
//     legend: {
//       show: false
//     },
//     yAxis: {
//       show: false,
//       type: 'category'
//     },
//     xAxis: {
//       axisTick: {
//           show: false
//       },
//       axisLine: {
//           show: false
//       }
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//           type: 'shadow'
//       },
//       formatter: '{b}：{c}%'
//     },
//     seriesConfig: {
//       type: 'bar',
//       label: {
//         show: true,
//         position: 'right',
//         formatter: '{c}%'
//       },
//       showBackground: true
//     }
//   }
//   const lineConfig = {
//     xAxis: {
//       boundaryGap: true
//     },
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//       },
//       formatter: '{b}\n {c}%'
//     },
//     seriesConfig: {
//       type: 'line',
//       areaStyle: {},
//       smooth: true,
//       showSymbol: false
//     }
//   }
//   const dyFansEchartsA = [{
//     data: {
//       terms: [],
//       values: [],
//       cates: {}
//     },
//     title: '性别分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 0
//   }, {
//     data: {
//       cates: ['年龄分布'],
//       terms: [],
//       values: []
//     },
//     title: '年龄分布',
//     config: barConfig,
//     type: 'bar',
//     key: 1
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '全国省份分布',
//     config: {},
//     type: 'map',
//     key: 2
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '城市占比Top10',
//     config: barConfig,
//     type: 'bar',
//     key: 8
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '城市等级分布',
//     config: barConfig,
//     type: 'bar',
//     key: 5
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '兴趣分布',
//     config: barConfig,
//     type: 'bar',
//     key: 6
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '八大人群占比',
//     config: barConfig,
//     type: 'bar',
//     key: 10
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '设备分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 3
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '近30天粉丝观看频次',
//     config: pieConfig,
//     type: 'pie',
//     key: 9
//   }]
//   const dyFansEcharts = [{
//     data: {
//       terms: [],
//       values: [],
//       cates: {}
//     },
//     title: '性别分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 0
//   }, {
//     data: {
//       cates: ['年龄分布'],
//       terms: [],
//       values: []
//     },
//     title: '年龄分布',
//     config: barConfig,
//     type: 'bar',
//     key: 1
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '全国省份分布',
//     config: {},
//     type: 'map',
//     key: 2
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '城市占比Top10',
//     config: barConfig,
//     type: 'bar',
//     key: 8
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '设备分布',
//     config: barConfig,
//     type: 'bar',
//     key: 3
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '近30天粉丝观看频次',
//     config: pieConfig,
//     type: 'pie',
//     key: 9
//   }]
//   const ksFansEchats = [{
//     data: {
//       terms: [],
//       values: [],
//       cates: {}
//     },
//     title: '性别分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 0
//   }, {
//     data: {
//       cates: ['年龄分布'],
//       terms: [],
//       values: []
//     },
//     title: '年龄分布',
//     config: barConfig,
//     type: 'bar',
//     key: 1
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '设备分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 3
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '设备价格分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 10
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '粉丝活跃度',
//     config: pieConfig,
//     type: 'pie',
//     key: 11
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '粉丝城市线分布',
//     config: pieConfig,
//     type: 'pie',
//     key: 12
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '粉丝活跃占比',
//     config: lineConfig,
//     type: 'line',
//     key: 13
//   },
//   {
//     data: {
//       terms: [],
//       values: []
//     },
//     title: '全国省份分布',
//     config: {},
//     type: 'map',
//     key: 2
//   }]
//   const dySpectator = dyFansEchartsA.slice(0, dyFansEchartsA.length - 1)
//   const dyFerrousPowder = dyFansEchartsA.slice(1, dyFansEchartsA.length - 1)
//   return {
//     25: dyFansEcharts,
//     26: ksFansEchats,
//     'Fans': dyFansEchartsA,
//     'Spectator': dySpectator,
//     'FerrousPowder': dyFerrousPowder
//   }
// }

// export const useEchart = function(accountId, platId = 25, photoType) {
//   // let chartW = 0
//   const ctx = getCurrentInstance()
//   let chartsObj = null
//   if (photoType) {
//     chartsObj = echartMaps()[photoType]
//   } else {
//     chartsObj = echartMaps()[platId]
//   }
//   const charts = reactive(chartsObj)
//   const chartsMap = charts.reduce((t, n) => {
//     t[n.key] = n
//     return t
//   }, {})
//   const loading = ref(true)
//   const lastUpdateTime = ref(null)

//   $getTikTokAccountFansInfo({ accountId }).then(res => {
//     if (res.code === 1) {
//       let fansInfo = []
//       try {
//         switch (photoType) {
//           case 'Spectator':
//             fansInfo = res.data.viewerInfo ? JSON.parse(res.data.viewerInfo) : []
//             break
//           case 'FerrousPowder':
//             fansInfo = res.data.hugeFanInfo ? JSON.parse(res.data.hugeFanInfo) : []
//             break
//           default:
//             fansInfo = res.data.fansInfo ? JSON.parse(res.data.fansInfo) : []
//             break
//         }
//       } catch (err) { console.error(err) }
//       formatterData(fansInfo, platId)
//       // const GRID_RIGHT = 60
//       // chartW = document.querySelector('.m-chart').clientWidth

//       // barConfig.seriesConfig.label.offset = [chartW - GRID_RIGHT - 10, 0]
//       loading.value = false
//       lastUpdateTime.value = res.data.lastUpdateTime
//     } else {
//       ctx.proxy.$message.error(res.message)
//       loading.value = false
//     }
//   })

//   const TRANSLATION = {
//     male: '男性',
//     female: '女性',
//     newfirstline: '新一线城市',
//     firstline: '一线城市',
//     secondline: '二线城市',
//     thirdline: '三线城市',
//     fourthline: '四线城市',
//     fifthline: '五线城市'
//   }
//   const formatterData = function(fansInfo, platId) {
//       fansInfo.forEach(item => {
//         let total = 0
//         // eslint-disable-next-line no-unused-vars
//         for (const key in item.content) {
//           total += Number(item.content[key])
//         }
//         const data = {
//           values: [],
//           terms: [],
//           cates: [item.type_name]
//         }
//         // [3, 8, 2].includes(item.type_id) {
//         //   item
//         // }
//         // eslint-disable-next-line no-unused-vars
//         for (const key in item.content) {
//           let percentage = 0
//           if (+platId === 26) {
//             percentage = item.content[key].toFixed(3)
//           } else {
//             percentage = (item.content[key] / total).toFixed(3)
//           }
//           // 过滤数据为0的
//           if (Number(percentage) === 0) continue
//           percentage = (percentage * 100).toFixed(1)
//           if (TRANSLATION[key]) {
//             data.terms.push(TRANSLATION[key])
//             data.values.push(isNaN(percentage) ? 0 : percentage)
//             continue
//           }
//           // if (key === 'male') {
//           //   data.terms.push('男性')
//           //   data.values.push(percentage)
//           //   continue
//           // }
//           // if (key === 'female') {
//           //   data.terms.push('女性')
//           //   data.values.push(percentage)
//           //   continue
//           // }
//           if (item.type_id === 3 || item.type_id === 8 || item.type_id === 2) {
//             // 排序
//             let index = data.values.findIndex(_ => _ > percentage / 1)
//             index = index < 0 ? data.values.length : index
//             data.values.splice(index, 0, percentage)
//             data.terms.splice(index, 0, key)
//           } else if (item.type_id === 13) {
//             let index = data.terms.findIndex(_ => new Date(_).getTime() > key / 1)
//             index = index < 0 ? data.terms.length : index
//             data.values.splice(index, 0, percentage)
//             data.terms.splice(index, 0, dayjs(key * 1).format('YYYY-MM-DD'))
//           } else {
//             data.values.unshift(percentage)
//             data.terms.unshift(key)
//           }
//         }
//         chartsMap[item.type_id] && (chartsMap[item.type_id].data = data)
//       })
//   }
//   return {
//     charts,
//     loading,
//     lastUpdateTime
//   }
// }

export const useAccountBusinessInfo = function() {
  const getBaseData = async({ accountId, accountType }) => {
    try {
      const res = await $orderPutAccountDetail({ accountId, accountType })
      if (res.code === 1) {
        return res.data
      }
      return Promise.reject(res.message)
    } catch (err) { console.error(err) }
  }
  return {
    getBaseData
  }
}

export const ACCOUNT_TYPE_MAP = {
  SIGN_ACCOUNT: 1, // 签约账号
  MEDIUM_ACCOUNT: 5, // 媒介账号
  ORDRT_ACCOUNT: 3 // 投放账号
}
