import request from '@/http'

/**
 * 注册校验用户是否合法
 * @param params
 */
export function $register(params) {
  return request.post(`/user/info/register`, params)
}

/**
 * 查询未读消息提醒
 * @param params
 */
export function $getUserMsgList(params) {
  return request.post(`/notice/getArtNotice`, params)
}

/**
 * 设置全部已读
 * @param params
 */
export function $readUserNotice(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getMPlatAndUser(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getMonitorUserFields(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getV1SelectAccount(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getPlats(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getV1VideoInfo(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $changeMarketCaseAdv(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $batchChangeMonitorChangeTag(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $batchChangeMonitorChangeVideo(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $changeMonitorChangeVideo(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 *
 * @param params
 */
export function $getV1AllTag(params) {
  return request.post(`/notice/readArtNotice`, params)
}

/**
 * 获取组织架构
 * @param params
 */
export function $getOrganization(params) {
  return request.get(`/organization/info/getByRoleOrg`, { params })
}

/**
 * 注册获取组织架构
 * @param {*} params
 */
export function $getRegistOrg(params) {
  return request.get(`/user/info/getRegisterOrg`, { params })
}
/**
 * 绑定组织架构
 * @param params
 */
export function $putOrganization(params) {
  return request.put(`/user/info/updateByUid`, params)
}

/**
 * 上传图片
 * @param params
 */
export function $uploadImage(params) {
  return request.put(`/admin/uploadImage`, params)
}

/**
 * 平台查询条件
 * @param params
 */
export function $getPlatCondition(params) {
  return request.get(`/video/monitor/getPlatCondition`, { params })
}

/**
 * 账号查询条件
 * @param params
 */
export function $getAccountCondition(params) {
  return request.get(`/video/monitor/getAccountCondition`, { params })
}

/**
 * 获取组织ID父组织下的所有组织ID和组织名 - new
 * @param params
 */
export function $getOrgCondition(params) {
  return request.get(`/org/condition?random=${Math.random()}`, { params })
}

/**
 * 获取组织ID父组织下的所有组织ID和组织名
 * @param params
 */
export function $getOrgList(params) {
  return request.get(`/account/monitor/team/getOrgList`, { params })
}

export function $getUserOrgChain(params) {
  return request.get(`/account/monitor/team/getUserOrgChain`, { params })
}

export function $updateUser(params) {
  return request.post(`/user/info/update`, params)
}

/**
 * 获取省、市
 * @param {*} params depth 0-省 1-市
 */
export function $getAera(params, random) {
  return request.get(`/geo/area/getAera${random ? `?random=${random}` : ''}`, { params: Object.assign({}, params) })
}
export function $getDYHotFlow(params) {
  return request.get('/xingtu/dyHotFlow', { params })
}

export function $getXingtuHotFlow(params) {
  return request.get('/xingtu/xingtuHotFlow', { params })
}

export function $getXingtuHotUser(params) {
  return request.get('/xingtu/xingtuHotUser', { params })
}

export function $getMutiBindAccounts() {
  return request.get('/home/getAccountBelong')
}

export function $getRansferDTeam(params) {
  return request.get('/home/getDInfoOrFInfo', { params })
}

export function $updateAccountBelong(params) {
  return request.post('/home/updateAccountBelong', params)
}

// 获取下一级的组织
export function $getNextOrgInfo(params) {
  return request.get(`/org/condition/next`, { params })
}

/**
 * 获取配置项
 * @param {*} params configCode 配置项code
 */
export function $getByConfigCode(params) {
  return request.get(`/base/config/getByConfigCode`, { params })
}

/**
 * 获取配置项的值
 * @param {Array} dictTypes 字典code
 */
export function $getDataByDictType(params) {
  return request.post(`/sys/dict/data/getByDictType?random=${Math.random()}`, params)
}

/**
 * 获取推荐投放账号剩余未反馈的条数
 */
export function $getRecommendLimitInfo() {
  return request.get(`/account/recommend/getRecommendLimitInfo`)
}

/**
 * 获取当前用户的组织信息
 */
export function $getUserOrgInfo() {
  return request.get(`/user/info/getUserOrgInfo`)
}

/**
 * 获取账号筛选标签
 */
export function $getSceneTags(params) {
  return request.get(`/sys/plat/tag/findSceneTags`, { params })
}

/**
 * 获取绑定飞书账号部门列表和直属用户
 */
export function $getFeishuDepartmentList() {
  return request.get(`/feishu/user/department/list`)
}

/**
 * 绑定飞书账号
 */
export function $bindFeishuDepartment(params) {
  return request.get(`/feishu/user/send/bindMsg`, { params })
}

/**
 * 查询订单归属组织及人员
 */
export function $getBelongOrgTree() {
  return request.get(`/qp/perform/order/info/findBelongOrgTree`)
}

/**
 * 切换用户快速登录
 */
 export function $quickLogin(params) {
  return request.post(`/user/info/quickLogin`, params)
}
