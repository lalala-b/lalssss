<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-30 11:17:46
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="add-user-dialog"
      :title="`${data ? '修改' : '添加'}用户`"
      width="600px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="登录名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="真实名字" prop="realname">
            <el-input v-model="form.realname" />
          </el-form-item>
          <el-form-item label="名字大写简称" prop="realnameUppercase">
            <el-input v-model="form.realnameUppercase" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email">
              <template slot="append">@zhuanzhuan.com</template>
            </el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="form.mobile" />
          </el-form-item>
          <!-- <el-form-item label="是否为leader">
            <el-switch v-model="form.isleader" />
          </el-form-item> -->
          <el-form-item label="用户类型" prop="userType">
            <el-select v-model="form.userType">
              <el-option label="内部用户" :value="1" />
              <el-option label="外部用户" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="data" label="登录状态" prop="userType">
            <el-select v-model="form.userStatus">
              <el-option label="禁止" :value="0" />
              <el-option label="正常" :value="1" />
            </el-select>
          </el-form-item>
          <el-form-item label="组织选择" prop="orgId">
            <el-input v-model="form.orgId" style="display: none" type="hidden" />
            <p v-if="form.orgName">已选择<b>{{ form.orgName }}</b></p>
            <el-button size="small" @click="showOrganize">组织选择</el-button>
            <p v-if="hasOrgChange" class="el-form-item__error">用户组织调整一旦确认，后续计算的军功归属也随之调整。</p>
          </el-form-item>
          <el-form-item v-if="form.orgName" label="角色选择" prop="roles">
            <el-select v-model="form.roles" :multiple="true">
              <el-option v-for="item in roleList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="save">确 定</el-button>
      </span>

    </el-dialog>
    <!-- 组织架构选择弹框 -->
    <organizeSelect v-if="organizeVisible" v-model="organizeVisible" :org-id="form.orgId" @save="onOrganizeEdit" />
  </div>
</template>
<script>
import organizeSelect from '@/components/Dialog/OrganizeSelect.vue'
import { $addUser2, $updateUserInfo, $getUserRoleByOrgId } from '@/api/backend-manage'

const FORM = {
  id: '',
  name: '',
  email: '',
  mobile: '',
  // isleader: 0,
  realname: '',
  realnameUppercase: '',
  userType: '',
  orgId: '',
  orgName: '',
  userStatus: '',
  roles: ''
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
    return {
      form: { ...FORM },
      organizeVisible: false,
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' }
        ],
        realname: [
          { required: true, message: '请输入真实名字', trigger: 'blur' }
        ],
        realnameUppercase: [
          { required: true, message: '请输入名字大写简称', trigger: 'blur' }
        ],
        userType: [
          { required: true, message: '请选择用户类型', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择组织', trigger: 'change' }
        ],
        roles: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      roleList: [],
      hasOrgChange: false
    }
  },
  created() {
    if (this.data) {
      this.updateForm(this.data)
      // this.form.isleader = !!this.form.isleader
    }
  },
  methods: {
    updateForm(data) {
      for (const key in this.form) {
        this.form[key] = data[key]
        if (key === 'email') {
          this.form[key] = (this.form[key] || '').replace('@zhuanzhuan.com', '')
        }
        if (key === 'orgId' && data[key]) {
          this.getUserRoleByOrgId(data[key])
        }
      }
    },
    /**
     * 修改部门
     */
    async onOrganizeEdit(org) {
      if (this.form.orgId !== org.id && org.orgType === 1) {
        this.hasOrgChange = true
      }
      this.form.orgId = org.id
      this.form.orgName = org.orgName
      this.organizeVisible = false
      this.form.roles = []
      const roleList = await this.getUserRoleByOrgId(org.id)
      if (roleList.length > 0) {
        this.form.roles = [roleList[0].roleId]
      }
    },
    getUserRoleByOrgId(orgId = '') {
      return new Promise((resolve, reject) => {
        $getUserRoleByOrgId({ orgId }).then(res => {
          if (res.code === 1) {
            this.roleList = res.data
            resolve(res.data)
          } else {
            reject()
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          reject()
        })
      })
    },
    showOrganize() {
      this.organizeVisible = true
    },
    save() {
      if (this.loading) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          params.email = params.email.trim() + '@zhuanzhuan.com'
          // params.isleader = params.isleader ? 1 : 0
          const request = params.id ? $updateUserInfo : $addUser2
          request(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success('保存成功')
                this.$emit('input', false)
                this.$emit('update')
              } else {
                this.$message.error(res.message || '保存失败')
              }
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
