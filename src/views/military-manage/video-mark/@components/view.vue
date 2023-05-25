<template>
  <el-dialog
    :title="dialogTitle"
    :visible="value"
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
      <el-row>
        <el-col :span="8">
          <el-form-item label="账号统一名称" prop="belongName">
            {{ formData.belongName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="平台" prop="platName">
            {{ formData.platName.split('-')[1] }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账号" prop="accountName">
            {{ formData.accountName }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="标题" prop="titleName">
        {{ formData.titleName }}
      </el-form-item>
      <el-form-item label="视频链接" prop="url">
        {{ formData.url }}
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="发布时间" prop="addTime">
            {{ formData.addTime }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="流量" prop="flowCount">
            {{ formData.flowCount }}
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上传素材" prop="video_url">
        <el-col v-if="formData.videoUrl" class="img-width" :span="8">
          <img :src="formData.videoUrl" alt="">
        </el-col>
        <el-col :span="8" :offset="2">
          <img class="img-width" :src="formData.imgUrl" alt="">
        </el-col>
      </el-form-item>

      <el-form-item v-if="$permission('command_row')" label="口令" prop="videoCommand">
        {{ formData.videoCommand }}
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="视频类型" prop="junType">
            {{ formData.junType }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编辑人员" prop="editId">
            {{ getEditName(formData.editId) }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="剪辑人员" prop="cutId">
            {{ getEditName(formData.cutId) }}
          </el-form-item>
        </el-col>
      </el-row>
      <slot model="formData" name="ext" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCancel">关 闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
// import { copy } from '@/components/common'
// import { $updateVideoInputSelfVideo, $addVideoInputSelfVideo } from '@/api/military-manage'
// import './index.scss'

const DEF_FORM = {
  accountName: '',
  platName: '',
  titleName: '',
  url: '',
  addTime: '',
  flowCount: '',
  videoUrl: '',
  imgUrl: '',
  junType: '',
  editId: '',
  cutId: '',
  belongName: '',
  hdStatus: '',
  uploadId: '',
  videoCommand: ''
}

export default {
  props: {
    value: {
      type: Boolean
    },
    // 编辑、剪辑人员
    soldiers: {
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
    }
  },
  data() {
    return {
      videoUploading: false,
      photoUploading: false,
      formData: {},
      rules: {
        platName: [{ required: true, message: '请选择平台' }],
        accountName: [{ required: true, message: '请选择账号' }],
        titleName: [{ required: true, message: '请输入标题' }],
        flowCount: [{ required: true, message: '请输入流量' }],
        junType: [{ required: true, message: '请选择视频类型' }],
        editId: [{ required: true, message: '请选择编辑人员' }],
        cutId: [{ required: true, message: '请选择剪辑人员' }],
        addTime: [{ required: true, message: '请选择发布时间' }],
        belongName: [{ required: true, message: '请输入账号统一名称' }]
      }
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
    this.formData = this.processSubject(this.subject || {})
  },
  methods: {
    getEditName(id) {
      const soldiersFilter = this.soldiersFilter
      console.log(soldiersFilter, id)
      for (let index = 0; index < soldiersFilter.length; index++) {
        const element = soldiersFilter[index]
        if (element.userId === id) {
          console.log(element)
          return element.realname
        }
      }
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
    onCancel() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.img-width{
  width: 100%;
}
</style>
