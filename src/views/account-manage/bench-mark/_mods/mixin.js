import {
  copy,
  isUndefined,
  isFunction,
  extend,
  toOptions,
  isArray
} from '@/components/common'
import tableMixin from '@/mixins/table'
import { $getMonitorUserFields, $getMarkPlatAccounts, $getV1PlatAndUser } from '@/api/account-manage'

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
    // 生成请求参数
    buildQuery(pageNum) {
      var query = copy(this.searchData)
      if (pageNum || isUndefined(query.pageNum)) {
        query.pageNum = pageNum
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
     * @param  {Number}  pageNum  加载的页面
     */
    getList(pageNum) {
      if (!pageNum) {
        pageNum = 1
      }
      this.loading = true
      const query = this.buildQuery(pageNum)
      this.getListData(query).then((re) => {
        // 新数据格式
        if (re.code === 1) {
          this.tableData = re.data
          this.total = re.total
        } else {
          this.$message.error(re.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
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
    async getUserFields() {
      const re = await $getMonitorUserFields()
      if (re.code === 1) {
        this.userFields = re
      }
    },
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

          case 'user_id':
            this.getSelectAccount()
            if (isFunction(this.getTags)) {
              this.getTags()
            }
            break

          case 'timerange':
            if (!isUndefined(this.nowType)) {
              this.nowType = ''
            }
            break

          case 'platId':
            this.types.accounts = []
            this.searchData.accountId = ''
            this.searchData.platId = val
            this.getSelectAccount(true)
            break
          case 'accountId':
            this.handleAccountChange(val, item.data)
            break
          case 'note':
            this.searchData.note = val
            break
      }
    },
    getTags() {
      // return $getVideoNotes({
      //     methodId: this.methodId || "",
      // })
      // .then(re => {
      //     if (re.code === 1) {
      //         re = re.data
      //         let notes = this.types.notes;
      //         re.forEach((text) => {
      //             notes.push({
      //                 text,
      //                 val: text,
      //             });
      //         });
      //     }
      // })
    },
    getSelectAccount(onlyAccount = false, methodId = 1) {
      return $getMarkPlatAccounts({
        methodId,
        accountType: 2
      }).then(re => {
        if (re.code === 1) {
          re = re.data
          if (!onlyAccount) {
            this.types.plats = re.plats
          }

          this.types.accounts = re.accounts
          this.types.tagValues = re.tagValues
        }
      })
    },
    // 获取用户及类别数据
    getPlatAndUser() {
      return $getV1PlatAndUser()
        .then(re => {
          if (re.code === 1) {
            re = re.data
            this.types.users = toOptions(re.user, {
              valKey: 'role_id',
              textKey: 'role_name'
            })
          }
        })
    }
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.nowPage = nVal
        this.getList(nVal)
      }
    }
  }
}
