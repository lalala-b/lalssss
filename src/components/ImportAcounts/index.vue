<template>
  <el-dialog
    :title="config.title"
    :visible="visible"
    width="400px"
    :before-close="onClose"
  >
    <el-upload
      ref="importUploader"
      v-loading="disabled"
      :data="qData"
      :action="config.url || '/api/tiktok/import/account'"
      :on-error="onImportError"
      :on-success="onImportSuccess"
      :before-upload="onImportReady"
      :disabled="disabled"
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
    <div v-if="type !== 'replace'">导入
      <el-link
        type="primary"
        :href="templateUrl || `/api/tiktok/account/downMould?type=1&pageType=${config.pageType || 1}`"
        target="_blank"
        :underline="false"
      >模板下载</el-link>
    </div>
    <div v-if="isOffLine && showPrvStatus">
      上次上传状态：提交{{ prvInfo.total }}条账号信息，导入成功{{ prvInfo.successCount }}条，导入失败{{ prvInfo.errorCount }}条！ <a v-if="prvInfo.errorCount" target="_blank" :href="offLineTplUrl" style="color:blue">下载明细</a>
    </div>
    <slot />
  </el-dialog>
</template>
<script>
import './index.scss'
import { extend } from '@/components/common'
import { $getPrvImportStatus } from '@/api/bussiness-manage'

export default {
  props: {
    prevStatusUrl: {
      type: Function,
      default: null
    },
    templateUrl: {
      type: String,
      default: ''
    },
    failUrl: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: null
    },
    show: {
      type: Boolean,
      default: false
    },
    isOffLine: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      url: '/api/tiktok/import/account',
      offLineTplUrl: '',
      success: false,
      disabled: false,
      showPrvStatus: false,
      prvInfo: {}
    }
  },
  computed: {
    qData() {
      return extend({ methodId: this.config.methodId || 1 }, this.config.query || {})
    },
    visible() {
      return this.show
    }
  },
  created() {
    if (this.isOffLine) {
      this.onOffLineTodo()
    }
  },
  beforeDestroy() {
    this.clearTimes()
  },
  methods: {
    /**
     * 上传失败处理函数
     * @type {Boolean}
     */
    onImportError(err) {
      this.$message.error(err, 'error')
      this.disabled = false
    },
    /**
     * 上传成功
     * @type {Boolean}
     */
    onImportSuccess(res) {
      if (res.code === 1) {
        // 批量替换
        if (this.type === 'replace' && !this.prevStatusUrl) {
          this.disabled = false
          if (!res.data.errCount) {
            this.$emit('success')
          } else {
            const cacheKey = res.data.cacheKey
            const tplUrl = `/api/business/foreign/medAccount/downloadMedAccountErrInfo/${cacheKey}`

            this.$message({
              showClose: true,
              dangerouslyUseHTMLString: true,
              message: `上传失败${res.data.errCount}条！ <a target='_blank' href='${tplUrl}' style="color:blue">下载明细</a>`,
              duration: 0,
              type: 'warning'
            })

            this.$emit('reload')
          }
          return
        }

        if (this.isOffLine) {
          // 离线
          this.onOffLineTodo(res)
        } else {
          this.onLineToDo(res)
          this.disabled = false
        }
        this.$emit('success')
      } else {
        this.$message.error(res.message)
        this.disabled = false
      }
    },
    /**
     * 准备上传，文件判断
     */
    onImportReady(file) {
      var re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        this.disabled = true
      } else {
        this.$message.error('只支持 Excel 文件')
      }
      return re
    },
    /**
     * 导入界面关闭处理
     */
    onClose() {
      this.$emit('close')
    },
    onLineToDo(res) {
      if (res.data.error === 0) {
        this.$message({
          message: `提交${res.data.total}条账号信息，导入成功${res.data.success}条！`,
          type: 'success'
        })
      } else {
        const tplUrl = this.failUrl ? `${this.failUrl}?batchNo=${res.data.batchNo}` : `/api/tiktok/account/downMould?type=2&cacheKey=${res.data.cacheKey}&pageType=${this.config.pageType || 1}`
        this.$message({
          showClose: true,
          dangerouslyUseHTMLString: true,
          message: `提交${res.data.total}条账号信息，导入成功${res.data.success}条，导入失败${res.data.error}条！ <a target='_blank' href='${tplUrl}' style="color:blue">下载明细</a>`,
          duration: 0,
          type: 'error'
        })
      }
    },
    onOffLineTodo() {
      this.getPrvImportStatus()
      this.times = setInterval(this.getPrvImportStatus, 5000)
    },
    // 获取上次导入的状态
    getPrvImportStatus() {
      console.log(this.prevStatusUrl)
      if (this.type === 'replace' && !this.prevStatusUrl) return
      const $api = this.prevStatusUrl ? this.prevStatusUrl : $getPrvImportStatus
      $api().then(res => {
        if (res.code === 1) {
          this.prvInfo = res.data
          if (res.data.currentParseStatus !== 1) {
            // 是否解析中
            this.offLineTplUrl = this.failUrl ? `${this.failUrl}?batchNo=${res.data.batchNo}` : `/api/intermediary/upload/downloadErrorData?batchNo=${res.data.batchNo}`
            this.clearTimes()
            if (this.disabled) {
              this.$message.success('上传成功')
            }
            this.disabled = false
          } else {
            this.disabled = true
          }
          if (res.data.currentParseStatus === 0) {
            // 上一次是否有上传
            this.showPrvStatus = false
          } else {
            this.showPrvStatus = true
          }
        } else {
          this.$message.error(res.message || '获取上次上传状态失败')
          this.disabled = false
        }
      })
    },
    // 清除计时器
    clearTimes() {
      clearInterval(this.times)
    }
  }
}
</script>
