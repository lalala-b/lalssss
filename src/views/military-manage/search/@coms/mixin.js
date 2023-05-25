/*
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-10 17:57:49
 * @LastEditTime: 2020-11-01 22:29:31
 * @LastEditors: Linjie
 */
import VSearch from '@/components/Search'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'
export default {
  components: {
    VSearch
  },
  data() {
    return {
      modelData: []
    }
  },
  created() {
    this.buildFormConf()
    this.getB2CPhoneModel()
  },
  methods: {
    /**
         *
         * @param {视频类型初始参数} is_online 1: 军功标记/审核; 0:军功标记录入/审核录入
         */
    getVideoType(is_online = 0, type_id = '') {
      // return this.$request({
      //   url: '/getVideoType',
      //   query: {
      //     is_online,
      //     type_id
      //   }
      // }).then((res) => {
      //   return res
      // })
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
         * 额外处理一次表格数据
         * @param {Array} data 表格数据
         */
    processTableData(data) {},
    /**
         * 导出
         */
    exportData(reqData) {
      // var str = []
      // var data = reqData || this.searchData
      // Object.keys(data).forEach(function(key) {
      //   str.push(`${key}=${encodeURIComponent(data[key])}`)
      // })
      // str = str.join('&')
      // str = `${this.$request.getApi('/exportMData')}?${str}`
      // var win = window.open(str)
      // if (!win) {
      //   this.$tip('请允许在本页打开新窗口')
      // }
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
