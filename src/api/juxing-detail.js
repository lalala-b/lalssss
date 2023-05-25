import request from '@/http'

export function $getKuaishouDetail(params) {
  return request.get(`/delivery/kuaishou/detail`, {
    params
  })
}
// 广告师确认视频接口
export function $confirmReleaseTime(params) {
  return request.post(`/delivery/third/details/order/confirmReleaseTime`, params)
}
