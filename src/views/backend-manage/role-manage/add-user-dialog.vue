<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-12-29 16:46:22
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
        <el-form ref="form" :model="form" :rules="rules" label-width="115px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" maxlength="20" show-word-limit />
          </el-form-item>
          <el-form-item label="角色code" prop="code">
            <el-input v-model="form.code" maxlength="30" show-word-limit />
          </el-form-item>
          <el-form-item label="角色类型" prop="roleTypeId">
            <el-radio-group v-model="form.roleTypeId">
              <template v-for="item in typeDatas">
                <el-radio :key="item.roleTypeId" :label="item.roleTypeId">{{
                  item.roleTypeName
                }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色归属" prop="attributionId">
            <el-radio-group v-model="form.attributionId">
              <template v-for="item in attributionDatas">
                <el-radio :key="item.attributionId" :label="item.attributionId">{{
                  item.attributionName
                }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="数据域标志" prop="datascopeFlag">
            <el-radio v-model="form.datascopeFlag" :label="0">无</el-radio>
            <el-radio v-model="form.datascopeFlag" :label="1">有</el-radio>
          </el-form-item>
          <el-form-item label="角色有效期">
            <el-date-picker
              v-model="form.effectiveDay"
              type="date"
              placeholder="请选择角色有效期"
              value-format="yyyy-MM-dd"
            />

          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              type="textarea"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          <!-- <el-form-item label="菜单绑定" prop="menuNameList">
            <p v-if="form.menuNameList">已选择<b>{{ form.menuNameList.join(',') }}</b></p>
            <el-button size="small" @click="showRole">菜单选择</el-button>
          </el-form-item> -->
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button
          :loading="loading"
          type="primary"
          @click="save"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 选择弹框 -->
    <RoleDialog
      v-if="roleVisible"
      v-model="roleVisible"
      :selected-ids="form.menuIdList"
      @save="onRoleSave"
    />
  </div>
</template>
<script>
// import RoleDialog from './select-role-dialog.vue'
import { $addRole, $updateRole } from '@/api/backend-manage'
import dayjs from 'dayjs'
const FORM = {
  name: '',
  code: '',
  remark: '',
  datascopeFlag: 0,
  effectiveDay: '',
  roleTypeId: '',
  attributionId: '',
  menuIdList: null,
  menuNameList: null
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
    },
    attributionDatas: {
       type: Array,
       default() {
        return []
      }
    },
    typeDatas: {
       type: Array,
       default() {
        return []
      }
    }
  },
  data() {
    const validateMenu = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择绑定的菜单'))
      } else {
        callback()
      }
    }
    return {
      form: { ...FORM },
      roleVisible: false,
      loading: false,
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色code', trigger: 'blur' }
        ],
        menuNameList: [
          { required: true, validator: validateMenu, trigger: 'change' }
        ]
      },
      roleTypeList: [
        { labe: 1, value: 1 },
        { labe: 2, value: 2 }
      ]
    }
  },
  created() {
    // 设置有效期默认值
    this.form.effectiveDay = dayjs().add(10, 'year').format('YYYY-MM-DD')
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
      this.form.effectiveDay = this.form.effectiveDay && isNaN(this.form.effectiveDay) ? this.form.effectiveDay : dayjs().add(10, 'year').format('YYYY-MM-DD')
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
