<template>
  <div v-if="detailMsg" v-loading="loading" class="detailContainer">
    <Wrap>
      <div>数据更新时间：{{ detailMsg.spiderTime || '--' }}</div>
    </Wrap>
    <!-- 待接收 / 待付款 -->
    <template v-if="orderStatus === 0 || orderStatus === 1">
      <ReceiveOrPay :status-type="orderStatus === 1 ? 'receive' : 'pay'" :data="detailMsg" />
    </template>

    <!-- 进行中 / 已完成 -->
    <template v-else>
      <ProgressOrFinish :data="detailMsg" />
    </template>
  </div>
  <div v-else class="no-data-wrapper">
    <div>
      <img src="https://pic5.zhuanstatic.com/zhuanzh/n_v268b528a982464172a57aec764b85915a.png">
      <p style="text-align:center;margin-top:-60px;">暂无订单详情信息({{ thirdOrderId }})～</p>
    </div>
  </div>
</template>
<script>
import { $getThirdOderDetail } from '@/api/putting-manager'
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import ReceiveOrPay from './receiveOrPay.vue'
import ProgressOrFinish from './progressOrFinish.vue'

export default defineComponent({
  components: {
    ReceiveOrPay,
    ProgressOrFinish
  },

  setup(props, { emit }) {
    const { $nextTick, $route, $message, $alert } = getCurrentInstance().proxy
    const { navigator } = window
    const state = reactive({
      loading: false,
      orderStatus: 1,
      detailMsg: {},
      thirdOrderId: ''
    })

    /**
      当前订单状态
      待付款 0,
      待接收 1,
      制作脚本 2,
      达人已上传脚本 6,
      等待达人上传视频 3,
      视频已上传，平台审核中 8,
      视频审核未通过，等待达人重新上传 7,
      已反馈，待达人重新上传 5,
      达人已上传视频，请尽快确认 9,
      发布视频 10,
      视频已发布，请尽快验收 11,
      已验收 12,
      达人发起取消任务 4,
      达人订单已取消 16
     */

    $nextTick(() => {
      document.getElementById('appMain').scrollTo({
       top: 0
      //  behavior: 'smooth'
     })
    })

    const getOrderDetail = async() => {
      const { thirdOrderId } = $route.query
      state.thirdOrderId = thirdOrderId
      state.loading = true
      const { code, data } = await $getThirdOderDetail({
        thirdOrderId
      })
      if (+code === 1) {
        state.detailMsg = data
        state.orderStatus = state.detailMsg.orderStatus

        if (state.orderStatus === null) {
          $alert('该订单状态未知，请联系黎永渝', '', {
            confirmButtonText: '复制订单信息并关闭',
            showClose: false,
            callback: action => {
              navigator.clipboard.writeText(`订单ID：${thirdOrderId}`).then()
              $message.success('复制成功')
            }
          })
          state.orderStatus = 1
        } else if (state.orderStatus === 16) {
          $alert('该订单已取消', '', {
            confirmButtonText: '确定',
            showClose: false
          })
          state.orderStatus = 1
        }
      }
      state.loading = false
    }

    getOrderDetail()

    return {
      ...toRefs(state)
    }
  }
})
</script>
<style lang="scss" scoped>
  .detailContainer {
    font-size: 14px;
  }

  .no-data-wrapper{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
