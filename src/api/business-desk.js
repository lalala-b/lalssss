import request from '@/http'

/**
 * 查询客户管理-查询列表
 * @param params
 */
export function $getDeskCustomerList(params) {
  return request.get(`/business/admin/workbench/list`, { params })
}

/**
 * 团队客户联系人
 * @param params
 */
 export function $getDeskList(params) {
  return request.get(`/business/customer/workbench/list`, { params })
}

/**
 * 【商机管理】- 获取聚合信息
 * @param {*} params
 */
 export function $getDeskBusinessOpportunitySummary(params) {
  return request.get(`/quotient/channel/opportunity/workbench/statisticsOpportunityData`, { params })
}

/**
 * 【商机管理】- 获取列表
 * @param {*} params
 */
export function $getDeskBusinessOpportunityList(params) {
  return request.get(`/quotient/channel/opportunity/workbench/findOpportunityList`, { params })
}

/**
 * 【商单管理】- 列表
 * @param {*} params
 */
 export function $getDeskBusinessOrderList(params) {
  return request.get(`/business/order/workbench/getBusinessOrderList`, { params })
}

/**
 * 【工单管理】- 获取列表
 * @param {*} params
 */
export function $getDeskWorkerOrderList(params) {
  return request.get(`/work/order/workbench/getWorkerOrderList`, { params })
}

/**
 * 【工单管理】- 特殊工单列表
 * @param {*} params
 */
 export function $getDeskSpecialWorkerOrderList(params) {
  return request.get(`/special/worker/workbench/getSpecialWorkerOrderList`, { params })
}
/**
 * 获取待评价列表
 * @param {*} params
 */
 export function $getDeskEvaluateList(params) {
  return request.get('/worker/order/evaluate/workbench/getOrderEvaluateList', { params })
}

/**
 *  获取录单耗时排行榜列表
 * @param {*} params
 */
 export function $getDeskEntryRankingList(params) {
  return request.get(`/worker/order/entry/ranking/workbench/findEntryRankingInfoList`, { params })
}

/**
 * 查询待评价工单列表总条数-列表中的小红点数字
 * @param {*} params
 */
 export function $getDeskEvaluateCount() {
  return request.get(`/worker/order/evaluate/workbench/countOrderEvaluate`)
}
