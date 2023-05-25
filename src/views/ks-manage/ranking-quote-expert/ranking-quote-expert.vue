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
          label: '涨粉表现榜',
          listId: '6'
        },
        {
          name: 'fans',
          label: '传播表现榜',
          listId: '3'
        },
        // {
        //   name: 'benefit',
        //   label: '性价比榜',
        //   listId: '6766936436621967367'
        // },
        {
          name: 'like',
          label: '转化表现榜',
          listId: '4'
        },
        {
          name: 'choiceness',
          label: '性价比表现榜',
          listId: '5'
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
        url: '/ks-manage/expert',
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
