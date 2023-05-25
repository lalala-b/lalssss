/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-10 17:57:49
 * @LastEditTime: 2020-10-21 17:37:59
 * @LastEditors: Linjie
 */
// import Vue from 'vue'
import permission from './permission'
// export default function install() {
//   Vue.prototype.$permission = permission
//   Vue.prototype.$bus = new Vue()
// }

export const initPrototype = function(Vue) {
  Vue.prototype.$permission = permission
  Vue.prototype.$bus = new Vue()
}
