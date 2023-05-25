<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-20 15:38:01
 * @LastEditTime: 2020-11-02 15:27:37
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="选择菜单"
    :visible="value"
    width="400px"
    @close="$emit('input', false)"
  >
    <div>
      <el-tree ref="tree" :data="data" show-checkbox node-key="id" :default-checked-keys="checked" :default-expanded-keys="expanded" :highlight-current="true" />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getMenuTree } from '@/api/backend-manage'

export default {
  name: 'OrganizeSelect',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    selectedIds: {
      type: Array,
      default() {
        return null
      }
    }
  },
  data() {
    return {
      data: [],
      checked: [],
      expanded: [9],
      organization: null // 已选择的组织
    }
  },
  created() {
    this.getMenuTree()
    if (this.selectedIds) {
      this.checked = this.selectedIds
      this.expanded = this.selectedIds
    }
  },
  methods: {
    /**
     * 保存组织结构
     */
    save() {
      const ref = this.$refs.tree
      const getCheckedNodes = ref.getCheckedNodes()
      if (getCheckedNodes.length) {
        this.$emit('save', getCheckedNodes)
        this.$emit('input', false)
      } else {
        this.$message.error('请选择菜单')
      }
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
     * 获取组织架构
     */
    getMenuTree() {
      $getMenuTree()
        .then(re => {
          if (re.code === 1) {
            this.formatResultToData(re.data)
            // console.log(re.data, '--re.data')
            this.data = re.data
          }
        })
    }
  }
}
</script>
