<template>
  <div>
    <el-card v-loading="videoCaseLoading" shadow="always">
      <div class="case-head">
        <span>
          作品案例
        </span>

        <div ref="caseTab" class="case-tab">
          <i class="tab-item active">个人作品</i>
          <i class="tab-item">商业作品</i>
        </div>
      </div>

      <ul v-if="curList.length" class="case-data-wrap">
        <li v-for="item in curList" :key="item.bvId" class="case-item" @click="toBilibiliForDetail(item.bvId)">
          <div class="left-image cursor-pointer">
            <img :src="item.cover" alt="" style="width: 100%;">
            <div class="time">{{ `${handleAddZero(parseInt(item.duration / 3600))}:${handleAddZero(parseInt(item.duration / 60 % 60))}:${handleAddZero(parseInt(item.duration % 60))}` }}</div>
          </div>
          <div class="right-info">
            <div class="play-count"> 播放数 <span>{{ item.playCnt | toThousandsW }}</span></div>
            <div class="zan-count"> 点赞数 <span>{{ item.likeCnt | toThousandsW }}</span></div>
            <div class="remark-count"> 评论数 <span>{{ item.commentCnt | toThousandsW }}</span></div>
            <div class="desc" :title="item.title">{{ item.title }}</div>
          </div>
        </li>
      </ul>
      <div v-else class="no-data">
        暂无数据
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, watch, onMounted, reactive, toRefs } from '@vue/composition-api'

export default defineComponent({
  props: {
    videoCaseList: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    videoCaseLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
  },

  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy

    const states = reactive({
      selfProductList: [],
      businessProductList: [],
      curList: []
    })

    watch(() => props.videoCaseList, (val) => {
      states.selfProductList = val.selfProduct
      states.businessProductList = val.businessProduct
      states.curList = states.selfProductList
    }, {
      immediate: true
    })

    const changeCaseTabActive = () => {
      const caseTab = $refs.caseTab
      const child = [...caseTab.children]
      child.forEach(item => {
        item.addEventListener('click', (e) => {
          child.forEach(childItem => {
            childItem.classList.remove('active')
          })
          e.target.classList.add('active')
          const text = e.target.innerText
          if (text === '个人作品') {
            states.curList = states.selfProductList
          } else if (text === '商业作品') {
            states.curList = states.businessProductList
          }
        })
      })
    }

    const handleAddZero = (num) => {
      return String(num).length < 2 ? `0${num}` : num
    }

    const toBilibiliForDetail = (bvId) => {
      window.open(`https://www.bilibili.com/video/${bvId}/`, '_blank')
    }

    onMounted(() => {
      changeCaseTabActive()
    })

    return {
      ...toRefs(states),
      handleAddZero,
      toBilibiliForDetail
    }
  }
})
</script>

<style lang="scss" scoped>
.case-head {
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: 16px;
    font-weight: 600;
  }

  .case-tab {
    .tab-item {
      cursor: pointer;
      margin-left: 32px;

      &.active {
        font-size: 14px;
        font-weight: 700;
        color:#333;
        position: relative;

        &::after {
          content: "";
          position: absolute;
          bottom: -16px;
          right: 13px;
          width: 24px;
          height: 3px;
          background: #1d1d1d;
          border-radius: 2px;
        }
      }
    }
  }
}

.case-data-wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 32px;
  width: 100%;

  .case-item {
    // margin: 0 4px;
    margin-bottom: 24px;
    display: flex;
    // flex: 0 0 360px;
    padding: 12px;
    background: rgba(177,177,223,.08);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;

    .left-image {
      position: relative;
      width: 230px;
      height: 140px;

      .time {
        position: absolute;
        left: 10px;
        bottom: 10px;
        height: 25px;
        background: rgba(0,0,0,.6);
        border-radius: 12px;
        padding: 4px 12px;
        font-size: 12px;
        color: white;
        font-weight: 600;
      }
    }

    .right-info {
      width: 100px;
      margin-left: 12px;

      div {
        margin-top: 8px;
        color: #8d9099;

        span {
          font-size: 14px;
          color: #000;
          // margin-left: 4px;
        }
      }

      .desc {
        color: #333;
        margin-top: 18px;
        padding-top: 10px;
        border-top: 1px solid hsla(0,0%,80%,.3);
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
        font-size: 12px;
      }
    }
  }
}
</style>
