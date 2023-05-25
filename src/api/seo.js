import request from '@/http'

/**
 * 获取舆情打标列表
 * @param params
 */
export function $getOpinionMarkList(params) {
  return request.get(`/hd/seo/list`, { params })
}

/**
 * seo关键词筛选
 * @param params
 */
export function $getHdSeoKeyWordTypes(params) {
  return request.get(`/hd/seo/getHdSeoKeyWordTypes`, { params })
}

/**
 * 获取账号列表
 * @param params
 */
export function $getAccountList(params) {
  return request.get(`/hd/seo/getAccountList`, { params })
}

/**
 * 设置舆论倾向
 * @param params
 */
export function $setOpinion(params) {
  return request.post(`/hd/seo/setOpinion`, params)
}

