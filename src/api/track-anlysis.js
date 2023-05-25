import request from '@/http'
import qs from 'qs'

export const $getQueryCondition = (params) => {
  return request.get('/industry/analysis/getQueryCondition', { params })
}
export const $getSignCondition = (params) => {
  return request.get('/sign/contract/account/analysis/condition', { params })
}
export const $getSignTeamInfo = (params) => {
  return request.get('/sign/contract/account/getSignTeamInfo', { params })
}

/**
 * 获取赛道变现接口
 */
export const $getTrackData = (params) => {
  return request.get('/sign/contract/account/analysis/data', { params })
}
/**
 * 获取赛道变现接口
 */
export const $getCondition = (params) => {
  return request.get('/sign/contract/account/analysis/condition', { params })
}
/**
 * 获取自营账号赛道分析
 */
export const $getSelfData = (params) => {
  return request.get('/account/analysis/data', { params })
}
/**
 * 获取行业赛道分析
 */
 export const $getBusinessData = (params) => {
  return request.get('/industry/analysis/data', { params })
}

/**
 * 获取自营达人账号数据
 */
 export const $getPieData = (params) => {
  return request.get('/account/analysis/exportDisplayData', { params })
}
/**
 * 获取签约达人账号数据
 */
 export const $getSignPieData = (params) => {
  return request.get('/sign/contract/account/analysis/exportDisplayData', { params })
}
/**
 * 行业赛道跳转
 */
export const $getJumpData = (params) => {
  return request.get('/industry/analysis/jump/data', { params })
}
/**
 * 签约账号分析
 */
export const $getSignAccountData = (params) => {
  return request.get('/account/analysis/sign/data', { params })
}
/**
 * 签约账号分析条件查询
 */

 export const $getSignSearch = (params) => {
  return request.get('/account/analysis/sign/condition', { params })
}

/**
 * 签约账号查询
 */

 export const $getAccountInfo = (params) => {
  return request.get('/account/analysis/sign/account', { params })
}

