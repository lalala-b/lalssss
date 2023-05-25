<template>
  <el-dialog
    :title="title"
    :visible.sync="show"
    :before-close="handleClose"
    width="800px"
  >
    <div>
      <el-form
        ref="form"
        :model="formData"
        class="m-t-16"
        label-width="100px"
        :rules="rules"
      >
        <el-row>
          <el-col :span="18">
            <el-form-item label="弹窗标题" prop="notificationTitle">
              <el-input
                v-model="formData.notificationTitle"
                class="nameInput"
                placeholder="请输入弹窗标题"
              />
              <span>（20字以内，仅创建者可见）</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="状态" prop="notificationStatus">
              <el-radio-group v-model="formData.notificationStatus">
                <el-radio :label="1">上架</el-radio>
                <el-radio :label="0">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="弹窗类型" prop="notificationType">
              <el-radio-group v-model="formData.notificationType">
                <el-radio
                  v-for="item in notificationTypeArr"
                  :key="item.val"
                  :label="item.val"
                >{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="弹窗频率" prop="notificationFrequency">
              <el-radio-group v-model="formData.notificationFrequency">
                <el-radio :label="0">当日首次登录弹出</el-radio>
                <el-radio :label="1">每次登录弹出</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14">
            <el-form-item label="优先级" prop="notificationPriority">
              <el-input-number
                v-model="formData.notificationPriority"
                :min="1"
                class="nameInput"
                placeholder="优先级"
              />
              <span>（数字越小，优先级越高）</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-form-item label="有效期" prop="notificationValidityTimeArr">
              <el-date-picker
                v-model="formData.notificationValidityTime"
                class="daterange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
              <el-checkbox
                v-model="formData.notificationValidity"
              >永久</el-checkbox>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="14">
            <el-form-item label="强制阅读开关" prop="notificationForceRead">
              <el-radio-group v-model="formData.notificationForceRead">
                <el-radio :label="1">开启（3秒后才可关闭）</el-radio>
                <el-radio :label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="+formData.notificationType === 0">
          <el-col :span="24">
            <el-form-item label="弹窗内容" prop="notificationContent">
              <quill-editor
                ref="myQuillEditor"
                v-model="formData.notificationContent"
                class="quillEditor"
                data-placeholder="输入内容"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="+formData.notificationType === 1">
          <el-col :span="24">
            <el-form-item label="弹窗内容" prop="notificationContentImgUrl">
              <UploadImg
                v-model="formData.notificationContentImgUrl"
                upload-url="/api/notification/uploadImage"
              />
              <span>仅支持jpg、jpeg、png</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="+formData.notificationType === 2">
          <el-col :span="24">
            <el-form-item label="弹窗内容" prop="notificationContentVideoUrl">
              <UploadImg
                v-model="formData.notificationContentVideoUrl"
                accept=".mp4"
                upload-url="/api/notification/uploadVideo"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="发送对象" prop="sendObject">
              <template v-if="formData.sendObject.length">
                已选择{{ formData.sendObject.length }}个
              </template>
              <el-button @click="handleChooseOrg">选择组织</el-button>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="URL链接" prop="notificationUrl">
              <el-input
                v-model="formData.notificationUrl"
                placeholder="请输入URL"
              >
                <template slot="prepend">https://</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <OrgsTreeDialog
          v-if="hasOrgsTree"
          v-model="hasOrgsTree"
          :data="formData.sendObject"
          @update="handleUpdateOrg"
        />

        <!-- <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-select v-model="formData.type" placeholder="请选择">
                <el-option
                  v-for="item in typeList"
                  :key="item.val"
                  :label="item.text"
                  :value="item.val"
                />
              </el-select>
            </el-form-item>
          </el-col> -->
      </el-form>
      <div slot="footer" class="flex flex-justify-end">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          :loading="btnLoading"
          @click="handleSave"
        >确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  toRefs,
  watch,
  onMounted
} from '@vue/composition-api'
import { $addNotification, $editNotification } from '@/api/popover-manage'
import { useToggle } from '@/hook'
import UploadImg from '@/components/UploadImg'
import dayjs from 'dayjs'
import OrgsTreeDialog from './orgs-tree.vue'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    detail: {
      type: Object
    }
  },
  components: {
    OrgsTreeDialog,
    UploadImg
  },
  setup(props, { emit }) {
    const { $message, $refs, $nextTick } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const states = reactive({
      typeList: [],
      btnLoading: false,
      hasOrgsTree: false,
      notificationTypeArr: [
        {
          val: 0,
          label: '自定义弹窗'
        },
        {
          val: 1,
          label: '图片弹窗'
        },
        {
          val: 2,
          label: '视频弹窗'
        }
      ]
    })

    const formData = reactive({
      notificationTitle: '',
      notificationStatus: 1,
      notificationType: 0,
      notificationFrequency: 0,
      notificationPriority: 99,
      notificationValidityTime: '',
      notificationValidityTimeArr: '',
      notificationValidity: 0,
      notificationForceRead: 1,
      notificationContent: '',
      sendObject: [],
      notificationUrl: '',
      notificationContentImgUrl: [],
      notificationContentVideoUrl: []
    })
    const rules = {
      notificationTitle: {
        required: true,
        message: '请输入弹窗标题',
        trigger: 'blur'
      },
      notificationStatus: {
        required: true,
        message: '请选择弹窗状态',
        trigger: ['change', 'blur']
      },
      notificationPriority: {
        required: true,
        message: '请输入优先级',
        trigger: ['change', 'blur']
      },
      notificationValidityTimeArr: {
        required: true,
        message: '请选择有效期',
        trigger: ['change', 'blur']
      },
      notificationContent: {
        required: true,
        message: '请输入弹窗内容',
        trigger: ['change', 'blur']
      },
      notificationContentImgUrl: {
        required: true,
        message: '请上传图片',
        trigger: ['change', 'blur']
      },
      notificationContentVideoUrl: {
        required: true,
        message: '请上传视频',
        trigger: ['change', 'blur']
      },
      sendObject: {
        required: true,
        message: '请选择发送对象',
        trigger: ['change', 'blur']
      }
    }

    const form = ref(null)

    watch(
      () => formData.notificationContent,
      (val) => {
        $refs.form && $refs.form.validateField('notificationContent')
      }
    )

    watch(
      () => JSON.stringify(formData.notificationContentImgUrl),
      (val) => {
        $refs.form && $refs.form.validateField('notificationContentImgUrl')
      }
    )

    watch(
      () => JSON.stringify(formData.notificationContentVideoUrl),
      (val) => {
        $refs.form && $refs.form.validateField('notificationContentVideoUrl')
      }
    )

    watch(
      () => formData.notificationValidityTime,
      (val) => {
        if (val || formData.notificationValidity) {
          formData.notificationValidityTimeArr = 1
        } else {
          formData.notificationValidityTimeArr = ''
        }
        $nextTick(() => {
          if (val) {
            formData.notificationValidity = false
          }
          $refs.form.validateField('notificationValidityTimeArr')
        })
      }
    )

    watch(
      () => formData.notificationValidity,
      (val) => {
        $nextTick(() => {
          if (val || formData.notificationValidityTime) {
            formData.notificationValidityTimeArr = 1
          } else {
            formData.notificationValidityTimeArr = ''
          }

          if (val) {
            formData.notificationValidityTime = ''
          }

          $nextTick(() => {
            $refs.form.validateField('notificationValidityTimeArr')
          })
        })
      }
    )

    onMounted(() => {
      if (props.type === 'add') return

      const {
        notificationTitle,
        notificationStatus,
        notificationType,
        notificationFrequency,
        notificationPriority,
        notificationValidity,
        notificationForceRead,
        notificationContent,
        sendObjectOrgId,
        notificationUrl,
        notificationValidityBegin,
        notificationValidityEnd
      } = props.detail

      formData.notificationTitle = notificationTitle
      formData.notificationStatus = notificationStatus
      formData.notificationType = notificationType

      if (+notificationType === 0) {
        formData.notificationContent = notificationContent
      } else if (+notificationType === 1) {
        formData.notificationContentImgUrl = [notificationContent]
      } else {
        formData.notificationContentVideoUrl = [notificationContent]
      }

      formData.notificationFrequency = notificationFrequency
      formData.notificationPriority = notificationPriority

      if (formData.notificationValidity) {
        formData.notificationValidity = !!notificationValidity
      } else if (notificationValidityBegin && notificationValidityEnd) {
        formData.notificationValidityTime = [
          notificationValidityBegin,
          notificationValidityEnd
        ]
      }

      formData.notificationValidity = !!notificationValidity
      formData.notificationForceRead = notificationForceRead
      formData.sendObject = sendObjectOrgId
        .split(',')
        .filter((item) => item)
        .map((item) => {
          return { id: item }
        })
      formData.notificationUrl = notificationUrl
    })

    const handleSave = async() => {
      await form.value.validate()
      states.btnLoading = true
      const params = Object.assign({}, formData)

      if (params.notificationValidity) {
        params.notificationValidity = 1
        params.notificationValidityTime = ''
      } else {
        params.notificationValidity = 0
        params.notificationValidityBegin = dayjs(
          params.notificationValidityTime[0]
        ).format('YYYY-MM-DD')
        params.notificationValidityEnd = dayjs(
          params.notificationValidityTime[1]
        ).format('YYYY-MM-DD')
      }

      if (+params.notificationType === 1) {
        params.notificationContent = params.notificationContentImgUrl[0]
      } else if (+params.notificationType === 2) {
        params.notificationContent = params.notificationContentVideoUrl[0]
      }

      params.sendObjectOrgId = params.sendObject
        .map((item) => item.id)
        .join(',')

      delete params.sendObject

      let api = $addNotification

      if (props.type === 'edit') {
        params.id = props.detail.id
        api = $editNotification
      }

      try {
        const res = await api(params)
        states.btnLoading = false
        if (res && res.code === 1) {
          $message.success('操作成功')
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
        states.btnLoading = false
        $message.error('系统错误')
      }
    }

    const title = computed(() => {
      switch (props.type) {
        case 'add':
          return '新增'
        case 'edit':
          return '编辑'
        default:
          return '新增'
      }
    })

    const handleChooseOrg = () => {
      states.hasOrgsTree = true
    }

    const handleUpdateOrg = (data) => {
      formData.sendObject = data || []
      states.hasOrgsTree = false
      $refs.form.validate()
    }

    return {
      title,
      formData,
      form,
      rules,
      show,
      handleSave,
      handleClose,
      ...toRefs(states),
      handleChooseOrg,
      handleUpdateOrg
    }
  }
})
</script>

<style lang="scss" scoped>
.nameInput {
  width: calc(100% - 185px);
}

.daterange {
  width: calc(100% - 85px);
  margin-right: 20px;
}

.quillEditor {
  ::v-deep .ql-editor {
    min-height: 140px;
  }
}
</style>
