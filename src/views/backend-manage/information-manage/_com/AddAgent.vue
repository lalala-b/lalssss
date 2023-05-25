<template>
  <el-dialog
    title="新增代理商"
    :visible="show"
    width="900px"
    :append-to-body="true"
    @close="handleClose"
  >
    <el-form
      ref="form"
      inline
      :rules="rules"
      :model="formData"
      label-suffix="："
    >
      <el-form-item prop="name" label="代理商名称">
        <el-input v-model="formData.name" maxlength="10" show-word-limit />
      </el-form-item>
    </el-form>
    <div class="flex flex-justify-end">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleAddClick">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $addInfoStreamAgent } from '@/api/information-manage'
import { useToggle } from '@/hook'
import { ref, reactive } from '@vue/composition-api'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  setup(props, ctx) {
    const { show, handleClose } = useToggle(props)
    const formData = reactive({
      name: ''
    })
    const loading = ref(false)
    const rules = {
      name: [{ required: true, message: '请输入代理商名称', trigger: 'blur' }]
    }
    const handleAddClick = async() => {
      try {
        await ctx.refs.form.validate()
        loading.value = true
        const res = await $addInfoStreamAgent({ agent: formData.name })
        if (res.code === 1) {
          ctx.emit('success')
          ctx.root.$message.success('操作成功')
          ctx.root.$bus.$emit('updateAgent')
          handleClose()
        } else {
          ctx.root.$message.error(res.message)
        }
        loading.value = false
      } catch (err) {
        if (err === false) return
        if (err?.__CANCEL__) return
        ctx.root.$message.error(err.message)
        loading.value = false
      }
    }
    return {
      show,
      loading,
      rules,
      formData,
      handleClose,
      handleAddClick
    }
  }
}
</script>
