<template>
  <div>
    <Wrap class="p-b-0">
      <el-form :inline="true" class="search-view">
        <el-form-item>
          <el-select v-model="searchData.orgId" clearable placeholder="组织名">
            <el-option v-for="item in orgList" :key="item.orgId" :value="item.orgId" :label="item.orgName" />
          </el-select>

        </el-form-item>
        <el-form-item>
          <el-select v-model="searchData.junType" clearable placeholder="视频类型" filterable>
            <el-option v-for="item in junTypeList" :key="item" :value="item" />
          </el-select>
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
    </Wrap>
    <Wrap class="table-view">
      <div class="flex flex-justify-end">
        <el-button class="m-b-10" icon="el-icon-circle-plus-outline" size="small" type="primary" @click="handleEdit({}, 'moreEdit')">批量编辑</el-button>
      </div>
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column prop="orgName" label="组织名" />
        <el-table-column prop="remark" label="备注" />

        <el-table-column label="操作" width="180">
          <template slot-scope="s">
            <el-button icon="el-icon-view" size="small" @click="handleEdit(s.row, 'detail')">视频类型绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :hide-on-single-page="true"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <EditDialog
      v-if="toggleDialog"
      v-model="toggleDialog"
      :data="editData"
      :jun-type-list="junTypeList"
      @success="getList"
    />
  </div>
</template>
<script>
import { copy } from '@/utils'
import { $getVideoTypeBindList, $getVideoTypeList, $getOrganizationInfoCondition } from '@/api/backend-manage'
import EditDialog from './editDialog'
export default {
  components: {
    EditDialog
  },
  data() {
    return {
      total: 0,
      searchData: {
        pageNum: 1,
        orgId: '',
        junType: ''
      },
      tableData: [],
      junTypeList: [],
      orgList: [],
      editData: {},
      loading: false,
      toggleDialog: false
    }
  },
  created() {
    this.getList()
    this.getVideoTypeList()
    this.getOrganizationInfoCondition()
  },
  methods: {
    getList() {
      const params = copy(this.searchData)
      this.loading = true
      $getVideoTypeBindList(params).then(res => {
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
    // 编辑, 新增，编辑
    handleEdit(editData) {
      this.editData = editData
      this.toggleDialog = true
    },
    getVideoTypeList() {
      $getVideoTypeList().then(res => {
        if (res.code === 1) {
          this.junTypeList = res.data
        }
      })
    },
    getOrganizationInfoCondition() {
      $getOrganizationInfoCondition().then(res => {
        if (res.code === 1) {
          this.orgList = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .p-b-0 {
    padding-bottom: 0;
  }
</style>
