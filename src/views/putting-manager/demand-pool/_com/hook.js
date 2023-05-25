import { reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import { useTableSort } from '@/hook'
import { $getRequirementList, $updateRequirementStatus } from '@/api/putting-manager'
import qs from 'qs'

export const useSearch = function(searchData, getList, DEFAULT_PARAMS) {
  // const _this = getCurrentInstance()

  const onSubmit = function(data) {
    Object.assign(searchData, data)
    getList()
  }

  const onExport = function(data) {
    const params = Object.assign({}, searchData, data, DEFAULT_PARAMS)
    window.open(`/api/delivery/requirement/exportRequirementList?${qs.stringify(params)}`)
  }

  return {
    onSubmit,
    onExport
  }
}

export const useTableList = function(DEFAULT_PARAMS) {
  const _this = getCurrentInstance()
  const state = reactive({
    total: 0,
    loading: true,
    tableData: []
  })

  const searchData = {}

  const getList = function() {
    state.loading = true
    return $getRequirementList({ ...DEFAULT_PARAMS, ...searchData }).then(res => {
      state.loading = false
      if (res.code === 1) {
        state.tableData = res.data
        state.total = res.total
      } else {
        console.log('=======1====')
        _this.proxy.$message.error(res.message)
      }
    }).catch(err => {
      if (err && err.__CANCEL__) return
      state.loading = false
      console.log('=======1====')
      _this.proxy.$message.error(err.message || '网络错误')
    })
  }

  const handleChangeStatus = function({ id, requirementStatus, bargainingRemark, connectionFailRemark }) {
    return $updateRequirementStatus({ id, requirementStatus, bargainingRemark, connectionFailRemark }).then(res => {
      if (res.code === 1) {
        getList()
        _this.proxy.$message.success('操作成功')
        Promise.resolve()
      } else {
        _this.proxy.$message.error(res.message)
        return Promise.reject()
      }
    }).catch(err => {
      if (err && err.__CANCEL__) return
      _this.proxy.$message.error(err.message || '网络错误')
      return Promise.reject()
    })
  }

  // 排序
  const { doSort } = useTableSort(searchData, getList)

  return {
    ...toRefs(state),
    searchData,
    getList,
    handleChangeStatus,
    doSort
  }
}
