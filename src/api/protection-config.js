import request from '@/http'

/**
 * 获取指定时间范围内冻结的日期
 * @param params
 */
export function $getFreezeDay(params) {
  return request.get(`/delivery/account/deadline/date/config/getFreezeDay`, { params })
}

/**
 * 获取当前系统时间
 * @param params
 */
export function $getSysCurTime(params) {
  return request.get(`/delivery/account/deadline/date/config/getSysCurTime`)
}

/**
 * 解冻
 * @param params
 */
export function $executeThawDay(params) {
  return request.post(`/delivery/account/deadline/date/config/executeThawDay`, params)
}

/**
 * 冻结
 * @param params
 */
export function $executeFreezeDay(params) {
  return request.post(`/delivery/account/deadline/date/config/executeFreezeDay`, params)
}
