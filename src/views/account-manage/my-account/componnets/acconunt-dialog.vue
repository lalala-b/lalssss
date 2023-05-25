<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-08 19:50:54
 * @LastEditTime: 2020-12-16 16:07:29
 * @LastEditors: Linjie
-->
<template>
  <el-dialog class="C-dialog" :visible="dialogStatus" :title="title" @close="onClose">
    <div v-loading="globalLoading">
      <el-form ref="form" :loading="loadingInfo">
        <p v-if="isFirstAdd" class="tip-red">若您不是该账号的运营人员请暂停绑定，联系账号运营人员先绑定！！！</p>
        <el-form-item v-if="hasDemo" class="mr90">
          <el-link type="primary" target="_blank" :href="pdfUrl">账号绑定示例</el-link>
        </el-form-item>
        <el-form-item label="平台名称" required>
          <el-select v-model="form.platType" placeholder="请选择平台" :disabled="isRebind" @change="onPlatChange">
            <el-option v-for="item in platInfo" :key="item.plat_id" :label="item.plat_name" :value="item.plat_id + '-' + item.plat_name" :disabled="(isMyAccount && !$permission('add_douyin_account')) ? false: hasDemo&&item.plat_id === 25" />
          </el-select>
        </el-form-item>
        <template v-if="platType">
          <el-form-item v-if="platType == 25 && $permission('add_account_by_dy_link')" class="mr90">
            <el-radio-group v-model="authType">
              <el-radio-button label="0">扫码授权</el-radio-button>
              <el-radio-button v-if="!isMyAccount" label="1">URL授权</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="mr90">
            <p v-if="platType == 25 && authType == 1" class="tip-red">通过URL授权的抖音账号无法更新视频流量！！！视频流量数据都为0。</p>
            <flex-row>
              <img class="plat-logo" :src="((platMap[platType] || [])[authType] || {}).plat_logo" alt="">
              <div class="plat-info">
                <h3>账号授权</h3>
                <p>{{ PLAT_MODE_TIP[((platMap[platType] || [])[authType] || {}).add_mode] }}</p>
              </div>
            </flex-row>
          </el-form-item>
          <el-form-item v-if="originBindData&&showAccount" class="mr90">
            <img :src="originBindData.accountImg" style="width: 100px;" alt="">
            <p>{{ originBindData.accountName }}</p>
          </el-form-item>
          <el-form-item v-if="userInfo" class="mr90">
            <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
            <p>{{ userInfo.user_name }}</p>
          </el-form-item>
          <el-form-item v-else-if="((platMap[platType] || [])[authType] || {}).add_mode === 1 && qrcode" class="mr90 qrcode-wrap">
            <img :src="qrcode" style="width: 300px;" alt="">
            <div v-if="qpcodeExpiress" class="expiress-qrcode">
              <span>当前二维码已过期</span>
              <el-button @click="onEmpower">刷新</el-button>
            </div>
          </el-form-item>

          <template v-if="platType&&!isRebind">
            <el-form-item v-if="showSearch" label="账号检索">
              <AccountSearch v-model="userInfo" :plat-id="platType" @change="handleAccountChange" />
            </el-form-item>
          </template>
          <el-form-item v-if="((platMap[platType] || [])[authType] || {}).add_mode === 4" label="URL" required>
            <el-input v-model="form.accountLoginUrl" maxlength="300" @change="handleUrlChange" />
            <p class="tip-red m-t-5">{{ errors.accountLoginUrl }}</p>
          </el-form-item>
          <template v-else-if="((platMap[platType] || [])[authType] || {}).add_mode === 3">
            <el-form-item label="账号" required>
              <el-input v-model="form.account" />
              <p class="tip-red m-t-5">{{ errors.account }}</p>
            </el-form-item>
            <el-form-item label="密码" required>
              <el-input v-model="form.password" type="password" auto-complete="new-password" />
              <p class="tip-red m-t-5">{{ errors.password }}</p>
            </el-form-item>
          </template>
          <el-form-item v-if="isFirstAdd" label="手机号" :required="isFirstAdd">
            <el-input v-model="form.phone" maxlength="11" placeholder="请输入开通账号的手机号" @change="checkPhone" />
            <p v-if="isFirstAdd" class="tip-red m-t-5">{{ errors.phone }}</p>
            <p v-if="!isFirstAdd&&showCheckPhone" class="tip-red m-t-5">请输入正确的手机号</p>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item v-if="hasQianshuju" label="乾数据账号" class="operating" :required="isFirstAdd">
                <el-input v-model="form.belongName" maxlength="11" placeholder="乾数据账号统一名称" style="width: 80%;" />
                <el-tooltip placement="top">
                  <div slot="content" class="C-dialog-tip-red">
                    比如，账号娜美撩机，B站名称：
                    <span>娜美撩机</span> ；火山名称：
                    <span>饭饭大评测</span>。
                    <br>但是实际都是归类于
                    <span>娜美撩机</span>。那么，乾数据账号统一名称就是
                    <span>娜美撩机</span>
                  </div>
                  <i class="el-icon-question" />
                </el-tooltip>
                <p v-if="isFirstAdd" class="tip-red m-t-5">{{ errors.belongName }}</p>
              </el-form-item>
            </el-col>
            <el-col v-if="operating" :span="12">
              <el-form-item label="运营负责人：" class="operating">
                {{ operating }}<span class="tip-red">（账号责任人，配合中台落实注册提现等事宜）</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="mr90">
            <el-button @click="onClose">取消</el-button>
            <el-button v-if="userInfo" v-log="{ operation_module: '添加视频账号'}" type="primary" :loading="saveLoading" @click="onSave">确定</el-button>
            <el-button v-else v-log :loading="empowerLoading" type="primary" @click="onEmpower">授权</el-button>
            <span v-if="showQrCodeTxt" class="red-tip" style="font-size:12px">  请您尽快扫码授权，扫码后请耐心等待信息返回</span>
          </el-form-item>
          <Notice v-if="hasTip" />
        </template>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
// 添加视频账号、文章团账号、对标账号
import { mapGetters } from 'vuex'
import request from '@/http'
import { unique } from '@/utils'
import { $getUserAccount, $addSelfAccount, $rebindAccount, $getRebindAccountInfo, $isFirstAdd } from '@/api/account-manage'
import { Notice, AccountSearch } from 'components'

const PLAT_MODE_TIP = {
  1: '请点击授权使用客户端扫码',
  2: '请填写以下信息',
  3: '请填写以下信息',
  4: '请输入平台下分享出来的链接'
}

import { PYTHON_HOST as HOST, API_HOST } from '@/const'
const PDF_URL = 'https://qpmcn-1255305554.cos.ap-beijing.myqcloud.com/%E4%B9%BE%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A%E8%B4%A6%E5%8F%B7%E7%A4%BA%E4%BE%8B.pdf'
const MOBILE_REG_EXP = /^1\d{10}$/
export default {
  components: { Notice, AccountSearch },
  props: {
    dialogStatus: {
      type: Boolean
    },
    hasTip: {
      type: Boolean,
      default: true
    },
    hasQianshuju: {
      type: Boolean,
      default: true
    },
    hasDemo: {
      type: Boolean,
      default: true
    },
    platParams: { // 对标账号的类型account_type:7
      type: Object,
      default() {
        return null
      }
    },
    isMyAccount: {
      type: Boolean
    },
    saveAjax: {
      type: Function,
      default: null
    },
    isRebind: {
      type: Boolean,
      default: false
    },
    reBindData: {
      type: Object,
      default() {
        return {}
      }
    },
    isJump: {
      type: Boolean
    },
    pageNum: {
      type: Number,
      default: 1
    },
    tabType: {
      type: String,
      default: 'video'
    }
  },
  data() {
    return {
      pdfUrl: PDF_URL,
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
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { required: true, pattern: MOBILE_REG_EXP, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        belongName: [
           { required: true, message: '请输入乾数据账号统一名称', trigger: 'blur' }
        ]
      },
      //
      rulesIf: {
        accountLoginUrl: 4,
        account: 3,
        password: 3
      },
      errors: {
        accountLoginUrl: '',
        account: '',
        password: '',
        phone: ''
      },
      qpcodeExpiress: false,
      empowerLoading: false,
      userInfo: null, // 用户信息
      originBindData: null,
      qrcode: '',
      qrcodeToken: '',
      tiktokCode: '',
      PLAT_MODE_TIP,
      authType: 0,
      platMap: {}, // 平台映射map
      platInfo: [], // 平台的数据列表
      OldthirdUserId: '',
      oldAccountId: '',
      OldthirdAccountName: '',
      isFirstAdd: false, // 是否首次绑定
      operating: '', // 运营负责人
      loadingInfo: false,
      showCheckPhone: false,
      showAccount: true,
      showQrCodeTxt: false,
      saveLoading: false,
      timeoutFlag: true,
      globalLoading: false
    }
  },
  computed: {
    ...mapGetters([
      'realname',
      'userid'
    ]),
    platType() {
      const { platType } = this.form
      return platType ? platType.split('-')[0] : ''
    },
    platName() {
      const { platType } = this.form
      return platType ? platType.split('-')[1] : ''
    },
    showSearch() {
      return this.platType === '26'
    },
    title() {
      if (this.tabType === 'article') {
        return `${this.isRebind ? '重新绑定' : '添加'}文章团账号`
      } else {
        return `${this.isRebind ? '重新绑定' : '添加'}视频账号`
      }
    }
  },
  watch: {
    'form.accountLoginUrl'() {
      this.check('accountLoginUrl')
    },
    'form.phone'() {
      if (this.isFirstAdd) {
        this.check('phone')
      }
    },
    'form.belongName'() {
      if (this.isFirstAdd) {
        this.check('belongName')
      }
    },
    reBindData: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val) && Object.keys(val).length) {
          this.getRebindAccountInfo()
          this.originBindData = val
        }
      },
      deep: true
    },
    userInfo: {
      immediate: true,
      handler(val) {
        if (val && Object.keys(val) && Object.keys(val).length) {
          this.getFirstAdd()
        }
      },
      deep: true
    }
  },
  created() {
    this.getPlatList()
  },
  methods: {
    handleUrlChange() {
      this.authType = 0
      this.userInfo = null // 清空用户信息
      this.qpcodeExpiress = false
      this.qrcode = ''
      this.empowerLoading = false
    },
    handleAccountChange(accountInfo) {
      console.log(accountInfo)
      // this.empowerDisabled = true
      // this.userInfo = accountInfo
      this.form.accountLoginUrl = accountInfo.index_url
    },
    /**
     * 校验统一方法
     */
    check(key) {
      const value = this.form[key]
      const rule = this.rules[key] || []
      const errors = this.errors
      errors[key] = ''
      for (let i = 0; i < rule.length; i++) {
        const t = rule[i]
        if (t.required && !value) {
          errors[key] = t.message
        } else if (value && t.pattern && !(t.pattern.test(value))) {
          errors[key] = t.message
        }
        if (!value) {
          break
        }
      }
      return !errors[key]
    },
    checkPhone(val) {
      this.showCheckPhone = val && !MOBILE_REG_EXP.test(val)
    },
    checkAll() {
      const { rules, form, platMap, platType, rulesIf, authType } = this
      let hasOk = true
      for (const key in form) {
        if (rules[key] || ((platMap[platType] || [])[authType] || {}).add_mode !== rulesIf[key]) {
          continue
        }
        if (!this.check(key)) {
          hasOk = false
        }
      }
      const flag = []
      for (const key in form) {
        if (this.isFirstAdd && (key === 'phone' || key === 'belongName')) {
          flag.push(this.check(key))
          hasOk = !flag.includes(false)
        }
      }
      if (!hasOk) {
        return false
      }
      return true
    },
    async onSave() {
      if (this.reBindData && this.reBindData.accountId) {
        if (this.checkAll() && !this.showCheckPhone) {
          this.rebindAccount()
        }
        return
      }
      if (this.checkAll()) {
        this.save()
      }
    },
    /**
     * 保存
     */
    async save() {
      const { form, platMap, authType } = this
      const row = platMap[this.platType][authType]

      // 我的账号中添加抖音时处理
      if (this.isMyAccount && +row.plat_id === 25) {
        this.saveLoading = true
        const params = {
          userId: this.userid,
          code: this.tiktokCode,
          ...this.form
        }

        try {
          const res = await request.get(`${API_HOST}/api/access/token/out/add`, { params, withCredentials: false })
          this.saveLoading = false
          if (+res.code === 1) {
            this.$emit('success')
            this.$emit('input', false)
            this.onClose()
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            // if (this.isFirstAdd) {
            //   this.$message({
            //     showClose: true,
            //     message: `${this.platName}-${this.userInfo.user_name} 为首次添加入库，账号运营申请已同步中台待审批，可在【运营管理-我的申请】中查看审批状态。`,
            //     duration: 0
            //   })
            // } else {
            //   this.$message({
            //     message: '操作成功',
            //     type: 'success'
            //   })
            // }
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              duration: 0,
              type: 'error'
            })
          }
        } catch (e) {
          this.$message({
            message: '添加失败，请重试',
            type: 'error'
          })
          this.saveLoading = false
        }
        return
      }

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
        addMode: this.platMap[this.platType][this.authType].add_mode,
        ...this.form
      }
      if (this.tabType === 'article')params.articleAccountFlag = 1
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
        params[k] = this.userInfo[key]
      }
      const res = await (this.saveAjax ? this.saveAjax : $addSelfAccount)(params)
      if (res.code === 1) {
        this.$emit('success')
        this.$emit('input', false)
        this.onClose()
        let errMessage = null
        if (this.isFirstAdd) {
          errMessage = this.$message({
            showClose: true,
            message: <a style='cursor: pointer;' id='errMsg'>{this.platName}-{this.userInfo.user_name} 为首次添加入库，账号运营申请已同步中台待审批，可在运营管理-我的申请】中查看审批状态。</a>,
            duration: 0
          })
        } else {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        }
        const myErrMsg = document.getElementById('errMsg')
        const _this = this
        myErrMsg && myErrMsg.addEventListener('click', function(e) {
          _this.$router.push({
            path: `/operations_management/my_application`
          })
          errMessage.close()
        })
      } else {
        this.$message({
          showClose: true,
          message: res.message,
          duration: 0,
          type: 'error'
        })
      }
    },
    /**
     * 点击授权
     */
    onEmpower() {
      // this.$refs.form.validate(valid => {
      //   if (valid) {
      //     this.empower()
      //   }
      // })
      if (this.checkAll() && !this.empowerLoading && !this.showCheckPhone) {
        this.empower()
      }
    },

    // 检查抖音扫码状态
    async checkTikTokQrcodeStatus() {
      try {
        const { code, data, message } = await request.get(`${API_HOST}/api/access/token/checkQrcode`, { params: { qrToken: this.qrcodeToken }, withCredentials: false })
        if (+code === 1) {
          // 过期
          if (data.status === 'expired') {
            this.$message.error('二维码失效，请重新扫码')
            this.qrcode = data.qrcode
            this.qrcodeToken = data.token
          }

          if (data.status === 'confirmed') {
            try {
              const userRes = await request.get(data.redirect_url, { withCredentials: false })
              this.empowerLoading = false
              this.showQrCodeTxt = false
              if (+userRes.code === 1) {
                this.userInfo = {
                  avatar_uri: userRes.data.accountImg,
                  user_name: userRes.data.accountName,
                  user_id: userRes.data.accountId
                }
                this.tiktokCode = userRes.data.code
              } else {
                this.$message.error(userRes.message)
              }
            } catch (err) {
              this.empowerLoading = false
              if (err.__CANCEL__) {
                return
              }
              this.qpcodeExpiress = true
              this.$message.error('二维码失效，请重新授权')
            }
            return
          }
          if (!this.timeoutFlag) return
          setTimeout(() => {
            this.checkTikTokQrcodeStatus()
          }, 1000)
        } else {
          this.$message.error(message)
        }
      } catch (err) {
        this.empowerLoading = false
        if (err.__CANCEL__) {
          return
        }
        this.qpcodeExpiress = true
        this.$message.error('二维码失效，请重新授权')
      }
    },

    /**
     * 授权
     */
    async empower() {
      const { form, platMap, authType } = this
      const row = platMap[this.platType][authType]
      let type = ''
      this.userInfo = null // 清空用户信息
      this.empowerLoading = true
      const contentParams = {
        realname: this.realname
      }

      try {
        switch (row.add_mode) {
            case 1:
              this.empowerLoading = true
              // eslint-disable-next-line no-case-declarations
              const resOneParams = { sign: this.userid + '_' + Date.now(), ...contentParams }
              if (!(this.isMyAccount && +row.plat_id === 25)) {
                request.get(`${HOST}${row.api1}`, { params: resOneParams, timeout: 1000 * 60 }).then(res => {
                  this.empowerLoading = false
                  this.showQrCodeTxt = false
                  if (res.code === 1) {
                    this.userInfo = res.data
                  } else {
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  this.empowerLoading = false
                  if (err.__CANCEL__) {
                    return
                  }
                  this.qpcodeExpiress = true
                  this.$message.error('二维码失效，请重新授权')
                })
              }

              // 我的账号中添加抖音时处理
              if (this.isMyAccount && +row.plat_id === 25) {
                request.get(`${API_HOST}/api/access/token/getQrcode`, { params: { userId: this.userid }, withCredentials: false }).then(res => {
                  if (+res.code === 1) {
                    this.qrcode = `data:image/jpg;base64,${res.data.qrcode}`
                    this.qpcodeExpiress = false
                    this.showQrCodeTxt = true
                    this.qrcodeToken = res.data.token

                    this.$nextTick(() => {
                      this.checkTikTokQrcodeStatus()
                    })
                  } else {
                    this.showQrCodeTxt = false
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  if (err.__CANCEL__) {
                    return
                  }
                  this.$message.error(err.msg)
                  this.empowerLoading = false
                })
              } else {
                request.get(`${HOST}${row.api2}`, { params: resOneParams, timeout: 1000 * 60 }).then(res => {
                  if (res.code === 1) {
                    this.qrcode = res.data.src
                    this.qpcodeExpiress = false
                    this.showQrCodeTxt = true
                  } else {
                    this.showQrCodeTxt = false
                    this.$message.error(res.msg)
                  }
                }).catch(err => {
                  if (err.__CANCEL__) {
                    return
                  }
                  this.$message.error(err.msg)
                  this.empowerLoading = false
                })
              }
              break
            case 3:
               // eslint-disable-next-line no-case-declarations
              const resThreeParams = { account: this.form.account, password: this.form.password, ...contentParams }
               // eslint-disable-next-line no-case-declarations
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
               // eslint-disable-next-line no-case-declarations
              const resFrouParams = { index_url: form.accountLoginUrl, ...contentParams }
               // eslint-disable-next-line no-case-declarations
              const resFour = await request.get(`${HOST}${row.api1}`, { params: resFrouParams })
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
    // 获取平台列表
    getPlatList() {
      const params = {}
      if (this.platParams) {
        Object.assign(params, this.platParams)
      }
      if (this.tabType === 'article')params.plat_type_id = 1
      $getUserAccount(params).then(async res => {
        if (res.code === 1) {
          this.platMap = res.data.reduce((t, n) => {
            if (!t[n.plat_id]) {
              t[n.plat_id] = []
            }
            t[n.plat_id].push(n)
            return t
          }, {})
          // res.data.forEach(t => {
          //   this.$set(platMap, t.plat_id, t)
          // })
          this.platInfo = unique(res.data, 'plat_id')

          // 如果url中带有code, 说明是抖音扫码后重定向进来
          const { code, accountId } = this.$route.query
          if (code && this.isJump) {
            this.globalLoading = true
            this.form.platType = '25-抖音'

            const res = await request.get(`${API_HOST}/api/access/token/redirect/get`, { params: { code }, withCredentials: false })
            this.globalLoading = false
            this.userInfo = {
              avatar_uri: res.data.accountImg,
              user_name: res.data.accountName,
              user_id: res.data.accountId
            }
            this.tiktokCode = code

            // 扫码重新绑定且两次id不一致
            if (accountId && res.data.accountId !== accountId) {
              this.$message.error(`请使用【${this.platName}-${this.OldthirdAccountName}】扫码授权！`)
              return
            }
          }
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    onClose() {
      this.timeoutFlag = false
      this.$emit('update:dialogStatus', false)
    },
    onPlatChange() {
      this.form.accountLoginUrl = ''
      this.authType = 0
      this.userInfo = null // 清空用户信息
      this.qpcodeExpiress = false
      this.qrcode = ''
      this.empowerLoading = false
    },
    async rebindAccount() {
      const { form, platMap, authType } = this
      const row = platMap[this.platType][authType]

       // 我的账号中添加抖音时处理
      if (this.isMyAccount && +row.plat_id === 25) {
        if (+this.userInfo.user_id !== +this.oldAccountId) {
          this.$message.error(`请使用【${this.platName}-${this.OldthirdAccountName}】扫码授权！`)
          return
        }
      } else {
        if (this.userInfo.user_id !== this.OldthirdUserId) {
          this.$message.error(`请使用【${this.platName}-${this.userInfo.user_name}】扫码授权！`)
          return
        }
      }

      // 我的账号中添加抖音时处理
      if (this.isMyAccount && +row.plat_id === 25) {
        const params = {
          userId: this.userid,
          code: this.tiktokCode,
          ...this.form
        }

        try {
          const res = await request.get(`${API_HOST}/api/access/token/out/add`, { params, withCredentials: false })
          this.saveLoading = true
          if (+res.code === 1) {
            this.$message({
              message: '重新绑定成功',
              type: 'success'
            })
            this.$emit('success', this.pageNum)
            this.$emit('input', false)
            this.onClose()
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              duration: 0,
              type: 'error'
            })
          }
          this.saveLoading = false
        } catch (e) {
          this.$message({
            message: '重新绑定失败，请重试',
            type: 'error'
          })
          this.saveLoading = false
        }
        return
      }

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
        addMode: this.platMap[this.platType][this.authType].add_mode,
        accountId: this.reBindData.accountId,
        accountPhone: this.form.phone,
        belongName: this.form.belongName,
        accountLoginName: this.form.accountLoginName,
        accountLoginPassword: this.form.accountLoginPassword
      }
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => l.toUpperCase())
        params[k] = this.userInfo[key]
      }

      try {
        this.saveLoading = true
        const res = await $rebindAccount(params)
        if (res.code === 1) {
          this.$message({
            message: '重新绑定成功',
            type: 'success'
          })
          this.$emit('success', this.pageNum)
          this.$emit('input', false)
          this.onClose()
        } else {
          this.$message.error(res.message)
        }
        this.saveLoading = false
      } catch (e) {
        this.saveLoading = false
      }
    },
    async getRebindAccountInfo() {
      this.loadingInfo = true
      const res = await $getRebindAccountInfo({ accountId: this.reBindData.accountId || '' })
      if (res.code === 1) {
        const data = res.data
        this.originBindData = {
          ...this.originBindData,
          accountImg: data.accountImg,
          accountName: data.accountName
        }
        this.form.platType = data.platId + '-' + data.platName
        this.form.phone = data.phone
        this.form.belongName = data.belongName
        this.form.accountLoginName = data.accountLoginName// 新增
        this.form.accountLoginPassword = data.accountLoginPassword
        this.form.accountLoginUrl = data.accountLoginUrl || ''
        this.OldthirdUserId = data.thirdUserId
        this.oldAccountId = this.reBindData.accountId
        this.OldthirdAccountName = data.accountName
        this.loadingInfo = false
      } else {
        this.loadingInfo = false
         this.$message.error(res.message)
      }
    },
    async getFirstAdd() {
      const params = {
        thirdUserId: this.userInfo.user_id,
        platId: this.platType
      }
      const res = await $isFirstAdd(params)
      if (res.code && res.data) {
         this.isFirstAdd = !res.data.isFirst // 0首次 1非首次
         this.showAccount = false
         this.operating = this.isFirstAdd ? this.$store.state.user.userInfo.realname : res.data.name
      } else {
        this.showAccount = true
        this.isFirstAdd = false
        this.$message.error(res.message)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-dialog {
    .plat-logo { width: 46px;height: 46px; }
    // h3, p { margin: 0;padding: 0; }
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
  .operating{
    .el-form-item__label{
      width:110px;
    }
  }
</style>
