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
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="formData.dictName" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典类型" prop="dictType">
        <el-input v-model="formData.dictType" placeholder="请输入字典类型" />
      </el-form-item>
      <el-form-item v-if="isEdit" prop="status">
        <el-switch v-model="formData.status" active-text="启用" inactive-text="禁用" active-value="0" inactive-value="1" />
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
import { $addDictItem, $editDictItem } from '@/api/backend-manage'
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
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictType: [{ required: true, message: '请输入字典类型', trigger: 'blur' }]
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
      this.$emit('update:show', false)
      this.$refs.form.clearValidate()
    },
    async handleSave() {
      try {
        await this.$refs.form.validate()
        let res
        if (this.isEdit) {
          // 编辑
          res = await $editDictItem(this.formData)
        } else {
          res = await $addDictItem(this.formData)
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
