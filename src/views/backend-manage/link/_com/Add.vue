<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-16 10:47:30
 * @LastEditTime: 2020-12-25 17:03:24
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    width="600px"
    title="新增组件link"
    :visible="addShow"
    :destroy-on-close="true"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form
      ref="addForm"
      :model="addInfo"
      :rules="rules"
    >
      <div class="flex">
        <el-form-item prop="linkUseType">
          <v-select v-model="addInfo.linkUseType" class="m-r-10" :config="normalFormItemMap.linkUseType" @sChange="hanleLinkChange" />
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item prop="brandName">
          <v-select v-model="addInfo.brandName" class="m-r-10" :config="normalFormItemMap.brandName" @sChange="hanleBrandNameChange" />
        </el-form-item>
        <el-form-item prop="teamAttribute">
          <v-select v-model="addInfo.teamAttribute" class="m-r-10" :config="normalFormItemMap.teamAttribute" />
        </el-form-item>
      </div>
      <div class="flex">
        <el-form-item prop="businessType">
          <v-select v-model="addInfo.businessType" class="m-r-10" :config="businessTypeList" />
        </el-form-item>
        <el-form-item prop="deliveryChannel">
          <v-select v-model="addInfo.deliveryChannel" class="m-r-10" :config="normalFormItemMap.deliveryChannel" />
        </el-form-item>
      </div>
      <el-form-item prop="taskNum">数量：<el-input-number v-model="addInfo.taskNum" :min="1" :precision="0" /></el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="$emit('update:addShow', false)">取 消</el-button>
      <el-button v-loading="editLoading" type="primary" @click="hanleEditSave">确 定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import { $addLinkBase, $getBusinessTypeNew } from '@/api/link'
import Select from '@/components/Select'
export default {
  components: {
    vSelect: Select
  },
  props: {
    addShow: {
      type: Boolean,
      default: false
    },
    normalFormItemMap: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      editLoading: false,
      linkUseType: '',
      brandName: '',
      addInfo: {
        brandName: '',
        teamAttribute: '',
        businessType: '',
        deliveryChannel: '',
        linkUseType: '',
        phoneType: '',
        taskNum: 1
      },
      rules: {
        linkUseType: [{ required: true, message: '请选择应用类别', trigger: 'change' }],
        brandName: [{ required: true, message: '请选择组件品牌', trigger: 'change' }],
        teamAttribute: [{ required: true, message: '请选择团队属性', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择业务标签', trigger: 'change' }],
        deliveryChannel: [{ required: true, message: '请选择投放渠道', trigger: 'change' }],
        phoneType: [{ required: true, message: '请选择机型', trigger: 'change' }],
        // phoneTypeId: [{ required: true, message: '请选择投放渠道', trigger: 'change' }],
        taskNum: [{ required: true, message: '数量需大于0', trigger: 'change' }]
      },
      businessTypeList: {}
    }
  },
  created() {
    this.businessTypeList = Object.assign({}, this.normalFormItemMap.businessType)
    this.hanleBrandNameChange()
  },
  methods: {
    handleOpen() {},
    // 添加
    hanleEditSave() {
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.editLoading = true
          $addLinkBase(this.addInfo).then(res => {
            if (res.code === 1) {
              this.$message.success('操作成功')
              this.$emit('success')
              this.handleClose()
            } else {
              this.$message.error(res.message)
            }
            this.editLoading = false
          }).catch(err => {
            if (err.__CANCEL__) {
              return
            }
            this.$message.error(err.message)
            this.editLoading = false
          })
        }
      })
    },
    handleClose() {
      this.addInfo = {
        brandName: '',
        teamAttribute: '',
        businessType: '',
        deliveryChannel: '',
        taskNum: 1
      }
      this.$refs.addForm.clearValidate()
      this.$emit('update:addShow', false)
    },
    hanleBrandNameChange(val) {
      this.addInfo.businessType = ''
      this.businessTypeList.data = []
      this.brandName = val
      this.getBusinessTypeNew()
    },
    hanleLinkChange(val) {
      this.addInfo.businessType = ''
      this.businessTypeList.data = []
      this.linkUseType = val
      this.getBusinessTypeNew()
    },
    getBusinessTypeNew() {
      $getBusinessTypeNew({
        brandName: this.brandName,
        linkUseType: this.linkUseType
      }).then(res => {
        if (res.code === 1) {
          this.businessTypeList.data = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err)
      })
    }
  }
}
</script>
