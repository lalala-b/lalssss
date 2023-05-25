<template>
  <el-dialog
    title="确认"
    :visible="show"
    width="480px"
    :close-on-click-modal="false"
    @close="handleCancel"
  >
    <div>放弃合作提出方：</div>
    <el-radio v-model="abandonType" class="radio" :label="1">
      账号达人<span class="tip">（达人直接平台侧取消接单，支付金额原路返回）</span>
    </el-radio>
    <br>
    <el-radio v-model="abandonType" class="radio" :label="2">
      我司广告师<span class="tip error">（需支付任务取消的违约金）</span>
    </el-radio>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button :loading="giveLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, toRefs, computed, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    giveLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      abandonType: 1
    })

    const showDialog = computed(() => props.show)

    watch(showDialog, val => {
      if (val) state.abandonType = 1
    })

    const handleCancel = () => {
      emit('close')
    }

    const handleConfirm = () => {
      emit('confirm', { type: state.abandonType })
    }

    return {
      ...toRefs(state),
      handleCancel,
      handleConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.radio {
  margin-top: 16px;
}

.tip {
  font-size: 12px;
  color: #999;
}

.error {
  color: #ff0000;
}
</style>
