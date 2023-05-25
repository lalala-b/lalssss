<template>
  <el-card v-loading="videoTrendLoading" shadow="always">
    <div class="recent-head">
      最新10个视频趋势
    </div>

    <div class="charts-wrap">
      <div class="charts-content">
        <div class="high-low-wrap">
          <span>最高{{ curTypeText }}量 <i>{{ maxData | toThousandsW }}</i></span>
          <span>最低{{ curTypeText }}量 <i>{{ minData | toThousandsW }}</i></span>
        </div>
        <div ref="contributionTab" class="contribution-tab">
          <span class="active">播放量</span> \
          <span>点赞量</span> \
          <span>评论量</span> \
          <span>弹幕量</span>
        </div>
      </div>
      <div>
        <VideoTrendsBar v-if="videoDataList.length" :data="videoDataList" :bar-id="1" :cur-type="curType" :cur-median="curMedian" />
      </div>
    </div>
  </el-card>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted, reactive, toRefs, watch } from '@vue/composition-api'
import VideoTrendsBar from './videoTrendsBar.vue'

export default defineComponent({
  props: {
    recentVideoTrendData: {
      type: Object,
      default() {
        return () => ({})
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
    VideoTrendsBar
  },
  setup(props) {
    const { $refs } = getCurrentInstance().proxy
    const states = reactive({
      curType: 'playTrendCnt',
      curTypeText: '播放',
      maxData: 0, // 最高值
      minData: 0, // 最低值
      curMedian: 0, // 当前中位数,
      videoDataList: []
    })

    // 获取当前类型的中位数
    const getCurMedian = (type, data) => {
      let num = 0
      switch (type) {
        case 'playTrendCnt':
          num = data.averagePlayCnt
          break
        case 'likeTrendCnt':
          num = data.averageLikeCnt
          break
        case 'commentTrendCnt':
          num = data.averageCommentCnt
          break
        case 'barrageTrendCnt':
          num = data.averageBarrageCnt
          break
      }

      return num
    }

    // 获取当前类型的最大最小值
    const getCurMaxAndMin = (type, data, maxType) => {
      let val = 0
      switch (type) {
          case 'playTrendCnt':
          val = maxType === 'max' ? data.maxPlayCnt : data.minPlayCnt
          break
        case 'likeTrendCnt':
          val = maxType === 'max' ? data.maxLikeCnt : data.minLikeCnt
          break
        case 'commentTrendCnt':
          val = maxType === 'max' ? data.maxCommentCnt : data.minCommentCnt
          break
        case 'barrageTrendCnt':
          val = maxType === 'max' ? data.maxBarrageCnt : data.minBarrageCnt
          break
      }

      return val
    }

    watch(() => [props.recentVideoTrendData, states.curType], (val) => {
      const data = val[0]
      const type = val[1]
      if (Object.keys(data).length) {
        states.videoDataList = data.trendVOList || []
        states.curMedian = getCurMedian(type, data)
        states.maxData = getCurMaxAndMin(type, data, 'max')
        states.minData = getCurMaxAndMin(type, data, 'min')
      }
    }, {
      immediate: true
    })

    // 切换各数据量的tab
    const changeContributionTabActive = () => {
      const contributionTab = $refs.contributionTab
      const child = [...contributionTab.children]
      child.forEach(item => {
        item.addEventListener('click', (e) => {
          child.forEach(childItem => {
            childItem.classList.remove('active')
          })
          e.target.classList.add('active')
          const text = e.target.innerText
          switch (text) {
            case '播放量':
              states.curType = 'playTrendCnt'
              states.curTypeText = '播放'
              break
            case '点赞量':
              states.curType = 'likeTrendCnt'
              states.curTypeText = '点赞'
              break
            case '评论量':
              states.curType = 'commentTrendCnt'
              states.curTypeText = '评论'
              break
            case '弹幕量':
              states.curType = 'barrageTrendCnt'
              states.curTypeText = '弹幕'
              break
            default:
              states.curType = 'playTrendCnt'
              states.curTypeText = '播放'
              break
          }
        })
      })
    }

    onMounted(() => {
      changeContributionTabActive()
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.recent-head {
  font-size: 16px;
  font-weight: 600;
}

.charts-wrap {
  margin-top: 32px;
  text-align: right;

  .charts-content {
    display: flex;
    justify-content: space-between;
    font-size: 14px;

    .high-low-wrap {
      span {
        margin-right: 16px;
        color: #8d9099;

        i {
          color: #000;
          font-weight: 600;
          font-size: 16px;
        }
      }
    }

    .contribution-tab {
      font-size: 14px;
      color: #8d9099;
      cursor: pointer;
    }

    .active {
      color: #33bdf5;
    }
  }

}

</style>
