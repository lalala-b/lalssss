<template>
  <el-dialog
    title="导入工单数据"
    :visible.sync="show"
    width="600px"
    @close="handleClose"
  >
    <div class="select-content">
      <span class="m-r-16">请选择需要导入的字段</span>
      <el-select
        ref="selectOptions"
        v-model="values"
        v-loading="loading"
        multiple
        collapse-tags
        placeholder="请选择"
      >
        <el-option
          v-for="item in dataList"
          :key="item.dictValue"
          :label="item.dictLabel"
          :value="item.dictValue"
        />
      </el-select>
      <el-tooltip
        content="请使用工单管理中导出的表格模板导入数据"
        placement="top"
      >
        <el-upload
          v-loading="uploadAccountLoading"
          accept=".xls,.xlsx"
          :with-credentials="true"
          :before-upload="beforeUploadAccount"
          :on-success="uploadAccountSuccess"
          :on-error="uploadAccountError"
          action="/api/work/order/excel/uploadWorkerOrderEditBySelect"
          name="file"
          :show-file-list="false"
          style="display: inline-block"
          :data="{ fieldList:values }"
          element-loading-spinner="el-icon-loading"
        >
          <el-button class="m-l-24" type="primary">导入表格</el-button>
        </el-upload>
      </el-tooltip>
    </div>
  </el-dialog>
</template>
  <script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getImportList } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      values: [],
      loading: false,
      uploadAccountLoading: false
    })
    const dataList = ref([])
    const getImportList = () => {
      states.loading = true
      $getImportList().then(res => {
        if (res.code === 1 && res.data) {
          dataList.value = res.data
        }
        states.loading = false
      }).catch(err => { console.error(err) })
    }
    const beforeUploadAccount = (file) => {
      const re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        states.uploadAccountLoading = true
      } else {
        $message.error('只支持 Excel 文件')
      }
      return re
    }
    const uploadAccountSuccess = (res) => {
      if (res.code === 1) {
        handleClose()
        if (res.data.errorCount === 0) {
          $message({
            message: '上传全部成功',
            type: 'success'
          })
        } else {
          const cacheKey = res.data.cacheKey
          const tplUrl = `/api/work/order/excel/downloadWorkerOrderErrInfo?type=2&cacheKey=${cacheKey}`
          $message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `上传失败工单${res.data.errorCount}个 <a target="_blank" href="${tplUrl}" style="color: #1890ff">下载明细</a>`,
            duration: 0,
            type: 'warning'
          })
        }
        emit('success')
      } else {
        $message.error(res.message)
      }
      states.uploadAccountLoading = false
    }
    const uploadAccountError = (err) => {
      states.uploadAccountLoading = false
      $message.error(err)
    }
    getImportList()
    return {
      handleClose,
      dataList,
      ...toRefs(states),
      show,
      beforeUploadAccount,
      uploadAccountSuccess,
      uploadAccountError
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-dialog__body {
    height: 300px;
  }
  .el-loading-spinner {
    top: 85%;
  }
  // .el-select__tags {
  //  flex-wrap: unset;
  //  overflow: auto;
  // }
}
</style>

