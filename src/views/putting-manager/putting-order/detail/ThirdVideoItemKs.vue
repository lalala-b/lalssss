<template>
  <Wrap :loading="thirdLoading" class="third-video-box">
    <div class="flex flex-align-center m-b-20">
      <h2 data-bold class="title m-r-12">第三方视频信息</h2>
      <el-button
        class="m-r-12"
        type="text"
        :disabled="!+thirdPlatVideoInfo.hasDetail"
        @click="handleToThirdDetail"
      >查看平台订单详情
      </el-button>
      <div>数据更新时间：{{ thirdPlatVideoInfo.spiderTime | emptyFill }}</div>
    </div>
    <p class="m-b-12">
      平台订单状态： {{ thirdPlatVideoInfo.orderStatus | emptyFill }}
    </p>
    <p class="m-b-12">
      文案内容： {{ thirdPlatVideoInfo.caption | emptyFill }}
    </p>
    <p v-if="thirdPlatVideoInfo.failureReason" class="red-tip">
      失败原因：{{ thirdPlatVideoInfo.failureReason }}
    </p>
    <div class="flex m-t-24">
      <div v-if="thirdPlatVideoInfo.videoPlayUrl">
        <MyVideo
          :video-url="thirdPlatVideoInfo.videoPlayUrl"
          :cover-url="thirdPlatVideoInfo.coverUrl"
        />
      </div>
      <div v-if="!thirdPlatVideoInfo.videoPlayUrl&&showVideoPositon(thirdPlatVideoInfo.orderStatus)" class="video-positon">
        <i class="el-icon-loading" />
        <div>视频正在爬取</div>
        <div>大约需要几分钟...</div>
      </div>
      <div>
        <template v-if="+thirdPlatVideoInfo.confirmVideo">
          <el-button
            type="primary"
            @click="handlePublicTime"
          >确认视频</el-button>
          <p class="m-t-24">
            如需驳回视频，请线下联系中台进行操作，或直接联系达人重新上传视频
          </p>
        </template>
        <template v-if="thirdPlatVideoInfo.expectedVideoReleaseTime">
          <h1 data-bold>
            期望发布时间： {{ thirdPlatVideoInfo.expectedVideoReleaseTime }}
          </h1>
          <p class="m-t-16">
            期望发布时间为广告师自行填写，<span
              class="red-tip"
            >仍需中台前往聚星进行操作</span>，如需修改发布时间，请线下联系中台进行操作
          </p>
        </template>
        <h1
          v-if="thirdPlatVideoInfo.platReleaseTime"
          class="m-t-24"
          data-bold
        >
          视频发布时间：{{ thirdPlatVideoInfo.platReleaseTime }}
        </h1>
        <h1
          v-else-if="thirdPlatVideoInfo.platExpectedReleaseTime"
          class="m-t-24"
          data-bold
        >
          平台预计发布时间：{{ thirdPlatVideoInfo.platExpectedReleaseTime }}
        </h1>
      </div>
    </div>
    <SetVideoTime
      v-if="videoTimeVisible"
      platform-type="ks"
      :video-time-visible="videoTimeVisible"
      @close="handleVideoTimeClose"
      @update="update"
    />
  </Wrap>
</template>
<script>
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  getCurrentInstance,
  watch
} from '@vue/composition-api'
import SetVideoTime from './SetVideoTime.vue'
import MyVideo from '@/components/MyVideo'
export default defineComponent({
  props: {
    platId: Number | String,
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    SetVideoTime,
    MyVideo
  },
  setup(props, { emit }) {
    const { $router } = getCurrentInstance().proxy
    const $orderData = inject('$orderData')
    const states = reactive({
      thirdLoading: false,
      videoTimeVisible: false,
      thirdPlatVideoInfo: $orderData.thirdPlatVideoInfo || {},
      orderStatusList: ['进行中（视频审核中）', '进行中（视频审核拒绝）', '进行中（待发布）', '进行中（视频待发布）']
    })
    watch(
      () => $orderData.thirdPlatVideoInfo,
      (val) => {
        states.thirdPlatVideoInfo = val
      },
      { deep: true }
    )
    const handlePublicTime = () => {
      states.videoTimeVisible = true
    }
    const handleVideoTimeClose = () => {
      states.videoTimeVisible = false
    }
    // 跳转聚星的详情页
    const handleToThirdDetail = () => {
      const { thirdOrderId } = $orderData.orderPaymentInfoVO
      $router.push({
        path: '/putting-manager/juxing-detail',
        query: {
          thirdOrderId,
          _blank: true
        }
      })
    }
    const update = () => {
      emit('update')
    }
    const showVideoPositon = (status) => {
      return states.orderStatusList.includes(status)
    }
    return {
      ...toRefs(states),
      handleToThirdDetail,
      handlePublicTime,
      handleVideoTimeClose,
      update,
      showVideoPositon
    }
  }
})
</script>
<style lang="scss" scoped>
.third-video-box {
  font-size: 14px;
  .third-title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
}
.video-dialog {
  display: flex;
  align-items: center;
  ::v-deep {
    .el-select {
      width: 120px;
    }
    .hour-select {
      margin-left: 8px;
      .el-select {
        width: 90px;
        margin-right: 2px;
      }
    }
  }
}
.video-positon {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 196px;
  height: 350px;
  background: #eee;
  border-radius: 8px;
  margin-right: 24px;
  color: #898585;
  i {
    font-size: 34px;
    margin-bottom: 12px;
  }
  div{
    font-size: 12px;
  }
}
</style>
