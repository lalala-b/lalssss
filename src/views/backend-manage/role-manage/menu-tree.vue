<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:00:14
 * @LastEditTime: 2020-12-24 10:45:19
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="绑定菜单"
    :visible="value"
    width="400px"
    @close="$emit('input', false)"
  >
    <div class="C-menu-tree" @click="onViewClick">
      <div class="tree-scroll">
        <el-tree ref="tree" show-checkbox :expand-on-click-node="false" node-key="id" :default-checked-keys="checked" class="tree" :data="treeData" :props="defaultNode" :highlight-current="true" :check-strictly="true" :default-expanded-keys="checked">
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </el-tree>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getMenuTree, $updateMenu, $bindMenuForRole, $getMenuByRoleId } from '@/api/backend-manage'

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
    this.getMenuByRoleId()
    this.getMenuTree()
    this.onViewClick()
  },
  methods: {
    /**
     * 根据角色roleId获取下面的菜单信息
     */
    async getMenuByRoleId() {
      try {
        const res = await $getMenuByRoleId({
          roleId: this.data.id
        })
        if (res.code === 1) {
          this.checked = res.data.map(t => t.menuId)
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
      if (getCheckedNodes.length) {
        try {
          const res = await $bindMenuForRole({
            roleId: this.data.id,
            menuIdList: getCheckedNodes.map(t => t.id)
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
        this.getMenuTree()
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
          t.label = t.name
          t.children = t.childMenuList
          delete t.childMenuList
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
    async getMenuTree() {
      const re = await $getMenuTree()
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
