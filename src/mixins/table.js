/*
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-19 13:44:00
 * @LastEditTime: 2020-11-12 15:49:58
 * @LastEditors: Linjie
 */
export default {
  data() {
    return {
      loading: false,
      total: 0,
      nowPage: 1,
      tableData: []
    }
  },
  methods: {
  /**
       * 排序
       * @param  {String}  prop   列名
       * @param  {String}  order  排序方式
       */
    doSort({ prop, order }) {
      var determined
      switch (order) {
          case 'ascending':
            determined = `${prop}`
            break

          case 'descending':
            determined = `-${prop}`
            break

          case null:
            determined = ''
            break
      }
      this.searchData.determined = determined
      this.searchData.pageNum = 1
      this.getList(null, false)
    }
  }
}
