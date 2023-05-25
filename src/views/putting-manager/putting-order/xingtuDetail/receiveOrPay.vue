<template>
  <div v-loading="loading" class="conatinerWrap">
    <Wrap v-if="statusType === 'pay'" class="m-t-12">
      <div class="payTime">达人已接收任务，请在 <span>{{ baseTiktokThirdOrderInfo.orderPayBalanceTime ? timestampToTime(baseTiktokThirdOrderInfo.orderPayBalanceTime * 1000) : '--' }}</span> 前支付尾款</div>
    </Wrap>

    <Wrap class="m-t-12">
      <div class="basicHeader">
        <div>
          <div class="headerTop">
            <div class="platTag">
              <img src="//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_25.png" alt="" class="platImg">
              <span>抖音传播</span>
            </div>

            <span class="username text-over-hidden-1">{{ baseTiktokThirdOrderInfo.orderName || '--' }}</span>

            <!-- <div class="tagsWrap">
              <el-tag type="info" size="small">指派</el-tag>
              <el-tag type="info" size="small">一口价结算</el-tag>
            </div> -->
          </div>
          <div class="headerBottom">
            <span>订单金额 <i>¥{{ +baseTiktokThirdOrderInfo.orderTotalPay | toThousands }}</i></span>
            <span>已付定金 <i>¥{{ +baseTiktokThirdOrderInfo.orderDepositAmount | toThousands }}</i></span>
            <div v-if="statusType === 'pay'" class="paymentTip">达人已于 {{ baseTiktokThirdOrderInfo.orderAuthorPriceModifyTime ? timestampToTime(baseTiktokThirdOrderInfo.orderAuthorPriceModifyTime * 1000) : '--' }} 修改报价，请确保金额为协商后价格</div>
          </div>
        </div>

        <div v-if="statusType === 'pay'" class="headLeftWrap">
          <div>待付尾款 <span>¥{{ +baseTiktokThirdOrderInfo.orderRestAmount | toThousands }}</span></div>
          <div>逾期未支付，任务将取消，定金将不退还</div>
        </div>
      </div>

      <div>
        <el-row :gutter="24">
          <el-col :span="12">
            <span>任务ID</span>
            <span>{{ baseTiktokThirdOrderInfo.orderId || '--' }}</span>
          </el-col>
          <el-col :span="12">
            <span>任务类型</span>
            <!-- <span>{{ baseTiktokThirdOrderInfo.orderDesc || '--' }}</span> -->
            <span style="color: red">暂未获取到数据</span>
          </el-col>
          <el-col :span="12">
            <span>任务创建</span>
            <span>{{ baseTiktokThirdOrderInfo.orderCreateTime ? timestampToTime(baseTiktokThirdOrderInfo.orderCreateTime * 1000) : '--' }}</span>
          </el-col>
          <el-col :span="12">
            <span>期望发布</span>
            <span>
              {{ baseTiktokThirdOrderInfo.demandExpirationTime ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTime * 1000)) : '--' }}
              至
              {{ baseTiktokThirdOrderInfo.demandExpirationTimeEnd ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTimeEnd * 1000)) : '--' }}
            </span>
          </el-col>
          <el-col :span="12">
            <span>达人信息</span>
            <span>
              <img v-if="baseTiktokThirdTalentInfo.accountImg" :src="baseTiktokThirdTalentInfo.accountImg" alt="">
              <i v-else class="el-icon-user-solid" />
              <a :href="baseTiktokThirdTalentInfo.getDataUrl" target="_blank">{{ baseTiktokThirdOrderInfo.authorNickName || '--' }}</a>
            </span>
          </el-col>
          <el-col :span="12">
            <span>视频附加组件</span>
            <span>{{ getComponentType(baseTiktokThirdOrderInfo.componentType) }}</span>
          </el-col>
        </el-row>
      </div>
    </Wrap>

    <IntelligentMsgComp :data="data" />
  </div>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { timestampToTime, dateFormat } from '@/utils'
import IntelligentMsgComp from './intelligentMsgComp.vue'
import Wrap from '@/components/public/Wrap'

export default defineComponent({
  props: {
    statusType: {
      type: String,
      default: 'receive'
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    IntelligentMsgComp,
    Wrap
  },

  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      spiderTime: '',
      baseTiktokThirdOrderInfo: {},
      baseTiktokThirdTalentInfo: {}
    })

    watch(() => props.data, (newData) => {
      if (Object.keys(newData).length) {
        const {
          spiderTime = ''
        } = newData
        state.baseTiktokThirdOrderInfo = newData.baseTiktokThirdOrderInfo || {}
        state.baseTiktokThirdTalentInfo = newData.baseTiktokThirdTalentInfo || {}
        state.spiderTime = spiderTime
      }
    })

    const getComponentType = (type) => {
      let str = '--'
      switch (type) {
        case 1:
          str = '落地页组件'
          break
        case 15:
          str = '网服下载组件'
          break
        default:
          break
      }
      return str
    }

    return {
      ...toRefs(state),
      getComponentType,
      timestampToTime,
      dateFormat
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

  .payTime {
    span {
      color: #e26b87
    }
  }

  .basicHeader {
    padding: 10px 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
      margin-bottom: 20px;

    .headerTop {
      display: flex;
      justify-content: flex-start;
      align-items: center;

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
        margin: 0 14px;
      }

      .tagsWrap {
        .el-tag {
          margin: 0 4px;
          border-radius: 10px;
        }
      }
    }

    .headerBottom {
      margin-top: 16px;

      span {
        margin-right: 24px;

        i {
          color: red;
          margin-left: 5px;
          font-weight: 600;
          font-size: 16px;
        }
      }

      .paymentTip {
        margin-top: 16px;
      }
    }

    .headLeftWrap {
      text-align: right;

      div {
        margin: 20px 0;

        span {
          color: red;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }
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

      i {
        font-size: 20px;
        margin-right: 10px;
        color: rgb(68, 68, 231);
      }
    }
  }

  .msgItem {
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 30px;
    padding-bottom: 10px;

    .msgWrap {
      margin-top: 24px;

      .item {
        display: flex;
        margin-bottom: 20px;

          span {
          display: flex;
          align-items: flex-start;

          &:first-child {
            color: rgb(158, 149, 149);
            font-weight: 500;
            width: 12%;
          }
        }
      }
    }
  }
</style>
