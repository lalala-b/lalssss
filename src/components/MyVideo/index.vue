<template>
  <div class="video-cover-box">
    <video
      id="my-video"
      ref="myVideos"
      class="video-js vjs-big-play-centered vjs-default-skin"
      controls
      preload="auto"
      width="196"
      height="350"
      :poster="coverUrl"
      data-setup="{}"
    >
      <source :src="videoUrl" type="video/mp4">
    </video>
  </div>
</template>
<script>
import {
  defineComponent,
  toRefs,
  onMounted,
  reactive,
  getCurrentInstance
} from '@vue/composition-api'
import { getVideoBase64 } from '@/utils/index'
export default defineComponent({
  props: {
    videoUrl: {
      type: String,
      default: ''
    },
    coverUrl: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { $refs, $video } = getCurrentInstance().proxy
    // console.info('-   ----props.videoImg', props.videoImg)
    const states = reactive({
      player: null,
      videoBg: '',
      videoOptions: {
        controls: true,
        controlBar: {
          // 自定义按钮的位置
          children: [
            {
              name: 'playToggle'
            },
            {
              name: 'progressControl'
            },
            {
              name: 'currentTimeDisplay'
            },
            // {
            //   name: 'volumePanel', // 音量调整方式横线条变为竖线条
            //   inline: false
            // },
            // {
            //   name: 'pictureInPictureToggle' // 画中画播放模式
            // },
            {
              name: 'fullscreenToggle'
            }
          ]
        }
      },
      flag: false
    })
    // 获取poster封面
    // const getPhoto = () => {
    //   getVideoBase64(props.videoUrl, 196, 350).then((res) => {
    //     states.videoBg = res
    //     // 播放参数

    //   })
    // }
    onMounted(() => {
      setTimeout(() => {
        states.player = $video(
          $refs.myVideos,
          states.videoOptions,
          function onPlayerReady() {
            console.log('onPlayerReady', this)
          }
        )
      }, 200)
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>
<style lang="scss">
.video-cover-box {
  position: relative;
  width: 196px;
  height: 350px;
  border-radius: 4px;
  margin-right: 32px;
  .video-js {
    border-radius: 8px !important;
  }
  .video-js .vjs-big-play-button {
    width: 1.8em;
    height: 1.8em;
    border-radius: 50%;
    margin-left: -0.98em;
  }
  .vjs-poster {
    border-radius: 8px;
  }
  .video-js .vjs-tech {
    // object-fit: cover;
    border-radius: 8px;
  }
  .vjs-control-bar {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
</style>

