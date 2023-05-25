<template>
  <div class="flex">
    <ul
      v-if="videoList && videoList.length > 0"
      class="flex flex-wrap"
    >
      <li
        v-for="item in videoList"
        :key="item.url"
        class="m-r-10 video-list-item"
        :class="{'compact': compact}"
      >
        <el-popover
          placement="bottom"
          width="400"
          trigger="hover"
        >
          <template v-if="showPicture">
            <div class="view-image-wrapper">
              <img class="view-image" :src="item[config.coverImg]">
            </div>
          </template>
          <template v-else>
            <VideoInfo :info="item" :options="options" :show-video-img="showVideoImg">
              <slot slot="rec" name="rec" :node="item" />
              <slot slot="link" name="link" :node="item" />
              <slot :node="item" />
            </VideoInfo>
          </template>
          <a slot="reference" :href="item[config.url]" target="_blank">
            <div class="info-coverImg">
              <div v-if="item.isDeleted === 1" class="img-layer flex flex-justify-center" @click.prevent>已删除</div>
              <el-image class="info-coverImg" fit="cover" :src="item[config.coverImg]">
                <img slot="error" class="image-slot" :src="defaultImg">
              </el-image>
            </div>
          </a>
        </el-popover>
      </li>
    </ul>
    <p v-else>暂无视频信息</p>
    <slot name="more" />
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import { VideoInfo } from 'components'

import defaultImg from '../VideoInfo//img/default_video.png'
const DEFAULT_CONFIG = {
  url: 'url',
  coverImg: 'coverImg',
  title: 'title',
  duration: 'duration',
  addTime: 'addTime'
}

export default defineComponent({
  props: {
    listData: {
      type: Array,
      default: () => []
    },
    options: {},
    showVideoCount: {
      type: Number,
      default: 3
    },
    showVideoImg: {
      type: Boolean,
      default: true
    },
    showPicture: {
      type: Boolean,
      default: false
    },
    compact: Boolean
  },
  components: { VideoInfo },
  setup(props, { emit }) {
    const config = computed(() => Object.assign({}, DEFAULT_CONFIG, props.options))
    const videoList = computed({
      get: () => (props.listData || []).slice(0, props.showVideoCount)
    })
    return {
      defaultImg,
      config,
      videoList
    }
  }
})
</script>
<style lang="scss" scoped>
.info-coverImg {
  position: relative;
  width: 50px;
  height: 70px;
  img {
    width: 100%;
    height: 100%;
  }
}
.more-video{
  display: flex;
  align-items: center;
  color: $--color-primary;
  font-size: 12px;
  cursor: pointer;
}
.video-list-item.compact {
  .el-image {
    border: 2px solid rgb(248, 248, 248);
    border-radius: 2px;
  }
  .image-slot {
    background: #fff;
  }
  &:nth-child(1) {
    &:hover {
      z-index: 10;
    }
  }
   &:nth-child(2) {
    transform: translate(-30px);
     &:hover {
      transform: translate(-30px);
      z-index: 10;
    }
  }
  &:nth-child(3) {
    transform: translate(-60px);
     &:hover {
      transform: translate(-60px);
      z-index: 10;
    }
  }
  &:nth-child(4) {
    transform: translate(-90px);
     &:hover {
      transform: translate(-90px);
      z-index: 10;
    }
  }
}
.view-image-wrapper{
  width: 400px;
  height: auto;
  display: flex;
  justify-content: center;
}
.view-image{
  width: 360px;
  height: auto;
}
.img-layer{
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      font-size: 12px;
      background-color: rgba(216, 212, 212, 0.6);
      color: #fff;
    }
</style>
