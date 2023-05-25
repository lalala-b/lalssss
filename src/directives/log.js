/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-10-30 10:51:01
 * @LastEditTime: 2020-12-14 14:03:56
 * @LastEditors: Linjie
 */
import Vue from 'vue'
import { isString, isObject, objectMerge, deepClone } from '@/utils'
import { DEFAULT_LOG_MESSAGE, upLog } from '../log'
// 声明式埋点
export default function install() {
  Vue.directive('log', {
    bind(el, binding) {
      el.addEventListener('click', (e) => {
        let properties = isObject(binding.value) ? binding.value : {}
        if (isString(binding.value)) {
          try {
            properties = JSON.parse(binding.value)
          } catch (e) {
            console.log(e)
          }
        }
        properties.operation_module || (properties.operation_module = el.innerText)
        const logInfo = {
          event: 'click_app',
          event_time: new Date().getTime(),
          properties: properties
        }
        upLog(objectMerge(deepClone(DEFAULT_LOG_MESSAGE), logInfo))
      })
    }
  })
}
