<template>
  <el-dialog
    :visible="show"
    :title="dialogTitle"
    @close="handleClose"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="配置key" prop="configKey">
        <el-input v-model="formData.configKey" placeholder="请输入配置key" />
      </el-form-item>
      <el-form-item label="配置名称" prop="configName">
        <el-input v-model="formData.configName" placeholder="请输入配置名称" />
      </el-form-item>
      <el-form-item label="配置值" prop="configValue">
        <el-input v-model="formData.configValue" placeholder="请输入配置值" />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" placeholder="备注" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $addConfigItem, $editConfigItem } from '@/api/backend-manage'
import { isObject, objectMerge } from '@/utils'
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      formData: {},
      formRules: {
        configKey: [{ required: true, message: '请输入配置key', trigger: 'blur' }],
        configName: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
        configValue: [{ required: true, message: '请输入配置值', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑' : '新增'
    }
  },
  methods: {
    handleOpen() {
      if (Object.keys(this.editData).length > 0) {
        this.formData = objectMerge({}, this.editData)
      } else {
        this.formData = {}
      }
    },
    handleClose() {
      this.$refs.form.clearValidate()
      this.$emit('update:show', false)
    },
    async handleSave() {
      try {
        await this.$refs['form'].validate()
        let res
        if (this.isEdit) {
          // 编辑
          res = await $editConfigItem(this.formData)
        } else {
          res = await $addConfigItem(this.formData)
        }
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.handleClose()
          this.$emit('success')
          return
        }
        Promise.reject(res)
      } catch (err) {
        console.log(err)
        if (isObject(err) && err.message) {
          return this.$message.error(err.message)
        }
      }
    }
  }
}
</script>
