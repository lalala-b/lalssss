/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-12-22 10:14:51
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 *
 * @param params
 */
export function $getBillboardAllFans(params) {
  return request.get(`/rank/fans/listRank`, { params })
}

/**
 *
 * @param params
 */
export function $getBillboardIncreaseNew(params) {
  return request.get(`/rank/fans/listNewPotential`, { params })
}

/**
 *
 * @param params
 */
export function $getBillboardIncreaseFans(params) {
  return request.get(`/rank/fans/listFansRank`, { params })
}

/**
 *
 * @param params
 */
export function $getHotList(params) {
  return request.get(`/rank/flow/list`, { params })
}

/**
 * 【流量榜】-组织|平台查询条件
 * @param params
 */
export function $getCondition(params) {
  return request.get(`/rank/getCondition`, { params })
}

/**
 * 【投放榜单列表】
 */
export function $getOrderRankingList(params) {
  return request.get(`/putting/rank/puttingVideoRankList`, { params })
}

/**
 * 【投放榜单平台列表】
 */
export function $getOrderRankingPlatList(params) {
  return request.get(`/putting/rank/getPuttingVideoRankCondition`, { params })
}
/**
 * 飙升榜
 */
export function $getSoaringList(params) {
  return request.get(`/topList/soarList/getSoaringList`, { params })
}
