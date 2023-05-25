/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-09 10:28:05
 * @LastEditTime: 2020-11-11 15:56:58
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 获取商单刊例列表
 * @param {*} params
 */
export const $getBillAdvList = function(params) {
  return request.post('/work/order/getWorkerOrderAccount', params)
}

/**
 * 获取抖音商单刊例列表
 * @param {*} params
 */
export const $getTiktokBillAdvList = function(params) {
  return request.post('/account/quote/library/tiktok/findAccountTikTokList', params)
}

/**
 * 获取快手商单刊例列表
 * @param {*} params
 */
export const $getKuaishouBillAdvList = function(params) {
  return request.post('/account/quote/library/kuaishou/findAccountKuaiShouList', params)
}

/**
 * 获取b站商单刊例列表
 * @param {*} params
 */
export const $getBilibiliBillAdvList = function(params) {
  return request.post('/account/quote/library/bli/findAccountBliList', params)
}

/**
 * 获取小红书商单刊例列表
 * @param {*} params
 */
export const $getRedbookBillAdvList = function(params) {
  return request.post('/account/quote/library/redbook/findAccountRedBookList', params)
}

/**
 * 获取其他平替商单刊例列表
 * @param {*} params
 */
export const $getOtherBillAdvList = function(params) {
  return request.post('/account/quote/library/otherPlat/findAccountOtherPlatList', params)
}

/**
 * 获取商单刊例的tag
 */

export const $getFilterRang = function(params) {
  return request.get('/work/order/getFilterRang', { params })
}

/**
 * 获取抖音账号报价库内容类型、各种指标
 */

export const $getTiktokFilterRang = function(params) {
  return request.get('/account/quote/library/tiktok/getFilterRang', { params })
}

/**
 * 获取快手账号报价库内容类型、各种指标
 */

export const $getKuaishouFilterRang = function(params) {
  return request.get('/account/quote/library/kuaishou/getFilterRang', { params })
}

/**
 * 获取b站账号报价库内容类型、各种指标
 */

export const $getBilibiliFilterRang = function(params) {
  return request.get('/account/quote/library/bli/getFilterRang', { params })
}

/**
 * 获取小红书账号报价库内容类型、各种指标
 */

export const $getRedbookFilterRang = function(params) {
  return request.get('/account/quote/library/redbook/getFilterRang', { params })
}

/**
 * 获取其他平台账号报价库内容类型、各种指标
 */

export const $getOtherFilterRang = function(params) {
  return request.get('/account/quote/library/otherPlat/getFilterRang', { params })
}

/**
 * 编辑商单刊例
 */
export const $editAdvAccount = function(params) {
  return request.post('/work/order/editAdvAccount', params)
}

/**
 * 获取商单刊例的平台、账号
 */
export const $getPlatOrAccount = function(params) {
  return request.get(`/work/order/getCaseCondition`, { params })
}

/**
 * 获取抖音账号报价库账号
 */
export const $getTiktokAccount = function(params) {
  return request.get(`/account/quote/library/tiktok/getAccountTikTokCondition`, { params })
}

/**
 * 获取快手账号报价库账号
 */
 export const $getKuaishouAccount = function(params) {
  return request.get(`/account/quote/library/kuaishou/getAccountKuaiShouCondition`, { params })
}

/**
 * 获取b站账号报价库账号
 */
 export const $getBilibiliAccount = function(params) {
  return request.get(`/account/quote/library/bli/getAccountBliCondition`, { params })
}

/**
 * 获取小红书账号报价库账号
 */
export const $getRedbookAccount = function(params) {
  return request.get(`/account/quote/library/redbook/getAccountRedBookCondition`, { params })
}

/**
 * 获取其他平台账号报价库账号
 */
export const $getOtherAccount = function(params) {
  return request.get(`/account/quote/library/otherPlat/getAccountOtherPlatCondition`, { params })
}

/**
 * 获取工单排期
 * @param {*} accountId
 */
export const $getAdvAccountSchedule = function(params) {
  return request.get(`/work/order/getAdvAccountSchedule`, { params })
}

/**
 * 获取商单刊例的视频列表
 */

export const $getWorkerOrderAdvVideo = function(params) {
  return request.get(`/work/order/getWorkerOrderAdvVideo`, { params })
}

/**
 * 获取选号车列表
 */
export const $getAccountCarList = () => {
  return request.get(`/mid/user/account/cart/accountCartList`)
}

/**
 * 删除单个选号车数据
 */
export const $deleteAccountCar = (params) => {
  return request.post(`/mid/user/account/cart/deleteAccountCart`, params)
}

/**
 * 删除所有选号车数据
 */
export const $deleteAllAccountCar = () => {
  return request.get(`/mid/user/account/cart/clearAccountCartBatch`)
}

/**
 * 添加选号车数据
 */
export const $addAccountCar = (params) => {
  return request.post(`/mid/user/account/cart/addAccountCart`, params)
}

/**
 * 获取组织下拉框
 */
export const $getOrgList = (params) => {
  return request.get(`/work/order/getOrgList`, { params })
}

/**
 * 获取账号标签
 */
 export const $findSceneTags = (params) => {
  return request.get(`/sys/plat/tag/findSceneTags`, { params })
}

/**
 * 【账号报价库】- 获取历史合作类型
 * @param {*} params
 */
export function $getHistoryIndustryTypeList(params) {
  return request.get(`/sys/plat/tag/tree`, { params })
}

/**
 * 【账号报价库】- 获取历史品牌列表
 * @param {*} params
 */
export function $getHistoryBrandList(params) {
  return request.get(`/sys/baseinfo/getBrandList`, { params })
}

/**
 * 【账号报价库】- 获取自行找号中待找号，找号中的商机信息
 * @param {*} params
 */
 export function $getFindingOpportunityList(params) {
  return request.get(`/qp/business/opportunity/findingOpportunity`, { params })
}

/**
 * 【账号报价库】- 同步购物车账号到商机
 * @param {*} params
 */
 export function $getFindAccountBySelf(params) {
  return request.post(`/qp/business/opportunity/task/createTask/findAccountBySelf`, params)
}

/**
 * 【账号报价库】- 根据商机ID和平台ID批量找号
 * @param {*} params
 */
export function $getAccountNameList(params) {
  return request.get(`/qp/business/opportunity/task/accountNameList`, { params })
}

/**
 * 粉丝热门城市地址数据
 * @param {*} params
 */
 export function $getCityArea(params) {
  return request.get(`/geo/area/getCityArea`, { params })
}

/**
 * 检测是否有解约账号
 * @param {*} params
 */
 export function $checkSignOffline(params) {
  return request.get(`/qp/business/opportunity/task/checkSignOffline`, { params })
}

/**
 * 获取客户联系人数据
 * @param {*} params
 */
export function $getCustomerName(params) {
  return request.get(`/qp/perform/business/order/info/getCompanyName`, { params })
}
