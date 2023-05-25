<template>
  <div
    class="video-info"
    :attrs="$attrs"
  >
    <a
      v-if="showVideoImg"
      class="video-info-coverImg flex flex-align-center"
      :href="info[config.url] || 'javascript:void(0);'"
      :target="info[config.url] ? '_blank' : ''"
      :underline="false"
      @click="handleUrlClick"
    >
      <div v-if="info.isDeleted === 1" class="img-layer flex flex-justify-center" @click.prevent>已删除</div>
      <el-image v-if="alwaysShowImg || info[config.coverImg]" class="info-coverImg" fit="cover" :src="info[config.coverImg]">
        <img slot="error" class="image-slot" :src="defaultImg">
      </el-image>
    </a>
    <div class="video-info-right">
      <a
        v-if="info.isDeleted === 1"
        href="javascript:void(0);"
        :underline="false"
        class="video-info-right__title"
        :class="{'delect': info.isDeleted === 1, 'line': $slots.rec }"
        @click="handleUrlClick"
      >{{ info.isDeleted === 1 ? '(已删除)' : '' }}{{ info[config.title] }}</a>
      <a
        v-else
        :href="info[config.url] || 'javascript:void(0);'"
        :target="info[config.url] ? '_blank' : ''"
        :underline="false"
        class="video-info-right__title"
        :class="{'line': $slots.rec }"
        @click="handleUrlClick"
      >{{ info[config.title] }}</a>
      <slot name="rec" />
      <slot name="link" />
      <p v-if="showVideoTime">
        <span v-if="info[config.duration]">视频时长：{{ Math.round(info[config.duration]) }}s</span>
        <span v-if="info[config.addTime]">发布时间：{{ info[config.addTime] }}</span>
      </p>
      <slot />
      <!-- <div class="account-info">
        <el-image class="account-avt" :src="info.avatarUri" />
        <a :href="info.accountLoginUrl" target="_blank">{{ info.nickName }}</a>
        <el-tooltip v-if="info.platId" class="account-icon-wrap" effect="dark" :content="info.platName" placement="top">
          <el-image fit="contain" class="plat-img" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${info.platId}.png`" />
        </el-tooltip>
      </div> -->
    </div>
  </div>
</template>
<script>
import defaultImg from './img/default_video.png'
const DEFAULT_CONFIG = {
  url: 'url',
  coverImg: 'coverImg',
  title: 'title',
  duration: 'duration',
  addTime: 'addTime'
}
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    // 是否一直显示视频封面
    alwaysShowImg: {
      type: Boolean,
      default: true
    },
    showVideoImg: {
      type: Boolean,
      default: true
    },
    showVideoTime: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      defaultImg
    }
  },
  computed: {
    config() {
      return Object.assign({}, DEFAULT_CONFIG, this.options)
    },
    img() {
      if (this.info[this.config.title]) {
        return this.info[this.config.coverImg] || defaultImg
      }
      return ''
    }
  },
  methods: {
    handleUrlClick() {
      // this.$emit('urlClick', this.info)
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/styles/element-variables.scss';
  .video-info {
    display: flex;
    &-coverImg {
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
      width: 48px;
      height: 62px;
      margin-right: 8px;
      border-radius: 4px;
      .image-slot {
        width: 48px;
        height: 62px;
      }
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
    &-right {
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      &__title {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        color: $--color-text-primary;
        line-height: 20px;
        font-size: 14px;
        &.delect {
          color: $--color-text-secondary;
        }
        &:hover {
          color: $--color-primary;
        }
        &.line {
          -webkit-line-clamp: 1;
        }
          // width: 610px;
      }
      p {
        font-size: 12px;
        line-height: 16px;
        color: $--color-text-secondary;
        > span:nth-child(n + 2) {
          margin-left: 16px;
        }
      }
    }
  }
</style>
