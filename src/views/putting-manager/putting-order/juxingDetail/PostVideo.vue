<template>
  <Wrap class="m-b-12 juxing-video">
    <h3 class="m-b-20">制作视频</h3>
    <div class="flex">
      <div class="video-cover-box">
        <video
          id="my-video"
          ref="myVideos"
          class="video-js vjs-big-play-centered vjs-default-skin"
          controls
          preload="auto"
          width="196"
          height="350"
          poster=""
          data-setup="{}"
        >
          <source :src="detail.photoUrl" type="video/mp4">
        </video>
      </div>
      <div class="video-info">
        <div class="m-b-16 video-name">{{ detail.taskName }}</div>
        <div class="flex flex-align-center m-b-32">
          <img class="juxing-video-photo" :src="detail.headUrl">
          <span>{{ detail.userName }}</span>
        </div>
        <div class="flex m-b-32">
          <div class="video-indicators">
            <div class="video-indicators-count">
              {{
                detail.playCnt === 0 || detail.playCnt ? detail.playCnt : '-'
              }}
            </div>
            <div class="video-indicators-label">播放量</div>
          </div>
          <div class="video-indicators">
            <div class="video-indicators-count">
              {{
                detail.likeCnt === 0 || detail.likeCnt ? detail.likeCnt : '-'
              }}
            </div>
            <div class="video-indicators-label">点赞数</div>
          </div>
          <div class="video-indicators">
            <div class="video-indicators-count">
              {{
                detail.commentCnt === 0 || detail.commentCnt
                  ? detail.commentCnt
                  : '-'
              }}
            </div>
            <div class="video-indicators-label">评论量</div>
          </div>
          <div class="m-l-16">
            <div class="video-indicators-count">
              {{
                detail.shareCnt === 0 || detail.shareCnt ? detail.shareCnt : '-'
              }}
            </div>
            <div class="video-indicators-label">分量量</div>
          </div>
        </div>
        <div class="m-b-32">发布时间：{{ detail.releaseTime | emptyFill }}</div>
        <!-- <div>异型组件展示时机：{{ detail.releaseTime | emptyFill }}</div> -->
      </div>
    </div>
  </Wrap>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  onMounted,
  reactive
} from '@vue/composition-api'

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    step: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const { $refs, $video } = getCurrentInstance().proxy
    const states = reactive({
      player: null,
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
            //   name: 'timeDivider'
            // },
            // {
            //   name: 'durationDisplay'
            // },
            {
              name: 'volumePanel', // 音量调整方式横线条变为竖线条
              inline: false
            },
            {
              name: 'pictureInPictureToggle' // 画中画播放模式
            },
            {
              name: 'fullscreenToggle'
            }
          ]
        }
      }
    })
    // 播放参数
    onMounted(() => {
      states.player = $video(
        $refs.myVideos,
        states.videoOptions,
        function onPlayerReady() {
          console.log('onPlayerReady', this)
        }
      )
    })
    // const { $message } = getCurrentInstance().proxy
    return {}
  }
})
</script>
<style lang="scss" scoped>
.juxing-video {
  font-size: 14px;
  .video-info {
    color: #888;
  }
  .video-cover-play {
    position: absolute;
    z-index: 3;
    left: 50%;
    font-size: 40px;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #cccaca;
  }
  .video-name {
    color: #000;
  }
  .video-indicators-label {
    text-align: center;
  }
  .video-indicators-count {
    color: #000;
    font-size: 24px;
    font-weight: 600;
  }
  .video-cover-img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
  }
  &-photo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 16px;
  }
  .video-indicators {
    text-align: left;
    padding-right: 16px;
    border-right: 1px solid #f3f3f3;
    margin-left: 16px;
  }
  .video-indicators:first-child {
    margin-left: 0px !important;
  }
  #my-video {
    width: 196px;
    height: 100%;
    border-radius: 8px;
  }
}
</style>
<style lang="scss" >
.juxing-video {
  .video-cover-box {
    position: relative;
    width: 196px;
    height: 350px;
    border-radius: 4px;
    margin-right: 32px;
    .video-js video{
    width: 100% !important;
    height: 100% !important;
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
    border-radius: 8px;
  }
  .vjs-control-bar {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  }

}
</style>

