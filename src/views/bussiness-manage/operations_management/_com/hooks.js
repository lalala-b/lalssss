import {
  copy
} from '@/utils'
export const commonData = function() {
  const approvalStatusType = new Map([
    [1, '待接收'],
    [2, '待审批'],
    [3, '待审批'],
    [4, '待核实'],
    [5, '已完成'],
    [6, '已撤销'],
    [7, '已驳回']
  ])
  const statusList = [{
      dictValue: 1,
      dictLabel: '待接收'
    },
    {
      dictValue: '2,3',
      dictLabel: '待审批'
    },
    {
      dictValue: 4,
      dictLabel: '待核实'
    },
    {
      dictValue: 5,
      dictLabel: '已完成'
    },
    {
      dictValue: 6,
      dictLabel: '已撤销'
    },
    {
      dictValue: 7,
      dictLabel: '已驳回'
    }

  ]
  const getAccountType = new Map([
    [0, '上架'],
    [1, '下架'],
    [2, '孵化中']
  ])
  const AccountStatusList = [{
      dictValue: 0,
      dictLabel: '上架'
    },
    {
      dictValue: 1,
      dictLabel: '下架'
    },
    {
      dictValue: 2,
      dictLabel: '孵化中'
    }
  ]
  const getTimeObj = (str) => {
    if (!str) return {}
    var dateStr = (str.split(' ')[0] || '').split('-')
    var timeStr = (str.split(' ')[1] || '').split(':')
    var dateObj = {}
    dateObj.year = dateStr[0]
    dateObj.month = dateStr[1]
    dateObj.day = dateStr[2]
    dateObj.hour = timeStr[0]
    dateObj.minite = timeStr[1]
    dateObj.second = timeStr[2]

    return dateObj
  }

  const formatAccount = (data) => {
    const params = copy(data)
    if (params.platId) {
      if (params.accountName) {
        params.belongName = ''
        params.accountId = ''
      } else {
        params.belongName = ''
      }
    } else {
      if (params.belongName) {
        params.accountId = ''
        params.accountName = ''
      }
    }
    return params
  }
  const formatData = (data) => {
    const params = copy(data)
    if (params.inquiryTime && params.inquiryTime.length) {
      params.inquireTimeStart = params.inquiryTime[0]
      params.inquireTimeEnd = params.inquiryTime[1] + ' 23:59:59'
    } else {
      params.inquireTimeStart = ''
      params.inquireTimeEnd = ''
    }
    delete params.inquiryTime
    return params
  }
  const getID = (row) => {
    if (row.uniqueId) return row.uniqueId
    if (row.eid) return row.eid
    if (row.getDataUrl) return row.getDataUrl
  }
  return {
    statusList,
    approvalStatusType,
    getTimeObj,
    formatAccount,
    getAccountType,
    getID,
    AccountStatusList,
    formatData
  }
}
