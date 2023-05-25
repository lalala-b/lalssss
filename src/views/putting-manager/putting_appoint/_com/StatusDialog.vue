<template>
  <el-dialog
    title="状态修改"
    :visible="show"
    @close="handleClose"
  >
    <el-form
      ref="form"
      :model="fromData"
      label-suffix="："
      label-width="120px"
    >
      <el-form-item label="投放专员" prop="deliveryId">
        {{ editData.deliveryName }}
      </el-form-item>
      <el-form-item label="投放专员状态" prop="leaveStatus">
        <el-select v-model="fromData.leaveStatus" placeholder="投放专员状态">
          <el-option
            v-for="(val, key) in LEAVE_STATUS"
            :key="key"
            :value="Number(key)"
            :label="val"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleChangeLeaveStatus">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { useToggle } from '@/hook'
import { ref, getCurrentInstance, reactive } from '@vue/composition-api'
import { $editLeaveStatus } from '@/api/putting-manager'
import { useConstMap } from './hook'
export default {
  props: {
    value: Boolean,
    editData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const fromData = reactive({
      id: props.editData.id,
      deliveryId: props.editData.deliveryId || '',
      leaveStatus: props.editData.leaveStatus || 0
    })
    const loading = ref(false)
    const handleChangeLeaveStatus = function() {
      loading.value = true
      $editLeaveStatus(fromData).then(res => {
        if (res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message.error(res.message)
        }
       loading.value = false
      }).catch(err => {
        if (err.__CANCEL__) return
       loading.value = false
        $message.error(err.message)
      })
    }

    const { LEAVE_STATUS } = useConstMap()

    return {
      show,
      loading,
      handleClose,
      fromData,
      handleChangeLeaveStatus,
      LEAVE_STATUS
    }
  }
}
</script>
