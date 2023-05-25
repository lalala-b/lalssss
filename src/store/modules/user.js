/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-18 16:35:09
 * @LastEditTime: 2020-11-13 11:35:00
 * @LastEditors: Linjie
 */
import Cookies from 'js-cookie'

// import { commonLogin } from '@zz-system/zzkfpermission'

import { commonLogin } from '@/permission'
// import { commonLogin } from '@/permission/indexOld'
import Cache from '@/utils/cache'

const AUTH_CACHE = new Cache({
  'prefix': 'AUTH'
})

const LOGIN_STATUS_KEY = 'OCTOPUS_LOGIN_STATUS'

const state = {
  userInfo: AUTH_CACHE.get('userInfo') || {},
  isLogin: !!Cookies.get(LOGIN_STATUS_KEY),
  config: [],
  clearMicroapp: false
}

const mutations = {
  'SET_STATUS': (state, status) => {
    Cookies.set(LOGIN_STATUS_KEY, true)
    sessionStorage.setItem(LOGIN_STATUS_KEY, true)
    state.isLogin = status
  },
  'SET_MICROAPP': (state, status) => {
    state.clearMicroapp = status
  },
  'SET_USERINFO': (state, userInfo) => {
    AUTH_CACHE.set('userInfo', userInfo)
    state.userInfo = userInfo
  },
  'SET_USERINFO_PASSWORD_LIMIT_FLAG': (state, passwordLimitFlag) => {
    state.userInfo.passwordLimitFlag = passwordLimitFlag
    AUTH_CACHE.set('userInfo', state.userInfo)
  },
  'REMOVE_USERINFO': (state) => {
    AUTH_CACHE.clean()
    localStorage.removeItem('hasClickRecommentdMore')
    state.userInfo = {}
    state.isLogin = false
  },
  'SET_CONFIG': (state, configData) => {
    state.config = configData
  }
}

const actions = {
  async 'setUserInfo'({ commit, dispatch }, data = {}) {
    commit('SET_USERINFO', data)
    commit('SET_STATUS', true)
  },
  async 'login'({ commit, dispatch }, data) {
    try {
      const { userInfo = {}, permission = {}, config = [] } = await commonLogin(data)
      if (config) {
        commit('SET_CONFIG', [...config])
      } else {
        commit('SET_CONFIG', [])
      }

      if (userInfo) {
        commit('SET_USERINFO', { ...userInfo, ...permission })
        commit('SET_STATUS', true)
        // 设置菜单权限
        return dispatch('permission/generateRoutes', {}, { root: true })
      } else {
        commit('SET_STATUS', false)
        return Promise.reject()
      }
    } catch (e) {
      commit('SET_STATUS', false)
      return Promise.reject(e)
    }
  },
  async 'loginout'({ commit }) {
    commit('REMOVE_USERINFO')
    Cookies.remove('sso_uid', { domain: '.zhuanspirit.com' })
    Cookies.remove('sso_uid')
    Cookies.remove('uid')
    Cookies.remove('external_user')
    localStorage.removeItem('recommendLimit')
    localStorage.removeItem('deskType')
    localStorage.removeItem('menu-type')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
