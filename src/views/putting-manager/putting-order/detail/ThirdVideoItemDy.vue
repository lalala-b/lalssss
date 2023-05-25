<!-- eslint-disable vue/no-template-shadow -->
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
    <p v-if="thirdPlatVideoInfo.orderChildrenStatus" class="m-b-12">
      平台订单子状态： {{ thirdPlatVideoInfo.orderChildrenStatus }}
    </p>
    <div v-if="thirdPlatVideoInfo.resourceTitle">
      视频标题：{{ thirdPlatVideoInfo.resourceTitle }}
    </div>
    <div class="flex m-t-24">
      <div v-if="thirdPlatVideoInfo.videoPlayUrl">
        <MyVideo
          :video-url="thirdPlatVideoInfo.videoPlayUrl"
          :cover-url="thirdPlatVideoInfo.coverUrl"
        />
      </div>
      <div>
        <template v-if="thirdPlatVideoInfo.auditBanInfo">
          <el-card class="box-card m-b-24">
            <h4 class="m-b-24">审核结果</h4>
            <div
              v-for="(item, index) in thirdPlatVideoInfo.auditBanInfo"
              :key="index"
              class="flex m-b-16"
            >
              <div class="m-r-48 box-card-title">
                <i
                  :class="
                    +item.auditStatus === 1
                      ? 'el-icon-success'
                      : +item.auditStatus === 99
                        ? 'el-icon-warning'
                        : 'el-icon-error'
                  "
                />
                {{ item.auditType === 'content' ? '内容审核' : '搜索词审核' }}
              </div>
              <div class="box-card-value">
                <div v-if="+item.auditStatus === 1">
                  {{
                    item.auditType === 'content'
                      ? '内容审核已通过，可以发布作品至抖音'
                      : '搜索词审核已通过'
                  }}
                </div>
                <div v-else-if="+item.auditStatus === 99">
                  {{
                    item.auditType === 'content'
                      ? '内容审核中，6小时内会返回审核结果'
                      : '搜索词审核中，审核通过即生效，审核不通过可继续修改搜索词'
                  }}
                </div>
                <template v-else>
                  <div class="red-tip">
                    {{
                      item.auditType === 'content'
                        ? '内容审核未通过，达人需要修改作品'
                        : '搜索词审核未通过，若此时发布视频则搜索词不生效;您可以修改重新提交，或先确认视频，确认后继续修改搜索词，若重新审核通过则仍旧生效'
                    }}
                  </div>
                  <div v-if="item.auditBanReason">
                    <p>拒绝理由</p>
                    <div
                      v-for="(
                        item, index
                      ) in thirdPlatVideoInfo.auditdetailList"
                      :key="item.id"
                    >
                      <p>{{ index + 1 }}. {{ item.auditSuggest }}</p>
                      <div class="timePointWrap">
                        <p><i class="dot" /> {{ item.banTime }}</p>
                        <p v-html="formatHtml(item.banPoint)" />
                      </div>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </el-card>
        </template>
        <!-- confirmVideo 1支持确认 0 不支持 -->
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
          <h1 class="m-t-32" data-bold>
            期望发布时间：
            {{ thirdPlatVideoInfo.expectedVideoReleaseTime }}
          </h1>
          <p class="m-t-16">
            期望发布时间为广告师自行填写，<span
              class="red-tip"
            >仍需中台前往星图进行操作</span>，如需修改发布时间，请线下联系中台进行操作
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
      platform-type="dy"
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
      thirdPlatVideoInfo: $orderData.thirdPlatVideoInfo || {}
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
    // 跳转到星图详情页
    const handleToThirdDetail = () => {
      const { thirdOrderId } = $orderData.orderPaymentInfoVO
      $router.push({
        path: '/putting-manager/xingtu-detail',
        query: {
          thirdOrderId,
          _blank: true
        }
      })
    }
    const update = () => {
      emit('update')
    }
    const formatHtml = (content) => {
      return content.replace(/\/n/g, '<br>')
    }
    return {
      ...toRefs(states),
      handleToThirdDetail,
      handlePublicTime,
      handleVideoTimeClose,
      update,
      formatHtml
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
  .box-card {
    width: 550px;
    &-title {
      width: 100px;
    }
    &-value {
      flex: 1;
      color: #898585;
    }
    .el-icon-success {
      margin-right: 4px;
      color: #3edd95;
    }
    .el-icon-warning {
      margin-right: 4px;
      color: #fecd6c;
    }
    .el-icon-error {
      margin-right: 4px;
      color: red;
    }
  }
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #b1a8aa;
    display: inline-block;
    margin-right: 6px;
  }

  .timePointWrap {
    padding-left: 16px;
  }
}
</style>
