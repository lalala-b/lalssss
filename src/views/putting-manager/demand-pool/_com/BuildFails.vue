<template>
  <el-dialog
    :visible="show"
    title="确认建联失败"
    width="500px"
    @close="handleClose"
  >
    <p>建联失败，无法合作。</p>
    <el-form
      ref="form"
      class="m-t-10"
      :model="formData"
      :rules="rules"
      :inline="true"
    >
      <el-form-item prop="connectionFailRemark" label=" ">
        <el-input v-model="formData.connectionFailRemark" type="textarea" placeholder="请填写建联失败原因，不超过50字。" maxlength="50" show-word-limit />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, ref, toRefs, reactive, getCurrentInstance } from '@vue/composition-api'
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
    },
    defaultParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      formData: {
        connectionFailRemark: ''
      },
      rules: {
        connectionFailRemark: { required: true, message: '请输入建联失败原因', trigger: 'blur' }
      },
      loading: false
    })
    const loading = ref(false)
    const { handleChangeStatus } = useTableList(props.defaultParams)
    const handleConfirm = async function() {
      state.loading = true
      try {
        await $refs.form.validate()
        await handleChangeStatus({ id: props.id, requirementStatus: 5, connectionFailRemark: state.formData.connectionFailRemark })
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
      loading,
      handleConfirm,
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
