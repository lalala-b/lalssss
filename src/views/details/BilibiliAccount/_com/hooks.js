import { getCurrentInstance, ref } from '@vue/composition-api'
import { $getDetailWorkerOrder, $getAdlibList } from '@/api/bussiness-manage'
import { copy } from '@/utils'
import { useTableSort } from '@/hook'

// 工单
export const useOrder = function() {
  const { $message } = getCurrentInstance().proxy
  const summaryItems = ref([
    {
      key: 'total',
      text: '工单数量',
      val: 0
    },
    {
      key: 'overCount',
      text: '已完成工单数量',
      val: 0
    },
    {
      key: 'workMoney',
      text: '销售收入',
      val: 0
    },
    {
      key: 'sumMoney',
      text: '执行金额',
      val: 0
    },
    {
      key: 'performanceMoney',
      text: '绩效营收',
      value: 0
    }
  ])
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  const searchData = {}
  const getList = () => {
    const params = searchData
    loading.value = true
    $getDetailWorkerOrder(params).then(res => {
      if (res.code === 1) {
        summaryItems.value.forEach(item => {
          item.val = res.data[item.key]
        })
        tableData.value = res.data.list
        total.value = res.data.total
      } else {
        $message.error(res.message)
      }
      loading.value = false
    }).catch(err => {
      if (err.__CANCEL__) {
        return
      }
      if (err.message) {
        $message.error(err.message)
      }
      loading.value = false
    })
  }

  const setSearchData = (params) => {
    Object.assign(searchData, params)
  }

  const onSubmit = (params) => {
    Object.assign(searchData, params, { pageNum: 1 })
    getList()
  }

  const { doSort } = useTableSort(searchData, getList)

  return {
    doSort,
    onSubmit,
    getList,
    searchData,
    setSearchData,
    summaryItems,
    tableData,
    total,
    loading
  }
}

// 合作视频
export const useVideo = function() {
  const { $message } = getCurrentInstance().proxy
  const tableData = ref([])
  const total = ref(0)
  const loading = ref(false)
  const searchData = {}
  const summaryItems = ref([
    {
      key: 'sumFlowCount',
      text: '总流量',
      val: null
    },
    {
      key: 'sumTitle',
      text: '标题数',
      val: null
    },
    {
      key: 'avgFlowCount',
      text: '集均播放量',
      val: null
    },
    {
      key: 'sumFlowMoney',
      text: '总执行金额',
      val: null
    },
    {
      key: 'sumThumbUpCount',
      text: '总点赞量',
      val: null
    }
  ])

   const setSearchData = (params) => {
    Object.assign(searchData, params)
  }

  const onSubmit = (params) => {
    Object.assign(searchData, params, { pageNum: 1 })
    getList()
  }

  const getList = () => {
    const data = copy(searchData)
      if (data.timerange) {
        data.dateStart = data.timerange[0] || ''
        data.dateEnd = data.timerange[1] || ''
        if (data.dateEnd) {
          data.dateEnd += ' 23:59:59'
        }
        delete data.timerange
      }
      loading.value = true
      $getAdlibList(data).then(res => {
        if (res.code === 1) {
          summaryItems.value.forEach(item => {
            item.val = res.data[item.key]
          })
          tableData.value = res.data.advertisementLibraryVOList
          total.value = res.data.total
        } else {
          $message.error(res.message)
        }
        loading.value = false
      })
  }

  const { doSort } = useTableSort(searchData, getList)

  return {
    doSort,
    onSubmit,
    getList,
    searchData,
    setSearchData,
    summaryItems,
    tableData,
    total,
    loading
  }
}
