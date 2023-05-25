<template>
  <el-dialog
    :title="`已选${selectionArr.length}个账号`"
    :visible.sync="show"
    :close-on-click-modal="false"
    width="460px"
    :before-close="handleClose"
  >
    <div class="tipContent">
      请核查所选账号移交信息是否无误，确认后完成账号接收！
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button class="rejectBatchBtn" :loading="btnLoading" @click="handleReject">驳回</el-button>
      <el-button
        :loading="btnLoading"
        type="primary"
        @click="handleConfirm"
      >同意接收</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $batchAgreeAcceptAccount } from '@/api/operating-manage'
import { useToggle } from '@/hook'
export default defineComponent({
  props: {
    selectionArr: {
      type: Array,
      default() {
        return []
      }
    },
    value: Boolean
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      btnLoading: false
    })

    // 批量审批的接口方法
    const handleBatchReceiveAccount = async(obj) => {
      try {
        const params = { ...obj }
        params.transferOrderId = props.selectionArr
        states.btnLoading = true
        const res = await $batchAgreeAcceptAccount({
          ...params
        })
        if (+res.code === 1) {
          $message.success('操作成功')
          emit('close')
          emit('getList')
        } else {
          $message.error(res.message)
        }
        states.btnLoading = false
      } catch (err) {
        $message.error(err)
        states.btnLoading = false
      }
    }

    // 确认账号批量同意
    const handleConfirm = () => {
      handleBatchReceiveAccount({
        examineStatus: 1
      })
    }

    // 确认账号批量驳回
    const handleReject = () => {
      handleBatchReceiveAccount({
        examineStatus: 2
      })
    }

    return {
      ...toRefs(states),
      show,
      handleClose,
      handleConfirm,
      handleReject
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .tipContent {
    font-size: 16px;
  }

  .rejectBatchBtn {
    background: #babbbb;
    color: #fff;
    outline: none;
    border: none;

    &:hover {
      background: #8f9595;
    }
  }
}

</style>
