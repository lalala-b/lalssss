<template>
  <div>
    <Wrap class="search-view">
      <Search tab-name="my" @onSubmit="onSubumit" @onExport="onExport" />
    </Wrap>
    <Wrap class="table-view">
      <Tabel v-loading="loading" :table-list="tableList" :do-sort="doSort" @success="getList" />
      <div>
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance } from '@vue/composition-api'
import qs from 'qs'
import Tabel from '../../_com/Tabel'
import Search from '../../_com/Search'
import { useTable } from '../../_com/hooks'

import { copy } from '@/utils'
export default defineComponent({
  components: { Tabel, Search },
  setup() {
    const { $componentId } = getCurrentInstance().proxy
    const defalutData = {
      findType: 0,
      pageNum: 1
    }
    const { total, loading, getList, tableList, searchData, doSort } = useTable(defalutData)
    getList(Math.random())

    const onSubumit = (data) => {
      const params = copy(data)
      params.pageNum = 1
      Object.assign(searchData, params)
      getList()
    }

    const onExport = (data) => {
      const params = copy(data)
      Object.assign(searchData, params)

      const exportParams = copy(searchData)
      delete exportParams.pageNum
      if (exportParams.appealType === 'all') exportParams.appealType = ''

      window.open(
        `/api/exception/order/appeal/exportAppealList?${qs.stringify({
          ...exportParams,
          random: '',
          componentId: $componentId
        })}`
      )
    }

    return {
      doSort,
      searchData,
      total,
      loading,
      tableList,
      getList,
      onSubumit,
      onExport
    }
  }
})
</script>

