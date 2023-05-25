/*
 * @Author: Luoxd
 * @Description: init
 * @Date: 2019-07-02 11:41:33
 * @LastEditTime: 2020-09-17 18:33:08
 * @LastEditors: Luoxd
 */
import Vue from 'vue'
import flexRow from './flex-row/flex-row.vue'
import flexRows from './flex-row/flex-rows.vue'
import Wrap from './Wrap'
import LNumber from './LNumber'

export default function install () {
  Vue.component('flex-row', flexRow)
  Vue.component('flex-rows', flexRows)
  Vue.component('Wrap', Wrap)
  Vue.component('l-number', LNumber)
}
