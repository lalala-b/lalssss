/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-09-09 10:20:01
 * @LastEditors: Luoxd
 */
import request from '@/http'

/**
 *
 * @param params
 */
export function $getSign(params) {
  return request.get(`/video/monitor/list`, { params })
}

/**
 *
 * @param params
 */
export function $getVideoType(params) {
  return request.get(`/video/monitor/list`, { params })
}

