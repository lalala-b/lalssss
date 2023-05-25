import request from '@/http'
import { DATA_SERVER } from '@/const'

// 获取账号基本信息
export function $getAccountInfo(params) {
  return request.get(`/account/detail/baseInfo`, { params })
}

// 获取b站账号基本信息
export function $getAccountInfoForBiliBili(params) {
  return request.get(`${DATA_SERVER}/qsj_data/bilibili/portrait`, { params })
}

// 获取b站账号基本信息中最新的10个视频趋势
export function $getRecentVideoTrend(params) {
  return request.get(`${DATA_SERVER}/qsj_data/bilibili/recentVideoTrend`, { params })
}

// 获取b站账号基本信息中作品案例的信息
export function $getVideoCaseList(params) {
  return request.get(`${DATA_SERVER}/qsj_data/bilibili/getVideoList`, { params })
}

// 获取b站账号基本信息中关注用户趋势的信息
export function $getFanNumTrendList(params) {
  return request.get(`${DATA_SERVER}/qsj_data/bilibili/fanNumTrend`, { params })
}

// 根据账号id获取对应花火id的数据
export function $getPlatformId(params) {
  return request.get(`${DATA_SERVER}/qsj_data/account/info/getPlatformId`, { params })
}

/**
 * 获取账号下的视频列表
 */
export function $getVideoList(params) {
  return request.get(`/account/detail/video`, { params })
}

/**
 * 获取账号详情-视频列表的统计
 */
export function $getVideoTotalData(params) {
  return request.get(`/account/detail/statisticsInfo`, { params })
}

/**
 * 获取账号粉丝画像
 */
export function $getTikTokAccountFansInfo(params) {
  return request.get(`/tiktok/getTikTokAccountFansInfo`, { params })
}

/**
 * 获取小红书用户详情信息
 */
 export function $getRedBookAccountDetail(params) {
  return request.get(`/account/detail/redBook`, { params })
}

/**
 * 获取用户详情信息中达人的权益信息
 */
 export function $getSignContractAccountEquityInformation(params) {
  return request.get(`/sign/contract/account/findSignContractAccountEquityInformation`, { params })
}

