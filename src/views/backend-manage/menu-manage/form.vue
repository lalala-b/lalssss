<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:30:12
 * @LastEditTime: 2020-12-29 15:11:02
 * @LastEditors: Linjie
-->
<template>
  <el-form
    ref="form"
    :inline="inline"
    :rules="rules"
    :model="form"
    label-width="90px"
  >
    <el-form-item label-width="105px" label="是否一级菜单" prop="parentFlag">
      <el-switch
        v-model="form.parentFlag"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="菜单名称" prop="name">
      <el-input
        v-model="form.name"
        maxlength="20"
        show-word-limit
        clearable
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="菜单code" prop="code">
      <el-input
        v-model="form.code"
        maxlength="50"
        show-word-limit
        clearable
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="菜单归属" prop="type">
      <el-radio-group v-model="form.menuBelong">
        <el-radio :label="0">公共</el-radio>
        <el-radio :label="1">海盗</el-radio>
        <el-radio :label="2">乾派</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="菜单类型" prop="type">
      <el-radio-group v-model="form.type">
        <el-radio :label="1">菜单</el-radio>
        <el-radio :label="2">按钮</el-radio>
        <el-radio :label="3">组件</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="菜单icon" prop="icon">
      <el-input
        v-model="form.icon"
        maxlength="20"
        show-word-limit
        clearable
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item
      label="菜单路径"
      prop="path"
      :required="+form.type === 1 ? true : false"
    >
      <el-input
        v-model="form.path"
        maxlength="50"
        show-word-limit
        clearable
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item label="quick Bi链接" label-width="98px" prop="url">
      <el-input
        v-model="form.url"
        show-word-limit
        clearable
        style="width: 292px"
      />
    </el-form-item>
    <el-form-item label="菜单是否迁移" prop="isMoveted" label-width="115px">
      <el-switch v-model="form.isMoveted" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <el-form-item label="菜单是否隐藏" prop="hidden" label-width="125px">
      <el-switch v-model="form.hidden" :active-value="1" :inactive-value="0" />
    </el-form-item>
    <el-form-item v-if="type==='add'" label="是否同步父级角色" label-width="130px">
      <el-switch
        v-model="form.extendRoleFlag"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="数据域字段标志" prop="type" label-width="120px">
      <el-switch
        v-model="form.datascopeFlag"
        :active-value="1"
        :inactive-value="0"
      />
    </el-form-item>
    <el-form-item label="数据域字段" prop="type">
      <el-select v-model="form.datascope">
        <el-option
          v-for="(item, index) in $dictType"
          :key="index"
          :value="item.dictValue"
          :label="item.dictLabel"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="form.remark"
        type="textarea"
        maxlength="50"
        show-word-limit
        clearable
        style="width: 300px"
      />
    </el-form-item>
    <el-form-item>
      <slot />
    </el-form-item>
  </el-form>
</template>
<script>
import { mapState } from 'vuex'

const FROM_MODEL = {
  name: '',
  icon: '',
  type: 1,
  datascopeFlag: false,
  datascope: '',
  code: '',
  remark: '',
  extendRoleFlag: 0,
  hidden: 0,
  parentFlag: 0,
  url: '',
  menuBelong: 0,
  isMoveted: 0
}

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    }
  },
  inject: ['$dictType'],
  data() {
    const validPath = (rule, value, callback) => {
      if (+this.form.type === 1 && !value) {
        return callback(new Error('请输入菜单路径'))
      } else {
        return callback()
      }
    }
    return {
      form: { ...FROM_MODEL },
      rules: {
        name: [
          {
            required: true,
            message: '请输入菜单名称',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '请输入菜单code',
            trigger: 'blur'
          }
        ],
        // icon: [{
        //   required: true,
        //   message: '请输入菜单icon',
        //   trigger: 'blur'
        // }],
        // path: [{
        //   // required: true,
        //   message: '请输入菜单路径',
        //   trigger: 'blur'
        // }]
        path:
          { validator: validPath, message: '请输入菜单路径', trigger: 'blur' }
        // componentName: [{
        //   required: true,
        //   message: '请输入菜单componentName',
        //   trigger: 'blur'
        // }]
      }
    }
  },
  computed: {
    ...mapState('menuManage', ['editData'])
  },
  watch: {
    editData() {
      const { editData } = this
      this.form = {
        id: editData.id,
        icon: editData.icon,
        code: editData.code,
        type: editData.type || 1,
        datascopeFlag: editData.datascopeFlag,
        datascope: editData.datascope,
        pid: editData.pid,
        name: editData.name,
        url: editData.url,
        path: editData.path,
        remark: editData.remark,
        hidden: editData.hidden,
        parentFlag: editData.parentFlag,
        extendRoleFlag: editData.extendRoleFlag,
        menuBelong: editData.menuBelong,
        isMoveted: editData.isMoveted
      }
    }
  },
  created() {},
  methods: {
    validate() {
      return this.$refs.form.validate()
    }
  }
}
</script>
