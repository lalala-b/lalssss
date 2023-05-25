<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-23 14:32:45
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="add-user-dialog"
      :title="`${data ? '修改' : '添加'}角色`"
      width="600px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="100px">
          <el-form-item label="datascopeSqlId" prop="datascopeSqlId">
            <el-input v-model="form.datascopeSqlId" show-word-limit />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择弹框 -->
    <RoleDialog v-if="roleVisible" v-model="roleVisible" :selected-ids="form.menuIdList" @save="onRoleSave" />
  </div>
</template>
<script>
// import RoleDialog from './select-role-dialog.vue'
import { $addRole, $updateRole } from '@/api/backend-manage'

const FORM = {
  datascopeSqlId: ''
}

export default {
  // components: { RoleDialog },
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
    // const validateMenu = (rule, value, callback) => {
    //   if (!value || value.length === 0) {
    //     callback(new Error('请选择绑定的菜单'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      form: { ...FORM },
      roleVisible: false,
      loading: false,
      rules: {
        datascopeSqlId: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.data) {
      this.updateForm(this.data)
    }
  },
  methods: {
    /**
     * 保存弹框回调
     */
    onRoleSave(list) {
      const ids = []; const names = []
      list.forEach(t => {
        ids.push(t.id)
        names.push(t.name)
      })
      this.form.menuIdList = ids
      this.form.menuNameList = names
      this.$refs.form.validateField('menuNameList')
    },
    updateForm(data) {
      for (const key in data) {
        if (key === 'menuBOList') {
          if (!data[key]) {
            continue
          }
          const ids = []; const names = []
          data[key].forEach(t => {
            ids.push(t.menuId)
            names.push(t.menuName)
          })
          this.form.menuIdList = ids
          this.form.menuNameList = names
        } else {
          this.form[key] = data[key]
        }
      }
    },
    showRole() {
      this.roleVisible = true
    },
    save() {
      if (this.loading) {
        return
      }
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          const params = { ...this.form }
          const request = this.data ? $updateRole : $addRole
          if (this.data) {
            params.updateType = 1
          }
          request(params)
            .then(res => {
              if (res.code === 1) {
                this.$message.success('保存成功')
                this.$emit('input', false)
                this.$emit('update')
              } else {
                this.$message.error(res.message || '网络错误')
              }
              this.loading = false
            })
        }
      })
    }
  }
}
</script>
