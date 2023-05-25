import { $getMenuRoles, $getDataScopeByMenuId } from '@/api/backend-manage'

const state = {
  editData: {},
  roleTableData: [],
  roleTotal: 0,
  rolePageNum: 1,
  dataTableData: [],
  dataTotal: 0,
  dataPageNum: 1,
  dataPageSize: 20
}

const mutations = {
  SET_ROLE_INFO: (state, { data, total, pageNum }) => {
    state.roleTableData = data
    state.roleTotal = total
    state.rolePageNum = pageNum
  },
  SET_DATA_INTO: (state, { data, total, pageNum, size }) => {
    state.dataTableData = data
    state.dataTotal = total
    state.dataPageNum = pageNum
    state.dataPageSize = size
  },
  SET_EDIT_DATA: (state, data) => {
    state.editData = data
  },
  CLEAR: (state) => {
    state.rolePageNum = 1
    state.roleTableData = []
    state.roleTotal = 0
    state.dataTableData = []
    state.dataTotal = 0
    state.editData = {}
  }
}

const actions = {
  // 获取角色列表
  async getRoleList({ commit }, otherPar = 1) {
    try {
      const params = {
        menuId: state.editData.id
      }
      const typePar = typeof otherPar
      if (typePar === 'number') {
        params.pageNum = otherPar
      } else if (typePar === 'object') {
        Object.assign(params, otherPar)
      }
      const res = await $getMenuRoles(params)
      if (res.code === 1) {
        commit('SET_ROLE_INFO', { data: res.data, total: res.total, pageNum: params.pageNum })
      }
    } catch (err) {
      console.log(err)
    }
  },
  // 获取数据域数据
  async getDictDataList({ commit }, otherPar = 1) {
    try {
      const params = {
        menuId: state.editData.id,
        size: 20
      }
      const typePar = typeof otherPar
      if (typePar === 'number') {
        params.pageNum = otherPar
      } else if (typePar === 'object') {
        Object.assign(params, otherPar)
      }
      const res = await $getDataScopeByMenuId(params)
      if (res.code === 1) {
        commit('SET_DATA_INTO', { data: res.data, total: res.total, pageNum: params.pageNum, size: 20 })
      }
    } catch (err) { console.error(err) }
  },
  // 设置菜单id
  setEditData({ commit, dispatch }, editData = {}) {
    commit('CLEAR')
    commit('SET_EDIT_DATA', editData)
    dispatch('getRoleList', 1)
    dispatch('getDictDataList', {
      pageNum: 1,
      datascope: editData.datascope
    })
  },
  removeEditData({ commit }) {
    commit('CLEAR')
  },
  // 更新数据
  updateData({ dispatch }) {
    dispatch('getRoleList', 1)
    dispatch('getDictDataList', 1)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
