/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 15:26:08
 * @LastEditTime: 2020-08-24 16:17:32
 * @LastEditors: Luoxd
 */
import request from '@/http'

/**
 * 获取列表
 * @param params
 */
export function $getArtNotice(params) {
  return request.post(`/notice/getArtNotice`, params)
}

/**
 * 删除内容
 */
export function $delContentArticle(params) {
  return request.get(`/admin/delete`, { params })
}
