<template>
  <el-dialog
    width="680px"
    title="信息流权益"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="show"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" label-width="124px" :rules="rules">
      <el-form-item label="信息流是否免费" prop="isFree">
        <el-select v-model="formData.isFree">
          <el-option v-for="item in FREE" :key="item.val" :label="item.label" :value="item.val" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.isFree === 0" label="信息流额外金额" prop="msgAdditionalPrice">
        <el-input-number v-model="formData.msgAdditionalPrice" :precision="1" :min="0" :max="100000000" label="信息流额外金额" /> 元
      </el-form-item>

      <el-form-item label="信息流时长" prop="msgDuration">
        <el-select v-model="formData.msgDuration">
          <el-option v-for="item in DURATION" :key="item.val" :label="item.label" :value="item.val" />
        </el-select>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  computed,
  reactive,
  onMounted,
  toRefs,
  watch
} from '@vue/composition-api'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { $refs, $nextTick } = getCurrentInstance().proxy

    const state = reactive({
      formData: {
        isFree: '',
        msgAdditionalPrice: undefined,
        msgDuration: ''
      },
      btnLoading: false,
      rules: {
        isFree: [{ required: true, message: '请选择信息流是否免费', trigger: ['blur', 'change'] }],
        msgAdditionalPrice: [{ required: true, message: '请输入信息流额外金额', trigger: ['blur'] }],
        msgDuration: [{ required: true, message: '请选择信息流时长', trigger: ['blur', 'change'] }]
      },
      FREE: [{ val: 1, label: '免费' }, { val: 0, label: '付费' }],
      DURATION: [{ val: 1, label: '1-3个月' }, { val: 2, label: '4-6个月' }, { val: 3, label: '6-12个月' }]
    })

    watch(() => state.formData.isFree, (val) => {
      if (val === 1) {
        state.formData.msgAdditionalPrice = undefined
      }
    })

    onMounted(() => {
      state.formData = {
        ...state.formData,
        ...props.data
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      await $refs.form.validate()

      emit('confirm', state.formData)
    }

    return {
      ...toRefs(state),
      handleClose,
      handleConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.date {
  width: 180px;
}

.checkBox {
  padding-top: 6px;
}
</style>
