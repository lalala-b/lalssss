<template>
  <el-dialog
    :visible.sync="show"
    :title="title"
  >
    <div class="flex flex-justify-between">
      <AccountCard v-if="!isBatch" :info="accoutInfo" />
      <el-radio-group v-model="businessLine" @change="handleRadio">
        <el-radio :label="0">部分业务线设置</el-radio>
        <el-radio :label="1">全部业务线设置</el-radio>
      </el-radio-group>
    </div>
    <p class="tip-red m-t-10">一旦确认后需求提报限制立即生效，已提交的订单不参与此限制！进行中的需求也限制下单。</p>
    <template v-if="showAllFlag">
      <el-form
        label-width="130px"
        class="m-t-16"
      >
        <el-form-item label="每月投放次数上限">
          <el-input-number v-model="editData.curPuttingCount" :min="0" :max="20" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editData.remark"
            placeholder="可填写限制投放的原因，如：黑名单账号可备注具体情况"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
    </template>
    <template v-else>
      <el-form
        label-width="130px"
        class="m-t-16"
        :model="formData"
      >
        <table border="1">
          <thead>
            <tr>
              <td />
              <td>C2B业务</td>
              <td>B2C业务</td>
              <td>C2C业务</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>每月投放次数上限</td>
              <td><el-input-number v-model="formData.c2bMonthDeliveryCount" :min="0" :max="20" /></td>
              <td><el-input-number v-model="formData.b2cMonthDeliveryCount" :min="0" :max="20" /></td>
              <td><el-input-number v-model="formData.c2cMonthDeliveryCount" :min="0" :max="20" /></td>
            </tr>
            <tr>
              <td>备注
                <span>（限制投放的原因，如：黑名单账号具体情况）</span>
              </td>
              <td>
                <el-input
                  v-model="formData.c2bRemark"
                  type="textarea"
                  maxlength="200"
                  show-word-limit
                />
              </td>
              <td><el-input
                v-model="formData.b2cRemark"
                type="textarea"
                maxlength="200"
                show-word-limit
              /></td>
              <td><el-input
                v-model="formData.c2cRemark"
                type="textarea"
                maxlength="200"
                show-word-limit
              /></td>
            </tr>
          </tbody>
        </table>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import AccountCard from '@/components/AccountCard'
import { $limitPutCount, $getPutCountInfo } from '@/api/putting-manager'
// import { isUndef } from '@/utils'
export default {
  components: { AccountCard },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    isBatch: {
      type: Boolean,
      default: false
    },
    accoutInfo: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      editData: {},
      loading: false,
      businessLine: 0,
      showAllFlag: false,
      formData: {
        b2cMonthDeliveryCount: '',
        c2bMonthDeliveryCount: '',
        c2cMonthDeliveryCount: '',
        c2bRemark: '',
        b2cRemark: '',
        c2cRemark: ''
      }
    }
  },
  computed: {
    title() {
      return this.isBatch ? '批量限制投放次数' : '限制投放次数'
    },
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
    // this.editData = {
    //   curPuttingCount: this.accoutInfo.sysPuttingCount,
    //   remark: this.accoutInfo.remark
    // }
    // const { b2cMonthDeliveryCount, c2bMonthDeliveryCount, c2cMonthDeliveryCount, c2bRemark, c2cRemark, b2cRemark } = this.accoutInfo
    // this.formData = {
    //   b2cMonthDeliveryCount,
    //   c2bMonthDeliveryCount,
    //   c2cMonthDeliveryCount,
    //   c2bRemark,
    //   c2cRemark,
    //   b2cRemark
    // }
    this.getPutCountInfo()
  },
  methods: {
    async getPutCountInfo() {
      const res = await $getPutCountInfo({ accountId: this.accoutInfo.accountId })
      if (res.code === 1) {
       this.formData = res.data
      }
    },
    handleUpdate() {
      // 全部业务线设置
      if (this.showAllFlag) {
      this.formData.b2cMonthDeliveryCount = this.formData.c2bMonthDeliveryCount = this.formData.c2cMonthDeliveryCount = this.editData.curPuttingCount
      this.formData.c2bRemark = this.formData.b2cRemark = this.formData.c2cRemark = this.editData.remark
      }
      const params = { ...this.formData }
      if (this.accoutInfo.accountIds && this.accoutInfo.accountIds.length) {
        params.accountIds = this.accoutInfo.accountIds
      }
      if (params.b2cMonthDeliveryCount === undefined || params.c2cMonthDeliveryCount === undefined || params.c2bMonthDeliveryCount === undefined) {
        this.$message.error('每月投放次数上限不能为空')
        return
      }
      // b2c投放上限
      if (params.b2cMonthDeliveryCount === 0 && !params.b2cRemark) {
        this.$message.error('业务线投放次数为0,备注不能为空')
        return
      }
      // c2c投放上限
      if (params.c2cMonthDeliveryCount === 0 && !params.c2cRemark) {
        this.$message.error('业务线投放次数为0,备注不能为空')
        return
      }
      // c2b每月投放上限
      if (params.c2bMonthDeliveryCount === 0 && !params.c2bRemark) {
        this.$message.error('业务线投放次数为0,备注不能为空')
        return
      }
      this.loading = true
      $limitPutCount(params).then(res => {
        this.loading = false
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$emit('update')
          this.show = false
        }
      })
    },
    handleRadio(val) {
      this.showAllFlag = !!val
    }
  }
}
</script>
<style lang="scss" scoped>
td{
  padding: 10px;
  border-color: #d8d9db !important;
}
</style>
