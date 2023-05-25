<template>
  <a :href="data.url" target="_blank" class="C-video">
    <img :src="data.videoCoverUrl" alt="">
    <i class="iconfont iconbofang_circle" />
  </a>

</template>
<script>
export default {
  inject: ['$response'],
  computed: {
    data() {
      return this.$response.detailData
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-video {
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    img {
      width: 120px;
      height: 162px;
      display: block;
      object-fit: contain;
    }
    &:hover {
      .iconfont {
        display: block;
      }
    }
    .iconfont {
      display: none;
      position: absolute;
      top: 50%;
      left: 50%;
      border-radius: 50%;
      font-size: 32px;
      color: #fff;
      transform: translate(-50%, -50%);
      // background: rgba(0,0,0,.38);
    }
  }
</style>
