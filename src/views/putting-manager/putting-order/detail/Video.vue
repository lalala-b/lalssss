<template>
  <div class="viedeo-wrap m-b-16">
    <p v-if="+platId===45&&videoInfo.sysVideoCheck" class="red-tip m-b-12" style="font-size:14px;white-space:nowrap">{{ videoInfo.sysVideoCheck }}</p>
    <div class="flex flex-align-center">
      <div class="flex m-r-16 video-info">
        <a :href="videoInfo.url" target="_blank">
          <el-image :src="videoInfo.videoCoverUrl" />
        </a>
        <div>
          <a :href="videoInfo.url" target="_blank" class="video-title text-over-hidden-2">{{ videoInfo.titleName }}</a>
          <p class="viedo-add-time">发布时间：{{ videoInfo.addTime }}</p>
        </div>
      </div>
      <IconTip v-if="isEdit && videoInfo.sysVideoUpdateFlag === 0" content="删除" icon-class="iconshanchu_fill" @click="$emit('del')" />
    </div>
    <div class="m-t-16">
      <el-form-item
        label="组件点击量"
        :prop="`videoInfo.${index}.cptClick`"
        :rules="{
          required: true,
          message: '组件点击量不能为空',
          trigger: ['blur', 'change']
        }"
      >
        <l-number v-if="isEdit && videoInfo.sysVideoUpdateFlag === 0" v-model="videoInfo.cptClick" />
        <span v-else>{{ videoInfo.cptClick }}</span>
      </el-form-item>
      <br>
      <el-form-item
        label="视频流量"
        :prop="`videoInfo.${index}.flowCount`"
        :rules="{
          required: true,
          message: '视频流量不能为空',
          trigger: ['blur', 'change']
        }"
      >
        <l-number v-if="isEdit && videoInfo.sysVideoUpdateFlag === 0" v-model="videoInfo.flowCount" />
        <span v-else>{{ videoInfo.flowCount }}</span>
      </el-form-item>
    </div>
    <template v-if="videoInfo.flowData && videoInfo.flowData.platFlowCount && isEdit && platId === 25">
      <el-form-item label="星图获取视频流量" block>
        {{ videoInfo.flowData.platFlowCount }}
        <el-button type="text" @click="handleAuotFlowData">自动填充</el-button>
      </el-form-item>
      <br>
      <el-form-item label="更新时间" block>
        {{ videoInfo.flowData.platUpdatedTime }}
      </el-form-item>
      <br>
    </template>
    <el-form-item v-if="[25,26,45].includes(+platId)" label="数据更新时间">
      {{ videoInfo.sysVideoUpdateTime || '--' }}
      <!-- <IconTip placement="top" type="popover" content="最近一次视频流量或组件点击量数据变更时间。系统自动更新的流量、组件点击量通过星图投后任务API获取，约每小时更新一次。人工录入的数据则以最近一次编辑保存时间为准。" icon-class="iconwenhao" /> -->
    </el-form-item>
    <div>
      <el-form-item v-if="!(!isEdit && !videoInfo.uploadUrl)" label="视频上传">
        <el-upload
          ref="uploadVideo"
          accept=".mp4"
          :disabled="!isEdit"
          :with-credentials="true"
          action="/api/video/input/uploadVideo"
          :show-file-list="false"
          name="file"
          class="upload-item"
          :on-error="onImportError('video')"
          :on-success="onImportSuccess('video')"
          :before-upload="onBeforeUpload('video')"
        >
          <div v-if="videoInfo.uploadUrl" class="upload-wrap" :class="{'upload-show': !isEdit}">
            <img
              class="pic"
              src="@/assets/video.png"
            >
            <span class="upload-wrap-actions">
              <span
                @click.stop.prevent="openUrl(videoInfo.uploadUrl)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                v-if="isEdit"
                @click.stop.prevent="handleDelect('video')"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
          <el-button v-else :loading="videoUploading" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
        </el-upload>
      </el-form-item>
      <br>
      <el-form-item v-if="!(!isEdit && !videoInfo.imgUrl)" label="图片上传" class="m-b-0">
        <el-upload
          ref="uploadImg"
          accept="*"
          :limit="1"
          :disabled="!isEdit"
          :show-file-list="false"
          action="/api/admin/uploadImage"
          name="file"
          class="upload-item"
          :on-error="onImportError('img')"
          :on-success="onImportSuccess('img')"
          :before-upload="onBeforeUpload('img')"
        >
          <div v-if="videoInfo.imgUrl" class="upload-wrap" :class="{'upload-show': !isEdit}">
            <img
              class="pic"
              :src="videoInfo.imgUrl"
            >
            <span class="upload-wrap-actions">
              <span
                @click.stop.prevent="openUrl(videoInfo.imgUrl)"
              >
                <i class="el-icon-zoom-in" />
              </span>
              <span
                v-if="isEdit"
                @click.stop.prevent="handleDelect('img')"
              >
                <i class="el-icon-delete" />
              </span>
            </span>
          </div>
          <el-button v-else :loading="imgUploading" class="upload-btn" icon="el-icon-upload2">上传文件</el-button>
        </el-upload>
      </el-form-item>
    </div>
  </div>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { IconTip } from 'components'
export default defineComponent({
  props: {
    videoInfo: Object,
    isEdit: Boolean,
    index: Number,
    platId: Number,
    flowData: Object
  },
  components: { IconTip },
  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const disabled = ref(false)
    const loading = reactive({
      videoUploading: false,
      imgUploading: false
    })
    const onImportError = type => err => {
      $message.error('上传失败，请重试~')
      disabled.value = false
      if (type === 'video') {
        loading.videoUploading = false
      } else {
        loading.imgUploading = false
      }
    }

    const onImportSuccess = type => res => {
      if (res && res.code === 1) {
        $message.success('上传完成')
        if (type === 'video') {
          props.videoInfo.uploadUrl = res.data
          loading.videoUploading = false
        } else {
          loading.imgUploading = false
          props.videoInfo.imgUrl = res.data
        }
      } else {
        $message.error(res.message)
        if (type === 'video') {
          loading.videoUploading = false

          props.videoInfo.uploadUrl = ''
        } else {
          loading.imgUploading = false
          props.videoInfo.imgUrl = ''
        }
      }
      disabled.value = false
    }

    const onBeforeUpload = type => () => {
      if (type === 'video') {
        loading.videoUploading = true
      } else {
        loading.imgUploading = true
      }
    }

    const openUrl = url => window.open(url)

    // 图片、视频删除
    const handleDelect = type => {
      if (type === 'video') {
        props.videoInfo.uploadUrl = ''
      } else {
        props.videoInfo.imgUrl = ''
      }
    }

    const handleAuotFlowData = () => {
       props.videoInfo.flowCount = props.videoInfo.flowData.platFlowCount
    }
    return {
      ...toRefs(loading),
      handleDelect,
      onImportError,
      onImportSuccess,
      onBeforeUpload,
      openUrl,
      handleAuotFlowData
    }
  }
})
</script>
<style lang="scss" scoped>
  .viedeo-wrap {
    width: 50%;
    // &:hover {
    //   box-shadow: 0 10px 10px #eee;
    // }
    // border-bottom: 1px solid #D9D9D9;
    .video-info {
      width: 453px;
      border: 1px solid #D9D9D9;
      border-radius: 2px;
      padding: 8px 24px 8px 8px;

      .el-image {
        display: block;
        flex-shrink: 0;
        width: 62px;
        height: 80px;
        object-fit: contain;
        margin-right: 8px;
        border-radius: 4px;
      }
      .video-title {
        font-size: 14px;
        color: #272727;
        line-height: 20px
      }
      .viedo-add-time {
        margin-top: 10px;
        font-size: 12px;
        color: #8C8C8C;
        line-height: 17px;
      }
    }
  }
  .upload-wrap {
    position: relative;
    width: 200px;
    height: 130px;
    padding: 8px;
    border: 1px solid #D9D9D9;
    border-radius: 2px;
    &.upload-show {
      width: 100px;
      height: 64px;
      border:0;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    &:hover {
      .upload-wrap-actions {
        opacity: 1;
      }
    }
    .upload-wrap-actions {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      cursor: default;
      text-align: center;
      color: rgb(255, 255, 255);
      opacity: 0;
      font-size: 20px;
      background-color: rgba(0, 0, 0 ,.5);
      transition: opacity .3s;
      display: flex;
      align-items: center;
      justify-content: center;
      > span {
        &:nth-child(n+2) {
          margin-left: 8px;
        }
      }
    }
  }
  .upload-item {
    .upload-btn {
      border: 1px solid $--color-primary;
      color: $--color-primary;
    }
    // width: 200px;
    // height: 150px;
    ::v-deep .el-upload-dragger {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 200px;
      height: 150px;
      .el-icon-upload {
        margin: 0;
        font-size: 24px;
      }
      .el-upload__text {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 12px;
      }
    }
  }
  .m-b-0 {
    margin-bottom: 0px;
  }
</style>

