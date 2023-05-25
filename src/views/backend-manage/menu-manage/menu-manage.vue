<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:33:55
 * @LastEditTime: 2020-12-29 15:41:35
 * @LastEditors: Linjie
-->
<template>
  <Wrap class="P-menu-manage">
    <div class="flex">
      <!-- 组织结构树形图 -->
      <tree ref="tree" @setCurr="setDialogCurr" />
      <div class="flex-info">
        <!--  -->
        <div class="search-view">
          <h2>{{ editData ? editData.name : "未选中菜单" }}</h2>
          <mForm ref="formComponent" :inline="true">
            <el-button type="primary" @click="save">修改</el-button>
            <el-button @click="onStartUp">分配角色</el-button>
            <el-button type="success" @click="openDialog">新增子菜单</el-button>
            <el-button type="danger" @click="handleDel">删除</el-button>
          </mForm>
        </div>
        <div class="flex-table">
          <mTab />
        </div>
      </div>
    </div>
    <!-- 添加弹层 -->
    <add
      v-if="addDialog.show"
      v-model="addDialog.show"
      :add-data="addDialog.data"
      @createRoute="handleCreateRoute"
      @updateTree="updateTree"
    />
    <EditRoute
      v-if="showRouteDialog"
      v-model="showRouteDialog"
      :info="routeInfo"
      type="add"
      @close="handleClose"
    />
    <!-- 分配角色 -->
    <startUp v-if="startUpDialog" v-model="startUpDialog" />
  </Wrap>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import tree from './tree.vue'
import add from './add.vue'
import mForm from './form.vue'
import mTab from './tab.vue'
import EditRoute from '../router-manage/_com/EditRoute.vue'
import startUp from './start-up-dialog.vue'
import { $updateMenu, $delMenuItem } from '@/api/backend-manage'
import { $getDataByDictType } from '@/api'
// console.log()
export default {
  components: {
    tree,
    add,
    mForm,
    mTab,
    startUp,
    EditRoute
  },
  data() {
    return {
      roleTableData: [],
      dataTableData: [],
      loading: false,
      startUpDialog: false,
      nowPage: 0,
      addDialog: {
        show: false,
        data: null
      },
      total: 0,
      roleTotal: 0,
      dataTableTotal: 0,
      dictTypes: [],
      info: {},
      showRouteDialog: false,
      routeInfo: {}
    }
  },
  provide() {
    return {
      $dictType: this.dictTypes,
      $info: this.info
    }
  },
  computed: {
    ...mapState('menuManage', ['editData'])
  },
  created() {
    this.getDataByDictType()
  },
  methods: {
    ...mapActions('menuManage', ['setEditData', 'removeEditData']),
    handleDel() {
      if (!this.editData) {
        this.$message.warning('请选中菜单')
        return
      }
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        $delMenuItem({ menuId: this.editData.id })
          .then((res) => {
            if (res.code === 1) {
              this.$message.success('删除成功')
              this.updateTree()
              this.removeEditData()
            } else {
              this.$message.success(res.message)
            }
          })
          .catch((err) => {
            if (err.__CANCEL__) return
            this.$message.error(err.message)
          })
      })
    },
    async getDataByDictType() {
      const res = await $getDataByDictType({
        dictTypes: ['sys_datascope_value_type']
      })
      if (res.code === 1 && res.data) {
        this.dictTypes.push(...res.data.sys_datascope_value_type)
      }
    },
    onStartUp() {
      if (!this.editData) {
        this.$message.warning('请选中菜单')
        return
      }
      this.startUpDialog = true
    },
    /**
     * 保存
     */
    async save() {
      if (!this.editData) {
        this.$message.warning('请选中菜单')
        return
      }
      try {
        await this.$refs.formComponent.validate()
      } catch (e) {
        return
      }
      const params = this.$refs.formComponent.form
      params.parentFlag = +params.parentFlag
      params.menuBelong = +params.menuBelong
      params.datascopeFlag = params.datascopeFlag ? 1 : 0
      params.hidden = +params.hidden
      params.isMoveted = +params.isMoveted
      const res = await $updateMenu(params)
      if (res.code === 1) {
        this.$message.success(res.message)
        this.updateTree()
      } else {
        this.$message.error(res.message || '网络错误')
      }
    },
    openDialog(data) {
      if (!this.editData.id) {
        this.$message.warning('请选中菜单')
        return
      }
      this.addDialog.data = this.editData
      this.addDialog.show = true
    },
    /**
     * 设置选择的部门
     */
    setDialogCurr(data) {
      if (!data) {
        this.addConfig = null
        return
      }
      this.setEditData(data)
      this.$set(this.info, 'data', data)
      this.addConfig = {
        pid: data.id,
        optType: 'add'
      }
    },
    /**
     * 更新树形图
     */
    updateTree() {
      this.$refs.tree.getMenuTree()
    },
    handleCreateRoute(routeInfo) {
      this.routeInfo = routeInfo
      this.showRouteDialog = true
    },
    handleClose() {
      this.showRouteDialog = false
    }
  }
}
</script>
<style lang="scss" scoped>
.P-menu-manage {
  .flex-info {
    flex: 1;
    margin-left: 20px;
  }
}
.search-view {
  ::v-deep {
    .el-input {
      width: 260px !important;
    }
  }
}
</style>
