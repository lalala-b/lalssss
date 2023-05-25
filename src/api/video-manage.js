/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-09-27 22:19:53
 * @LastEditors: Luoxd
 */
import request from '@/http'

/**
 *
 * @param params
 */
export function $getV1VideoInfo(params) {
  return request.get(`/video/monitor/list`, { params })
}

/**
 *
 * @param params
 */
export function $getOrgList(params) {
  return request.get(`/account/monitor/team/getOrgList`, { params })
}

/**
 *
 * @param params
 */
export function $getBenchVideo(params) {
  return request.get(`/video/monitor/bench/getBenchmarkingVideoList`, { params })
}

/**
 *
 * @param params
 */
export function $getV1PlatAndUser(params) {
  return request.get(`/account/monitor/updateSelfAccount`, { params })
}

/**
 *
 * @param params
 */
export function $getMarkPlatAccounts(params) {
  return request.get(`/account/monitor/updateSelfAccount`, { params })
}

/**
 *
 * @param params
 */
export function $getV1SelectAccount(params) {
  return request.get(`/account/monitor/updateSelfAccount`, { params })
}

/**
 *
 * @param params
 */
export function $getBenchmarkBench(params) {
  return request.get(`/account/monitor/updateSelfAccount`, { params })
}

/**
 * 【团队视频】-数据查询
 * @param params
 */
export function $getTeamVideoInfo(params) {
  return request.get(`/video/monitor/list`, { params })
}

/**
 * 【团队视频】- 汇总指标查询
 * @param {*} params
 * @returns
 */
export function $getTeamVideoCount(params) {
  return request.get(`/video/monitor/count`, { params })
}

/**
 * 【团队视频】-账号查询条件
 * @param params
 */
export function $getAccountCondition(params) {
  return request.get(`/video/monitor/getAccountCondition`, { params })
}

/**
 * 【团队视频】-平台查询条件
 * @param params
 */
export function $getPlatCondition(params) {
  return request.get(`/video/monitor/getPlatCondition`, { params })
}

/**
 * 【团队视频】-账号查询条件
 * @param params
 */
export function $condition(params) {
  return request.get(`/account/condition`, { params })
}
/**
 * 【团队视频】-账号查询条件
 * @param params
 */
export function $getCondition(params) {
  return request.get(`/account/monitor/benchmarking/getCondition`, { params })
}
export function $getTeamCondition(params) {
  return request.get(`/tag/account/condition`, { params })
}

export function $getReviewList(params) {
  return request.get(`/med/flow/comments/getReviewList`, { params })
}
export function $getVideoDetailNew(params) {
  return request.get(`/med/flow/getVideoDetailNew`, { params })
}
export function $accountBaseInfo(params) {
  return request.get(`/account/detail/accountBaseInfo`, { params })
}

/**
 * 查询评论热词
 * @param {*} params
 */
export function $getReviewHotWord(params) {
  return request.get(`/med/flow/comments/getReviewHotWord`, { params })
}
