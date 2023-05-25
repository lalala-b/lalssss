import { ref, getCurrentInstance, reactive } from '@vue/composition-api'
import { $getAppealList } from '@/api/putting-manager'
import { copy } from '@/utils'
import { useTableSort } from '@/hook'

export const useTable = (defalutData) => {
const { $message } = getCurrentInstance().proxy
  const tableList = ref([])
  const loading = ref(false)
  const total = ref(0)
  const searchData = reactive(defalutData)

  const getList = (random = '') => {
    loading.value = true
    const parmas = copy(searchData)
    if (parmas.appealType === 'all') parmas.appealType = ''
    $getAppealList(parmas, random).then(res => {
      if (res.code === 1) {
        res.data.forEach((item) => {
          const list = item.exceptionOrderAppealListVOSubList
          if (Array.isArray(list) && list.length >= 1) {
            item.videoList = list.slice(0, list.length - 1).reverse()
            item.videoInfo = list[list.length - 1]
          } else {
            item.videoList = []
            item.videoInfo = {}
          }
        })
        tableList.value = res.data

        total.value = res.total
      } else {
        $message.error(res.message)
      }
      loading.value = false
    }).catch(err => {
      if (err.__CANCEL__) return
      loading.value = false
    })
  }

  const { doSort } = useTableSort(searchData, getList)
  return {
    doSort,
    searchData,
    total,
    loading,
    getList,
    tableList
  }
}
