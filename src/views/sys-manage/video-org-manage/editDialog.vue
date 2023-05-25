<template>
  <el-dialog
    title="视频类型绑定"
    :visible.sync="show"
    :before-close="handleClose"
    width="800px"
  >
    <el-form ref="form" :model="form" label-width="120px" label-suffix="：">
      <el-form-item label="组织">
        {{ form.orgName }}
      </el-form-item>
      <el-form-item label="视频类型">
        <el-transfer
          v-model="form.videoTypes"
          :titles="['未选视频类型', '已选视频类型']"
          filterable
          filter-placeholder="请输入视频类型"
          :data="videoTypeList"
        />
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getVideoTypeByOrgId, $getVideoTypeList, $bindVideoType } from '@/api/backend-manage'
export default defineComponent({
  props: {
    value: Boolean,
    data: Object,
    type: String,
    junTypeList: Array
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const form = reactive(Object.assign({ videoTypes: [] }, props.data))
    const videoTypeList = ref([])
    const loading = ref(false)
    const handleSave = () => {
      loading.value = true
      handleEditSave()
    }

    const getVideoTypeByOrgId = () => {
      $getVideoTypeByOrgId({ orgId: form.orgId }).then(res => {
        if (res.code === 1) {
          form.videoTypes = res.data
        }
      })
    }
    const getVideoTypeList = () => {
      $getVideoTypeList({ orgId: form.orgId }).then(res => {
        if (res.code === 1) {
          videoTypeList.value = res.data.map(item => ({ key: item, label: item }))
        }
      })
    }
    getVideoTypeList()
    getVideoTypeByOrgId()
    const handleEditSave = () => {
      $bindVideoType(form).then(res => {
        if (res.code === 1) {
          handleClose()
          loading.value = false
          emit('success')
        } else {
          $message.error(res.message)
        }
      })
    }
    // const handleAddSave = () => {
    //   $addVidepType(form).then(res => {
    //     if (res.code === 1) {
    //       handleClose()
    //       loading.value = false
    //       emit('success')
    //     } else {
    //       $message.error(res.message)
    //     }
    //   })
    // }

    return {
      loading,
      form,
      show,
      videoTypeList,
      handleClose,
      handleSave
    }
  }
})
</script>
