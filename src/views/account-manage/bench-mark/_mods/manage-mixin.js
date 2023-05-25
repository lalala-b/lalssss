import Del from './dialogs/del'
import Auth from './dialogs/auth'
import Tags from './dialogs/tags'
import qs from 'qs'
export default {
  data() {
    return {
      dialogData: {
        del: {},
        tags: {}
      },
      dialogStatus: {
        auth: false,
        del: false,
        tags: false
      },
      types: {
        users: [],
        plats: [],
        accounts: [],
        notes: [],
        titles: []
      }
    }
  },
  components: {
    vDel: Del,
    vAuth: Auth,
    vTags: Tags
  },
  computed: {
    searchStr() {
      // 查询字段字符串
      const str = []
      for (const key in this.searchData) {
        str.push(`${key}=${this.searchData[key]}`)
      }
      return `?${str.join('&')}`
    }
  },
  methods: {
    handleExport() {
      // download(`article_${dateFormat('YYYYmmddHHMMSS', new Date())}.xls`, this.searchData, '/api/account/monitor/benchmarking/export')
      window.location.href = `/api/account/monitor/benchmarking/export?${qs.stringify(this.searchData)}&componentId=${this.$componentId}`
    },
    // // 获取表格数据
    // getListData(query){
    //     return this.$request({
    //         "url": "/getBenchmarkAccounts"
    //         ,query
    //         ,"raw": true
    //     })
    //     .then(
    //         re => {
    //             if (re && re.data) {
    //                 // 预处理标签
    //                 re.data.forEach(item => {
    //                     if (item.note) {
    //                         item.note = item.note.split(",");
    //                     }
    //                 });
    //             }
    //             return  re;
    //         }
    //         ,err => {
    //             return  err;
    //         }
    //     );
    // }
    // 激活修改标签
    onModifyTags(row) {
      this.dialogData.tags = row
      this.dialogStatus.tags = true
    },
    // 删除账号
    delAccount(row) {
      this.dialogData.del = row
      this.dialogStatus.del = true
    },
    // 显示添加对标账号浮层
    onAddAccount() {
      this.dialogStatus.auth = true
    },
    /**
         * 跳转到单个用户详情
         */
    goDetail(id, accountName) {
      document.querySelector('.G-layoutMain').scrollTo(0, 0)
      this.$emit('bus', 'BENCHMARK:savetab')
      this.$emit('bus', 'MARKETING:save', 'redirect', '/benchmark')
      this.$emit(
        'bus',
        'MARKETING:save',
        'accountName',
        accountName,
        () => {
          this.$go(`/marketing?id=${id}`)
        }
      )
    },
    // 浮层确认
    onPopDone(status, subject) {
      if (status) {
        this.getList(this.nowPage)
      }
    },
    // 删除确认
    onDelConfirm(status, data) {
      if (status) {
        this.tableData.splice(this.tableData.indexOf(data), 1)
      }
    }
  }
}
