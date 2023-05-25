<template>
  <el-dialog
    :title="sopDialogTitle"
    :visible="status"
    @close="onCancel"
  >
    <el-form label-width="88px">
      <el-form-item v-if="isEdit" label="账号名称：">
        <div class="account-info flex flex-align-center">
          <img :src="dialogData.accountImg" alt="">
          <span>{{ dialogData.accountName }}</span>
        </div>
      </el-form-item>
      <div v-else>
        <el-form-item label="平台名称:">抖音</el-form-item>
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
      </div>
      <el-form-item label="URL：">
        <el-link v-if="isEdit" :href="dialogData.url" type="primary">{{ dialogData.url }}</el-link>
        <flex-row v-else>
          <el-input v-model="user_url" placeholder="请输入平台分享出来的链接" autocomplete="off" @change="userInfo = null" />
          <el-button :loading="empowerLoading" @click="onEmpower">授权</el-button>
        </flex-row>
      </el-form-item>
      <el-form-item label="内容主题:">
        <el-checkbox-group v-model="dialogData.topics" :max="6">
          <el-checkbox
            v-for="topic in _topicsList"
            :key="topic.tagId"
            :label="topic.tagName"
          >{{ topic.tagName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="点评:">
        <el-input v-model="dialogData.commentContent" maxlength="50" show-word-limit placeholder autocomplete="off" />
      </el-form-item>
    </el-form>
    <Notice />
    <div slot="footer" class="P-advertisingSopDialogFooter">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="markLoading" @click="onAccountConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { $getUserAccount } from '@/api/account-manage'
import { copy } from '@/utils'
import { Notice } from 'components'
import { $addMarketSopAccount, $editMarketSopAccount } from '@/api/marketing'
import request from '@/http'
import { mapGetters } from 'vuex'

import { PYTHON_HOST as HOST } from '@/const'

export default {
  components: { Notice },
  props: {
    status: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    dialogData: {
      type: Object,
      default() {
        return {}
      }
    },
    topicsList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      userInfo: null,
      user_url: '',
      empowerLoading: false,
      markLoading: false,
      platMap: {}
    }
  },
  computed: {
    ...mapGetters([
      'realname'
    ]),
    sopDialogTitle() {
      return this.isEdit ? '编辑SOP账号' : '添加SOP账号'
    },
    _topicsList() {
      return this.topicsList.slice(1, this.topicsList.length - 1)
    }
  },
  created() {
    this.getPlats()
  },
  methods: {
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
    onCancel() {
      this.$emit('update:status', false)
      this.userInfo = null
      this.user_url = ''
      this.empowerLoading = false
      this.markLoading = false
    },
    onAccountConfirm() {
      const topic = this._topicsList
      const data = copy(this.dialogData)
      delete data.topics
      delete data.url
      delete data.accountName
      data.tagIds = topic.filter(item => this.dialogData.topics.indexOf(item.tagName) !== -1).map(item => item.tagId)
      this.markLoading = true
      let ajaxRequest
      if (this.isEdit) {
        // 编辑
        ajaxRequest = $editMarketSopAccount
      } else {
        // 新增
        if (!this.userInfo) {
          return this.$message.error('请授权之后再试')
        }
        const pattern = /_([a-z])/gi
        for (const key in this.userInfo) {
          const k = key.replace(pattern, (a, l) => (l.toUpperCase()))
          data[k] = this.userInfo[key]
        }
        ajaxRequest = $addMarketSopAccount
      }

      ajaxRequest(data).then(re => {
        if (re.code === 1) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('success')
          this.onCancel()
        } else {
          this.$message.error(re.message)
        }
        this.markLoading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.markLoading = false
      })
    },
    onEmpower() {
      if (this.empowerLoading) return
      this.empowerLoading = true
      const { platMap } = this
      this.userInfo = null
      const params = { index_url: this.user_url, realname: this.realname }
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
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '@/views/account-manage/bench-mark/_mods/dialogs/auth.scss';
  .account-info {
    > img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      margin-right: 4px;
    }
  }
</style>
