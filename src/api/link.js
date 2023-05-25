/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-16 14:18:47
 * @LastEditTime: 2020-11-20 15:28:10
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 查看link组件列表接口
 */

export const $getLinkList = function(params) {
  return request.get('/link/detail/getLinkDetailList', { params })
}

/**
 * 获取link组件的筛选条件值
 * @param {*} params
 */
export const $getLinkCondition = function(params) {
  return request.get(`/link/detail/getLinkCondition`, { params })
}
/**
 * 根据组件品牌查询业务类型
 * @param {*} params
 */
export const $getBusinessType = function(params) {
  return request.get(`/link/detail/getBusinessType`, { params })
}

/**
 * 新增link组件
 */

export const $addLinkBase = function(params) {
  return request.post('/link/detail/addLinkBase', params)
}

/**
 * 编辑link组件
 * @param {*} params
 */
export const $updateLink = function(params) {
  return request.post(`/link/detail/updateLink`, params)
}
/**
 * 获取link组件详情
 * linkId
 */

export const $getLinkDetail = function(params) {
  return request.get(`/link/detail/getLinkDetail`, { params })
}

/**
 * 更新link状态
 * @param {*} params
 */
export const $disableLinkStatus = function(params) {
  return request.post(`/link/detail/batchUpdateLinkStatus`, params)
}
/**
 * 获取用户所在的军团信息
 */
export const $getUserDFInfo = function(params) {
  return request.get(`/user/info/getUserDFInfo`, { params })
}

/**
 * 获取所有使用方用户
 */
export const $gerUserInfo = function(params) {
  return request.get(`/link/detail/getUserInfoByOrgType`, { params })
}

/**
 * 根据公司名和应用类型获取对应的业务标签
 */
export const $getBusinessTypeNew = function(params) {
  return request.get(`/link/detail/getBusinessTypeNew`, { params })
}
