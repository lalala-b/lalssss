<template>
  <el-dialog
    :visible="show"
    title="请输入不合作原因"
    width="800px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-row class="m-b-20">
      <el-col :span="12">
        <span>客户名称：</span>
        <span>{{ (data || {}).companyName || '--' }}</span>
      </el-col>

      <el-col :span="12">
        <span>需求描述：</span>
        <span>{{ (data || {}).requirementDesc || '--' }}</span>
      </el-col>
    </el-row>
    <el-input
      v-model="reason"
      type="textarea"
      maxlength="100"
      show-word-limit
      placeholder="不合作原因"
    />

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :disabled="!reason.length" :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch, computed } from '@vue/composition-api'
import { $refuseCooperate } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { $message, $confirm } = getCurrentInstance().proxy
    const showDialog = computed(() => props.show)

    const state = reactive({
      reason: '',
      btnLoading: false
    })

    watch(showDialog, (val) => {
      if (!val) {
        state.reason = ''
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const refuseCooperate = async() => {
      try {
        state.btnLoading = true
        const { code, message } = await $refuseCooperate({
          opportunityId: props.data.opportunityId,
          refuseCoopReason: state.reason
        })
        if (+code === 1) {
          $message.success('拒绝合作成功')
          handleClose()
          emit('getList')
        } else {
          $message.error(message || '网络错误')
        }
        state.btnLoading = false
      } catch (e) {
        $message.error(e || '网络错误')
        state.btnLoading = false
      }
    }

    const handleConfirm = async() => {
      if (props.type === 'confirm') {
        $confirm('撤销合作后，对应已生成的商单和工单均会被删除，且不可恢复，确定要撤销？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        refuseCooperate()
      })
      } else {
        refuseCooperate()
      }
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
::v-deep {
  textarea {
    height: 100px;
  }

  .el-dialog__wrapper {
    z-index: 2009;
  }
}

</style>
