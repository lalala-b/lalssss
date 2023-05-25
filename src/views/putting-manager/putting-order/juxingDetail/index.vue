<template>
  <div v-loading="loading" class="juxing">
    <template v-if="detail">
      <div class="time-update-wrapper m-b-12">
        <div>数据更新时间：{{ detail.spiderTime }}</div>
      </div>
      <Wrap class="m-b-12">
        <div
          v-if="+detail.orderProgress === 4 || +detail.orderProgress === 5"
          class="m-b-32"
        >
          <el-steps
            :active="activeStep"
            finish-status="success"
            :align-center="true"
          >
            <el-step title="达人接单" />
            <el-step title="制作视频" />
            <el-step title="审核视频" />
            <el-step title="发布视频" />
            <el-step title="完成订单" />
          </el-steps>
        </div>
        <div class="flex flex-justify-between">
          <div class="flex step-tip">
            <i
              v-if="+detail.orderProgress !== 4"
              class="el-icon-warning icon-warning"
            />
            <div>
              <p class="step-tip-status">{{ detail.orderStatusStr }}</p>
              <p>{{ detail.orderStatusDesc }}</p>
            </div>
          </div>
          <!-- <div v-if="+detail.orderProgressRunning === 5" class="m-t-24">
          <el-popover placement="bottom" width="186" trigger="hover">
            <img
              style="width: 160px; height: 160px"
              src="//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_25.png"
            >
            <p style="fontWeight: 600; textAlign: center">打开快手扫一扫</p>
            <el-button
              slot="reference"
              type="primary"
              plain
            >预览发布</el-button>
          </el-popover>
        </div> -->
        </div>
      </Wrap>
      <template
        v-if="
          +detail.orderProgress === 5 ||
            (+detail.orderProgress === 4 &&
              [3, 7].includes(+detail.orderProgressRunning))
        "
      >
        <FlowRate :detail="detail" />
      </template>
      <!--
        逻辑调整：由于聚星改版视频审核中也有视频 调整为有视频就展示
         v-if="
          +detail.orderProgress === 5 ||
            (+detail.orderProgress === 4 &&
              [4, 5, 6, 7].includes(+detail.orderProgressRunning))
        " -->
      <template
        v-if="detail.photoUrl"
      >
        <PostVideo :detail="detail" />
      </template>
      <JuxingOrderInfo :detail="detail" />
    </template>
    <div v-else class="no-data-wrapper">
      <div>
        <img src="https://pic5.zhuanstatic.com/zhuanzh/n_v268b528a982464172a57aec764b85915a.png">
        <p style="text-align:center;margin-top:-60px;">暂无订单详情信息({{ thirdOrderId }})～</p>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import JuxingOrderInfo from './JuxingOrderInfo.vue'
import FlowRate from './FlowRate.vue'
import PostVideo from './PostVideo.vue'
import { $getKuaishouDetail } from '@/api/juxing-detail'
export default defineComponent({
  props: {
    statusType: {
      type: Number,
      default: 0
    }
  },

  components: {
    JuxingOrderInfo,
    FlowRate,
    PostVideo
  },

  setup(props, { emit }) {
    const { $message, $route } = getCurrentInstance().proxy
    const { thirdOrderId } = $route.query
    // 订单状态orderProgress 1: 改价中（待确认价格）；2：待支付（先忽略）；3：审核中（订单待审核）；4：进行中；5：已结束（订单成功）；6：已失效（已取消）
    // 订单进行中状态orderProgressRunning 1：达人接单（待达人接单）；2：制作视频（待达人上传视频）；3：审核视频（视频审核中）；4：发布视频（视频审核拒绝）；5：发布视频（待发布）；6：发布视频（视频待发布）；7：发布视频（发布完成）
    const states = reactive({
      loading: false,
      activeStep: 0,
      detail: {}
    })
    const getKuaishouDetail = async() => {
      states.loading = true
      try {
        const res = await $getKuaishouDetail({ orderId: thirdOrderId })
        if (res.code === 1) {
          states.loading = false
          states.detail = res.data
          states.activeStep = res.data.status ? res.data.status - 1 : 0
        }
      } catch (error) {
        states.loading = false
        $message.error(error)
      }
    }
    getKuaishouDetail()
    return {
      ...toRefs(states),
      thirdOrderId
    }
  }
})
</script>
<style lang="scss" scoped>
.juxing {
  font-size: 14px;
  width: 100%;
  height: 100%;
  ::v-deep {
    .el-form-item {
      margin-bottom: 16px;
    }
    // .el-step__head.is-process{
    //   .el-step__icon{
    //     background: #2c64ff;
    //     border: #2c64ff;
    //     color: #fff;
    //   }
    // }
  }

  .time-update-wrapper {
    padding: 12px 24px;
    background: #fff;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  .step {
    &-tip-status {
      font-size: 20px;
      font-weight: 600;
      line-height: 40px;
    }
  }
  .icon {
    &-warning {
      font-size: 24px;
      color: #f6bd15;
      line-height: 40px;
      margin-right: 4px;
    }
  }
  .kuaishou-Qr {
    width: 80px;
    height: 80px;
  }
  .no-data-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
