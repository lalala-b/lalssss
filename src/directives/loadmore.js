/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-10-30 10:51:01
 * @LastEditTime: 2020-11-12 22:40:22
 * @LastEditors: Linjie
 */
import Vue from 'vue'

export default function install() {
  Vue.directive('loadmore', {
    bind(el, binding) {
      // 获取element-ui定义好的scroll盒子
      let SELECTWRAP_DOM
      if (el.querySelector) {
        SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
      } else {
        SELECTWRAP_DOM = el.getElementsByClassName('el-select-dropdown__wrap')[0]
      }
      SELECTWRAP_DOM.addEventListener('scroll', function() {
        const CONDITION = this.scrollHeight - this.scrollTop <= this.clientHeight + 10
        if (CONDITION) {
          binding.value()
        }
      })
    }
  })
}

