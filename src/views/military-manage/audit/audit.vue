<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-10 17:57:49
 * @LastEditTime: 2020-09-14 15:38:22
 * @LastEditors: Linjie
-->
<template>
  <el-tabs v-model="activeName" @tab-click="handleTabClick">
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
      <keep-alive>
        <component :is="`v-${activeName}`" v-if="activeName === item.name" />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import VInput from './@pages/audit-input'
import VMark from './@pages/audit-mark'
import VDelivery from './@pages/audit-delivery'
export default {
  components: {
    VInput,
    VMark,
    VDelivery
  },
  data() {
    return {
      tabs: [
        {
          name: 'mark',
          label: '系统采集视频'
        },
        {
          name: 'delivery',
          label: '投放视频'
        },
        {
          name: 'input',
          label: '手工录入视频'
        }
      ],
      activeName: 'mark'
    }
  },
  created() {
    this.activeName = this.$route.query.activeName || this.tabs[0].name
    const tabName = this.$route.query.tabName || this.tabs[0].label
    this.$router.replace({
      query: {
        activeName: this.activeName,
        tabName
      }
    })
  },
  methods: {
    handleTabClick(e) {
      const activeName = e.name
      const tabName = e.label
      this.$router.push({
        query: {
          activeName,
          tabName
        }
      })
    }
  }
}
</script>
