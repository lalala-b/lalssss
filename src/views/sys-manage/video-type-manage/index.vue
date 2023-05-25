<template>
  <div>
    <Wrap class="p-b-0">
      <el-form :inline="true" class="search-view">
        <el-form-item>
          <el-select v-model="searchData.junType" clearable filterable placeholder="视频类型">
            <el-option v-for="item in junTypeList" :key="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchData.isOnline" clearable placeholder="在线状态">
            <el-option label="在线" :value="1" />
            <el-option label="下线" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchData.isDeleted" clearable placeholder="删除状态">
            <el-option label="删除" :value="1" />
            <el-option label="未删除" :value="0" />
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
        <el-button class="m-b-10" icon="el-icon-circle-plus-outline" size="small" type="primary" @click="handleEdit({}, 'add')">新增</el-button>
        <el-button class="m-b-10" icon="el-icon-circle-plus-outline" size="small" type="primary" @click="handleEdit({}, 'moreEdit')">批量编辑</el-button>
      </div>
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column prop="platName" label="平台名称" />
        <el-table-column prop="junType" label="视频类型" />
        <el-table-column prop="junNum" label="军工系数" />
        <el-table-column prop="needFlow" label="是否有起征点">
          <template slot-scope="{row}">{{ row.needFlow === 1 ? '否': '是' }}</template>
        </el-table-column>
        <el-table-column prop="startPoint" label="起征点" />
        <el-table-column prop="orgType" label="视频归属">
          <template slot-scope="{row}">{{ row.orgType === 3 ? '海盗' : '乾派' }}</template>
        </el-table-column>
        <el-table-column prop="isOnline" label="在线状态">
          <template slot-scope="{row}">{{ row.isOnline===1 ? '在线': '下线' }}</template>
        </el-table-column>
        <el-table-column prop="isDeleted" label="删除状态">
          <template slot-scope="{row}">{{ row.isDeleted===1 ? '删除': '正常' }}</template>
        </el-table-column>
        <el-table-column prop="advType" label="广告类型">
          <template slot-scope="{row}">{{ row.advType===1 ? '广告': '非广告' }}</template>
        </el-table-column>
        <el-table-column prop="brand" label="品牌" />
        <el-table-column prop="businessType" label="业务类型" />

        <el-table-column label="操作" width="180">
          <template slot-scope="s">
            <el-button icon="el-icon-view" size="small" @click="handleEdit(s.row, 'detail')">查看</el-button>
            <el-button icon="el-icon-edit" size="small" @click="handleEdit(s.row, 'edit')">编辑</el-button>
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
      :type="dialogType"
      :jun-type-list="junTypeList"
      @success="getList"
    />
  </div>
</template>
<script>
import { copy } from '@/utils'
import { $getVideoTypeManageList, $getVideoTypeList } from '@/api/backend-manage'
import EditDialog from './editDialog'
export default {
  components: {
    EditDialog
  },
  data() {
    return {
      total: 0,
      searchData: {
        pageNum: 1
      },
      tableData: [],
      junTypeList: [],
      editData: {},
      loading: false,
      toggleDialog: false,
      dialogType: 'detail'
    }
  },
  created() {
    this.getList()
    this.getVideoTypeList()
  },
  methods: {
    getList() {
      const params = copy(this.searchData)
      this.loading = true
      $getVideoTypeManageList(params).then(res => {
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
    handleEdit(editData, dialogType = 'detail') {
      this.editData = editData
      this.dialogType = dialogType
      this.toggleDialog = true
    },
    getVideoTypeList() {
      $getVideoTypeList().then(res => {
        if (res.code === 1) {
          this.junTypeList = res.data
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
