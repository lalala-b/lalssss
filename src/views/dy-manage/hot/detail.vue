<template>
  <el-dialog
    title="热点详情"
    :visible="show"
    width="1000px"
    @close="handleClose"
  >
    <div class="flex flex-justify-between">
      <div class="title-wrap">
        <p>{{ info.word }}</p>
        <span>TOP{{ info.position }}</span>
        <strong>热榜</strong>
      </div>
      <div class="hot-num">
        <svg-icon icon-class="hot" />
        热度：{{ info.hotValue | toThousandsW }}
      </div>
    </div>
    <div class="flex sub-title">
      <p class="m-r-24">相关视频：<span>{{ total }}</span></p>
      <p>热点发布时间：{{ info.eventTime }}</p>
    </div>
    <ul v-infinite-scroll="getMoreList" class="video-list" infinite-scroll-distance="100" :infinite-scroll-disabled="loading">
      <li v-for="item in list" :key="item.id" class=" m-b-10">
        <VideoCard :data="item" />
      </li>
    </ul>
    <Loading v-if="loading" />
  </el-dialog>
</template>
<script>
import Loading from '@/components/Loading'
import VideoCard from '@/components/VideoCard'
import { $getTiktokHotDetail } from '@/api/dy-manage'
export default {
  components: {
    VideoCard,
    Loading
  },
  props: {
    show: Boolean,
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      pageNum: 1,
      loading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleClose() {
      this.$emit('update:show', false)
    },
    getList() {
      this.loading = true
      $getTiktokHotDetail({ wordId: this.info.wordId, pageNum: this.pageNum }).then(res => {
        if (res.code === 1) {
          this.list = [...this.list, ...res.data]
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }).finally(_ => {
        this.loading = false
      })
    },
    getMoreList() {
      if (this.total > this.list.length) {
        this.pageNum += 1
        this.getList()
      } else {
        return
      }
    }
  }
}
</script>
<style lang="scss">
  .title-wrap {
    display: flex;
    align-items: center;
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      height: 24px;
      line-height: 24px;
      color: #000;
      max-width: 560px;
      margin-right: 12px;
      font-size: 18px;
    }
    span, strong {
      min-width: 55px;
      height: 24px;
      padding: 0 6px;
      text-align: center;
      line-height: 24px;
      font-size: 16px;
      color: #fff;
      box-sizing: border-box;
    }
    span {
      font-weight: bold;
      background: linear-gradient(to right, rgb(252, 104, 35), rgb(255, 69, 12));
    }
    strong {
      background: #000;
    }
  }
  .hot-num {
    font-size: 18px;
    color: #e9472f;
  }
  .sub-title {
    height: 40px;
    line-height: 40px;

  }
  .video-list {
    display: flex;
    flex-wrap: wrap;
    max-height: 500px;
    overflow-y: auto;
    > li {
      width: 20%;
      padding: 0 5px;
    }
  }
</style>
