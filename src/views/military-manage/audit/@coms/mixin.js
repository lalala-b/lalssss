import VSearch from '@/components/Search'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'

export default {
  components: {
    VSearch
  },
  data() {
    return {
      summaryItems: [
        {
          key: 'all_score',
          text: '总军功'
        },
        {
          key: 'total',
          text: '播放量（军功）'
        },
        {
          key: 'title',
          text: '标题数（军功）'
        }
      ],
      summary: {
        all_score: 0,
        total: 0,
        title: 0
      },
      modelData: []
    }
  },
  created() {
    this.buildFormConf()
    this.getB2CPhoneModel()
  },
  methods: {
    getListData(data, url = '/getMilitaryData', method = 'post') {
      // if (this.loading) {
      //   return
      // }
      // this.loading = true
      // var conf = {
      //   url,
      //   method,
      //   raw: true
      // }
      // data.method_id = 1
      // if (method === 'post') {
      //   conf.data = data
      // } else {
      //   conf.query = data
      // }
      // return this.$request(conf)
      //   .then(
      //     (re) => {
      //       this.loading = false
      //       return re
      //     },
      //     (err) => {
      //       this.loading = false
      //       console.error(err)
      //     }
      //   )
      //   .catch((err) => {
      //     this.loading = false
      //     console.error(err)
      //   })
    },
    /**
         *
         * @param {视频类型初始参数} is_online 1: 军功标记/审核; 0:军功标记录入/审核录入
         */
    getVideoType(is_online = 0, type_id = '') {
      // return this.$request({
      //   url: '/getVideoType',
      //   raw: true,
      //   query: {
      //     is_online,
      //     type_id
      //   }
      // }).then((res) => {})
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
