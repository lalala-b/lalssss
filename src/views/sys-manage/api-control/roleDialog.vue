<template>
  <el-dialog
    title="绑定角色"
    width="670px"
    :visible="value"
    @close="onCancel"
  >
    <el-transfer
      v-model="roleIds"
      :data="roleList"
      :titles="['未选择角色', '已选择角色']"
      filterable
    />
    <!-- <el-table
      :data="roleList"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column label="角色类型">
        <template slot-scope="{ row }">
          <div>
            {{ typeIdMap[row.typeId] }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="code" />

    </el-table>
    <el-pagination
      class="m-t-10"
      background
      layout="prev, pager, next, jumper"
      :page-size="size"
      :total="total"
      :current-page.sync="pageNum"
      @current-change="getRoleList"
    /> -->
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $getRoleList } from '@/api/backend-manage'
import { $bindRoleForApi, $getRoleByApiId } from '@/api/sys'
export default {
  props: {
    value: Boolean,
    editData: {
      type: Object,
      default() {
        return {}
      }
    },
    id: {
      type: [String, Number],
      default: '0'
    }
  },
  data() {
    this.typeIdMap = {
      1: '特殊',
      3: '海盗',
      5: '乾派'
    }
    return {
      loading: false,
      size: 20,
      pageNum: 1,
      total: 0,
      info: {},
      roleList: [],
      roleIds: []
    }
  },
  created() {
    this.getRoleList()
    this.getRoleByApiId()
  },
  methods: {
    getRoleList() {
      $getRoleList({ pageNum: this.pageNum, size: 99999 }).then(res => {
        this.roleList = res.data.map(item => ({
          key: item.id,
          label: item.name
        }))
        this.total = res.total
      })
    },
    getRoleByApiId() {
      const $msg = this.$message
      $getRoleByApiId({
        apiId: this.id
      }).then(res => {
        if (res.code !== 1) {
          return $msg.error(res.message)
        }
        this.roleIds = res.data.map(_ => _.roleId)
      }).catch(err => {
        $msg.error(err.message)
      })
    },
    handleSave() {
      const $msg = this.$message
      const apiId = this.id
      const roleIdList = this.roleIds
      if (roleIdList.length === 0) {
        $msg.error('请选择绑定的角色')
        return
      }
      this.loading = true
      $bindRoleForApi({ apiId, roleIdList }).then(res => {
        $msg.success('绑定成功')
        this.onCancel()
      }).catch(err => {
        $msg.error(err.msg)
      }).finally(_ => {
        this.loading = false
      })
    },
    onCancel() {
      this.$emit('input', false)
    }
  }
}
</script>
