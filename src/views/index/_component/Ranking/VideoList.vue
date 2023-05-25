<template>
  <Wrap v-loading="loading" class="ranking-wrap">
    <Head
      class="ranking-head"
      :title="title"
      tip="昨日所有抖音+快手自营账号中，视频播放量前6的视频"
      @click="$emit('click')"
    />
    <!-- <template v-if="hasPermission"> -->
    <ul v-if="list && list.length" class="video">
      <li v-for="(item, index) in list" :key="item.id">
        <VideoItem :item="item" :index="index" />
      </li>
    </ul>
    <p v-else class="no-data">{{ loading ? '加载中...' : '暂无数据' }}</p>
    <!-- </template> -->
    <!-- <WithoutPermission v-else /> -->
  </Wrap>
</template>
<script>
import Head from '../_com/Head'
import VideoItem from '../_com/VideoItem'
// import WithoutPermission from 'components'
// import { checkMenuPermission } from '@/permission/index'
export default {
  components: {
    Head,
    VideoItem
    // WithoutPermission
  },
  props: {
    title: {
      default: '',
      type: String
    },
    list: {
      type: Array,
      default() {
        return []
      }
    },
    loading: Boolean
  },
  computed: {
    // hasPermission() {
    //   return checkMenuPermission('pirate_flow')
    // }
  }
}
</script>
<style lang="scss" scoped>
.ranking-wrap {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
  .ranking-head {
    height: 64px;
  }
}
.video {
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: space-between;
  padding-bottom: 23px;
  min-height: 380px;
  height: 0;
  > li {
    box-sizing: border-box;
    width: 50%;
  }
  > li:nth-child(-n + 3) {
    padding-right: 20px;
  }
  > li:nth-child(n + 4) {
    padding-left: 20px;
  }
}
</style>
