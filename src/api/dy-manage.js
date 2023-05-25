/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-05 16:28:10
 * @LastEditTime: 2020-10-22 17:20:15
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 获取抖音素材库账号列表
 * @param {*} fans 粉丝范围
 * @param {*} tagId 标签ID
 * @param {*} determined 排序规则
 * @param {*} accountName 账号名
 * @param {*} tagName 内容主题
 */
export function $getTikTokAccountList(params) {
  return request.get(`/tiktok/getTikTokAccountList`, { params })
}

/**
 * 设置账号为SOP账号
 * @param {*} params
 */
export function $setSOPAccount(params) {
  return request.post(`/tiktok/addSOPAccount`, params)
}

/**
 * 变更账号标签
 * @param {*} params
 */

export function $changeAccountTopic(params) {
  return request.post(`/tiktok/changeAccountTopic`, params)
}

/**
 * 获取抖音素材库视频列表
 * @param {*} fans 粉丝范围
 * @param {*} tagId 标签ID
 * @param {*} determined 排序规则
 * @param {*} accountName 账号名
 * @param {*} tagName 内容主题
 */
export function $getTikTokAllVideoList(params) {
  return request.get(`/tiktok/getTikTokAllVideoList`, { params })
}

/**
 * 获取账号
 * @param {*} platId 平台ID
 */
export function $getAllCountByPlatId(params) {
  return request.get('/plat/account/getAllAccountNameByPlatId', { params })
}

/**
 * 将视频添加为广告案例
 * @param {*} flowId 视频ID
 * @param {*} brand 品牌信息
 * @param {*} url 视频url
 * @param {*} topics 标签ID集合
 */
export function $addAdvert(params) {
  return request.post('/tiktok/addAdvert', params)
}

/**
 * 查看抖音素材库账号下的视频列表
 * @param {*} accountId 账号ID
 * @param {*} title 标题
 * @param {*} platId 平台ID
 * @param {*} start 点赞开始数
 * @param {*} end 点赞结束数
 * @param {*} determined 排序规则
 * @param {*} pageNum 页码
 * @param {*} startTime 开始时间
 * @param {*} endTime 结束时间
 */
export function $getTikTokVideoList(params) {
  return request.post('/tiktok/getTikTokVideoList', params)
}

/**
 * 获取抖音视频热榜列表
 * @param {*} params
 */
export function $getDyHotFlow(params) {
  return request.get(`/xingtu/dyHotFlow`, { params })
}

/**
 * 获取星图广告列表
 * @param {*} params
 */
export function $getXingtuHotFlow(params) {
  return request.get(`/xingtu/xingtuHotFlow`, { params })
}

/**
 * 获取星图广告列表内容主题
 * @param {*} params
 */
export function $getXtHotFlowTag(params) {
  return request.get(`/xingtu/xtHotFlowTag`, { params })
}

/**
 * 获取星图达人热榜列表
 * @param {*} params
 */
export function $getXingtuHotUser(params) {
  return request.get(`/xingtu/xingtuHotUser`, { params })
}

/**
 * 获取星图达人热榜内容主题
 * @param {*} params
 */
export function $getXtHotUserTag(params) {
  return request.get(`/xingtu/xtHotUserTag`, { params })
}

/**
 * 添加为对标账号
 */
export function $postBenchmarking(params) {
  return request.post(`/account/monitor/benchmarking/add`, params)
}

/**
 * 获取时间查询条件
 */
export function $getBilllboardQueryTime(params) {
  return request.get(`/billboard/getBillboardQueryTime`, { params })
}
/**
 * 榜单类型数据查询
 */
export function $getBillBoardData(params) {
  return request.get(`/billboard/getBillboardData`, { params })
}

/*
 * 抖音热点列表
 */
export function $getDyHotList(params) {
  return request.get(`/tiktok/getTiktokHotWordList`, { params })
}

/**
 * 抖音热点账号下的视频列表
 */
export function $getTiktokHotDetail(params) {
  return request.get(`/tiktok/getTiktokHotDetail`, { params })
}

/**
 * 获取MCN机构
 */
export function $getMcnList(params) {
  return request.get(`/tiktok/getMcnName`, { params })
}
/**
 * 获取新抖音达人库列表
 */
export function $getDyList(params) {
  return request.post(`/delivery/account/tiktok/library/list`, params)
}

/**
 * 新抖音达人库-账号不在推荐
 */
export function $refuseRecommend(params) {
  return request.post(`/delivery/account/tiktok/library/saveAccountRefuseRecommend`, params)
}

/**
 * 新抖音达人库-添加投放账号
 */
export function $saveDeliveryAccount(params) {
  return request.post(`/delivery/account/tiktok/library/saveDeliveryAccount`, params)
}
/**
 * 精准找号-更新投放账号
 */
export function $updateDeliveryAccountInfo(params) {
  return request.post(`/delivery/account/tiktok/library/updateDeliveryAccountInfo`, params)
}
/**
 * 新抖音达人库-检查是否禁止绑定账号，根据后端配置
 */
export function $checkBindAccount(params) {
  return request.get(`/delivery/account/tiktok/library/getAddAccountFrequencyControlInfo`)
}
