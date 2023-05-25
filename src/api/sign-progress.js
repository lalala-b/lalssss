import request from '@/http'

/**
 * 获取签约进度搜索条件
 * @param params
 */
export const $getSignContractOrderCondition = params => {
  return request.get(`/sign/account/condition`, { params })
}

/**
 * 获取签约进度聚合数据
 * @param params
 */
export const $getSummaryData = params => {
  return request.post(`/sign/account/statisticsReadyAccountData`, params)
}

/**
 * 获取签约进度列表数据
 * @param params
 */
export const $getList = params => {
  return request.post(`/sign/account/getSignScheAccountInfoList`, params)
}

/**
 * 查看签约失败原因
 * @param params
 */
export const $checkFailReason = params => {
  return request.get(`/sign/account/selectReasonFailure`, { params })
}

/**
 * 获取编辑信息
 * @param params
 */
export const $getEditInfo = params => {
  return request.get(`/sign/account/findEditInfo`, { params })
}

/**
 * 编辑备注
 * @param params
 */
export const $editRemark = params => {
  return request.post(`/sign/account/edit`, params)
}

/**
 * 获取失败信息
 * @param params
 */
export const $getFailInfo = params => {
  return request.get(`/sign/account/getSignFail`, { params })
}

/**
 * 签约失败
 * @param params
 */
export const $failSignProgress = params => {
  return request.post('/sign/account/contractFailed', params)
}

/**
 * 新增预备达人接口
 * @param params
 */
export const $addReadyAccount = params => {
  return request.post('/sign/account/addReadyAccount', params)
}

/**
 * 转换为签约账号
 * @param params
 */
export const $supplementAccount = params => {
  return request.post('/sign/account/supplementSignContractAccount', params)
}

/**
 * 从达人库新增预备达人
 * @param params
 */
export const $addReadyAccountFromBase = params => {
  return request.post('/sign/account/addReadyAccountFromDaren', params)
}

/**
 * 编辑签约信息-编辑
 */
 export function $updateSignContractAccountPrice(params) {
  return request.post(`/sign/account/updateSignContractAccountPrice`, params)
}

/**
 * 获取星图地址链接
 */
 export function $getXingtuUrl(params) {
  return request.get(`/sign/account/getXingtuUrl`, { params })
}

/**
 * 达人沟通记录-获取沟通结果列表数据
 */
 export function $getCommunicateResList(params) {
  return request.post(`/sys/dict/data/getByDictType`, params)
}

/**
 * 达人沟通记录-获取具体原因列表数据
 */
 export function $getDescribeList(params) {
  return request.get(`/sign/account/describe/list`, { params })
}

/**
 * 达人沟通记录-新增历史沟通记录数据
 */
 export function $addAccountCommunicate(params) {
  return request.post(`/sign/account/communicate/add`, params)
}

/**
 * 达人沟通记录-历史沟通记录列表数据
 */
 export function $getAccountCommunicateList(params) {
  return request.get(`/sign/account/communicate/list`, { params })
}

/**
 * 解绑账号
 */
 export function $reBindAccount(params) {
  return request.post(`/sign/account/reBind`, params)
}
