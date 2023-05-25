<template>
  <div class="product-box">
    <el-form
      v-if="+conversionType === 3"
      label-width="120px"
      label-position="left"
    >
      <el-form-item label="品牌活动描述">{{
        detail.adDesc | emptyFill
      }}</el-form-item>
      <el-form-item label="活动引导词">{{
        detail.adGuideWord | emptyFill
      }}</el-form-item>
      <el-form-item label="品牌活动宣传图">
        <template v-if="detail.appIconUrl">
          <img style="width:140px" :src="detail.appIconUrl" alt="">
        </template>
        <template v-else>--</template>
      </el-form-item>
      <el-form-item label="品牌异形图">
        <template v-if="detail.specialShapedIconUrl">
          <img style="width:140px" :src="detail.specialShapedIconUrl" alt="">
        </template>
        <template v-else>--</template>
      </el-form-item>
      <el-form-item label="appLink">{{ detail.appLink|emptyFill }}</el-form-item>
      <el-form-item label="落地页">
        <div class="flex">
          <div class="m-r-32">{{ detail.webUrl | emptyFill }}</div>
          <el-link
            v-if="detail.webUrl"
            style="width:100px"
            :href="detail.webUrl"
            type="primary"
            :underline="false"
            target="_blank"
          >预览</el-link>
        </div>
      </el-form-item>
    </el-form>
    <el-form v-else label-width="140px" label-position="left">
      <el-form-item label="下载描述">{{
        detail.downloadAdDesc | emptyFill
      }}</el-form-item>
      <el-form-item label="下载按钮文案">{{
        detail.downloadAdGuideWord | emptyFill
      }}</el-form-item>
      <el-form-item label="IOS商店跳转地址">
        <div class="flex">
          <div class="m-r-32">{{ detail.downloadIosUrl | emptyFill }}</div>
          <el-link
            v-if="detail.downloadIosUrl"
            style="width:100px"
            type="primary"
            :href="detail.downloadIosUrl"
            :underline="false"
            target="_blank"
          >预览</el-link>
        </div>
      </el-form-item>
      <el-form-item label="IOS应用名称">{{
        detail.downloadIosAppName | emptyFill
      }}</el-form-item>
      <el-form-item label="安卓应用下载地址">
        <div class="flex">
          <div class="m-r-32">{{ detail.downloadAndroidUrl | emptyFill }}</div>
          <el-link
            v-if="detail.downloadAndroidUrl"
            :href="detail.downloadAndroidUrl"
            type="primary"
            style="width:100px"
            :underline="false"
            target="_blank"
          >预览</el-link>
        </div>
      </el-form-item>
      <el-form-item label="安卓应用名称">{{
        detail.downloadAndroidAppName | emptyFill
      }}</el-form-item>
      <el-form-item label="安卓应用包名">{{
        detail.downloadPackageName | emptyFill
      }}</el-form-item>
      <el-form-item label="安卓隐私政策">{{
        detail.downloadPrivacyPolicyUrl | emptyFill
      }}</el-form-item>
    </el-form>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    conversionType: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    console.info('-------------props', props)
    // const { $message } = getCurrentInstance().proxy
    const handleShowMore = () => {
      console.info('-----')
    }
    return {
      handleShowMore
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item {
    margin-bottom: 0px !important;
  }
}
.product-box {
  background: #f5f7f9;
  padding: 16px;
}
</style>
