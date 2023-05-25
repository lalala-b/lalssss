<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-30 11:17:46
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    class="mail-dialog"
    title="邮寄信息"
    width="680px"
    :append-to-body="true"
    :visible="value"
    @close="close"
  >
    <div class="content">
      <p class="tip">
        <b>【特别说明】</b><br>
        1. 姓名、手机号码、省、市必须填写，有区级则区一栏必须填写，没有区级则区一栏为空即可。<br>
        2. 如果是直辖市地址，则省市两栏中直接输入对应直辖市名称即可，例如：省-北京、市-北京、区-朝阳区；<br>
        3. 如果是香港和台湾地址，则省一栏写香港或者台湾，市一栏写行政区，区一栏写行政区下一级地址，例如：省-香港、市-屯门、区-蓝地；<br>
        4. 如果是澳门地址，则省市两栏中分别输入澳门和澳门的区级地址，区一栏中为空即可，例如：省-澳门、市-澳门半岛、区-不填写；
      </p>
      <el-form ref="form" :model="form" :rules="rules" label-width="124px">
        <el-form-item v-if="hasQuoteComponent" label="是否引用最近邮寄信息" label-width="200px">
          <el-radio-group v-model="form.hasQuote" :disabled="!isEdit" size="small" @change="onChangeQuote">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="姓名" prop="addressName">
          <el-input v-model="form.addressName" :disabled="!isEdit" maxlength="10" />
        </el-form-item>
        <el-form-item label="手机号码" prop="addressPhone">
          <el-input :disabled="!isEdit" :value="form.addressPhone" maxlength="11" @input="form.addressPhone = arguments[0].replace(/[^\d]/g, '')" />
        </el-form-item>
        <div class="flex">
          <el-form-item label="省" prop="provId" class="map-select">
            <el-select v-model="form.provId" :disabled="!isEdit" clearable filterable @change="handleChangeProvinces">
              <el-option v-for="item in provinces" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
            </el-select>
          </el-form-item>
          <el-form-item label="市" prop="cityId" class="map-select">
            <el-select v-model="form.cityId" :disabled="!isEdit" clearable filterable @change="handleChangeCity">
              <el-option v-for="item in citys" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
            </el-select>
          </el-form-item>
          <el-form-item label="区" class="map-select">
            <el-select v-model="form.areaId" :disabled="!isEdit" clearable filterable>
              <el-option v-for="item in areas" :key="item.areaId" :value="item.areaId" :label="item.areaName" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="form.detailAddress" :disabled="!isEdit" type="textarea" maxlength="100" show-word-limit />
          <p v-if="form.detailAddressUpdateTime" class="edit-time"> 邮寄地址最近编辑时间：{{ form.detailAddressUpdateTime }}</p>
          <!-- {{ from.detailAddressUpdateTime }} -->
        </el-form-item>
        <el-form-item label="备注" prop="postInfoNote">
          <el-input v-model="form.postInfoNote" :disabled="!isEdit" type="textarea" maxlength="200" show-word-limit />
        </el-form-item>
        <el-form-item v-if="$permission('courier_number')" label="物料寄出快递单号" prop="sendExpressNumber">
          <el-input v-model="form.sendExpressNumber" :disabled="!isEdit" maxlength="30" @input="form.sendExpressNumber = arguments[0].replace(/[^0-9A-Za-z]/g, '')" />
        </el-form-item>
        <el-form-item v-if="$permission('courier_number')" label="物料寄回快递单号" prop="sendBackExpressNumber">
          <el-input v-model="form.sendBackExpressNumber" :disabled="!isEdit" maxlength="30" @input="form.sendBackExpressNumber = arguments[0].replace(/[^0-9A-Za-z]/g, '')" />
          <p v-if="form.sendBackExpressNumberUpdateTime" class="edit-time">物料寄回快递单号最近编辑时间：{{ form.sendBackExpressNumberUpdateTime }}</p>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button v-if="isEdit" v-loading="loading" type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getAccountRecentCourier, $getOrderCourier, $editMailInfo } from '@/api/bussiness-manage'
import { $getAera } from '@/api'
const FORM = {
  id: '',
  addressName: '',
  addressPhone: '',
  provId: '',
  cityId: '',
  areaId: '',
  detailAddress: '',
  postInfoNote: '',
  isCourier: 1,
  hasQuote: 1,
  remark: '',
  sendExpressNumber: '',
  sendBackExpressNumber: ''
}

export default {
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default: null
    },
    accountId: {
      type: Number,
      default: 0
    },
    orderId: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    },
    isEmailEditor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const MOBILE_REG_EXP = /^1\d{10}$/
    return {
      showEdit: true,
      form: { ...FORM },
      provinces: null,
      citys: null,
      areas: null,
      loading: false,
      hasQuoteComponent: false,
      rules: {
        addressName: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        addressPhone: {
          required: true,
          trigger: 'change',
          validator: (rule, value, callback) => {
            if (!value || (value && !value.trim())) {
              callback(new Error('请输入手机号码'))
              return
            }
            if (!MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的手机号'))
              return
            }
            callback()
          }
        },
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        provId: [
          { required: true, message: '请选择省', trigger: 'change' }
        ],
        cityId: [
          { required: true, message: '请选择市', trigger: 'change' }
        ],
        areaId: [
          { required: true, message: '请选择省', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        val && this.echoData(val)
      }
    }
  },
  created() {
    // 省
    this.getArea(0, Math.random()).then(res => {
      console.log(res)
      if (res.code === 1 && res.data) {
        this.provinces = res.data
      }
    }).catch(err => {
      console.log(err)
    })
    if (this.data) {
      this.echoData(this.data)
    } else {
      // alert(this.status)
      if (this.status === 'edit') {
        this.getOrderCourier()
      } else {
        this.getAccountRecentCourier()
      }
    }
  },
  methods: {
    echoData(data) {
      this.form = {
        addressName: data.addressName,
        addressPhone: data.addressPhone,
        provId: data.provId !== 0 ? data.provId : '',
        cityId: data.cityId !== 0 ? data.cityId : '',
        areaId: data.areaId !== 0 ? data.areaId : '',
        detailAddress: data.detailAddress,
        postInfoNote: data.postInfoNote,
        isCourier: 1,
        hasQuote: 1,
        sendExpressNumber: data.sendExpressNumber,
        sendBackExpressNumber: data.sendBackExpressNumber,
        detailAddressUpdateTime: data.detailAddressUpdateTime,
        sendBackExpressNumberUpdateTime: data.sendBackExpressNumberUpdateTime
      }
      // 市
      this.getArea(data.provId, Math.random()).then(res => {
        if (res.code === 1 && res.data) {
          console.log(res.data, '---')
          this.citys = res.data
        }
      })
      // 县
      this.getArea(data.cityId, Math.random()).then(res => {
        if (res.code === 1 && res.data) {
          this.areas = res.data
        }
      })
    },
    onChangeQuote() {
      if (this.form.hasQuote === 1) {
        // this.getAccountCourier()
        if (this.status === 'edit') {
          this.getOrderCourier()
        } else {
          this.getAccountRecentCourier()
        }
      } else {
        this.form = { ...FORM, hasQuote: 0 }
      }
    },
    /**
     * 获取【账号】的邮寄信息
     */
    getAccountRecentCourier(successCb, errorCb) {
      this.courierCallback($getAccountRecentCourier, {
        orderId: this.orderId
      }, successCb, errorCb)
    },
    /**
     * 获取【订单】的邮寄信息
     */
    getOrderCourier() {
      this.courierCallback($getOrderCourier, {
        orderId: this.orderId
      }, null, () => {
        this.getAccountRecentCourier(() => {
          this.hasQuoteComponent = true
        }, () => {
          this.hasQuoteComponent = false
        })
      })
    },
    async courierCallback(ajax, params, successCb, errorCb) {
      const res = await ajax(params)
      if (res.code === 1) {
        if (res.data) {
          this.echoData(res.data)
          if (this.status === 'add') {
            this.hasQuoteComponent = true
          }
          typeof successCb === 'function' ? successCb() : null
        } else {
          typeof errorCb === 'function' ? errorCb() : null
        }
      }
    },
    /**
     * parentId 0 - 省、
     */
    getArea(parentId = 0, random = '') {
      return $getAera({ parentId }, random)
    },
    handleChangeProvinces() {
      this.form.cityId = ''
      this.form.areaId = ''
      this.getArea(this.form.provId).then(res => {
        if (res.code === 1 && res.data) {
          this.citys = res.data
        } else {
          this.$message.error('网络错误')
        }
      }).catch(err => {
        this.$message.error('网络错误')
        console.log(err)
      })
    },
    handleChangeCity() {
      this.form.areaId = ''
      this.getArea(this.form.cityId).then(res => {
        if (res.code === 1 && res.data) {
          this.areas = res.data
        } else {
          this.$message.error('网络错误')
        }
      }).catch(err => {
        this.$message.error('网络错误')
        console.log(err)
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = { ...this.form }
          if (this.isEmailEditor) {
            this.saveEmail({ ...params, orderId: this.orderId })
          } else {
            this.$emit('save', params)
            this.$emit('input', false)
          }
        }
      })
    },
    saveEmail(params) {
      const param = params
      delete param.isCourier
      delete param.hasQuote
      $editMailInfo(param).then(res => {
        if (res.code === 1) {
          this.$emit('input', false)
          this.$emit('onOrderDetail')
          this.$message.success('编辑成功')
        }
      }).catch(err => console.error(err))
    },
    close() {
      this.$emit('input', false)
      this.$emit('onOrderDetail', 'cancel')
    }
  }
}
</script>
<style lang="scss" scoped>
  .mail-dialog {
    .flex {
      display: flex;
      .map-select {
        display: flex;
        ::v-deep .el-form-item__label {
          width: 50px !important;
        }
        &:first-child {
          ::v-deep .el-form-item__label {
          width: 100px !important;
        }
        }
        ::v-deep .el-form-item__content {
            margin-left: 0 !important;
        }
        ::v-deep .el-input {
          width: 146px !important;
        }
      }
    }
    .tip {
      color: rgb(247, 28, 28);
      font-size: 12px;
      margin-bottom: 24px;
      margin-left: 20px;
    }
    .edit-time{
      color:#999;
      font-size: 12px;
    }
  }
</style>
