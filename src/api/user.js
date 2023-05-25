/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-20 10:51:52
 * @LastEditTime: 2020-11-01 23:41:10
 * @LastEditors: Linjie
 */
import axios from 'axios'

import request from '@/http'

export function $getUserInfo(params) {
  return axios.get('//zzauth.zhuanspirit.com/client/get_user_info', { params })
}

export function $getOldMenus(params) {
  return request.get('/user/info/getOldMenus', { params })
}

export function $getMenus(params) {
  return request.get('/user/info/getmenus', { params })
}

export function $login(params) {
  return request.post('/user/info/login', params)
}

export function $getEexternalUser() {
  return request.get('/user/info/getUserInfo')
}

/**
 * 获取验证码
 */
export function $getVerificationCode(params) {
  return request.get(`/user/info/getVerificationCode`, { params })
}

/**
 *
 * @returns
 */
 export function $newRegister(params) {
  return request.post(`/user/info/newRegister`, params)
}

