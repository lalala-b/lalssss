<template>
  <div>
    <el-card v-loading="accountDataLoading" shadow="always">
      <div class="recent-head">
        <span>
          <svg-icon icon-class="huahuo" class="huahuo-logo" />
          B站花火数据
          <IconTip
            content="统计180天内，近5个发布满7天的原创稿件的中位数据"
            icon-class="iconwenhao"
          />
        </span>
      </div>

      <div class="flex flex-align-center flex-justify-between flex-wrap">
        <div v-for="item in bilibiliVideoDataList" :key="item.title" class="data-item flex flex-center flex-dir-col">
          <p class="item-title">{{ item.title }}<IconTip v-if="item.tipContent" icon-class="iconwenhao" :content="item.tipContent" /></p>
          <p>{{ item.value | toThousandsW }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import IconTip from '@/components/IconTip'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const states = reactive({
      bilibiliVideoDataList: {
        averagePlayCnt: {
          title: '播放量中位数',
          value: ''
        },
        averageInteractiveRate: {
          title: '互动率中位数',
          value: ''
        },
        averageLikeCnt: {
          title: '点赞中位数',
          value: ''
        },
        averageCommentCnt: {
          title: '评论中位数',
          value: ''
        },
        averageBarrageCnt: {
          title: '弹幕中位数',
          value: ''
        },
        averageCollectCnt: {
          title: '收藏中位数',
          value: ''
        }
      }
    })

    // 将数据转为百分率形式
    const toRateNumber = (str) => {
      return ((Math.round((str * 10000))) / 100.00).toFixed(1) + '%'
    }

    watch(() => props.userInfo, (info) => {
      if (Object.keys(info || {}).length) {
        const bilibiliVideoDataList = states.bilibiliVideoDataList
        const arr = []
        Object.keys(bilibiliVideoDataList).forEach(item => arr.push(item))
        arr.forEach(item => {
          const dataItem = bilibiliVideoDataList[item]
          if (dataItem.title.indexOf('率') !== -1 && +info[item] >= 0) {
            dataItem.value = toRateNumber(info[item])
          } else {
            dataItem.value = +info[item] < 0 ? '--' : info[item]
          }
        })
      }
    }, {
      immediate: true
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  .huahuo-logo {
    font-size: 20px;
    margin-bottom: 4px;
  }
}

 .data-item {
    position:relative;
    width: 33.3%;
    margin-top: 10px;

    p {
      line-height: 32px;
      font-size: 24px;
      font-weight: bold;
      color: $--color-primary;
    }

    .item-title{
      color: #333;
      font-size: 14px;
      font-weight: normal;
    }

    .normal{
      position:absolute;
      top:6%;
      right:21%;
      border:1px solid #ccc;
      color:#ccc;
      border-radius:8px;
      padding:2px 8px;
      font-size:12px;
    }
  }
</style>
