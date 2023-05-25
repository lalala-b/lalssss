import { mapState } from 'vuex'
import tableMixin from '@/mixins/table'
import { copy, isUndefined, extend } from '@/components/common'
export default {
  'mixins': [tableMixin],
  data() {
    return {
      'nowPage': 1,
      'total': 0,
      'loading': false,
      'tableData': []
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

      if (query.timerange) {
        query.start = query.timerange[0]
        query.end = query.timerange[1]
        delete query.timerange
      }

      return query
    },
    // 搜索
    onSearch() {
      this.nowPage = 1
      this.getList(1)
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
          re => {
            this.loading = false
            if (re) {
              this.tableData = re.data
              this.total = re.total
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
    },
    /**
         * 跳转到单个用户详情
         */
    goDetail(id, account_name) {
      document.querySelector('.G-layoutMain').scrollTo(0, 0)
      this.$emit('bus', 'MARKETING:save', 'account_name', account_name, () => {
        this.$go(`/marketing?id=${id}`)
      })
    },
    // 获取所有过滤标签
    getAllTags() {
      return this.$request({
        'url': '/getAllMarketTags'
      })
        .then(
          re => {
            if (re) {
              this.searchTypes.forEach(type => {
                const typeData = re[type.key]
                if (!typeData) {
                  return
                }
                typeData.forEach(dat => {
                  dat._selected = false
                })

                if (type.custom) {
                  // 允许自定义
                  const custom = {
                    '_selected': false,
                    '_isCustom': true,
                    '_start': '',
                    '_end': '',
                    '_status': false
                  }
                  custom[type.valKey] = 99
                  custom[type.nameKey] = '自定义'
                  typeData.push(custom)
                }

                if (type.all !== false) {
                  // 手动塞个全部
                  const all = {
                    '_selected': true
                  }
                  all[type.valKey] = ''
                  all[type.nameKey] = '全部'
                  this.selectedSearch[type.key] = all
                  typeData.unshift(all)
                }
              })
              this.datas.tags = extend({}, this.datas.tags, re)
            }
          }
          , err => {}
        )
        .catch(err => {
          console.error(err)
        })
    },
    // 切换自定义
    onCustom(type, item) {
      item._status = true
    },
    // 自定义数值
    onCustomChange(item, type) {
      if (item._start && item._end) {
        this.$nextTick(() => {
          this.searchData[(type.qKey || type.valKey)] = `${item._start * 10000}-${item._end * 10000}`
          this.nowPage = 1
          this.getList(1)
        }, 50)
      }
    },
    // 点击了分类标签
    onTag(item, type) {
      if (item._selected) {
        return
      }
      var selected = this.selectedSearch[type.key]
      if (selected) {
        if (Array.isArray(selected)) {
          selected[0]._selected = false
        } else {
          selected._selected = false
        }
      }
      item._selected = true
      this.selectedSearch[type.key] = item
      if (type.qKey === '*_time') {
        this.searchData.start_time = item.type_code[0]
        this.searchData.end_time = item.type_code[1]
      } else {
        this.searchData[(type.qKey || type.valKey)] = item[type.valKey]
      }
      this.nowPage = 1
      this.getList(1)
    }
  },
  'watch': {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.nowPage = nVal
        this.getList(nVal)
      }
    }
  }
}
