<template>
  <el-dialog
    title="下单"
    width="1140px"
    :visible="value"
    @close="$emit('input', false)"
  >
    <OrderInfo ref="orderInfo" :form-data="formData" page-type="place" :palce-source="palceSource" :line="3" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('input', false)">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import OrderInfo from '../../component/OrderInfo.vue'
import { $addOrder } from '@/api/putting-manager'

export default {
  components: { OrderInfo },
  props: {
    value: Boolean,
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    // 下单来源，投放账号|投放需求池
    palceSource: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    ...mapGetters(['id'])
  },
  created() {
    console.log(this.id)
  },
  methods: {
    onClose() {},
    /**
     * 保存
     */
    save() {
      if (this.loading) {
        return
      }
      this.$refs.orderInfo.checkScreenShot()
      this.$refs.orderInfo.$refs.form.validate((valid) => {
        if (valid) {
          const formEditData = this.$refs.orderInfo.formEditData
          console.info('----formEditData', formEditData)
          // console.log(formEditData, '--formEditData')
          const params = Object.assign({}, formEditData)
          params.businessTag = this.formData.businessTag
          // switch(params.businessTag) {
          //   case 'C2C秒杀':
          //   case 'B2C秒杀':
          //     if (!params.deliveryWordOfCommandBOList.list || params.deliveryWordOfCommandBOList.list.length === 0) {
          //       this.$message.error('口令不能为空')
          //       return Promise.reject()
          //     }
          //     break
          // }
          // if (params.deliveryWordOfCommandBOList && params.deliveryWordOfCommandBOList.list.length) {
          //   params.orderCommand = params.deliveryWordOfCommandBOList.list.map(t => t.wordOfCommand).join(',')
          // } else {
          //   params.orderCommand = ''
          // }

          // params.addCommandType = params.deliveryWordOfCommandBOList.addCommandType
          // // 关联订单口令订单号
          // if (params.deliveryWordOfCommandBOList) {
          //   if (params.deliveryWordOfCommandBOList.addCommandType === 2) {
          //     params.beDependentOrderNumber = params.deliveryWordOfCommandBOList.beDependentOrderNumber
          //     delete params.deliveryWordOfCommandBOList
          //   } else {
          //     params.deliveryWordOfCommandBOList = params.deliveryWordOfCommandBOList.list
          //   }
          // }

          // 关联订单口令订单号
          if (params.deliveryWordOfCommandBOList) {
            switch (params.businessTag) {
                case 'C2C秒杀':
                case 'B2C秒杀':
                  if (params.deliveryWordOfCommandBOList.list.length === 0) {
                    this.$message.error('口令不能为空')
                    return Promise.reject()
                  }
                  break
            }
            if (params.deliveryWordOfCommandBOList.list.length) {
              params.orderCommand = params.deliveryWordOfCommandBOList.list.map(t => t.wordOfCommand).join(',')
            } else {
              params.orderCommand = ''
            }
            params.addCommandType = params.deliveryWordOfCommandBOList.addCommandType
            if (params.deliveryWordOfCommandBOList.addCommandType === 2) {
              params.beDependentOrderNumber = params.deliveryWordOfCommandBOList.beDependentOrderNumber
              delete params.deliveryWordOfCommandBOList
            } else {
              params.deliveryWordOfCommandBOList = params.deliveryWordOfCommandBOList.list
            }
          } else {
            params.addCommandType = 1
          }
          params.isSettled = params.isSettled ? 1 : 0
          params.rebateScreenshot = params.rebateScreenshot ? JSON.stringify(params.rebateScreenshot) : params.rebateScreenshot
          params.addOrderScreenshot = params.addOrderScreenshot ? JSON.stringify(params.addOrderScreenshot) : params.addOrderScreenshot

          if (this.palceSource === 'putting') {
            params.deliveryId = this.id
          }
          if (!params.isUnionContribution) {
            params.unionContributionNumber = ''
            params.unionContributionCost = 0
            params.unionContributionProportion = 0
          }
          if (!params.isAmountLink) {
            params.amountLinkCost = 0
          }

          if (Object.prototype.toString.call(params.b2cPhoneModelId) === '[object Array]') {
            if ((params.b2cPhoneModelId || []).length > 1) {
              params.b2cPhoneModelId = params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1]
            } else {
              params.b2cPhoneModelId = ''
              params.b2cPhoneModel = ''
            }
          } else if (!params.b2cPhoneModelId) {
            params.b2cPhoneModelId = ''
            params.b2cPhoneModel = ''
          }

          this.loading = true
          $addOrder(params).then(res => {
            if (res.code === 1) {
              this.$emit('input', false)
              this.$emit('success')
              this.$message.success(res.message)
            } else {
              this.loading = false
              const message = res.message || ''
              if (message.indexOf('投放次数' || '已达上限') > -1) {
                this.$emit('handleBusinessDialog', { accountId: params.accountId, businessLine: params.businessTag, businessLineDate: params.preReleaseVideoTime })
              } else {
                 this.$message.error(res.message)
              }
            }
          }).catch((err) => {
            this.loading = false
            this.$message.error(err.message)
          })
        }
      })
    },
    addOrder() {
      return
    }
  }
}
</script>
