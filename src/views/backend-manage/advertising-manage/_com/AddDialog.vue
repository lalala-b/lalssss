<template>
  <el-dialog :title="title" :visible="show" width="1000px" @close="handleClose">
    <el-form
      ref="form"
      v-loading="loading"
      :model="formData"
      :rules="formRules"
      class="norm-form form"
      label-width="130px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号ID" prop="accountId">
            <el-input v-model="formData.accountId" placeholder="请输入账号ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号名称" prop="accountName">
            <el-input
              v-model="formData.accountName"
              placeholder="请输入账号名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号类型" prop="accountType">
            <el-input
              v-model="formData.accountType"
              placeholder="请输入账号类型"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="平台名称" prop="platName">
            <el-input
              v-model="formData.platName"
              placeholder="请输入平台名称"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="平台ID" prop="platId">
            <el-input v-model="formData.platId" placeholder="请输入平台ID" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="zz/zlj" prop="companyType">
            <el-input
              v-model="formData.companyType"
              placeholder="请输入zz/zlj"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号登录名" prop="loginName">
            <el-input
              v-model="formData.loginName"
              placeholder="请输入账号登录名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="账号登录密码" prop="loginPassword">
            <el-input
              v-model="formData.loginPassword"
              placeholder="请输入账号登录密码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="账号使用类型" prop="useType">
            <el-select
              v-model="formData.useType"
              clearable
              placeholder="请选择账号使用类型"
            >
              <el-option
                v-for="item in useTypeList"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="应用ID" prop="clientId">
            <el-input v-model="formData.clientId" placeholder="请输入应用ID" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="应用秘钥" prop="clientSecret">
            <el-input
              v-model="formData.clientSecret"
              placeholder="请输入应用秘钥"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="回调地址" prop="callbackUrl">
            <el-input
              v-model="formData.callbackUrl"
              placeholder="请输入回调地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="授权码" prop="authorizationCode">
            <el-input
              v-model="formData.authorizationCode"
              placeholder="请输入授权码"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权标志token" prop="accountToken">
            <el-input
              v-model="formData.accountToken"
              placeholder="请输入授权标志token"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="刷新token" prop="refreshToken">
            <el-input
              v-model="formData.refreshToken"
              placeholder="请输入刷新token"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开放平台地址" prop="developerUrl">
            <el-input
              v-model="formData.developerUrl"
              placeholder="请输入开放平台地址"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="后台管理地址" prop="managerUrl">
            <el-input
              v-model="formData.managerUrl"
              placeholder="请输入后台管理地址"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="获取授权码URL" prop="authorizationCodeUrl">
            <el-input
              v-model="formData.authorizationCodeUrl"
              placeholder="请输入获取授权码URL"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="获取tokenURL" prop="getTokenUrl">
            <el-input
              v-model="formData.getTokenUrl"
              placeholder="请输入获取tokenURL"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="cookies" prop="cookies">
            <el-input v-model="formData.cookies" placeholder="请输入cookies" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="业务线" prop="line">
            <el-select v-model="formData.line" clearable placeholder="请选择账号使用类型">
              <el-option
                v-for="item in lineList"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="14">
          <el-form-item label="备注" prop="line">
            <el-input
              v-model="formData.remark"
              type="textarea"
              maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button
        v-if="['add', 'edit'].includes(type)"
        type="primary"
        @click="handleConfirm"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  computed,
  reactive,
  ref,
  toRefs
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $addAdAccount, $updateAdAccountInfo } from '@/api/sys'

import { copy } from '@/utils'
export default defineComponent({
  props: {
    value: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    detailData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const useTypeList = [
      {
        val: 1,
        text: '普通广告主'
      },
      {
        val: 2,
        text: '账号管家'
      },
      {
        val: 3,
        text: '一级代理商'
      },
      {
        val: 4,
        text: '二级代理商'
      },
      {
        val: 6,
        text: '星图账号'
      }
    ]
    const lineList = [
      {
        val: 1,
        text: '海盗投放'
      },
      {
        val: 2,
        text: '海盗自营'
      },
      {
        val: 4,
        text: '乾派商务'
      }
    ]

    const states = reactive({
      loading: false
    })
    const formData = ref({
      platId: ''
    })
    formData.value = copy(props.detailData)
    const { $message, $refs } = getCurrentInstance().proxy
    const title = computed(() => {
      return props.type === 'add' ? '新增' : '编辑'
    })
    const { show, handleClose } = useToggle(props)
    const formRules = {
      accountId: { required: true, message: '请输入账号ID', trigger: 'blur' },
      platName: { required: true, message: '请输入平台名称', trigger: 'blur' },
      accountName: {
        required: true,
        message: '请输入账号名称',
        trigger: 'blur'
      },
      platId: { required: true, message: '请输入平台ID', trigger: 'blur' },
      accountType: {
        required: true,
        message: '请输入账号类型',
        trigger: 'blur'
      },
      loginName: {
        required: true,
        message: '请输入账号登录名',
        trigger: 'blur'
      },
      loginPassword: {
        required: true,
        message: '请输入账号登录密码',
        trigger: 'blur'
      },
      useType: {
        required: true,
        message: '请输入账号使用类型',
        trigger: ['change', 'blur']
      },
      line: {
        required: true,
        message: '请输入业务线',
        trigger: ['change', 'blur']
      }
    }
    const handleAdd = (params) => {
      states.loading = true
      $addAdAccount(params).then((res) => {
        if (res.code === 1) {
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
        states.loading = false
      })
    }

    const handleEdit = (params) => {
      states.loading = true
      $updateAdAccountInfo(params).then((res) => {
        if (res.code === 1) {
          handleClose()
          emit('success')
        } else {
          $message.error(res.message)
        }
        states.loading = false
      })
    }

    const handleConfirm = async() => {
      await $refs.form.validate()
      const params = copy(formData.value)
      console.log(params)
      if (props.type === 'add') {
        handleAdd(params)
      } else {
        handleEdit(params)
      }
    }

    return {
      title,
      useTypeList,
      lineList,
      formData,
      handleClose,
      handleConfirm,
      show,
      formRules,
      ...toRefs(states)
    }
  }
})
</script>
