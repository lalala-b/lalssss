import request from '@/http'

/**
 * 我的订单查询
 * @param params
 */
export function $getSelfOrder(params) {
  return request.get(`/delivery/new/getSelfOrder`, { params })
}

/**
 * 待审批订单查询
 * @param params
 */
export function $getWaitApprovalOrder(params, ramdom) {
  return request.get(`/delivery/new/getWaitApprovalOrder?ramdom=${ramdom}`, { params })
}

/**
 * 团队订单查询
 * @param params
 */
export function $getGroupOrder(params) {
  return request.post(`/delivery/new/getGroupOrder`, params)
}

/**
 * 订单取消
 * @param params
 */
export function $cancelOrder(params) {
  return request.post(`/delivery/new/cancelOrder`, params)
}

/**
 * 下单
 * @param params
 */
export function $addOrder(params) {
  return request.post(`/delivery/new/addOrder`, params)
}

/**
 * 获取视频类型
 * @param {*} params
 * @returns
 */
export function $getJunType(params) {
  return request.get(`/delivery/new/getJunType`, { params })
}

/**
 * 移交投放订单
 * @param {* Number} params orderNumber 订单号
 * @param {* Number} params receiveUserId 投放专员id
 */

export function $transferOrderNew(params) {
  return request.post(`/delivery/new/transferOrder`, params)
}

/**
 * 投放账号库
 * 投放订单
 * 投放视频
 */
export function $getAccountPuttingByPlatIdNew(params) {
  return request.get(`/business/foreign/videoPutting/new/getByPlatId`, { params })
}

/**
 * 获取投放订单详情
 */
export function $getSimpleOrderDetail(params) {
  return request.get(`/delivery/new/simpleOrderDetail`, { params })
}

/**
 * 获取投放订单、投放视频库军团下拉框数据
 */
export function $getFundOrgIdNew(params) {
  return request.get(`/business/foreign/videoPutting/new/getFundOrgId`, { params })
}

/**
 * 获取投放专员名单
 * @param {*} params
 */
export function $getTransferConditionNew(params) {
  return request.get(`/business/foreign/videoPutting/new/getTransferCondition`, { params })
}

/**
 *
 * @param params
 */
export function $getVideoConditionNew() {
  return request.get(`/business/foreign/videoPutting/new/getCondition`)
}

/**
 * 投放视频数据查询
 * @param params
 */
export function $getVideoPuttingListNew(params, config) {
  return request.get(`/business/foreign/videoPutting/new/list`, { params, ...config })
}

/**
 * 投放视频库获取组件新增激活数据 抖音/快手新版
 * @param {*} params
 * @returns
 */
export function $getNewActiveUvData_Dnew(params) {
  return request.get(`/business/foreign/videoPutting/new/getNewActiveUvData`, { params })
}

/**
 * 投放视频业务转化详情 抖音/快手新版
 * @param {*} params
 * @returns
 */
export function $getNewOrderVideoConversionData_Dnew(params) {
  return request.get(`/business/foreign/videoPutting/new/getNewOrderVideoConversionData`, { params })
}

// -----------订单详情start-------------

/**
 * 获取订单详情
 */
export function $getOrderDetail(params) {
  return request.get(`/delivery/new/orderDetail`, { params })
}

/**
 * 更新订单信息
 */
export function $updateOrder(params) {
  return request.post(`/delivery/new/updateOrder`, params)
}

/**
 * 重新提交订单
 */
export function $reSubmitOrder(params) {
  return request.post(`/delivery/new/reSubmitOrder`, params)
}

/**
 * 达人未接单，状态回退
 */
export function $reAddOrder(params) {
  return request.post(`/delivery/new/reAddOrder`, params)
}
/**
 * 审核订单
 */
export function $updateCheckOrder(params) {
  return request.post(`/delivery/new/primaryExamine`, params)
}
/**
 * 付款审核
 */
export function $updatePayMoney(params) {
  return request.post(`/delivery/new/orderPayment`, params)
}
/**
 * 付款编辑
 */

export function $editPayMoney(params) {
  return request.post(`/delivery/new/orderPaymentInfoEdit`, params)
}

/**
 *  获取组件标签
 */
export function $getLinkBusinessType(params) {
  return request.get(`/delivery/new/findLinkBusinessType`, { params })
}
/**
 * 视频发布
 */

export function $savePostVideoInfo(params) {
  return request.post(`/delivery/new/savePostVideoInfo`, params)
}

/**
 * 视频编辑
 */
export function $editPostVideoInfo(params) {
  return request.post(`/delivery/new/editPostVideoInfo`, params)
}

/**
 * 保存违约金
 */
export function $saveOrderLiquidatedDamages(params) {
  return request.post(`/delivery/new/saveOrderLiquidatedDamages`, params)
}

/**
 * 资金核算

/**
 *  保存资金核算信息
 */
export function $saveFundReview(params) {
  return request.post(`/delivery/new/saveFundReview`, params)
}

/**
 * 获取账号已提交订单
 */
export function $getSubmitOrderInfo(params) {
  return request.get(`/delivery/account/limit/getSumbitOrderInfo`, { params })
}

// -------------- 预算管理 --------------------

/**
 * 预算列表
 * @param {} params
 */
export function $getBudgetList(params) {
  return request.get(`/delivery/budget/list`, { params })
}
/**
 * 预算组织结构
 */
export function $getBudgetChart(params) {
  return request.get(`/delivery/budget/manageChart`, { params })
}

/**
 * 预算列表查询条件数据
 */

export function $getBudgetCondition(params) {
  return request.get(`/delivery/budget/getCondition`, { params })
}

/**
 * 预算详情
 */
export function $getBudgetDetail(params) {
  return request.get(`/delivery/budget/listDetail`, { params })
}

/**
 * 预算修改
 */
export function $editBudgetNum(params) {
  return request.post(`/delivery/budget/edit`, params)
}

/**
 * 预算当月修改
 */
export function $editBudgetChart(params) {
  return request.post(`/delivery/budget/chartEdit`, params)
}

/**
  * 获取预算月份
 */
export function $getBudgetTimes(params) {
  return request.get(`/delivery/budget/getDate`, { params })
}

// ------------ 投放次数限制 --------------
// export function $limitPutCount(params) {
//   return request.post(`/delivery/account/limit/edit`, params)
// }

export function $findFlowData(params) {
  return request.get(`/delivery/new/findFlowData`, { params })
}

export function $limitPutCount(params) {
  return request.post(`/business/foreign/accountPutting/editAccountLimitInfo`, params)
}

/**
 * 查询可关联订单
 * @param {} params
 * @returns
 */
export function $findDependentOrderList(params) {
  return request.get(`/delivery/new/findDependentOrderList`, { params })
}

/**
 * 查询基金投放团队所有人（包含离职人员）
 */
export function $getFundUser(params) {
  return request.get(`/business/foreign/videoPutting/new/getFundUser`, { params })
}

/**
 * 推挤投放账号-观望中
 */

export function $updateStatus(params) {
  return request.post(`/account/recommend/updateStatus?random=${Math.random()}`, params)
}

/**
 * 投放专员指派-获取列表
 */

export function $getCommissionerList(params) {
  return request.get(`/delivery/specialist/list`, { params })
}

/**
 * 投放专员指派-获取广告师列表
 * @param {*} params
 * @returns
 */

export function $getAdvertiserInfo(params) {
  return request.get(`/delivery/specialist/getAdvertiserInfo`, { params })
}

/**
 * 投放专员指派-获取投放专员列表
 * @param {*} params
 */
export function $getDeliveryList(params) {
  return request.get(`/delivery/specialist/getDeliveryInfo`, { params })
}

/**
 * 投放专员指派-获取平台列表
 * @param {*} params
 */
export function $getBasePlatInfo(params) {
  return request.get(`/delivery/specialist/getBasePlatInfo`, { params })
}

/**
 * 投放专员指派-编辑确定
 * @param {*} params
 */
export function $editAppoint(params) {
  return request.post(`/delivery/specialist/edit`, params)
}

/**
 * 投放专员指派-获取搜索条件
 */
export function $getCommissionerCondition(params) {
  return request.get(`/delivery/org/commissioner/getCondition`, { params })
}

/**
 * 投放专员指派-编辑
 */
export function $editCommissioner(params) {
  return request.post(`/delivery/org/commissioner/edit`, params)
}

/**
 * 投放专员指派-请假状态修改
 * @param {*} params
 */
export function $editLeaveStatus(params) {
  return request.post(`/delivery/specialist/editLeaveStatus`, params)
}

/**
 * 投放需求池 - 查询列表
 */
export function $getRequirementList(params) {
  return request.get(`/delivery/requirement/getRequirementList`, { params })
}

/**
 * 投放需求池 - 获取条件列表
 */
export function $getRequirementCondition(params) {
  return request.get(`/delivery/requirement/getRequirementCondition`, { params })
}
/**
 * 投放需求池 - 根据平台id获取账号列表
 * @param {number} platId -- 平台ID
 */
export function $getRequirementAccount(params) {
  return request.get(`/delivery/requirement/getRequirementAccount`, { params })
}

/**
 * 需求提报-获取广告师所对应的投放师
 */
export function $getCommissionerUser(params) {
  return request.get(`/delivery/requirement/getCommissionerUser`, { params })
}

/**
 * 需求提报-获取下拉条件
 */

export function $getAddCondition(params) {
  return request.get(`/delivery/requirement/getAddCondition`, { params })
}

/**
 * 需求提报
 */
export function $addRequirement(params) {
  return request.post(`/delivery/requirement/addRequirement`, params)
}

/**
 * 需求编辑
 */
export function $updateRequirement(params) {
  return request.post(`/delivery/requirement/updateRequirement`, params)
}

/**
 * 需求状态变更接口
 */
export function $updateRequirementStatus(params) {
  return request.post(`/delivery/requirement/updateRequirementStatus`, params)
}

/**
 * 获取需求详情
 */
export function $getRequirementDetail(params) {
  return request.get(`/business/foreign/accountPutting/getRequirement`, { params })
}

/**
 * 需求进度
 */
export function $updateRequirementProgress(params) {
  return request.post(`/delivery/requirement/updateRequirementProgress`, params)
}

/**
 * 查询组件点击转化统计数据
 */
 export function $getClickConversionCount(params) {
  return request.get(`/delivery/componentClickConversion/count`, { params })
}

/**
 * 异常申诉-获取异常申诉详情
 */
export function $getAppealDetail(params) {
  return request.get(`/exception/order/appeal/appealDetail`, { params })
}

/**
 * 异常申诉-申请
 */
export function $addAppeal(params) {
  return request.post(`/exception/order/appeal/addAppeal`, params)
}

/**
 * 异常申诉-编辑
 */
export function $updateAppeal(params) {
  return request.post(`/exception/order/appeal/updateAppeal`, params)
}
/**
 * 异常申诉-列表
 */
export function $getAppealList(params, random = '') {
  console.log(random)
  return request.get(`/exception/order/appeal/appealList?random=${random}`, { params })
}

/**
 * 异常申诉-列表统计
 */
export function $getListStatistics(params) {
  return request.get(`/exception/order/appeal/listStatistics`, { params })
}

/**
 * 异常申诉-状态更改
 */
export function $updateAppealStatus(params) {
  return request.post(`/exception/order/appeal/updateAppealStatus`, params)
}

/**
 * 异常申诉-搜索条件获取
 */
export function $getAppealCondition(params) {
  return request.get(`/exception/order/appeal/getAppealCondition?r=${Math.random()}`, { params })
}

/**
 * 异常申诉-获取账号
 */
export function $getAppealAccount(params) {
  return request.get(`/exception/order/appeal/getAppealAccount`, { params })
}

/**
 * 异常申诉-取消
 */
export function $cancelAppeal(params) {
  return request.post(`/exception/order/appeal/cancelAppeal`, params)
}

/**
 * 基金订单投后详情-获取订单基本信息
 */
export const $getFundOrderBasicData = (params) => {
  return request.get('/delivery/detail/getSingleOrderInfo', { params })
}

/**
 * 基金订单投后详情- 抖音 - 组件点击回传检测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getFundDouyinBackData = (params) => {
  return request.get('/delivery/detail/getTiktokVideoSpreadTrend', { params })
}

/**
 * 基金订单投后详情- 快手 - link组件渠道号监测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getLinkData = (params) => {
  return request.get('/business/foreign/videoPutting/new/getOrderVideoData', { params })
}

/**
 * 基金订单投后详情- 抖音 - link组件渠道号监测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getLinkDouyinData = (params) => {
  return request.get('/business/foreign/videoPutting/getTiktokVideoSpreadTrend', { params })
}

/**
 * 基金订单投后详情- 快手 - 组件点击回传检测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getFundKuaiShouBackData = (params) => {
  return request.get('/delivery/detail/getKuaiShouVideoSpreadTrend', { params })
}

/**
 * 基金订单投后详情-获取【组件点击拉新促活】数据
 */
export const $getFundClickPullData = (params) => {
  return request.get('/delivery/detail/getComponentClickPullNewAndPromoteActivity', { params })
}

/**
 * 基金订单投后详情-获取【组件点击新增激活】数据
 */
export const $getFundClickAddData = (params) => {
  return request.get('/delivery/detail/getNewActiveUvData', { params })
}

/**
 * 基金订单投后详情-抖音 组件点击回传监测-核心指标数据
 */
export const $getFundDouyinBackCoreData = (params) => {
  return request.get('/delivery/detail/getDouyinNewOrderVideoConversionData', { params })
}

/**
 * 基金订单投后详情-快手 组件点击回传监测-核心指标数据
 */
export const $getFundKuaiShouBackCoreData = (params) => {
  return request.get('/delivery/detail/getKuaiShouNewOrderVideoConversionData', { params })
}

/**
 * 基金订单投后详情-抖音 link组件渠道号监测-核心指标数据
 */
export const $getFundDouyinLinkCoreData = (params) => {
  return request.get('/delivery/detail/getDouyinOrderVideoConversionData', { params })
}

/**
 * 基金订单投后详情-kuaishou link组件渠道号监测-核心指标数据
 */
export const $getFundKuaiShouLinkCoreData = (params) => {
  return request.get('/delivery/detail/getKuaiShouOrderVideoConversionData', { params })
}

/**
 * 自营订单投后详情-获取订单基本信息
 */
export const $getSelfOrderBasicData = (params) => {
  return request.get('/self/support/detail/getSingleOrderInfo', { params })
}

/**
 * 自营订单投后详情- 抖音 - 组件点击回传检测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getSelfDouyinBackData = (params) => {
  return request.get('/self/support/detail/getTiktokVideoSpreadTrend', { params })
}

/**
 * 自营订单投后详情- 快手 - 组件点击回传检测（返回播放趋势、点赞趋势、组件点击趋势）
 */
export const $getSelfKuaiShouBackData = (params) => {
  return request.get('/self/support/detail/getKuaiShouVideoSpreadTrend', { params })
}

/**
 * 自营订单投后详情-获取【组件点击拉新促活】数据
 */
export const $getSelfClickPullData = (params) => {
  return request.get('/self/support/detail/getComponentClickPullNewAndPromoteActivity', { params })
}

/**
 * 自营订单投后详情-获取【组件点击新增促活】数据
 */
export const $getSelfClickAddData = (params) => {
  return request.get('/self/support/detail/getNewActiveUvData', { params })
}

/**
 * 自营订单投后详情-抖音 组件点击回传监测-核心指标数据
 */
export const $getSelfDouyinBackCoreData = (params) => {
  return request.get('/self/support/detail/getDouyinNewOrderVideoConversionData', { params })
}

/**
 * 自营订单投后详情-快手 组件点击回传监测-核心指标数据
 */
export const $getSelfKuaiShouBackCoreData = (params) => {
  return request.get('/self/support/detail/getKuaiShouNewOrderVideoConversionData', { params })
}

/**
 * 订单投后详情-获取粉丝画像
 */
export const $getFunsPortraitData = (params) => {
  return request.get('/self/support/detail/getFanInfo', { params })
}

/**
 * 全部待处理需求-获取投放专员列表
 */
export const $getAllCommissionerList = (params) => {
  return request.get(`/delivery/allRequirementProcessController/getDeliveryUser`, { params })
}

/**
 * 全部待处理需求-获取某一投放专员的需求个数
 */
export const $getDemandCount = (params) => {
  return request.get(`/delivery/allRequirementProcessController/getRequirementCount`, { params })
}

/**
 * 全部待处理需求-批量移交
 */
export const $batchHandOverDemand = (params) => {
  return request.post('/delivery/allRequirementProcessController/transferAllRequirement', params)
}

/**
 * 全部待处理需求-单个移交
 */
export const $singleHandOverDemand = (params) => {
  return request.post('/delivery/allRequirementProcessController/transferRequirement', params)
}

/**
 * 春节投放需求代提-获取广告师列表
 */
 export const $getAdvertiserList = (params) => {
  return request.get(`/delivery/requirement/getAdvertiserInfo`, { params })
}

/**
 * 春节投放需求代提-添加
 */
export const $addRequirementForOther = (params) => {
  return request.post(`/delivery/requirement/addRequirementForOther`, params)
}
/**
 * 获取基金投放在职人员
 */
 export const $getFundUsers = (params) => {
  return request.get(`/business/foreign/accountPutting/getFundUsers`, { params })
}

/**
 * 编辑编导人员
 * @param {*} params
 */
export function $editChoreographer(params) {
  return request.post(`/delivery/new/editChoreographerInfoByOrderId`, params)
}
/**
 * 获取限制投放次数
 */
 export const $getPutCountInfo = (params) => {
  return request.get(`/business/foreign/accountPutting/getAccountLimitInfo`, { params })
}

/**
 * 获取拉黑账号平台
 */
export const $getBlackPlat = (params) => {
  return request.get(`/business/foreign/blockAccount/getPlatCondition`, { params })
}
/**
 * 获取拉黑账号平台
 */
 export const $getBlackAccount = (params) => {
  return request.get(`/business/foreign/blockAccount/getAccountInfo`, { params })
}
/**
 * 获取拉黑账号
 */
 export const $uploadBlackFile = (params) => {
  return request.get(`/business/foreign/blockAccount/uploadFile`, { params })
}
/**
 * 获取拉黑列表
 */
export const $getBlackList = (params) => {
  return request.get(`/business/foreign/blockAccount/blockAccountList`, { params })
}

/**
 * 获取拉黑列表
 */
 export const $removeBlackAccount = (params) => {
  return request.post(`/business/foreign/blockAccount/cancelBlock`, params)
}
/**
 * 需求审核接口
 */
 export const $auditRequirement = (params) => {
  return request.post(`/delivery/requirement/examineRequirement`, params)
}
/**
 * 根据需求ID获取需求信息
 */
 export const $getRequirementInfo = (params) => {
  return request.get(`/delivery/requirement/getRequirementInfo`, { params })
}
/**
 * 根据需求ID获取需求信息
 */
export const $getWaitAuditRequireCount = (params) => {
  return request.get(`/delivery/requirement/getWaitExamineRequirementCount`, { params })
}
/**
 * 根据需求ID获取需求信息
 */
export const $getAccountCrowdProportionInfo = (params) => {
  return request.get(`/delivery/requirement/getAccountCrowdProportionInfo`, { params })
}

// /**
//  * B2C-获取视频详细信息-业务转化详情
//  */
//  export const $getB2CVideoConversionDataVO = (params) => {
//   return request.get(`/app/qsj/order/conversion/new/h/detail/getB2CVideoConversionDataVO`, { params })
// }

// /**
//  * C2B-获取视频详细信息-业务转化详情
//  */
//  export const $getC2BVideoConversionDataVO = (params) => {
//   return request.get(`/app/qsj/order/conversion/new/h/detail/getCB2VideoConversionDataVO`, { params })
// }

/**
 * 获取视频详细信息-投放订单信息
 */
 export const $getSinglePuttingVideoInfoNew = (params) => {
  return request.get(`/app/qsj/order/conversion/new/h/detail/getSinglePuttingVideoInfoNew`, { params })
}

/**
 * B2C-获取订单详情-转化表现指标
 */
export const $getB2COrderConversionDataVO = (params) => {
  return request.get(`/app/qsj/order/conversion/new/h/detail/getB2CFundOrderConversionDataVO`, { params })
}

/**
 * C2B-获取订单详情-转化表现指标
 */
 export const $getC2BOrderConversionDataVO = (params) => {
  return request.get(`/app/qsj/order/conversion/new/h/detail/getC2BFundOrderConversionDataVO`, { params })
}

/**
 * B2C-获取订单详情-转化表现指标（自营）
 */
 export const $getB2CSelfOrderConversionDataVO = (params) => {
  return request.get(`/app/qsj/order/conversion/new/h/detail/getB2CSelfOrderConversionDataVO`, { params })
}

/**
 * C2B-获取订单详情-转化表现指标（自营）
 */
 export const $getC2BSelfOrderConversionDataVO = (params) => {
  return request.get(`/app/qsj/order/conversion/new/h/detail/getC2BSelfOrderConversionDataVO`, { params })
}

/**
 * 星图详情---获取订单信息
 */
 export const $getThirdOderDetail = (params) => {
  return request.get(`/delivery/xingtu/details/order/getThirdOderDetail`, { params })
}

/**
 * 是否确认价格
 */
 export const $confirmPrice = (params) => {
  return request.post(`/delivery/new/confirmPrice`, params)
}

/**
 * 是否确认视频发布时间
 */
 export const $setVideoRelease = (params) => {
  return request.post(`/delivery/new/setVideoRelease`, params)
}

/**
 * 账号列表获取
 */
export const $getPlusAccountInfo = (params) => {
  return request.get(`/business/foreign/accountPutting/getPlusAccountInfo`, { params })
}

/**
 * 海盗投放订单-收藏功能
 */
export const $doCollection = (params) => {
  return request.post(`/hd/order/collection/doCollection`, params)
}

/**
 * 投放订单-编辑话术
 */
export const $editSpeechcraftInfo = (params) => {
  return request.post(`/delivery/new/editSpeechcraftInfo`, params)
}
