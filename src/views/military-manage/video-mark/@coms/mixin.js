/*
 * @Author: LuoxdmilitaryLockStatus
 * @Description:
 * @Date: 2020-09-09 09:45:40
 * @LastEditTime: 2020-12-26 18:06:33
 * @LastEditors: Linjie
 */
import VSearch from '@/components/Search'
import { processListDataAndReturn } from '@/components/common'
import { $getVideoType } from '@/api/video-mark'
import { $getExamineSignStatus } from '@/api/military-manage'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'
export default {
  components: {
    VSearch
  },
  data() {
    return {
      militaryLockStatus: false,
      modelData: []
    }
  },
  created() {
    this.buildFormConf()
    this.getMilitaryLockStatus()
    this.getB2CPhoneModel()
  },
  methods: {
    getMilitaryLockStatus() {
      $getExamineSignStatus().then(res => {
        if (res.code === 1) {
          this.militaryLockStatus = res.data
        }
      })
    },
    /**
     *
     * @param {视频类型初始参数} isOnline 1: 军功标记/审核; 0:军功标记录入/审核录入
     */
    getVideoType(isOnline = 0, type_id = '') {
      return $getVideoType({
        isOnline,
        type_id
      }).then((res) => {
        if (res.code === 1) {
          return processListDataAndReturn(res, null, {
            valKey: 'tagName',
            textKey: 'tagName',
            keepOther: true
          })
        }
      })
    },
    searchDateChange(arr) {
      if (!arr) {
        this.searchData.product_time_start = ''
        this.searchData.product_time_end = ''
        return
      }
      this.searchData.product_time_start = arr[0]
      this.searchData.product_time_end = arr[1]
    },
    /**
       * 导出
       */
    exportData(reqData) {
      // var data = reqData || this.searchData
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        this.modelData = data || []
        this.normalFormItemMap.b2cPhoneModelIdStrs.data = data || []
      }
    },
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    }
  }
}
