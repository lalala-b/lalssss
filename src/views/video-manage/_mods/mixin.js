import {
  copy,
  isUndefined,
  isFunction,
  extend,
  isArray
} from '@/components/common'
import tableMixin from '@/mixins/table'
export default {
  mixins: [tableMixin],
  data() {
    return {
      nowPage: 1,
      total: 0,
      loading: false,
      tableData: [],
      userFields: []
    }
  },
  methods: {
  /** 处理账号输入框改变时的逻辑
     *  不选平台选择传belong_name
        选了平台有account_id的选项传account_id
        选了平台没account_id的选项传account_name
    * @param {current}: 当前输入框的值
    * @param {options}: 当前的账号所有选项
    */
    handleAccountChange(current, options) {
      const searchData = this.searchData
      if (searchData.plat_id) {
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
          searchData.account_name = current
          // 不是正常数据不记录 account_id
          searchData.account_id = ''
        } else {
          searchData.account_id = current
          searchData.account_name = ''
        }
      } else {
        for (const dat of options) {
          if (dat.val === current) {
            searchData.belong_name = dat.text
            searchData.account_id = ''
            searchData.account_name = ''
            break
          }
        }
      }
    },
    // 生成请求参数
    buildQuery(page_num) {
      var query = copy(this.searchData)
      if (page_num || isUndefined(query.page_num)) {
        query.page_num = page_num || this.nowPage
      }

      if (query.timerange) {
        query.start = query.timerange[0] || ''
        query.end = query.timerange[1] || ''
        delete query.timerange
      }

      if (query.note && isArray(query.note)) {
        query.note = query.note.join(',')
      }

      if (isFunction(this.extQuery)) {
        query = extend(query, this.extQuery())
      }

      return query
    },
    /**
         * 加载表格数据
         * @param  {Number}  page_num  加载的页面
         */
    getList(page_num = 1) {
      if (this.$req) {
        try {
          this.$req.abort()
        } catch (e) { console.error(e) }
      }
      this.loading = true
      var query = this.buildQuery(page_num)
      this.$req = this.getListData(query)
        .then(
          (re) => {
            this.loading = false
            if (re) {
              if (Array.isArray(re.data)) {
                // 旧数据格式
                this.tableData = re.data
                let totalKey = 'total'
                // NOTE:
                // 返回的字段不一致，不想因为一个字段复制一整个函数
                // 所以写个 map 映射一下
                if (this.dataMap && this.dataMap[totalKey]) {
                  totalKey = this.dataMap[totalKey]
                }
                this.total = re[totalKey]
              } else {
                // 新数据格式
                this.tableData = re.data.list
                let totalKey = 'total'
                // NOTE:
                // 返回的字段不一致，不想因为一个字段复制一整个函数
                // 所以写个 map 映射一下
                if (this.dataMap && this.dataMap[totalKey]) {
                  totalKey = this.dataMap[totalKey]
                }
                this.total = re.data[totalKey]
              }
            }
          },
          (err) => {
            this.loading = false
          }
        )
        .catch((err) => {
          this.loading = false
          console.error(err)
        })
    },
    // 搜索
    onSearch() {
      this.nowPage = 1
      this.getList(1)
    },
    /**
         * 获取自定义字段
         */
    getUserFields() {
      // this.$request({
      //     url: "/getMonitorUserFields",
      //     query: {
      //     },
      // })
      //     .then(
      //         (re) => {
      //             if (re) {
      //                 this.userFields = re;
      //             }
      //         }
      //     )
      //     .catch((err) => {
      //         console.error(err);
      //     });
    },
    /**
         * 搜索内容变化响应函数
         * @param  {Mix}     val    新的值
         * @param  {Object}  item   组件配置
         */
    onSearchChange(val, item, type, index, model) {
      switch (item.key) {
          case 'd_id':
            this.searchData.d_id = val
            break

          case 'timerange':
            if (!val || !val.length) {
              this.searchData.start = ''
              this.searchData.end = ''
            } else {
              this.searchData.start = val[0]
              this.searchData.end = val[1]
            }
            break
          case 'account_id':
            // 是否在现有数据中找到当前的数据
            let nofound = true
            for (const dat of item.data) {
              if (dat.val === val) {
                this.searchData.account = dat
                nofound = false
                break
              }
            }
            if (nofound) {
              // NOTE:
              // 没找到数据则说明是用户自己输入的文本
              // 手动生成一个对象记录输入的内容供生成查询数据的时候使用
              this.searchData.account = {
                text: val
              }
              // 不是正常数据不记录 account_id
              this.searchData.account_id = ''
            } else {
              this.searchData.account_id = val
            }
            break
          case 'plat_id':
            this.types.accounts = []
            this.searchData.account_id = ''
            this.searchData.plat_id = val
            this.getAccountData(null, false)
            break

          case 'note':
            this.searchData.note = val
            break
          default:
            this.searchData[item.key] = val
      }
    },
    getTags() {

    },
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
      this.determined = determined
      this.nowPage = 1
      this.getListData(
        this.buildReqData(extend({}, this.searchData), 1)
      ).then((re) => {
        if (re) {
          this.tableData = re.data
        }
      })
    },
    getSelectAccount(user_id, onlyAccount) {
      // return this.$request({
      //     url: "/getV1SelectAccount",
      //     method: "post",
      //     data: {
      //         view_id: 4,
      //         account_type: 2,
      //         plat_id: this.searchData.plat_id,
      //     },
      // })
      //     .then(
      //         (re) => {
      //             if (re) {
      //                 if (!onlyAccount) {
      //                     this.types.plats = toOptions(re.plat, {
      //                         valKey: "plat_id",
      //                         textKey: "plat_name",
      //                     });
      //                 }

      //                 this.types.accounts = toOptions(re.accounts, {
      //                     valKey: "account_id",
      //                     textKey: "account_name",
      //                 });
      //             }
      //         },
      //         (err) => {}
      //     )
      //     .catch((err) => {
      //         console.error(err);
      //     });
    },
    // 获取用户及类别数据
    getPlatAndUser() {

    }
  }
}
