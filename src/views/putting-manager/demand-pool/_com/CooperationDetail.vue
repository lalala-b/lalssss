<template>
  <el-dialog
    v-loading="loading"
    title="查看最近提报详情"
    :visible="show"
    @close="handleClose"
  >
    <el-row>
      <el-col :span="12">
        <AccountCard :info="dataInfo" />
      </el-col>
      <el-col :span="12">
        <div> C2B对接人/保护期： {{ dataInfo.c2bOppositeUserName|emptyFill }}/{{ (dataInfo.c2bOppositeUserName?dataInfo.c2bDeadlineDateNum:'')|emptyFill }}<i class="iconfont iconlianxiren realname-iocn" @click="handleShowList('C2B')" /></div>
        <div> B2C对接人/保护期： {{ dataInfo.b2cOppositeUserName|emptyFill }}/{{ (dataInfo.b2cOppositeUserName?dataInfo.b2cDeadlineDateNum:'')|emptyFill }}<i class="iconfont iconlianxiren realname-iocn" @click="handleShowList('B2C')" /></div>
        <div> C2C对接人/保护期： {{ dataInfo.c2cOppositeUserName|emptyFill }}/{{ (dataInfo.c2cOppositeUserName?dataInfo.c2cDeadlineDateNum:'')|emptyFill }}<i class="iconfont iconlianxiren realname-iocn" @click="handleShowList('C2C')" /></div>
      </el-col>
    </el-row>
    <el-row class="m-t-24" :gutter="20">
      <el-col v-if="!isAdvice" :span="6">广告师：{{ dataInfo.advertiserRealname }}</el-col>
      <el-col :span="6">投放专员：{{ dataInfo.commissionerRealname }}</el-col>
      <el-col v-if="!isAdvice" :span="6">计费方式：{{ dataInfo.chargeTypeDesc }}</el-col>
      <el-col :span="6">合作单量：{{ dataInfo.coopOrderMaxNum }}</el-col>
    </el-row>
    <el-row class="m-t-24" :gutter="20">
      <el-col :span="12">预期投放价格：{{ dataInfo.preDeliveryAmountMin }}-{{ dataInfo.preDeliveryAmountMax }}</el-col>
      <el-col :span="12">预计发布时间：{{ dataInfo.preReleaseVideoTime }}</el-col>
    </el-row>
    <el-row class="m-t-24" :gutter="20">
      <el-col v-if="!isAdvice" :span="12">品牌标签：{{ dataInfo.brandTagStr }}</el-col>
      <el-col v-if="!isAdvice" :span="12">业务标签：{{ dataInfo.businessTag }}</el-col>
      <el-col v-if="!isAdvice" class="m-t-24" :span="12">视频类型：{{ dataInfo.junType }}</el-col>
      <el-col v-if="!isAdvice && data.businessTag === 'B2C'" class="m-t-24" :span="12">产品型号：{{ dataInfo.b2cPhoneModel || '--' }}</el-col>
    </el-row>
    <el-row class="m-t-24">
      <el-col>备注：{{ dataInfo.remark }}</el-col>
    </el-row>
    <el-row v-if="dataInfo.contactUserName" class="m-t-24">
      <el-col>账号建联成功人员：{{ dataInfo.contactUserName }}</el-col>
    </el-row>
    <el-row v-if="!isAdvice" class="m-t-24">
      <el-col>失败原因：{{ dataInfo.bargainingRemark }}</el-col>
    </el-row>
    <Realnamelist v-if="showNameList" v-model="showNameList" :info="dataInfo" :business-line="businessLine" />
  </el-dialog>
</template>
<script>
import { computed, defineAsyncComponent, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { useToggle } from '@/hook'
import AccountCard from '@/components/AccountCard'
import { $getRecentRequirement } from '@/api/bussiness-manage'
export default {
  components: {
    AccountCard,
    Realnamelist: defineAsyncComponent(() => import('../../putting-account/_component/RealnameList'))
  },
  props: {
    value: Boolean,
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    source: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const showNameList = ref(false)
    const { show, handleClose } = useToggle(props)
    const isAdvice = computed(_ => {
      return props.data.source === 2
    })
    const states = reactive({
      dataInfo: {},
      businessLine: '',
      loading: false
    })
    watch(() => props.data, (val) => {
      if (val && Object.keys(val).length) {
        console.log(val)
        states.dataInfo = val
      }
    }, { deep: true, immediate: true })
    const handleShowList = (businessLine) => {
      showNameList.value = true
      states.businessLine = businessLine
    }
    const getRecentRequirement = async() => {
      if (props.source !== 'putting-account') return
      states.loading = true
      const res = await $getRecentRequirement({ accountId: props.data.accountId })
      if (res.code === 1) {
        states.loading = false
        states.dataInfo = res.data
      }
    }
    getRecentRequirement()
    return {
      ...toRefs(states),
      show,
      handleClose,
      isAdvice,
      handleShowList,
      showNameList
    }
  }
}
</script>
<style lang="scss" scoped>
.realname-iocn {
  margin-left: 5px;
  font-size: 14px;
  color: $--color-primary;
  cursor: pointer;
}
</style>
