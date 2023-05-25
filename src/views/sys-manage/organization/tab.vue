<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 11:52:13
 * @LastEditTime: 2020-10-10 17:43:15
 * @LastEditors: Luoxd
-->
<template>
  <div class="table-view">
    <el-tabs v-model="activeName" @tab-click="handleAct">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
        <keep-alive>
          <component :is="`v-${activeName}`" v-if="activeName === item.name" :ref="item.name" :data="data" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import vUser from './user-table.vue'
import vRole from './role-table.vue'

export default {
  components: {
    vUser,
    vRole
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
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
        title: '用户',
        name: 'user',
        permissionName: ''
      },
      {
        title: '角色',
        name: 'role',
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
