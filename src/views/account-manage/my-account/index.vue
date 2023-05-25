<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name">
        <keep-alive>
          <component :is="activeName" v-if="activeName===item.name" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCurrentInstance, ref } from '@vue/composition-api'
import VideoAccount from './componnets/VideoAccount.vue'
import ArticleGroupAccount from './componnets/ArticleGroupAccount.vue'

export default {
  components: {
    VideoAccount,
    ArticleGroupAccount
  },
  setup(props) {
    const { $permission } = getCurrentInstance().proxy
    const tabs = [
      {
        name: 'VideoAccount',
        title: '视频账号',
        permissionName: 'video-account'
      },
      {
        name: 'ArticleGroupAccount',
        title: '文章团账号',
        permissionName: 'article-group-account'
      }
    ].filter(_ => $permission(_.permissionName))
    const activeName = ref(tabs[0].name)
    return {
      tabs,
      activeName
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .table-view .el-link {
    margin-right: 0px;
  }
}
</style>
