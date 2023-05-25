import request from '@/http'

/**
 * 获取我的运营账号查询条件
 * @param params
 */
 export function $getAccountInfo(params) {
  return request.get(`/account/transfer/order/selfAccount/getAccountInfo`, { params })
}

/**
 * 获取我的抖音工作室-查询条件
 * @param params
 */
export function $getTiktokCondition() {
  return request.get(`/account/operate/tiktok/selfAccount/getAccountInfo`)
}

/**
 * 获取我的快手工作室-查询条件
 * @param params
 */
export function $getKuaishouCondition() {
  return request.get(`/account/operate/kuaishou/selfAccount/getAccountInfo`)
}

/**
 * 获取我的B站工作室-查询条件
 * @param params
 */
export function $getBilibiliCondition() {
  return request.get(`/account/operate/bli/selfAccount/getAccountInfo`)
}

/**
 * 获取我的小红书工作室-查询条件
 * @param params
 */
export function $getRedbookCondition() {
  return request.get(`/account/operate/redbook/selfAccount/getAccountInfo`)
}

/**
 * 获取抖音组工作室-查询条件
 * @param params
 */
export function $getTiktokGroupCondition() {
  return request.get(`/account/operate/tiktok/groupAccount/getAccountInfo`)
}

/**
 * 获取快手组工作室-查询条件
 * @param params
 */
export function $getKuaishouGroupCondition() {
  return request.get(`/account/operate/kuaishou/groupAccount/getAccountInfo`)
}

/**
 * 获取B站组工作室-查询条件
 * @param params
 */
export function $getBilibiliGroupCondition() {
  return request.get(`/account/operate/bli/groupAccount/getAccountInfo`)
}

/**
 * 获取小红书组工作室-查询条件
 * @param params
 */
export function $getRedbookGroupCondition() {
  return request.get(`/account/operate/redbook/groupAccount/getAccountInfo`)
}

/**
 * 我运营的账号 - 查询列表
 */
export function $getSelfAccountList(params) {
  return request.get(`/account/transfer/order/selfAccount/list`, { params })
}

/**
 * 我运营的账号 - 移交
 */
 export function $remove(params) {
  return request.post(`/account/transfer/order/selfAccount/handover`, params)
}
/**
 * 获取我的申请-条件
 * @param params
 */
export function $getApplicationInfo(params) {
  return request.get(`/account/transfer/order/apply/getAccountInfo`, { params })
}

/**
 * 获取我的申请列表
 */
 export function $getApplicationList(params) {
  return request.get(`/account/transfer/order/apply/list`, { params })
}

/**
 * 获取我的待办-条件
 * @param params
 */
 export function $getWaitInfo(params) {
  return request.get(`/account/transfer/order/needDealt/getAccountInfo`, { params })
}
/**
 * 获取我的待办列表
 */
export function $getWaitList(params) {
  return request.get(`/account/transfer/order/needDealt/list`, { params })
}

/**
 * 获取移交信息
 */
export function $getRemoveInfo(params) {
  return request.get(`/account/transfer/order/orderDetail`, { params })
}
/**
 * 撤销移交信息
 */
export function $cancelHandover(params) {
  return request.post(`/account/transfer/order/selfAccount/cancelHandover`, params)
}

/**
 * 审批通过 ｜｜驳回
 */
export function $approvedAccount(params) {
  return request.post(`/account/transfer/order/selfAccount/approvedAccount`, params)
}
/**
 * 同意接收
 */
 export function $receiveAplication(params) {
  return request.post(`/account/transfer/order/selfAccount/agreeAcceptAccount`, params)
}

/**
 * 核实
 */
export function $verificationPassedAccount(params) {
  return request.post(`/account/transfer/order/selfAccount/verificationPassedAccount`, params)
}
/**
 * 获取移交人员信息
 */
export function $getTransferInfo(params) {
  return request.get(`/account/transfer/order/selfAccount/getTransferInfo`, { params })
}

/**
 * 账号运营申请-详情
 */
export function $getAccountOperateDetail(params) {
  return request.get(`/account/transfer/order/accountOperateDetail`, { params })
}

/**
 * 账号运营申请-是否审批通过
 */
export function $approvedOperateAccount(params) {
  return request.post(`/account/transfer/order/selfAccount/accountOperate/approvedAccount`, params)
}
// 修改报备
export function $modifyReport(params) {
  return request.post(`/account/report/order/edit`, params)
}

/**
 * 我申请 - 修改报备撤销
 */
 export function $reportCancel(params) {
  return request.post(`/account/report/order/cancelHandover`, params)
}
/**
 * 核实修改报备申请
 */
export function $reportApprovedAccount(params) {
  return request.post(`/account/report/order/approvedAccount`, params)
}
/**
 * 修改报备申请详情
 */
 export function $getAccountReportDetail(params) {
  return request.get(`/account/report/order/accountReportingDetail`, { params })
}

/**
 * 获取实名人
 */
export function $getPirateUser(params) {
  return request.get(`/account/report/order/getPirateUser`, { params })
}

/**
 * 我运营的账号 - 查询条件
 */
 export function $getAccountInfoOp(params) {
  return request.get(`/account/operate/op/selfAccount/getAccountInfo`, { params })
}

/**
 * 乾派工作室账号 - 查询条件
 */
export function $getGroupAccountInfoOp(params) {
  return request.get(`/account/operate/op/groupAccount/getAccountInfo`, { params })
}

/**
 * 查看工作室我的账号列表
 */
 export function $getMyStudioList(params) {
  return request.get(`/account/operate/op/selfAccount/selfAccountList`, { params })
}

/**
 * 查看工作室我的抖音账号列表
 */
export function $getTiktokMyStudioList(params) {
  return request.get(`/account/operate/tiktok/selfAccount/selfAccountList`, { params })
}

/**
 * 查看工作室我的快手账号列表
 */
export function $getKuaishouMyStudioList(params) {
  return request.get(`/account/operate/kuaishou/selfAccount/selfAccountList`, { params })
}

/**
 * 查看工作室我的B站账号列表
 */
export function $getBilibiliMyStudioList(params) {
  return request.get(`/account/operate/bli/selfAccount/selfAccountList`, { params })
}

/**
 * 查看工作室我的小红书账号列表
 */
export function $getRedbookMyStudioList(params) {
  return request.get(`/account/operate/redbook/selfAccount/selfAccountList`, { params })
}

/**
 * 查看工作室全部账号-查询条件
 */
export function $getStudioAccounts(params) {
  return request.get(`/account/operate/op/groupAccount/getAccountInfo`, { params })
}

/**
 * 工作室账号运营员 - 查询条件(账号信息)
 */
export function $getOperatorName(params) {
  return request.get(`/account/operate/op/groupAccount/getOperatorName`, { params })
}

/**
 * 工作室 - 查询条件(账号信息)
 */
export function $getOrgList(params) {
  return request.get(`/account/operate/op/groupAccount/getOrgList`, { params })
}

/**
 * 查看工作室全部账号列表
 */
 export function $groupAccountList(params) {
  return request.get(`/account/operate/op/groupAccount/groupAccountList`, { params })
}

/**
 * 查看工作室全部抖音账号列表
 */
export function $getTiktokGroupAccountList(params) {
  return request.get(`/account/operate/tiktok/groupAccount/groupAccountList`, { params })
}

/**
 * 查看工作室全部快手账号列表
 */
export function $getKuaishouGroupAccountList(params) {
  return request.get(`/account/operate/kuaishou/groupAccount/groupAccountList`, { params })
}

/**
 * 查看工作室全部b站账号列表
 */
export function $getBilibiliGroupAccountList(params) {
  return request.get(`/account/operate/bli/groupAccount/groupAccountList`, { params })
}

/**
 * 查看工作室全部小红书账号列表
 */
export function $getRedbookGroupAccountList(params) {
  return request.get(`/account/operate/redbook/groupAccount/groupAccountList`, { params })
}

/**
 * 工作室账号移交申请
 */
export function $handoverQP(params) {
  return request.post(`/account/operate/op/selfAccount/handoverQP`, params)
}

/**
 * 工作室账号编辑详情
 */
export function $getAccountDetail(params) {
  return request.get(`/account/operate/op/accountDetail`, { params })
}

/**
 * 工作室账号编辑抖音详情
 */
export function $getTiktokAccountDetail(params) {
  return request.get(`/account/operate/tiktok/accountTikTokDetail`, { params })
}

/**
 * 工作室账号编辑快手详情
 */
export function $getKuaishouAccountDetail(params) {
  return request.get(`/account/operate/kuaishou/accountKuaiShouDetail`, { params })
}

/**
 * 工作室账号编辑B站详情
 */
export function $getBilibiliAccountDetail(params) {
  return request.get(`/account/operate/bli/accountBliDetail`, { params })
}

/**
 * 工作室账号编辑小红书详情
 */
export function $getRedbookAccountDetail(params) {
  return request.get(`/account/operate/redbook/accountRedBookDetail`, { params })
}

/**
 * 工作室账号编辑
 */
export function $editAtyAccountDetail(params) {
  return request.post(`/account/operate/op/editAtyAccountDetail`, params)
}

/**
 * 工作室抖音账号编辑
 */
export function $editTiktokAccountDetail(params) {
  return request.post(`/account/operate/tiktok/editAtyAccountDetail`, params)
}

/**
 * 工作室快手账号编辑
 */
export function $editKuaishouAccountDetail(params) {
  return request.post(`/account/operate/kuaishou/editAtyAccountKuaiShouDetail`, params)
}

/**
 * 工作室b站账号编辑
 */
export function $editBilibiliAccountDetail(params) {
  return request.post(`/account/operate/bli/editAtyAccountBliDetail`, params)
}

/**
 * 工作室小红书账号编辑
 */
export function $editRedbookAccountDetail(params) {
  return request.post(`/account/operate/redbook/editAtyAccountRedBookDetail`, params)
}

/**
* 编辑SOP类型
*/
export function $editAccountInfo(params) {
 return request.post(`/account/transfer/order/selfAccount/editAccountInfo`, params)
}

/**
* 获取运营管理-团队账号
*/
export function $orgAccountList(params) {
  return request.get(`account/inventory/info/orgAccount/list`, { params })
}
/**
* 获取运营管理-团队账号的运营负责人
*/
export function $getAccountAboutUserInfo(params) {
  return request.get(`account/inventory/info/orgAccount/getAccountAboutUserInfo`, { params })
 }
/**
* 获取运营管理-团队账号账号归属
*/
export function $getAccountOrgList(params) {
  return request.get(`account/inventory/info/orgAccount/OrgList`, { params })
}
/**
 * 获取发起人、处理人
 */
export function $getInitiatorList(params) {
  return request.get(`/account/transfer/order/needDealt/getUserInfo`, { params })
}
/**
* 获取全部待办列表
*/
export function $getAllList(params) {
  return request.get(`/account/transfer/order/needDealt/listAll`, { params })
}

/**
* 工作室账号分析查询条件
*/
export function $getselfCondition(params) {
  return request.get(`/account/analysis/self/condition`, { params })
}

/**
 * 工作室账号分析
 */
export function $getStudioSelfList(params) {
  return request.get(`/account/analysis/self/data`, { params })
}

/**
 * 工作室账号查询
 */
 export function $getStudioAccountList(params) {
  return request.get(`/account/analysis/self/account`, { params })
}

/**
 * 我运营的账号--批量移交申请
 */
 export function $batchHandover(params) {
  return request.post(`/account/transfer/order/selfAccount/batchHandover`, params)
}

/**
 * 我运营的账号--判断账号是否已全部移交
 */
 export function $checkAllAccountTransfer() {
  return request.get(`/account/transfer/order/selfAccount/checkAllAccountTransfer`)
}

/**
 * 全部申请--是否批量同意接收
 */
 export function $batchAgreeAcceptAccount(params) {
  return request.post(`/account/transfer/order/selfAccount/batchAgreeAcceptAccount`, params)
}

/**
 * 全部申请--所有待接收用户的id
 */
 export function $getAllSoonReceivedId() {
  return request.get(`/account/transfer/order/selfAccount/accountOperate/getAllSoonReceivedId`)
}

/**
 * 自营信息编辑---获取实名人姓名/手机卡实名认证人/实体手机卡现持有人/账号当前运营人数据
 */
export function $getOpSimpleUser() {
  return request.get(`/account/operate/op/opSimpleUserInfoVO`)
}
