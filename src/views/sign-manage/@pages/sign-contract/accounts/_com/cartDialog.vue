<template>
  <el-dialog
    width="680px"
    title="购物车权益"
    :close-on-click-modal="false"
    append-to-body
    :visible.sync="show"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" label-width="124px" :rules="rules">
      <el-form-item label="购物车是否免费" prop="isFree">
        <el-select v-model="formData.isFree">
          <el-option v-for="item in FREE" :key="item.val" :label="item.label" :value="item.val" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.isFree === 0" label="挂车额外金额" prop="trailerAdditionalPrice">
        <el-input-number v-model="formData.trailerAdditionalPrice" :precision="1" :min="0" :max="100000000" label="挂车额外金额" /> 元
      </el-form-item>

      <el-form-item label="佣金要求" prop="isHasCommission">
        <el-select v-model="formData.isHasCommission">
          <el-option v-for="item in COMMISSION" :key="item.val" :label="item.label" :value="item.val" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="formData.isHasCommission" label="佣金比例" prop="commissionRatio">
        <el-input-number v-model="formData.commissionRatio" :precision="1" :min="0" :max="100" label="挂车额外金额" /> %
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
        trailerAdditionalPrice: undefined,
        isHasCommission: '',
        commissionRatio: undefined
      },
      btnLoading: false,
      rules: {
        isFree: [{ required: true, message: '请选择购物车是否免费', trigger: ['blur', 'change'] }],
        trailerAdditionalPrice: [{ required: true, message: '请输入挂车额外金额', trigger: ['blur'] }],
        isHasCommission: [{ required: true, message: '请选择佣金要求', trigger: ['blur', 'change'] }],
        commissionRatio: [{ required: true, message: '请输入佣金要求', trigger: ['blur'] }]
      },
      FREE: [{ val: 1, label: '免费' }, { val: 0, label: '付费' }],
      COMMISSION: [{ val: 1, label: '有佣金要求' }, { val: 0, label: '无佣金要求' }]
    })

    watch(() => state.formData.isFree, (val) => {
      if (val === 1) {
        state.formData.trailerAdditionalPrice = undefined
      }
    })

    watch(() => state.formData.isHasCommission, (val) => {
      if (val === 0) {
        state.formData.commissionRatio = undefined
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
