<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:00:14
 * @LastEditTime: 2020-11-26 18:10:58
 * @LastEditors: Linjie
-->
<template>
  <div class="C-menu-tree" @click="onViewClick">
    <el-button v-if="user.userInfo.environmentFlag==='test'" class="back-menu" type="primary" @click="bakMenuAuthTable">一键备份角色、菜单、权限</el-button>
    <el-button class="back-menu" type="primary" @click="handleSyncMenuToTest">一键同步线上菜单角色到测试</el-button>
    <el-radio-group v-model="menuType" class="m-b-12">
      <el-radio-button label="">全部</el-radio-button>
      <el-radio-button label="1">海盗</el-radio-button>
      <el-radio-button label="2">乾派</el-radio-button>
      <el-radio-button label="0">公共</el-radio-button>
    </el-radio-group>
    <el-input
      v-model="filterText"
      class="c-filter"
      placeholder="输入关键字进行过滤"
    />
    <div v-loading="treeLoading" class="tree-scroll">
      <el-tree
        ref="tree"
        :expand-on-click-node="false"
        node-key="id"
        :default-expanded-keys="defaultExpandedKeys"
        class="tree"
        :data="treeData"
        :props="defaultNode"
        :highlight-current="true"
        :filter-node-method="filterNode"
        draggable
        :allow-drop="allowDrop"
        @node-click="handleNodeClick"
        @node-drop="handleDrop"
        @node-expand="handleExpand"
        @node-collapse="handleCollapse"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span><i :class="data.type===1?'iconfont iconyingyongguanli':data.type===2?'iconfont iconanniu':'iconfont iconxiangqing'" />{{ node.label }}</span>
          <span>
            <el-tooltip
              :open-delay="200"
              effect="dark"
              :content="data.status ? '启用' : '禁用'"
              placement="bottom"
            >
              <el-switch
                v-model="data.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="(val) => requestStatus(node, data, val)"
              />
            </el-tooltip>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { $getMenuTree, $updateMenu, $updateMenuPid } from '@/api/backend-manage'
import { $bakMenuAuthTable, $syncMenuToTest } from '@/api/backend-manage'
import { mapGetters } from 'vuex'
import { deepClone } from '@/utils'
export default {
  data() {
    return {
      data: [],
      expanded: ['AAAAAA'],
      defaultExpandedKeys: [9],
      checked: null,
      defaultNode: {
        children: 'children',
        label: 'label'
      },
      currKey: '',
      filterText: '',
      menuType: '',
      filterList: [],
      treeData: [],
      treeLoading: false
    }
  },
  computed: {
     ...mapGetters(['user'])
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    menuType(val) {
      this.getMenuTreeTypeList(val)
    }
  },
  created() {
    // 初始化获取组织结构数据
    this.getMenuTree()
    this.onViewClick()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.label.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1
    },
    async requestStatus(node, data, status) {
      try {
        const res = await $updateMenu({
          id: data.id,
          status: status ? 1 : 0
        })
        if (res.code === 1) {
          this.$message.success(res.message || '操作成功')
          // this.getMenuTree()
        } else {
          data.status = false
          this.$message.error(res.message || '网络错误')
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
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
          t.status = t.status === 1
          delete t.childMenuList
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
     * 获取菜单列表
     */
    async getMenuTree(menuType = '') {
      this.treeLoading = true
      const params = menuType !== '' ? { menuBelong: menuType } : {}
      const re = await $getMenuTree(params)
      this.treeLoading = false
      if (re.code === 1) {
        const data = re.data || []
        this.formatResultToData(data)
        this.data = data
        this.treeData = data
      }
    },
    handleDrop(draggingNode, dropNode, dropType, ev) {
      // (1)组件不能插入菜单
      // (2)按钮不能插入菜单和组件
      if (+dropNode.data.type === 3 && +draggingNode.data.type === 1) {
        this.$message.error('组件中禁止插入菜单')
        this.getMenuTree()
        return
      }
      if (+dropNode.data.type === 2) {
        this.$message.error('按钮禁止插入菜单、组件、按钮')
        this.getMenuTree()
        return
      }
      const id = draggingNode.data.id
      let pid
      let sortNum
      if (dropType === 'inner') {
        pid = dropNode.data.id
        sortNum = dropNode.childNodes.length
      } else {
        pid = dropNode.parent.data.id
        if (dropType === 'before') {
          sortNum = dropNode.data.sortNum
        } else if (dropType === 'after') {
          sortNum = dropNode.data.sortNum + 1
        }
      }
      let innerTxt = ''
      switch (dropType) {
        case 'inner':
          innerTxt = ` “${draggingNode.label}” 插入 “${dropNode.label}”`
          break
        case 'before':
          innerTxt = ` “${draggingNode.label}” 移动至 “${dropNode.label}” 之前`
          break
        case 'after':
          innerTxt = ` “${draggingNode.label}” 移至 “${dropNode.label}” 之后`
          break
      }
      this.$confirm(
        `是否移动菜单${innerTxt}，移动后将影响用户查看菜单的位置？`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          $updateMenuPid({ id, pid, sortNum }).then((res) => {
            if (res.code === 1) {
              this.getMenuTree()
              this.$message({
                type: 'success',
                message: '移动成功!'
              })
            }
          })
        })
        .catch(() => {
          this.getMenuTree()
        })
    },
    getMenuTreeTypeList(menuType) {
      this.getMenuTree(menuType)
    },
    allowDrop(draggingNode, dropNode, type) {
      // if (dropNode.isLeaf === false) {
      //   return type === 'inner'
      // } else {
      //   return true
      // }
      return true
    },
    handleExpand(node) {
      this.defaultExpandedKeys.push(node.id)
    },
    handleCollapse(node) {
      this.defaultExpandedKeys.splice(this.defaultExpandedKeys.findIndex(item => item === node.id), 1)
    },
    bakMenuAuthTable() {
      try {
        $bakMenuAuthTable().then(res => {
          if (res.code === 1) {
             this.$message.success(res.message)
          }
        })
      } catch (error) {
        if (error.__CANCEL__) {
          return
        }
        this.$message.error(error.message)
      }
    },
    handleSyncMenuToTest() {
      try {
        $syncMenuToTest().then(res => {
          if (res.code === 1) {
            this.$message.success(res.message)
            this.getMenuTree()
          }
        })
      } catch (error) {
        if (error.__CANCEL__) {
          return
        }
        this.$message.error(error.message)
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
  .c-filter{
    width: 220px !important;
  }
  .back-menu{
    width: 220px;
    margin-bottom: 16px;
    margin-left: 0px;
  }
}
</style>
