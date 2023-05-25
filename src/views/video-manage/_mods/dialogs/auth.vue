<template>
  <el-dialog
    class="M-benchmarkAuthDialog"
    title="添加对标账号"
    :visible.sync="status"
    @close="onDialogCancel()"
  >
    <el-form ref="auth" :model="model" :rules="rules" :label-width="formLabelWidth">
      <div class="M-benchmarkAuthDialogRows">
        <el-form-item label="平台名称" required>
          <el-select
            v-model="paltType"
            placeholder="请选择平台"
            value-key="val"
            @change="onPlatChange"
          >
            <el-option
              v-for="item in platInfo"
              :key="item.id"
              :label="item.text"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <div v-if="paltType" class="M-benchmarkAuthDialogInfo">
          <dl>
            <dt><img :src="getPlatIco()"></dt>
            <dd>
              <p class="tp"> 账号授权</p>
              <p>{{ getAuthTip() }}</p>
            </dd>
          </dl>
        </div>

        <template v-if="paltType">
          <p v-if="paltType._defWay === '7'">说明：请粘贴所选择平台的当前视频播放页面地址</p>
          <el-form-item label="URL" prop="user_url">
            <el-input v-model="model.user_url" autocomplete="off" />
          </el-form-item>
        </template>

        <div v-if="paltType" class="M-benchmarkAuthDialogTags">
          <div class="M-benchmarkAuthDialogTagsLabel">账号标签:</div>
          <div class="M-benchmarkAuthDialogTagsCon">
            <div>
              <el-tag
                v-for="tag in tags"
                :key="tag"
                closable
                :disable-transitions="false"
                @close="handleClose(tag)"
              >
                {{ tag }}
              </el-tag>
              <el-input
                v-show="tags.length < MAX_TAG"
                v-model="inputTag"
                class="input-new-tag"
                size="small"
                placeholder="输入标签"
                @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
              />
            </div>
            <p>输入标签名称，按 回车键 生成标签</p>
          </div>
        </div>
      </div>
    </el-form>

    <div v-if="paltType" class="M-benchmarkAuthDialogFns">
      <el-button @click="onDialogCancel()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onDialogConfirm()">授权</el-button>
    </div>
    <Notice v-if="paltType" />
  </el-dialog>

</template>
<script>
import { mapState } from 'vuex'
import { toOptions, isArray, copy } from '@/components/common'
import { Notice } from 'components'

// 默认媒体服务
const MEDIA_HOST = 'qpmcn-1255305554.cos.ap-beijing.myqcloud.com'

// 授权方式类型映射
const AUTH_WAY_TEXT = {
  '1': '账号登录',
  '4': '手机登录'
}

const DEF_AUTH_MODEL = {
  'user_id': '',
  'belong_name': '',
  'plat_name': '',
  'note': ''
}

// 验证码默认文本
const DEF_SENDCODE_TEXT = '发送验证码'

// 最多添加的 tag 数量
const MAX_TAG = 6

export default {
  'props': {
    'status': {
      'type': Boolean,
      'default': false
    },
    'userid': {
      'type': Number,
      default() {
        return 0
      }
    }
  },
  'computed': {
    ...mapState({
      user(state) {
        return state.auth.user
      }
    })
  },
  components: { Notice },
  data() {
    const MOBILE_REG_EXP = /^1\d{10}$/
    return {
      'model': {},
      'formLabelWidth': '88px',
      'platInfo': [],
      'paltType': null,
      AUTH_WAY_TEXT,
      // 表单验证规则
      'rules': {
        'account_login_name': {
          'required': true, 'message': '登录名称不能为空', 'trigger': 'blur'
        },
        'account_login_password': {
          'required': true, 'message': '密码不能为空', 'trigger': 'blur'
        },
        'user_url': {
          'required': true, 'message': 'URL 不能为空', 'trigger': 'blur'
        },
        'mobile': {
          'required': true,
          'trigger': 'blur',
          validator: (rule, value, callback) => {
            if (!value || value && !value.trim()) {
              callback(new Error('手机号不能为空'))
              return
            }
            if (!MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的手机号'))
              return
            }
            callback()
          }
        },
        'code': {
          'required': true, 'message': '验证码不能为空', 'trigger': 'blur'
        }
      },
      'sendCodeText': DEF_SENDCODE_TEXT,
      'waitingCode': false,
      'listModel': {
      },
      'loading': false,
      'tags': [],
      'inputTag': '',
      MAX_TAG
    }
  },
  'methods': {
  /**
         * 获取授权平台图标
         * @return {String}  图标地址
         */
    getPlatIco() {
      return `http://${MEDIA_HOST}/plat_${this.paltType.val}.png`
    },
    /**
         * 获取授权提示
         * @return {String}  提示文本
         */
    getAuthTip() {
      // 转成字符串好判断些
      // var loginway = String(this.paltType.login_way)
      return '请输入平台下分享出来的链接'
      // 暂时还是保留下面的逻辑
      // switch (true) {
      //     case loginway !== '5' && loginway !== '3':
      //       return '请填写以下信息'

      //     case loginway === '5':
      //       return '请点击授权使用客户端扫码'

      //     case loginway === '3' && [32, 33, 34].indexOf(this.paltType.val) == -1:
      //       return '请输入平台下分享出来的链接'

      //     default:
      //       return '请输入对应用户下分享出来的任意视频链接'
      // }
    },
    /**
         * 检查特定 mrid
         * @return {Boolean} 判断结果
         */
    checkMrid() {
      var user = this.user
      return user.mrid === 3 || user.mrid === 4 || user.mrid === 5
    },
    /**
         * 获取支持的平台
         * @return {Object}  Promise 对象
         */
    getPlats(has_tag = 4) {
      return this.$request({
        'url': '/getUserAccount',
        'query': {
          has_tag
        }
      })
        .then(re => {
          if (re && re.plat_info) {
            this.platInfo = toOptions(
              re.plat_info
              , { 'valKey': 'plat_id', 'textKey': 'plat_name', 'keepOther': true }
            )
            return true
          }
          return false
        })
    },
    /**
         * 授权平台选择响应函数
         * @param {Object} item 选择的平台数据
         */
    onPlatChange(item) {
      if (!isArray(item.login_way)) {
        // 有存在多个授权方式的情况
        item.login_way = item.login_way.split(',')
      }
      this.model.plat_name = item.text
      if (item._defWay === undefined) {
        this.$set(item, '_defWay', item.login_way[0])
      }
    },
    /**
         * 浮层取消响应函数
         */
    onDialogCancel() {
      if (this.$req) {
        try {
          this.$req.abort()
        } catch (e) { console.error(e) }
        this.$req = null
      }
      this.model = {}
      this.paltType = null
      this.tags = []
      this.inputTag = ''
      this.$emit('close')
      this.$emit('update:status', false)
    },
    /**
         * 获取完整的操作接口地址
         * @param  {String}  url  原始地址
         * @return {String}       解析后的完整地址
         */
    getReqUrl(url) {
      // 旧版本的逻辑就是这样子，不要问我为什么，我也不知道
      url = url.split(',')

      // 从 http 模块中构造完整的请求地址
      url = url.map(u => {
        return this.$request.buildUrl(u)
      })

      return url
    },
    /**
         * 浮层确认响应函数
         * @param  {String} type 取消类型
         */
    async onDialogConfirm(type, pass) {
      var form = this.$refs.auth

      // 再做一次表单验证
      var validateResult
      try {
        validateResult = await form.validate()
      } catch (e) {
        validateResult = false
      }
      if (!validateResult) {
        return
      }
      var data = copy(this.model)
      data.note = this.tags.join(',')
      data.plat_id = this.paltType.val
      var re = await this.addAccount(data)

      if (re.code === 1) {
        this.$nextTick(() => {
          // 成功提交后关闭浮层并重置表单
          this.onDialogCancel()
        }, 200)
      } else {
        this.$message.error(re.message)
      }
    },
    /**
         * 添加文章账号
         * @param  {Object}  data  请求参数
         * @return {Object}  Promise 对象
         */
    addAccount(data) {
      if (this.loading) {
        return false
      }
      this.loading = true
      // var way = this.paltType._defWay
      var url = this.getReqUrl(this.paltType.monitor_url)
      url = url[0]

      this.$req = this.$request({
        url,
        'method': 'post',
        data,
        'raw': true
      })
        .then(
          re => {
            this.loading = false
            this.$tip(re.msg || '添加成功', 'success')
            this.$req = null
            this.$emit('auth:add', true)
            return true
          }
          , err => {
            this.loading = false
            this.$req = null
            this.$emit('auth:add', false)
            return false
          }
        )
        .catch(err => {
          this.loading = false
          this.$req = null
          this.$emit('auth:add', false)
          console.error(err)
        })
      return this.$req
    },
    // 删除标签
    handleClose(tag) {
      this.tags.splice(
        this.tags.indexOf(tag), 1
      )
    },
    // 确认标签输入
    handleInputConfirm() {
      if (this.tags.length > MAX_TAG) {
        this.$tip(`最多只能添加 ${MAX_TAG} 个标签`)
        return
      }
      var inputTag = this.inputTag
      if (inputTag && this.tags.indexOf(inputTag) === -1) {
        this.tags.push(inputTag)
      }
      this.inputTag = ''
    }
  },
  'watch': {
    status(nVal, oVal) {
      if (nVal === true) {
        this.getPlats()
          .then(re => {
            if (re) {
              Object.keys(DEF_AUTH_MODEL).forEach(key => {
                let val
                if (key === 'user_id') {
                  val = this.userid || this.user.muid
                } else {
                  val = ''
                }
                this.model[key] = val
              })
            }
          })
      }
    }
  }
}
</script>
