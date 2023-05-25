/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-30 14:05:57
 * @LastEditTime: 2020-12-30 15:28:11
 * @LastEditors: Linjie
 */
const state = {
  pending: []
}

const mutations = {
  ADD_PENDING: (state, pending) => {
    // 添加等待请求
    state.pending.push(pending)
  },
  REMOVE_ALL_PENDING: (state) => {
    // 移除全部在等待的请求
    state.pending = []
  },
  REMOVE_PENDING: (state, i) => {
    // 移除单个在等待的请求
    state.pending.splice(i, 1)
  }
}

const actions = {
  removeAllPending: ({ commit }) => {
    for (const i in state.pending) {
      state.pending[i].f('取消')
    }
    commit('REMOVE_ALL_PENDING')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
