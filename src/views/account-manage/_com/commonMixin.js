export default {
  methods: {
  /** 处理账号输入框改变时的逻辑
         *  不选平台选择传belong_name
            选了平台有accountId的选项传accountId
            选了平台没accountId的选项传accountName
        * @param {current}: 当前输入框的值
        * @param {options}: 当前的账号所有选项
        */
    handleAccountChange(current, options) {
      const searchData = this.searchData
      if (searchData.platId) {
        let notfound = true
        for (const dat of options) {
          if (dat.val === current) {
            notfound = false
            break
          }
        }
        if (notfound) {
          // NOTE:
          // 没找到数据则说明是用户自己输入的文本
          // 手动生成一个对象记录输入的内容供生成查询数据的时候使用
          searchData.accountName = current
          // 不是正常数据不记录 accountId
          searchData.accountId = ''
        } else {
          searchData.accountId = current
          searchData.accountName = ''
        }
      } else {
        for (const dat of options) {
          if (dat.val === current) {
            searchData.belong_name = dat.text
            searchData.accountId = ''
            searchData.accountName = ''
            break
          }
        }
      }
    }
  }
}
