<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="show"
    width="600px"
    :before-close="handleClose"
  >
    <template v-if="!loading">
      <p class="m-b-12 red-tip">{{ info.platName }}-{{ info.accountName }}，{{ info.curMonth }}月业务线投放次数{{ info.sysPuttingCount }}次已达上限。如仍需投放合作请先联系军长调整投放次数。</p>
      <p v-if="month">{{ month }}月{{ info.businessLine }}相应合作信息：</p>
      <el-table
        ref="accounts"
        :data="tableData"
      >
        <el-table-column label="当前类别" prop="curType" width="90" />
        <el-table-column label="需求ID/订单号" prop="requirementOrOrderNumber" width="170" />
        <el-table-column label="投放次数生效字段" prop="activeDeliveryCol" width="200" />
        <el-table-column label="广告师" prop="advertiserUserName" width="90" />
      </el-table>
    </template>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getBusinessDeliveryInfo } from '@/api/bussiness-manage'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    businessLine: {
      type: String,
      default: ''
    },
    accountId: {
      type: Number,
      default: ''
    },
    businessLineDate: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      loading: false,
      tableData: [],
      info: {},
      month: ''
    })
    const getBusinessDeliveryInfo = async() => {
      const params = { accountId: props.accountId, businessLine: props.businessLine, businessLineDate: props.businessLineDate }
      state.loading = true
      const res = await $getBusinessDeliveryInfo(params)
      if (res.code === 1 && res.data) {
        state.info = res.data
        if (state.info.curMonth) {
          const item = state.info.curMonth.split('-')[1]
          state.month = String(item).includes(0) ? String(item)[1] : item
        }
        state.loading = false
        state.tableData = res.data.businessDeliveryInfo
      }
    }
    getBusinessDeliveryInfo()
    return {
      ...toRefs(state),
      show,
      handleClose
    }
  }
})
</script>
