import request from '@/http'

/**
 * 获取头部商务小组和工作室列表
 */

 export function $getSearchList(params) {
  return request.get(`/worker/order/selfOperate/getSelfOperateOrderCondition`, { params })
}

/**
 * 获取自营订单列表
 * @param params
 */
export function $getOrderList(params) {
  return request.get(`/worker/order/selfOperate/findSelfOperateOrderList`, { params })
}

/**
 * 获取数据统计
 */
export function $getStatistics(params) {
  return request.get(`/worker/order/selfOperate/statisticsSelfOperateOrderData`, { params })
}

/**
 * 获取自定订单详情
 * @param params
 */
 export function $getOrderDetail(params) {
  return request.get(`/worker/order/selfOperate/findSelfOperateOrderInfo`, { params })
}

/**
 * 编辑自营订单
 */
export function $editOrderDetail(params) {
  return request.post(`/worker/order/selfOperate/updateSelfOperateOrder`, params)
}

/**
 * 根据平台查询账号
 */
export function $getMedAccounts(params) {
  return request.get(`/business/foreign/medAccount/getMedAccounts`, { params })
}

/**
 * 订单转化查询-海盗基金查询
 */
export function $getPirateList(params) {
  return request.get(`/delivery/app/fund/list`, { params })
}

/**
 * 订单转化查询-海盗自营查询
 */
 export function $getProprietaryList(params) {
  return request.get(`/delivery/app/self/list`, { params })
}

/**
 * 自营多选平台账号接口联动
 */
export function $getMoreSelfAccounts(params) {
  return request.post(`/worker/order/selfOperate/selfPlatAccount`, params)
}

/**
 * 判断对应账号的日期的封档状态
 */
 export function $getDateStatus(params) {
  return request.get(`/account/slot/date/slotDateDetail`, { params })
}

/**
 * 新投放视频库-海盗基金查询
 */
export function $getDropVideoLibraryPirateList(params) {
  return request.post(`/app/qsj/order/conversion/new/h/fund/list`, params)
}

/**
 * 新投放视频库-海盗自营查询
 */
export function $getDropVideoLibrarySelfList(params) {
  return request.post(`/app/qsj/order/conversion/new/h/self/list`, params)
}

/**
 * 新投放视频库-海盗基金导出
 */
export function $exportDropVideoLibraryPirateList(params) {
  return request.post(`/app/qsj/order/conversion/new/h/fund/export`, params)
}

/**
 * 根据菜单、按钮code保存配置
 */
export function $updateMenuConfigData(params) {
  return request.post(`/sys/menu/columns/updateData`, params)
}

/**
 * 根据菜单、按钮code获取配置
 */
export function $getMenuConfigData(params) {
  return request.get(`/sys/menu/columns/getByMenuCodes`, { params })
}
