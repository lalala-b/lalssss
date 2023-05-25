<template>
  <div>
    <Wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:btns>
          <el-button v-if="$permission('add_command')" type="primary" @click="handleAddCommandTodo">添加口令</el-button>
        </template>
      </Search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <el-table
        v-scrollbar
        :data="tableData"
      >
        <el-table-column label="创建时间" prop="createdTime" width="100" />
        <el-table-column label="口令" prop="wordOfCommand" />
        <el-table-column label="创建人" prop="realname" />
        <el-table-column label="生效开始时间" prop="beginTime" width="110" />
        <el-table-column label="生效结束时间" prop="endTime" width="110">
          <span slot-scope="{row}">{{ row.endTime || '--' }}</span>
        </el-table-column>
        <!-- <el-table-column label="拉新用户数" prop="id" /> -->
        <el-table-column label="投放订单号" prop="orderNumber" width="110">
          <span slot-scope="{row}">{{ row.orderNumber || '--' }}</span>
        </el-table-column>
        <el-table-column label="业务标签" prop="businessTag" />
        <el-table-column label="获客方式" prop="getCustomerWay" />
        <el-table-column label="工具箱" prop="toolCase">
          <span slot-scope="{row}">{{ row.toolCase || '--' }}</span>
        </el-table-column>
        <el-table-column label="达人uid" prop="darenUid">
          <span slot-scope="{row}">{{ row.darenUid || '--' }}</span>
        </el-table-column>
        <el-table-column label="达人名称" width="180" align="left">
          <template slot-scope="{row}">
            <AccountCard v-if="row.accountName" :info="row" />
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="是否入驻" prop="isSettled">
          <span slot-scope="{row}">{{ row.isSettled === 0 ? '否': '是' }}</span>
        </el-table-column>
        <el-table-column label="是否自营" prop="isSelf">
          <span slot-scope="{row}">{{ row.isSelf === 1 ? '否': '是' }}</span>
        </el-table-column>
        <el-table-column label="当前状态" prop="commandStatus">
          <span slot-scope="{row}">{{ row.commandStatus === 0 ? '绑定中': '无效' }}</span>
        </el-table-column>
        <el-table-column v-if="$permission('edit_command')" label="操作" width="150" fixed="right">
          <template slot-scope="{row}">
            <div>
              <el-button :disabled="row.editAuth !== 1" type="primary" size="mini" @click="handleEditCommandTodo(row)">编辑</el-button>
              <el-popconfirm
                class="m-l-5"
                title="确定删除吗？"
                @confirm="handleDel(row)"
              >
                <el-button slot="reference" :disabled="row.editAuth !== 1" type="danger" size="mini">删除</el-button>
              </el-popconfirm>
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
    </Wrap>
    <CommandDialog
      v-if="showDialog"
      v-model="showDialog"
      :edit-data="editData"
      :dialog-type="dialogType"
      :normal-form-item-map="normalFormItemMap"
      @update:list="getList"
    />
  </div>
</template>
<script>
import qs from 'qs'
import { reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import Search from '@/components/Search'
import CommandDialog from './_com/CommandDialog'
import AccountCard from '@/components/AccountCard'
import { isArray, isObject, copy } from '@/utils'
import { $getCommandList, $getCommandCondition, $deleteCommandById } from '@/api/backend-manage'

export default {
  components: {
    Search,
    CommandDialog,
    AccountCard
  },
  created() {
    this.getList()
  },
  setup(props, ctx) {
    // 列表
    function useTableList() {
      const message = getCurrentInstance().proxy.$message
      console.log(message)
      const state = reactive({
        loading: false,
        total: 0,
        tableData: []
      })
      const getList = function() {
        const params = copy(searchData)
        if (params.value.daterange) {
          params.value.beginTime = params.value.daterange[0]
          params.value.endTime = params.value.daterange[1]
          delete params.value.daterange
        }
        state.loading = true
        $getCommandList(params.value).then(res => {
          if (res.code === 1) {
            // tableData = res.data
            state.tableData = res.data
            state.total = res.total
          } else {
            message.error(res.message)
          }
          state.loading = false
        }).catch(err => {
          if (err.__CANCEL__) return
          message.error(err.message)
        })
      }
      const handleDel = function(row) {
        if (row.editAuth === 0) return
        $deleteCommandById({ id: row.id }).then(res => {
          if (res.code === 1) {
            message.success('操作成功')
            onSubmit()
          } else {
            message.error(res.message)
          }
        })
      }
      return {
        ...toRefs(state),
        getList,
        handleDel
      }
    }
    const { total, tableData, getList, handleDel, loading } = useTableList()

    // 筛选相关
    function useSearchForm() {
      const state = reactive({
        formConf: {},
        searchData: {
          pageNum: 1
        }
      })
      const normalFormItemMap = reactive({})
      // 构建筛选框
      const buildFormConf = () => {
        let normal = [{
          type: 'input',
          key: 'wordOfCommand',
          conf: {
            placeholder: '口令'
          }
        }, {
          type: 'select',
          key: 'realname',
          _key: 'creatorList',
          conf: {
            placeholder: '创建人'
          },
          data: []
        }, {
          type: 'date-picker',
          key: 'daterange',
          conf: {
            type: 'daterange',
            placeholder: '生效时间',
            'value-format': 'yyyy-MM-dd',
            'range-separator': '至',
            'start-placeholder': '开始日期',
            'end-placeholder': '结束日期'
          }
        }, {
          type: 'input',
          key: 'orderNumber',
          conf: {
            placeholder: '投放订单号'
          }
        }, {
          type: 'select',
          key: 'businessTag',
          _key: 'businessTagList',
          conf: {
            placeholder: '业务标签'
          },
          data: []
        }, {
          type: 'select',
          key: 'getCustomerWay',
          _key: 'getCustomerWayList',
          conf: {
            placeholder: '获客方式'
          },
          data: []
        }, {
          type: 'select',
          key: 'toolCase',
          _key: 'toolCaseList',
          conf: {
            placeholder: '工具箱'
          },
          data: []
        }, {
          type: 'select',
          key: 'isSelf',
          conf: {
            placeholder: '是否自营'
          },
          data: [{
            text: '是',
            val: 0
          }, {
            text: '否',
            val: 1
          }]
        }]

        normal = normal.filter(item => {
          return ctx.root.$permission(item.code)
        })

        normal.forEach(function(item, index) {
          item.index = index
          normalFormItemMap[item._key || item.key] = item
        })
        state.formConf = {
          normal,
          hasExport: true
        }
      }
      // 获取筛选条件相关数据
      const getCommandCondition = () => {
        $getCommandCondition().then(res => {
          if (res.code !== 1) return
          res = res.data
          for (const key in normalFormItemMap) {
            if (res[key]) {
              if (isArray(res[key]) && isObject(res[key][0])) {
                normalFormItemMap[key].data = res[key]
              } else {
                normalFormItemMap[key].data = res[key].map(item => ({
                  text: item,
                  val: item
                }))
              }
            }
          }
          console.log(normalFormItemMap)
        })
      }

      function init() {
        buildFormConf()
        getCommandCondition()
      }

      init()

      const onSubmit = (params) => {
        state.searchData = Object.assign({}, state.searchData, params)
        state.searchData.pageNum = 1
        getList()
      }
      const onSearchChange = function() {}
      const onExport = function(data) {
        const params = Object.assign({}, state.searchData, data)
        console.log(params)
        if (params.daterange) {
          params.beginTime = params.daterange[0]
          params.endTime = params.daterange[1]
          delete params.daterange
        }
        window.open(`/api/word/command/exportCommandList?${qs.stringify(params)}`)
      }
      return {
        ...toRefs(state),
        onSubmit,
        onSearchChange,
        normalFormItemMap,
        onExport
      }
    }
    const { formConf, searchData, onSubmit, onSearchChange, onExport, normalFormItemMap } = useSearchForm()

    // 口令编辑或者添加
    function useCommandTodo() {
      const state = reactive({
        editData: {},
        showDialog: false,
        dialogType: 0 // 0 -- 新增  1 -- 编辑
      })
      // 新增
      const handleAddCommandTodo = () => {
        state.editData = {}
        state.dialogType = 0
        handleCommandShow()
      }
      // 编辑
      const handleEditCommandTodo = (row) => {
        if (row.editAuth === 0) return
        state.dialogType = 1
        state.editData = row
        handleCommandShow()
      }
      // 弹窗显示
      const handleCommandShow = () => {
        state.showDialog = true
      }

      return {
        ...toRefs(state),
        handleAddCommandTodo,
        handleEditCommandTodo
      }
    }
    const { showDialog, dialogType, handleAddCommandTodo, handleEditCommandTodo, editData } = useCommandTodo()

    return {
      formConf,
      searchData,
      onSubmit,
      onSearchChange,
      onExport,
      normalFormItemMap,

      tableData,
      handleDel,
      loading,
      total,
      getList,

      showDialog,
      dialogType,
      editData,
      handleAddCommandTodo,
      handleEditCommandTodo
    }
  }
}
</script>
