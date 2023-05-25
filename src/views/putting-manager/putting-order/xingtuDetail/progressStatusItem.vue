<template>
  <Wrap class="m-t-12">
    <div>
      <div class="progressHeader">
        <span class="progressName" :class="getTagStatus(curStatus) === '进行中' ? 'highLight' : ''">{{ getProgressName(step) }}</span>
        <el-tag
          v-if="showTag(curStatus, minStatus)"
          type="danger"
          size="mini"
          :style="getTagStatus(curStatus) === '已完成' || getTagStatus(curStatus) === '已跳过' ?
            'color: #000; background: #f5f5f5' : ''"
        >{{ getTagStatus(curStatus) }}</el-tag>
      </div>
      <div class="progressContent">
        <span v-if="!showTag(curStatus, minStatus)">未开始</span>
        <span v-else v-html="getContentTip(curStatus)" />
      </div>
    </div>

    <!-- 步骤为制作视频 且 有视频数据 且 (当前状态为已反馈，待达人重新上传 或 视频已上传，平台审核中之后的状态) 才显示视频信息-->
    <div v-if="step === 'makeVideo' && videoMsgList.length && (curStatus === 5 || curStatus >= 7)" class="videoVersionWrap">
      <div class="videoVersionItem" @click="handleToSuggest(lastVideoMsg.itemId, $event)">
        <div class="itemTop">
          <span>版本{{ lastVideoMsg.resourceVersion }}</span>
          <span>{{ getContentStatus(curStatus, +lastVideoContentStatus, +lastVideoSearchStatus) }}</span>
        </div>

        <div class="itemContent">
          <!-- <img src="../../../../assets/_src/video-default.png" alt=""> -->
          <i class="el-icon-picture" />
          <div class="contentMsg">
            <p class="text-over-hidden-1" :title="lastVideoMsg.resourceTitle">{{ lastVideoMsg.resourceTitle || '--' }}</p>
            <p class="date">{{ lastVideoMsg.createTime ? timestampToTime(lastVideoMsg.createTime * 1000) : '--' }}</p>
            <a :href="lastVideoMsg.resourceUrl" target="_blank">播放视频</a>
          </div>
        </div>

        <div v-if="!+lastVideoMsg.auditBanInfo[0].auditStatus" class="itemBottom">
          <div>
            <i class="el-icon-warning infoIcon" />
            <span>内容审核未通过</span>
          </div>

          <div class="suggest" @click="handleToSuggest(lastVideoMsg.itemId, $event)">
            查看{{ (lastVideoMsg.auditdetailList || []).length }}条修改建议 >
          </div>
        </div>
        <!-- <div v-if="lastVideoMsg.auditStatus && getContentStatus(curStatus, lastVideoMsg.auditStatus) === '已确认'" class="itemBottom">
          <div class="text-over-hidden-1">
            <i class="el-icon-warning infoIcon" />
            <span>规格不符：</span>
            <i>当前上传视频时长为0小时1分3秒，与客户</i>
          </div>

          <div class="confirmSuggest" @click="handleToSuggest(lastVideoMsg.itemId)">
            查看修改建议 >
          </div>
        </div> -->
      </div>

      <template v-if="videoMsgList.length > 1">
        <div v-if="!isExpand" class="stow" @click="handleTriggerExpand">点击展开 <i class="el-icon-arrow-down" /></div>
        <div v-else class="stow" @click="handleTriggerExpand">点击收起 <i class="el-icon-arrow-up" /></div>

        <div ref="moreVideoWrap" class="moreVideoWrap hidden">
          <div v-for="item in videoMsgList.slice(1, videoMsgList.length)" :key="item.itemId" class="moreVideoItem" @click="handleToSuggest(item.itemId, $event)">
            <div class="itemTop">
              <span>版本{{ item.resourceVersion }}</span>
            </div>

            <div class="itemContent">
              <!-- <img src="../../../../assets/_src/video-default.png" alt=""> -->
              <i class="el-icon-picture" />
              <div class="contentMsg">
                <p class="text-over-hidden-1" :title="item.resourceTitle">{{ item.resourceTitle || '--' }}</p>
                <p class="date">{{ item.createTime ? timestampToTime(item.createTime * 1000) : '--' }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <SuggestMsgDrawer :suggest-id="videoSuggestId" :show="showSuggestDrawer" :data="videoMsgList" @closeDrawer="onCloseSuggestDrawer" />
  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from '@vue/composition-api'
import { timestampToTime } from '@/utils'
import SuggestMsgDrawer from './suggestMsgDrawer.vue'
import Wrap from '@/components/public/Wrap'

export default defineComponent({
  props: {
    // 当前状态
    curStatus: {
      type: Number,
      default: -1
    },
    // 该步骤的最小开始状态
    minStatus: {
      type: Number,
      default: -1
    },
    // 步骤提示文案
    stepContent: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    },
    // 步骤名称
    step: {
      type: String,
      default: ''
    }
  },

  components: {
    Wrap,
    SuggestMsgDrawer
  },

  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      isExpand: false,
      showSuggestDrawer: false,
      videoMsgList: [],
      lastVideoMsg: {},
      baseTiktokThirdScriptBO: {},
      videoSuggestId: '0',
      lastVideoContentStatus: undefined,
      lastVideoSearchStatus: undefined,
      detailMsg: {}
    })

    watch(() => props.data, (newData) => {
      state.detailMsg = newData
      const { baseTiktokThirdVideoInfos, baseTiktokThirdScriptBO } = newData
      state.baseTiktokThirdScriptBO = baseTiktokThirdScriptBO || {}
      state.videoMsgList = baseTiktokThirdVideoInfos || []
      state.lastVideoMsg = state.videoMsgList[0] || {}
      if (state.lastVideoMsg?.auditBanInfo?.length) {
        // 内容审核和搜索词审核的状态数组长度为1
        if (state.lastVideoMsg.auditBanInfo.length === 1) {
          if (state.lastVideoMsg.auditBanInfo[0].auditType === 'content') { // 内容审核状态
            state.lastVideoContentStatus = state.lastVideoMsg.auditBanInfo[0].auditStatus
          } else { // 搜索词审核状态
            state.lastVideoSearchStatus = state.lastVideoMsg.auditBanInfo[0].auditStatus
          }
        } else {
          state.lastVideoContentStatus = state.lastVideoMsg.auditBanInfo.filter(item => item.auditType === 'content')[0].auditStatus
          state.lastVideoSearchStatus = state.lastVideoMsg.auditBanInfo.filter(item => item.auditType === 'search')[0].auditStatus
        }
      }
    }, {
      immediate: true
    })

    // 获取各步骤是进行中还是已完成状态
    const getTagStatus = (status) => {
      const { step } = props
      let str = ''
      // 各步骤对应情况的进行中状态
      if ((status === 2 || status === 6) && step === 'makeScript' ||
        status >= 3 && status <= 9 && step === 'makeVideo' ||
        status === 10 && step === 'publishVideo' ||
        status === 11 && step === 'finishTask'
      ) {
        str = '进行中'
      } else if (state.baseTiktokThirdScriptBO.ignoreScript === 'true' && step === 'makeScript') { // 制作脚本中脚本已跳过的状态
        str = '已跳过'
      } else {
        str = '已完成'
      }

      return str
    }

    /**
     * 获取视频内容审核的状态
     * status 当前步骤状态
     * contentStatus 内容审核状态
     * searchStatus 搜索词审核状态
     */
    const getContentStatus = (status, contentStatus, searchStatus) => {
      function getStatusContent(name, status) {
        let content = ''
        switch (status) {
          case 0:
            content = `${name}审核未通过`
            break
          case 1:
            content = `${name}审核通过`
            break
          case 99:
            content = `${name}审核中`
            break
          default:
            break
        }
        return content
      }

      let str = '未知'
      // if (contentStatus === 99) { // 内容审核中
      //   return `内容审核中`
      // }
      // if (!contentStatus) { // 内容审核未通过
      //   return `内容审核未通过，${getStatusContent('搜索词', searchStatus)}`
      // }
      // if (contentStatus) { // 内容审核通过
      //   str = `内容审核通过, 搜索词${getStatusContent(searchStatus)}`
      // }

      str = `${getStatusContent('内容', contentStatus)}${isNaN(searchStatus) ? '' : '，'}${getStatusContent('搜索词', searchStatus)}`

      if (status === 5) { // 已反馈，待达人重新上传
        str = '已反馈'
      } else if (status === 9) { // 达人已上传视频，请尽快确认
        str = '待确认'
      } else if (status >= 10) { // 达人发布视频且其之后的状态
        str = '已确认'
      }
      return str
    }

    // 获取各步骤中已完成，进行中和已跳过的提示文案
    const getContentTip = (status) => {
      let str = '未知'
      const stepStatus = getTagStatus(status)
      // 已完成对应步骤的文案
      if (stepStatus === '已完成') {
        if (props.step === 'makeScript') {
          str = '脚本已确认'
        } else if (props.step === 'makeVideo') {
          str = '视频已确认'
        } else if ((status === 11 || status === 12) && props.step === 'publishVideo') {
          str = `视频已发布 ${state.detailMsg.baseTiktokThirdOrderInfo.orderReleaseTime ? timestampToTime(state.detailMsg.baseTiktokThirdOrderInfo.orderReleaseTime * 1000) : '--'} 
                <a href="${state.lastVideoMsg.resourceUrl}" target="_blank" class="watchVideo">查看视频</a>`
        } else if (props.step === 'finishTask') {
          str = `视频已验收 ${state.detailMsg.baseTiktokThirdOrderInfo.orderFinishTime ? timestampToTime(state.detailMsg.baseTiktokThirdOrderInfo.orderFinishTime * 1000) : '<span style="color: red">时间暂未获取到</span>'}`
        }
      } else if (stepStatus === '进行中') {
        str = props.stepContent
      } else if (stepStatus === '已跳过') {
        if (props.step === 'makeScript') {
          str = '你已选择跳过脚本'
        }
      }
      return str
    }

    // 控制视频列表的展开和收起
    const handleTriggerExpand = () => {
      state.isExpand = !state.isExpand
      if (!state.isExpand) {
        $refs.moreVideoWrap.classList.add('hidden')
      } else {
        $refs.moreVideoWrap.classList.remove('hidden')
      }
    }

    // 打开建议抽屉
    const handleToSuggest = (id, e) => {
      if (e.target.innerText === '播放视频') {
        return
      }
      state.showSuggestDrawer = true
      state.videoSuggestId = id
    }

    // 关闭建议抽屉
    const onCloseSuggestDrawer = () => {
      state.showSuggestDrawer = false
    }

    // 获取步骤名称
    const getProgressName = (step) => {
      let str = '--'
      switch (step) {
        case 'makeScript':
          str = '制作脚本'
          break
        case 'makeVideo':
          str = '制作视频'
          break
        case 'publishVideo':
          str = '发布视频'
          break
        case 'finishTask':
          str = '任务完成'
          break
      }

      return str
    }

    // 是否展示步骤状态标签
    const showTag = (curStatus, minStatus) => {
      if (curStatus > 1 && curStatus === 6 && props.step === 'makeVideo') { // 当前状态为达人已上传脚本 且 当前步骤是制作视频，则不显示步骤状态标签
        return false
      }
      if (curStatus > 1 && curStatus >= minStatus) {
        return true
      }

      return false
    }

    return {
      ...toRefs(state),
      getTagStatus,
      getContentStatus,
      getContentTip,
      handleTriggerExpand,
      handleToSuggest,
      onCloseSuggestDrawer,
      timestampToTime,
      showTag,
      getProgressName
    }
  }
})
</script>
<style lang="scss" scoped>
  .conatinerWrap {
    font-size: 14px;
  }

  a {
    color: rgb(68, 68, 231);
  }

  ::v-deep {
    .watchVideo {
      color: rgb(68, 68, 231);
      margin-left: 20px;
    }
  }

  .progressHeader {
    display: flex;
    align-items: center;

    .progressName {
      color: #b1a8aa ;
      font-size: 18px;
      font-weight: 600;

      &.highLight {
        color: #000;
      }
    }

    .el-tag {
      border-radius: 10px;
      margin-left: 10px;
    }
  }

  .progressContent {
    margin-top: 10px;
    color: grey;
  }

  .videoVersionWrap {
    border-top: 1px solid #f0f0f0;
    margin-top: 20px;
    padding-top: 20px;
  }

  .videoVersionItem, .moreVideoItem {
    background: #fafafc;
    padding: 20px;
    border-radius: 5px;
    cursor: pointer;

    .itemTop {
      display: flex;
      justify-content: space-between;
      padding-bottom: 10px;
      color: #b1a8aa;
    }

    .itemContent {
      border-top: 1px solid #f0f0f0;
      padding: 20px 0;
      display: flex;
      justify-content: flex-start;

      img {
        width: 100px;
        height: 100px;
        margin-right: 20px;
      }

      i {
        font-size: 80px;
        color: rgb(68, 68, 231);
        margin-right: 20px;
      }

      .contentMsg {
        display: flex;
        flex-direction: column;
        justify-content: space-around;

        .date {
          color: #b1a8aa;
        }
      }
    }

    .itemBottom {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      border-top: 1px solid #f0f0f0;

      .infoIcon {
        color: #f2a950;
        font-size: 16px;
        margin-right: 6px;
      }

      i {
        color: #b1a8aa;
      }

      .confirmSuggest {
        color: #b1a8aa;
        width: 20%;
        text-align: right;
        cursor: pointer;
      }

      .suggest {
        color: rgb(68, 68, 231);
        cursor: pointer;
      }
    }
  }

  .stow {
    color: rgb(68, 68, 231);
    cursor: pointer;
    margin-top: 20px;
    width: 12%;
  }

  .moreVideoWrap {
    border-top: 1px solid #f0f0f0;
    padding-top: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;

    .moreVideoItem {
      width: 40%;
      padding-top: 10px;
      padding-bottom: 0px;
      margin-bottom: 10px;
      margin-right: 24px;
      cursor: pointer;

      .itemContent {
        border-bottom: none;

        img {
          width: 40px;
          height: 40px;
        }

        i {
          font-size: 50px;
          color: rgb(68, 68, 231);
        }
      }

    }
  }

  .moreVideoWrap.hidden {
    display: none;
    // opacity: 0;
    height: 0;
    border: none;
  }
</style>
