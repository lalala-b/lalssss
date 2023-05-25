import {
  copy
} from '@/utils'
import {
  reactive
} from '@vue/composition-api'

export const commonData = function() {
  const statusList = [{
      dictValue: '0',
      dictLabel: '停用'
    },
    {
      dictValue: '1',
      dictLabel: '启用'
    }
  ]
  const commentStatusList = [{
    dictValue: '0',
    dictLabel: '停止爬取'
    },
    {
      dictValue: '1',
      dictLabel: '爬取中'
  }]

  // 账号类型列表
  const accountTypeList = [
    {
      dictValue: '1',
      dictLabel: '官方号'
    },
    {
      dictValue: '2',
      dictLabel: '私人号'
    }
  ]

  const states = reactive({
    monitorUserList: [],
    accountIdList: [],
    platIdList: []
  })
  const getStatusTxt = (status) => {
    return (statusList.find(item => +item.dictValue === +status) || {}).dictLabel
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
  const formatData1 = (data) => {
    const params = copy(data)
    if (params.createdTime && params.createdTime.length) {
      params.createTimeStart = params.createdTime[0]
      params.createTimeEnd = params.createdTime[1] + ' 23:59:59'
    } else {
     params.createTimeStart = ''
       params.createTimeEnd = ''
    }
    if (params.updateTime && params.updateTime.length) {
      params.updateTimeStart = params.updateTime[0]
      params.updateTimeEnd = params.updateTime[1] + ' 23:59:59'
    } else {
      params.updateTimeStart = ''
      params.updateTimeEnd = ''
    }
    delete params.updateTime
    delete params.createdTime
    return params
  }
  const formatData = (data) => {
    const params = copy(data)

    if (params.addTime && params.addTime.length) {
      params.addTimeStart = params.addTime[0]
      params.addTimeEnd = params.addTime[1] + ' 23:59:59'
    } else {
       params.addTimeStart = ''
     params.addTimeEnd = ''
    }
    if (params.inDBTime && params.inDBTime.length) {
      params.inDBTimeStart = params.inDBTime[0]
      params.inDBTimeEnd = params.inDBTime[1] + ' 23:59:59'
    } else {
       params.inDBTimeStart = ''
      params.inDBTimeEnd = ''
    }
    if (params.cmtTime && params.cmtTime.length) {
      params.cmtTimeStart = params.cmtTime[0]
      params.cmtTimeEnd = params.cmtTime[1] + ' 23:59:59'
    } else {
       params.cmtTimeStart = ''
      params.cmtTimeEnd = ''
    }
    if (params.videoUpdateTime && params.videoUpdateTime.length) {
      params.updateTimeStart = params.videoUpdateTime[0]
      params.updateTimeEnd = params.videoUpdateTime[1] + ' 23:59:59'
    } else {
       params.updateTimeStart = ''
      params.updateTimeEnd = ''
    }
    delete params.videoUpdateTime
    delete params.inDBTime
    delete params.addTime
    delete params.cmtTime
    return params
  }

  return {
    statusList,
    getStatusTxt,
    formatData,
    ...states,
    commentStatusList,
    accountTypeList,
    formatData1,
    formatAccount
  }
}
