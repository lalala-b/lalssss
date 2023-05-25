<template>
  <div>
    <!-- B站花火数据 -->
    <RecentComPerformance :user-info="userInfo" :account-data-loading="accountDataLoading" />

    <!-- 最新10个视频趋势 -->
    <VideoTrends :recent-video-trend-data="recentVideoTrendData" :video-trend-loading="videoTrendLoading" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import RecentComPerformance from './recentComPerformance.vue'
import VideoTrends from './videoTrends.vue'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return () => ({})
      }
    },
     recentVideoTrendData: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    videoTrendLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    RecentComPerformance,
    VideoTrends
  },

  setup(props, { emit }) {
    return {
      // ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
