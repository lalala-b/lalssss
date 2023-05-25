/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-08 20:14:01
 * @LastEditTime: 2020-11-13 11:34:49
 * @LastEditors: Linjie
 */
import { routerFilter, routerMaps } from '@/permission'
// import { routerFilter } from '@/permission/indexOld'
// import { routerMaps } from '@/router/routerMap'
import { Message } from 'element-ui'
import router, { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: []
}

const mutations = {
  'SET_ROUTES': (state, routes) => {
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  async 'generateRoutes'({ commit, dispatch }) {
    const options = {
      uniqueKey: 'name',
      ignoreList: ['404'],
      ignoreEmpty: true
    }
    const type = localStorage.getItem('menu-type')
    const authMenu = +type ? routerFilter(asyncRoutes, options) : routerFilter(routerMaps, options)
    authMenu.push({
      path: '*',
      name: '404',
      redirect: '/404',
      meta: {
        hidden: true
      }
    })
    console.info('----------------------authMenu', authMenu)
    if (authMenu.length === 0) {
      Message({
        type: 'error',
        message: '无权限',
        onClose: async() => {
          await dispatch('user/loginout', {}, { root: true })
          location.reload()
        }
      })
      return Promise.reject()
    }
    commit('SET_ROUTES', authMenu)
    router.addRoutes(authMenu)
    return Promise.resolve()
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
