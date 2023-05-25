<template>
  <el-dialog
    class="M-benchmarkAuthDialog"
    title="添加关联账号"
    :visible="status"
    @close="onDialogCancel()"
  >
    <el-form ref="auth" :model="model" :rules="rules" :label-width="formLabelWidth">
      <div class="M-benchmarkAuthDialogRows">
        <el-form-item label="平台名称">抖音</el-form-item>
        <div class="M-benchmarkAuthDialogInfo">
          <dl>
            <dt><img :src="platMap.plat_logo"></dt>
            <dd>
              <p class="tp"> 账号授权</p>
              <p>请输入平台下分享出来的链接</p>
            </dd>
          </dl>
        </div>

        <el-form-item v-if="userInfo" class="mr90">
          <img :src="userInfo.avatar_uri" style="width: 100px;" alt="">
          <p>{{ userInfo.user_name }}</p>
        </el-form-item>
        <el-form-item label="竞品名称" required>
          <el-select
            v-model="competeId"
            placeholder="请选择竞品名称"
          >
            <el-option v-for="item in contendList" :key="item.id" :label="item.competeName" :value="item.id">{{ item.competeName }}</el-option>
          </el-select>
        </el-form-item>
        <template>
          <el-form-item label="URL" prop="user_url">
            <flex-row>
              <el-input v-model="model.user_url" autocomplete="off" @change="userInfo = null" />
              <el-button :loading="empowerLoading" @click="onEmpower">授权</el-button>
            </flex-row>
          </el-form-item>
        </template>
      </div>
    </el-form>

    <div class="M-benchmarkAuthDialogFns">
      <el-button @click="onDialogCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onDialogConfirm">确定</el-button>
    </div>
    <Notice />
  </el-dialog>

</template>
<script>
import { mapGetters } from 'vuex'
import { $getUserAccount } from '@/api/account-manage'
import { $addContendAccount } from '@/api/contend'
import request from '@/http'
import { Notice } from 'components'

import { PYTHON_HOST as HOST } from '@/const'

const DEF_AUTH_MODEL = {
  user_id: '',
  belong_name: '',
  platName: '',
  note: '',
  platType: ''
}

export default {
  components: { Notice },
  props: {
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      model: {
        ...DEF_AUTH_MODEL
      },
      competeId: '',
      contendList: [],
      formLabelWidth: '88px',
      platMap: {},
      empowerLoading: false,
      userInfo: null,
      // 表单验证规则
      rules: {
        user_url: {
          required: true, 'message': 'URL 不能为空', 'trigger': 'blur'
        }
      },
      loading: false,
      tags: []
    }
  },
  computeds: {
    ...mapGetters([
      'realname'
    ])
  },
  created() {
    this.getPlats()
    this.$bus.$on('getContendList', (contendList) => {
      this.contendList = contendList
    })
  },
  beforeDestroy() {
    this.$bus.$off('getContendList')
  },
  methods: {
    // 授权
    onEmpower() {
      if (this.empowerLoading) return
      this.empowerLoading = true
      const { platMap } = this
      this.userInfo = null // 清空用户信息
      const params = { index_url: this.model.user_url, realname: this.realname }
      request.get(`${HOST}${platMap.api1}`, { params: params }).then(res => {
        if (res.code === 1) {
          this.userInfo = res.data
        }
        this.$message({
          message: res.msg,
          type: res.code === 1 ? 'success' : 'error'
        })
        this.empowerLoading = false
      }).catch(err => {
        this.$message.error(err.msg)
        this.empowerLoading = false
      })
    },

    /**
     * 获取支持的平台
     * @return {Object}  Promise 对象
     */
    getPlats() {
      return $getUserAccount({
        account_type: 5
      }).then(re => {
        if (re.code === 1) {
          this.platMap = re.data.find(t => {
            return t.plat_name === '抖音'
          })
        }
      })
    },
    /**
     * 浮层取消响应函数
     */
    onDialogCancel() {
      this.model = { ...DEF_AUTH_MODEL }
      this.userInfo = {}
      this.competeId = ''
      this.$emit('close')
      this.$emit('update:status', false)
    },
    /**
     * 浮层确认响应函数
     * @param  {String} type 取消类型
     */
    async onDialogConfirm(type, pass) {
      if (!this.userInfo) {
        this.$message.error('请授权之后再试')
        return
      }
      if (!this.competeId) {
        this.$message.error('请选择竞品名称')
        return
      }
      const params = this.model
      params.avatarUri = this.userInfo.avatar_uri
      params.userName = this.userInfo.userName
      params.note = this.userInfo.note
      params.eid = this.userInfo.eid
      params.secUid = this.userInfo.sec_uid
      params.thirdUserId = this.userInfo.user_id
      params.accountLoginUrl = this.userInfo.index_url
      this.addAccount(params)
    },
    addAccount(params) {
      if (this.loading) {
        return false
      }
      this.loading = true
      const pattern = /_([a-z])/gi
      for (const key in this.userInfo) {
        const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
        params[k] = this.userInfo[key]
      }
      params.thirdUserId = this.userInfo.user_id
      params.competeId = this.competeId
      params.platId = this.platMap.plat_id
      params.platName = this.platMap.plat_name
      $addContendAccount(params).then(res => {
        if (res.code === 1) {
          this.model = { ...DEF_AUTH_MODEL }
          this.competeId = ''
          this.userInfo = {}
          this.$message.success('添加成功')
          this.$emit('close')
          this.$emit('update:status', false)
          this.$emit('success')
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/views/account-manage/bench-mark/_mods/dialogs/auth.scss';
</style>
