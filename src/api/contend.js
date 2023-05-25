/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-02 20:48:05
 * @LastEditTime: 2020-12-04 16:09:57
 * @LastEditors: Linjie
 */
import request from '@/http'

// 获取关联视频列表
export function $getContendVideoList(params) {
  return request.get(`/tiktok/competeVideoMonitor`, { params })
}

// 获取竞品列表
export function $getContendList(params) {
  return request.get(`/star/compete/list`, { params })
}
/**
 * 新增竞品
 * @param {*} params
 */
export function $addContend(params) {
  return request.post(`/star/compete/add`, params)
}
/**
 * 删除竞品
 */
export function $delectContend(params) {
  return request.post(`/star/compete/delete`, params)
}
/**
 * 置顶竞品
 */
export function $upContend(params) {
  return request.get(`/star/compete/top`, { params })
}

/**
 * 获取账号列表
 */
export function $getAccountList(params) {
  return request.get(`/tiktok/filterCompeteAccount?t = ${new Date().getTime()}`, { params })
}

/**
 * 粉丝量
 */
export function $getFansNum(params) {
  return request.get(`/tiktok/fansRange`, { params })
}

/**
 * 获取关联账号列表
 */
export function $getContendAccountList(params) {
  return request.get(`/tiktok/competeAccountMonitor`, { params })
}

/**
 * 新增关联账号
 */
export function $addContendAccount(params) {
  return request.post(`/tiktok/addCompeteAccount`, params)
}
