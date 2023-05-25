/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-10-22 21:00:23
 * @LastEditors: Linjie
 */
import request from '@/http'
import qs from 'qs'
import { PYTHON_HOST, DATA_SERVER } from '@/const'

/**
 *
 * @param params
 */
export function $editMyAccount(params) {
  return request.post(`/account/monitor/updateSelfAccount`, params)
}

/**
 *
 * @param params
 */
export function $delAccount(params) {
  return request.get(`/account/monitor/delete`, { params })
}

/**
 *
 * @param params
 */
export function $getSysPlatAccount(params) {
  return request.post(`/admin/list`, params)
}

/**
 *
 * @param params
 */
export function $transferAccount(params) {
  return request.get(`/admin/list`, { params })
}

/**
 *
 * @param params
 */
export function $getUsersDropdownData(params) {
  return request.get(`/admin/list`, { params })
}

/**
 *
 * @param params
 */
export function $getV1PlatAndUser(params) {
  return request.post(`/admin/list`, params)
}

/**
 *
 * @param params
 */
export function $getTeamAccounts(params) {
  return request.get(`/account/monitor/team/list`, { params })
}

/**
 *
 * @param params
 */
export function $getSelfAccounts(params) {
  return request.post(`/account/monitor/selfAccountList`, params)
}

/**
 * 查询账号统计数据
 * @param params
 */
export function $accountVideoList(params) {
  return request.post(`/med/flow/getAccountVideoList`, params)
}

/**
 * 查询账号视频
 * @param paramsaccountVideoLine
 */
export function $accountVideoChart(params) {
  return request.get(`/account/monitor/getAccountVideoData`, { params })
}

/**
 * 查询账号粉丝数据
 * @param params
 */
export function $accountFansChart(params) {
  return request.get(`/account/monitor/getAccountFansData`, { params })
}

/**
 *
 * @param params
 */
export function $getAccountDetail(params) {
  return request.get(`/account/monitor/getAccountDetail`, { params })
}

/**
 * 查询账号统计数据
 * @param params
 */
export function $getAccountDataNum(params) {
  return request.post(`/account/monitor/getAccountData`, params)
}

/**
 *
 * @param params
 */
export function $getMonitorUserFields(params) {
  return request.get(`/admin/list`, { params })
}

/**
 *
 * @param params
 */
export function $getVideoNotes(params) {
  return request.get(`/admin/list`, { params })
}

/**
 *
 * @param params
 */
export function $getMarkPlatAccounts(params) {
  return request.get(`/account/monitor/benchmarking/getCondition`, { params })
}

/**
 *
 * @param params
 */
export function $getListData(params) {
  return request.get(`/account/monitor/benchmarking/list`, { params })
}

/**
 *
 * @param params
 */
export function $modifyBenchmarkTags(params) {
  return request.put(`/account/monitor/benchmarking`, params)
}

/**
 *
 * @param params
 */
export function $delBenchmarkAccount(params) {
  return request.delete(`/account/monitor/benchmarking?${qs.stringify(params)}`)
}

/**
 *
 * @param params
 */
export function $getVideoDetail(params) {
  return request.get(`/med/flow/getVideoDetail`, { params })
}

/**
 *
 * @param params
 */
export function $getVideoPic(params) {
  return request.post(`/med/flow/getVideoData`, params)
}
/**
 *
 * @param params
 */
export function $getVideoPicNew(params) {
  return request.post(`${DATA_SERVER}/qsj_data/video/detailOnDaily`, params)
}
/**
 *
 * @param params
 */
export function $accountBaseInfo(params) {
  return request.post(`/account/detail/accountBaseInfo`, params)
}

/**
 * 一键导出各个账户在全网的流量表
 * @param params
 */
export function $exportDataByOrgExcel(params) {
  return request.get(`/account/monitor/team/exportDataByOrgExcel`, { params })
}

/**
 * 添加账号查询平台
 * @param params
 */
export function $getUserAccount(params) {
  return request.get(`${PYTHON_HOST}/plat_info`, { params })
}

/**
 * 新增我的账号信息
 * @param params
 */
export function $addSelfAccount(params) {
  return request.post(`/account/monitor/addSelfAccount`, params)
}

export function $getAccountInfoListCondition(params) {
  return request.get(`/account/monitor/getAccountInfoListCondition`, { params })
}

export function $getAccountInventoryCondition(params) {
  return request.get(`/account/inventory/getAccountInventoryCondition`, { params })
  // return request.get(`/mock/account/inventory/getAccountInventoryCondition`, { params })
}

export function $getAccountInventoryList(params) {
  return request.get(`/account/inventory/getAccountInventoryList`, { params })
  // return request.get(`/mock/account/inventory/getAccountInventoryList`, { params })
}

/**
 * 更新账号手机号
 * @param {*} params
 */
export function $updateAccountInventory(params) {
  return request.post(`/account/inventory/updateAccountInventory`, params, { keepEmpty: true })
}
/**
 * 批量编辑账号
 * @param {*} params
 */
export function $updateAccountInventoryBatch(params) {
  return request.post(`/account/inventory/updateAccountInventoryBatch`, params, { keepEmpty: true })
}

/**
 * 添加未绑定账号
 * @param {*} params
 */
export function $addAccountInventory(params) {
  return request.post(`/account/inventory/addAccountInventory`, params)
}

/**
 * 添加对标账号
 * @param {*} params
 */
export function $postAccountPutting(params) {
  return request.post(`/account/monitor/benchmarking/addBenchMarkAccount`, params)
}

/**
 * 团队账号添加为对标账号
 */
export function $postAddTeamBenkmark(params) {
  return request.post(`/account/monitor/benchmarking/addTeamBenkmark`, params)
}

/**
 * 添加账号搜索
 */
export function $getBaseInfo(params) {
  return request.get(`/account/add/getBaseInfo`, { params })
}

/**
 * 根据平台ID和getDataUrl获取匹配的mcn名字
 */
export function $getMatchingMcnName(params) {
  return request.get(`/business/foreign/accountPutting/getMatchingMcnName`, { params })
}

/**
 * 判断当前账号是不是首次被添加
 */
export function $isFirstAdd(params) {
  return request.get(`/account/monitor/isFirstAdd`, { params })
}

/**
 * 获取当前绑定账号信息接口
 */
 export function $getRebindAccountInfo(params) {
  return request.get(`/account/monitor/getRebindAccountInfo`, { params })
}

/**
 * 重新绑定接口
 */
export function $rebindAccount(params) {
  return request.post(`/account/monitor/rebind`, params)
}

/**
 * 获取运营负责人 、 账号绑定人员 、 手机卡使用人 、 实名人姓名等信息接口
 */
 export function $getAccountAboutUserInfo(params) {
  return request.get(`/account/inventory/getAccountAboutUserInfo`, { params })
}

/**
 * 账号绑定记录接口
 */
 export function $getAccountBindInfo(params) {
  return request.get(`/account/inventory/accountBindInfo`, { params })
}

/**
 * 获取账号归属列表
 */
 export function $getAccountAttribution(params) {
  return request.get(`/account/inventory/getAccountAttribution`, { params })
}

/**
 * 账号盘点库-删除
 */
export function $deleteInventoryAccount(params) {
  return request.post(`/account/inventory/delInventoryAccount`, params)
}

/**
 * 查询签约账号评价信息
 */
export function $findEvaluateInfo(params) {
  return request.get(`/sign/contract/account/findEvaluateInfo`, { params })
}

/**
 * 签约账号评价接口
 */
export function $signAccountEvaluate(params) {
  return request.post(`/sign/contract/account/signAccountEvaluate`, params)
}

/**
 * 获取分时数据
 */
export function $getHourVideoPicNew(params) {
  return request.post(`https://dataserv.qpmcn.com/api/qsj_data/video/detailOnHour`, params)
}

/**
 * 获取文章团列表
 */
export function $selfArticleAccountList(params) {
  return request.get(`/account/monitor/selfArticleAccountList`, { params })
}

/**
 * 获取文章团平台
 */
 export function $getArticlePlatCondition(params) {
  return request.get(`/video/monitor/getArticlePlatCondition`, { params })
}
/**
 * 获取文章团账号
 */
 export function $getArticleAccountNameCondition(params) {
  return request.get(`/account/monitor/getArticleAccountNameCondition`, { params })
}
