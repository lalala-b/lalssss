import request from '@/http'

/**
 * 快手达人库列表
 * @param {*} params
 * @returns Promise
 */
export function $getKsAccountList(params) {
  return request.get(`/kuaishou/getKuaishouAccountList`, { params })
}

/**
 * 快手达人库标签
 */
export function $getKsAccountTags(params) {
  return request.get(`/kuaishou/getAccountTag`, { params })
}

/**
 * 快手macn
 */
export function $getKsMcnName(params) {
  return request.get(`/kuaishou/getMcnName`, { params })
}

/**
 * 快手达人热榜列表
 */
export function $getCLHotUser(params) {
  return request.get(`/billboard/kuaishou/getKuaishouBillboardData`, { params })
}
