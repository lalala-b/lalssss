import request from '@/http'
import qs from 'qs'

/**
 * 媒介订单管理-获取筛选条件
 * @param params
 */
export const $getMediumScreen = (params) => {
  return request.get(`/medium/mediumOrder/getCondition`, { params })
}

/**
 * 媒介订单管理-根据商务小组获取商务对接人
 * @param params
 */
export const $getMediumBusinessPeople = (params) => {
  return request.get(`/medium/mediumOrder/getUserInfo`, { params })
}

/**
 * 媒介订单管理-获取数据汇总接口
 * @param params
 */
export const $getSummaryData = (params) => {
  return request.get(`/medium/mediumOrder/getDataSummary`, { params })
}

/**
 * 媒介订单管理-获取数据列表
 * @param params
 */
export const $getSummaryList = (params) => {
  return request.get(`/medium/mediumOrder/getMediumOrderList`, { params })
}

/**
 * 媒介订单管理-获取详情
 * @param params
 */
export const $getMediumDetail = (params) => {
  return request.get(`/medium/mediumOrder/getMediumOrder`, { params })
}

/**
 * 媒介订单管理-编辑订单详情
 * @param params
 */
export const $editMediumDetail = (params) => {
  return request.post(`/medium/mediumOrder/editMediumOrder`, params)
}
/**
 * 查询媒介投放人
 * @param params
 */
export const $findMediumDeliveryUser = (params) => {
  return request.get(`/medium/mediumOrder/findMediumDeliveryUser`, { params })
}

