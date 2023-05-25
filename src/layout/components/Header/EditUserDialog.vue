<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-11-02 14:53:28
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="add-user-dialog"
      :modal-append-to-body="false"
      title="修改用户"
      width="600px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-suffix="：">

          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" autocomplete="new-password" />
          </el-form-item>
          <el-form-item label="密码" prop="password" :class="{'hidden-error': showTip}">
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
              <li><i :class="!checkPass ? 'el-icon-success': 'el-icon-warning'" /> 必须包含字母、数字、符号中至少2种</li>
            </ul>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="save">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 组织架构选择弹框 -->
    <organizeSelect v-if="organizeVisible" v-model="organizeVisible" @save="onOrganizeEdit" />
  </div>
</template>
<script>
import organizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { $editBaseInfo } from '@/api/backend-manage'

const FORM = {
  mobile: '',
  password: ''
}

export default {
  components: { organizeSelect },
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default: null
    }
  },
  data() {
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
    return {
      form: { ...FORM },
      organizeVisible: false,
      loading: false,
      showTip: false,
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        password: [
          { required: true, validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
     checkPass: function() {
      return (this.form.password.match(/\d/) ? 1 : 0) + (this.form.password.match(/[a-z]/i) ? 1 : 0) + (this.form.password.match(/[^\da-zA-Z\s]/) ? 1 : 0) < 2
    }
  },
  created() {
    if (this.data) {
      this.updateForm(this.data)
      this.form.isleader = !!this.form.isleader
    }
  },
  methods: {
    updateForm(data) {
      for (const key in this.form) {
        this.form[key] = data[key]
      }
    },
    save() {
      if (this.loading) {
        return
      }
      console.log(this.$store.state)
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const { id, orgId } = this.$store.state.user.userInfo
          const params = { ...this.form, id, orgId }
          // params.isleader = params.isleader ? 1 : 0
          $editBaseInfo(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success('保存成功')
                this.$emit('input', false)
                this.$emit('update')
              } else {
                this.$message.error('保存失败')
              }
              this.loading = false
            })
        }
      })
    }
  }
}
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
</style>
