<template>
  <div v-loading="loading" class="rightContentWrap">
    <Wrap class="m-t-12">
      <div class="rightContent">
        <div class="platTag">
          <img src="//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_25.png" alt="" class="platImg">
          <span>抖音传播</span>
        </div>

        <!-- <div class="tagsWrap">
          <el-tag type="info" size="small">指派</el-tag>
          <el-tag type="info" size="small">一口价结算</el-tag>
        </div> -->

        <div class="username">{{ baseTiktokThirdOrderInfo.orderName || '--' }}</div>

        <div>任务ID：{{ baseTiktokThirdOrderInfo.orderId || '--' }}</div>
        <div>品牌ID：{{ baseTiktokThirdOrderInfo.orderYuntuBrandId || '--' }}</div>

        <div class="labelItem">
          <p>订单金额</p>
          <p class="redFront">¥{{ baseTiktokThirdOrderInfo.orderTotalPay | toThousands }}</p>
        </div>

        <!-- <div class="labelItem">
          <p>结算方式</p>
          <p>一口价结算</p>
        </div> -->

        <template v-if="showBtn">
          <div class="labelItem">
            <p>达人昵称</p>
            <p>{{ baseTiktokThirdTalentInfo.authorNickName || '--' }}</p>
          </div>

          <div class="labelItem">
            <p>达人电话</p>
            <p>{{ baseTiktokThirdTalentInfo.authorDisplayPhone || '--' }}</p>
          </div>
        </template>

        <div class="labelItem">
          <p>期望发布时间</p>
          <p>{{ baseTiktokThirdOrderInfo.demandExpirationTime ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTime * 1000)) : '--' }}
            至
            {{ baseTiktokThirdOrderInfo.demandExpirationTimeEnd ? dateFormat('YYYY-mm-dd', new Date(baseTiktokThirdOrderInfo.demandExpirationTimeEnd * 1000)) : '--' }}
          </p>
        </div>

        <div class="labelItem">
          <p>期望保留时长</p>
          <p>{{ baseTiktokThirdTaskInfo.demandExpectRemainTime || 0 }}天</p>
        </div>

        <div class="labelItem">
          <p>服务类型</p>
          <p>{{ baseTiktokThirdOrderInfo.orderDesc || '--' }}</p>
        </div>
      </div>

      <div v-if="showBtn" class="btnWrap">
        <el-button type="text" @click="handleToDetailTaskMsg">详细任务要求</el-button>
      </div>
    </Wrap>
  </div>
</template>
<script>
import { defineComponent, watch, reactive, toRefs } from '@vue/composition-api'
import { dateFormat } from '@/utils'
import Wrap from '@/components/public/Wrap'

export default defineComponent({
  props: {
    showBtn: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    Wrap
  },

  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      baseTiktokThirdOrderInfo: {},
      baseTiktokThirdTalentInfo: {},
      baseTiktokThirdTaskInfo: {}
    })

     watch(() => props.data, (newData) => {
      if (Object.keys(newData).length) {
        state.baseTiktokThirdOrderInfo = newData.baseTiktokThirdOrderInfo || {}
        state.baseTiktokThirdTalentInfo = newData.baseTiktokThirdTalentInfo || {}
        state.baseTiktokThirdTaskInfo = newData.baseTiktokThirdTaskInfo || {}
      }
    }, {
      immediate: true
    })

    const handleToDetailTaskMsg = () => {
      emit('openDrawer')
    }

    return {
      ...toRefs(state),
      dateFormat,
      handleToDetailTaskMsg
    }
  }
})
</script>
<style lang="scss" scoped>
  .rightContentWrap {
      width: 100%;
      font-size: 14px;
      flex: 1.5;

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
      border-top: 1px solid #f0f0f0;
      padding-top: 16px;
      margin-top: 20px;
    }
  }
</style>
