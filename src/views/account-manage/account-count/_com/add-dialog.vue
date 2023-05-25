<template>
  <el-dialog class="C-dialog" :visible="dialogStatus" title="添加账号" @close="onClose">
    <el-form ref="form">
      <el-form-item label="平台名称" required>
        <el-select v-model="form.platType" placeholder="请选择平台" @change="onPlatChange">
          <el-option v-for="item in platInfo" :key="item.plat_id" :label="item.plat_name" :value="item.plat_id + '-' + item.plat_name" />
        </el-select>
      </el-form-item>
      <template v-if="platType">
        <el-form-item class="mr90">
          <flex-row>
            <img class="plat-logo" :src="platMap[platType].plat_logo" alt="">
            <div class="plat-info">
              <h3>账号授权</h3>
              <p>{{ PLAT_MODE_TIP[platMap[platType].add_mode] }}</p>
            </div>
          </flex-row>
        </el-form-item>
        <el-form-item v-if="userInfo" class="mr90">
          <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
          <p>{{ userInfo.user_name }}</p>
        </el-form-item>
        <el-form-item v-else-if="platMap[platType].add_mode === 1 && qrcode" class="mr90 qrcode-wrap">
          <img :src="qrcode" style="width: 300px;" alt="">
          <div v-if="qpcodeExpiress" class="expiress-qrcode">
            <span>当前二维码已过期</span>
            <el-button @click="onEmpower">刷新</el-button>
          </div>
        </el-form-item>

        <el-form-item v-if="platMap[platType].add_mode === 4" label="主页链接" required>
          <el-input v-model="form.accountLoginUrl" maxlength="300" />
          <p class="error-tip">{{ errors.accountLoginUrl }}</p>
        </el-form-item>
        <template v-else-if="platMap[platType].add_mode === 3">
          <el-form-item label="账号" required>
            <el-input v-model="form.account" />
            <p class="error-tip">{{ errors.account }}</p>
          </el-form-item>
          <el-form-item label="密码" required>
            <el-input v-model="form.password" type="password" />
            <p class="error-tip">{{ errors.password }}</p>
          </el-form-item>
        </template>
        <el-form-item label="手机号码">
          <el-input v-model="form.phone" maxlength="11" placeholder="请输入开通账号的手机号" />
        </el-form-item>
        <el-form-item class="mr90">
          <el-button @click="onClose">取消</el-button>
          <el-button v-if="userInfo" v-log="{ operation_module: '添加账号确定'}" type="primary" @click="onSave">确定</el-button>
          <el-button v-else v-loading="empowerLoading" v-log="{ operation_module: '添加账号授权'}" type="primary" @click="onEmpower">授权</el-button>
        </el-form-item>
      </template>
    </el-form>
  </el-dialog>
</template>
<script>
import { mapGetters } from 'vuex'
import request from '@/http'
import { $getUserAccount, $addSelfAccount } from '@/api/account-manage'

const PLAT_MODE_TIP = {
  1: '请点击授权使用客户端扫码',
  2: '请填写以下信息',
  3: '请填写以下信息',
  4: '请输入平台下分享出来的链接'
}

import { PYTHON_HOST as HOST } from '@/const'
export default {
  props: {
    dialogStatus: {
      type: Boolean
    }
  },
  data() {
    return {
      pdfUrl: 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/%E4%B9%BE%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%E8%B4%A6%E5%8F%B7%E7%A4%BA%E4%BE%8B.pdf',
      form: {
        platType: '',
        accountLoginUrl: '',
        phone: '',
        belongName: '',
        accountLoginName: '',
        accountLoginPassword: '',
        account: '',
        password: ''
      },
      rules: {
        accountLoginUrl: [
          { required: true, message: '请输入URL链接', trigger: 'blur' },
          { required: true, pattern: /[a-zA-z]+:\/\/[^\s]*/, message: '请输入正确的URL链接', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      rulesIf: {
        accountLoginUrl: 4,
        account: 3,
        password: 3
      },
      errors: {
        accountLoginUrl: '',
        account: '',
        password: ''
      },
      qpcodeExpiress: false,
      empowerLoading: false,
      userInfo: null, // 用户信息
      qrcode: '',
      PLAT_MODE_TIP,
      platMap: {}, // 平台映射map
      platInfo: [] // 平台的数据列表
    }
  },
  computed: {
    platType() {
      const { platType } = this.form
      return platType ? platType.split('-')[0] : ''
    },
    platName() {
      const { platType } = this.form
      return platType ? platType.split('-')[1] : ''
    },
    ...mapGetters([
      'realname',
      'userid'
    ])
  },
  watch: {
    'form.accountLoginUrl'() {
      this.check('accountLoginUrl')
    }
  },
  created() {
    this.getPlatList()
  },
  methods: {
    /**
     * 校验统一方法
     */
    check(key) {
      const value = this.form[key]
      const rule = this.rules[key]
      const errors = this.errors
      errors[key] = ''
      for (let i = 0; i < rule.length; i++) {
        const t = rule[i]
        if (t.required && !value) {
          errors[key] = t.message
        } else if (t.pattern && !(t.pattern.test(value))) {
          errors[key] = t.message
        }
      }
      return !errors[key]
    },
    checkAll() {
      const { rules, form, platMap, platType, rulesIf } = this
      let hasOk = true
      for (const key in form) {
        if (!rules[key] || platMap[platType].add_mode !== rulesIf[key]) {
          continue
        }
        console.log(key, '-key')
        if (!this.check(key)) {
          hasOk = false
          continue
        }
      }
      if (!hasOk) {
        return false
      }
      return true
    },
    async onSave() {
      if (this.checkAll()) {
        this.save()
      }
    },
    /**
     * 保存
     */
    async save() {
      const params = {
        platId: this.platType,
        platName: this.platName,
        thirdUserId: this.userInfo.user_id,
        accountName: this.userInfo.user_name,
        accountLoginUrl: this.userInfo.index_url,
        cookies: this.userInfo.cookies,
        accountImg: this.userInfo.avatar_uri,
        secUid: this.userInfo.sec_uid,
        eid: this.userInfo.eid,
        ...this.form
      }
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
        params[k] = this.userInfo[key]
      }
      const res = await $addSelfAccount(params)
      if (res.code === 1) {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.$emit('success')
        this.$emit('input', false)
        this.onClose()
      } else {
        this.$message.error(res.message)
      }
    },
    /**
     * 点击授权
     */
    async onEmpower() {
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     this.empower()
      //   }
      // })
      if (this.checkAll() && !this.empowerLoading) {
        this.empower()
      }
    },
    /**
     * 授权
     */
    async empower() {
      const { form, platMap } = this
      const row = platMap[this.platType]
      let type = ''
      this.userInfo = null // 清空用户信息
      this.empowerLoading = true
      const contentParams = {
        realname: this.realname
      }
      try {
        switch (row.add_mode) {
            case 1:
              const resOneParams = { sign: this.userid + '_' + Date.now(), ...contentParams }
              request.get(`${HOST}${row.api1}`, { params: resOneParams, timeout: 1000 * 40 }).then(res => {
                if (res.code === 1) {
                  this.userInfo = res.data
                } else {
                  this.$message.error(res.msg)
                }
              }).catch(err => {
                if (err.__CANCEL__) {
                  return
                }
                this.qpcodeExpiress = true
                this.$message.error('二维码失效，请重新授权')
              })
              request.get(`${HOST}${row.api2}`, { params: resOneParams }).then(res => {
                if (res.code === 1) {
                  this.qrcode = res.data.src
                  this.empowerLoading = true
                  this.qpcodeExpiress = false
                } else {
                  this.$message.error(res.msg)
                }
                this.empowerLoading = false
              }).catch(err => {
                if (err.__CANCEL__) {
                  return
                }
                this.$message.error(err.msg)
                this.empowerLoading = false
              })
              break
            case 3:
              this.empowerLoading = true
              const resThreeParams = { account: this.form.account, password: this.form.password, ...contentParams }
              const resThree = await request.get(`${HOST}${row.api1}`, { params: resThreeParams, ...contentParams })
              type = resThree.code === 1 ? 'success' : 'error'
              this.$message({
                message: resThree.msg,
                type
              })
              if (resThree.code === 1) {
                this.userInfo = resThree.data
              }
              this.empowerLoading = false
              break
            case 4:
              this.empowerLoading = true
              const resFrouParams = { index_url: form.accountLoginUrl, ...contentParams }
              const resFour = await request.get(`${HOST}${row.api1}`, { params: resFrouParams, ...contentParams })
              type = resFour.code === 1 ? 'success' : 'error'
              this.$message({
                message: resFour.msg,
                type
              })
              if (resFour.code === 1) {
                this.userInfo = resFour.data
              }
              this.empowerLoading = false
              break
        }
        if (this.userInfo && Object.keys(this.userInfo).length <= 0) {
          this.$message.error('获取账号信息失败，请重试')
          this.userInfo = null
        }
      } catch (err) {
        this.empowerLoading = false
        this.$message.error(err.msg)
      }
    },
    async getPlatList() {
      const res = await $getUserAccount()
      if (res.code === 1) {
        const { platMap } = this
        res.data.forEach(t => {
          this.$set(platMap, t.plat_id, t)
        })
        this.platInfo = res.data
      }
    },
    onClose() {
      this.$emit('update:dialogStatus', false)
    },
    onPlatChange() {
      this.userInfo = null // 清空用户信息
      this.qpcodeExpiress = false
      this.qrcode = ''
      this.empowerLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-dialog {
    .plat-logo { width: 46px;height: 46px; }
    h3, p { margin: 0;padding: 0; }
    .plat-info {
      h3, p { line-height: 1.2; }
      p { margin-top: 8px; }
    }
    .mr90 { margin-left: 90px; }
    .icon-tip {
      width: 18px;
      height: 18px;
      color: #b2b2b2;
      cursor: pointer;
      line-height: 18px;
      text-align: center;
      position: absolute;
      border-radius: 18px;
      border: 1px solid #b2b2b2;
      position: relative;
      top: 2px;
      left: 6px;
      display: inline-block;
    }
    .dialog-tip { border-top: 1px solid #ddd;margin-top: 16px;padding-top: 16px;padding-left: 60px;
      a { color: blue;text-decoration: underline; }
    }
  }
  .qrcode-wrap {
    position: relative;
    width: 300px;
    height: 300px;
    .expiress-qrcode {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba($color: #fff, $alpha: 0.9);
      span {
        color: #000;
      }
    }
  }
</style>
<style lang="scss">
  .C-dialog {
    .el-form-item__label { width: 90px;height: 40px; }
      .el-form-item { display: flex;
      .el-form-item__content { flex: 1; }
    }
  }
  .C-dialog-tip-red {
    span { color: red; }
  }
</style>
