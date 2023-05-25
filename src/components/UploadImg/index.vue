<template>
  <div class="flex" :class="`upload--img__${size}`">
    <ul class="el-upload-list el-upload-list--picture-card">
      <li
        v-for="(item, index) in uploadList"
        :key="item"
        class="el-upload-list__item is-success"
      >
        <div>
          <div class="el-image el-upload-list__item-thumbnail">
            <img :src="item" alt="" class="el-image__inner">
          </div>
          <span class="el-upload-list__item-actions">
            <span
              class="el-upload-list__item-preview"
              @click="handlePreview(item)"
            >
              <i class="el-icon-zoom-in" />
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete">
              <i class="el-icon-delete" @click="handleRemove(item, index)" />
            </span>
          </span>
        </div>
      </li>
    </ul>
    <el-upload
      v-if="(uploadList || []).length < limit && !disabled"
      ref="upload"
      v-loading="loading"
      :action="uploadUrl"
      :accept="accept"
      list-type="picture-card"
      name="file"
      :show-file-list="false"
      :before-upload="handleUploadBefore"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
    >
      <i slot="default" class="el-icon-plus" />
    </el-upload>
    <el-dialog
      :modal-append-to-body="false"
      append-to-body
      :visible.sync="dialogVisible"
    >
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  ref
} from '@vue/composition-api'

export default defineComponent({
  props: {
    limit: {
      type: Number,
      default: 1
    },
    accept: {
      type: String,
      default: '.png,.jpg,.jpeg'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    },
    prewPhoto: {
      type: Boolean,
      default: false
    },
    disabled: Boolean,
    size: {
      type: 'small' | 'mini' | 'medium',
      default: 'medium'
    },
    uploadUrl: {
      type: String,
      default: '/api/admin/uploadImage'
    }
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const uploadList = computed({
      get() {
        return props.value
      },
      set(value) {
        emit('input', value)
      }
    })
    const dialogImageUrl = ref('')
    const dialogVisible = ref(false)
    const loading = ref(false)
    const handleRemove = (index, item) => {
      console.log(index, item)
      uploadList.value.splice(index, 1)
      // $refs.upload.handleRemove()
      // buildUploadList(fileList)
    }
    const onClose = () => {
      dialogVisible.value = false
    }
    const handleUploadBefore = () => {
      loading.value = true
    }
    const handlePreview = (url) => {
      if (props.prewPhoto) {
        dialogImageUrl.value = url
        dialogVisible.value = true
      } else {
        window.open(url)
      }
    }
    const handleUploadSuccess = (response, file, fileList) => {
      if (response.code === 1) {
        uploadList.value.push(response.data)
      } else {
        $message.error(response.message)
      }
      loading.value = false
    }

    const handleUploadError = (err, file, fileList) => {
      $message.error('上传失败，请重试！')
      loading.value = false
    }

    const getVideoCover = function(file) {
      if (file.indexOf('.mp4') <= -1) {
        return file
      }

      const imgWidth = 240
      const imgHeight = 160 // 定义生成图片的宽高，其他宽高需求可以自己改
      var fileUrl = URL.createObjectURL(file)
      var videoElement = document.createElement('VIDEO')
      videoElement.src = fileUrl
      videoElement.addEventListener('loadeddata', () => {
        const { videoWidth, videoHeight } = videoElement // 获取video的宽高
        let x = 0
          let y = 0
          let width = 0
          let height = 0
        // 计算缩小后图片的宽高以及canvas绘制的位置信息
        if (videoWidth / videoHeight >= 1.5) {
          width = imgWidth
          height = videoHeight * (imgWidth / videoWidth)
          x = 0
          y = (imgHeight - height) / 2
        } else {
          height = imgHeight
          width = videoWidth * (imgHeight / videoHeight)
          y = 0
          x = (imgWidth - width) / 2
        }
        var canvas = document.createElement('canvas')
        canvas.width = imgWidth
        canvas.height = imgHeight
        const ctx = canvas.getContext('2d')
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, imgWidth, imgHeight)
        ctx.drawImage(videoElement, x, y, width, height)
        const src = canvas.toDataURL('image/png') // 完成base64图片的创建
      })
    }

    return {
      loading,
      uploadList,
      handleUploadError,
      handleRemove,
      handleUploadSuccess,
      handleUploadBefore,
      handlePreview,
      dialogVisible,
      dialogImageUrl,
      onClose,
      getVideoCover
    }
  }
})
</script>
<style lang="scss" scoped>
// ::v-deep {
//   .el-upload {
//     width: 148px;
//     height: 148px;
//   }
// }
.el-upload-list--picture-card {
  .el-upload-list__item-thumbnail {
    margin: 50%;
    transform: translate(-50%, -50%);
  }
}
.upload--img {
  &__small {
    ::v-deep {
      .el-upload {
        &--picture-card,
        &-list__item {
          width: 80px;
          height: 80px;
          line-height: 80px;
        }
      }
    }
  }
}
</style>

