<template>
  <el-dialog
    class="passworld-dialog"
    title="修改密码"
    :visible.sync="dialogVisible"
    width="500px"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    :append-to-body="true"
    style="z-index: 999999"
  >
    <p class="tip-red m-b-24">请先修改密码！</p>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules" label-suffix="：">
      <el-form-item label="新密码" prop="password" :class="{'hidden-error': showTip}">
        <el-input
          v-model.trim="form.password"
          show-password
          autocomplete="new-password"
          placeholder="密码"
          @focus="showTip = true"
          @blur="showTip=false"
        />
        <ul :class="{slideup: !showTip}" class="password-tip m-t-5">
          <!-- el-icon-success -->

          <li><i :class="(form.password.length < 6 || form.password.length > 20) ? 'el-icon-warning': 'el-icon-success'" /> 长度为6-20位</li>
          <li><i :class="!checkPassType ? 'el-icon-success': 'el-icon-warning'" /> 必须包含字母、数字、符号中至少2种</li>
        </ul>
      </el-form-item>

    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="loading" @click="handlePasswordChange">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, ref, getCurrentInstance, computed } from '@vue/composition-api'
import { $editBaseInfo } from '@/api/backend-manage'
import store from '@/store'

export default defineComponent({
  setup() {
    const { $refs, $message } = getCurrentInstance().proxy
    const form = reactive({
      password: ''
    })

      const checkPassType = computed(() => {
        return (form.password.match(/\d/) ? 1 : 0) + (form.password.match(/[a-z]/i) ? 1 : 0) + (form.password.match(/[^\da-zA-Z\s]/) ? 1 : 0) < 2
      })
     const checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'))
      }
      if (value.length < 6 || value.length > 20) {
        return callback(new Error('长度为6-20个字符'))
      }
      if ((value.match(/\d/) ? 1 : 0) + (value.match(/[a-z]/i) ? 1 : 0) + (value.match(/[^\da-zA-Z\s]/) ? 1 : 0) < 2) {
        return callback(new Error('必须包含字母、数字、符号中至少2种'))
      }
      callback()
    }

    const rules = reactive({
      password: [
        { required: true, validator: checkPass, trigger: 'blur' }
      ]
    })
    const dialogVisible = ref(true)
    const loading = ref(false)
    const showTip = ref(false)

    const handlePasswordChange = function() {
      try {
        $refs.form.validate().then(val => {
          console.log(val)
          if (val) {
            loading.value = true

            $editBaseInfo({
              password: form.password
            }).then(res => {
              if (res.code === 1) {
                $message.success('操作成功')
                dialogVisible.value = false
                store.commit('user/SET_USERINFO_PASSWORD_LIMIT_FLAG', 0)
              } else {
                $message.error(res.message)
              }
            loading.value = false
            }).catch(err => {
              $message.error(err.message)
              loading.value = false
            })
          }
        })
      } catch (err) {
        console.log(err)
      }
    }

    return {
      rules,
      form,
      dialogVisible,
      loading,
      showTip,
      checkPassType,
      handlePasswordChange
    }
  }
})
</script>
<style lang="scss" scoped>
.hidden-error {
  ::v-deep {
    .el-form-item__error {
      display: none;
    }
  }
}
.password-tip {
  height: 42px;
  transition: all .2s;
  &.slideup {
    opacity: 0;
    height: 0!important
  }
  li {
    line-height: 1.5;
  }
  .el-icon-warning {
    color: #abc8fa;
  }
  .el-icon-success {
    color: $--color-success;
  }
}
.passworld-dialog {
  z-index: 99999!important;
}

</style>
