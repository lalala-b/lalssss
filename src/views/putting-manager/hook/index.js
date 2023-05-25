import { computed } from '@vue/composition-api'
import store from '@/store'

export const useStore = function() {
  const brandNameList = computed(() => store.state.putting.brandNameList)
  const chargingModeList = computed(() => store.state.putting.chargingModeList)
  const userInfo = computed(() => store.state.user.userInfo)

  const setBrandNameList = function(data) {
    store.commit('putting/SET_BRANDNAME_LIST', data)
  }

  const setChargingModeList = function(data) {
    store.commit('putting/SET_CHARGING_MODE_LIST', data)
  }

  return {
    brandNameList,
    chargingModeList,
    setBrandNameList: setBrandNameList,
    setChargingModeList,
    userInfo
  }
}
