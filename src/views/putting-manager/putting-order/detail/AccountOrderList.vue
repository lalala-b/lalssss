<template>
  <el-dialog
    title="账号已提交订单信息"
    :visible.sync="show"
    width="900px"
  >
    <div class="flex flex-align-center">
      <AccountCard :info="info" />
      <p class="m-l-24">该账号{{ info.curOrderMonth }}（预计发布时间所在月）投放次数上限：{{ info.sysPuttingCount }}次</p>
    </div>
    <el-table
      v-scrollbar
      :data="tableData"
    >
      <el-table-column
        prop="orderNumber"
        label="订单号"
      />
      <el-table-column
        prop="businessStatus"
        label="订单状态"
      >
        <span slot-scope="{row}">{{ PUT_ORDER_BUSINESS_STATUS[row.businessStatus] }}</span>
      </el-table-column>
      <el-table-column
        prop="deliveryName"
        label="投放专员"
      />
      <el-table-column
        prop="consumeAmount"
        label="平台消耗金额"
        width="120"
      >
        <span slot-scope="{row}">{{ row.consumeAmount | toThousandsW }}</span>
      </el-table-column>
      <el-table-column
        prop="deliveryMoney"
        label="投放价格"
      >
        <span slot-scope="{row}">{{ row.deliveryMoney | toThousandsW }}</span>
      </el-table-column>
      <el-table-column
        prop="preReleaseVideoTime"
        label="预计发布时间"
        width="160"
      />
      <el-table-column
        prop="addTime"
        label="视频发布时间"
        width="160"
      />
    </el-table>
  </el-dialog>
</template>
<script>
import AccountCard from '@/components/AccountCard'
import { PUT_ORDER_BUSINESS_STATUS } from '@/const'
import { $getSubmitOrderInfo } from '@/api/putting-manager'
export default {
  components: { AccountCard },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      PUT_ORDER_BUSINESS_STATUS,
      tableData: []
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      $getSubmitOrderInfo({
        preReleaseVideoTime: this.info.preReleaseVideoTime,
        orderId: this.info.orderId,
        accountId: this.info.accountId
      }).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
