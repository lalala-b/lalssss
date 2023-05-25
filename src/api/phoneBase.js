import request from '@/http'

/**
 * 新增/编辑机型
 */
export const $getAddModel = (params) => {
    return request.post(`/phone/save`, params, { keepEmpty: true })
}

/**
 * 获取手机数据库中电池容量下拉选项
 */
export function $getBatteryConditionList(params) {
    return request.get('/phone/battery', { params })
}

/**
 * 获取手机数据库中cpu处理器筛选下拉选项
 */
export function $getCpuList(params) {
    return request.get('/phone/cpu', { params })
}

/**
 * 获取手机数据库列表信息
 */
export function $getPhoneList(params) {
    return request.get('/phone/list', { params })
}

/**
 * 获取手机详情信息
 */
export function $getPhoneDetail(params) {
    return request.get('/phone/detail', { params })
}
/**
 * 获取海报
 */
export function $getPoster(params) {
    return request.get('/phone/poster', { params })
}
/**
 * 删除手机机型
 */
 export function $deleteModel(params) {
    return request.post('/phone/delete', params)
}
