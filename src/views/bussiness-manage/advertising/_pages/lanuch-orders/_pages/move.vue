<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-23 10:32:56
 * @LastEditTime: 2020-12-23 11:24:43
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    v-if="show"
    title="移交投放订单"
    :visible="show"
    width="700px"
    @close="handleClose"
    @open="getTransferCondition"
  >
    <div class="flex flex-justify-between m-b-24">
      <div><strong>订单号：</strong>{{ infoData.orderNumber }}</div>
      <div><strong>平台：</strong>{{ infoData.platName }}</div>
      <div><strong>账号：</strong>{{ infoData.accountName }}</div>
      <div><strong>投放价格：</strong>{{ infoData.deliveryMoney }}</div>
    </div>
    <p v-if="+infoData.orderTransferFlag===0" class="red-tip">当前订单已计算军功，移交订单后，不会重新计算军功。</p>
    <p v-if="btnDisabled" class="red-tip m-b-12">广告师、投放专员或者编导任意一个有改动才能移交！</p>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <!-- <el-form-item label="当前广告师：">{{ infoData.advertiserRealname }}</el-form-item> -->
      <el-form-item label="广告师：" prop="advertiserUserId">
        <el-select v-model="form.advertiserUserId" filterable clearable>
          <el-option
            v-for="item in receiveUserList"
            :key="item.userId"
            :label="item.realname"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <p v-if="infoData.advertiserUserId !== form.advertiserUserId" class="tip-red m-b-24">请知悉：移交广告师后，仅针对投放订单的广告师进行变更，订单需求提报的广告师、已计算军功的视频编辑人员不做调整，可能影响用户绩效。</p>

      <!-- <el-form-item label="当前投放专员：">{{ infoData.deliveryName }}</el-form-item> -->
      <el-form-item label="投放专员：" prop="deliveryId">
        <el-select v-model="form.deliveryId" filterable>
          <el-option
            v-for="item in receiveUserList"
            :key="item.userId"
            :label="item.realname"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="编导：" prop="choreographerId" :required="!!oldChoreographerId">
        <el-select v-model="form.choreographerId" filterable clearable>
          <el-option
            v-for="item in receiveUserList"
            :key="item.userId"
            :label="item.realname"
            :value="item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="移交原因:" prop="transferReason">
        <el-input
          v-model="form.transferReason"
          type="textarea"
          placeholder="选填，限长100字"
          maxlength="100"
          show-word-limit
        />
      </el-form-item>
      <p style="margin-left:100px;color:#2c64ff" @click="handleHistory">历史移交记录</p>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" :disabled="btnDisabled" type="primary" @click="handleMove">确 定</el-button>
    </div>

  </el-dialog>
</template>
<script>
import { $getTransferCondition, $transferOrder } from '@/api/bussiness-manage'
import { $transferOrderNew } from '@/api/putting-manager'

export default {
  props: {
    show: Boolean,
    pageType: {
      type: String,
      default: ''
    },
    infoData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        deliveryId: '',
        advertiserUserId: '',
        choreographerId: ''
      },
      rules: {
        deliveryId: [{ required: true, message: '请选择投放专员', trigger: 'change' }],
        advertiserUserId: [{ required: true, message: '请选择广告师', trigger: 'change' }],
        choreographerId: [{ validator: (rule, value, callback) => {
          if (!!this.oldChoreographerId && !value) {
            return callback(new Error('请选择编导人员'))
          } else {
            return callback()
          }
        }, message: '请选择编导人员', trigger: 'change' }]
      },
      receiveUserId: '',
      receiveUserList: [],
      loading: false,
      showHistory: false,
      oldAdvertiserUserId: '',
      oldDeliveryId: '',
      oldChoreographerId: '',
      btnDisabled: true
    }
  },
  watch: {
    infoData: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val).length) {
          this.oldDeliveryId = val.deliveryId
          this.oldAdvertiserUserId = val.advertiserUserId
          this.oldChoreographerId = val.choreographerId
        }
      },
      deep: true
    },
    'form.deliveryId': function(val) {
      if (val) {
        this.btnDisabled = +val === +this.oldDeliveryId
      }
    },
    'form.advertiserUserId': function(val) {
      if (val) {
        this.btnDisabled = +val === +this.oldAdvertiserUserId
      }
    },
    'form.choreographerId': function(val) {
      if (val) {
        this.btnDisabled = +val === +this.oldChoreographerId
      }
    }
  },
  created() {
    this.form.deliveryId = this.infoData.deliveryId
    this.form.advertiserUserId = this.infoData.advertiserUserId
     this.form.choreographerId = this.infoData.choreographerId ? this.infoData.choreographerId : ''
    if (this.pageType === 'putting_order') {
      this.getTransferCondition()
    }
  },
  methods: {
    // 获取投放专员名单
    getTransferCondition() {
      if (this.receiveUserList.length > 0) {
        return
      }
      $getTransferCondition().then(res => {
        if (res.code === 1) {
          this.receiveUserList = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    // 移交
    handleMove() {
      const orderNumber = this.infoData.orderNumber
      const ajax = this.pageType === 'putting_order' ? $transferOrderNew : $transferOrder
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          ajax({ orderNumber, ...this.form }).then(res => {
            if (res.code === 1) {
              this.handleClose()
              this.$emit('success')
              this.$message.success('操作成功')
            } else {
              this.$message.error(res.message)
            }
            this.loading = false
          }).catch(err => {
            if (err.__CANCEL__) {
              return
            }
            this.loading = false
            this.$message.error(err.message)
          })
        }
      })
    },
    handleClose() {
      this.receiveUserId = ''
      this.$emit('update:show', false)
    },
    handleHistory() {
     this.$emit('handleHistoryDialog')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-form-item__label {
    text-align: justify;
    text-align-last: justify;
    &::after{
      content: "";
      position: absolute;
    }
  }
}
</style>
