<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-15 18:21:15
 * @LastEditTime: 2020-12-30 17:25:02
 * @LastEditors: Linjie
-->
<template>
  <el-tabs
    v-model="activeName"
    type="card"
    @tab-click="handleClick"
  >
    <el-tab-pane
      v-for="item in tabs"
      :key="item.name"
      :label="item.label"
      :name="item.name"
    >
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
      activeName: 'expert',
      tabs: [
        {
          name: 'expert',
          label: '达人榜',
          listId: '6766936376500813837'
        },
        {
          name: 'fans',
          label: '涨粉榜',
          listId: '6720184315054915588'
        },
        // {
        //   name: 'benefit',
        //   label: '性价比榜',
        //   listId: '6766936436621967367'
        // },
        {
          name: 'like',
          label: '种草榜',
          listId: '6758055829141717005'
        },
        {
          name: 'choiceness',
          label: '精选潜力榜',
          listId: '6773632101414600718'
        },
        {
          name: 'diffuse',
          label: '传播指数榜',
          listId: '6772128960131104776'
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
        url: '/dy-manage/expert',
        query: {
          activeName,
          tabName
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    el-tabs__header {
      margin-bottom: 0;
    }

    .el-tabs__content {
      overflow: visible;
    }
  }
</style>
