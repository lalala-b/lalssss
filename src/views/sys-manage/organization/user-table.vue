<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:13
 * @LastEditTime: 2020-10-10 17:43:15
 * @LastEditors: Luoxd
-->
<template>
  <div class="table-view">
    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      cell-class-name="table-cell"
      header-row-class-name="table-header"
      style="width: 100%;"
    >
      <el-table-column prop="realname" label="名字" />
      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column prop="email" label="邮箱" width="240" />
      <el-table-column prop="mobile" label="手机号" width="240" />
      <!-- <el-table-column label="操作" width="160">
        <template slot-scope="s">
          <el-link type="primary" @click="onEdit(s.row)">修改部门</el-link>
        </template>
      </el-table-column> -->
    </el-table>
    <div v-if="total" class="pagenation-view">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="total"
        :current-page.sync="pageNum"
        @current-change="getTableData"
      />
    </div>
    <el-dialog
      class="P-usersDialog"
      title="删除确认"
      :visible.sync="dialog.show"
    >
      <div class="P-usersDialogText">
        确认删除吗？
      </div>
      <div slot="footer" class="P-usersDialogFooter">
        <el-button @click="dialog.show = false">取消</el-button>
        <el-button type="primary" @click="onDel">确定</el-button>
      </div>
    </el-dialog>
    <!-- 组织架构选择弹框 -->
    <organizeSelect v-if="organizeVisible" v-model="organizeVisible" @save="onOrganizeEdit" />
  </div>
</template>

<script>
import { $getUserInfo } from '@/api/backend-manage'
import organizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { $updateUser } from '@/api'

export default {
  components: {
    organizeSelect
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      organizeVisible: false,
      loading: false,
      tableData: [],
      dialog: {
        show: false
      },
      pageNum: 0,
      total: 0
    }
  },
  watch: {
    data: {
      handler(newData) {
        this.getTableData(newData)
      }
      // immediate: true
    }
  },
  methods: {
    onEdit(row) {
      this.row = row
      this.organizeVisible = true
    },
    /**
     * 修改部门
     */
    async onOrganizeEdit(org) {
      const re = await $updateUser({
        orgId: org.id,
        id: this.row.id
      })
      if (re.code === 1) {
        this.organizeVisible = false
        this.pageNum = 1
        this.getTableData()
      }
    },
    /**
     * 获取部门的员工
     */
    async getTableData() {
      this.loading = true
      const re = await $getUserInfo(this.data.id ? {
        orgId: this.data.id,
        pageNum: this.pageNum
      } : null)
      if (re.code === 1) {
        this.tableData = Array.isArray(re.data) ? re.data : []
        this.total = re.total
      } else {
        this.tableData = []
      }
      this.loading = false
    },
    onDelUser() {},
    onDel() {}
  }
}
</script>
