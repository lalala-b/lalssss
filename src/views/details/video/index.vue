<template>
  <div class="P-video">
    <div v-if="detailData" id="panelContent" class="video-wrap">
      <Wrap>
        <div class="flex P-video__baseic">
          <div class="flex flex1">
            <Video v-if="detailData.videoCoverUrl" v-loading="loading" class="P-video__video" />
            <Info class="P-video__info" />
          </div>
          <Account class="P-video__account" />
        </div>
      </Wrap>
      <Detail class="flex-detail" />
      <Comment v-if="detailData.platId != 26" :review-hot-word="reviewHotWord" />
    </div>
  </div>
</template>
<script>
// import Wrap from '../../_com/wrap'
import Info from './_components/info.vue'
import Video from './_components/video.vue'
import Account from './_components/account-video.vue'
import Detail from './_components/detail.vue'
import Comment from './_components/comment.vue'
import { $getVideoDetailNew, $getReviewList, $accountBaseInfo, $getReviewHotWord } from '@/api/video-manage'

export default {
  components: {
    // Wrap,
    Info,
    Video,
    Account,
    Detail,
    Comment
  },
  data() {
    return {
      MIN_WIDTH: window.innerWidth * 0.79 * 0.23 - 10,
      activeName: 'first',
      response: {
        detailData: null,
        reviewData: null,
        accountData: null,
        reviewTotal: 0
      },
      loading: false,
      detailData: null,
      reviewData: null,
      accountData: null,
      moveList: [
        { x: 10, y: 0, width: 474, height: 296 },
        { x: 494, y: 0, width: 474, height: 296 },
        { x: 10, y: 306, width: 474, height: 296 },
        { x: 4, y: 306, width: 474, height: 296 }
        // { x: 644, y: 316, width: 474, height: 296 },
      ],
      reviewHotWord: null
    }
  },
  provide() {
    return {
      $response: this.response
    }
  },
  created() {
    this.getVideoDetail()
    this.$bus.$on('comment', (pageNum) => {
      this.getReviewList(pageNum)
    })
  },
  beforeDestroy() {
    this.$bus.$off('comment')
  },
  methods: {
    async getReviewHotWord() {
      const res = await $getReviewHotWord({
        accountId: this.detailData.accountId,
        thirdId: this.detailData.thirdId
      })
      if (res.code === 1 && res.data) {
        this.reviewHotWord = res.data.wordsData
      }
    },
    async accountBaseInfo() {
      const params = {
        accountId: this.detailData.accountId,
        platId: this.detailData.platId,
        accountType: this.detailData.accountType
      }
      try {
        const res = await $accountBaseInfo(params)
        if (res.code === 1) {
          this.accountData = res.data
          this.response.accountData = this.accountData
        }
      } catch (error) { console.error(error) }
    },
    handleTab() {
      const name = this.activeName
      if (name === 'second' && !this.reviewData) {
        this.getReviewList()
      }
    },
    async getVideoDetail() {
      this.loading = true
      const params = {
        flowId: this.$route.params.flowId,
        accountId: this.$route.params.accountId
      }
      try {
        const res = await $getVideoDetailNew(params)
        if (res.code === 1 && res.data) {
          this.detailData = res.data
          this.response.detailData = this.detailData
          this.accountBaseInfo()
          this.getReviewList()
          this.getReviewHotWord()
        } else {
          this.$message.error(res.message || '网络错误')
        }
        this.loading = false
      } catch (error) {
        console.log(error)
        this.$message.error('网络错误')
        this.loading = false
      }
    },
    async getReviewList(pageNum = 1) {
      const params = {
        thirdId: this.detailData.thirdId,
        accountId: this.detailData.accountId,
        size: 5,
        pageNum,
        // thirdId: 123,
        // accountId: 123,
        content: ''
      }
      try {
        const res = await $getReviewList(params)
        if (res.code === 1 && res.data) {
          this.reviewData = res.data
          this.response.reviewData = this.reviewData
          this.response.reviewTotal = res.total
        }
      } catch (error) { console.log(error) }
    },
    /**
     * 更新拖拽模块的数值
     */
    updateBlock({ x, y, width, height, index }) {
      this.$set(this.moveList, index, { ...this.moveList[index], x, y, width, height })
    }
  }
}
</script>
<style lang="scss" scoped>
  @include themify($themes) {
    .video-info {
      margin-bottom: 15px;
    }
    .video {
      padding: 0;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 15px;
    }

  }
  .P-video {
    &__baseic {
      // padding: 24px;
      background-color: #fff;
    }
    &__video {
      margin-right: 12px;
    }
    &__info {
      flex: 1;
      margin-right: 47px;
    }
    .video-wrap {
      min-height: initial !important;
      max-height: initial !important;
    }
    .account-info {
      min-height: 330px;
    }
    ::v-deep h3 {
      font-size: 16px;
      margin-bottom: 20px;
      .iconfont {
        font-size: 16px;
      }
      // &::before {
      //   content: '';
      //   display: inline-block;
      //   width: 4px;
      //   vertical-align: top;
      //   height: 22px;
      //   margin-top: 2px;
      //   background-color: rgb(68, 68, 252);
      // }
    }
    .panel-left, ::v-deep .el-tabs__header {
      position: -webkit-sticky;
      position: sticky;
      top: -24px;
      z-index: 2;
    }
    ::v-deep .detail-right {
      overflow: initial;
    }
    .right-top-mask {
      background-color: #f5f7fa;
      height: 30px;
      position: fixed;
      z-index: 2;
      top: 54px;
      left: 160px;
      width: 100%;
    }
    .flex-detail {
      flex: 4;
    }
    ::v-deep .comment-data {
      flex: 2;
      // margin-left: 15px;
      // max-height: 762px;
      overflow: auto;
    }
  }
</style>
