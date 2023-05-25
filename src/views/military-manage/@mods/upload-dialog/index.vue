<template>
  <el-dialog
    :title="readonly? '查看素材' : '上传素材'"
    :visible.sync="pageShow"
    width="40%"
    :before-close="handleClose"
  >
    <el-form :model="pageData">
      <el-form-item prop="videoUrl">
        <el-row>
          <el-col :span="10" :offset="2">
            <div v-if="readonly">
              <div class="upload-view">
                <img
                  v-if="pageData.videoUrl"
                  :src="`${pageData.videoUrl}?vframe/jpg/offset/0.1`"
                  class="pic"
                  @click="viewVideo"
                >
                <span v-else>暂无数据</span>
              </div>
            </div>
            <el-upload
              v-else
              ref="uploadVideo"
              v-loading="videoUploading"
              class="upload-view"
              :on-success="uploadVideoSuccess"
              :on-preview="filePreview"
              :before-upload="beforeUpload"
              :show-file-list="false"
              drag
              :limit="1"
              accept=".mp4"
              name="file"
              :action="videoUploadUrl"
              element-loading-text="正在上传视频..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.6)"
            >
              <div v-if="pageData.videoUrl" class="upload-wrap el-upload-list--picture-card">
                <img
                  class="pic"
                  src="@/assets/video.png"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop.prevent="openUrl(pageData.videoUrl)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click.stop.prevent="delectVideo"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
              <div v-else>
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将视频文件拖到此处，或点击上传
                  <em>点击上传</em>
                </div>
              </div>
            </el-upload>
          </el-col>
          <el-col :span="10" :offset="2">
            <div v-if="readonly">
              <img
                v-if="pageData.imgUrl"
                :src="`${pageData.imgUrl}`"
                class="pic"
              >
              <span v-else>暂无数据</span>
            </div>
            <el-upload
              v-else
              ref="uploadImg"
              drag
              accept="*"
              :limit="1"
              class="upload-view"
              :on-success="uploadPhotoSuccess"
              :on-preview="filePreview"
              :show-file-list="false"
              :action="photoUploadUrl"
              name="file"
            >
              <div v-if="pageData.imgUrl" class="upload-wrap el-upload-list--picture-card">
                <img
                  class="pic"
                  :src="pageData.imgUrl"
                >
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click.stop.prevent="openUrl(pageData.imgUrl)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <span
                    class="el-upload-list__item-delete"
                    @click.stop.prevent="delectImg"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
              <div v-else>
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  将图片文件拖到此处，或点击上传
                  <em>点击上传</em>
                </div>
              </div>
            </el-upload>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span v-if="!readonly" slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { $uploadMilitarySource } from '@/api/military-manage'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    uploadSizeLimit: {
      type: Number,
      default: 30 * 1024 * 1024 // 30M
    }
  },
  data() {
    return {
      uploading: false,
      pageData: {
        flowId: '',
        videoUrl: '',
        imgUrl: ''
      },
      videoUploading: false,
      photoUploadUrl: `/api/admin/uploadImage`,
      videoUploadUrl: '/api/video/input/uploadVideo'
    }
  },
  computed: {
    pageShow: {
      set() {},
      get() {
        return this.show
      }
    }
  },
  watch: {
    dialogData(newVal) {
      if (newVal) {
        for (const key in this.pageData) {
          this.pageData[key] = newVal[key]
        }
      }
    }
  },
  methods: {
    openUrl(url) {
      window.open(url)
    },
    delectVideo(e) {
      this.pageData.videoUrl = ''
      this.$refs.uploadVideo && this.$refs.uploadVideo.clearFiles()
    },
    delectImg(e) {
      this.pageData.imgUrl = ''
      this.$refs.uploadImg && this.$refs.uploadImg.clearFiles()
    },
    beforeUpload(file) {
      if (file.size > this.uploadSizeLimit) {
        this.$message.error('请上传小于30M的文件')
        return false
      }
      this.videoUploading = true
    },
    viewImg() {
      window.open(this.pageData.imgUrl)
    },
    viewVideo() {
      window.open(this.pageData.videoUrl)
    },
    handleClose() {
      this.$emit('update:show', false)
      this.$refs.uploadVideo && this.$refs.uploadVideo.clearFiles()
      this.$refs.uploadImg && this.$refs.uploadImg.clearFiles()
    },
    handleConfirm() {
      let isEmpty = true
      for (const key in this.pageData) {
        if (key !== 'flowId' && this.pageData[key]) {
          isEmpty = false
        }
      }
      if (isEmpty) {
        this.handleClose()
      } else {
        $uploadMilitarySource(this.pageData)
          .then(res => {
            this.$message.success('上传成功')
            this.$emit('uploadSuccess')
            this.handleClose()
          })
      }
    },
    uploadVideoSuccess(re) {
      if (re && re.code === 1) {
        this.pageData.videoUrl = re.data
        this.$message.success('上传成功')
      } else {
        this.$message.error(re.message)
      }
      this.uploading = false
      this.videoUploading = false
    },
    uploadPhotoSuccess(re) {
      if (re && re.code === 1) {
        this.pageData.imgUrl = re.data
        this.$message.success('上传成功')
      } else {
        this.$message.error(re.message)
      }
      this.uploading = false
    },
    filePreview(file) {
      // 文件预览
      if (!this.pageData.imgUrl) {
        return
      }
      window.open(this.pageData.imgUrl)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-view {
  width: 200px;
  height: 200px;
  ::v-deep .el-upload-dragger {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
}
.pic {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
