/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-23 11:40:47
 * @LastEditTime: 2020-12-30 17:16:20
 * @LastEditors: Linjie
 */
import store from '../store/index'
import axios from 'axios/lib/axios'
import { isObject } from '@/utils'

export const DEFAULT_LOG_MESSAGE = {
  project: process.env.NODE_ENV === 'development' ? 'test' : 'production',
  system_id: 'qianshuju',
  system_name: '乾数据',
  page_id: '', // 页面路由
  page_title: '', // 页面名称
  event: 'enter_page', // 事件类型 enter_page:进入事件、click_app:点击事件
  user_id: '',
  user_name: '',
  event_time: '',
  ip: '127.0.0.0',
  properties: {
    operation_module: '查看'
  }
}

// setTimeout(() => {
//   DEFAULT_LOG_MESSAGE.user_id = store.state.user.userInfo.userid
//   DEFAULT_LOG_MESSAGE.user_name = store.state.user.userInfo.name
// }, 0)

export const upLog = (log) => {
  if (isObject(log.properties)) {
    for (const key in log.properties) {
      if (log.properties[key] === null || log.properties[key] === undefined || log.properties[key] === '') {
        delete log.properties[key]
      }
    }
  }
  if (!log.user_id) {
    DEFAULT_LOG_MESSAGE.user_id = log.user_id = store.state.user.userInfo.userid
    DEFAULT_LOG_MESSAGE.user_name = log.user_name = store.state.user.userInfo.name
  }
  // console.log(log)
  // process.env.NODE_ENV === 'development' ? console.log(log) : axios.post('https://ldpdbus.zhuanzhuan.com/dbus', log)
}
