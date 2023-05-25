import request from '@/http'

/**
 * 查询首页弹窗列表
 * @param params
 */
export function $getNotificationList(params) {
  return request.get(`/notification/list`, { params })
}

/**
 * 添加弹窗
 * @param params
 */
export function $addNotification(params) {
  return request.post(`/notification/add`, params)
}

/**
 * 编辑弹窗
 * @param params
 */
export function $editNotification(params) {
  return request.post(`/notification/updateInfo`, params)
}

/**
 * 在首页查询弹窗列表
 * @param params
 */
export function $getHomeNotification(params) {
  return request.get(`/notification/homePageNotification`, params)
}
