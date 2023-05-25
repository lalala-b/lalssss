
<template>
  <div class="table-view">
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      :row-class-name="handleRowClass"
      :span-method="objectSpanMethod"
      row-key="id"
      border
      :tree-props="{children: 'childNodeTags', hasChildren: 'childNodeTags.length'}"
      @sort-change="doSort"
    >

      <!-- <el-table-column type="index" /> -->
      <el-table-column
        prop="platId"
        label="平台"
        type=""
      >
        <template slot-scope="{ row }">
          <span v-if="!row.parentMd5Id">
            {{ row.platName || '--' }}
          </span>
          <span v-else />
        </template>
      </el-table-column>

      <el-table-column
        prop="tagType"
        label="标签类型"
        type=""
      >
        <template slot-scope="{ row }">
          <span v-if="!row.parentMd5Id">
            {{ row.tagTypeName || '--' }}
            <!-- {{ ['内容标签', '行业标签'][row.tagType] || '--' }} -->
          </span>
          <span v-else />
        </template>
      </el-table-column>

      <el-table-column
        prop="tagName"
        label="标签名"
      >
        <template slot-scope="{ row }">
          {{ row.tagName || '--' }}
        </template>
      </el-table-column>

      <el-table-column label="所属层级">
        <template slot-scope="{ row }">
          {{ levelMap[row.tagLevel] }}级标签
        </template>
      </el-table-column>

      <el-table-column label="第三方标签ID">
        <template slot-scope="{ row }">
          {{ row.tagId }}
        </template>
      </el-table-column>

      <el-table-column
        prop="source"
        label="标签来源"
      >
        <template slot-scope="{ row }">
          {{ ['系统', '自定义'][row.source] || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="enableFlag"
        label="是否禁用"
      >
        <template slot-scope="{ row }">
          {{ +row.enableFlag ? '是' : '否' }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button v-if="+row.source" type="text" @click="handleCheckDetail(row, 'edit')">编辑</el-button>
          <el-button type="text" @click="handleCheckDetail(row)">查看详情</el-button>
          <el-button v-if="+row.source" class="deleteButton" type="text" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

    <EditDialog
      :id="detailId"
      :plat-info="platInfo"
      :show="showEditDialog"
      :type="editDialogType"
      @close="handleClose"
      @confirm="handleUpdate"
    />

  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $getTagLibraryList, $deleteSysPlatTag } from '@/api/tag-library'
import { useTableSort } from '@/hook'
import EditDialog from './editDialog.vue'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    platInfo: {
      type: Array,
      default: () => []
    }
  },
  components: {
    EditDialog
  },
  setup(props) {
    const { $message, $confirm, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: [],
      showEditDialog: false,
      editDialogType: '',
      detailId: '',
      levelMap: ['', '一', '二', '三', '四', '五']
    })

    const handleCheckDetail = (row, type) => {
      state.showEditDialog = true
      state.detailId = row.md5Id
      state.editDialogType = type || 'view'
    }

    const handleClose = () => {
      state.showEditDialog = false
    }

    const handleUpdate = () => {
      handleClose()
      getList()
    }

    const handleDelete = (row) => {
      $confirm('删除后不可恢复，确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const { code, message } = await $deleteSysPlatTag({ md5Id: row.md5Id })
        if (+code === 1) {
          $message.success('删除成功!')
          getList()
        } else {
          $message.error(message)
        }
      })
    }

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $getTagLibraryList({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data || []
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    const handleRowClass = ({ row }) => {
      return +row.enableFlag ? 'enable' : ''
    }

    const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
      if (columnIndex === 0) {
        // console.info('-----------', row, column, rowIndex, columnIndex)
      }

      // return {
      //   rowspan: 2,
      //   colspan: 1
      // }
    }

    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      ...toRefs(state),
      doSort,
      getList,
      handleCheckDetail,
      handleUpdate,
      handleDelete,
      handleRowClass,
      objectSpanMethod,
      handleClose
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}

::v-deep {
  .el-table__row--level-1 {
    background: oldlace;
  }

  .enable {
    color: #ff0000;
  }
}

.deleteButton {
  color: #ff0000;
}
</style>

