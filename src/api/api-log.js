/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-26 18:36:15
 * @LastEditTime: 2020-11-27 10:11:22
 * @LastEditors: Linjie
 */
import request from '@/http'

export const $getSucessList = (params) => {
  return request.get(`/log/api/list`, { params })
}

export const $getErrorList = (params) => {
  return request.get(`/log/error/list`, { params })
}
