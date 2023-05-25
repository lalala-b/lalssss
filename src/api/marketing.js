/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-12-14 17:07:20
 * @LastEditors: Linjie
 */
import request from '@/http'
import qs from 'qs'

/**
 *
 * @param params
 */
export function $getAllMarketTags(params) {
  return request.get(`/tag/allTags`, { params })
}

/**
 *
 * @param params
 */
export function $getAllMarketAuthor(params) {
  return request.get(`/rank/all_author`, { params })
}

/**
 *
 * @param params
 */
export function $getMarketAccount(params) {
  return request.get(`/rank/search_account`, { params })
}

/**
 *
 * @param params
 */
export function $getMarketVideos(params) {
  return request.get(`/rank/author_news`, { params })
}

/**
 *
 * @param params
 */
export function $addMarketAdv(params) {
  return request.post(`/rank/add_adv`, params)
}

/**
 *
 * @param params
 */
export function $addAdvAuthor(params) {
  return request.post(`/rank/add_author`, params)
}

/**
 *
 * @param params
 */
export function $getAllMarketCases(params) {
  return request.get(`/rank/get_case`, { params })
}

/**
 *
 * @param params
 */
export function $changeMarketCaseAdv(params) {
  return request.get(`/rank/change_adv`, { params })
}

/**
 *
 * @param params
 */
export function $searchMarketAccount(params) {
  return request.get(`/rank/get_accounts`, { params })
}

/**
 *
 * @param params
 */
export function $changeMarketTopic(params) {
  return request.get(`/rank/change_topic`, { params })
}

/**
 *
 * @param params
 */
export function $importMarketAccounts(params) {
  return request.get(`/rank/account_upload`, { params })
}

/**
 *
 * @param params
 */
export function $checkMarketImportStatus(params) {
  return request.get(`/rank/account_check`, { params })
}

/**
 *
 * @param params
 */
export function $downloadFailureMarketImport(params) {
  return request.get(`/rank/account_download`, { params })
}

/**
 *
 * @param params
 */
export function $getMarketWordcloud(params) {
  return request.get(`/rank/word_cloud`, { params })
}

/**
 *
 * @param params
 */
export function $getMarketSopAccounts(params) {
  return request.get(`/sop/account`, { params })
}

/**
 * SOP账号-修改
 * @param params
 */
export function $editMarketSopAccount(params) {
  return request.put(`/sop/account`, params)
}

/**
 *
 * @param params
 */
export function $addMarketSopAccount(params) {
  return request.post(`/sop/account`, params)
}

/**
 * SOP账号-添加为对标账号
 * @param params
 */
export function $setBenchmarking(params) {
  return request.post(`/sop/account/benchmarking`, params)
}

/**
 * SOP账号-删除
 * @param params
 */
export function $delMarketSopAccount(params) {
  return request.delete(`/sop/account?${qs.stringify(params)}`)
}

/**
 * 广告案例
 * @param params
 */
export function $getMarketAdvCase(params) {
  return request.get(`/library/foreign`, { params })
}

/**
 *
 * @param params
 */
export function $modifyMarketAdvCase(params) {
  return request.post(`/library/foreign/modify`, params)
}

/**
 *
 * @param params
 */
export function $delMarketAdvCase(params) {
  return request.get(`/library/foreign/delete`, { params })
}

// 重构
/**
 * 获取热门文章|运营技巧
 * @param params
 */
export function $getAdminList(params) {
  return request.get(`/admin/list`, { params })
}
/**
 * 获取公众号列表
 */
export function $getOfficialAccount(params) {
  return request.get(`/manager/wechat/pub/getOfficialAccount`, { params })
}
