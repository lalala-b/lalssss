<template>
  <el-form
    ref="form"
    class="register-form"
    :model="form"
    label-width="100px"
    label-suffix=":"
    :rules="rules"
  >
    <el-form-item label="姓名" prop="realname">
      <el-input v-model.trim="form.realname" placeholder="请输入你的姓名" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="form.email" placeholder="请输入你的邮箱">
        <template slot="append">@zhuanzhuan.com</template>
      </el-input>

    </el-form-item>
    <el-form-item prop="emailVerificationCode" label="邮箱验证码">
      <Verify v-model="form.emailVerificationCode" :maxlength="6" @handleGetCaptch="getCode($event, 2)" />
    </el-form-item>
    <el-form-item label="登录名">

      {{ form.email }}
    </el-form-item>
    <el-form-item
      label="手机号"
      prop="mobile"
    >
      <l-number v-model.trim="form.mobile" :maxlength="11" placeholder="请输入你的手机号" />
    </el-form-item>
    <el-form-item
      prop="phoneVerificationCode"
      label="手机验证码"
    >
      <Verify v-model="form.phoneVerificationCode" :maxlength="6" @handleGetCaptch="getCode($event, 1)" />
    </el-form-item>
    <el-form-item label="所在组织" prop="orgId">
      <p v-if="form.orgName">已选择<b>{{ form.orgName }}</b></p>
      <el-button size="small" @click="organizeVisible=true">选择组织</el-button>
    </el-form-item>
    <OrganizeSelect v-if="organizeVisible" v-model="organizeVisible" :org-id="form.orgId" :is-regist="true" @save="handleOrgChange" />
  </el-form>

</template>
<script>

import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import OrganizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { validPhone } from '@/utils/validate'
import { $getVerificationCode } from '@/api/user'

import { Verify } from 'components'
import { copy } from '@/components/common'
export default defineComponent({
  components: { Verify, OrganizeSelect },
  setup() {
    const { $refs, $message } = getCurrentInstance().proxy

    const rules = {
      realname: { required: true, message: '请输入姓名', trigger: 'blur' },
      email: { required: true, message: '请输入邮箱', trigger: 'blur' },
      mobile: { required: true, validator: function(rule, value, callback) {
        if (validPhone(String(value))) {
          return callback()
        } else {
          callback(new Error(rule.message))
        }
      }, message: '请输入手机号码', trigger: 'blur' },
      phoneVerificationCode: { required: true, message: '请输入手机号验证码', trigger: 'blur' },
      emailVerificationCode: { required: true, message: '请输入邮箱验证码', trigger: 'blur' },
      orgId: { required: true, message: '请选择组织', trigger: 'change' }
    }

    const organizeVisible = ref(false)

    const handleOrgChange = (orgInfo) => {
      console.log(orgInfo)
      form.orgName = orgInfo.orgName
      form.orgId = orgInfo.id
      organizeVisible.value = false
    }

    const form = reactive({
      realname: '',
      email: '',
      name: '',
      mobile: '',
      phoneVerificationCode: '',
      emailVerificationCode: '',
      orgId: ''
    })

    // type: 0 重置密码 - 邮箱验证码 1 手机号验证码 2邮箱验证码
    const getCode = function(fn, type) {
      let fileds, value
      if (type === 1) {
        fileds = 'mobile'
        value = form.mobile
      }
      if (type === 2) {
        fileds = 'email'
        value = form.email + '@zhuanzhuan.com'
      }
      $refs.form.validateField(fileds, (message) => {
        if (!message) {
          fn()
          $getVerificationCode({ type, emailOrPhone: value, random: Math.random() }).then(res => {
            if (res.code !== 1) {
              $message(res.message)
              fn(true)
            }
          })
        }
      })
    }

    const handleSave = async() => {
      await $refs.form.validate()
      const formData = copy(form)
      formData.name = formData.email
      formData.email = `${formData.email}@zhuanzhuan.com`

      return formData
    }
    return {
      getCode,
      form,
      rules,
      organizeVisible,
      handleOrgChange,
      handleSave
    }
  }
})
</script>

