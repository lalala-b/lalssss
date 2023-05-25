import request from '@/http'

/**
 * 接口访问控制-获取接口列表
 * @param {*} params
 */
export function $getApiControlList(params) {
  return request.get(`/sys/api/info/list`, { params })
}

/**
 * 接口访问控制-更新接口列表
 */

export function $updateApiList() {
  return request.get(`/sys/api/info/updateSysUrl`)
}

/**
 * 接口访问控制-删除
 */
export function $delApiById(id) {
  return request.delete(`/sys/api/info/${id}`)
}

/**
 * 接口访问控制-保存
 */
export function $updateApiInfo(params) {
  return request.post(`/sys/api/info/update`, params)
}

/**
 * 接口访问控制-绑定角色
 */

export function $bindRoleForApi(params) {
  return request.post(`/sys/api/info/bindRoleForApi`, params)
}

/**
 * 接口访问控制-获取api绑定的角色
 */
export function $getRoleByApiId(params) {
  return request.get(`/sys/api/info/getRoleByApiId`, { params })
}

/**
 * 广告信息管理-查询账号列表
 */
 export function $findAdAccountList(params) {
  return request.get(`/ad/base/account/info/findAdAccountList`, { params })
}

/**
 * 广告信息管理-删除账号信息
 */
export function $deleteAdAccount(params) {
  return request.post(`/ad/base/account/info/deleteAdAccount`, params)
}

/**
 * 广告信息管理-编辑账号信息
 */
export function $updateAdAccountInfo(params) {
  return request.post(`/ad/base/account/info/updateAdAccountInfo`, params)
}
/**
 * 广告信息管理-新增账号
 */
export function $addAdAccount(params) {
  return request.post(`/ad/base/account/info/addAdAccount`, params)
}
/**
 * 广告账户管理-获取账号平台
 */
export function $getPlatInfo(params) {
  return request.get(`/ad/base/account/info/getPlatInfo`, { params })
}
/**
 * 平台所有账号
 */
 export function $getDetailMedAccounts(params) {
  return request.get(`/ad/base/account/info/getAllAccount`, { params })
}
/**
 * 平台所有账号
 */
 export function $getAccountwithPlatId(params) {
  return request.get(`/ad/base/account/info/platWithAccount`, { params })
}
