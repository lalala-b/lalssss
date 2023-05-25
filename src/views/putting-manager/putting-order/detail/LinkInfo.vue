<template>
  <el-dialog
    title="查看link组件信息"
    :visible="show"
    width="960px"
    :destroy-on-close="true"
    @close="$emit('update:show', false)"
  >
    <div class="flex m-r-24-wrap">
      <div><strong>组件ID：</strong>{{ info.id }}</div>
      <div><strong>组件类型：</strong>{{ info.linkUseTypeName || '--' }}</div>
      <div><strong>组件渠道号：</strong>{{ info.androidDeliveryName }}</div>
      <div><strong>组件名称：</strong>{{ info.linkName }}</div>
    </div>
    <div class="flex m-r-24-wrap">
      <div><strong>组件品牌：</strong>{{ info.brandName }}</div>
      <div><strong>团队属性：</strong>{{ info.teamAttribute }}</div>
      <div><strong>组件跳转链路：</strong>{{ info.businessType }}</div>
      <div><strong>投放渠道：</strong>{{ info.deliveryChannel }}</div>
    </div>
    <div v-if="info.linkUseTypeName !== '评论置顶'" class="flex m-r-24-wrap">
      <div><strong>IOS-ID：</strong>{{ info.iosId }}</div>
      <div><strong>IOS应用下载链接：</strong><a :href="info.iosDownloadUrl" target="blank">{{ info.iosDownloadUrl }}</a></div>
    </div>
    <div><strong>Android-投放渠道名称：</strong>{{ info.androidDeliveryName }}</div>
    <div><strong>{{ info.androidDownloadUrlTitle || 'Android-下载链接' }}：</strong><a :href="info.androidDownloadUrl" target="blank">{{ info.androidDownloadUrl }}</a></div>
    <div v-if="info.deliveryChannel==='抖音'" class="flex flex-align-center">
      <strong>转码链接：</strong>
      <span>{{ info.transcodingUrl }}</span>
      <!-- <el-input v-model="info.transcodingUrl" placeholder="转码链接" /> -->
    </div>

    <div v-if="info.deliveryChannel==='抖音'">
      <strong>转码状态：</strong>
      <span>{{ TRANSCODING_STATUS[info.transcodingStatus] }}</span>
    </div>
    <div><strong>Android-下载包名：</strong>{{ info.androidPackageName }}</div>
    <div v-if="info.linkUseTypeName !== '评论置顶'"><strong>APP调起链接：</strong>{{ info.androidAwakenUrl }}</div>
    <div><strong>安卓隐私政策链接：</strong><a :href="info.androidPrivacyPolicyUrl" target="blank">{{ info.androidPrivacyPolicyUrl }}</a></div>
    <div v-if="$orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.clickMonitorUrl"><strong>组件监测链接：</strong><a :href="$orderData.orderPaymentInfoVO.clickMonitorUrl" target="blank">{{ $orderData.orderPaymentInfoVO.clickMonitorUrl }}</a></div>
    <div v-if="$orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.clickMonitorUrl"><strong>曝光监测链接：</strong><a :href="formatUrl($orderData.orderPaymentInfoVO.clickMonitorUrl)" target="blank">{{ formatUrl($orderData.orderPaymentInfoVO.clickMonitorUrl) }}</a></div>
    <!-- <div v-if="info.clickMonitorUrl"><strong>点击监测链接：</strong><a :href="info.clickMonitorUrl" target="blank">{{ info.clickMonitorUrl }}</a></div> -->
  </el-dialog>
</template>
<script>
import { $getLinkDetail } from '@/api/link'
const TRANSCODING_STATUS = {
  0: '无需转码',
  1: '待转码',
  2: '已转码'
}
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      info: {},
      TRANSCODING_STATUS
    }
  },
  created() {
    this.getDetailByLinkId()
  },
  inject: ['$orderData'],
  methods: {
    getDetailByLinkId() {
      $getLinkDetail({
        linkId: this.$orderData.orderPaymentInfoVO.linkId
      }).then(res => {
        if (res.code === 1) {
          this.info = res.data
        } else {
          this.$message.error(res.message || '网络错误')
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message || '网络错误')
      })
    },
    formatUrl(clickMonitorUrl) {
      return clickMonitorUrl.replace('/douyin/track', '/douyin/show')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    line-height: 1.5;
    > div {
      margin-bottom: 28px;
    }
    .m-r-24-wrap {
      > div {
        align-items: center;
        margin-right: 40px;
        &::last-child {
          margin-right: 0;
        }
      }
    }
  }
}
  .flex-0 {
    flex-shrink: 0;
  }
  .flex-content-center {
    align-items: center;
    // align-content: center;
  }
</style>
