<template>
  <el-dialog
    title="当前需求详情"
    :visible.sync="show"
    width="600"
    :before-close="handleClose"
  >
    <div class="flex flex-justify-between flex-algin-center">
      <AccountCard :info="data">
        <!-- <template>
          <div>
            <template v-if="data.accountTag">
              <el-tag v-for="item in data.accountTag.split(',')" :key="item" class="account-tag" size="mini">{{ item }}</el-tag>
            </template>
            <template v-if="data.tagValue">
              <el-tag v-for="item in data.tagValue.split(',')" :key="item" class="account-tag" size="mini">{{ item }}</el-tag>
            </template>
          </div>
        </template> -->
      </AccountCard>
      <span>账号状态：{{ ACCOUNT_STATUS_MAP[data.deliveryStatus ] }}</span>
    </div>
    <div v-loading="loading" class="account-info-item m-t-24">
      <el-row :gutter="10">
        <el-col :span="6">广告师：{{ detailInfo.advertiserRealname }}</el-col>
        <el-col :span="6">
          投放专员：{{ detailInfo.connectionHallStatus === 1 ? '暂无' : detailInfo.commissionerRealname || '暂无' }}
          <IconTip
            v-if="detailInfo.connectionHallStatus===1"
            content="需求初始化投放专员建联失败，需求已流转建联大厅等待建联成功"
            icon-class="iconwenhao"
          />
        </el-col>
        <el-col :span="6">计费方式：{{ detailInfo.chargeTypeDesc }}</el-col>
        <el-col :span="6">合作单量：{{ detailInfo.coopOrderMaxNum }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">预期投放价格：{{ detailInfo.preDeliveryAmountMin }}-{{ detailInfo.preDeliveryAmountMax }}</el-col>
        <el-col :span="12">预期发布时间：{{ detailInfo.preReleaseVideoTime||"--" }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">品牌标签：{{ detailInfo.brandTagStr }}</el-col>
        <el-col :span="12">业务标签：{{ detailInfo.businessTag }}</el-col>
      </el-row>

      <el-row v-if="detailInfo.businessTag === 'B2C'" :gutter="10">
        <el-col :span="12">产品型号：{{ detailInfo.b2cPhoneModel || '--' }}</el-col>
      </el-row>

      <el-row>
        <el-col :span="24">备注：{{ detailInfo.remark }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">需求提交时间：{{ detailInfo.createdTime }}</el-col>
        <el-col :span="12">需求有效期：{{ detailInfo.deadlineDateNum }}日</el-col>
      </el-row>
      <el-row v-if="data.contactUserName">
        <el-col>账号建联成功人员：{{ detailInfo.contactUserName }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">需求进度：{{ detailInfo.requirementProgress }}</el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="24">需求进度备注：{{ detailInfo.progressRemark }}</el-col>
      </el-row>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import { useToggle } from '@/hook/index'
import { AccountCard, IconTip } from 'components'
import { $getRequirementDetail } from '@/api/putting-manager'
import { ACCOUNT_STATUS_MAP } from '@/const'

function useGetReuirementDetail(accountId) {
  const ctx = getCurrentInstance().proxy
  const state = reactive({
    detailInfo: {},
    loading: true
  })
  $getRequirementDetail({ accountId }).then(res => {
    if (res.code === 1) {
      state.detailInfo = reactive(res.data)
      state.loading = false
    } else {
      state.loading = false
      ctx.$message.error(res.message)
    }
  })
  return {
    ...toRefs(state)
  }
}

export default defineComponent({
  props: {
    value: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: { AccountCard, IconTip },
  setup(props) {
    const { show, handleClose } = useToggle(props)
    const { detailInfo, loading } = useGetReuirementDetail(props.data.accountId)
    return {
      ACCOUNT_STATUS_MAP,
      show,
      handleClose,
      detailInfo,
      loading
    }
  }
})

</script>
<style scoped lang="scss">
.account-tag {
  margin-right: 5px;
  margin-bottom: 5px;
}
.account-info-item {
  .el-row {
    margin-bottom: 16px;
  }
}
</style>
