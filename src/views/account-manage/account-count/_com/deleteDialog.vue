<template>
  <el-dialog
    title="确认删除账号"
    :visible.sync="show"
    width="600px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div class="notice m-b-16">
      账号删除后，除【账号盘点库】模块之外系统其他模块会删除该账号相关数据！
    </div>
    <div class="m-b-10">请选择删除原因类型：</div>

    <div class="m-b-10">
      <el-radio v-model="type" class="radio" :label="0">
        不是海盗账号
      </el-radio>
      <el-radio v-model="type" class="radio" :label="1">
        不再运营/注销账号
      </el-radio>
      <el-radio v-model="type" class="radio" :label="2"> 其他原因 </el-radio>

    </div>
    <el-form v-show="+type === 2" ref="form" :model="form" :rules="rules">
      <el-form-item prop="reason" label="">
        <el-input
          v-model="form.reason"
          maxlength="50"
          class="note-input"
          type="textarea"
          placeholder="其他原因请填写详细删除账号原因，不超过50字。"
          show-word-limit
        />
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, toRefs, watch, getCurrentInstance } from '@vue/composition-api'
import { $deleteInventoryAccount } from '@/api/account-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { $message, $refs } = getCurrentInstance().proxy

    const state = reactive({
      type: 0,
      rules: {
        reason: [
          { required: true, message: '请输入其他原因', trigger: 'blur' }
        ]
      },
      loading: false
    })

    watch(() => state.type, () => {
      form.reason = ''
    })

    const form = reactive({
      reason: ''
    })

    const handleCancel = () => {
      emit('close')
      state.type = 0
      form.reason = ''
    }

    const handleConfirm = async() => {
      if (+state.type === 2) {
        await $refs.form.validate()
      }
      const params = {
        delType: state.type,
        delReason: form.reason,
        accountId: props.accountId
      }

      try {
        state.loading = true
        const { code, message } = await $deleteInventoryAccount(params)

        state.loading = false
        if (+code === 1) {
          $message.success('删除成功')
          emit('confirm')
        } else {
          $message.error(message || '删除失败，请重试')
        }
      } catch (e) {
        state.loading = false
        $message.error(e)
      }
    }

    return {
      form,
      ...toRefs(state),
      handleCancel,
      handleConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.notice {
  color: #ff0000;
  font-size: 14px;
}
</style>
