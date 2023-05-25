<template>
  <Wrap>
    <div class="table-view">
      <el-button class="m-b-10" type="text" icon="el-icon-refresh" size="mini" @click="uploadList">刷新</el-button>
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline>
              <el-form-item label="接口功能：">
                <span>{{ props.row.functioinApi }}</span>
              </el-form-item>
            </el-form>
            <template v-if="!logTypes">
              <el-form label-position="left" inline>
                <el-form-item label="类名：">
                  <span>{{ props.row.clazzName }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline>
                <el-form-item label="方法名：">
                  <span>{{ props.row.methodName }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline>
                <el-form-item label="是否已删除：">
                  <span>{{ props.row.isDeleted === 0 ? '否' : '是' }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline>
                <el-form-item label="创建人：">
                  <span>{{ props.row.createBy }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline>
                <el-form-item label="创建时间：">
                  <span>{{ props.row.createdTime }}</span>
                </el-form-item>
              </el-form>
              <el-form label-position="left" inline>
                <el-form-item label="更新时间：">
                  <span>{{ props.row.updatedTime }}</span>
                </el-form-item>
              </el-form>
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="requestUri" label="请求地址" />
        <el-table-column prop="requestType" label="请求类型" />
        <el-table-column prop="functioin1th" label="一级页面" />
        <el-table-column prop="functioin2rd" label="二级页面" />
        <el-table-column prop="functioin3th" label="三级页面" />
        <el-table-column prop="status" label="接口状态">
          <template slot-scope="{ row }">{{ row.status === 0 ? '停用' :'启用' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="280">
          <template slot-scope="{ row }">
            <el-button type="primary" size="small" @click="hanleEditClick(row)">修改</el-button>
            <el-button type="success" size="small" class="m-r-10" @click="handleBindRole(row)">绑定角色</el-button>
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelClick(row)"
            >
              <el-button slot="reference" type="danger" size="small">删除</el-button>
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
    <edit v-if="editShow" v-model="editShow" :edit-data="editData" @success="getList" />
    <roleDialog v-if="roleDialogShow" :id="id" v-model="roleDialogShow" @success="getList" />
  </Wrap>
</template>
<script>
import Edit from './edit'
import roleDialog from './roleDialog'
import { $getApiControlList, $updateApiList, $delApiById } from '@/api/sys'
import { copy } from '@/utils'
export default {
  name: 'ApiControl',
  components: {
    Edit,
    roleDialog
  },
  data() {
    return {
      searchData: {
        pageNum: 1
      },
      id: null,
      editShow: false,
      roleDialogShow: false,
      loading: false,
      tableData: [],
      editData: {},
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = copy(this.searchData)
      $getApiControlList(params).then(res => {
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
    /* 更新列表 */
    async uploadList() {
      try {
        await $updateApiList()
        this.getList()
      } catch (e) {
        console.log(e)
      }
    },
    handleDelClick(row) {
      $delApiById(row.id).then(res => {
        if (res.code === 1) {
          this.$message.success(res.message)
          this.getList()
        }
      })
    },
    hanleEditClick(row) {
      this.editShow = true
      this.editData = row
    },
    handleBindRole(row) {
      this.id = row.id
      this.roleDialogShow = true
    }
  }
}
</script>
<style lang="scss">

</style>
