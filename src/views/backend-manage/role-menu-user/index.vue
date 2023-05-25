<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-10-12 14:05:55
 * @LastEditors: Linjie
-->
<template>
  <div
    ref="wrap"
    class="wrap table-view"
  >
    <el-table
      v-if="tabShow"
      v-scrollbar
      border
      default-expand-all
      :height="height"
      :data="tableData"
      :tree-props="{children: 'childMenuList', hasChildren: 'hasChildren'}"
      row-key="id"
    >
      <el-table-column prop="name" label="菜单" width="220" fixed="left" align="left" />
      <el-table-column
        v-for="item in roleList"
        :key="item.id"
        :label="item.name"
        :role-id="item.id"
      >
        <template slot="header">
          <el-link @click="hanleLookUser(item)">{{ item.name }}</el-link>
        </template>
        <template slot-scope="{ row }">
          <div>
            <i :class="checkRole(item, row) ? 'el-icon-circle-check has-role' : 'el-icon-circle-close no-role'" />
          </div>
        </template>
      </el-table-column>

    </el-table>
    <RoleUser v-model="roleUserShow" :role-id="roleId" />
  </div>
</template>

<script>
import { $getMenuTree, $getRoleList } from '@/api/backend-manage'
import RoleUser from '@/views/backend-manage/role-manage/role-user.vue'
export default {
  name: 'Demo',
  components: {
    RoleUser
  },
  data() {
    return {
      height: 800,
      tabShow: false,
      tableData: [],
      roleUserShow: false,
      roleId: '',
      roleList: []
    }
  },
  async created() {
    await $getMenuTree().then(res => {
      this.tableData = res.data[0].childMenuList
    })
    await $getRoleList({ size: 9999 }).then(res => {
      this.roleList = res.data
    })

    this.$nextTick(() => {
      console.log(this.$el.clientHeight)
      this.height = this.$el.clientHeight - 40
      this.tabShow = true
    }, 0)
  },
  methods: {
    checkRole(item, row) {
      return item.menuBOList.some(item => item.menuId === row.id)
    },
    hanleLookUser(item) {
      console.log(item)
      this.roleUserShow = true
      this.roleId = item.id
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
  .wrap {
    height: 100%;
  }
  .has-role {
    color: #67C23A;
  }
  .no-role {
    color: #F56C6C;
  }
</style>
