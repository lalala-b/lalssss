<template>
  <el-dialog
    title="批量更新媒介账号信息"
    :visible.sync="show"
    width="600px"
    @close="handleClose"
  >
    <div class="select-content">
      <span class="m-r-16">请选择需要更新的信息</span>
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
      <el-upload
        v-loading="uploadAccountLoading"
        accept=".xls,.xlsx"
        :with-credentials="true"
        :before-upload="beforeUploadAccount"
        :on-success="uploadAccountSuccess"
        :on-error="uploadAccountError"
        :action="`${updateUrl}?fileds=${values.join(',')}`"
        name="file"
        :show-file-list="false"
        style="display: inline-block"
        element-loading-spinner="el-icon-loading"
      >
        <el-button class="m-l-24" type="primary">导入表格</el-button>
      </el-upload>
    </div>
    <p class="notice">导入的表格模板为媒介账号库中导出的excel</p>
  </el-dialog>
</template>
  <script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  computed
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $accountGetFileds } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: ''
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

    const updateUrl = computed(() => {
      const { type } = props

      let url = ''

      if (type === 'douyin') {
        url = '/api/medium/tiktok/account/updateChargePersonBatchByImport'
      } else if (type === 'kuaishou') {
        url = '/api/medium/kuaishou/account/updateChargePersonBatchByImport'
      } else if (type === 'bilibili') {
        url = '/api/medium/bili/account/updateChargePersonBatchByImport'
      } else if (type === 'xiaohongshu') {
        url = '/api/medium/redBook/account/updateChargePersonBatchByImport'
      }
      return url
    })

    const dataList = ref([])
    const getImportList = () => {
      states.loading = true
      $accountGetFileds().then(res => {
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
        if (res.data.errCount === 0) {
          $message({
            message: '全部更新成功',
            type: 'success'
          })
        } else {
          const cacheKey = res.data.cacheKey
          const tplUrl = `/api/business/foreign/medAccount/downloadChargePersonBatchErrInfo?cacheKey=${cacheKey}`
          $message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `更新失败${res.data.errCount}个 <a target="_blank" href="${tplUrl}" style="color: #1890ff">下载明细</a>`,
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
      updateUrl,
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

.notice {
  margin-top: 40px;
  text-align: center;
  color: #e6a23c;
}
</style>

