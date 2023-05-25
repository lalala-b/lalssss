const state = {
  brandNameList: [], // 品牌标签
  chargingModeList: [] // 业务标签
}

const mutations = {
  'SET_BRANDNAME_LIST': (state, brandNameList) => {
    state.brandNameList = brandNameList
  },
  'SET_CHARGING_MODE_LIST': (state, chargingModeList) => {
    state.chargingModeList = chargingModeList
  }
}

const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
