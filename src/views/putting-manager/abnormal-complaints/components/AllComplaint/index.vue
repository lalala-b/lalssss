<template>
  <div>
    <Wrap class="search-view">
      <Search tab-name="allComplaint" @onSubmit="onSubumit" @onExport="onExport" />
    </Wrap>
    <Wrap class="table-view">
      <el-tabs v-model="searchData.appealType" @tab-click="getList()">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
          <template slot="label">
            {{ item.label }} <i v-if="item.num" class="icon-high">{{ item.num }}</i>
          </template>
        </el-tab-pane>
      </el-tabs>
      <Tabel v-loading="loading" class="m-t-24" :table-list="tableList" source="all" :do-sort="doSort" @success="reload" />
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
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import qs from 'qs'
import Tabel from '../../_com/Tabel'
import Search from '../../_com/Search.vue'
import { useTable } from '../../_com/hooks'
import { $getListStatistics } from '@/api/putting-manager'
import { copy } from '@/utils'
export default defineComponent({
  components: { Tabel, Search },
  setup() {
    const { $message, $componentId } = getCurrentInstance().proxy
    const tabs = ref([{
      name: 'all',
      label: '全部',
      num: null
    }, {
      name: 'scalping_type',
      label: '刷量',
      num: null
    }, {
      name: 'kuai_shou_current_limiting',
      label: '快手限流',
      num: null
    }, {
      name: 'kuai_shou_delete',
      label: '快手删除视频',
      num: null
    }, {
      name: 'examine_problem',
      label: '审核问题',
      num: null
    }, {
      name: 'order_amount_modify',
      label: '订单金额修改',
      num: null
      }])
    const defalutData = {
      findType: 1,
      pageNum: 1,
      appealType: 'all'
    }
    const { total, loading, getList, tableList, searchData, doSort } = useTable(defalutData)

    getList()

    const getListStatistics = () => {
      $getListStatistics(searchData).then(res => {
        if (res.code === 1) {
          tabs.value.forEach(item => {
            item.num = res.data[item.name]
          })
        } else {
          $message.error(res.message)
        }
      }).catch(err => {
      })
    }

    const onSubumit = (data) => {
      const params = copy(data)
      params.pageNum = 1
      Object.assign(searchData, params)
      getList()
      getListStatistics()
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

    getListStatistics()

    const reload = () => {
      getList()
      getListStatistics()
    }
    return {
      reload,
      doSort,
      onSubumit,
      onExport,
      getList,
      total,
      loading,
      tableList,
      tabs,
      searchData
    }
  }
})
</script>
<style lang="scss" scoped>
  .icon-high {
    background-color: #f00;
    color: #fff;
    min-width: 16px;
    padding: 0 4px;
    height: 16px;
    line-height: 16px;
    display: inline-block;
    text-align: center;
    border-radius: 10px;
    ::v-deep .el-loading-spinner {
      margin-top: -10px;
      .circular {
        width: 20px;
        height: 20px;
      }
    }
  }
</style>

