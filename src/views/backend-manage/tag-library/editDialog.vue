<template>
  <el-dialog
    :visible="show"
    :title="title"
    width="600px"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div v-loading="loading">
      <el-form ref="form" label-width="140px">
        <el-form-item label="第三方标签ID：">
          {{ detail.tagId || '--' }}
        </el-form-item>

        <el-form-item label="标签名：">
          <el-input v-model="detail.tagName" :disabled="disabled" maxlength="10" />
        </el-form-item>

        <el-form-item label="是否禁用：">
          <el-switch v-model="detail.enableFlag" :disabled="disabled" active-color="#13ce66" inactive-color="#ff4949" />
        </el-form-item>

        <el-form-item v-if="disabled" label="标签类型：">
          {{ detail.tagTypeName || '--' }}
        </el-form-item>

        <el-form-item v-if="disabled" label="所属层级：">
          {{ levelMap[detail.tagLevel] }}级标签
        </el-form-item>

        <el-form-item v-if="disabled && +detail.tagLevel === 2" label="所属一级标签：">
          {{ detail.parentTagName }}
        </el-form-item>

        <el-form-item v-if="disabled" label="所属平台：">
          {{ detail.platName }}
        </el-form-item>

        <el-form-item v-if="disabled" label="标签来源：">
          {{ ['系统', '自定义'][detail.source] || '--' }}
        </el-form-item>

        <el-form-item v-if="disabled" label="创建人：">
          {{ detail.creatorUserName || '--' }}
        </el-form-item>

        <el-form-item v-if="disabled" label="创建时间：">
          {{ detail.createdTime ? dayjs(detail.createdTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
        </el-form-item>

        <el-form-item v-if="disabled" label="最近更新人：">
          {{ detail.updateUserName || '--' }}
        </el-form-item>

        <el-form-item v-if="disabled" label="最近更新时间：">
          {{ detail.updatedTime ? dayjs(detail.updatedTime).format('YYYY-MM-DD HH:mm:ss') : '--' }}
        </el-form-item>
      </el-form>

    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-if="type === 'edit'" :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch, computed } from '@vue/composition-api'
import { $getTagDetail, $updateSysPlatTag } from '@/api/tag-library'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: ''
    }
  },
  setup(props, { emit }) {
    const { $message, $confirm } = getCurrentInstance().proxy

    const showDialog = computed(() => props.show)

    const title = computed(() => props.type === 'edit' ? '编辑标签' : '标签详情')

    const disabled = computed(() => props.type === 'view')

    const state = reactive({
      reason: '',
      btnLoading: false,
      loading: false,
      detail: {},
      tagTypeArr: [{
        val: 0,
        label: '内容标签'
      }, {
        val: 1,
        label: '行业标签'
      }],
      levelMap: ['', '一', '二', '三', '四', '五']
    })

    watch(() => props.id && props.show, (val) => {
      if (val) {
        handleGetDetail()
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      try {
        state.btnLoading = true

        const { code, message } = await $updateSysPlatTag({ ...state.detail, enableFlag: Number(state.detail.enableFlag) })

        if (+code === 1) {
          $message.success('更新成功')
          emit('confirm')
        } else {
          $message.error(message)
        }

        state.btnLoading = false
      } catch (e) {
        state.btnLoading = false
        $message.error(e)
      }
    }

    const handleGetDetail = async() => {
      state.loading = true
      try {
        const { code, data } = await $getTagDetail({ md5Id: props.id })
        if (+code === 1) {
          state.detail = data
        }

        state.loading = false
      } catch (e) {
        state.loading = false
        $message.error(e)
      }
    }

    return {
      ...toRefs(state),
      title,
      disabled,
      dayjs,
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

  // .el-form-item {
  //   display: flex;
  // }
}

</style>
