<template>
  <div>
    <wrap class="search-view">
      <el-tag
        class="m-b-12"
        type="warning"
      ><i
        class="el-icon-warning m-r-12"
      />管理页面路由与前端路由文件地址之间的映射关系</el-tag>
      <Search ref="search" :config="formConf" @submit="onSubmit" />
    </wrap>
    <wrap>
      <div class="flex flex-justify-between m-b-16">
        <el-button type="primary" @click="handleAdd">新增路由</el-button>
      </div>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
      >
        <el-table-column label="路由名称" min-width="140" prop="routeName" />
        <el-table-column label="路由code" min-width="150" prop="routeCode" />
        <el-table-column
          label="路由页面地址"
          min-width="140"
          prop="routeAddress"
        />
        <el-table-column label="路由归属">
          <template slot-scope="{ row }">
            {{
              +row.routeBelong
                ? +row.routeBelong === 1
                  ? "海盗"
                  : "乾派"
                : "公共"
            }}
          </template>
        </el-table-column>
        <el-table-column label="是否迁移">
          <template slot-scope="{ row }">
            {{ +row.isMoveted ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="是否发布">
          <template slot-scope="{ row }">
            <el-tag v-if="+row.isPublished" type="success">已发布</el-tag>
            <el-tag v-else type="info">未发布</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否禁用" prop="isForbidden">
          <template slot-scope="{ row }">
            <el-tag v-if="+row.isForbidden" type="success">正常</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updatedTime" min-width="140" />
        <el-table-column label="操作" min-width="140" fixed="right">
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <el-link
                type="primary"
                class="m-r-16"
                :underline="false"
                @click="handleEditRoute(row)"
              >编辑</el-link>
              <el-link
                type="primary"
                class="m-r-16"
                :underline="false"
                @click="handleDelete(row)"
              >删除</el-link>
              <el-link
                v-if="!row.isPublished"
                type="primary"
                :underline="false"
                @click="handlePublish(row)"
              >发布</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <div class="pagenation-view">
        <el-pagination
          background
          layout="total,prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div> -->
    </wrap>
    <EditRoute
      v-if="showRouteDialog"
      v-model="showRouteDialog"
      :info="info"
      :type="type"
      :from="from"
      @close="handleClose"
      @success="getList"
    />
  </div>
</template>
<script>
import {
  getCurrentInstance,
  reactive,
  toRefs,
  ref
} from '@vue/composition-api'
import { Search } from 'components'
import EditRoute from './_com/EditRoute.vue'
import {
  $deleteRoute,
  $publishRoute,
  $getRouteList
} from '@/api/backend-manage'
export default {
  components: {
    Search,
    EditRoute
  },
  setup(props, { emit }) {
    const { $message, $confirm } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: false
    })
    const states = reactive({
      loading: false,
      tableData: [],
      // total: 0,
      info: {},
      showRouteDialog: false,
      type: 'add',
      from: ''
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'input',
          key: 'routeName',
          conf: {
            placeholder: '请输入路由名称'
          }
        },
        {
          type: 'input',
          key: 'routeCode',
          conf: {
            placeholder: '请输入路由code'
          }
        },
        {
          type: 'input',
          key: 'routeAddress',
          conf: {
            placeholder: '请输入路由页面地址'
          }
        },
        {
          type: 'select',
          key: 'routeBelong',
          optionLabelKey: 'label',
          optionValKey: 'value',
          data: [
            { label: '海盗', value: 1 },
            { label: '乾派', value: 2 },
            { label: '公共', value: 0 }
          ],
          conf: {
            placeholder: '路由归属'
          }
        },
        {
          type: 'select',
          key: 'isMoveted',
          optionLabelKey: 'label',
          optionValKey: 'value',
          data: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ],
          conf: {
            placeholder: '是否迁移'
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const getList = function() {
      states.loading = true
      return $getRouteList({
        ...searchData.value
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data || []
          } else {
            states.tableData = []
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    const onSubmit = (data) => {
      Object.assign(searchData.value, { ...data })
      getList()
    }
    // const onExport = (data) => {
    //   const params = formatData(data)
    //   Object.assign(searchData.value, params)
    //   window.open(
    //     `/api/hd/comment/info/exportCommentList?${qs.stringify({
    //       ...searchData.value
    //     })}`
    //   )
    // }
    const handleClose = () => {
      states.showRouteDialog = false
    }
    const handleEditRoute = (row) => {
      states.info = row
      states.type = 'edit'
      states.from = 'EditRoute'
      states.showRouteDialog = true
    }
    const handleAdd = () => {
      states.type = 'add'
      states.from = ''
      states.info = {}
      states.showRouteDialog = true
    }
    const handlePublish = async(row) => {
      $confirm('是否确认发布此路由?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await $publishRoute({ routeCode: row.routeCode })
        if (res.code === 1) {
          $message.success(res.message)
          getList()
        }
      })
    }
    const handleDelete = async(row) => {
      $confirm('是否确认删除此路由?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await $deleteRoute({ routeCode: row.routeCode })
        if (res.code === 1) {
          $message.success(res.message)
          getList()
        }
      })
    }
    buildFormConf()
    getList()
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      getList,
      handleClose,
      handleEditRoute,
      handlePublish,
      handleAdd,
      handleDelete
    }
  }
}
</script>
