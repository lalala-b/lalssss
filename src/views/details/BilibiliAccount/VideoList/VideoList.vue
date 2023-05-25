<template>
  <div>
    <!-- 作品案例 -->
    <WorkCase :video-case-list="videoCaseList" :video-case-loading="videoCaseLoading" />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import WorkCase from './WorkCase'

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
    WorkCase
  },

  setup(props, { emit }) {
    return {
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
    margin: 0 4px;
    margin-bottom: 24px;
    display: flex;
    flex: 0 0 360px;
    padding: 16px;
    background: rgba(177,177,223,.08);
    border-radius: 6px;
    cursor: pointer;

    .left-image {
      position: relative;
      width: 230px;
      height: 140px;
      min-width: 230px;

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
      width: 110px;
      margin-left: 12px;

      div {
        margin-top: 8px;
        color: #8d9099;

        span {
          font-size: 14px;
          color: #000;
          margin-left: 4px;
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
