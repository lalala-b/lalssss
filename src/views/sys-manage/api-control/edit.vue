<template>
  <el-dialog
    title="编辑"
    width="560px"
    :visible="value"
    @close="onCancel"
  >
    <el-form label-width="80px">
      <el-form-item label="一级页面">
        <el-input v-model="info.functioin1th" />
      </el-form-item>
      <el-form-item label="二级页面">
        <el-input v-model="info.functioin2rd" />
      </el-form-item>
      <el-form-item label="三级页面">
        <el-input v-model="info.functioin3th" />
      </el-form-item>
      <el-form-item label="接口功能">
        <el-input v-model="info.functioinApi" />
      </el-form-item>
      <el-form-item label="接口状态">
        <el-radio-group v-model="info.status">
          <el-radio :label="0">停用</el-radio>
          <el-radio :label="1">启用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { copy } from '@/utils'
import { $updateApiInfo } from '@/api/sys'
export default {
  props: {
    value: Boolean,
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      info: {}
    }
  },
  watch: {
    // editData: {
    //   immediate: true,
    //   handler(val) {
    //     this.info = copy(this.editData)
    //   }
    // }
  },
  created() {
    this.info = copy(this.editData)
  },
  methods: {
    onCancel() {
      this.$emit('input', false)
      this.info = {}
    },
    handleUpdate() {
      this.loading = true
      $updateApiInfo(this.info).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.$emit('success')
          this.onCancel()
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    }
  }
}
</script>
