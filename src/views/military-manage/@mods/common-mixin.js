import { mapState } from 'vuex'
import {
  isArray,
  isString,
  isUndefined,
  checkFilterRule,
  processListDataAndReturn
} from '@/components/common'

// 是否是多个平台的组合类型判断正则
// const MULTIPLE_PLAT_ID_REG_EXP = /\,/

// 权限 junType 类型
const PRO_TYPES_REG_EXP = /[A-Z]$/

/**
 * 判断传入的 type 在不在指定范围
 * @param  {Minx}    type 待判断类型
 * @return {Boolean}      判断结果
 */
function checkJunpType(type) {
  return PRO_TYPES_REG_EXP.test(String(type))
}

export default {
  data() {
    return {
      determined: '-addTime',
      tableData: [],
      nowPage: 1,
      loading: false,
      total: 0
    }
  },
  computed: {
    ...mapState({
      user(state) {
        return state.auth.user
      }
    })
  },
  methods: {
    toOptions(options, keyObj) {
      if (!options.length) return []
      return options.map((item) => {
        return {
          text: item[keyObj.textKey],
          val: item[keyObj.valKey]
        }
      })
    },
    // 生成账号选项
    processAccounts(nVal) {
      if (nVal) {
        this.optionsData.accounts = this.optionsData.allAccounts
          .filter((item) => item.platId === nVal)
          .map((item) => {
            return {
              val: item.accountId,
              text: item.accountName,
              belongName: item.belongName,
              accountName: item.accountName
            }
          })
      } else {
        this.optionsData.accounts = this.optionsData.allAccounts.map((item) => {
          return {
            val: item.accountId,
            text: item.belongName,
            belongName: item.belongName,
            accountName: item.accountName
          }
        })
      }
    },
    /**
     * 检查操作列权限
     * @param  {Object}  row  行数据
     */
    checkRowAcitonPermission(row) {
      if (row) {
        // NOTE:
        // row.lockStatus 0 为可编辑
        // 如果是可编辑状态，则需要再额外判断审核状态
        // 审核状态不是通过或无需审核的时候才可编辑
        const lockStatus = !row.lockStatus

        /*
        待审核：可以修改 hd_status=1：                  视频类型，人员可以修改
        通过：不修改 hd_status=2 ：                    视频类型，人员显示文本
        不通过：不修改 hd_status=3 ：                  视频类型，人员显示文本
        无需审核：计算后才能修改视频类型 hd_status=4 ：   视频类型可以选择，人员显示文本
        */
        if (lockStatus) {
          return row.hd_status === 1
        } else {
          return false
        }
      } else {
        // 没传的时候默认通过
        return true
      }
    },
    /**
     * 检查标记视频类型操作列权限
     * @param  {Object}  row  行数据
     */
    checkMarkPermission(row) {
      /*
        待审核：可以修改 hd_status=1：                  视频类型，人员可以修改
        通过：不修改 hd_status=2 ：                    视频类型，人员显示文本
        不通过：不修改 hd_status=3 ：                  视频类型，人员显示文本
        无需审核：计算后才能修改视频类型 hd_status=4 ：   视频类型可以选择，人员显示文本
        */
      return (
        (this.user.action_id
          ? this.user.action_id.indexOf(3) === -1
          : true) &&
            (row.hd_status === 1 || row.hd_status === 4)
      )
    },
    // 检查是否有修改视频类型的权限
    checkMarkVideoPermission() {
      return checkFilterRule(
        [
          { key: 'mrid', val: 1 },
          { key: 'action_id', val: 3, compute: '!~' }
        ],
        this.user
      )
    },
    /**
     * 基本操作权限
     * @param   {Boolean}  adv  是否是判断高级权限
     * @param   {Object}   row  要判断的单条数据
     * @return  {Boolean}       判断结果
     */
    checkBasePermission(adv, row) {
      var user = this.user
      return (
        (user.mrid === 1 && (row ? !row.lockStatus : true)) ||
            (isArray(user.action_id) &&
                this.checkRowAcitonPermission(row) &&
                // 拥有审核权限的人有 3 这个 action
                // 无审核权限但有其他操作权限的人
                (adv ? user.action_id.indexOf(3) !== -1 : user.action_id.indexOf(3) === -1))
      )
    },
    /**
     * 检查操作权限
     * @param  {Object}  item   当前数据
     * @return {Boolean}        判断结果
     */
    checkVerifyPermission(item) {
      // 没传 item 的话就是在表格外调用，这个时候不执行单条数据的检查逻辑
      if (
        item
          ? !item.lockStatus &&
                  item.editId !== 0 &&
                  item.cutId !== 0 &&
                  checkJunpType(
                    isString(item.junType)
                      ? item.junType
                      : item.junType.text
                  )
          : true
      ) {
        return true
      }
      return false
    },
    // 检查停止标记权限
    checkLockPermission() {
      var user = this.user
      if (!user) {
        return false
      }
      return (
        user.mrid === 1 ||
            (user.action_id && user.action_id.indexOf(18) !== -1)
      )
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

      this.nowPage = 1
      this.searchData.determined = determined
      this.onSubmit({})
    },
    // 检查视频类型数据
    checkVideoItems(status) {
      // if (
      //   status &&
      //       (!this.videoTypeItems || !this.videoTypeItems.length)
      // ) {
      //   this.$message.error('请选择平台')
      // }
    },
    processSearchDataChange(sData, fMap) {
      if (sData.platId) {
        if (fMap.junType) {
          fMap.junType.data = []
        }
        this.getHdListByPlat(sData.platId, sData.type_id, sData.d_id)
      } else {
        this.videoTypeItems = []
      }
    },
    /** 处理账号输入框改变时的逻辑
     *  不选平台选择传belongName
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
            searchData.belongName = dat.text
            searchData.accountId = ''
            searchData.accountName = ''
            break
          }
        }
        if (!searchData.belongName) {
          searchData.belongName = current
          searchData.accountId = ''
          searchData.accountName = ''
        }
      }
    },
    /**
     * 获取平台视频列表
     * @param  {Object}  data  请求参数
     * @return {Object}        promise 对象
     */
    getHdListByPlat(platId, type_id = '', d_id = '') {
      // return this.$request({
      //   url: '/getPlats',
      //   query: {
      //     platId,
      //     type_id,
      //     d_id,
      //     method_id: this.method_id || 1
      //   }
      // })
      //   .then((re) => {
      //     return processListDataAndReturn(re, null, {
      //       valKey: 'junType',
      //       textKey: 'junType',
      //       keepOther: true
      //     })
      //   })
      //   .then((re) => {
      //     if (re) {
      //       this.videoTypes = re
      //       this.videoTypeItems = re
      //       if (
      //         this.normalFormItemMap &&
      //                   this.normalFormItemMap.junType
      //       ) {
      //         this.normalFormItemMap.junType.data = re
      //       }
      //     }
      //     return re
      //   })
    },
    /**
     * 生成请求用的参数
     * @param  {Object}   search  搜索条件
     * @param  {Number}   page    页码
     * @return {Object}           请求参数
     */
    buildReqData(search, page, DATA_MODEL = {}) {
      var data = {}
      Object.keys(DATA_MODEL).forEach(function(key) {
        var valKey = DATA_MODEL[key] || key
        data[key] = search[valKey] !== undefined ? search[valKey] : ''
      })

      // 单独处理时间
      if (search.timerange) {
        const timerange = search.timerange
        data.startTime = timerange[0] || ''
        data.endTime = timerange[1] || ''
        if (data.startTime) {
          data.startTime += ' 00:00:00'
        }
        if (data.endTime) {
          data.endTime += ' 23:59:59'
        }
        delete search.timerange
      } else {
        data.startTime = ''
        data.endTime = ''
        search.timerange = ''
      }

      /** 账号的选项有三个字段
         * {
         *      belongName 平台统一账号
         *      accountName 账号名称
         *      accountId 账号id
         * }
         * 情况1：如果选了平台
         *      1.1：如果能找到选择的账号就拿accountId,找不到就要传accountName,并且需要清空其余两个字段的内容，不然接口会报错
         * 情况2：如果没选平台
         *      传belongName,把其余两个字段清空，不然接口会报错
         */
      if (search.platId) {
        if (search.accountName) {
          data.accountId = ''
          data.accountName = search.accountName
          search.accountId = ''
        }
        data.belongName = ''
        search.belongName = ''
      } else {
        if (search.belongName) {
          data.accountId = ''
          data.accountName = ''
          search.accountId = ''
          search.accountName = ''
        } else if (search.accountName) {
          data.accountName = search.accountName
        }
      }
      if (search._job) {
        const jobKeys = {
          editAndCutId: '',
          edit_id: 'edit',
          cut_id: 'cut'
        }
        const { editAndCutId } = search
        Object.keys(jobKeys).forEach((key) => {
          const typeVal = jobKeys[key]
          data[key] = typeVal === search._job ? editAndCutId || '' : ''
        })
        delete search._job
      }

      // 处理页码
      page = page || data.pageNum || 1
      data.pageNum = page

      if (!data.determined) {
        data.determined = this.determined
      }
      this.searchData = data
      return data
    },
    /**
     * 根据传入的 model 从 searchData 中获取数据
     * @param   {Object}  构造用的 model
     * @return  {Object}  生成的数据
     */
    buildBySearchData(model, method_id = '') {
      var data = {}
      Object.keys(model).forEach((key) => {
        data[key] =
                this.searchData[key] !== undefined
                  ? this.searchData[key]
                  : model[key] || ''
      })
      data.method_id = method_id || this.method_id || ''
      return data
    },
    /**
     * 重载表格
     * @param  {Boolean}  keep  是否保持页码
     * @return {Object}         Promise 对象
     */
    reload(keep, url, type, model) {
      return this.getListData(
        this.buildReqData(
          this.searchData,
          keep ? this.nowPage : 1,
          model
        ),
        url,
        type
      ).then((re) => {
        if (re) {
          if (!keep) {
            this.nowPage = 1
          }
          if (re.data && re.data.list) {
            this.tableData = re.data.list
            this.processTableData(re.data.list)
          } else {
            this.tableData = re.data
            this.processTableData(re.data)
          }
        }
      })
    },
    /**
     * 获取人员数据
     * @param   {Number}  d_id  用户 ID
     * @param   {Number}  f_id  角色 ID
     */
    getSoldiers(d_id, f_id) {
      d_id = d_id || this.searchData.d_id || ''
      f_id = f_id || this.searchData.f_id || ''

      // return this.$request({
      //   url: '/getMName',
      //   query: {
      //     d_id,
      //     f_id
      //   }
      // })
      //   .then((re) => {
      //     return processListDataAndReturn(re, null, {
      //       valKey: 'muid',
      //       textKey: 'nick_name'
      //     })
      //   })
      //   .then((re) => {
      //     if (re) {
      //       this.soldiers = re
      //       if (
      //         this.normalFormItemMap &&
      //                   this.normalFormItemMap.editAndCutId
      //       ) {
      //         this.normalFormItemMap.editAndCutId.data = re
      //       }
      //     }
      //   })
    },
    getMulitaryDeliveryList(data) {
      if (this.loading) {
        return
      }
      this.loading = true
      data.method_id = this.method_id || 1
      // return this.$request({
      //   url: '/getMulitaryDeliveryList',
      //   query: data
      // })
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
    // 获取投放视频的人员名称
    getDeliverySoldiers({ d_id = '', f_id = '' }) {
      d_id = d_id || this.searchData.d_id || ''
      f_id = f_id || this.searchData.f_id || ''
      return this.$request({
        url: '/getMName',
        query: {
          d_id,
          f_id
        }
      })
        .then((re) => {
          return processListDataAndReturn(re, null, {
            valKey: 'muid',
            textKey: 'nick_name'
          })
        })
        .then((re) => {
          if (re) {
            this.soldiers = re
            if (
              this.normalFormItemMap &&
                        this.normalFormItemMap.edit_id
            ) {
              this.normalFormItemMap.edit_id.data = re
            }
          }
        })
    },
    /**
     * 导出
     */
    exportDeliveryData(reqData) {
      // var str = []
      // var data = reqData || this.searchData
      // Object.keys(data).forEach(function(key) {
      //   str.push(`${key}=${encodeURIComponent(data[key])}`)
      // })
      // str = str.join('&')
      // str = `${this.$request.getApi('/exportDeliveryData')}?${str}`
      // var win = window.open(str)
      // if (!win) {
      //   this.$tip('请允许在本页打开新窗口')
      // }
    },
    /**
     * 获取业务数据
     * @param  {Object}   data   请求参数
     * @return {Object}          promise 对象
     */
    getListData(data, url = '/getMilitaryData', method = 'post') {
      if (this.loading) {
        return
      }
      this.loading = true
      var conf = {
        url,
        method,
        raw: true
      }
      if (isUndefined(data.method_id)) {
        data.method_id = 2
      }
      if (method === 'post') {
        conf.data = data
      } else {
        conf.query = data
      }
      return this.$request(conf)
        .then(
          (re) => {
            this.loading = false
            return re
          },
          (err) => {
            this.loading = false
            console.error(err)
          }
        )
        .catch((err) => {
          this.loading = false
          console.error(err)
        })
    }
  }
}
