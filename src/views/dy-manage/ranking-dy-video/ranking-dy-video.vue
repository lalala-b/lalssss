<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-15 18:21:15
 * @LastEditTime: 2020-12-30 17:22:20
 * @LastEditors: Linjie
-->
<template>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
      <keep-alive>
        <component
          :is="`ranking`"
          v-if="activeName === item.name"
          :id="item.listId"
        />
      </keep-alive>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import Ranking from './@pages/ranking'

export default {
  components: {
    Ranking
  },
  data() {
    return {
      activeName: 'flow',
      tabs: [
        {
          name: 'flow',
          label: '流量排行榜',
          listId: 10001
        },
        {
          name: 'thumb',
          label: '点赞量排行榜',
          listId: 10002
        },
        {
          name: 'comment',
          label: '评论量排行榜',
          listId: 10003
        },
        {
          name: 'forwarded',
          label: '转发量排行榜',
          listId: 10004
        }
      ]
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
    handleClick(e) {
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
<style lang="scss">
  .cover-img {
    display: block;
    width: 80px;
    height: 120px;
    object-fit: contain;
  }
  .account-item {
    display: flex;
    align-items: center;
    padding: 0 20px;
    img {
      flex-shrink: 0;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      margin-right: 8px;
    }
  }
  .el-tabs__content {
    overflow: visible;
  }
</style>
