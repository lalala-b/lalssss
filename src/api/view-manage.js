/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-08-31 10:50:25
 * @LastEditors: Luoxd
 */
import request from '@/http'

/**
 * 获取列表
 * @param params
 */
export function $getSysPlatAccount(params) {
  return request.post(`/admin/list`, params)
}
