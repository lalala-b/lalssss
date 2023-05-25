<template>
  <el-dialog :title="`${type === 'audit' ? '审核': '申诉'}修改`" :visible.sync="pageShow" width="670px" @close="handleClose">
    <el-form ref="form" :model="pageData" :rules="required && type === 'audit' && +pageData.hdStatus === 3 ? rules : {}" label-suffix="：">
      <el-form-item label="标题">
        <el-link v-if="pageData.url" target="_blank" :href="pageData.url">{{ pageData.titleName }}</el-link>
        <p v-else>{{ pageData.titleName }}</p>
      </el-form-item>
      <el-row>
        <el-col :span="8">
          <el-form-item label="流量">{{ pageData.flowCount }}</el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发布时间">{{ pageData.addTime }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="平台">{{ pageData.platName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="账号">{{ pageData.accountName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="视频类型">{{ pageData.junType }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="编辑人员">{{ pageData.editName }}</el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="剪辑人员">{{ pageData.cutName }}</el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="修改审核状态">
            <el-select v-model="pageData.hdStatus" placeholder="修改审核状态">
              <el-option v-for="(value, key) in HD_STATUS_MAP" :key="key" :label="value" :value="key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="type !== 'audit'" :span="10">
          <el-form-item label="修改编辑军功" prop="editScore">{{ pageData.editScore }}</el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="type !== 'audit'" label="修改剪辑军功" prop="cutScore">{{ pageData.cutScore }}</el-form-item>
      <el-row v-if="type === 'audit' && +pageData.hdStatus === 3">
        <el-col :span="24">
          <el-form-item label="未通过原因" prop="reason" class="form">
            <el-input
              v-model="pageData.reason"
              type="textarea"
              placeholder="请填写审核未通过原因，不超过50字"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button v-log="{operation_module:'申诉修改确定'}" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { $complainEdit, $appealUpdateVideo, $setExamineVideo, $batchMVideo } from '@/api/military-manage'

export default {
  props: {
    source: {
      type: String,
      default: 'mark'
    },
    show: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    type: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageData: {},
      HD_STATUS_MAP: {
        '1': '待审核',
        '2': '通过',
        '3': '未通过'
        // '4': '无需审核'
      },
      rules: {
        reason: [
          { required: true, message: '请输入未通过原因', trigger: 'blur' }
        ],
        editScore: { pattern: /^\d+(\.\d+)?$/, message: '请输入数字', trigger: 'blur' },
        cutScore: { pattern: /^\d+(\.\d+)?$/, message: '请输入数字', trigger: 'blur' }
      }
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
    dialogData: {
      handler: function(newVal, oldVal) {
        if (newVal.hdStatus) {
          newVal.hdStatus += ''
        }
        this.pageData = {
          ...JSON.parse(JSON.stringify(newVal)),
          reason: newVal.examineFailureReasons || ''
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:show', false)
      this.$emit('update') // 刷新列表
    },
    async save() {
      const data = {
        flowId: '',
        uploadId: '',
        hdStatus: '',
        editScore: 0,
        cutScore: 0
      }
      for (const key in data) {
        data[key] = this.pageData[key] || data[key]
      }

      if (+data.hdStatus === 3) {
        data.examineFailureReasons = this.pageData.reason
      } else {
        delete data.examineFailureReasons
      }

      let res
      if (this.type === 'audit') {
        if (this.source === 'mark') {
          data.flowIds = [data.flowId]
          res = await $batchMVideo(data)
        } else {
          data.uploadIdList = [data.uploadId]
          res = await $setExamineVideo(data)
        }
      } else {
        if (this.source === 'mark') {
          res = await $complainEdit(data)
        } else {
          res = await $appealUpdateVideo(data)
        }
      }

      if (res.code === 1) {
        this.$message.success(`${this.type === 'audit' ? '审核' : '申诉'}成功`)
        this.$emit('update')
        this.handleClose()
      } else {
        this.$message.error(`${this.type === 'audit' ? '审核' : '申诉'}失败,${res}`)
      }
    },
    async handleConfirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.save()
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep {
  .el-form-item__label {
    flex-shrink: 0;
  }
}
.el-form-item {
  display: inline-flex;
}

.el-input {
  width: 200px;
}

::v-deep {
  .form {
    width: 100%;

    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
