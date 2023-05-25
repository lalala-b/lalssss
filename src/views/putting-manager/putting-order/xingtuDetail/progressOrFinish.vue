<template>
  <div v-loading="loading" class="conatinerWrap">
    <div class="contentWrap">
      <div class="leftContentWrap">
        <Wrap class="m-t-12">
          <div class="statusWrap">
            <el-steps :active="activeStep" finish-status="success" :align-center="true">
              <el-step title="制作脚本" />
              <el-step title="制作视频" />
              <el-step title="发布视频" />
              <el-step title="任务完成" />
            </el-steps>

            <div class="contentTip" v-html="stepContent" />
          </div>

          <div v-if="status === 4" class="cancelTaskTip">
            <p><span>达人发起取消任务</span> <i class="el-icon-info" />请及时回复，取消后资金将全部退回到您的账户</p>
            <p>播放量到不了</p>
          </div>
        </Wrap>

        <ProgressStatusItem :cur-status="status" :data="data" :min-status="2" step="makeScript" :step-content="stepContent" />
        <ProgressStatusItem :cur-status="status" :data="data" :min-status="3" step="makeVideo" :step-content="stepContent" />
        <ProgressStatusItem :cur-status="status" :data="data" :min-status="10" step="publishVideo" :step-content="stepContent" />
        <ProgressStatusItem :cur-status="status" :data="data" :min-status="11" step="finishTask" :step-content="stepContent" />
      </div>

      <ProgressRightMsg :data="data" @openDrawer="onOpenDrawer" />
    </div>

    <DetailTaskMsgDrawer :data="data" :show="showDrawer" @closeDrawer="onCloseDrawer" />
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import ProgressStatusItem from './progressStatusItem.vue'
import ProgressRightMsg from './progressRightMsg.vue'
import DetailTaskMsgDrawer from './detailTaskMsgDrawer.vue'
import Wrap from '@/components/public/Wrap'
import { timestampToTime } from '@/utils'

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    ProgressStatusItem,
    ProgressRightMsg,
    DetailTaskMsgDrawer,
    Wrap
  },

  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      activeStep: 0,
      status: 0,
      showDrawer: false,
      detailMsg: {},
      stepContent: '未知'
    })

    // 获取各步骤的提示文案
    const getContentTip = (status) => {
      switch (status) {
        // 制作脚本
        case 2:
          state.stepContent = '等待达人上传脚本'
          break
        case 6:
          state.stepContent = '达人已上传脚本，请尽快确认'
          break
        // 制作视频
        case 3:
          state.stepContent = '等待达人上传视频'
          break
        case 5:
          state.stepContent = '已反馈，等待达人重新上传视频'
          break
        case 7:
          state.stepContent = '视频审核未通过，等待达人重新上传视频'
          break
        case 8:
          state.stepContent = '达人视频已上传，平台审核中'
          break
        case 9:
          state.stepContent = '达人已上传视频，请尽快确认'
          break
        // 发布视频
        case 10:
          if (state.detailMsg.baseTiktokThirdOrderInfo.orderScheduleDetailTime) {
            state.stepContent = `你已设置定时发布，视频将于${state.detailMsg.baseTiktokThirdOrderInfo.orderScheduleDetailTime || '--'}自动发布`
          } else {
            state.stepContent = `请选择发布方式`
          }
          break
        // 已完成
        case 11:
          state.stepContent = '视频已发布，请尽快验收'
          break
        case 12:
          state.stepContent = `视频已验收 ${state.detailMsg.baseTiktokThirdOrderInfo.orderFinishTime ? timestampToTime(state.detailMsg.baseTiktokThirdOrderInfo.orderFinishTime * 1000) : '<span style="color: red">时间暂未获取到</span>'}`
          break
        default:
          break
      }
    }

    watch(() => props.data, (newData) => {
      state.status = newData.orderStatus
      // 更新进行中状态的视频制作步骤
      if (state.status === 2 || state.status === 6) { // 制作脚本
        state.activeStep = 0
      } else if (state.status >= 3 && state.status <= 9 && state.status !== 6) { // 制作视频
        state.activeStep = 1
      } else if (state.status === 10) { // 发布视频
        state.activeStep = 2
      } else if (state.status >= 11 && state.status <= 12) { // 已完成
        state.activeStep = 3
      } else {
        state.activeStep = -1
      }
      state.detailMsg = newData
      getContentTip(state.status)
    }, {
      immediate: true
    })

    const onOpenDrawer = () => {
      state.showDrawer = true
    }

    const onCloseDrawer = () => {
      state.showDrawer = false
    }

    return {
      ...toRefs(state),
      onOpenDrawer,
      onCloseDrawer
    }
  }
})
</script>
<style lang="scss" scoped>
  .conatinerWrap {
    font-size: 14px;

    .contentWrap {
      display: flex;
      justify-content: space-between;

      .leftContentWrap {
        flex: 3;
      }

      .rightContentWrap {
        flex: 1.5;
        margin-left: 20px;

        .rightContent {
          div {
            margin-bottom: 10px;
          }

          .platTag {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100px;
            background: #e8eaec;
            padding: 4px;
            border-radius: 10px;

            .platImg {
              border-radius: 5px;
              width: 16px;
              height: 16px;
              vertical-align: middle;
              margin-right: 6px;
            }
          }

          .username {
            font-size: 18px;
            font-weight: 600;
          }

          .tagsWrap {
            .el-tag {
              margin-right: 8px;
              border-radius: 10px;
            }
          }

          .labelItem {
            margin-top: 20px;

            p {
              margin: 6px 0;

              &:first-child {
                color: rgb(158, 149, 149);
              }
            }

            .redFront {
              color: red;
              font-size: 18px;
              font-weight: 550;
            }
          }
        }

        .btnWrap {
          text-align: center;
          padding: 0;
        }
      }
    }

    .cancelTaskTip {
      border-top: 1px solid #f0f0f0;
      padding-top: 20px;
      margin-top: 30px;

      p {
        margin-top: 10px;

        span {
          color: rgb(158, 149, 149);
        }

        i {
          margin: 0 4px;
        }
      }
    }

    .contentTip {
      padding: 16px;
      font-weight: 600;
      background: #fafafc;
      // width: 80%;
      border-radius: 10px;
      font-size: 16px;
      margin-top: 20px;
    }

    a {
      color: rgb(68, 68, 231);
    }

    .el-col {
      margin-bottom: 20px;
      display: flex;

      span {
        margin-right: 30px;
        display: flex;
        align-items: center;

        &:first-child {
          color: rgb(158, 149, 149);
          font-weight: 500;
          width: 16%;
        }

        img {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
  }
</style>
