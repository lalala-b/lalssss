<template>
  <el-dialog
    title="上传黑名单"
    :visible.sync="show"
    :before-close="close"
    width="400px"
  >

    <el-upload
      v-loading="disabled"
      :action="templateUrl"
      :on-error="onImportError"
      :on-success="onImportSuccess"
      :before-upload="onImportReady"
      name="file"
      accept=".xls,.xlsx"
      :disabled="disabled"
      :show-file-list="false"
      :with-credentials="true"
      drag
      element-loading-text="正在上传文件..."
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.6)"
    >
      <p class="red-tip">黑名单的账号，不允许提报需求，不允许新建订单。有订单的，订单状态处于”待审核、待下单付款"，不允许进入下一个阶段。</p>
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        <p>
          下载
          <el-link
            type="primary"
            :href="`/api/business/foreign/blockAccount/downLoadBlockAccountFile`"
            target="_blank"
            :underline="false"
          >账号黑名单模版</el-link>
        </p>
        <p v-if="showPrvStatus">
          上次上传状态：提交{{ prvInfo.total }}条账号信息，导入成功{{ prvInfo.successCount }}条，导入失败{{ prvInfo.errorCount }}条！
          <a
            v-if="prvInfo.errorCount"
            target="_blank"
            :href="tpUrl"
            style="color: blue"
          >下载明细</a>
        </p>
      </div>
    </el-upload>
  </el-dialog>
</template>

<script>
import { defineComponent, reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getPrvResultCount } from '@/api/bussiness-manage'
export default defineComponent({
  props: {
    value: Boolean
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const states = reactive({
      data: {},
      templateUrl: '/api/business/foreign/blockAccount/uploadFile',
      qData: {},
      file: '',
      tpUrl: '/api/business/foreign/blockAccount/downLoadlastUploadFile',
      prvInfo: {},
      disabled: false,
      times: null,
      showPrvStatus: false
    })
    // 预备上传处理函数
    const onImportReady = (file) => {
      var re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        states.disabled = true
      } else {
        $message.error('只支持 Excel 文件')
      }
      return re
    }
    // 上传成功时
    const onImportSuccess = (res) => {
      if (res.code === 1) {
        onOffLineTodo()
      } else {
        $message.error(res.message)
        states.disabled = false
      }
    }
    // 上传失败时
    const onImportError = (err) => {
      $message.error('err')
      states.disabled = false
    }

    // 获取上次导入的状态
    const getPrvImportStatus = () => {
      $getPrvResultCount().then((res) => {
        if (res.code === 1) {
          states.prvInfo = res.data
          if (res.data) {
            if (res.data.currentParseStatus !== 1) {
              clearTimes()
              if (states.disabled) {
                $message.success('操作成功')
              }
              states.disabled = false
            } else {
              states.disabled = true
            }
            if (res.data.currentParseStatus === 0) {
              // 上一次是否有上传
              states.showPrvStatus = false
            } else {
              states.showPrvStatus = true
              emit('update')
            }
          }
        } else {
          $message.error(res.message || '获取上次上传状态失败')
          states.disabled = false
        }
      })
    }
    const onOffLineTodo = () => {
      getPrvImportStatus()
      states.times = setInterval(getPrvImportStatus, 5000)
    }
     // 清除计时器
    const clearTimes = () => {
      clearInterval(states.times)
    }
    const close = () => {
      clearTimes()
      handleClose()
    }
    onOffLineTodo()
    return {
      show,
      close,
      ...toRefs(states),
      onImportSuccess,
      onImportError,
      onImportReady
    }
  }
})
</script>
<style lang="scss" scoped>
.red-tip{
  padding-top: 8px;
  color: red;
  text-align: left;
}
.el-icon-upload{
  margin: 0;
}
</style>
