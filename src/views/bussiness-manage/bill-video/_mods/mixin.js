import { mapState } from 'vuex'
import tableMixin from '@/mixins/table'
import { copy, isUndefined } from '@/components/common'

export default {
  'mixins': [tableMixin],
  data() {
    return {
    }
  },
  'computed': {
    ...mapState({
      user(state) {
        return state.auth.user
      }
    })
  },
  'methods': {
    // 生成请求参数
    buildQuery(page_num) {
      var query = copy(this.searchData)
      if (isUndefined(query.page_num)) {
        query.page_num = page_num || this.nowPage
      }

      if (page_num && query.page_num !== page_num) {
        query.page_num = page_num
      }

      if (query.timerange) {
        query.start = query.timerange[0]
        query.end = query.timerange[1]
        delete query.timerange
      }

      const { fansMin, fansMax } = query
      if (fansMin || fansMax) {
        query.fans = `${fansMin || 0}-${fansMax || '1000000000'}`
      }
      delete query.fansMin
      delete query.fansMax

      return query
    },
    /**
         * 加载表格数据
         * @param  {Number}  page_num  加载的页面
         */
    getList(page_num = 1, qData) {
      if (this.$req) {
        try {
          this.$req.abort()
        } catch (e) { console.error(e) }
      }
      this.loading = true
      var query = qData || this.buildQuery(page_num)
      this.$req = this.getListData(query)
        .then(
          re => {
            this.loading = false
            if (re) {
              if (Array.isArray(re.data)) { // 旧数据格式
                this.tableData = re.data
                this.total = re.total
              } else { // 新
                this.tableData = re.data.list
                this.total = re.data.total
              }
            }
          }
          , err => {
            this.loading = false
          }
        )
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    }
  },
  'watch': {
    // nowPage(nVal, oVal) {
    //     if (nVal !== oVal) {
    //         this.nowPage = nVal;
    //         this.getList(nVal);
    //     }
    // }
  }
}
