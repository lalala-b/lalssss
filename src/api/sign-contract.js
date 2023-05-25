import request from '@/http'
import qs from 'qs'
/**
 * 获取签约账号库列表条件
 * @param params
 */
export function $getSignContractCondition(params) {
  return request.get(`/sign/contract/account/getSignContractCondition`, { params })
}

/**
 * 获取签约账号库抖音达人列表条件
 * @param params
 */
export function $getSignContractTikTokCondition(params) {
  return request.get(`/sign/contract/account/tiktok/getSignContractTikTokCondition`, { params })
}

/**
 * 获取签约账号库快手达人列表条件
 * @param params
 */
export function $getSignContractKuaiShouCondition(params) {
  return request.get(`/sign/contract/account/kuaishou/getSignKuaiShouCondition`, { params })
}

/**
 * 获取签约账号库b站达人列表条件
 * @param params
 */
export function $getSignContractBliCondition(params) {
  return request.get(`/sign/contract/account/blibli/getSignBliCondition`, { params })
}

/**
 * 获取签约账号库小红书达人列表条件
 * @param params
 */
export function $getSignContractRedBookCondition(params) {
  return request.get(`/sign/contract/account/redbook/getSignRedBookCondition`, { params })
}

/**
 * 获取签约账号库-根据签约团队获取签约小组
 * @param params
 */
export const $getSignContractTeam = (params) => {
  return request.get(`/sign/contract/account/getSignTeamInfo`, { params })
}

/**
 * 查询签约账号列表
 * @param params
 */
export function $findSignContractAccountList(params) {
  return request.get(`/sign/contract/account/findSignContractAccountList`, { params })
}

/**
 * 查询抖音签约账号列表
 * @param params
 */
export function $findSignAccountTikTokList(params) {
  return request.get(`/sign/contract/account/tiktok/findSignAccountTikTokList`, { params })
}

/**
 * 查询快手签约账号列表
 * @param params
 */
export function $findSignAccountKuaiShouList(params) {
  return request.get(`/sign/contract/account/kuaishou/findSignAccountKuaiShouList`, { params })
}

/**
 * 查询b站签约账号列表
 * @param params
 */
export function $findSignAccountBliList(params) {
  return request.get(`/sign/contract/account/blibli/findSignAccountBliList`, { params })
}

/**
 * 查询小红书签约账号列表
 * @param params
 */
export function $findSignAccountRedBookList(params) {
  return request.get(`/sign/contract/account/redbook/findSignAccountRedBookList`, { params })
}

/**
 * 添加签约账号
 * @param params
 */
export function $addSignContractAccount(params) {
  return request.post(`/sign/contract/account/addSignContractAccount`, params)
}

/**
 * 添加抖音签约账号
 * @param params
 */
export function $addSignContractAccountTikTok(params) {
  return request.post(`/sign/contract/account/tiktok/addSignContractAccountTikTok`, params)
}

/**
 * 添加快手签约账号
 * @param params
 */
export function $addSignAccountKuaiShou(params) {
  return request.post(`/sign/contract/account/kuaishou/addSignAccountKuaiShou`, params)
}

/**
 * 添加b站签约账号
 * @param params
 */
export function $addSignAccountBli(params) {
  return request.post(`/sign/contract/account/blibli/addSignAccountBli`, params)
}

/**
 * 添加小红书签约账号
 * @param params
 */
export function $addSignAccountRedBook(params) {
  return request.post(`/sign/contract/account/redbook/addSignAccountRedBook`, params)
}

/**
 * 编辑签约账号
 * @param params
 */
export function $editSignContractAccount(params) {
  return request.post(`/sign/contract/account/editSignContractAccount`, params)
}

/**
 * 编辑抖音签约账号
 * @param params
 */
export function $editSignContractAccountTikTok(params) {
  return request.post(`/sign/contract/account/tiktok/editSignContractAccountTikTok`, params)
}

/**
 * 编辑快手签约账号
 * @param params
 */
export function $editSignAccountKuaiShou(params) {
  return request.post(`/sign/contract/account/kuaishou/editSignAccountKuaiShou`, params)
}

/**
 * 编辑b站签约账号
 * @param params
 */
export function $editSignAccountBli(params) {
  return request.post(`/sign/contract/account/blibli/editSignAccountBli`, params)
}

/**
 * 编辑小红书签约账号
 * @param params
 */
export function $editSignAccountRedBook(params) {
  return request.post(`/sign/contract/account/redbook/editSignAccountRedBook`, params)
}

/**
 * 签约账号修改状态
 * @param params
 */
export function $updateAccountStatus(params) {
  return request.post(`/sign/contract/account/updateAccountStatus`, params)
}

/**
 * 签约账号删除
 * @param params
 */
export function $deleteAccount(params) {
  return request.post(`/sign/contract/account/delete`, params)
}

/**
 * 获取最近一次上传状态
 * @param params
 */
export function $getPrevUpdateStatus(params) {
  return request.get(`/sign/contract/account/findNearData`, params)
}

/**
 * 查询行业类别和对接商务
 */
export function $getEditCondition(params) {
  return request.get(`/sign/contract/account/getEditCondition`, params)
}

/**
 * 查询项目search条件下拉列表数据
 */
 export function $getProjectSearchList(params) {
  return request.get(`/sign/contract/account/order/getSignContractOrderCondition`, params)
}

/**
 * 查询签约经纪人
 */
 export function $getSignAgents(params) {
  return request.get(`/sign/contract/account/order/getSignUserInfo`, { params })
}

/**
 * 查询合作项目列表
 */
 export function $getCooperationProjectList(params) {
  return request.get(`/sign/contract/account/order/signOrderList`, { params })
}

/**
* 新增合作项目详情
*/
export function $addProjectDetail(params) {
 return request.post(`/sign/contract/account/order/addOrder`, params)
}
/**
 * 编辑合作项目详情
 */
 export function $editProjectDetail(params) {
  return request.post(`/sign/contract/account/order`, params)
}
/**
 *删除合作项目详情
 */
 export function $deleteProjectRow(params) {
  return request.delete(`/sign/contract/account/order/deleteOrder?${qs.stringify(params)}`)
}
/**
 * 查询合作项目详情
 */
 export function $getProjectDetial(params) {
  return request.get(`/sign/contract/account/order/getOrderInfo`, { params })
}

/**
 * 签约账号订单数据汇总接口
 */
export function $signOrderListStatistics(params) {
  return request.get(`/sign/contract/account/order/signOrderListStatistics`, { params })
}

/**
* 查看新增中的下单账号
*/
export function $getOrderAccountList(params) {
 return request.get(`business/foreign/medAccount/getMedAccounts`, { params })
}
/**
* 查看新增中的下单账号
*/
export function $getAddPageCondition(params) {
  return request.get(`/sign/contract/account/order/getAddPageCondition`, { params })
 }

/**
 * 查询营收数据统计
 */
 export function $getRevenueStatistics(params) {
  return request.get(`/sign/contract/account/order/projectStatistics`, { params })
}
/**
 * 查询营收列表
 */
 export function $getRevenueDetailList(params) {
  return request.get(`/sign/contract/account/order/projectDetailGroupByMember`, { params })
}
/**
 * 查看月度收支
 */
 export function $getMonthPayment(params) {
  return request.get(`/sign/contract/account/order/getIncomeAndExpenditureInfo`, { params })
}
/**
 * 设置月度收支
 */
export function $setMonthPayment(params) {
  return request.post(`sign/contract/account/order/addIncomeAndExpenditure`, params)
}

/**
* 修改月度收支
*/
export function $editMonthPayment(params) {
 return request.post(`sign/contract/account/order/updateIncomeAndExpenditure`, params)
}
/**
 * 平台账号接口
 */
export function $getMedAccounts(params) {
  return request.get(`/sign/contract/account/getSignContractAccounts`, { params })
}
/**
 * 平台账号接口联动
 */
export function $getDetailMedAccounts(params) {
  return request.get(`/business/foreign/medAccount/getMedAccounts`, { params })
}

/**
 * 签约多选平台账号接口联动
 */
export function $getMoreSignMedAccounts(params) {
  return request.post(`/sign/contract/account/order/signPlatAccount`, params)
}

/**
 * 媒介多选平台账号接口联动
 */
export function $getMoreMediumAccounts(params) {
  return request.post(`/medium/mediumOrder/mediumPlatAccount`, params)
}

/**
 * 对应账号的档期管理数据
 */
 export function $getDqManagementData(params) {
  return request.get(`/account/slot/date/slotDateList`, { params })
}

/**
 * 添加对应账号的档期管理数据
 */
 export function $addDqManagementData(params) {
  return request.post(`/account/slot/date/addSlotDate`, params)
}

/**
 * 更新对应账号的档期管理数据
 */
 export function $updateDqManagementData(params) {
  return request.post(`/account/slot/date/updateSlotDate`, params)
}

/**
 * 抵扣工单-根据父单id查询子单信息
 */
export function $deductionFindChildWorkOrder(params) {
  return request.get(`/med/worker/parent/findChildWorkOrder`, { params })
}

/**
 * 抵扣工单-添加子单
 */
export function $deductionAddChildWorkOrder(params) {
  return request.get(`/med/worker/parent/checkWorkOrder`, { params })
}

/**
 * 抵扣工单-新绑定或更新子单信息
 */
export function $deductionAddOrUpdateChildWorkOrder(params) {
  return request.post(`/med/worker/parent/addOrUpdate`, params)
}

