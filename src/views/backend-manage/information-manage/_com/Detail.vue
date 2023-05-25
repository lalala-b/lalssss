<template>
  <el-dialog
    title="查看信息流链接"
    :visible="show"
    label-suffix="："
    width="60%"
    @close="handleClose"
  >
    <ul class="detail-list">
      <li><strong>状态：</strong>{{ detailData.configStatusValue }}</li>
      <li><strong>创建人：</strong>{{ detailData.createdUserName }}</li>
      <li class="w-50"><strong>创建时间：</strong>{{ detailData.createdTime }}</li>
      <br>
      <li><strong>平台：</strong>{{ detailData.platName }}</li>
      <li><strong>代理商：</strong>{{ detailData.agent }}</li>
      <li><strong>应用：</strong>{{ detailData.brandName }}</li>
      <li><strong>推广目标：</strong>{{ detailData.popularizeTargetValue }}</li>
      <br>
      <li><strong>设备系统：</strong>{{ detailData.systemType }}</li>
      <li><strong>推广业务：</strong>{{ detailData.popularizeBusiness }}</li>
      <li><strong>跳转指定页：</strong>{{ detailData.forwardPage }}</li>
      <br>
      <li class="w-100"><strong>备注：</strong>{{ detailData.remark }}</li>
      <br>
      <li class="w-100"><strong>链接渠道号：</strong>{{ detailData.androidDeliveryName }}</li>
      <br>
      <li class="w-50"><strong>IOS-ID：</strong>{{ detailData.iosId }}</li>
      <li class="w-50">
        <strong>IOS应用下载链接：</strong><el-link :href="detailData.iosDownloadUrl" :underline="false" target="_blank">{{ detailData.iosDownloadUrl }}</el-link>
      </li>
      <br>
      <li class="w-50"><strong>Android-下载链接：</strong><el-link :href="detailData.androidDownloadUrl" :underline="false" target="_blank">{{ detailData.androidDownloadUrl }}</el-link></li>
      <li class="w-50"><strong>Android-下载包名：</strong>{{ detailData.androidPackageName }}</li>
      <br>
      <li class="w-100"><strong>APP调起链接（直达链接)：</strong>{{ detailData.androidAwakenUrl }}</li>
      <br>
      <li class="w-100"><strong>监测回传链接：</strong>{{ detailData.monitorBackUrl }}</li>
      <br>
      <li class="w-100"><strong>安卓隐私政策链接：</strong><el-link :href="detailData.androidPrivacyPolicyUrl" :underline="false" target="_blank">{{ detailData.androidPrivacyPolicyUrl }}</el-link></li>
    </ul>
  </el-dialog>
</template>
<script>
import { useToggle } from '@/hook'
import { $getInformationDetail } from '@/api/information-manage'
import { reactive, toRefs } from '@vue/composition-api'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  setup(props, ctx) {
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      loading: true,
      detailData: {}
    })
    const getDetail = function() {
      state.loading = true
      $getInformationDetail({ id: props.id }).then(res => {
        if (res.code === 1) {
          state.detailData = res.data || {}
        } else {
          ctx.root.$message.error(res.message)
        }
        state.loading = false
      }).catch(err => {
        if (err.__CANCEL__) return
        ctx.root.$message.error(err.message)
        state.loading = false
      })
    }
    getDetail()

    return {
      ...toRefs(state),
      show,
      handleClose
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail-list {
    flex-wrap: wrap;
    > li {
      display: inline-flex;
      vertical-align: top;
      width: 25%;
      line-height: 30px;
      padding: 0 10px 8px ;
      > strong {
        flex-shrink: 0;
      }
      &.w-100 {
        width: 100%;
      }
      &.w-50 {
        width: 50%;
      }
    }
  }
</style>
