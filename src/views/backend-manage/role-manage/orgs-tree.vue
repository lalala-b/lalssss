<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:00:14
 * @LastEditTime: 2020-12-17 14:33:40
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="绑定组织"
    :visible="value"
    width="400px"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('input', false)"
  >
    <div class="C-menu-tree" @click="onViewClick">
      <div class="tree-scroll">
        <el-tree
          ref="tree"
          :check-strictly="true"
          :show-checkbox="!hasOnly"
          :expand-on-click-node="false"
          node-key="id"
          :default-checked-keys="checked"
          :default-expanded-keys="checked"
          class="tree"
          :data="treeData"
          :props="defaultNode"
          :highlight-current="true"
        />
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getOrgs, $updateMenu, $bindOrgForRole, $getOrgByRoleId } from '@/api/backend-manage'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    hasOnly: {
      type: Boolean
    },
    noAjax: {
      type: Boolean
    }
  },
  data() {
    return {
      treeData: [],
      expanded: ['AAAAAA'],
      checked: null,
      defaultNode: {
        children: 'children',
        label: 'label'
      },
      currKey: ''
    }
  },
  created() {
    this.getOrgByRoleId()
    this.getOrgs()
    this.onViewClick()
  },
  methods: {
    /**
     * 根据角色roleId获取下面的菜单信息
     */
    async getOrgByRoleId() {
      try {
        const res = await $getOrgByRoleId({
          roleId: this.data.id
        })
        if (res.code === 1) {
          this.checked = res.data.map(t => t.orgId)
        }
      } catch (err) {
        // cons
      }
    },
    /**
     * 保存
     */
    async save() {
      const ref = this.$refs.tree
      const getCheckedNodes = ref.getCheckedNodes()
      const currentNode = ref.getCurrentNode()
      if (this.noAjax) {
        this.$emit('getCurrent', currentNode)
        this.$emit('input', false)
        return
      }

      if (getCheckedNodes.length) {
        try {
          const res = await $bindOrgForRole({
            roleId: this.data.id,
            orgIdList: getCheckedNodes.map(t => t.id)
          })
          if (res.code === 1) {
            this.$message.success(res.message || '操作成功')
            this.$emit('input', false)
          } else {
            this.$message.error(res.message || '网络错误')
          }
        } catch (err) {
          this.$message.error('网络错误')
        }
      } else {
        this.$message.error('请选择菜单')
      }
    },
    async requestStatus(node, data, status) {
      const res = await $updateMenu({
        id: data.id,
        status
      })
      if (res.code === 1) {
        this.$message.success(res.message || '操作成功')
        this.getOrgs()
      } else {
        this.$message.error(res.message || '网络错误')
      }
    },
    onViewClick() {
      if (!this.currKey) {
        return
      }
      this.$emit('setCurr', null)
      this.$refs.tree.setCurrentKey(null)
    },
    /**
     * 转换接口返回组织数据转成插件使用的数据格式
     */
    formatResultToData(list) {
      function recursion(data) {
        for (let i = 0; i < data.length; i++) {
          const t = data[i]
          t.label = t.orgName
          t.children = t.childOrgList
          delete t.childOrgList
          if (t.children) {
            recursion(t.children)
          }
        }
      }
      recursion(list)
    },
    /**
     * 获取菜单列表
     */
    async getOrgs() {
      const re = await $getOrgs()
      if (re.code === 1 && re.data.length) {
        this.formatResultToData(re.data)
        this.treeData = re.data
      }
    }
  }
}
</script>

<style lang="scss">
  .C-menu-tree {
    display: flex;
    background-color: #fff;
    flex-direction: column;
    width: 300px;
    // position: absolute;
    // top: 120px;
    // bottom: 0;
    // left: 20px;
    // right: 20px;
    // padding-bottom: 50px;
    .tree-scroll {
      overflow-y: auto;
    }
    .btns {
      position: absolute;
      background-color: #fff;
      bottom: 0;
      left: 0;
      right: 0;
      box-shadow: 1px -2px 8px #ddd;
      z-index: 2;
    }
    .el-tree {
      padding: 10px 0;
    }
    .el-button--text {
      padding: 2px 4px;
      margin-left: 0;
    }
    .custom-tree-node {
      flex: 1;
      display: flex;
      align-items: center;
      // justify-content: space-between;
      font-size: 14px;
      padding-right: 8px;
      span {
        &:first-child {
          margin-right: 6px;
        }
      }
    }
  }
</style>
