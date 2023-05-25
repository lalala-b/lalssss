<template>
  <Wrap class="flex flex-dir-col flex-justify-center">
    <div data-bold class="flex flex-justify-between m-b-20">
      <h2 class="title flex flex-algin-center">资金核算</h2>
      <EditItem v-if="showAction || shouldShowAction" v-model="isEdit" :hidden-cancel="hiddenCancel" @handleSave="handleSave" />
    </div>
    <p v-if="showType === 1" class="status-tip">待完成</p>
    <p v-if="showType === 2" class="status-tip">等待订单资金收支确认！</p>
    <div class="check-info-wrap">
      <h3 v-if="$orderData.businessStatus === 10" class="check-pass">订单已完成！</h3>
    </div>
    <div v-if="showType === 3 || showType === 5">
      <p v-if="showType === 3" class="tip-title">{{ +$orderData.videoExamineInfoVO.orderCooperationStatus === 1 ? '达人' : '我司' }}放弃合作，若在星图/快接单已下单付款需核算，请确认！</p>
      <!-- <p v-if="showType === 6" class="tip-title">我司放弃投放，中止合作！</p> -->
      <!-- <p v-if="showType === 5" class="tip-title">订单不存在返款/补款/合同，提交发布视频后系统默认是已完成订单资金链。</p> -->
      <el-form
        :label-width="isEdit?'140px':''"
        label-suffix="："
      >
        <el-form-item label="实际补款金额">
          <el-input-number
            v-if="isEdit"
            v-model="form.actualAddAmount"
            placeholder="补款金额"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
            @change="handleActualAmount"
          />
          <span v-else>{{ formData.actualAddAmount }}</span>
        </el-form-item>
        <el-form-item label="实际返款金额">
          <el-input-number
            v-if="isEdit"
            v-model="form.actualRebateAmount"
            placeholder="返款金额"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
            @change="handleActualRebateAmount"
          />
          <span v-else>{{ formData.actualRebateAmount }}</span>
        </el-form-item>

        <el-form-item label="实际违约金">
          <el-input-number
            v-if="isEdit"
            v-model="form.actualOrderLiquidatedDamages"
            placeholder="违约金"
            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
            @change="handlequidatedDamages"
          />
          <span v-else>{{ formData.actualOrderLiquidatedDamages }}</span>
        </el-form-item>

        <el-form-item label="实际消耗金额">
          <el-input-number
            v-if="isEdit"
            v-model="form.actualOrderConsumeAmount"
            placeholder="消耗金额"

            class="text-a-l"
            :precision="2"
            :max="100000000"
            :min="0"
            :controls="false"
          />
          <span v-else>{{ actualOrderConsumeAmount1 }}</span>
          <IconTip
            type="popover"
            content="实际消耗金额=投放下单报价+平台手续费 +实际补款金额+ （抖+成本） + 其他成本 - 实际返款金额+实际违约金额"
            icon-class="iconwenhao"
          />
        </el-form-item>

        <el-form-item label="订单已完成">
          <el-radio-group v-if="isEdit" v-model="form.orderCompleteStatus">
            <el-radio :label="1">是，已完成</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
          <span v-else>
            {{ formData.orderCompleteStatus === 1? '是' : '否' }}
          </span>
        </el-form-item>
        <!-- <template v-if="+$orderData.videoExamineInfoVO.orderCooperationStatus !== 1 ">
          <el-form-item v-if="!isEdit&&showType === 3&&$orderData.fundAccountingInfoVO&&$orderData.fundAccountingInfoVO.actualOrderLiquidatedDamages>=0" label="实际支付违约金">
            {{ $orderData.fundAccountingInfoVO.actualOrderLiquidatedDamages }}
          </el-form-item>
          <el-form-item v-if="isEdit&&showType === 3" label="实际支付违约金">
            <el-input-number
              v-if="isEdit"
              v-model="form.actualOrderLiquidatedDamages"
              :disabled="$orderData.businessStatus === 10"
              :min="0"
              :precision="0"
              @blur="handleBlur"
              @input="handleInput"
            />
            <span v-else>{{ form.actualOrderLiquidatedDamages }}</span>
            <span v-if="isEdit && error" class="red">支付违约金不得超过投放订单的平台消耗金额！</span>
          </el-form-item>
        </template> -->
        <el-form-item label="备注">
          <el-input v-if="isEdit" v-model="form.accountingNote" />
          <span v-else>
            {{ formData.accountingNote }}
          </span>
        </el-form-item>
        <el-form-item v-if="!isEdit && form.orderCompleteStatus === 1" label=" 资金核算人员：">
          {{ formData.fundRevieweName }}
        </el-form-item>
      </el-form>
    </div>
    <el-form
      v-if="showType === 4"
      label-width="120px"
      label-suffix="："
    >
      <el-form-item label="星图验收时间">
        <el-date-picker
          v-if="isEdit"
          v-model="form.completeTime"
          placeholder="选择日期"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        />
        <span v-else>{{ formData.completeTime }}</span>
      </el-form-item>
      <!-- <el-form-item label="确认合同">
        <template v-if="isEdit">
          <el-upload
            v-if="!form.confirmContractUrl"
            class="upload-view"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :before-upload="uploadBefore"
            :limit="1"
            :show-file-list="false"
            action="/api/business/order/uploadContract"
          >
            <el-button :loading="uploadLoaing">确认合同</el-button>
          </el-upload>
          <div v-else class="contract">
            <a :href="form.confirmContractUrl" target="_blank" underline="false">{{ form.confirmContractUrl }}</a>
            <i v-if="isEdit" class="el-icon-delete" @click="handleRemoveContract" />
          </div>
        </template>
        <a v-else :href="form.confirmContractUrl" target="_blank" underline="false">{{ form.confirmContractUrl }}</a>
      </el-form-item> -->
      <el-form-item label="实际补款金额">
        <el-input-number
          v-if="isEdit"
          v-model="form.actualAddAmount"
          placeholder="补款金额"
          class="text-a-l"
          :precision="2"
          :max="100000000"
          :min="0"
          :controls="false"
          @change="handleActualAmount"
        />
        <span v-else>{{ formData.actualAddAmount }}</span>
      </el-form-item>
      <el-form-item label="实际返款金额">
        <el-input-number
          v-if="isEdit"
          v-model="form.actualRebateAmount"
          placeholder="返款金额"
          class="text-a-l"
          :precision="2"
          :max="100000000"
          :min="0"
          :controls="false"
          @change="handleActualRebateAmount"
        />
        <span v-else>{{ formData.actualRebateAmount }}</span>
      </el-form-item>

      <el-form-item label="实际违约金">
        <el-input-number
          v-if="isEdit"
          v-model="form.actualOrderLiquidatedDamages"
          placeholder="违约金"
          class="text-a-l"
          :precision="2"
          :max="100000000"
          :min="0"
          :controls="false"
          @change="handlequidatedDamages"
        />
        <span v-else>{{ formData.actualOrderLiquidatedDamages }}</span>
      </el-form-item>

      <el-form-item label="实际消耗金额">
        <el-input-number
          v-if="isEdit"
          v-model="form.actualOrderConsumeAmount"
          placeholder="消耗金额"
          class="text-a-l"
          :precision="2"
          :max="100000000"
          :min="0"
          :controls="false"
        />
        <span v-else>{{ actualOrderConsumeAmount1 }}</span>
        <IconTip
          type="popover"
          content="实际消耗金额=投放下单报价+平台手续费 +实际补款金额+ （抖+成本） + 其他成本 - 实际返款金额+实际违约金额"
          icon-class="iconwenhao"
        />
      </el-form-item>

      <el-form-item label="订单已完成">
        <el-radio-group v-if="isEdit" v-model="form.orderCompleteStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="2">否</el-radio>
        </el-radio-group>
        <span v-else>{{ formData.orderCompleteStatus === 1 ? '是': '否' }}</span>
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-if="isEdit" v-model="form.accountingNote" />
        <span v-else>
          {{ formData.accountingNote }}
        </span>
      </el-form-item>
      <el-form-item v-if="!isEdit && form.orderCompleteStatus === 1" label=" 资金核算人员：">
        {{ formData.fundRevieweName }}
      </el-form-item>
    </el-form>
  </Wrap>
</template>
<script>
import { $saveFundReview } from '@/api/putting-manager'
import { IconTip } from 'components'
import EditItem from './_com/EditItem'

export default {
  components: {
    EditItem,
    IconTip
  },
  data() {
    return {
      isEdit: false,
      showAction: false,
      form: {
        confirmContractUrl: '',
        orderCompleteStatus: 2,
        note: '',
        actualAddAmount: 0,
        actualRebateAmount: 0,
        actualOrderLiquidatedDamages: 0,
        actualOrderConsumeAmount: 0
      },
      uploadLoaing: false,
      error: false,
      formData: {
        actualAddAmount: 0,
        actualRebateAmount: 0,
        actualOrderLiquidatedDamages: 0,
        fundRevieweName: '',
        accountingNote: '',
        completeTime: ''
      }
    }
  },
  inject: ['$orderData'],
  computed: {
    showType() {
      if (!this.$orderData.fundAccountingInfoVO && this.$orderData.businessStatus !== 7) {
        // 显示未完成
        return 1
      }
      if (this.$orderData.businessStatus === 7 || this.$orderData.fundAccountingInfoVO) {
        if (this.$orderData.examineAuth === 2 && !this.$orderData.fundAccountingInfoVO) {
          // 显示等待订单资金收支确认！
          return 2
        } else {
          if ((this.$orderData.videoExamineInfoVO || {}).examineStatus === 2) {
            if (+this.$orderData.videoExamineInfoVO.orderCooperationStatus === 1) {
              // 达人放弃合作
              return 3
            } else {
              // 我司放弃合作
              return 3
            }
          } else if (this.$orderData.midDeliveryVideoNewBaseInfoBO.addAmount || this.$orderData.midDeliveryVideoNewBaseInfoBO.rebateAmount || this.$orderData.midDeliveryVideoNewBaseInfoBO.contractUrl) {
            // 存在合同、补款、返款金额
            return 4
          } else {
            return 5
          }
        }
      }
      return 1
    },
    shouldShowAction() {
      return (this.$orderData.fundAccountingInfoVO && this.$orderData.fundAccountingInfoVO.editAuth === 1) || (this.$orderData.businessStatus === 7 && this.$orderData.examineAuth === 1)
    },

    hiddenCancel() {
      return !this.$orderData.fundAccountingInfoVO
    },
    showShowEdit() {
      if (this.$orderData.businessStatus === 7 && this.$orderData.examineAuth === 1 && !this.$orderData.fundAccountingInfoVO) {
        return true
      }
      return false
    }
  },
  watch: {
    'showShowEdit': {
      immediate: true,
      handler: function(val) {
        this.isEdit = val
      }
    },
    '$orderData': {
      deep: true,
      handler: function(val) {
        if (val) {
          const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = val.midDeliveryVideoNewBaseInfoBO
          if (!val.fundAccountingInfoVO) {
            this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +platServiceCharge + +douMoney + +otherMoney
            this.actualOrderConsumeAmount1 = this.form.actualOrderConsumeAmount
          }
          if (val.fundAccountingInfoVO) {
            const { actualAddAmount = 0, actualRebateAmount = 0, actualOrderLiquidatedDamages = 0 } = val.fundAccountingInfoVO
            this.formData = val.fundAccountingInfoVO
           this.form = {
            ...val.fundAccountingInfoVO
          }
          this.actualOrderConsumeAmount1 = val.fundAccountingInfoVO.actualOrderConsumeAmount
          if (val.fundAccountingInfoVO.actualOrderConsumeAmount === null) {
            this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +actualAddAmount + +platServiceCharge + +douMoney + +otherMoney - +actualRebateAmount + +actualOrderLiquidatedDamages
            this.actualOrderConsumeAmount1 = this.form.actualOrderConsumeAmount
          }
          }
        }
      }
    }
    // '$orderData.fundAccountingInfoVO': {
    //   immediate: true,
    //   deep: true,
    //   handler: function(val) {
    //     const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
    //      if (val) {

    //     }
    //   }
    // },
    // 'form.actualAddAmount': {
    //   immediate: true,
    //   handler(val = 0) {
    //     const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
    //     const { actualRebateAmount = 0, actualOrderLiquidatedDamages = 0 } = this.form
    //     this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +val + +platServiceCharge + +douMoney + +otherMoney - +actualRebateAmount + +actualOrderLiquidatedDamages
    //     console.log('***1 this.form.actualOrderConsumeAmount', this.form.actualOrderConsumeAmount)
    //   }
    // },
    // 'form.actualRebateAmount': {
    //   immediate: true,
    //   handler(val = 0) {
    //     const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
    //     const { actualAddAmount = 0, actualOrderLiquidatedDamages = 0 } = this.form
    //     this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +actualAddAmount + +platServiceCharge + +douMoney + +otherMoney - +val + +actualOrderLiquidatedDamages
    //      console.log('***2 this.form.actualOrderConsumeAmount', this.form.actualOrderConsumeAmount)
    //   }
    // },
    // 'form.actualOrderLiquidatedDamages': {
    //   immediate: true,
    //   handler(val = 0) {
    //     const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
    //     const { actualAddAmount = 0, actualRebateAmount = 0 } = this.form
    //     this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +actualAddAmount + +platServiceCharge + +douMoney + +otherMoney - +actualRebateAmount + +val
    //      console.log('***3 this.form.actualOrderConsumeAmount', this.form.actualOrderConsumeAmount)
    //   }
    // }
  },
  methods: {
    // 保存
    handleSave(fn) {
      const parmas = {
        ...this.form,
        orderId: this.$route.query.orderId
      }
      $saveFundReview(parmas).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.isEdit = false
          this.$emit('update')
        } else {
          const message = res.message || ''
          if (message.indexOf('投放次数' || '已达上限') > -1) {
            this.$emit('handleBusinessDialog')
          } else {
             this.$message.error(res.message)
          }
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }).finally(fn)
    },
    // 上传合同成功
    uploadSuccess(res) {
      if (res.code === 1) {
        this.form.confirmContractUrl = res.data.url
      } else {
        this.$message.error(res.message)
      }
      this.uploadLoaing = false
    },
    uploadBefore() {
      this.uploadLoaing = true
    },
    uploadError(err) {
      console.log(err)
      this.uploadLoaing = false
    },
    handleRemoveContract() {
      this.form.confirmContractUrl = ''
    },
    handleBlur(e) {
      if (!e.target.value) {
        this.form.actualOrderLiquidatedDamages = 0
      }
    },
    handleInput(val) {
      if (+val > (this.$orderData.midDeliveryVideoNewBaseInfoBO || {}).consumeAmount || 0) {
        this.error = true
        return
      } else {
        this.error = false
      }
    },
    handleActualAmount(val) {
      const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
      const { actualRebateAmount = 0, actualOrderLiquidatedDamages = 0 } = this.form
      this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +val + +platServiceCharge + +douMoney + +otherMoney - +actualRebateAmount + +actualOrderLiquidatedDamages
    },
    handleActualRebateAmount(val = 0) {
      const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
      const { actualAddAmount = 0, actualOrderLiquidatedDamages = 0 } = this.form
      this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +actualAddAmount + +platServiceCharge + +douMoney + +otherMoney - +val + +actualOrderLiquidatedDamages
    },
    handlequidatedDamages(val = 0) {
      const { deliveryOfferAmount = 0, platServiceCharge = 0, douMoney = 0, otherMoney = 0 } = this.$orderData.midDeliveryVideoNewBaseInfoBO
      const { actualAddAmount = 0, actualRebateAmount = 0 } = this.form
      this.form.actualOrderConsumeAmount = +deliveryOfferAmount + +actualAddAmount + +platServiceCharge + +douMoney + +otherMoney - +actualRebateAmount + +val
    }
  }
}
</script>
<style lang="scss" scoped>
  .tip-title {
    font-size: 16px;
    color: #272727;
    line-height: 22px;
    margin-bottom: 24px;
  }
  .card-wrap .check-info-wrap h3.check-pass {
    margin-bottom: 8px;
  }
</style>
