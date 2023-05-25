<template>
  <el-dialog
    title="投放专员指派"
    :visible.sync="show"
    :before-close="handleClose"
    width="500px"
  >
    <el-form ref="form" :model="form" label-suffix="：">
      <el-form-item label="投放专员">{{ form.deliveryName }}</el-form-item>
      <el-form-item label="是否仅负责部分广告师需求">
        <el-radio-group v-model="form.belongAdvertiserFlag">
          <el-radio :label="0">否</el-radio>
          <el-radio :label="1">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.belongAdvertiserFlag === 0" label="承接平台（支持多选）">
        <el-select
          v-model="form.platIds"
          placeholder=""
          :multiple="true"
          filterable
          clearable
        >
          <el-option
            v-for="item in platList"
            :key="item.platId"
            :value="String(item.platId)"
            :label="item.platName"
          />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.belongAdvertiserFlag === 1" label="对接广告师（支持多选）">
        <el-select
          v-model="form.advertiserIds"
          placeholder=""
          :multiple="true"
          filterable
          clearable
        >
          <el-option
            v-for="item in advertiserList"
            :key="item.advertiserUserId"
            :value="item.advertiserUserId"
            :label="item.advertiserUserName"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
// import { copy } from '@/utils'
import { $getAdvertiserInfo, $editAppoint, $getBasePlatInfo } from '@/api/putting-manager'
import { copy } from '@/components/common'

export default defineComponent({
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
    const form = reactive({
      id: props.editData.id,
      deliveryId: props.editData.deliveryId,
      deliveryName: props.editData.deliveryName,
      belongAdvertiserFlag: props.editData.belongAdvertiserFlag,
      platIds: props.editData.platInfo?.map(item => item.platId),
      advertiserIds: props.editData.advertiserInfo?.map(item => item.advertiserUserId) || []
    })

    const advertiserList = ref(copy(props.editData.advertiserInfo) || [])
    const getAdvertiserInfo = () => {
      $getAdvertiserInfo().then(res => {
        if (res.code === 1) {
          advertiserList.value = advertiserList.value.concat(res.data || [])
        }
      })
    }
    getAdvertiserInfo()

    const platList = ref([])
    const getBasePlatInfo = () => {
      $getBasePlatInfo().then(res => {
        if (res.code === 1) {
          platList.value = res.data
        }
      })
    }
    getBasePlatInfo()
    const loading = ref(false)
    const handleSave = () => {
      loading.value = true
      if (form.belongAdvertiserFlag === 0) {
        form.advertiserIds = []
      } else {
        form.platIds = []
      }
      $editAppoint(form).then(res => {
        if (res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message.error(res.message)
        }
        loading.value = false
      })
    }
    return {
      form,
      show,
      loading,
      advertiserList,
      platList,
      handleClose,
      handleSave
    }
  }
})
</script>
