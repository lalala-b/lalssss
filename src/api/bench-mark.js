/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-08-31 14:31:48
 * @LastEditors: Luoxd
 */
import request from '@/http'

/**
 * 获取列表
 * @param params
 */
export function $getBenchmarkAccounts(params) {
  return request.get(`/account/monitor/benchmarking/list`, { params })
}

/**
 * 删除内容
 */
export function $checkMarketImportStatus(params) {
  return request.get(`/admin/delete`, { params })
}
