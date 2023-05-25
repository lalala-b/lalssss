<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-29 14:14:30
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    class="add-user-dialog"
    title="管理角色"
    width="663px"
    :visible="value"
    @close="$emit('input', false)"
  >
    <div class="content">
      <treeselect
        v-model="roleIds"
        :multiple="true"
        :options="roleList"
        :flat="true"
        :disable-branch-nodes="true"
        :is-new="true"
        :is-default-expanded="true"
        placeholder="请选择角色"
        no-children-text="暂无数据"
        no-options-text="暂无数据"
        no-results-text="暂无数据"
        search-nested
      />
      <!-- <el-tree
        v-model="roleIds"
        show-checkbox
        :check-strictly="true"
        :data="roleList"
        :highlight-current="true"
        :default-checked-keys="roleIds"
        :default-expanded-keys="roleIds"
        node-key="id"
      /> -->
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getRoleByUserId, $saveRole, $getRoleOrgList } from '@/api/backend-manage'

import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: [],
      loading: false
    }
  },
  created() {
    this.getRoleOrgList()
  },
  methods: {
    // 获取用户可分配的组织与角色
    getRoleOrgList() {
      // $getRoleOrgList({ orgId: this.data.orgId })
      $getRoleOrgList()
        .then(res => {
          if (res.code === 1) {
            this.buildOptions(res.data)
          } else {
            this.$message.error(res.error)
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        }).finally(() => {
          this.getRoleByUserId()
        })
    },
    // 数组->树结构
    array2Tree(arr) {
      if (!Array.isArray(arr) || !arr.length) return
      const map = {}
      arr.forEach(item => {
        item.children = []
        item.label = item.orgName
        item.disabled = true
        map[item.id] = item
      })

      const roots = []
      arr.forEach(item => {
        const parent = map[item.parentId]
        if (parent) {
          parent.children.push(item)
        } else {
          roots.push(item)
        }
      })
      return roots
    },
    // 组件数据
    buildOptions(data) {
      let { orgInfos, roleInfos } = data
      orgInfos = this.array2Tree(orgInfos)
      const roleMap = {}

      roleInfos.forEach(item => {
        roleMap[item.orgId] || (roleMap[item.orgId] = [])
        roleMap[item.orgId].push(item)
      })

      function deep(op) {
        op.forEach(item => {
          if (item.children) {
            roleMap[item.id] && (item.children = [...item.children, ...roleMap[item.id]])
            deep(item.children)
          }
        })
      }
      deep(orgInfos)
      this.roleList = orgInfos
    },
    async getRoleByUserId() {
      const res = await $getRoleByUserId({
        userid: this.data.id
      })
      if (res.code === 1) {
        this.roleIds = res.data
      }
    },
    async save() {
      if (this.loading) {
        return
      }
      this.loading = true
      if (this.roleIds.length === 0) {
        this.loading = false
        return this.$message.error('请分配角色')
      }
      const res = await $saveRole({
        roleOrgIds: this.roleIds,
        userId: this.data.id
      })
      if (res.code === 1) {
        this.$message.success('保存成功')
        this.$emit('input', false)
        this.$emit('update')
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .add-btn {
    margin-top: 12px;
    .el-button {
      width: 100%
    }
  }
  ::v-deep .el-checkbox__input.is-disabled {
    display: none;
  }
</style>
