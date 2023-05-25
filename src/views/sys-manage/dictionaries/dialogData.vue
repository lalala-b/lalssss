<template>
  <el-dialog
    :visible="show"
    :title="dialogTitle"
    width="580px"
    @close="handleClose"
    @open="handleOpen"
  >
    <el-form
      ref="form"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="字典标签" prop="dictLabel">
        <el-input v-model="formData.dictLabel" placeholder="请输入字典标签" />
      </el-form-item>
      <el-form-item label="字典键值" prop="dictValue">
        <el-input v-model="formData.dictValue" placeholder="请输入字典键值" />
      </el-form-item>
      <el-form-item label="排序字段" prop="dictSort">
        <!-- <el-input v-model="formData.dictSort" placeholder="请输入排序字段" /> -->
        <!-- <el-select v-model="formData.dictSort" style="width: 100%;">
          <el-option v-for="(item, index) in dictSortList" :key="index" :value="item.value" :label="item.label" />
        </el-select> -->
        <el-input-number v-model="formData.dictSort" :min="0" />
      </el-form-item>
      <el-form-item v-if="isEdit" prop="status" label="当前状态">
        <el-switch v-model="formData.status" active-text="启用" inactive-text="禁用" active-value="0" inactive-value="1" />
      </el-form-item>
      <el-form-item label="扩展字段" prop="extValue">
        <el-input v-model="formData.extValue" placeholder="扩展字段" />
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
import { $addDictData, $editDictData } from '@/api/backend-manage'
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
      dictSortList: [
        { value: 0 },
        { value: 1 },
        { value: 2 },
        { value: 3 },
        { value: 4 },
        { value: 5 }
      ],
      formRules: {
        dictLabel: [{ required: true, message: '请输入字典标签', trigger: 'blur' }],
        dictValue: [{ required: true, message: '请输入字典键值', trigger: 'blur' }],
        dictSort: [{ required: true, message: '请输入排序字段', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      return this.isEdit ? '编辑' : '新增'
    }
  },
  created() {
    this.dictType = this.$route.params.dictType
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
      this.formData.dictType = this.dictType
      try {
        await this.$refs.form.validate()
        let res
        if (this.isEdit) {
          // 编辑
          res = await $editDictData(this.formData)
        } else {
          res = await $addDictData(this.formData)
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
