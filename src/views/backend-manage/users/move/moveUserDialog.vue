<template>
  <el-dialog
    title="离职移交"
    :visible="show"
    width="700px"
    :before-close="handleClose"
  >
    <div>
      <p class="m-b-16 tip-gray">与离职人员相关待继续跟进对接的客户记录、商单记录、工单记录统一调整交接。</p>
      <el-form ref="form" :model="form" label-suffix=":" :rules="rules" label-width="90px">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="组织名称">
              {{ form.orgName }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离职人员">
              {{ form.realname }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col>
            <el-form-item label="交接人员" prop="receiverUserId">
              <el-select v-model="form.receiverUserId" filterable clearable placeholder="交接人员">
                <el-option v-for="item in receiverUserList" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <p class="tip-red">一旦离职移交处理后数据无法回退，请确认后操作！</p>
    </div>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getReceiverUser, $receiverUser } from '@/api/backend-manage'

export default defineComponent({
  props: {
    value: Boolean,
    data: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { $refs, $message, $confirm } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const form = reactive({
      orgName: props.data.orgName,
      realname: props.data.realname,
      beTransferUserId: props.data.id,
      receiverUserId: null
    })
    const rules = {
      receiverUserId: { required: true, message: '请选择交接人员', trigger: 'change' }
    }
    const loading = ref(false)
    const receiverMessage = ref('')
    const handleSave = async() => {
      await $refs.form.validate()
      const { dName, fName } = receiverUserList.value.find(item => item.id === form.receiverUserId)
      await $confirm(`交接人员组织：${dName} - ${fName}。<br/><p class="tip-red">一旦离职移交处理后数据无法回退，请确认后操作！</p>`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        dangerouslyUseHTMLString: true
      })
      loading.value = true
      const res = await $receiverUser(form)
      if (res.code === 1) {
        $message.success('操作成功')
        handleClose()
        emit('success')
      } else {
        $message.error(res.message)
      }
      loading.value = false
    }

    const receiverUserList = ref([])
    const getReceiverUser = () => {
      $getReceiverUser().then(res => {
        if (res.code === 1) {
          receiverUserList.value = res.data
        }
      })
    }
    getReceiverUser()
    return {
      form,
      rules,
      show,
      loading,
      handleClose,
      handleSave,
      receiverMessage,
      receiverUserList
    }
  }
})
</script>

