<template>
  <el-dialog
    :title="dialogTitle"
    :visible="show"
    width="50%"
    class="M-importVideo"
    @close="onCancel"
  >
    <el-form
      ref="form"
      :rules="rules"
      label-suffix=":"
      :model="formData"
      label-width="120px"
      class="M-importVideoForm"
    >
      <el-form-item label="账号统一名称" prop="belongName">
        <el-input v-model="formData.belongName" />
      </el-form-item>
      <el-form-item label="平台" prop="platName">
        <el-select v-model="formData.platName" filterable>
          <el-option v-for="item in plats" :key="item.platId" :value="item.platId + '-' + item.platName" :label="item.platName" />
        </el-select>
      </el-form-item>
      <el-form-item label="账号" prop="accountName">
        <el-input v-model="formData.accountName" />
      </el-form-item>
      <el-form-item label="标题" prop="titleName">
        <el-input v-model="formData.titleName" />
      </el-form-item>
      <el-form-item label="视频链接" prop="url">
        <el-input v-model="formData.url" />
      </el-form-item>
      <el-form-item label="发布时间" prop="addTime">
        <el-date-picker
          v-model="formData.addTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="流量" prop="flowCount">
        <el-input v-model="formData.flowCount" type="number" min="0" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
      <el-form-item label="点赞量" prop="thumbUpCount">
        <el-input v-model="formData.thumbUpCount" type="number" min="0" on-keypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))" />
      </el-form-item>
      <el-form-item label="上传素材" prop="video_url">
        <el-col :span="8">
          <el-upload
            ref="uploadVideo"
            v-loading="videoUploading"
            class="upload-view"
            :on-success="uploadVideoSuccess"
            :on-preview="filePreview"
            :on-error="uploadVideoError"
            :before-upload="(file) => beforeUpload(file, 'video')"
            :show-file-list="false"
            :file-list="uploadVideoList"
            drag
            :limit="1"
            accept=".mp4"
            name="file"
            :action="videoUploadUrl"
            element-loading-text="正在上传视频..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
          >
            <div v-if="formData.videoUrl" class="upload-wrap el-upload-list--picture-card">
              <img
                class="pic"
                src="@/assets/video.png"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click.stop.prevent="openUrl(formData.videoUrl)"
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
        <el-col :span="8" :offset="2">
          <el-upload
            ref="uploadImg"
            v-loading="photoUploading"
            drag
            accept="*"
            :limit="1"
            class="upload-view"
            :show-file-list="false"
            :file-list="uploadImgList"
            :on-success="uploadPhotoSuccess"
            :on-error="uploadPhotoError"
            :before-upload="(file) => beforeUpload(file, 'photo')"
            :on-preview="filePreview"
            :on-progress="onPhotoProgress"
            :action="photoUploadUrl"
            element-loading-text="正在上传图片..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
            name="file"
          >
            <div v-if="formData.imgUrl" class="upload-wrap el-upload-list--picture-card">
              <img
                class="pic"
                :src="formData.imgUrl"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click.stop.prevent="openUrl(formData.imgUrl)"
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
            <!-- <div v-if="formData.imgUrl" class="upload-wrap">
              <img :src="`${formData.imgUrl}`" class="pic">
              <i class="el-icon-error" @click="delectImg" />
            </div>
            <--->
            <div v-else>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将图片文件拖到此处，或点击上传
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </el-col>
      </el-form-item>
      <el-form-item label="产品型号">
        <el-cascader
          v-model="formData.b2cPhoneModelId"
          placeholder="请选择产品型号"
          class="m-r-10"
          :options="modelData"
          :props="{
            checkStrictly: false,
            expandTrigger: 'hover',
            value: 'modelId',
            label: 'modelName',
            children: 'phoneModelVOList' }"
          clearable
          filterable
          :filter-method="dataFilter"
        />
      </el-form-item>
      <el-form-item label="视频类型" prop="junType">
        <el-select v-model="formData.junType" filterable clearable>
          <el-option v-for="item in videoType" :key="item.junType" :value="item.junType">{{ item.junType }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="$permission('command_row')" label="口令" prop="videoCommand">
        <el-input v-model.trim="formData.videoCommand" maxlength="6" placeholder="请输入口令" />
      </el-form-item>
      <el-form-item label="编辑人员" prop="editId">
        <el-select v-model="formData.editId" filterable>
          <el-option
            v-for="item in soldiersFilter"
            :key="item.userId"
            :label="item.realname"
            :value="item.userId"
          >{{ item.realname }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="剪辑人员" prop="cutId">
        <el-select v-model="formData.cutId" filterable>
          <el-option
            v-for="item in soldiersFilter"
            :key="item.userId"
            :label="item.realname"
            :value="item.userId"
          >{{ item.realname }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="网红">
        <el-select
          v-model="formData.influencerId"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="item in pirateFrontUsers"
            :key="item.userId"
            :label="item.realname"
            :value="+item.userId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="摄影人员">
        <el-select
          v-model="formData.photographerId"
          placeholder="请选择"
          filterable
        >
          <el-option
            v-for="item in pirateFrontUsers"
            :key="item.userId"
            :label="item.realname"
            :value="+item.userId"
          />
        </el-select>
      </el-form-item>
      <slot model="formData" name="ext" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">取 消</el-button>
      <el-button v-log="{operation_module: dialogTitle + '确定'}" :loading="btnLoading" type="primary" @click="onConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { copy } from '@/components/common'
import { $updateVideoInputSelfVideo, $addVideoInputSelfVideo, $getPirateFrontUsers } from '@/api/military-manage'

import { $getB2CPhoneModel } from '@/api/bussiness-manage'
import './index.scss'

const DEF_FORM = {
  accountName: '',
  platName: '',
  titleName: '',
  url: '',
  addTime: '',
  flowCount: '',
  thumbUpCount: '',
  videoUrl: '',
  imgUrl: '',
  junType: '',
  editId: '',
  cutId: '',
  belongName: '',
  hdStatus: '',
  uploadId: '',
  videoCommand: '',
  b2cPhoneModelId: ''
}

export default {
  filters: {
    filter_phoneId(value) {
      return value * 10
    }
  },
  props: {
    // 视频类型
    videoType: {
      type: Array,
      default() {
        return []
      }
    },
    // 编辑、剪辑人员
    soldiers: {
      type: Array,
      default() {
        return []
      }
    },
    // 平台
    plats: {
      type: Array,
      default() {
        return []
      }
    },
    // 编辑数据
    subject: {
      type: Object,
      default() {
        return {}
      }
    },
    // 弹窗显示
    show: {
      type: Boolean,
      default: false
    },
    uploadSizeLimit: {
      type: Number,
      default: 30 * 1024 * 1024 // 30M
    }
  },
  data() {
    return {
      btnLoading: false,
      videoUploading: false,
      photoUploading: false,
      formData: {
        b2cPhoneModelId: ''
      },
      uploadVideoList: [],
      uploadImgList: [],
      photoUploadUrl: `/api/admin/uploadImage`,
      videoUploadUrl: `/api/video/input/uploadVideo`,
      rules: {
        platName: [{ required: true, message: '请选择平台' }],
        accountName: [{ required: true, message: '请选择账号' }],
        titleName: [{ required: true, message: '请输入标题' }],
        flowCount: [{ required: true, message: '请输入流量' }],
        thumbUpCount: [{ required: true, message: '请输入点赞量' }],
        junType: [{ required: true, message: '请选择视频类型' }],
        editId: [{ required: true, message: '请选择编辑人员' }],
        cutId: [{ required: true, message: '请选择剪辑人员' }],
        addTime: [{ required: true, message: '请选择发布时间' }],
        belongName: [{ required: true, message: '请输入账号统一名称' }]
      },
      modelData: [],
      pirateFrontUsers: []
    }
  },
  computed: {
    dialogTitle() {
      return this.title || (this.subject && this.subject.uploadId)
        ? '编辑'
        : '添加视频'
    },
    soldiersFilter() {
      return this.soldiers.filter(item => item.userId !== 0)
    }
  },
  watch: {
    show(val) {
      if (val) {
        this.formData = this.processSubject(this.subject || {})
      }
    }
  },
  created() {
    this.getB2CPhoneModel()
    this.getPirateFrontUsers()
    this.formData = this.processSubject(this.subject || {})
  },
  methods: {
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    },
    delectImg(e) {
      this.formData.imgUrl = ''
      this.$refs.uploadImg.clearFiles()
    },
    delectVideo(e) {
      this.formData.videoUrl = ''
      this.$refs.uploadVideo.clearFiles()
    },
    openUrl(url) {
      window.open(url)
    },
    beforeUpload(file, type) {
      if (file.size > this.uploadSizeLimit) {
        this.$message.error('请上传小于30M的文件')
        return false
      }
      this[`${type}Uploading`] = true
    },
    onPhotoProgress(e) {
      this.photoUploading = e.percent
      if (this.photoUploading >= 100) {
        this.$nextTick(() => {
          this.photoUploading = 0
        }, 50)
      }
    },
    uploadPhotoSuccess(re) {
      if (re && re.code === 1) {
        this.formData.imgUrl = re.data
        this.$message.success('上传成功')
      } else {
        this.$message.error(re.message)
      }
      this.photoUploading = false
    },
    uploadPhotoError(re) {
      this.photoUploading = false
      this.$message.error(re.message)
    },
    uploadVideoSuccess(re) {
      if (re && re.code === 1) {
        this.formData.videoUrl = re.data
        this.$message.success('上传成功')
      } else {
        this.$message.error(re.message)
      }
      this.videoUploading = false
    },
    uploadVideoError(re) {
      this.videoUploading = false
      this.$message.error(re.message)
    },
    filePreview(file) {
      // 文件预览
      if (!this.formData.imgUrl) {
        return
      }
      window.open(this.formData.imgUrl)
    },
    // 回显数据处理
    processSubject(val) {
      const formData = {}
      Object.keys(DEF_FORM).forEach(key => {
        if (key === 'platName' && val.uploadId) formData.platName = `${val.platId}-${val.platName}`
        else formData[key] = val[key] || DEF_FORM[key]
      })
      return formData
    },
    fileRemove(file) {},
    getPhoneModel(value) {
      const item = this.modelData.find(item => +item.modelId === +value)
      return (item || {}).modelId
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        this.modelData = data || []
        if (this.formData.b2cPhoneModelId) {
          data.forEach((item) => {
            if (item.phoneModelVOList.findIndex(it => +it.modelId === +this.formData.b2cPhoneModelId) > -1) {
              this.formData.b2cPhoneModelId = [item.modelId, this.formData.b2cPhoneModelId]
            }
          })
        }
      }
    },
    async getPirateFrontUsers() {
      const { code, data } = await $getPirateFrontUsers()
      if (+code === 1) {
        this.pirateFrontUsers = data || []
      }
    },
    onCancel() {
      this.formData = copy(DEF_FORM)
      this.$refs.form.resetFields()
      this.formData.imgUrl = ''
      this.formData.videoUrl = ''
      this.uploadVideoList = []
      this.uploadImgList = []
      this.$emit('update:show', false)
      this.$refs.uploadVideo.clearFiles()
      this.$refs.uploadImg.clearFiles()
    },
    onConfirm() {
      const formData = copy(this.formData)
      if ((formData.b2cPhoneModelId || []).length > 1) {
          formData.b2cPhoneModelId = formData.b2cPhoneModelId[formData.b2cPhoneModelId.length - 1]
        } else {
          formData.b2cPhoneModelId = ''
        }
      this.$refs.form.validate((res) => {
        if (res) {
          this.btnLoading = true
          ;[formData.platId, formData.platName] = formData.platName.split('-')
          let $ajax = $addVideoInputSelfVideo
          if (this.subject && this.subject.uploadId) {
            $ajax = $updateVideoInputSelfVideo
          }
          formData.cutName = this.soldiersFilter.find((item) => {
            return item.userId === formData.cutId
          }).realname
          formData.editName = this.soldiersFilter.find((item) => {
            return item.userId === formData.editId
          }).realname
          $ajax(formData).then((res) => {
            if (res.code === 1) {
              this.$message.success('操作成功')
              this.onCancel()
              this.$emit('updaeSuccess')
            } else {
              this.$message.error(res.message)
            }
            this.btnLoading = false
          }).catch(err => {
            if (err.__CANCEL__) return
            this.btnLoading = false
          })
        } else {
          this.$nextTick(() => {
            document.querySelector('.is-error .el-input__inner').focus()
          })
        }
      })
    }
  }
}
</script>
