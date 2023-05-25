import request from '@/http'
import qs from 'qs'

/**
 * 获取流量助推的快手订单的所有账号
 */
export const $getKuaishouTrafficBoostAccount = () => {
  return request.get('/kuaishou/flow/boost/findKuaishouFlowBoostAccountList')
}

/**
 * 获取流量助推的快手订单汇总数据
 * @param {*} params
 */
export const $getKuaishouTrafficBoostSummary = (params) => {
  return request.get('/kuaishou/flow/boost/getKuaishouFlowBoostOrderListCount', { params })
}

/**
 * 获取流量助推的快手订单列表
 * @param {*} params
 */
export const $getKuaishouTrafficBoostList = (params) => {
  return request.get('/kuaishou/flow/boost/getKuaishouFlowBoostOrderList', { params })
}
