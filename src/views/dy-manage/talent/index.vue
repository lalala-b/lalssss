<template>
  <div class="C-talent">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <!-- <keep-alive> -->
        <component :is="activeName" v-if="activeName === item.name" :query-data="queryData" :xingtu-tag-data="xingtuData" />
        <!-- </keep-alive> -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import increaseFans from './_pages/increase_fans.vue'
import like from './_pages/like.vue'
import potential from './_pages/potential.vue'
import fansAll from './_pages/fans_all.vue'
import { $getBilllboardQueryTime, $getXtHotUserTag } from '@/api/dy-manage'

export default {
  components: {
    increaseFans, like, potential, fansAll
  },
  data() {
    return {
      activeName: 'increaseFans',
      queryData: null,
      increaseFans: [],
      like: [],
      potential: [],
      fansAll: [],
      xingtuData: []
    }
  },
  computed: {
    tabs() {
      const tabs = [
        {
          name: 'increaseFans',
          label: '涨粉榜'
        },
        {
          name: 'like',
          label: '点赞榜'
        },
        {
          name: 'potential',
          label: '潜力榜'
        },
        {
          name: 'fansAll',
          label: '粉丝总榜'
        }
      ]
      // const permissionTabs = tabs.filter(item => this.$permission(item.permissionName))
      return tabs
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
    this.getBilllboardQueryTime()
    this.getXtHotUserTag()
  },
  methods: {
    async getXtHotUserTag() {
      const res = await $getXtHotUserTag({
        listId: '6766936376500813837'
      })
      if (res.code === 1) {
        this.xingtuData = res.data
      }
    },
    async getBilllboardQueryTime() {
      const res = await $getBilllboardQueryTime({})
      if (res.code === 1) {
        this.queryData = res.data
      }
    },

    handleClick(e) {
      const activeName = e.name
      const label = e.label
      this.$router.replace({
        query: {
          activeName,
          tabName: label
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-talent {
    ::v-deep .el-tabs__content {
      overflow: initial;
    }
  }
</style>
