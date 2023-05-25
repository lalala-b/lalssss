<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:00:14
 * @LastEditTime: 2020-10-10 17:45:01
 * @LastEditors: Luoxd
-->
<template>
  <Wrap class="tree-view" @click="onViewClick">
    <el-tree ref="tree" :expand-on-click-node="false" class="tree" node-key="id" :data="data" :props="defaultNode" :default-expand-all="true" :highlight-current="true" @node-click="handleNodeClick" />
    <div class="btns">
      <el-button size="small" type="text" @click.stop.prevent="$emit('open')">添加下级</el-button>
    </div>
  </Wrap>
</template>
<script>
import { $getOrganization } from '@/api'

export default {
  data() {
    return {
      data: [],
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
  // 初始化获取组织结构数据
    this.getOrganization()
    this.onViewClick()
  },
  methods: {
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
          t.children = t.childOrgName
          delete t.childOrgName
          if (t.children) {
            recursion(t.children)
          }
        }
      }
      recursion(list)
    },
    /**
     * 选择部门
     */
    handleNodeClick(data) {
      this.currKey = data.id
      if (data.children) {
        this.expanded = [data.id]
      } else {
        this.checked = [data.id]
      }
      this.$emit('setCurr', data)
    },
    /**
     * 获取组织结构
     */
    async getOrganization() {
      const re = await $getOrganization()
      if (re.code === 1 && re.data.length) {
        this.formatResultToData(re.data)
        this.data = re.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree-view {
    display: flex;
    overflow: hidden;
    position: absolute;
    width: 300px;
    height: 100%;
    background-color: #fff;
    flex-direction: column;
    .tree {
      flex: 1;
      overflow: auto;
    }
    .btns {

      background-color: #fff;
      bottom: 0;
      box-shadow: 1px -2px 8px #ddd;
      z-index: 2;
    }
  }
</style>
