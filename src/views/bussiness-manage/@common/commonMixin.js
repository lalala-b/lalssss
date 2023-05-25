export default {
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
      this.getList(null, false)
    }
  }
}
