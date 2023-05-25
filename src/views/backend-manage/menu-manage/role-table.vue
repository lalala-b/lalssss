<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:13
 * @LastEditTime: 2020-12-23 14:30:27
 * @LastEditors: Linjie
-->
<template>
  <div class="table-view m-t-16">
    <TabForm @save="handleSearch" />
    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="roleTableData"
      cell-class-name="table-cell"
      header-row-class-name="table-header"
    >
      <el-table-column prop="id" label="id" width="80" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column label="状态" width="160">
        <template slot-scope="s">
          {{ s.row.status === 1 ? '正常' : '停用' }}
        </template>
      </el-table-column>
      <el-table-column label="角色类型" width="160">
        <template slot-scope="s">
          {{ typeName[s.row.typeId] }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="s">
          <el-link type="primary" @click="onCanel(s.row)">取消绑定</el-link>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="total" class="pagenation-view">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="20"
        :total="total"
        :current-page="rolePageNum"
        @current-change="getRoleList"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { $deleteBindRoleForMenu } from '@/api/backend-manage'
import TabForm from './_components/tab-form.vue'

export default {
  components: {
    TabForm
  },
  data() {
    return {
      organizeVisible: false,
      loading: false,
      dialog: {
        show: false
      },
      form: {
        roleName: '',
        typeId: null
      },
      nowPage: 0,
      typeName: {
        1: '特殊',
        3: '海盗',
        5: '乾派'
      }
    }
  },
  computed: {
    ...mapState('menuManage', {
      roleTableData: state => state.roleTableData,
      total: state => state.roleTotal,
      editData: state => state.editData,
      rolePageNum: state => state.rolePageNum
    })
  },
  watch: {
    roleTableData() {
      this.form = {
        roleName: '',
        typeId: null
      }
    }
  },
  methods: {
    ...mapActions('menuManage', [
      'getRoleList',
      'setEditId',
      'updateData'
    ]),
    handleSearch(form) {
      this.getRoleList({
        ...form,
        pageNum: 1
      })
    },
    onCanel(row) {
      if (!this.editData.id) {
        return
      }
      this.$confirm('确认取消绑定吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res = await $deleteBindRoleForMenu({
            menuId: this.editData.id,
            roleIdList: [row.id]
          })
          if (res.code === 1) {
            this.$message.success(res.message || '操作成功')
            this.updateData(this.editData.id)
          } else {
            this.$message.error(res.message || '网路错误')
          }
        } catch (err) {
          this.$message.error(err)
        }
      })
    }
  }
}
</script>
