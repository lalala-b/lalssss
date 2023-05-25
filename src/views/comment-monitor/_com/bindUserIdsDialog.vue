<template>
  <el-dialog
    v-if="value"
    width="460px"
    :title="bindMultiple?'绑定提醒人':'绑定归属人'"
    :visible="value"
    @close="onCancel"
  >
    <el-form ref="addForm" :model="addForm" :rules="addFormRules">
      <el-form-item :label="bindMultiple?'提醒人':'归属人'" prop="userIds">
        <el-select
          v-model="addForm.userIds"
          :placeholder="bindMultiple?'请选择提醒人':'请选择归属人'"
          multiple
          :multiple-limit="bindMultiple?30:1"
        >
          <el-option
            v-for="item in bindUserIdList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="handleConfirmBind"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCurrentInstance, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { $bindMonitorAccount, $getAccountUserInfo, $bindCustomAscribe } from '@/api/comment-monitor'
export default {
  props: {
    accountId: {
      type: String,
      default: ''
    },
    value: Boolean,
    bindMultiple: {
      type: Boolean,
      default: true
    },
    userIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const { $message, $refs } = getCurrentInstance().proxy
    const states = reactive({
      loading: false,
      bindUserIdList: [],
      addFormRules: {
        userIds: [
          { required: true, message: `${props.bindMultiple ? '请选择提醒人' : '请选择归属人'}`, trigger: 'change' }
        ]
      }
    })
    const addForm = reactive({
      userIds: []
    })
    watch(() => props.userIds, (val) => {
      if (val && val.length) {
        addForm.userIds = val
      }
    }, { immediate: true, deep: true })
    const getAccountUserInfo = async() => {
      const res = await $getAccountUserInfo()
      if (res.code === 1) {
        states.bindUserIdList = res.data || []
      }
    }

    const handleConfirmBind = async() => {
      try {
        await $refs.addForm.validate()
        states.loading = true
        const $api = props.bindMultiple ? $bindMonitorAccount : $bindCustomAscribe
        const params = props.bindMultiple ? { accountId: props.accountId,
          userIds: addForm.userIds } : {
            cid: props.accountId,
            customUserId: addForm.userIds.toString()
          }
        const res = await $api(params)
        if (res.code === 1) {
          $message.success(res.message)
          emit('update')
          onCancel()
        } else {
          $message.error(res.message)
        }
        states.loading = false
      } catch (error) {
        states.loading = false
        if (error.__CANCEL__) {
          return
        }
        console.info(error)
      }
    }
    const onCancel = () => {
      emit('input', false)
    }
    getAccountUserInfo()
    return {
      ...toRefs(states),
      handleConfirmBind,
      onCancel,
      addForm
    }
  }
}
</script>
