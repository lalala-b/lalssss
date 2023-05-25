<template>
  <el-dialog
    title="邮寄快递单号批量导入"
    :visible="showDialog"
    width="400px"
    :before-close="close"
  >
    <el-upload
      ref="importUploader"
      v-loading="disabled"
      :action="url"
      :on-error="onImportError"
      :on-success="onImportSuccess"
      :before-upload="onImportReady"
      name="file"
      class="upload-view"
      accept=".xls,.xlsx"
      drag
      :with-credentials="true"
      :show-file-list="false"
      element-loading-text="正在上传文件..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <div>
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或点击上传
          <em>点击上传</em>
        </div>
      </div>
    </el-upload>
    <div>
      导入
      <el-link
        type="primary"
        :href="downUrl"
        target="_blank"
        :underline="false"
      >模板下载</el-link>
    </div>
    <div v-if="showPrvStatus">
      上次上传状态：提交{{ prvInfo.total }}条快递单号信息，导入成功{{
        prvInfo.successCount
      }}条，导入失败{{ prvInfo.errorCount }}条！
      <a
        v-if="prvInfo.errorCount"
        target="_blank"
        :href="tpUrl"
        style="color: blue"
      >下载明细</a>
    </div>
    <slot />
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  onBeforeUnmount,
  reactive,
  toRefs,
  onMounted
} from '@vue/composition-api'
import { $getPreImportStatus } from '@/api/backend-manage'
export default defineComponent({
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const state = reactive({
      url: '/api/delivery/new/expressNumberBatchImport',
      failUrl: '/api/delivery/new/downloadErrorData',
      success: false,
      disabled: false,
      showPrvStatus: false,
      prvInfo: {},
      downUrl: '/api/delivery/new/expressNumberBatchImportTemplateDownload',
      tpUrl: '',
      times: null
    })
    // 预备上传处理函数
    const onImportReady = (file) => {
      var re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        state.disabled = true
      } else {
        $message.error('只支持 Excel 文件')
      }
      return re
    }
    // 上传失败处理函数
    const onImportError = (err) => {
      $message.error(err, 'error')
      state.disabled = false
    }

    // 上传成功处理函数

    const onImportSuccess = (res) => {
      if (res.code === 1) {
        onOffLineTodo(res)
      } else {
        $message.error(res.message)
        state.disabled = false
      }
    }

    // 获取上次导入的状态
    const getPreImportStatus = () => {
      $getPreImportStatus().then((res) => {
        if (res.code === 1) {
          state.prvInfo = res.data
          if (res.data) {
            if (res.data.currentParseStatus !== 1) {
              clearTimes()
              // 是否解析中
              if (state.tpUrl) state.tpUrl = ''
              state.tpUrl = state.failUrl + `?batchNo=${res.data.batchNo}`
              if (state.disabled) {
                $message.success('操作成功')
              }
              state.disabled = false
            } else {
              state.disabled = true
            }
            if (res.data.currentParseStatus === 0) {
              // 上一次是否有上传
              state.showPrvStatus = false
            } else {
              state.showPrvStatus = true
            }
          }
        } else {
          $message.error(res.message || '获取上次上传状态失败')
          state.disabled = false
        }
      })
    }

    const onOffLineTodo = () => {
      getPreImportStatus()
      state.times = setInterval(getPreImportStatus, 5000)
    }

    const close = () => {
      clearTimes()
      emit('close')
    }
    // 清除计时器
    const clearTimes = () => {
      clearInterval(state.times)
    }
    onMounted(() => {
      onOffLineTodo()
    })

    onBeforeUnmount(() => {
      clearTimes()
    })

    return {
      ...toRefs(state),
      close,
      onImportError,
      onImportSuccess,
      onImportReady
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
