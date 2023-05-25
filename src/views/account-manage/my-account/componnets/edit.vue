<template>
  <el-dialog
    ref="editForm"
    title="编辑"
    :visible.sync="show"
    width="500px"
    :before-close="handleClose"
  >
    <el-form
      ref="editForm"
      :model="editForm"
      :rules="rules"
    >
      <AccountCard :info="accountInfo" />
      <el-form-item label="手机号" prop="bindPhone">
        <el-input v-model="editForm.bindPhone" placeholder="输入开通账号的手机号" />
      </el-form-item>
      <el-form-item class="m-t-24" label="账号统一名称">
        <el-input v-model="editForm.belongName" placeholder="输入账号统一名称" />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-log="{ accountId: editForm.accountId, accountName: editForm.accountName, operation_module: '编辑确定' }" :loading="loading" type="primary" @click="handleEditConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { $editMyAccount } from '@/api/account-manage'

import { AccountCard } from 'components'
import { useToggle } from '@/hook'

const MOBILE_REG_EXP = /^1\d{10}$/

export default defineComponent({
  props: {
    accountInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    value: Boolean
  },
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message, $refs } = getCurrentInstance().proxy
    const loading = ref(false)
    const rules = {
      bindPhone: { required: false, trigger: 'blur',
        validator: (rule, value, callback) => {
          if (value && !MOBILE_REG_EXP.test(value)) {
            callback(new Error('请输入正确的手机号'))
            return
          }
          callback()
        }
      }
    }
    const editForm = reactive({ ...props.accountInfo })
    const handleEditConfirm = async function() {
      try {
        await $refs.editForm.validate()
        loading.value = true
        const res = await $editMyAccount(editForm)
        if (res && res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message(res.message)
        }
        loading.value = false
      } catch (err) {
        loading.value = false
      }
    }

    return {
      show,
      handleClose,
      handleEditConfirm,
      rules,
      editForm,
      loading
    }
  }
})
</script>

