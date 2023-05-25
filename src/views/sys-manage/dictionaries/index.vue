<template>
  <Wrap>
    <el-form :inline="true" class="search-view flex-rows">
      <el-form-item>
        <el-input v-model="searchData.dictName" clearable placeholder="字典名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.configName" clearable placeholder="配置名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.configValue" clearable placeholder="配置值" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchData.daterange"
          type="daterange"
          clearable
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          data-burry_btn_name="search"
          @click="getList"
        >查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-view">
      <div class="flex">
        <el-button class="m-b-10" icon="el-icon-circle-plus-outline" size="small" type="primary" @click="hanleAddClick">新增</el-button>
      </div>
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column prop="dictName" label="字典名称" />
        <el-table-column prop="dictType" label="字典类型" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="s">
            <div :class="'color'+ s.row.status">{{ s.row.status === '0' ? '启用' : '禁用' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column prop="updatedTime" label="更新时间" />
        <el-table-column prop="remark" label="备注" />
        <el-table-column label="操作" width="260">
          <template slot-scope="s">
            <el-button icon="el-icon-edit" size="small" type="primary" @click="handleEdit(s.row)">编辑</el-button>
            <el-button icon="el-icon-s-fold" size="small" type="success" @click="hanleClickList(s.row)">列表</el-button>
            <el-popconfirm
              class="m-l-10"
              title="确定删除？"
              @confirm="handleDeletAccount(s.row.id)"
            >
              <el-button slot="reference" icon="el-icon-delete" size="small" type="danger">删除</el-button>
            </el-popconfirm>
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
    <v-dialog :show.sync="toggleDialog" :is-edit="isEdit" :edit-data="editData" @success="getList" />
  </Wrap>
</template>
<script>
import { copy } from '@/utils'
import { $getDictList, $deleteDictItem } from '@/api/backend-manage'
import dialog from './dialog'
export default {
  components: {
    vDialog: dialog
  },
  data() {
    return {
      isEdit: false,
      total: 0,
      searchData: {
        pageNum: 1
      },
      tableData: [],
      editData: {},
      loading: false,
      toggleDialog: false
    }
  },
  watch: {
    toggleDialog(nVal, oVal) {
      if (!nVal) { this.editData = {} }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const params = copy(this.searchData)
      if (params.daterange) {
        params.dateStart = params.daterange[0]
        params.dateEnd = params.daterange[1] + ' 23:59:59'
        delete params.daterange
      }
      this.loading = true
      $getDictList(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 新增
    hanleAddClick() {
      this.isEdit = false
      this.toggleDialog = true
    },
    // 编辑
    handleEdit(editData) {
      this.isEdit = true
      this.editData = editData
      this.toggleDialog = true
    },
    handleDeletAccount(id) {
      $deleteDictItem(id).then(res => {
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    hanleClickList(s) {
      this.$router.push({
        path: `/sys-manage/dictionaries/${s.dictType}`
      })
    }
  }
}
</script>
<style lang="scss">
  .btn-wrap {
    .el-button {
      padding: 0 2px;
    }
  }
  .color0 {
    color: #67C23A
  }
  .color1 {
    color: #F56C6C
  }
</style>
