import axios from 'axios'

export const BASE_URL = process.env.NODE_ENV === 'production' ? 'https://ad.zhuanzhuan.com' : ''

const $http = axios.create({
  baseURL: BASE_URL
})

$http.interceptors.response.use((response) => {
  if (response.status !== 200) {
    return Promise.reject(response.message || 'error')
  } else {
    const res = response.data
    if (res.code !== 1) {
      return Promise.reject({ message: res.message })
    }
    return Promise.resolve(res.data)
  }
}, (err) => {

})

/**
 *
 * @param {} params
 */
export function $getDetailData(params) {
  return $http.get(`/adpi/getDetailData`, { params })
}

/**
 * 获取趋势图
 * @param {*} params
 */
export function $getTrendChart(params) {
  return $http.get(`/adpi/getTrendChart`, { params })
}

export function $getCondition(params) {
  return $http.get(`/adpi/getCondition`, { params })
}
