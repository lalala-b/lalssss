<template>
  <el-dialog
    title="视频详情"
    :visible.sync="show"
    width="960px"
    :before-close="handleClose"
    class="video-detail"
    @open="handleOpen"
  >
    <div class="video-detail__header  flex">
      <VideoInfo class="flex1" :info="videoDetail" :options="videoInfoMap">
        <ul class="video-detail__header-data flex flex1 flex-align-end flex-justify-between">
          <li class="target-tag">
            <el-tooltip
              class="video-detail__header-data-total"
              data-num
              content="流量"
              placement="top"
            >
              <span>
                <i class="iconfont iconliuliang_fil" />{{ accountType == 5 && (videoDetail.dname == '暂无' && videoDetail.fname == '暂无') && !videoDetail.flowCount ? '-': videoDetail.flowCount }}
              </span>
            </el-tooltip>
            <div class="video-detail__header-data-add flex flex-align-center">
              今日新增:
              <span>
                <i class="iconfont" :class=" videoDetail.addFlow >= 0 ? 'iconshangshengfill': 'iconxiajiang_fill'" />
                {{ videoDetail.addFlow }}
              </span>
            </div>
          </li>
          <li class="target-tag">
            <el-tooltip
              class="video-detail__header-data-total"
              data-num
              content="点赞"
              placement="top"
            >
              <span>
                <i class="iconfont icondianzan_fill" />{{ videoDetail.thumbUpCount }}
              </span>
            </el-tooltip>
            <!-- <div class="video-detail__header-data-total" data-num>
            </div> -->
            <div class="video-detail__header-data-add flex flex-align-center">今日新增:
              <span>
                <i class="iconfont" :class=" videoDetail.addDig >= 0 ? 'iconshangshengfill': 'iconxiajiang_fill'" />
                {{ videoDetail.addDig }}
              </span>
            </div>
          </li>
          <li class="target-tag">
            <el-tooltip
              class="video-detail__header-data-total"
              data-num
              content="评论"
              placement="top"
            >
              <span>
                <i class="iconfont iconpinglun_fill" />{{ videoDetail.commentCount }}
              </span>
            </el-tooltip>
            <div class="video-detail__header-data-add flex flex-align-center">今日新增:
              <span>
                <i class="iconfont" :class=" videoDetail.addCom >= 0 ? 'iconshangshengfill': 'iconxiajiang_fill'" />{{ videoDetail.addCom }}
              </span>
            </div>
          </li>
          <li class="target-tag">
            <el-tooltip
              class="video-detail__header-data-total"
              data-num
              content="转发"
              placement="top"
            >
              <span>
                <i class="iconfont iconzhuanfa_fill" />{{ videoDetail.forwardedCount }}
              </span>
            </el-tooltip>
            <div class="video-detail__header-data-add  flex flex-align-center">今日新增:
              <span>
                <i class="iconfont" :class=" videoDetail.addShare >= 0 ? 'iconshangshengfill': 'iconxiajiang_fill'" />{{ videoDetail.addShare }}
              </span>
            </div>
          </li>
        </ul>
      </VideoInfo>
      <div class="video-detail__header-account">
        <AccountCard :info="videoDetail">
          <span class="video-detail__header-account-fans"><i class="iconfont iconfensi_fill" />{{ videoDetail.fansNum }}</span>
        </AccountCard>
        <ul class="video-detail__header-account-list">
          <li>账号归属：{{ videoDetail.accountBelong || `${videoDetail.dname||''}-${videoDetail.fname||''}` }}</li>
          <li>账号统一名称：{{ videoDetail.belongName }}</li>
          <li>编辑人员：{{ videoDetail.editName || '未选择' }}</li>
          <li>剪辑人员：{{ videoDetail.cutName || '未选择' }}</li>
        </ul>
      </div>
    </div>
    <div class="video-detail__charts flex flex-wrap">
      <div v-for="item in chartsData" :key="item.title">
        <Title :title="item.title" :icon="item.icon" class="p-0" />
        <VChart :data="item.echart" :config="chartConfig" :loading="chartLoading" />
      </div>
    </div>
    <p class="video-detail__update-time">数据更新时间：{{ videoDetail.updateTime }}</p>
  </el-dialog>
</template>

<script>
import { VideoInfo, AccountCard, Title, VChart } from 'components'
import { $getVideoDetail, $getVideoPic } from '@/api/account-manage'

export default {
  components: {
    VideoInfo,
    AccountCard,
    Title,
    VChart
  },
  props: {
    dialogData: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    showTabs: {
      type: Array,
      default: () => {
        return ['data', 'analyze']
      }
    },
    accountType: {
      type: [String, Number],
      default: '1'
    }
  },
  data() {
    this.videoInfoMap = {
      title: 'titleName',
      coverImg: 'videoCoverUrl'
    }
    return {
      loading: false,
      videoDetail: {},
      activeName: 'data',
      lineConfig: {
        legend: {
          show: false
        },
        grid: {
          left: 90
        }
      },
      chartsData: [
        {
          title: '播放趋势',
          keys: ['allFlow', 'addFlow'],
          icon: 'iconbofang_fill',
          echart: {
            terms: [],
            values: [],
            cates: []
          }
        },
        {
          title: '点赞趋势',
          keys: ['allDig', 'addDig'],
          icon: 'icondianzan_fill',
          echart: {
            terms: [],
            values: [],
            cates: []
          }
        },
        {
          title: '评论趋势',
          keys: ['allCom', 'addCom'],
          icon: 'iconpinglun_fill',
          echart: {
            terms: [],
            values: [],
            cates: []
          }
        },
        {
          title: '分享趋势',
          keys: ['allShare', 'addShare'],
          icon: 'iconzhuanfa_fill',
          echart: {
            terms: [],
            values: [],
            cates: []
          }
        }
      ],
      chartConfig: {
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }],
        legend: {
          right: 10,
          align: 'right'
        }
      },
      chartLoading: true
    }
  },
  computed: {
    accountBelong() {
      if (this.videoDetail.dname === '暂无' && this.videoDetail.fname === '暂无') {
        if (this.accountType == 5) {
          return '乾饱饱'
        }
      }
      return `${this.videoDetail.dname || ''}-${this.videoDetail.fname || ''}`
    },
    imgSrc() {
      return ''
    }
  },
  methods: {
    handleClick(current) {},
    async getVideoDetail() {
      this.loading = true
      const { flowId } = { ...this.dialogData }
      if (!flowId) {
        return
      }
      const res = await $getVideoDetail({ flowId }).catch(err => {
        this.loading = false
      })
      if (res.code === 1) {
        this.videoDetail = res.data
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    },
    formatChartsOptions(chartData) {
      const chartMap = {}
      chartData.cates.forEach((item, index) => {
        chartMap[item.typeCode] = {
          cates: item.typeName,
          values: chartData.values[index]
        }
      })
      this.chartsData.forEach(item => {
        item.echart = item.keys.reduce((t, n) => {
          if (chartMap[n]) {
            t.cates.push(chartMap[n].cates)
            t.values.push(chartMap[n].values)
          }
          return t
        }, { cates: [], terms: chartData.terms, values: [] })
      })
      this.chartLoading = false
    },
    async getVideoPic() {
      this.chartLoading = true
      const { query } = this.$route
      try {
        const res = await $getVideoPic({
          accountId: query.accountId ? Number(query.accountId) : this.dialogData.accountId,
          thirdId: this.dialogData.thirdId,
          platId: this.dialogData.platId,
          addTime: this.dialogData.addTime
        })
        if (res.code === 1) {
          this.formatChartsOptions(res.data)
        } else {
          this.$message.error(res.message)
        }
      } catch (err) {
        if (err.message) {
          this.$message.error(err.message)
        }
      }
      this.chartLoading = false
    },
    handleOpen() {
      Object.assign(this.$data, this.$options.data())
      this.getVideoDetail()
      this.getVideoPic()
    },
    handleClose() {
      this.$emit('update:show', false)
    }
  }
}
</script>

<style scoped lang="scss">
.video-detail {
  ::v-deep {
    .video-info-coverImg {
      height: 134px;
      width: 100px;
    }
    .info-coverImg {
      height: 134px;
      width: 100px;
      border-radius: 6px;
      img {
        height: 134px;
        width: 100px;
      }
    }
    .video-info-right {
      &__title {
        font-size: 16px;
        line-height: 24px;
        margin-bottom: 4px;
      }
      p {
        color: #BFBFBF;
      }
    }
  }
  &__header {
    padding-bottom: 25px;
    &-data {
      &-total {
        font-size: 20px;
        line-height: 20px;
        cursor: pointer;
        .iconfont {
          margin-right: 5px;
          font-size: 18px;
          color: #D9D9D9;
        }
        &:hover {
          color: $--color-primary;
          .iconfont {
            color: $--color-primary;
          }
        }
      }
      &-add {
        margin-top: 5px;
        font-size: 12px;
        line-height: 16px;
        span {
          color: #F5222D;
          line-height: 16px;
          .iconfont {
            font-size: 8px;
            margin: 0 3px;
          }
          .iconshangshengfill {
            color: #F5222D;
          }
          .iconxiajiang_fill {
            color: #5AD8A6;
          }
        }
      }
    }
    &-account {
      width: 269px;
      padding: 0 24px;
      margin-left: 65px;
      border-left: 1px solid rgba(0, 0, 0, 0.09);
      ::v-deep {
        .account-card {
          &__image {
            height: 40px;
            width: 40px;
            img {
              width: 40px;
              height: 40px;
            }
          }
        }
      }
      &-list {
        margin-top: 18px;
        li {
          font-size: 12px;
          color: #595959;
          line-height: 16px;
          margin-bottom: 4px;
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      &-fans {
        line-height: 20px;
        color: #D9D9D9;
        font-size: 14px;
        i {
          font-size: 14px;
          margin-right: 4px;
        }
      }
    }
  }

  &__charts {
    padding-top: 16px;
    border-top: 1px solid rgba(0, 0, 0, 0.09);
    > div {
      position: relative;
      width: 50%;
    }
    ::v-deep {
      .q-title {
        position: absolute;
        left: 10px;
      }
    }
  }
  &__update-time {
    line-height: 16px;
    text-align: center;
    font-size: 12px;
    color: #D9D9D9;
  }
}
</style>
