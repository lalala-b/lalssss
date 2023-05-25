/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-10-15 10:55:17
 * @LastEditTime: 2020-10-16 14:39:23
 * @LastEditors: Linjie
 */
import request from '@/http'

/**
 * 获取时间段
 * @param {*} params
 */
export function $getHistoryList(params) {
  return request.get('/pirate/data/trend/week/viewBackTime', { params })
}

/**
 * 获取海盗团队的统计
 * @param {*} params
 */
export function $getAdvFlowScore(params) {
  return request.get('/pirate/data/trend/month/advFlowScore', { params })
}

/**
 * 获取海盗团队平台流量分布
 * @param {*} params
 */
export function $getPlatSpread(params) {
  return request.get('/pirate/data/trend/month/platSpread', { params })
}

/**
 * 获取海盗团队视频类型分布
 * @param {*} params
 */
export function $getVideoTypeSpread(params) {
  return request.get('/pirate/data/trend/month/videoTypeSpread', { params })
}

/**
 * 获取海盗流量占比
 * @param {*} params
 */
export function $getFlowsSoilders(params) {
  return request.get('/pirate/data/trend/month/flowsSoilders', { params })
}

/**
 * 海盗团队 月->团流量排行、团军功排行
 * @param {*} params
 */
export function $getTeamlowSoilder(params) {
  return request.get('/pirate/data/trend/month/tFlowSoilder', { params })
}

/**
 * 海盗团队 月->账号涨粉TOP10、账号新增流量TOP10、广告视频流量TOP10
 * @param {*} params
 */
export function $getAccountFlow(params) {
  return request.get('/pirate/data/trend/month/accountFlow', { params })
}

/**
 * 海盗基金 月->视频数量占比、军团流量占比（复用各团队投放效果数据）、投放金额占比（复用各团队投放效果数据）
 * @param {*} params
 */
export function $getFundTeamData(params) {
  return request.get('/pirate/data/trend/month/fundTeam', { params })
}

/**
 * 海盗基金 月-> 各团队投放效果、内容投放效果
 * @param {*} params
 */
export function $getFundCpmData(params) {
  return request.get('/pirate/data/trend/month/fundCpm', { params })
}

export function $getMonthFlowSoilder(params) {
  return request.get('/pirate/data/trend/month/flowSoilder', { params })
}

/**
 * 海盗基金 月->广告视频数据
 * @param {*} params
 */
export function $getMonthFundData(params) {
  return request.get('/pirate/data/trend/month/fundData', { params })
}

/**
 * 海盗基金 月->投放视频流量TOP10
 * @param {*} params
 */
export function $getDeliveryTop(params) {
  return request.get('/pirate/data/trend/month/deliveryTop', { params })
}

/**
 *  海盗基金 周 ->广告视频数据
 * @param {*} params
 */
export function $getWeekFundData(params) {
  return request.get('/pirate/data/trend/week/fundData', { params })
}

export function $getWeekFlowSoilder(params) {
  return request.get('/pirate/data/trend/week/flowSoilder', { params })
}

export function $getWeekFundCpmData(params) {
  return request.get('/pirate/data/trend/week/fundCpm', { params })
}

export function $getWeekFundTeamData(params) {
  return request.get('/pirate/data/trend/week/fundTeam', { params })
}

export function $getWeekDeliveryTop(params) {
  return request.get('/pirate/data/trend/week/deliveryTop', { params })
}
export function $getWeekAllData(params) {
  return request.get('/pirate/data/trend/week/fundData', { params })
}

// -------------------------------
/**
 * 投放-周复盘-统计头部指标数据
 */
export function $getHeadWeekData(params) {
  return request.get('/pirate/data/trend/week/statisticsHeadWeekData', { params })
}
/**
 * 获取投放数量接口
 */
export function $getAmountData(params) {
  return request.get('/pirate/data/trend/week/getAmountData', { params })
}

/**
 * 内容投放条数占比
 */
 export function $getContentOnTheData(params) {
  return request.get('/pirate/data/trend/week/fundTeam', { params })
}

/**
 * 获取流量占比接口
 */
export function $getFlowPercentage(params) {
  return request.get('/pirate/data/trend/week/getFlowPercentage', { params })
}

/**
 * 获取流量排行
 */
export function $getFlowRanking(params) {
  return request.get('/pirate/data/trend/week/getFlowRanking', { params })
}

/**
 * 军-C2B流量与C2B新增用户数排行
 */
 export function $getJunFlowAndUser(params) {
  return request.get('/pirate/data/trend/week/getJunFlowAndUser', { params })
}

/**
 * 投放金额情况
 */
export function $getFundPutMoney(params) {
  return request.post('/pirate/data/trend/week/fundPutMoney', params)
}

/**
 * 投放效果指标查询
 */
export function $getEffectVideoType(params) {
  return request.post('/pirate/data/trend/week/fundPutEffect', params)
}
/**
 * 乾派 月 -> 广告视频数据
 * @param {*} params
 */
export function $getMonthQpData(params) {
  return request.get('/qp/data/trend/month/qpData', { params })
}

/**
 * 乾派 月-》工作室上上签流量占比、工作室上上签广告流量占比、工作室上上签广告执行金额占比、工作室上上签广告视频数占比
 * @param {*} params
 */
export function $getMonthQpMonthFlow(params) {
  return request.get('/qp/data/trend/month/qpMonthFlow', { params })
}

/**
 * 乾派 月->月流量平台占比
 * @param {*} params
 */
export function $getMonthQpPlatSpread(params) {
  return request.get('/qp/data/trend/month/qpPlatSpread', { params })
}

/**
 * 乾派 月-》月执行人小组合作金额占比及趋势、行业类别金额及占比
 * @param {*} params
 */
export function $getMonthQpQuotientData(params) {
  return request.get('/qp/data/trend/month/qpQuotientData', { params })
}

/**
 * 乾派 月->视频流量top10、广告视频流量top10、账号涨粉top10
 * @param {*} params
 */
export function $getMonthQpAccountFlow(params) {
  return request.get('/qp/data/trend/month/qpAccountFlow', { params })
}

/**
 * 乾派 周 -> 广告视频数据
 * @param {*} params
 */
export function $getWeekQpData(params) {
  return request.get('/qp/data/trend/week/qpData', { params })
}

/**
 * 乾派  周 -> 工作室上上签流量占比==工作室上上签流量、工作室上上签广告流量占比==工作室上上签广告流量、工作室上上签广告视频数占比==工作室上上签广告视频数、平台流量占比
 * @param {*} params
 */
export function $getWeekPlatAdv(params) {
  return request.get('/qp/data/trend/week/platAdv', { params })
}

/**
 * 乾派 周 -> 执行人小组合作金额及占比、行业类别金额及占比
 * @param {*} params
 */
export function $getWeekQuotientData(params) {
  return request.get('/qp/data/trend/week/quotientData', { params })
}

/**
 * 乾派 周 -> 视频流量top10、广告视频流量top10、账号涨粉top10
 * @param {*} params
 */
export function $getWeekQpAccountFlow(params) {
  return request.get('/qp/data/trend/week/qpAccountFlow', { params })
}

/**
 * 海盗团队 周->广告视频数据
 * @param {*} params
 */
export function $getWeekAdvFlowScore(params) {
  return request.get('/pirate/data/trend/week/advFlowScore', { params })
}

/**
 * 海盗团队 周 ->账号涨粉TOP10、账号新增流量TOP10、广告视频流量TOP10
 * @param {*} params
 */
export function $getWeekAccountFlow(params) {
  return request.get('/pirate/data/trend/week/accountFlow', { params })
}

/**
 * 海盗团队 周 ->平台流量占比、等级流量占比、视频类型流量军功、团流量、军团流量占比、 团队流量、团队军功
 * @param {*} params
 */
export function $getWeekPlatLevel(params) {
  return request.get('/pirate/data/trend/week/platLevel', { params })
}

/**
 * 获取自营看板的列表
 */
export function $getDashBoardLink(params) {
  return request.get(`/selfOperate/getDashBoardLink`, { params })
}
