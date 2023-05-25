<template>
  <el-dialog
    title="合作评价"
    :visible.sync="show"
    :before-close="handleClose"
    width="600px"
  >
    <div>
      <div class="title">
        <VideoList
          :list-data="data.videos"
          :options="{
            coverImg: 'videoCoverUrl',
            title: 'titleName',
          }"
          :show-video-count="1"
          :show-video-img="false"
        />
        <div class="account">
          <AccountCard :info="data" />
          <p class="brand">
            <span>
              合作产品-品牌：
            </span>
            {{ [data.quotientName, data.brandName].filter(item => item).join('-') || '--' }}
          </p>
          <p class="notice">
            您的评价将直接影响该账号的得分，客观的评价有助于商务和投手后续准确选号，提升账号中标率和客户满意度
          </p>
        </div>
      </div>
      <el-form ref="form" :model="formData" class="m-t-16" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="response" label="响应速度" :error="!!(showError && !formData.response) ? '请评价响应速度' : ''">
              <el-rate
                v-model="formData.response"
                :texts="evaluateArr"
                show-text
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="cooperate" label="配合度" :error="!!(showError && !formData.cooperate) ? '请评价配合度' : ''">
              <el-rate
                v-model="formData.cooperate"
                :texts="evaluateArr"
                show-text
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="content" label="内容创意" :error="!!(showError && !formData.content) ? '请评价内容创意' : ''">
              <el-rate
                v-model="formData.content"
                :texts="evaluateArr"
                show-text
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-form-item label="其他评价">
              <el-input
                v-model="formData.reason"
                maxlength="100"
                class="note-input"
                type="textarea"
                placeholder="请输入100字以内的评价"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
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
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { VideoList, AccountCard } from 'components'
import { $evaluateOrder } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    VideoList,
    AccountCard
  },
  setup(props, { emit }) {
    watch(() => props.show, (val) => {
      if (!val) {
        formData.response = 0
        formData.cooperate = 0
        formData.content = 0
        formData.reason = ''
        states.showError = false
      }
    })
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      typeList: [],
      btnLoading: false,
      evaluateArr: ['差', '较差', '一般', '较好', '好'],
      showError: false
    })
    const formData = reactive({
      response: 0,
      cooperate: 0,
      content: 0,
      reason: ''
    })
    const rules = {
      response: {
        required: true,
        message: '请评价响应速度',
        trigger: 'blur'
      },
      cooperate: {
        required: true,
        message: '请评价配合度',
        trigger: 'change'
      },
      content: {
        required: true,
        message: '请评价内容创意',
        trigger: 'change'
      }
    }

    const handleSave = async() => {
      const { response, cooperate, content, reason } = formData

      if (!response || !cooperate || !content) {
        states.showError = true
        return
      }

      states.btnLoading = true

      try {
        const res = await $evaluateOrder({
          workId: props.data.workId,
          responseSpeedScore: response,
          cooperationScore: cooperate,
          contentCreativeScore: content,
          otherEvaluate: reason
        })
        states.btnLoading = false
        if (res && res.code === 1) {
          $message.success('操作成功')
          emit('success')
          handleClose()
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        console.log(err)
        $message.error('系统错误')
      }
    }

    const handleClose = () => {
      emit('close')
    }
    return {
      formData,
      rules,
      handleSave,
      handleClose,
      ...toRefs(states)
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .title {
    display: flex;

    .info-coverImg {
      width: 100px;
      height: 140px;
    }
  }

  .el-form-item__label {
    line-height: 18px;
    width: 80px;
  }

  .el-form-item__error {
    left: 80px;
  }
}

.account {
  margin-left: 10px;
}

.brand {
  margin: 10px 0 8px;
}

.notice {
  color: #eebc4c;
}

.note-input {
  width: calc(100% - 80px);
}
</style>
