<template>
  <el-dialog
    title="用户列表"
    :visible="value"
    width="1000px"
    @open="getList"
    @close="handleClose"
  >
    <el-table
      v-scrollbar
      :data="tableData"
      cell-class-name="table-cell"
      header-row-class-name="table-header"
    >
      <el-table-column prop="realname" label="真实名称" />
      <el-table-column prop="name" label="OA账号" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="orgName" label="组织名称" />
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next, jumper"
      :page-size="size"
      :total="total"
      :current-page.sync="pageNum"
      @current-change="getList"
    />
  </el-dialog>
</template>
<script>
import { $getUserListByRoleId } from '@/api/backend-manage'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      total: 0,
      size: 10,
      pageNum: 1
    }
  },
  methods: {
    getList() {
      $getUserListByRoleId({ roleId: this.roleId, size: this.size, pageNum: this.pageNum }).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        }
      })
    },
    handleClose() {
      this.$emit('input', false)
      this.pageNum = 1
    }
  }
}
</script>
