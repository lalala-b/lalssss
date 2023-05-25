import request from '@/http'

/**
 * 获取配置列表
 * @param {*} params
 */
export const $getInformationList = function(params) {
  return request.get(`/information/stream/info/list`, { params })
}

/**
 * 获取配置详情
 * @param {*} params
 */
export const $getInformationDetail = function(params) {
  return request.get(`/information/stream/info/detail`, { params })
}

/**
 * 新增代理商
 */

export const $addInfoStreamAgent = function(params) {
  return request.post(`/information/stream/info/addInfoStreamAgent`, params)
}

/**
 * 获取信息流配置查询条件
 */

export const $getInfoStreamCondition = function(params) {
  return request.get(`/information/stream/info/getInfoStreamCondition?random=${Math.random()}`)
}

/**
 * 新增信息流链接
 */
export const $addInfoStream = function(params) {
  return request.post(`/information/stream/info/addInfoStream`, params)
}

/**
 * 级联获取推广业务或跳转指定页面
 */
export const $getLinkageCondition = function(params) {
  return request.get(`/information/stream/info/getLinkageCondition`, { params })
}
