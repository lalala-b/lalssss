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
      <el-table-column prop="id" label="角色ID" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="角色状态">
        <template slot-scope="s">
          <p v-if="s.row.status === 1">正常</p>
          <p v-else class="red-tip">停用</p>
        </template>
      </el-table-column>
      <el-table-column label="角色类型">
        <template slot-scope="s">
          <p>{{ typeIdList[s.row.typeId] }}</p>
        </template>
      </el-table-column>
    </el-table>
    <!-- <div v-if="total" class="pagenation-view">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="total"
        :current-page.sync="nowPage"
      />
    </div> -->
  </div>
</template>

<script>
import { $getRoleByOrgId } from '@/api/backend-manage'
import { $updateUser } from '@/api'

export default {
  components: {

  },
  props: {
    data: {
      type: Object,
      default: null
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
      typeIdList: Object.freeze({
        3: '海盗',
        5: '乾派',
        1: '特殊'
      }),
      nowPage: 0,
      total: 0
    }
  },
  watch: {
    data: {
      handler(newData) {
        this.getTableData()
      }
      // immediate: true
    }
  },
  created() {
    if (this.data) {
      this.getTableData()
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
        this.getTableData()
      }
    },
    /**
     * 根据组织ID获取绑定的角色
     */
    async getTableData() {
      this.loading = true
      const re = await $getRoleByOrgId(this.data.id ? {
        orgId: this.data.id
      } : null)
      if (re.code === 1) {
        this.tableData = Array.isArray(re.data) ? re.data : []
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
<style lang="scss" scoped>
  .red-tip {
    color: red;
  }
</style>
