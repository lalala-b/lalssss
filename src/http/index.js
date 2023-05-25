/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 14:23:58
 * @LastEditTime: 2020-12-30 16:13:33
 * @LastEditors: Linjie
 */
import Vue from 'vue'
import axios from 'axios/lib/axios'
import { Message } from 'element-ui'
import { isObject, isString } from '@/components/common'
import jsCookie from 'js-cookie'
import store from '../store'
import qs from 'qs'

// axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '/' : '/api/'

const CancelToken = axios.CancelToken

const removePending = (config) => {
  const pending = store.state.http.pending
  for (const i in pending) {
    if (pending[i].url === service.defaults.baseURL + config.url) { // 在当前请求在数组中存在时执行取消函数
      pending[i].f('取消')
      store.commit('http/REMOVE_PENDING', i)
      return
    }
  }
}

const clearPending = (config) => {
  if (!config) return
  const pending = store.state.http.pending
  for (const i in pending) {
    if (pending[i].url === config.url) { // 在当前请求在数组中存在时执行取消函数
      store.commit('http/REMOVE_PENDING', i)
      return
    }
  }
}

// create an axios instance
const service = axios.create({
  baseURL: '/api',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 20000, // request timeout, 20000
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  },
  paramsSerializer: (params) => {
    return qs.stringify({ ...params })
  },
  transformRequest: (data) => {
    try {
      isString(data) && (data = JSON.parse(data))
      return JSON.stringify({ ...data, ...{ componentId: Vue.prototype.$componentId }})
    } catch (err) {
      return data
    }
  }
})

function clearEmpty(config) {
  const { method } = config
  let params = null
  if (method === 'get') {
    params = config.params
  } else if (method === 'post') {
    console.info('-----------', config.data)
    params = typeof config.data === 'string' ? JSON.parse(config.data) : config.data
  }

  if (config.keepEmpty) {
    return
  }

  if (isObject(params)) {
    for (const key in params) {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key]
      }
    }
  }
  switch (method) {
      case 'get':
        config.params = params
        break
      case 'post':
        config.data = JSON.stringify(params)
        break
  }
}

// request interceptor
service.interceptors.request.use(
  (config) => {
    if (!config.url) {
      return Promise.reject('')
    }
    // 新抖音达人库使用，保证当前会话唯一
    const sessionId = sessionStorage.getItem('sessionId')

    if (config.method === 'post') {
      config.data = Object.assign({}, config.data, { componentId: Vue.prototype.$componentId, sessionId })
    } else {
      config.params = Object.assign({}, config.params, { componentId: Vue.prototype.$componentId, sessionId })
    }

    if (config.url.includes('ldpspider.zhuanzhuan.com')) {
      // 爬虫侧接口超时改为60s
      config.timeout = 60000

      // 爬虫侧接口增加用户信息
      if (config.method === 'post') {
        config.data = Object.assign({}, config.data, { userid: store.getters.userid, realname: store.getters.realname })
      } else {
        config.params = Object.assign({}, config.params, { userid: store.getters.userid, realname: store.getters.realname })
      }
    }
    // 清空空值
    clearEmpty(config)
    removePending(config) // 在一个axios发送前执行一下判定操作，在removePending中执行取消操作
    config.cancelToken = new CancelToken(function executor(c) { // 本次axios请求的配置添加cancelToken
      store.commit('http/ADD_PENDING', {
        url: service.defaults.baseURL + config.url,
        f: c
      })
      // 将本次的url添加到pending中，因此对于某个url第一次发起的请求不会被取消，因为还没有配置取消函数
    })
    // return Promise.reject(config)
    return Promise.resolve(config)
  },
  (error) => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    clearPending(response.config)
    if (response.status !== 200) {
      return Promise.reject(response.message || 'error')
    } else {
      const res = response.data
      if (res.code === 100401) {
        // 登陆失效
        jsCookie.remove('sso_uid')
        window.location.href = '/#/login'
        return
      }
      return res
    }
  },
  error => {
    if (error.__CANCEL__) {
      // 取消上次重复提交
      if (error.message === '取消') return Promise.reject(null)

      return Promise.reject({
        __CANCEL__: error.__CANCEL__
      })
    }
    clearPending(error.config)
    if (error.message === 'Network Error') {
      return Promise.reject({ message: '网络出错' })
    }
    if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
      if (process.env.NODE_ENV === 'production') {
        // 接口超时上报
        // SentryCapture({
        //   message: '接口超时',
        //   url: error.config.url,
        //   params: error.config.params,
        //   username: store.getters.realname,
        //   tags: 'time out'
        // }, 3)
      }
      return Promise.reject({ message: '响应超时' })
    }
    return Promise.reject(error)
  }
)

export const { get, post, put } = service

export const packApi = function(api, parmas) {
  return new Promise((resolve, reject) => {
    api(parmas).then(res => {
      if (res.code === 1) {
        resolve(res)
      } else {
        Message.error(res.message)
        return reject()
      }
    }).catch(err => {
      if (err.__CANCEL__) {
        return
      }
      Message.error(err.message)
      return reject()
    })
  })
}

export default service
