<template>
  <div class="C-video-comment-data">
    <div class="data-head">
      <Title :title="`所有评论（${total}）`" class="p-0" icon="iconpinglun_fill" />
    </div>
    <div v-if="data" class="data-info m-t-24">
      <!-- <PageCard>
        <template v-slot:content>
          <h2>123</h2>
        </template>
      </PageCard> -->
      <div v-for="(item, index) in data" :key="index" class="comment-item">
        <div class="comment-avater">
          <img :src="item.avatarUri" alt="">
        </div>
        <div class="comment-info">
          <p class="comment-name">{{ item.nickname }}</p>
          <p class="comment-content">
            {{ item.content }}
          </p>
          <p class="comment-date">{{ getDateDiff(item.addTime) }}</p>
        </div>
        <div class="comment-right">
          <i class="iconfont iconxihuan" />
          <p>{{ item.likeCount }}</p>
        </div>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page.sync="pageNum"
        @current-change="handlePagChange"
      />
    </div>

  </div>
</template>
<script>
import { Title } from 'components'

export default {
  components: {
    Title
  },
  inject: ['$response'],
  data() {
    return {
      pageNum: 1
    }
  },
  computed: {
    data() {
      return this.$response.reviewData
    },
    total() {
      return this.$response.reviewTotal || 0
    }
  },
  beforeDestroy() {
    this.$bus.$off('comment')
  },
  methods: {
    // 格式化时间   留备用~
    getDateDiff(dateStr) {
      dateStr = new Date(dateStr).getTime()
      var publishTime = dateStr / 1000
      var d_seconds
      var d_minutes
      var d_hours
      var d_days
      var timeNow = parseInt(new Date().getTime() / 1000)
      var d

      var date = new Date(publishTime * 1000)
      var Y = date.getFullYear()
      var M = date.getMonth() + 1
      var D = date.getDate()
      var H = date.getHours()
      var m = date.getMinutes()
      var s = date.getSeconds()
      // 小于10的在前面补0
      if (M < 10) {
        M = '0' + M
      }
      if (D < 10) {
        D = '0' + D
      }
      if (H < 10) {
        H = '0' + H
      }
      if (m < 10) {
        m = '0' + m
      }
      if (s < 10) {
        s = '0' + s
      }

      d = timeNow - publishTime
      d_days = parseInt(d / 86400)
      d_hours = parseInt(d / 3600)
      d_minutes = parseInt(d / 60)
      d_seconds = parseInt(d)

      if (d_days > 0 && d_days < 3) {
        return d_days + '天前'
      } else if (d_days <= 0 && d_hours > 0) {
        return d_hours + '小时前'
      } else if (d_hours <= 0 && d_minutes > 0) {
        return d_minutes + '分钟前'
      } else if (d_seconds < 60) {
        if (d_seconds <= 0) {
          return '刚刚'
        } else {
          return d_seconds + '秒前'
        }
      } else if (d_days >= 3 && d_days < 30) {
        return M + '-' + D + ' ' + H + ':' + m
      } else if (d_days >= 30) {
        return Y + '-' + M + '-' + D + ' ' + H + ':' + m
      }
    },
    handlePagChange() {
      this.$bus.$emit('comment', this.pageNum)
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-video-comment-data {
    .data-info {
      .comment-item {
        display: flex;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        .comment-avater {
          width: 40px;
          img {
            width: 100%;
            border-radius: 50%;
          }
        }
        .comment-info {
          flex: 1;
          margin-left: 10px;
          .comment-name {
            color: #999;
            font-size: 14px;
          }
          .comment-content {
            margin-top: 4px;
            font-size: 14px;
          }
          .comment-date {
            margin-top: 4px;
            color: rgb(241, 80, 80);
            font-size: 12px;
          }
        }
        .comment-right {
          text-align: center;
          p {
            margin-top: 4px;
          }
        }
      }
    }
  }
</style>
