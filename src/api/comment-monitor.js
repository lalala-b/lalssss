import request from '@/http'

/**
 * 监控账号 -获取列表
 * @param params
 */
export function $getlistMonitorAccountInfo(params) {
  return request.get(`/hd/comment/account/info/monitor/listMonitorAccountInfo`, { params })
}

/**
 * 监控账号-获取创建人
 * @param params
 */
export function $getMonitorUserInfo(params) {
  return request.get(`/hd/comment/account/info/monitor/getMonitorUserInfo`, { params })
}
/**
 * 监控账号-获取平台信息
 * @param params
 */
export function $getPlatInfo(params) {
  return request.get(`/hd/comment/account/info/monitor/getPlatInfo`, { params })
}
/**
 * 监控账号-获取账号信息
 * @param params
 */
export function $getMonitorAccountInfo(params) {
  return request.get(`/hd/comment/account/info/monitor/getMonitorAccountInfo`, { params })
}
/**
 * 监控账号-暂停
 * @param params
 */
export function $editAccountStatus(params) {
  return request.post(`/hd/comment/account/info/monitor/editAccountStatus`, params)
}
/**
 * 监控账号-添加
 * @param params
 */
export function $addMonitor(params) {
  return request.post(`/hd/comment/account/info/monitor/add`, params)
}
/**
 * 监控账号-获取提醒人
 * @param params
 */
export function $getAccountUserInfo(params) {
  return request.get(`/hd/comment/account/info/comment/bindAccountUserInfo`, { params })
}
/**
 * 监控账号-绑定提醒人
 * @param params
 */
export function $bindMonitorAccount(params) {
  return request.post(`/hd/comment/account/info/bindMonitorAccount`, params)
}
/**
 * 评论账号-获取账号列表信息
 * @param params
 */
export function $getListComment(params) {
  return request.get(`/hd/comment/account/info/comment/listCommentAccountInfo`, { params })
}
/**
 * 评论账号-获取创建人信息
 * @param params
 */
export function $getCommentUserInfo(params) {
  return request.get(`/hd/comment/account/info/comment/getCommentUserInfo`, { params })
}
/**
 * 评论账号-获取平台信息
 * @param params
 */
export function $getCommentPlatInfo(params) {
  return request.get(`/hd/comment/account/info/comment/getPlatInfo`, { params })
}
/**
 * 评论账号-获取账号信息
 * @param params
 */
export function $getCommentAccountInfo(params) {
  return request.get(`/hd/comment/account/info/comment/getCommentAccountInfo`, { params })
}
/**
 * 评论账号-获取账号归属人信息
 * @param params
 */
export function $getBindAccountUserInfo(params) {
  return request.get(`/hd/comment/account/info/comment/bindAccountUserInfo`, { params })
}
/**
 * 评论账号-获取账号信息
 * @param params
 */
export function $editCommentAccountStatus(params) {
  return request.post(`/hd/comment/account/info/comment/editAccountStatus`, params)
}
/**
 * 评论账号-获取账号信息
 * @param params
 */
export function $getMonitorVideoList(params) {
  return request.get(`/hd/comment/video/info`, { params })
}
/**
 * 评论区 评论列表接口
 * @param params
 */
export function $getCommentList(params) {
  return request.get(`/hd/comment/info/list`, { params })
}
/**
 * 评论账号-获取汇总指标
 * @param params
 */
export function $getSummaryData(params) {
  return request.get(`/hd/comment/info/summaryData`, { params })
}

/**
 * 评论管理-绑定归属人
 * @param params
 */
export function $bindCustomAscribe(params) {
  return request.post(`/hd/comment/info/customAscribe`, params)
}

/**
 * 评论管理-编辑点赞量
 * @param params
 */
export function $editCommentLike(params) {
  return request.post(`/hd/comment/info/updateDiggCount`, params)
}
