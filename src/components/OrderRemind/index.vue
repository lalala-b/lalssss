<template>
  <div class="root">
    <div class="buttonBox">
      <el-button type="primary" @click="handleChangeRemind">{{ showRemind ? '取消' : '添加' }}订单提醒</el-button>
      <el-button v-if="remindHistory.length" @click="handleChangeShowHistory">{{ showHistory ? '收起' : '' }}提醒历史</el-button>
    </div>
    <div v-if="showRemind || showHistory" class="formBox">
      <el-form v-if="showRemind" ref="orderRemindForm" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="提醒内容：" prop="msg">
          <el-input v-model="form.msg" type="textarea" maxlength="150" show-word-limit placeholder="请输入提醒内容" @blur="handleBlur" @input="handleInput" />
        </el-form-item>
        <el-form-item label="提醒对象：" prop="person">
          <el-select
            v-model="form.person"
            filterable
            clearable
            allow-create
            default-first-option
            class="m-r-5 m-b-5"
            @change="handleChange"
          >
            <el-option
              v-for="item in remindList"
              :key="item.mobile"
              :value="item.userIdentity"
              :label="item.userIdentity"
            />
          </el-select>
          <el-tag
            v-for="item in form.reminderUserBOS"
            :key="item.userIdentity"
            closable
            class="m-r-5 m-b-5"
            :disable-transitions="false"
            @close="handleClose(item.userIdentity)"
          >
            {{ item.userIdentity }}
          </el-tag>
        </el-form-item>
      </el-form>

      <template v-if="showHistory">
        <div v-for="item in remindHistory" :key="item.id" class="historyBox">
          <div class="msgBox">
            {{ item.msg }}
          </div>
          <div class="otherMsg">
            <p>发送人：{{ item.senderUser }}</p>
            <p>接收人：{{ item.remindUsers }}</p>
            <p>发送时间：{{ item.remindTime }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  getCurrentInstance,
  onMounted,
  watch
} from '@vue/composition-api'
import { $getRemindList, $getRemindHistory } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    workId: Number,
    type: {
      type: String
    }
  },
  setup(props) {
    const { $refs } = getCurrentInstance().proxy

    const validateTag = (rule, value, callback) => {
      if ((!value || value.length === 0) && !form.reminderUserBOS.length) {
        callback(new Error('请选择提醒对象'))
      } else {
        callback()
      }
    }

    const state = reactive({
      rules: {
        msg: [{ required: true, message: '请输入提醒内容', trigger: ['blur', 'change'] }],
        person: [{ required: true, validator: validateTag, trigger: ['change'] }]
      },
      remindList: [],
      remindHistory: [],
      showRemind: false,
      showHistory: false
    })

    const form = reactive({
      msg: '',
      person: '',
      reminderUserBOS: []
    })

    watch(() => state.showRemind, (val) => {
      if (!val) {
        $refs.orderRemindForm && $refs.orderRemindForm.resetFields()
        form.reminderUserBOS = []
      }
    })

    onMounted(() => {
      $refs.orderRemindForm && $refs.orderRemindForm.resetFields()
      form.reminderUserBOS = []
    })

    const getRemindList = async() => {
      const { code, data } = await $getRemindList({ workId: props.workId, type: props.type })
      if (+code === 1) {
        state.remindList = data
      }
    }

    const getRemindHistory = async() => {
      const { code, data } = await $getRemindHistory({ workId: props.workId, type: props.type })
      if (+code === 1) {
        state.remindHistory = data || []
      }
    }

    const handleClose = (tag) => {
      form.reminderUserBOS.splice(form.reminderUserBOS.findIndex(item => item.userIdentity === tag), 1)
      $refs.orderRemindForm.validateField('person')
    }

    const handleChange = (val) => {
      if (form.reminderUserBOS.findIndex(item => item.userIdentity === val) === -1) {
        form.reminderUserBOS.push(state.remindList.find(item => item.userIdentity === val))
      }

      $refs.orderRemindForm.validateField('person')
      form.person = ''
    }

    const handleChangeRemind = () => {
      state.showRemind = !state.showRemind
      state.showHistory = false
    }

    const handleChangeShowHistory = () => {
      state.showHistory = !state.showHistory
      state.showRemind = false
    }

    const handleInput = (val) => {
      form.msg = val.replace(/^\s*/g, '')
    }

    const handleBlur = () => {
      form.msg = form.msg.replace(/(^\s*)|(\s*$)/g, '')
    }

    getRemindList()
    getRemindHistory()

    return {
      ...toRefs(state),
      form,
      getRemindList,
      handleClose,
      handleChange,
      handleInput,
      handleBlur,
      handleChangeRemind,
      handleChangeShowHistory
    }
  }
})
</script>

<style lang="scss" scoped>
.root {
  padding: 0 12px;
}

.buttonBox {
  margin-bottom: 20px;
}

.formBox {
  background-color: #fff;
  padding: 12px;
}

::v-deep {
  // .el-select__tags {
  //   max-width: 300px !important;
  // }
}

.historyBox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
}

.msgBox {
  flex: 1;
  margin-right: 60px;
  overflow: hidden; /*文本超出隐藏*/
	display:-webkit-box; /*盒子模型微弹性伸缩模型*/
	-webkit-box-orient: vertical;/*伸缩盒子的子元素垂直排列*/
	-webkit-line-clamp: 2; /*文本显示3行*/
}

.otherMsg {
  text-align: right;
}
</style>
