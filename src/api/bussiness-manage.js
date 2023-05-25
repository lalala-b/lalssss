/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-12-25 17:44:06
 * @LastEditors: Linjie
 */
import request from '@/http'
import qs from 'qs'
import { DATA_SERVER } from '@/const'

/**
 *
 * @param params
 */
export function $getCondition(params) {
    return request.get(`/business/customer/getCondition`, { params })
}

/**
 * 查询客户管理-主对接人选项
 * @param params
 */
export function $getMainConnectsCondition(params) {
    return request.get(`/business/admin/mainConnects`, { params })
}

/**
 * 查询客户管理-AM对接人选项
 * @param params
 */
export function $getAMCondition(params) {
    return request.get(`/business/admin/ams`, { params })
}

/**
 * 查询客户管理-平均月平均选项
 * @param params
 */
export function $getAverageCondition(params) {
    return request.get(`/business/admin/averageOptions`, { params })
}

/**
 * 查询客户管理-创建人选项
 * @param params
 */
export function $getCreatePersonCondition(params) {
    return request.get(`/business/admin/createList`, { params })
}

/**
 * 查询客户管理-查询列表
 * @param params
 */
export function $getCustomerList(params) {
    return request.get(`/business/admin/list`, { params })
}

/**
 * 客户管理-保存&新增
 * @param params
 */
export function $saveCustomerDetail(params) {
    return request.post(`/business/admin/save`, params, { keepEmpty: true })
}

/**
 * 查询客户管理-编辑详情
 * @param params
 */
export function $getCustomerEditDetail(params) {
    return request.get(`/business/admin/editInfo`, { params })
}

/**
 * 查询客户管理-获取客户类型下拉项
 * @param params
 */
export function $getCustomerTypeList(params) {
    return request.get(`/business/admin/customerTypeList`, { params })
}

/**
 * 查询客户管理-获取详情
 * @param params
 */
export function $getCustomerDetail(params) {
    return request.get(`/business/admin/detail`, { params })
}

/**
 * 查询客户管理-获取详情-联系人列表
 * @param params
 */
export function $getDetailContactList(params) {
    return request.get(`/business/customer/infos`, { params })
}

/**
 * 查询客户管理-获取详情-商机列表
 * @param params
 */
export function $getDetailOpportunityList(params) {
    return request.get(`/quotient/channel/opportunity/listForCustomer`, { params })
}

/**
 * 查询客户联系人管理-获取详情-商机列表
 * @param params
 */
export function $getCustomerDetailOpportunityList(params) {
    return request.get(`/business/customer/opportunityList`, { params })
}

/**
 * 查询客户管理-获取详情-商单列表
 * @param params
 */
export function $getDetailInvoiceList(params) {
    return request.get(`/business/order/businessForCustomer`, { params })
}

/**
 * 查询客户联系人管理-获取详情-商单列表
 * @param params
 */
export function $getCustomerDetailInvoiceList(params) {
    return request.get(`/business/customer/businessOrderList`, { params })
}

/**
 * 客户联系人管理-新增
 * @param params
 */
export function $addCustomerContactInfo(params) {
    return request.post(`/business/customer/addCustomerInfo`, params, { keepEmpty: true })
}

/**
 * 客户联系人管理-获取所属客户下拉数据
 * @param params
 */
export function $getCustomerAdminList(params) {
    return request.get(`/business/admin/customerAdminList`)
}

/**
 * 查询数据
 * @param params
 */
export function $getList(params) {
    return request.get(`/business/customer/list`, { params })
}

/**
 * 新增公司名称|新增品牌|新增客户来源
 * @param params
 */
export function $addBaseCustomerInfo(params) {
    return request.post(`/business/customer/addBaseCustomerInfo`, params)
}

/**
 * 添加客户信息
 * @param params
 */
export function $addCustomerInfo(params) {
    return request.post(`/business/customer/addCustomerInfo`, params)
}

/**
 * 搜索公司名
 * @param {*} params
 * @returns
 */
export function $searchCompany(params) {
    return request.get(`/tianyancha/search`, { params })
}

/**
 * 【商单管理】- 列表
 * @param {*} params
 */
export function $getBusinessOrderList(params) {
    return request.get(`/business/order/getBusinessOrderList`, { params })
}

/**
 * 【商单管理】- 搜索条件数据获取
 * @param {*} params
 */
export function $getQueryCondition(params) {
    return request.get(`/business/order/getQueryCondition`, { params })
}

/**
 * 【商单管理】- 获取商单详情
 * @param {*} params quotientId 商单id
 */
export function $getBusinessOrderInfo(params) {
    return request.get(`/business/order/getBusinessOrderInfo`, { params })
}

/**
 * 【商单管理】- 删除
 * @param {*} params quotientId 商单id
 */
export function $deleteQuotientInfo(params) {
    return request.get(`/business/order/deleteQuotientInfo`, { params })
}
/**
 * 【商单管理】- 新增
 * @param {*} params
 */

export function $addQuotientInfo(params) {
    return request.post('/business/order/addQuotientInfo', params)
}

/**
 * 【商单管理】- 编辑
 * @param {*} params
 */

export function $updateQuotientInfo(params) {
    return request.post('/business/order/updateQuotientInfo', params)
}

/**
 * 【商单管理】- 根据对接人查询品牌信息
 * @param {*} params
 */

export function $getBrandInfoByCustomerId(params) {
    return request.get('/business/order/getBrandInfoByCustomerId', { params })
}

/**
 * 【商单管理】- 查询账号和平台的联动信息
 * @param {*} params
 */

export function $getAccountAndPlatInfo(params) {
    return request.get(`/business/order/getAccountAndPlatInfo`, { params })
}

/**
 * 【商单管理】- 查询合作账号及人员
 * @param {*} params
 */

export function $getTeamAndMember(params) {
    return request.get(`/business/order/getTeamAndMember`, { params })
}

/**
 * 【商单管理】- 根据商单id查询相关的视频数据
 * @param {*} params quotientId 商单号
 * @param {*} params start 开始时间
 * @param {*} params end 结束时间
 * @param {*} params determined 排序规则
 * @param {*} params flowStart 流量区间最小值
 * @param {*} params flowEnd 流量区间最大值
 */

export function $getVideoDataByQuotientId(params) {
    return request.get(`/order/video/getVideoDataByQuotientId`, { params })
}

/**
 * 【商单管理】- 获取视频数据趋势图数据
 * @param {*} params
 */

/**
 * 【工单管理】- 获取列表
 * @param {*} params
 */
export function $getWorkerOrderList(params) {
    return request.get(`/work/order/getWorkerOrderList`, { params })
}

/**
 * 【异常工单管理】- 获取列表
 * @param {*} params
 */
export function $getExceptionWorkerOrderList(params) {
    return request.get(`/work/order/getExceptionWorkerOrderList`, { params })
}

/**
 * 【异常工单管理】- 处理异常工单
 * @param {*} params
 */
export function $dealExceptionWorkerOrder(params) {
    return request.post(`/work/order/dealExceptionWorkerOrder`, params)
}

/**
 * 【账号详情】- 媒介信息列表
 * @param {*} params
 */
export function $getDetailWorkerOrder(params) {
    return request.get(`/work/order/getWorkerOrder`, { params })
}

/**
 * 【工单管理】- 获取详情
 * @param {*} params
 */
export function $getWorkerOrderInfo(params) {
    return request.get(`/work/order/getWorkerOrderInfo`, { params })
}

/**
 * 【工单管理】- 获取工单改造后详情
 * @param {*} params
 */
export function $getNewWorkerOrderInfo(params) {
    return request.get(`/work/order/getWorkerOrderInfo`, { params })
}

/**
 * 【工单管理】- 更新
 * @param {*} params
 */
export function $updateWorkerOrderInfo(params) {
    return request.post(`/work/order/updateWorkerOrderInfo`, params)
}

/**
 * 【工单管理】- 工单改造更新
 * @param {*} params
 */
export function $updateNewWorkerOrderInfo(params) {
    return request.post(`/new/worker/order/updateNewWorkerOrder`, params)
}

/**
 * 【工单管理】- 根据平台组织获取账号
 * @param {*} params
 */

export function $getAccountInfoByOrgIdOrPlatId(params) {
    return request.get(`/work/order/getAccountInfoByOrgIdOrPlatId`, { params })
}

/**
 * 【工单管理】- 特殊工单列表
 * @param {*} params
 */
export function $getSpecialWorkerOrderList(params) {
    return request.get(`/special/worker/getSpecialWorkerOrderList`, { params })
}

/**
 * 【工单管理】- 特殊工单详情
 * @param {*} params
 */
export function $getSpecialWorkOrderInfo(params) {
    return request.get(`/special/worker/getSpecialWorkOrderInfo`, { params })
}

/**
 * 【工单管理】- 特殊工单编辑
 * @param {*} params
 */
export function $updateSpecialWorkOrder(params) {
    return request.post(`/special/worker/updateSpecialWorkOrderInfo`, params)
}
/**
 * 【工单管理】- 特殊工单 查询创作者
 */
export function $getCooperationMember(params) {
    return request.get(`/special/worker/queryCooperationMember`, { params })
}

export function $getQuotientChart(params) {
    return request.get(`/order/video/getTrendDataByQuotientId`, { params })
}

/**
 * 查看客户信息
 * @param params
 */
export function $getCustomer(params) {
    return request.get(`/business/customer`, { params })
}

/**
 * 编辑客户信息
 * @param params
 */
export function $putCustomer(params) {
    return request.put(`/business/customer`, params, { keepEmpty: true })
}

/**
 * 新增发票信息
 * @param params
 */
export function $addReceiptInfo(params) {
    return request.post(`/business/customer/addReceiptInfo`, params)
}

/**
 * 查询条件
 * @param params
 */
export function $getLibraryCondition(params) {
    return request.get(`/business/foreign/library/getCondition`, { params })
}

/**
 * 广告库查询条件
 * @param params
 */
export function $getAdlibList(params) {
    return request.get(`/business/foreign/library/list`, { params })
}

/**
 * 广告库查询条件
 * @param params
 */
export function $getAccountCondition(params) {
    return request.get(`/business/foreign/accountPutting/getCondition`, { params })
}
/**
 * 查询内容类别
 * @param params
 */
export function $getContentType(params) {
    return request.get(`/business/foreign/orderPutting/getContentType`, { params })
}

/**
 * 查询数据-投放账号库
 * @param params
 */
export function $getAccountList(params) {
    return request.get(`/business/foreign/accountPutting/list`, { params })
}

/**
 * 投放账号库-对接人列表
 * @param {*} params
 */
export function $getMeetList(params) {
    return request.get(`/delivery/meet/user/record/list`, { params })
}

/**
 * 投放账号库-获取所属机构
 */
export function $getMcnName(params) {
    return request.get(`/business/foreign/accountPutting/getMcnName`, { params })
}

/**
 * 获取投放账号详细信息
 * @param {}} params
 */

export function $getRequirementAccountInfo(params) {
    return request.get(`/delivery/requirement/getRequirementAccountInfo`, { params })
}

/**
 * 获取link组件渠道号状态
 */
export function $getLinkStatus(params) {
    return request.get(`/business/foreign/orderPutting/checkAndroidDeliveryNameUseStatus`, { params })
}

/**
 * 推荐媒介账号
 * @param {*} params
 */
export function $getMediumRecommendList(params) {
    return request.get(`/intermediary/recommend/accountRecommendList`, { params })
}

/**
 * 推荐媒介账号添加账号
 * @param {*} params
 */
export function $addMedRecommendAccount(params) {
    return request.post(`/intermediary/recommend/addByRecommend`, params)
}

/**
 * 推荐媒介账号-不在推荐
 * @param {*} params
 */
export function $cancelMedRecommend(params) {
    return request.post(`/intermediary/recommend/refuseRecommend`, params)
}
/**
 * 获取不再推荐理由
 * @param {*} params
 */
export function $getMedRefuseByAccountId(params) {
    return request.get(`/intermediary/recommend/refuseRecommendDetail`, { params })
}

/**
 * 【媒介账号】所属机构、对接人
 * @param {*} params
 */
export function $getIntermediaryCondition(params) {
    return request.get(`/intermediary/recommend/intermediaryCondition`, { params })
}

/**
 * 获取签约账号库可用的标签
 * @param {*} params
 */
export function $getEnableTag(params) {
    return request.get(`/sign/contract/account/tiktok/getEnableTag`, { params })
}

/**
 * 【账号详情】- 媒介账号、投放账号详情列表
 */
export function $getPuttingOrMJAccountVideoList(params) {
    return request.get(`/business/foreign/library/getPuttingOrMJAccountVideoList`, { params })
}

/**
 * 【账号详情】- 媒介账号、投放账号统计信息
 * @param {*} params
 */
export function $orderPutAccountDetail(params) {
    return request.get(`/plat/account/accountBaseDetail`, { params })
}

/**
 * 【媒介账号库】- 查询媒介账号列表
 */
export function $getMedAccount(params) {
    return request.get(`/business/foreign/medAccount/page`, { params })
}

/**
 * 【媒介账号库】- 查询抖音媒介账号列表
 */
export function $getTiktokAccountList(params) {
    return request.get(`/medium/tiktok/account/list`, { params })
}

/**
 * 【媒介账号库】- 查询快手媒介账号列表
 */
export function $getKuaishouAccountList(params) {
    return request.get(`/medium/kuaishou/account/list`, { params })
}

/**
 * 【媒介账号库】- 查询b站媒介账号列表
 */
export function $getBilibiliAccountList(params) {
    return request.get(`/medium/bili/account/list`, { params })
}

/**
 * 【媒介账号库】- 查询小红书媒介账号列表
 */
export function $getRedbookAccountList(params) {
    return request.get(`/medium/redBook/account/list`, { params })
}

/**
 * 【媒介账号库】- 新增媒介账号
 * @param {*} params accountId
 */
export function $addMedAccount(params) {
    return request.post(`/business/foreign/medAccount/add`, params)
}

/**
 * 【媒介账号库】- 新增抖音媒介账号
 * @param {*} params accountId
 */
export function $addTiktokAccount(params) {
    return request.post(`/medium/tiktok/account/add`, params)
}

/**
 * 【媒介账号库】- 新增快手媒介账号
 * @param {*} params accountId
 */
export function $addKuaishouAccount(params) {
    return request.post(`/medium/kuaishou/account/add`, params)
}

/**
 * 【媒介账号库】- 新增B站媒介账号
 * @param {*} params accountId
 */
export function $addBilibiliAccount(params) {
    return request.post(`/medium/bili/account/add`, params)
}

/**
 * 【媒介账号库】- 新增小红书媒介账号
 * @param {*} params accountId
 */
export function $addRedbookAccount(params) {
    return request.post(`/medium/redBook/account/add`, params)
}

/**
 * 【媒介账号库】- 编辑媒介账号
 * @param {*} params accountId
 */
export function $editMedAccount(params) {
    return request.post(`/business/foreign/medAccount/edit`, params)
}

/**
 * 【媒介账号库】- 编辑抖音媒介账号
 * @param {*} params accountId
 */
export function $editTiktokAccount(params) {
    return request.post(`/medium/tiktok/account/edit`, params)
}

/**
 * 【媒介账号库】- 编辑快手媒介账号
 * @param {*} params accountId
 */
export function $editKuaishouAccount(params) {
    return request.post(`/medium/kuaishou/account/edit`, params)
}

/**
 * 【媒介账号库】- 编辑b站媒介账号
 * @param {*} params accountId
 */
export function $editBilibiliAccount(params) {
    return request.post(`/medium/bili/account/edit`, params)
}

/**
 * 【媒介账号库】- 编辑小红书媒介账号
 * @param {*} params accountId
 */
export function $editRedbookAccount(params) {
    return request.post(`/medium/redBook/account/edit`, params)
}

/**
 * 【媒介账号库】- 删除媒介账号
 * @param {*} params
 */

export function $deletMedAccount(params) {
    return request.post(`/business/foreign/medAccount/delete`, params)
}

/**
 * 【媒介账号库】- 删除抖音媒介账号
 * @param {*} params
 */

export function $deleteTiktokAccount(params) {
    return request.post(`/medium/tiktok/account/delete`, params)
}

/**
 * 【媒介账号库】- 删除快手媒介账号
 * @param {*} params
 */

export function $deleteKuaishouAccount(params) {
    return request.post(`/medium/kuaishou/account/delete`, params)
}

/**
 * 【媒介账号库】- 删除b站媒介账号
 * @param {*} params
 */

export function $deleteBilibiliAccount(params) {
    return request.post(`/medium/bili/account/delete`, params)
}

/**
 * 【媒介账号库】- 删除小红书媒介账号
 * @param {*} params
 */

export function $deleteRedbookAccount(params) {
    return request.post(`/medium/redBook/account/delete`, params)
}

/**
 * 【媒介账号库】- 批量导入-获取上一次导入状态
 * @param {*} params
 */
export function $getPrvImportStatus(params) {
    return request.get(`/intermediary/upload/list`, { params })
}

/**
 * 【媒介账号库】- 获取下拉框数据
 */
export function $getFilterData(params) {
    return request.get(`/business/foreign/medAccount/getMedAccountFilterData`, { params })
}

/**
 * 【媒介账号库】- 根据平台获取筛选项
 */
export function $getPlatConditionData(params) {
    return request.get(`/sign/contract/account/tiktok/getEnableTag`, { params })
}

/**
 * 【媒介账号库】- 获取范围
 * @param {*} params
 */
export function $getFilterRange(params) {
    return request.get(`/business/foreign/medAccount/getFilterRange`, { params })
}
export function $getMedAccounts(params) {
    return request.get(`/business/foreign/medAccount/getMedAccounts`, { params })
}

/**
 * 【媒介账号库】
 * @param {Array} params accountIds 账号列表
 * @param {Number} params accountStatus  账号状态 0-上架、1-下架
 */
export function $updateAccountStatus(params) {
    return request.post(`/business/foreign/medAccount/updateAccountStatus`, params)
}

/**
 * 【媒介账号库】更新抖音账号状态
 * @param {Array} params accountIds 账号列表
 * @param {Number} params accountStatus  账号状态 0-上架、1-下架
 */
export function $updateTiktokAccountStatus(params) {
    return request.post(`/medium/tiktok/account/updateAccountStatus`, params)
}

/**
 * 【媒介账号库】更新快手账号状态
 * @param {Array} params accountIds 账号列表
 * @param {Number} params accountStatus  账号状态 0-上架、1-下架
 */
export function $updateKuaishouAccountStatus(params) {
    return request.post(`/medium/kuaishou/account/updateAccountStatus`, params)
}

/**
 * 【媒介账号库】更新b站账号状态
 * @param {Array} params accountIds 账号列表
 * @param {Number} params accountStatus  账号状态 0-上架、1-下架
 */
export function $updateBilibiliAccountStatus(params) {
    return request.post(`/medium/bili/account/updateAccountStatus`, params)
}

/**
 * 【媒介账号库】更新小红书账号状态
 * @param {Array} params accountIds 账号列表
 * @param {Number} params accountStatus  账号状态 0-上架、1-下架
 */
export function $updateRedbookAccountStatus(params) {
    return request.post(`/medium/redBook/account/updateAccountStatus`, params)
}

/**
 * 【媒介账号库】根据所属机构获取媒介采买人
 * @param {*} params
 */
export function $getUserIdByMeduimOrgId(params) {
    return request.get(`/medium/mechanism/info/getUserId`, { params })
}

/**
 * 【媒介视频库】- 查询媒介视频列表
 */
export function $getmedVideoList(params) {
    return request.get(`/business/foreign/medVideo/page`, { params })
}

/**
 * 【媒介视频库】- 获取下拉框数据
 */
export function $getMedAccountFilterData(params) {
    return request.get(`/business/foreign/medVideo/getMedVideoFilterData`, { params })
}

/**
 * 【媒介视频库】- 获取详细数据
 * @param {*} params accountId
 */
export function $getEditDetail(params) {
    return request.get(`/business/foreign/medAccount/editDetail`, { params })
}

/**
 * 【媒介账号库】- 获取抖音详细数据
 * @param {*} params accountId
 */
export function $getTiktokEditDetail(params) {
    return request.get(`/medium/tiktok/account/getAccountDetail`, { params })
}

/**
 * 【媒介账号库】- 获取快手详细数据
 * @param {*} params accountId
 */
export function $getKuaishouEditDetail(params) {
    return request.get(`/medium/kuaishou/account/getAccountDetail`, { params })
}

/**
 * 【媒介账号库】- 获取B站详细数据
 * @param {*} params accountId
 */
export function $getBilibiliEditDetail(params) {
    return request.get(`/medium/bili/account/getAccountDetail`, { params })
}

/**
 * 【媒介账号库】- 获取小红书详细数据
 * @param {*} params accountId
 */
export function $getRedbookEditDetail(params) {
    return request.get(`/medium/redBook/account/getAccountDetail`, { params })
}

/**
 * 【媒介视频库】- 编辑
 * @param {*} params accountId
 */
export function $editMedVideo(params) {
    return request.post(`/business/foreign/medVideo/edit`, params)
}

/* 编辑投放账号
 * @param params
 */
export function $putAccountPutting(params) {
    return request.put(`/business/foreign/accountPutting`, params)
}

/**
 * 添加投放账号
 * @param params
 */
export function $postAccountPutting(params) {
    return request.post(`/business/foreign/accountPutting`, params)
}

/**
 * 投放订单数据查询
 * @param params
 */
export function $getOrderPuttingList(params) {
    return request.get(`/business/foreign/orderPutting/list`, { params })
}

/**
 * 投放订单数据查看
 * @param params
 */
export function $getOrderPutting(params) {
    return request.get(`/business/foreign/orderPutting`, { params })
}

/**
 * 投放订单数据编辑
 * @param params
 */
export function $putOrderPutting(params) {
    return request.put(`/business/foreign/orderPutting`, params)
}

/**
 * 投放订单数据下单
 * @param params
 */
export function $putOrderPuttingAdd(params) {
    return request.post(`/business/foreign/orderPutting/add`, params)
}

/**
 * 获取投放专员名单
 * @param {*} params
 */
export function $getTransferCondition(params) {
    return request.get(`/business/foreign/orderPutting/getTransferCondition?random=${Math.random()}`, { params })
}

/**
 * 移交投放订单
 * @param {* Number} params orderNumber 订单号
 * @param {* Number} params receiveUserId 投放专员id
 */

export function $transferOrder(params) {
    return request.post(`/business/foreign/orderPutting/transferOrder`, params)
}

/**
 *
 * @param params
 */
export function $delOrderPutting(params) {
    return request.delete(`/business/foreign/orderPutting?${qs.stringify(params)}`)
}

/**
 *
 * @param params
 */
export function $getVideoCondition() {
    return request.get(`/business/foreign/videoPutting/getCondition`)
}

/**
 * 投放视频数据查询
 * @param params
 */
export function $getVideoPuttingList(params) {
    return request.get(`/business/foreign/videoPutting/list`, { params })
}

/**
 * 投放视频查看单个详情
 * @param params
 */
export function $getVideoPutting(params) {
    return request.get(`/business/foreign/videoPutting`, { params })
}

/**
 *
 * @param {*} params 数据表现 抖音快手（5分钟/分时）
 * @returns
 */
 export function $getVideoSpreadTrendForMH(params) {
    return request.get(`${DATA_SERVER}/qsj_data/videoFlowCount/playTrend`, { params })
}

/**
 *
 * @param {*} params 数据表现 抖音旧版
 * @returns
 */
export function $getTiktokVideoSpreadTrend_Dnew(params) {
    return request.get(`/business/foreign/videoPutting/getTiktokVideoSpreadTrend`, { params })
}
/**
 *
 * @param {*} params 数据表现 快手新版
 * @returns
 */
export function $getTiktokVideoSpreadTrend_Knew(params) {
    return request.get(`/business/foreign/videoPutting/getKuaiShouVideoSpreadTrend`, { params })
}
/**
 * 【投放视频库】- 安卓新增激活
 * @param {*} params
 */
export function $getOrderVideoData(params) {
    return request.get(`${DATA_SERVER}/qsj_data/video/getOrderVideoData`, { params })
}

/**
 *
 * @param {*} params
 */
export function $getOrderVideoConversionData(params) {
    return request.get(`/business/foreign/videoPutting/getOrderVideoConversionData`, { params })
}

/**
 * 视频查询-编辑投放订单
 * @param params
 */
export function $getQueryVideo(params) {
    return request.get(`/business/foreign/orderPutting/queryVideo`, { params })
}

/**
 * 广告库-根平台获取账号
 */
export function $getByPlatId(params) {
    return request.get(`/business/foreign/library/getByPlatId`, { params })
}

/**
 * 投放账号库
 * 投放订单
 * 投放视频
 */
export function $getAccountPuttingByPlatId(params) {
    return request.get(`/business/foreign/accountPutting/getByPlatId`, { params })
}
/**
 * 编辑广告库
 */
export function $editAdvVideo(params) {
    return request.post(`/med/flow/editAdvVideo`, params)
}
/**
 * 查看广告库
 */
export function $getAdvVideoNote(params) {
    return request.get(`/med/flow/getAdvVideoNote`, { params })
}
/**
 * 查询商单是否有工单
 */
export function $getWorkCount(params) {
    return request.get(`/business/order/getWorkCount`, { params })
}

/**
 * 获取行业类别
 */
export function $getIndustryTypeTags(params) {
    return request.get(`/business/order/industryTypeTags`, { params })
}

/**
 * 获取行业类别（新）
 */
export function $getNewIndustryTypeTags(params) {
    return request.get(`/sys/plat/tag/tree`, { params })
}

/**
 * 账号推荐查询
 */
export function $getRecommendList(params) {
    return request.get(`/account/recommend`, { params })
}
/**
 * 账号拒绝推荐
 */
export function $cancelRecommend(params) {
    return request.post(`/account/refuse/recommend`, params)
}

/**
 * 获取不再推荐理由
 * @param {*} params
 */
export function $getRefuseByAccountId(params) {
    return request.get(`/account/refuse/recommend/getByAccountId`, { params })
}

/**
 * 账号推荐-添加投放账号
 */
export function $addRecommandAccount(params) {
    return request.post(`/business/foreign/accountPutting/addRecommandAccount`, params)
}

/**
 * 获取投放订单、投放视频库军团下拉框数据
 */
export function $getFundOrgId(params) {
    return request.get(`/business/foreign/accountPutting/getFundOrgId`, { params })
}

export function $getAccountRecentCourier(params) {
    return request.get(`/business/foreign/accountPutting/getAccountRecentCourier`, { params })
}
/**
 * 获取订单邮寄信息
 * @param {}} params
 */
export function $getOrderCourier(params) {
    return request.get(`/business/foreign/orderPutting/getOrderCourier`, { params })
}

/**
 * 【媒介供应商管理-获取机构列表
 */
export function $getMediumOrgList(params) {
    return request.get(`/medium/mechanism/info/list`, { params })
}

/**
 * 【媒介供应商管理-获取筛选数据】
 */
export function $getMediumOrgCondition(params) {
    return request.get(`/medium/mechanism/info/getCondition?randow=${Math.random()}`, { params })
}

/**
 * 【媒介供应商管理-新增媒介机构】
 */
export function $addMediuOrg(params) {
    return request.post(`/medium/mechanism/info/add`, params)
}

/**
 * 媒介供应商管理-编辑媒介机构】
 */
export function $editMediuOrg(params) {
    return request.post(`/medium/mechanism/info/edit`, params)
}

/**
 * 导出所选工单
 */
export function $downloadWorkerOrderForEdit(params) {
    return request.get(`/work/order/excel/downloadWorkerOrderForEdit`, { params })
}

/**
 * 导入工单
 */
export function $uploadWorkerOrderForEdit(params) {
    return request.post(`/work/order/excel/uploadWorkerOrderForEdit`, params)
}

/**
 * 下载失败的工单导入
 */
export function $downloadWorkerOrderErrInfo(params) {
    return request.get(`/work/order/excel/downloadWorkerOrderErrInfo`, { params })
}

/**
 * 获取商务账号库列表
 */

export function $getCommercialList(params) {
    return request.get('/account/commercial/affairs/list', { params })
}

/**
 * 获取商务账号库查询条件
 */

export function $getCommercialCondition(params) {
    return request.get('/account/commercial/affairs/getCondition', { params })
}

/**
 * 商务账号库-账号删除
 */

export function $delCommercialAccount(params) {
    return request.post(`/account/commercial/affairs/delete`, params)
}

/**
 * 商务账号库-账号上下架
 */

export function $editCommercialAccountStatus(params) {
    return request.post(`/account/commercial/affairs/editAccountStatus`, params)
}

/**
 * 商务账号库-获取账号信息
 */

export function $getCommercialAffairsAccountDetail(params) {
    return request.get(`/account/commercial/affairs/editCommercialAffairsAccountDetail`, { params })
}

/**
 * 商务账号库-账号编辑
 */
export function $editCommercialAccount(params) {
    return request.post(`/account/commercial/affairs/edit`, params)
}

/**
 * 商务账号库-账号添加
 */
export function $addCommercialAccount(params) {
    return request.post(`/account/commercial/affairs/add`, params)
}

/**
 * 商务账号库-平台-账号联动
 */
export function $getCommercialMedAccounts(params) {
    return request.get(`/account/commercial/affairs/getMedAccounts`)
}

/**
 * 商务账号库-获取上次导入状态
 */
export function $getCommercialPrvImportStatus() {
    return request.get(`/account/commercial/affairs/getLastUploadList`)
}

/**
 * 获取自营账号
 */

export function $getSelfAccount(params) {
    return request.get(`/account/condition/getSelfAccount`, { params })
}

/**
 * 获取制品制作人员
 */
export function $getEditViedoUserList(params) {
    return request.get(`/video/collect/getEditViedoUserList`, { params })
}

/**
 * 编辑邮寄信息
 */
export function $editMailInfo(params) {
    return request.post(`/delivery/new/editMailInfo`, params)
}

/**
 * 获取全部平台
 */
export function $getBasePlatInfo(params) {
    return request.get(`/delivery/componentClickConversion/getBasePlatInfo`, { params })
}

/**
 * 获取视频类型
 */
export function $getVideoType(params) {
    return request.get(`/business/foreign/videoPutting/new/getJunType`, { params })
}

/**
 * 获取自营订单、投放视频库军团下拉框数据
 */
export function $getProprietaryFundOrgId(params) {
    return request.get(`/business/foreign/accountPutting/getFundOrgIdZiying`, { params })
}

/**
 * 获取选择导入项列表
 */
export function $getImportList(params) {
    return request.get(`/work/order/excel/findUploadFields`, { params })
}

/**
 * 获取内容类别接口
 */
export const $getContentTypeList = (params) => {
    return request.get('/delivery/detail/getContentType', { params })
}

/**
 * 获取需求提报人状态
 */
export const $getDeliveryerStatus = (params) => {
    return request.get('/delivery/requirement/getDeliveryerStatus')
}

/**
 * 【MCN商机管理】- 获取筛选条件列表
 * @param {*} params
 */
export function $getBusinessOpportunityScreen(params) {
    return request.get(`/quotient/channel/opportunity/findOpportunityCondition`, { params })
}

/**
 * 【MCN商机管理】- 获取聚合信息
 * @param {*} params
 */
export function $getBusinessOpportunitySummary(params) {
    return request.get(`/quotient/channel/opportunity/statisticsOpportunityData`, { params })
}

/**
 * 【MCN商机管理】- 获取列表
 * @param {*} params
 */
export function $getBusinessOpportunityList(params) {
    return request.get(`/quotient/channel/opportunity/findOpportunityList`, { params })
}

/**
 * 【MCN商机管理】- 删除商机
 * @param {*} params
 */
export function $deleteOpportunity(params) {
    return request.post(`/quotient/channel/opportunity/deleteOpportunity`, params)
}

/**
 * 【MCN商机管理】- 不合作
 * @param {*} params
 */
export function $refuseCooperate(params) {
    return request.post(`/quotient/channel/opportunity/refuseOpportunity`, params)
}

/**
 * 【MCN商机管理】- 获取最终合作账号列表
 * @param {*} params
 */
export function $getFinalAccountList(params) {
    return request.get(`/quotient/channel/opportunity/findRecommendAccount`, { params })
}

/**
 * 【MCN商机管理】- 选择最终合作账号
 * @param {*} params
 */
export function $chooseFinalAccount(params) {
    return request.post(`/quotient/channel/opportunity/updateConfirmOpportunityAccount`, params)
}

/**
 * 【MCN商机管理】- 客户联系人和客户联动
 * @param {*} params
 */
export function $getCustomerGetCompany(params) {
    return request.get(`/quotient/channel/opportunity/getCustomerGetCompany`, { params })
}

/**
 * 【MCN商机管理】- 新建MCN商机
 * @param {*} params
 */
export function $addOpportunity(params) {
    return request.post(`/quotient/channel/opportunity/addOpportunity`, params)
}

/**
 * 【MCN商机管理】- 更新MCN商机
 * @param {*} params
 */
export function $updateOpportunity(params) {
    return request.post(`/quotient/channel/opportunity/updateOpportunity`, params)
}

/**
 * 【MCN商机管理】- MCN商机详情
 * @param {*} params
 */
export function $getOpportunityInfo(params) {
    return request.get(`/quotient/channel/opportunity/opportunityDetail`, { params })
}

/**
 * 【MCN商机管理】- 公司和客户联系人联动
 * @param {*} params
 */
export function $companyGetCustomer(params) {
    return request.get(`/quotient/channel/opportunity/companyGetCustomer`, { params })
}

/**
 * 【商机管理】- 获取自身的客户联系人
 * @param {*} params
 */
export function $getSelfCustomerList(params) {
    return request.get(`/business/order/getDockingPeople`, { params })
}

/**
 * 【MCN商机管理】- 实时保存推荐账号
 * @param {*} params
 */
export function $saveRecommendAccount(params) {
    return request.post(`/quotient/channel/opportunity/saveRecommendAccount`, params)
}

/**
 * 【MCN商机管理】- 检查商机是否被删除
 * @param {*} params
 */
export function $checkOpportunityDeleted(params) {
    return request.get(`/quotient/channel/opportunity/checkOpportunityDeleted`, { params })
}

/**
 * 【商机管理】- 获取排行榜
 * @param {*} params
 */
export function $getOpportunityRankList(params) {
    return request.get(`/quotient/opportunity/rankingList/findOpportunityRankingList`, { params })
}

/**
 * 【商机管理】- 获取排行榜筛选条件
 * @param {*} params
 */
export function $getRankCondition(params) {
    return request.get(`/quotient/opportunity/rankingList/getCondition`, { params })
}

/**
 * 【商机管理】- 获取平台信息筛选数据
 * @param {*} params
 */
 export function $findPlatInfo() {
    return request.get(`/qp/perform/order/info/findPlatInfo`)
}

/**
 * 【商机管理】- 获取账号信息筛选数据
 * @param {*} params
 */
 export function $selectAccountCondition(params) {
    return request.get(`/quotient/channel/opportunity/selectAccountCondition`, { params })
}

/**
 * 获取最近需求提报详情接口
 */
export function $getRecentRequirement(params) {
    return request.get(`/business/foreign/accountPutting/getRecentRequirement`, { params })
}

/**
 *  业务标签b2c获取产品型号
 * @param {*} params
 */
export function $getB2CPhoneModel() {
    return request.get(`/delivery/new/getPhoneModel`)
}

/**
 *  获取录单耗时排行榜条件
 * @param {*} params
 */
export function $getEntryRankingCondition() {
    return request.get(`/worker/order/entry/ranking/getEntryRankingCondition`)
}

/**
 *  获取录单耗时排行榜列表
 * @param {*} params
 */
export function $getEntryRankingList(params) {
    return request.get(`/worker/order/entry/ranking/findEntryRankingInfoList`, { params })
}

/**
 * 获取批量录单列表信息
 * @param {*} params
 */
export function $getBatchEntryList(params) {
    return request.get(`/business/order/getWorkersInfo`, { params })
}

/**
 * 保存批量录单信息
 * @param {*} params
 */
export function $batchUpdateOrder(params) {
    return request.post(`/work/order/batchUpdateOrder`, params)
}

/**
 * 获取待评价列表
 * @param {*} params
 */
export function $getEvaluateList(params) {
    return request.get('/worker/order/evaluate/getOrderEvaluateList', { params })
}

/**
 * 评价订单
 * @param {*} params
 */
export function $evaluateOrder(params) {
    return request.post(`/worker/order/evaluate/orderEvaluate`, params)
}

/**
 * 查询待评价工单列表总条数-列表中的小红点数字
 * @param {*} params
 */
export function $getEvaluateCount() {
    return request.get(`/worker/order/evaluate/countOrderEvaluate`)
}

/**
 * 查询异常工单列表总条数-列表中的小红点数字
 * @param {*} params
 */
export function $getExceptionOrderCount() {
    return request.get(`/work/order/statisticsExceptionOrder`)
}

/**
 * 媒介供应商管理-查询媒介机构信息
 * @param {*} params
 */
export function $getMediumMechanismInfo(params) {
    return request.get(`/medium/mechanism/info/getMediumMechanismInfo`, { params })
}

/**
 * 媒介供应商管理-批量导入
 * @param {*} params
 */
export function $batchExportMechanismAccount(params) {
    return request.get(`/medium/mechanism/info/batchExportMechanismAccount`, { params })
}

/**
 * 媒介账号获取更新字段列表
 * @param {*} params
 */
export function $accountGetFileds(params) {
    return request.get(`/business/foreign/medAccount/getFileds`, { params })
}
/**
 * 获取一轮定号的上次上传状态
 * @param {*} params
 */
export function $getPrvSetNoStatus(params) {
    return request.get(`/delivery/account/once/resultCount`, { params })
}
/**
 * 订单提醒-获取提醒人列表
 * @param {*} params
 */
export function $getRemindList(params) {
    return request.get(`/work/order/getRemindList`, { params })
}

/**
 * 订单提醒-获取历史提醒
 * @param {*} params
 */
export function $getRemindHistory(params) {
    return request.get(`/work/order/accessReminderListByWorkId`, { params })
}

/**
 * 订单提醒-发送提醒消息
 * @param {*} params
 */
export function $sendFinancialReminder(params) {
    return request.post(`/work/order/sendFinancialReminder`, params)
}
// 获取基金投放信息
export function $getDeliveryBusinessInfo(params) {
    return request.get(`/plat/account/getDeliveryBusinessInfo`, { params })
}
// 业务线投放次数达到上限提示
export function $getBusinessDeliveryInfo(params) {
    return request.get(`/delivery/new/getBusinessDeliveryInfo`, { params })
}
/**
 * 获取合同信息
 */
export function $getContractInfo(params) {
    return request.get('/delivery/new/getContractInfo', { params })
}
/**
 * 编辑合同信息
 */
export function $updateContractInfo(params) {
    return request.post('/delivery/new/updateContractInfo', params)
}

/**
 * 添加账号标签
 */
export function $addAccountFeature(params) {
    return request.post('/account/quote/library/addAccountFeature', params)
}

/**
 * 商单管理-批量核账
 */
export function $businessOrderBatchAudit(params) {
    return request.post('/business/order/batchAudit', params)
}

/**
 * 核账结果页
 */
export function $getBillListPage(params) {
    return request.post('/finance/bill/getBillListPage', params)
}

/**
 * 获取历史移交记录
 */
export function $getTransferOrderLog(params) {
    return request.get('/delivery/new/getTransferOrderLog', { params })
}

export function $getBasePlat(params) {
    return request.get('delivery/specialist/getBasePlatInfo', { params })
}
/**
 * 获取上传黑名单的上次上传状态
 * @param {*} params
 */
export function $getPrvResultCount(params) {
    return request.get(`/business/foreign/blockAccount/resultCount`, { params })
}
/**
 * 获取对应联系人的客户信息(商机管理的新增编辑)
 */
export function $getCustomerInfo(params) {
    return request.get('/quotient/channel/opportunity/customerInfo', { params })
}

/**
 * 获取行业类别
 */
export function $getIndustryTypeList(params) {
    return request.get('/sys/baseinfo/getIndustryTypeList', { params })
}

/**
 * 媒介账号分析-查询条件
 */
export function $getMedAccountList(params) {
    return request.get('/account/analysis/medium/account', { params })
}

/**
 * 媒介账号分析-查询条件
 */
export function $getMedCondition(params) {
    return request.get('/account/analysis/medium/condition', { params })
}

/**
 * 媒介账号分析-查询条件
 */
export function $getMedDataList(params) {
    return request.get('/account/analysis/medium/data', { params })
}
