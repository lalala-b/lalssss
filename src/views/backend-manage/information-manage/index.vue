<template>
  <div>
    <Wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      />
    </Wrap>
    <Wrap class="table-view m-t-24">
      <div>
        <el-button v-if="$permission('information_manage_add')" type="primary" @click="showAdd = true">新增信息流链接</el-button>
        <el-table v-scrollbar v-loading="loading" class="m-t-10" :data="tableData">
          <el-table-column label="序号" type="index" :index="getIndex" />
          <el-table-column label="状态" prop="configStatusValue" />
          <el-table-column label="创建人" prop="createdUserName" />
          <el-table-column label="创建时间" prop="createdTime" width="102px" />
          <el-table-column label="平台" prop="platName" />
          <el-table-column label="代理商" prop="agent" />
          <el-table-column label="应用" prop="brandName" />
          <el-table-column label="推广目标" prop="popularizeTargetValue" />
          <el-table-column label="设备系统" prop="systemType" />
          <el-table-column label="推广业务" prop="popularizeBusiness" />
          <el-table-column label="跳转指定页" prop="forwardPage" />
          <el-table-column label="链接渠道号" prop="androidDeliveryName" />
          <el-table-column label="操作">
            <template slot-scope="{row}">
              <div>
                <el-link type="primary" :undeline="false" @click="handleClickDetai(row)">查看详情</el-link>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation-view">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getList"
          />
        </div>
      </div>
    </Wrap>
    <Add v-if="showAdd" v-model="showAdd" @update="getList" />
    <Detail v-if="showDetail" :id="id" v-model="showDetail" />
  </div>
</template>
<script>
import qs from 'qs'
import Search from '@/components/Search'
import { reactive, toRefs, onMounted, onUnmounted, getCurrentInstance } from '@vue/composition-api'
import Add from './_com/Add.vue'
import Detail from './_com/Detail.vue'
import { $getInformationList, $getInfoStreamCondition, $getLinkageCondition } from '@/api/information-manage'

export default {
  components: {
    Search,
    Add,
    Detail
  },
  setup(props, ctx) {
    const { $permission } = getCurrentInstance().proxy
    const state = reactive({
      id: null,
      showAdd: false,
      showDetail: false
    })

    function useSearch() {
      const normal = [{
        type: 'select',
        key: 'createdUserId',
        data: [],
        conf: {
          placeholder: '请选择创建人'
        },
        optionValKey: 'createdUserId',
        optionLabelKey: 'createdUserName'
      }, {
        type: 'select',
        key: 'platName',
        data: [],
        conf: {
          placeholder: '请选择平台'
        },
        optionValKey: 'configValue',
        optionLabelKey: 'configName'
      }, {
        type: 'select',
        key: 'agent',
        data: [],
        conf: {
          placeholder: '请选择代理商'
        },
        optionValKey: 'agent',
        optionLabelKey: 'agent'
      }, {
        type: 'select',
        key: 'brandName',
        data: [],
        conf: {
          placeholder: '请选择推应用'
        },
        optionValKey: 'configValue',
        optionLabelKey: 'configName'
      }, {
        type: 'select',
        key: 'popularizeTarget',
        data: [],
        conf: {
          placeholder: '请选择推广目标'
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }, {
        type: 'select',
        key: 'systemType',
        data: [],
        conf: {
          placeholder: '请选择设备系统'
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }, {
        type: 'select',
        key: 'popularizeBusiness',
        data: [],
        conf: {
          placeholder: '请选择推广业务'
        },
        optionValKey: 'dictValue',
        optionLabelKey: 'dictLabel'
      }, {
        type: 'select',
        key: 'businessType',
        data: [],
        conf: {
          placeholder: '请选择跳转指定页'
        },
        optionValKey: 'configValue',
        optionLabelKey: 'configName'
      }, {
        type: 'select',
        key: 'androidDeliveryName',
        data: [],
        conf: {
          placeholder: '请选择链接渠道号'
        }
      }]
      const searchState = reactive({
        formConf: {
          normal,
          hasExport: $permission('team_video_export')
        },
        searchData: {
          pageNum: 1,
          size: 20
        }
      })
      const normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })

      const getCondition = () => {
        $getInfoStreamCondition().then(res => {
          if (res.code === 1) {
            for (const key in res.data) {
              if (key === 'androidDeliveryName') {
                res.data[key] = res.data[key].map(item => ({ text: item, val: item }))
              }
              normalFormItemMap[key] && (normalFormItemMap[key].data = res.data[key])
            }
          }
        })
      }
      getCondition()
      function onSubmit(params) {
        Object.assign(searchState.searchData, params)
        searchState.searchData.pageNum = 1
        getList()
      }
      function onSearchChange(val, item, type, index, model) {
        if (item.key === 'brandName') {
          model.businessType = ''
          model.popularizeBusiness = ''
          $getLinkageCondition({
            brandName: val
          }).then(res => {
            if (res.code === 1) {
              normalFormItemMap.businessType.data = res.data.businessType
              normalFormItemMap.popularizeBusiness.data = res.data.popularizeBusiness
            }
          })
        }
      }

      function onExport(params) {
        window.open(`/api/information/stream/info/export?${qs.stringify(searchState.searchData)}`)
      }
      return {
        searchState,
        normalFormItemMap,
        onSubmit,
        onSearchChange,
        onExport
      }
    }
    const { searchState, normalFormItemMap, onSubmit, onSearchChange, onExport } = useSearch()

    function useTable() {
      const tableState = reactive({
        total: 0,
        loading: true,
        tableData: []
      })
      const getList = function() {
        tableState.loading = true
        $getInformationList(searchState.searchData).then(res => {
          if (res.code === 1) {
            tableState.tableData = res.data
          } else {
            ctx.root.$message.error(res.message)
          }
          tableState.loading = false
          tableState.total = res.total
        }).catch(err => {
          if (err.__CANCEL__) return
          tableState.loading = false
          ctx.root.$message.error(err.message)
        })
      }
      getList()

      const handleClickDetai = row => {
        state.id = row.id
        state.showDetail = true
      }

      const getIndex = index => (index + (searchState.searchData.pageNum - 1) * searchState.searchData.size + 1)
      return {
        getList,
        handleClickDetai,
        getIndex,
        tableState
      }
    }
    const { tableState, getList, getIndex, handleClickDetai } = useTable()

    onMounted(() => {
      ctx.root.$bus.$on('updateAgent', () => {
        $getInfoStreamCondition().then(res => {
          if (res.code === 1) {
            normalFormItemMap.agent.data = res.data.agent
          } else {
            ctx.root.$message.error(res.message)
          }
        })
      })
    })

    onUnmounted(() => {
      ctx.root.$bus.$off('updateAgent')
    })
    return {
      ...toRefs(searchState),
      ...toRefs(state),
      ...toRefs(tableState),
      onSubmit,
      onSearchChange,
      onExport,
      getList,
      getIndex,
      handleClickDetai
    }
  }
}
</script>
