<template>
  <el-dialog
    title="批量编辑"
    :visible.sync="show"
    width="420px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" :inline="true">
      <el-form-item label="是否公司手机卡：">
        <el-radio-group v-model="formData.corporationPhoneFlag">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="账号保管部门：">
        <el-cascader
          v-model="formData.careOrgId"
          placeholder="请选择账号保管部门"
          :options="orgInfoConditionVOS"
          :props="{
            checkStrictly: true,
            value: 'id',
            label: 'orgName',
            children: 'childOrgList',
            emitPath: false,
          }"
          clearable
          filterable
        />
      </el-form-item>
    </el-form>
    <p class="red-tip">注意：若未选择填写某项则表示不修改</p>
    <div slot="footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="editSave"
      >确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $updateAccountInventoryBatch } from '@/api/account-manage'
import { useToggle } from '@/hook'
import { copy } from '@/utils'
export default defineComponent({
  props: {
    accountIds: {
      type: Array,
      default() {
        return []
      }
    },
    value: Boolean,
    orgInfoConditionVOS: {
      type: Array,
      default() {
        return []
      }
    },
    userCards: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      formData: {},
      loading: false,
      bindList: ''
    })
    const editSave = async() => {
      try {
       const { careOrgId, corporationPhoneFlag } = states.formData
       if (!careOrgId && ![0, 1].includes(corporationPhoneFlag)) {
        $message.error('至少有一项修改才能进行提交~')
        return
       }
        const params = copy(states.formData)
        states.loading = true
        const res = await $updateAccountInventoryBatch({
          ...params,
          accountIds: props.accountIds
        })
        if (res && res.code === 1) {
          $message.success('操作成功')
          emit('clearSelect')
          emit('success')
          handleClose()
        } else {
          $message(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }
    return {
      ...toRefs(states),
      show,
      handleClose,
      editSave
    }
  }
})
</script>
