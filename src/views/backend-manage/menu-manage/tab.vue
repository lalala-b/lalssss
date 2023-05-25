<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:13
 * @LastEditTime: 2020-12-23 14:34:56
 * @LastEditors: Linjie
-->
<template>
  <div class="table-view">
    <el-tabs v-model="activeName" @tab-click="handleAct">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
        <keep-alive>
          <component :is="`v-${activeName}`" v-if="activeName === item.name" :ref="item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import vData from './data-table.vue'
import vRole from './role-table.vue'

export default {
  components: {
    vData,
    vRole
  },
  data() {
    return {
      tabs: [],
      activeName: 'user'
    }
  },
  created() {
    const tabs = [
      {
        title: '角色',
        name: 'role',
        permissionName: ''
      },
      {
        title: '数据域',
        name: 'data',
        permissionName: ''
      }
    ]
    this.tabs = tabs.filter((item) => (this.$permission(item.permissionName)))
    this.activeName = this.$route.query.activeName || this.tabs[0].name
  },
  methods: {
    /**
     * 类型切换响应函数
     * @param  {String} name 类型名称
     */
    handleAct(e) {
      const activeName = e.name
      this.activeName = activeName
      this.$router.push({
        url: '/bussiness-manage/bill-manage',
        query: {
          activeName
        }
      })
    }
  }
}
</script>
