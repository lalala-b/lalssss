<template>
  <el-dialog
    title="添加异常提醒"
    :visible="show"
    width="970px"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form ref="orderRemindForm" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="提醒内容：" prop="msg">
        <el-input v-model="form.msg" type="textarea" maxlength="150" show-word-limit placeholder="请输入提醒内容" @blur="handleBlur" @input="handleInput" />
      </el-form-item>
      <el-form-item label="提醒对象：" prop="person">
        <el-select
          v-model="form.person"
          filterable
          clearable
          allow-create
          default-first-option
          class="m-r-5 m-b-5"
          @change="handleChange"
        >
          <el-option
            v-for="item in remindList"
            :key="item.mobile"
            :value="item.userIdentity"
            :label="item.userIdentity"
          />
        </el-select>
        <el-tag
          v-for="item in form.reminderUserBOS"
          :key="item.userIdentity"
          closable
          class="m-r-5 m-b-5"
          :disable-transitions="false"
          @close="handleCloseTag(item.userIdentity)"
        >
          {{ item.userIdentity }}
        </el-tag>
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted,
  watch
} from '@vue/composition-api'
import { $getRemindList, $sendFinancialReminder } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: '0'
    },
    workId: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    const { $refs, $message } = getCurrentInstance().proxy

    const validateTag = (rule, value, callback) => {
      if ((!value || value.length === 0) && !form.reminderUserBOS.length) {
        callback(new Error('请选择提醒对象'))
      } else {
        callback()
      }
    }

    const state = reactive({
      rules: {
        msg: [{ required: true, message: '请输入提醒内容', trigger: ['blur', 'change'] }],
        person: [{ required: true, validator: validateTag, trigger: ['change'] }]
      },
      remindList: [],
      remindHistory: [],
      btnLoading: false
    })

    const form = reactive({
      msg: '',
      person: '',
      reminderUserBOS: []
    })

    watch(() => props.show, (val) => {
      if (!val) {
        $refs.orderRemindForm && $refs.orderRemindForm.resetFields()
        form.reminderUserBOS = []
      } else {
        getRemindList()
      }
    })

    onMounted(() => {
      $refs.orderRemindForm && $refs.orderRemindForm.resetFields()
      form.reminderUserBOS = []
    })

    const handleCloseTag = (tag) => {
      form.reminderUserBOS.splice(form.reminderUserBOS.findIndex(item => item.userIdentity === tag), 1)
      $refs.orderRemindForm.validateField('person')
    }

    const handleClose = () => {
      emit('close')
    }

    const handleInput = (val) => {
      form.msg = val.replace(/^\s*/g, '')
    }

    const handleBlur = () => {
      form.msg = form.msg.replace(/(^\s*)|(\s*$)/g, '')
    }

    const handleChange = (val) => {
      if (form.reminderUserBOS.findIndex(item => item.userIdentity === val) === -1) {
        form.reminderUserBOS.push(state.remindList.find(item => item.userIdentity === val))
      }

      $refs.orderRemindForm.validateField('person')
      form.person = ''
    }

    const getRemindList = async() => {
      const { code, data } = await $getRemindList({ workId: props.workId, type: props.type })
      if (+code === 1) {
        state.remindList = data
      }
    }

    const handleConfirm = async() => {
      await $refs.orderRemindForm.validate()

      try {
        state.btnLoading = true
        const { code, message } = await $sendFinancialReminder({
          workId: props.workId,
          type: props.type,
          ...form
        })
        state.btnLoading = false
        if (+code === 1) {
          $message.success('添加成功')
          emit('success')
          emit('close')
        } else {
          $message.error(message)
        }
      } catch (e) {
        state.btnLoading = false
        $message.error(e)
      }
      console.info('---asd',111)
    }

    return {
      ...toRefs(state),
      form,
      handleClose,
      handleCloseTag,
      handleInput,
      handleBlur,
      handleChange,
      handleConfirm
    }
  }
})
</script>
