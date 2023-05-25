<template>
  <el-form
    ref="form"
    class="m-t-10"
    :class="{'form-edit': isEdit}"
    :inline="true"
    :label-width="isEdit?'160px':''"
    label-suffix="："
    :model="formData"
    :rules="isEdit?rules:{}"
  >
    <el-form-item v-if="$orderData.orderPaymentInfoVO" label="审批下单付款人员" block>
      <span>{{ $orderData.orderPaymentInfoVO.userName }}</span>
    </el-form-item>
    <el-form-item label="组件类型">
      <el-select
        v-if="isEdit"
        v-model="formData.linkUseType"
        clearable
        @change="getLinkBusinessType"
      >
        <el-option
          v-for="(val, key) in LINK_USE_TYPE"
          :key="key"
          :value="key"
          :label="val"
          :disabled="$orderData.midDeliveryVideoNewBaseInfoBO.platId === 25 && key === 'comment_set_top' && $orderData.midDeliveryVideoNewBaseInfoBO.businessTag !== 'C2B' && $orderData.midDeliveryVideoNewBaseInfoBO.businessTag !== 'B2C'"
        />
      </el-select>
      <span v-else>{{ LINK_USE_TYPE[$orderData.orderPaymentInfoVO.linkUseType] }}</span>
    </el-form-item>
    <el-form-item label="组件跳转链路" prop="linkBusinessType">
      <el-select
        v-if="isEdit"
        v-model="formData.linkBusinessType"
        clearable
      >
        <el-option v-for="item in linkBusinessTypeList" :key="item.configValue" :value="item.configValue" :label="item.configName" />
      </el-select>
      <span v-else>{{ $orderData.orderPaymentInfoVO.linkBusinessTypeCHN }}</span>
    </el-form-item>
    <el-form-item label="组件渠道号">
      <el-link :underline="false" @click="showLinkInfo">{{ hasLink? $orderData.orderPaymentInfoVO.androidDeliveryName : '系统自动生成' }}</el-link>
    </el-form-item>
    <br>
    <el-form-item label="下单组件标题" prop="videoServiceTitle">
      <el-input v-if="isEdit" v-model="formData.videoServiceTitle" maxlength="30" placeholder="请输入" />
      <span v-else>{{ $orderData.orderPaymentInfoVO.videoServiceTitle || '--' }}</span>
    </el-form-item>
    <!-- <el-form-item v-if="$orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.clickMonitorUrl" block label="监测链接">
      <el-link
        :underline="false"
        :href="$orderData.orderPaymentInfoVO.clickMonitorUrl"
        target="_blank"
        style="word-break: break-all;"
      >{{ $orderData.orderPaymentInfoVO.clickMonitorUrl }}</el-link>
    </el-form-item> -->
    <el-form-item v-if="!isEdit" label="投放订单名称">
      {{ $orderData.orderPaymentInfoVO.orderName }}
      <!-- <el-link :underline="false" @click="showLinkInfo">{{ hasLink? $orderData.orderPaymentInfoVO.androidDeliveryName : '系统自动生成' }}</el-link> -->
    </el-form-item>
    <el-form-item label="下单时间" prop="orderTime">
      <el-date-picker
        v-if="isEdit"
        v-model="formData.orderTime"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"
      />
      <span v-else>{{ $orderData.orderPaymentInfoVO.orderTime }}</span>
    </el-form-item>
    <!-- <br> -->

    <el-form-item label="平台下单账户" prop="xtAccountId">
      <el-select
        v-if="isEdit"
        v-model="formData.xtAccountId"
        clearable
        @change="handlextAccount"
      >
        <el-option v-for="(val, key) in XT_ACCOUNT_ID" :key="key" :value="Number(key)" :label="val" />
      </el-select>
      <span v-else>{{ XT_ACCOUNT_ID[$orderData.orderPaymentInfoVO.xtAccountId] }}</span>
    </el-form-item>

    <!-- :rules="[1,2,3].includes(Number(formData.xtAccountId))?rules.thirdOrderId:[]" -->
    <el-form-item label="平台订单ID" class="pay-id" prop="thirdOrderId">
      <l-number v-if="isEdit && (!($orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.thirdOrderId) || $permission('order_third_order_id'))" v-model="formData.thirdOrderId" :max="9223372036854775807" />
      <span v-else class="platOrderId" @click="toDetail">{{ $orderData.orderPaymentInfoVO.thirdOrderId }}</span>
      <span v-if="[25, 26].indexOf(+$orderData.midDeliveryVideoNewBaseInfoBO.platId) > -1">
        <IconTip
          placement="top"
          type="popover"
          icon-class="iconwenhao"
        >
          <p :class="[!($orderData.orderPaymentInfoVO || {}).xtAccountName && 'noAccountName']">
            {{ ($orderData.orderPaymentInfoVO || {}).xtAccountName || '(暂无数据，如任务ID填写无误，请等3小时后再查看)' }}
          </p>
        </IconTip>
      </span>
      <div v-if="!isEdit && $orderData.orderPaymentInfoVO.thirdOrderIdCheck" class="tip-red m-t-5">{{ $orderData.orderPaymentInfoVO.thirdOrderIdCheck }}</div>
      <!-- <span v-if="isEdit?!formData.thirdOrderId:!$orderData.orderPaymentInfoVO.thirdOrderId" class="id-tip m-l-5"></span> -->
    </el-form-item>
    <el-form-item
      v-if="$orderData.midDeliveryVideoNewBaseInfoBO.platId === 25"
      :clearable="true"
      label="底bar文案"
      prop="bottomBarDraft"
    >
      <el-select v-if="isEdit" v-model="formData.bottomBarDraft" clearable filterable>
        <el-option v-for="item in bottomBarDraftList" :key="item.dictValue" :value="item.dictValue" :label="item.dictLabel" />
      </el-select>
      <span v-else>{{ $orderData.orderPaymentInfoVO.bottomBarDraft }}</span>
    </el-form-item>
    <!-- <el-form-item v-if="isEdit" label="平台付款金额" prop="platPayAmount">
      <el-input-number
        v-model="formData.platPayAmount"
        :precision="2"
        :max="100000000"
        :controls="false"
      />
    </el-form-item> -->
    <el-form-item v-if="$orderData.orderPaymentInfoVO&&$orderData.orderPaymentInfoVO.platPayAmount" label="平台付款金额">
      {{ $orderData.orderPaymentInfoVO.platPayAmount }}
    </el-form-item>
    <el-form-item v-if="+$orderData.midDeliveryVideoNewBaseInfoBO.priAddAmount>0" label="对私补款平台订单ID" class="pay-id" prop="priThirdOrderId">
      <l-number v-if="isEdit && (!($orderData.orderPaymentInfoVO && $orderData.orderPaymentInfoVO.priThirdOrderId) || $permission('order_third_order_id'))" v-model="formData.priThirdOrderId" :max="9223372036854775807" />
      <span v-else>{{ $orderData.orderPaymentInfoVO.priThirdOrderId }}</span>
    </el-form-item>
    <el-form-item v-if="$orderData.orderPaymentInfoVO&&$orderData.orderPaymentInfoVO.priPlatPayAmount" class="pri-plat-amount" label="对私补款平台订单付款金额">
      {{ $orderData.orderPaymentInfoVO.priPlatPayAmount }}
    </el-form-item>
    <br>
    <el-form-item label="备注" block>
      <el-input
        v-if="isEdit"
        v-model="formData.note"
        class="remark"
        type="textarea"
        :rows="2"
      />
      <span v-else>{{ $orderData.orderPaymentInfoVO.note }}</span>
    </el-form-item>
  </el-form>
</template>
<script>
import dayjs from 'dayjs'
import { IconTip } from 'components'
import { $getLinkBusinessType, $updatePayMoney, $editPayMoney } from '@/api/putting-manager'
import { $getDataByDictType } from '@/api'
const LINK_USE_TYPE = {
  net_server_component: '网服组件',
  comment_set_top: '落地页组件'
}
const XT_ACCOUNT_ID = {
  1: '向乾',
  2: '乾派',
  3: '快接单',
  4: '线下',
  5: '北京'
}
export default {
  components: { IconTip },
  props: {
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showLink: false,
      LINK_USE_TYPE,
      XT_ACCOUNT_ID,
      formData: {
        linkUseType: '',
        linkBusinessType: '',
        androidDeliveryName: '',
        orderTime: dayjs().format('YYYY-MM-DD'),
        xtAccountId: '',
        thirdOrderId: '',
        note: '',
        videoServiceTitle: ''
      },
      rules: {
        xtAccountId: [{ required: true, message: '请选择平台下单账户', trigger: 'change' }],
        orderTime: [{ required: true, message: '请选择下单时间', trigger: 'change' }],
        linkBusinessType: [{ message: '请选择组件标签', validator: (rule, value, callback) => {
          if (!value && this.formData.linkUseType) {
            callback(new Error(rule.message))
            return
          }
          callback()
        } }],
        bottomBarDraft: [{ required: true, message: '请选择底bar文案', trigger: 'change' }]
        // thirdOrderId: [{ required: true, validator: (rule, value, callback) => {
        //   if ([1, 2, 3].includes(Number(this.formData.xtAccountId)) && !value) {
        //     callback(new Error('请输入平台订单ID'))
        //   }
        //   callback()
        // }, trigger: ['blur', 'change'] }]
      },
      formPlatOrderIdError: false,
      formPlatOrderIdErrorMessage: '',
      linkBusinessTypeList: [],
      bottomBarDraftList: []
    }
  },
  computed: {
    hasLink() {
      return this.$orderData.orderPaymentInfoVO && this.$orderData.orderPaymentInfoVO.androidDeliveryName
    }
  },
  watch: {
    isEdit(val) {
      if (val && this.$orderData.orderPaymentInfoVO) {
        this.formData = { ...this.formData, ...this.$orderData.orderPaymentInfoVO }
        this.getLinkBusinessType()
      }
      if (!val) {
        this.$refs.form.clearValidate()
        this.formPlatOrderIdError = false
        this.formPlatOrderIdErrorMessage = ''
      }
    },
    $orderData: {
      deep: true,
      immediate: true,
      handler: function(val) {
        if (val.midDeliveryVideoNewBaseInfoBO && val.midDeliveryVideoNewBaseInfoBO.businessTag && val.midDeliveryVideoNewBaseInfoBO.platId === 25) {
          this.getBarList()
        }
      }
    },
    formData: {
      handler(val) {
        const { linkUseType, linkBusinessType } = val
        const channel = this.hasLink ? this.$orderData.orderPaymentInfoVO.androidDeliveryName : '系统自动生成'
        if (linkUseType && linkBusinessType && channel) {
          const rules = { ...this.rules }
          rules.videoServiceTitle = [{ required: true, message: '请输入下单组件标题', trigger: 'input' }]
          this.rules = rules
        } else {
          const rules = { ...this.rules }
          delete rules.videoServiceTitle
          this.rules = rules
        }
      },
      deep: true
    }
  },
  inject: ['$orderData'],

  methods: {
    // 获取底bar文案
    getBarList() {
      let dictTypes = ['b2c_delivery_bottom_bar']
      const businessTag = this.$orderData.midDeliveryVideoNewBaseInfoBO.businessTag
       if (businessTag === 'B2C') {
          dictTypes = ['b2c_delivery_bottom_bar']
        } else if (businessTag === 'C2B') {
          dictTypes = ['c2b_delivery_bottom_bar']
        } else if (businessTag === 'C2C') {
          dictTypes = ['c2c_delivery_bottom_bar']
        }
      $getDataByDictType({
        dictTypes
      }).then(res => {
        if (res.code === 1 && res.data) {
          this.bottomBarDraftList = res.data[dictTypes[0]] || []
        }
      })
    },
    handlextAccount(val) {
      if (![1, 2, 3].includes(Number(val))) {
        this.$refs.form.clearValidate('thirdOrderId')
      }
    },
    async handleSave() {
      await this.$refs.form.validate()
      try {
        if (!(this.$orderData.orderPaymentInfoVO && this.$orderData.orderPaymentInfoVO.thirdOrderId) && this.formData.thirdOrderId) {
          await this.$confirm('平台订单ID一旦保存不可修改，请确认。', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
        }
        const $api = this.$orderData.orderPaymentInfoVO ? $editPayMoney : $updatePayMoney
        const res = await $api({
          ...this.formData,
          orderId: this.$route.query.orderId,
          examineStatus: 1
        })

        if (res.code === 1) {
          this.$orderData.orderPaymentInfoVO = {
            ...this.formData,
            androidDeliveryName: '加载中...',
            orderId: this.$route.query.orderId,
            examineStatus: 1
          }

          this.$message({
            type: 'success',
            duration: 5000,
            message: '操作成功'
          })
          return Promise.resolve()
        } else {
          const message = res.message || ''
          if (message.indexOf('投放次数' || '已达上限') > -1) {
            this.$emit('handleBusinessDialog')
          } else {
            this.$message({
            type: 'error',
            duration: 5000,
            message: res.message || '网络错误'
          })
          }
          return Promise.reject(res)
        }
      } catch (err) {
        if (err === 'cancel') return Promise.reject()
        this.$message.error(err.message || '网络错误')
        return Promise.reject(err)
      }
    },
    getLinkBusinessType() {
      $getLinkBusinessType({
        linkUseType: this.formData.linkUseType,
        orderId: this.$route.query.orderId
      }).then(res => {
        if (res.code === 1) {
          this.linkBusinessTypeList = res.data
        }
      })
    },
    showLinkInfo() {
      if (this.hasLink) {
        this.$emit('handleShowLink')
      }
    },

    // 跳转到星图或聚星的详情页
    toDetail() {
      const { platId } = this.$orderData.midDeliveryVideoNewBaseInfoBO
      const { thirdOrderId } = this.$orderData.orderPaymentInfoVO
      if (platId === 25) {
        this.$router.push(
         {
          path: '/putting-manager/xingtu-detail',
          query: {
            thirdOrderId,
            _blank: true
          }
         })
      } else if (platId === 26) {
        this.$router.push(
         {
          path: '/putting-manager/juxing-detail',
          query: {
            thirdOrderId,
            _blank: true
          }
         })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-form-item {
      margin-right: 0;
      width: 25%;
      &[block] {
        width: 100%;
      }
    }
    .el-form-item__content {
      > * {
        vertical-align: top;
      }
    }
  }
  .form-edit {
    ::v-deep {
      .el-form-item {
          width: 33.33%;
          max-width: 420px;
          &[block] {
            width: 100%;
            max-width: 100%;
          }
      }
    }
  }

  .pay-id {
    margin-bottom: 30px;
  }
  .pri-plat-amount{
    ::v-deep{
      .el-form-item__label{
        width: 200px !important;
      }
    }
  }

  .platOrderId {
    color: blue;
    cursor: pointer;
  }

  .xtAccountName {
    display: inline-block;
    max-width: 174px;
  }

  .noAccountName {
    color: #ff0000;
  }
</style>
