<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-25 18:39:14
 * @LastEditTime: 2020-11-13 11:23:21
 * @LastEditors: Linjie
-->
<template>
  <div class="login-container">
    <img class="logo" src="./img/logo.png" alt="">
    <div class="login-text-wrap">
      <h1>乾数据</h1>
      <h2>一站式内容平台</h2>
      <h3>—— 助力新媒体广告精细化运营</h3>
      <ul>
        <li>基于短视频平台的大数据分析</li>
        <li>发现热门素材与优质账号</li>
        <li>监测账号数据变化</li>
        <li>追踪短视频流量趋势</li>
      </ul>
      <el-button class="login-btn flex flex-align-center flex-justify-center"><el-link type="primary" @click="loginShow=true, isLogin=true"> 账密登录</el-link> | <el-link @click="loginByCode">扫码登录</el-link></el-button>
    </div>
    <el-dialog
      :title="isLogin ? '用户登录' : '注册账号'"
      :visible.sync="loginShow"
      :width="isLogin ? '366px':'500px'"
      custom-class="login-wrap"
      :close-on-click-modal="false"
    >
      <el-form v-if="isLogin">
        <div class="login-form">
          <div class="login-row" data-type="profile" :class="{ invalid: invalid.name }">
            <el-input v-model="loginForm.name" placeholder="请输入用户名" />
          </div>
          <div class="login-row" data-type="psw" :class="{ invalid: invalid.password }">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password />
          </div>
        </div>

        <el-button type="primary" :loading="loading" class="login-ctrl" @click="onLogin">登录</el-button>
        <div class="flex flex-justify-end m-t-10">
          <el-link type="primary" @click="isLogin = false">注册账号</el-link>
        </div>
      </el-form>
      <div v-else>
        <Register ref="register" />

        <div>
          <el-button type="primary" :loading="registerLoading" class="register-ctrl" @click="register">注册</el-button>
        </div>
        <div class="flex flex-justify-end m-t-10">
          <el-link type="primary" @click="isLogin = true">已有账号？去登陆</el-link>
        </div>
      </div>
    </el-dialog>
    <div class="login-footer">深圳市乾派文化传播有限公司   企业    <a href="http://www.beian.miit.gov.cn" target="_blank">粤ICP备17140372号-1</a></div>
  </div>
</template>

<script>
import jsCookie from 'js-cookie'
import { mapActions, mapGetters } from 'vuex'
import { $login, $newRegister } from '@/api/user'
import Register from './register/form.vue'

export default {
  name: 'Login',
  components: { Register },
  data() {
    return {
      loginForm: {
        name: '',
        password: ''
      },
      remember: 1,
      invalid: {
        name: false,
        password: false
      },
      loading: false,
      loginShow: false,
      isLogin: true,
      registerLoading: false
    }
  },
  computed: {
    ...mapGetters(['permissionRoutes'])
  },
  beforeMount() {
    this.keyupHandler = function(e) {
      if ((e.keyCode === 13 || e.which === 13) && this.isLogin) {
        this.onLogin()
      }
    }.bind(this)
    document.addEventListener('keyup', this.keyupHandler, false)
  },
  beforeDestroy() {
    if (this.keyupHandler) {
      document.removeEventListener('keyup', this.keyupHandler, false)
      this.keyupHandler = null
    }
  },

  methods: {
    ...mapActions({
      login: 'user/login',
      loginout: 'user/loginout'
    }),
    async onLogin() {
      if (!this.loginForm.name) {
        this.invalid.name = true
        this.$message('请输用户名')
        return
      } else {
        this.invalid.name = false
      }
      if (!this.loginForm.password) {
        this.invalid.password = true
        this.$message('请输入密码')
        return
      } else {
        this.invalid.password = false
      }
      this.loading = true
      try {
        await this.loginout()
        let userInfo = await $login(this.loginForm)
        if (userInfo.code === 1) {
          userInfo = userInfo.data
          jsCookie.set('sso_uid', userInfo.userid, {
            expires: 7
          })
          jsCookie.set('uid', userInfo.userid, {
            expires: 7
          })
          jsCookie.set('external_user', true, {
            expires: 7
          })
        } else {
          throw (userInfo)
        }
        await this.login(userInfo)
        // 没有首页权限的情况
        if (this.permissionRoutes.findIndex(item => item.path === '/') === -1) {
          this.$router.push({
            path: this.permissionRoutes.find(item => item.alwaysShow).path
          })
        } else {
          this.$router.push({
            path: '/'
          })
        }
        this.loginShow = false
      } catch (err) {
        console.log(err)
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      }
    },
    loginByCode() {
      location.href = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect?appid=ww8469a6417268da6f&agentid=1000201&redirect_uri=https%3A%2F%2Fqpmcn.zhuanspirit.com%2F#'
    },
    register() {
      this.$refs.register.handleSave().then(res => {
        this.registerLoading = true
        $newRegister(res).then(res => {
          if (res.code === 1) {
            this.isLogin = true
            this.$message.success('注册成功')
          } else {
            this.$message.error(res.message)
          }
          this.registerLoading = false
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './login.scss';

</style>

<style lang="scss">
  .login-wrap {
    border-radius: 6px;
    .el-dialog__body {
      padding: 26px 40px;
    }
    .login-form {
      width: 100%;
      padding: 0 8px;
      border: 1px solid #cccccc;
      border-radius: 4px;
      box-sizing: border-box;
      .login-row {
        &:first-child {
          .el-input__inner {
            border-bottom: 1px solid #cccccc;
          }
        }
      }
      .el-input__inner {
        height: 48px;
        line-height: 48px;
        border: 0;
        border-radius: 0;
      }
    }
    .login-ctrl {
      width: 288px;
      height: 46px;
      margin-top: 20px;
    }
  }
  .register-ctrl {
    width: 100%;
    height: 46px;
    margin-top: 10px;
  }
  .login-btn {
    line-height: 58px;
  }
</style>
