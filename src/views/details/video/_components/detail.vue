<template>
  <Wrap class="C-data-video">
    <h3>
      视频信息
    </h3>
    <!-- 账号数据 -->
    <Video />
  </Wrap>
</template>
<script>
import Video from './video-data.vue'

export default {
  components: {
    Video
  }
}
</script>
<style lang="scss" scoped>
  .C-data-video {
    position: relative;
    margin-top: 16px;
    .account {
      display: inline-block;
      // width: 200px;
    }
    .report {
      margin-top: 15px;
    }
  }
</style>
