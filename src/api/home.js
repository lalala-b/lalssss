/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-07 13:40:11
 * @LastEditTime: 2020-10-20 10:35:37
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 首页热门文章|广告案例|精选账号
 * @param params
 */
export function $list(params) {
  return request.post(`/home/list`, params)
}

/**
 * 首页公告|运营技巧
 * @param params
 */
export function $listNoticeAndOperSkill(params) {
  return request.post(`/home/listNoticeAndOperSkill`, params)
}

/**
 * 首页-内容创作
 * @param params
 */
export function $listContent() {
  return request.get(`/home/listContent`)
}

export function $getListStatistics(params) {
  return request.get('/home/listStatistics', { params })
}

/**
 * 过期账号提醒
 * @param {*} params
 */
export function $getExpireAccountTips(params) {
  return request.get('/home/expireAccountTips')
}

/**
 * 获取banner数据
 */
export function $getBannerList(params) {
  return request.get(`/home/findBannerList`)
}

/**
 * 获取热门文章
 */
export function $getArticless(params) {
  return request.get(`/manager/wechat/pub/list`, { params })
}

/**
 * 更新文章状态
 */
export function $updateArticless(params) {
  return request.post(`/manager/wechat/pub/update?t=${Math.random()}`, params)
}

/**
 * 获取我运营的数据
 */

export function $getOperateList(params) {
  return request.get(`/own/account/ranking/ownAccountList`, { params })
}
/**
 * 获取我运营的数据
 */
export function $getHeroList(params) {
  return request.get(`/own/account/ranking/heroList`, { params })
}
/**
 * 获取海盗绩效月
 */
export function $getPerformanceMonth(params) {
  return request.get(`/own/calendar/getPerformanceMonth`, { params })
}
/**
 * 获取海盗绩效周
 */
export function $getPerformanceWeek(params) {
  return request.get(`/own/calendar/getPerformanceWeek`, { params })
}
