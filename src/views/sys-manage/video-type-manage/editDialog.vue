<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    width="600px"
  >
    <el-form ref="form" :model="form" label-width="120px" label-suffix="：">
      <el-form-item v-if="type === 'detail' || type === 'edit'" label="平台">{{ form.platName }}</el-form-item>
      <el-form-item label="视频类型">
        <el-input v-if="type === 'add'" v-model="form.junType" placeholder="视频类型" />
        <el-select v-else-if="type === 'moreEdit'" v-model="form.junType" filterable placeholder="视频类型">
          <el-option
            v-for="item in junTypeList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <template v-else>{{ form.junType }}</template>
      </el-form-item>
      <el-form-item label="军工系数">
        <template v-if="type === 'detail'">{{ form.junNum }}</template>
        <el-input-number v-else v-model="form.junNum" :min="0" placeholder="军工系数" />
      </el-form-item>
      <el-form-item label="是否有起征点">
        <template v-if="type === 'detail'">{{ form.needFlow === 1 ? '否' : '是' }}</template>
        <el-radio-group v-else v-model="form.needFlow">
          <el-radio :label="1">否</el-radio>
          <el-radio :label="0">是</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="起征点">
        <template v-if="type === 'detail'">{{ form.startPoint }}</template>
        <el-input-number v-else v-model="form.startPoint" :min="0" placeholder="起征点" />
      </el-form-item>
      <el-form-item label="上线状态">
        <template v-if="type === 'detail'">{{ form.isOnline === 1 ? '上线' : '下线' }}</template>
        <el-radio-group v-else v-model="form.isOnline">
          <el-radio :label="1">上线</el-radio>
          <el-radio :label="0">下线</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="删除状态">
        <template v-if="type === 'detail'">{{ form.isDeleted === 1 ? '删除' : '正常' }}</template>
        <el-radio-group v-else v-model="form.isDeleted">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">删除</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="广告类型">
        <template v-if="type === 'detail'">{{ form.advType === 1 ? '广告':'非广告' }}</template>
        <el-radio-group v-else v-model="form.advType">
          <el-radio :label="1">广告</el-radio>
          <el-radio :label="0">非广告</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="品牌类型">
        <template v-if="type === 'detail'">{{ form.brand }}</template>
        <el-input v-else v-model="form.brand" placeholder="品牌类型" />
      </el-form-item>
      <el-form-item label="业务类型">
        <template v-if="type === 'detail'">{{ form.businessType }}</template>
        <el-input v-else v-model="form.businessType" placeholder="业务类型" />
      </el-form-item>
    </el-form>
    <div v-if="type !== 'detail'" slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { computed, defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $editVideoType, $addVidepType, $editMoreVideoType } from '@/api/backend-manage'
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
    const form = reactive(Object.assign({
      junType: null,
      junNum: null,
      needFlow: null,
      startPoint: null,
      isOnline: null,
      isDeleted: null,
      advType: null,
      brand: null,
      businessType: null
    }, props.data))
    const loading = ref(false)
    const handleSave = () => {
      loading.value = true
      if (props.type === 'edit') handleEditSave()
      if (props.type === 'add') handleAddSave()
      if (props.type === 'moreEdit') handleMoreEditSave()
    }
    const handleEditSave = () => {
      $editVideoType(form).then(res => {
        if (res.code === 1) {
          handleClose()
          loading.value = false
          emit('success')
        } else {
          $message.error(res.message)
        }
      })
    }
    const handleAddSave = () => {
      $addVidepType(form).then(res => {
        if (res.code === 1) {
          handleClose()
          loading.value = false
          emit('success')
        } else {
          $message.error(res.message)
        }
      })
    }
    const handleMoreEditSave = () => {
      $editMoreVideoType(form).then(res => {
        if (res.code === 1) {
          handleClose()
          loading.value = false
          emit('success')
        } else {
          $message.error(res.message)
        }
      })
    }

    const titleMap = {
      'add': '添加视频类型',
      'edit': '编辑视频类型',
      'detail': '查看视频类型',
      'moreEdit': '批量编辑视频类型'
    }
    const title = computed(() => {
      return titleMap[props.type]
    })
    return {
      loading,
      form,
      show,
      title,
      handleClose,
      handleSave
    }
  }
})
</script>
