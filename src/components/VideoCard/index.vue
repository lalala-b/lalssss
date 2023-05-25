<template>
  <div class="video-card">
    <el-link
      :href="data.videoIndexUrl"
      type="primary"
      target="_blank"
      :underline="false"
      class="video-card_img"
    >
      <el-image fit="cover" :src="data.videoCoverUrl" />
      <ul class="video-card_img-data">
        <li>
          <svg-icon class="video-card_img-data-icon" icon-class="love" />
          <strong>{{ data.thumbUpCount | toThousandsW0 }}</strong>
        </li>
        <li>
          <svg-icon class="video-card_img-data-icon" icon-class="comment" />
          <strong>{{ data.commentCount | toThousandsW0 }}</strong>
        </li>
        <li>
          <svg-icon class="video-card_img-data-icon" icon-class="share" />
          <strong>{{ data.forwardedCount | toThousandsW0 }}</strong>
        </li>
      </ul>
    </el-link>
    <a
      class="account-info"
      :href="data.userIndexUrl"
      target="_blank"
      :underline="false"
    >
      <el-image class="account-info_head-img" fit="cover" :src="data.avatarUri" />
      <div>
        <p>{{ data.nickName }}</p>
      </div>
    </a>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-card {
    width: 100%;
    border: 1px solid #ccc;
    &_img {
      display: block;
      position: relative;
      &::before {
        content: "";
        display: block;
        width: 100%;
        padding-top: 140%;
      }
      .el-image {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;

        img {
          width: 100%;
          height: 100%;
        }
      }
      &-data {
        position: absolute;
        right: 0px;
        left: 0;
        top: 0;
        padding: 10px 0 0 0;
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        background: rgba(0, 0, 0, .8);
        li {
          display: flex;
          align-items: center;
          color: #fff;
          margin-bottom: 6px;
          font-size: 12px;
        }

        &-icon {
          margin-right: 2px;
          font-size: 12px;
        }
      }
    }
    .account-info {
      display: flex;
      align-items: center;
      height: 60px;
      padding: 0 4px;
      &_head-img {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        margin-right: 10px;
        border-radius: 50%;
      }
      p {
        -webkit-box-orient: vertical;
        -webkit-line-clamp:2;
        overflow: hidden;
        text-overflow: ellipsis;
        max-height: 36px;
        line-height: 18px;
        font-size: 12px;
      }
    }
  }
</style>
