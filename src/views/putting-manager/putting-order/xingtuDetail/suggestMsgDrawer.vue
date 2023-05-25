<template>
  <el-drawer
    :visible.sync="showDrawer"
    direction="rtl"
    :before-close="handleClose"
  >
    <div slot="title">
      <h3>查看视频</h3>
      <div class="versionMsg">
        <div class="item">
          <span>版本{{ videoSuggestMsg.resourceVersion }}</span>
          <span>{{ videoSuggestMsg.createTime ? timestampToTime(videoSuggestMsg.createTime * 1000) : '--' }}</span>
        </div>

        <div class="item">
          <span>ID</span>
          <span>{{ videoSuggestMsg.itemId || '--' }}</span>
        </div>
      </div>
    </div>

    <div class="suggestItem">
      <h3>审核结果</h3>
      <div v-if="contentStatus !== undefined" class="item">
        <span> <i :class="!+contentStatus ? 'el-icon-error' : +contentStatus === 99 ? 'el-icon-info' : 'el-icon-success'" /> 内容审核 </span>
        <div>
          <p v-if="!+contentStatus" class="redFront">内容审核未通过，达人需要修改作品</p>
          <p v-else-if="+contentStatus === 99">内容审核中</p>
          <p v-else>内容审核已通过，可以发布作品至抖音</p>
          <div v-if="!+contentStatus" class="rejectWrap">
            <p>拒绝理由：</p>
            <div v-for="(item,index) in videoSuggestMsg.auditdetailList" :key="item.id">
              <p>{{ index + 1 }}. {{ item.auditSuggest }}</p>
              <div class="timePointWrap">
                <p> <i class="dot" /> {{ item.banTime }}</p>
                <p v-html="formatHtml(item.banPoint || '')" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="searchStatus !== undefined" class="item">
        <span> <i :class="!+searchStatus ? 'el-icon-error' : +searchStatus === 99 ? 'el-icon-info' : 'el-icon-success'" /> 搜索词审核 </span>
        <div>
          <p v-if="!+searchStatus" class="redFront">
            搜索词审核未通过，若此时发布视频则搜索词不生效；您可以修改重新提交，或先确认视频、确认后继续修改搜索词，若重新审核通过则仍旧生效
          </p>
          <p v-else-if="+searchStatus === 99">搜索词审核中</p>
          <p v-else>搜索词审核已通过</p>
          <div v-if="!+searchStatus" class="rejectWrap">
            <p>拒绝理由：</p>
            <!-- <div v-for="(item,index) in videoSuggestMsg.auditBanInfo.auditdetailList" :key="item.id">
              <p>{{ index + 1 }}. {{ item.auditSuggest }}</p>
              <div class="timePointWrap">
                <p> <i class="dot" /> {{ item.banTime }}</p>
                <p>{{ item.banPoint }}</p>
              </div>
            </div> -->
            <p>{{ searchStatus ? videoSuggestMsg.auditBanInfo[1].auditBanReason : '' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="suggestItem">
      <h3>风险提示</h3>
      <div class="item">
        {{ videoSuggestMsg.feedback.content || '' }}
      </div>
    </div> -->

    <div class="suggestItem">
      <h3>反馈意见</h3>
      <div class="item">
        <!-- videoSuggestMsg.feedback.content -->
        {{ videoSuggestMsg.feedback.content || '您暂未反馈意见' }}
      </div>
    </div>

    <div class="suggestItem">
      <h3>视频内容</h3>
      <div class="videoContent">
        <p class="text-over-hidden-1" :title="videoSuggestMsg.resourceTitle">{{ videoSuggestMsg.resourceTitle }}</p>
        <p>
          <span>视频时长 {{ handleDuration(videoSuggestMsg.duration) }}</span>
          <a :href="videoSuggestMsg.videoPlayUrl" target="_blank">全屏查看</a>
        </p>

        <div class="video-box">
          <video
            id="my-video"
            ref="myVideo"
            class="video-js vjs-big-play-centered vjs-default-skin"
            preload="auto"
            :poster="videoSuggestMsg.coverUrl"
            data-setup="{}"
          >
            <source
              :src="videoSuggestMsg.videoPlayUrl"
              type="video/mp4"
            >
          </video>
        </div>
      </div>
    </div>
  </el-drawer>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from '@vue/composition-api'
import { timestampToTime } from '@/utils'
import ProgressRightMsg from './progressRightMsg.vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => ([])
    },
    suggestId: {
      type: String,
      default: '0'
    }
  },

  components: {
    ProgressRightMsg
  },

  setup(props, { emit }) {
    const { $refs, $video, $nextTick } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      showDrawer: false,
      player: null,
      // 视频配置
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
      },
      videoSuggestMsg: {
        auditBanInfo: [
          {},
          {}
        ],
        feedback: {
          content: ''
        }
      },
      videoData: [],
      contentStatus: undefined,
      searchStatus: undefined
    })

    watch(() => [props.show, props.suggestId, props.data], (newVal) => {
      const suggestId = newVal[1]
      state.showDrawer = newVal[0]
      state.videoData = newVal[2]

      if (state.showDrawer) {
        // 播放参数
        $nextTick(() => {
          state.player = $video(
            $refs.myVideo,
            state.videoOptions,
            function onPlayerReady() {
              console.log('onPlayerReady', this)
            }
          )
        })
      }

      // 获取对应的视频建议
      if (+suggestId) {
        state.videoSuggestMsg = state.videoData.filter(item => +item.itemId === +suggestId)[0]
        state.videoSuggestMsg.feedback = state.videoSuggestMsg?.feedback ? state.videoSuggestMsg.feedback : {}
        if (state.videoSuggestMsg?.auditBanInfo?.length) {
          // 内容审核和搜索词审核的状态数组长度为1（只有一个状态数据）
          if (state.videoSuggestMsg.auditBanInfo.length === 1) {
            if (state.videoSuggestMsg.auditBanInfo[0].auditType === 'content') { // 内容审核状态
              state.contentStatus = state.videoSuggestMsg.auditBanInfo[0].auditStatus
            } else { // 搜索词审核状态
              state.searchStatus = state.videoSuggestMsg.auditBanInfo[0].auditStatus
            }
          } else {
            state.contentStatus = state.videoSuggestMsg.auditBanInfo.filter(item => item.auditType === 'content')[0].auditStatus
            state.searchStatus = state.videoSuggestMsg.auditBanInfo.filter(item => item.auditType === 'search')[0].auditStatus
          }
        }
      }
    }, {
      immediate: true
    })

    // 处理视频时长
    const handleDuration = (duration = 0) => {
      const handleAddZero = (num) => String(num).length < 2 ? `0${num}` : num

      return `${handleAddZero(parseInt(duration / 3600))}:
              ${handleAddZero(parseInt(duration / 60 % 60))}:
              ${handleAddZero(parseInt(duration % 60))}`
    }

    // 处理内容审核内容
    const formatHtml = (content) => {
      return content.replace(/\/n/g, '<br />')
    }

    const handleClose = () => {
      emit('closeDrawer')
    }

    return {
      ...toRefs(state),
      timestampToTime,
      handleDuration,
      formatHtml,
      handleClose
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-drawer {
    width: 45% !important;
  }
  .el-drawer__header {
    margin-bottom: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid #f0f0f0;

    h3 {
      font-size: 18px;
      color:#000;
    }

    .versionMsg {
      margin-top: 20px;

      .item {
        display: flex;
        margin-bottom: 10px;

        span {
          display: flex;
          align-items: flex-start;

          &:first-child {
            color: rgb(158, 149, 149);
            font-weight: 500;
            width: 12%;
            margin-right: 20px;
          }
        }
      }
    }
  }

  .el-drawer__body {
    padding: 0 24px;
    overflow: auto;
  }

  .line {
    height: 1px;
    background: #f0f0f0;
    margin: 0 24px;
  }

  a {
    color: rgb(68, 68, 231);
  }

  .suggestItem {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 20px;
    margin-top: 24px;

    h3 {
      margin-bottom: 16px;
    }

    .item {
      display: flex;

      i.el-icon-error {
        color: #e3627b;
      }

      i.el-icon-success {
        color: #3edd95;
      }

      i.el-icon-info {
        color: #f7cf7b;
      }

      span {
        // width: 20%;
        flex: 1;
        margin-right: 20px;
      }

      div {
        flex: 4;
        p {
          color: #72767b;
          margin-bottom: 10px;
          display: flex;
          align-items: center;

          .dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #b1a8aa;
            display: inline-block;
            margin-right: 6px;
          }
        }

        .timePointWrap {
          padding-left: 16px;
        }
      }

      .redFront {
        color: #e3627b;
      }

      .rejectWrap {
        p {
          color:#b1a8aa;
        }
      }
    }

    .videoContent {
      p {
        margin-bottom: 10px;

        span {
          margin-right: 20px;
        }
      }

      .video-box {
        position: relative;
        width: 260px;
        height: 380px;
        border-radius: 4px;
        margin-right: 32px;
        margin-top: 20px;

        #my-video {
          width: 100%;
          height: 100%;
          border-radius: 8px;
        }

        .video-js .vjs-big-play-button {
          width: 1.8em;
          height: 1.8em;
          line-height: 1.7em;
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
  }
}
</style>
