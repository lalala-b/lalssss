<template>
  <el-dialog
    :visible="show"
    title="确认议价失败"
    width="500px"
    @close="handleClose"
  >
    <p>议价失败，未下单。</p>
    <el-form
      ref="form"
      class="m-t-10"
      :model="formData"
      :rules="rules"
      :inline="true"
    >
      <el-form-item prop="bargainingRemark" label=" ">
        <el-input v-model="formData.bargainingRemark" type="textarea" placeholder="请填写议价失败原因，不超过50字。" maxlength="50" show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, toRefs, reactive, getCurrentInstance } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { useTableList } from './hook'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  setup(props, { emit }) {
    const _this = getCurrentInstance()
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      formData: {
        bargainingRemark: ''
      },
      rules: {
        bargainingRemark: { required: true, message: '请输入备注', trigger: 'blur' }
      },
      loading: false
    })

    const { handleChangeStatus } = useTableList()

    const handleSave = async function() {
      state.loading = true
      try {
        await _this.refs.form.validate()
        await handleChangeStatus({ id: props.id, requirementStatus: 4, bargainingRemark: state.formData.bargainingRemark })
        state.loading = false
        handleClose()
        emit('success')
      } catch (err) {
        state.loading = false
        if (!err) return
      }
    }
    return {
      ...toRefs(state),
      show,
      handleSave,
      handleClose
    }
  }
})
</script>
<style lang="scss" scoped>
  ::v-deep {
    .el-textarea {
      width: 400px;
    }
  }
</style>
