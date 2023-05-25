<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-25 10:57:29
 * @LastEditTime: 2020-11-20 17:49:41
 * @LastEditors: Linjie
-->
<template>
  <div>
    <el-dialog
      class="add-user-dialog"
      :title="`${data ? '修改' : '添加'}`"
      width="600px"
      :visible="value"
      @close="$emit('input', false)"
    >
      <div class="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="120px">
          <el-form-item label="SQL类型" prop="typeSql">
            <el-radio-group v-model="form.typeSql">
              <el-radio-button label="公共">公共</el-radio-button>
              <el-radio-button label="私有">私有</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="scope返回值" prop="scopeValue">
            <!-- <el-input v-model="form.scopeValue" /> -->
            <el-select v-model="form.scopeValue" style="width: 100%">
              <el-option v-for="(item, index) in dictTypeResponse.sys_datascope_value_type" :key="index" :label="item.dictLabel" :value="item.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据域标志" prop="datascope">
            <!-- <el-input v-model="form.datascope" /> -->
            <el-select v-model="form.datascope" style="width: 100%">
              <el-option v-for="(item, index) in dictTypeResponse.sys_datascope_flag" :key="index" :label="item.dictLabel" :value="item.dictValue" />
            </el-select>
          </el-form-item>
          <el-form-item label="数据域SQL" prop="scopeSql">
            <el-input v-model="form.scopeSql" type="textarea" :rows="11" />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark" type="textarea" :rows="2" />
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button v-loading="loading" type="primary" @click="save">确 定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
import { $updateDatascopeSql, $addDatascopeSql } from '@/api/backend-manage'

const FORM = {
  id: '',
  scopeValue: '',
  datascope: '',
  scopeSql: '',
  remark: '',
  typeSql: '公共'
}

export default {
  props: {
    value: {
      type: Boolean
    },
    data: {
      type: Object,
      default: null
    },
    dictTypeResponse: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { ...FORM },
      organizeVisible: false,
      loading: false,
      rules: {
        scopeValue: [
          { required: true, message: '请输入scope返回值', trigger: 'blur' }
        ],
        datascope: [
          { required: true, message: '请输入数据域标志建立唯一索引', trigger: 'blur' }
        ],
        scopeSql: [
          { required: true, message: '请输入数据域SQL', trigger: 'blur' }
        ]
      }
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
        if (key === 'email') {
          this.form[key] = (this.form[key] || '').replace('@zhuanzhuan.com', '')
        }
      }
    },
    /**
     * 修改部门
     */
    onOrganizeEdit(org) {
      this.form.orgId = org.id
      this.form.orgName = org.orgName
      this.organizeVisible = false
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
          const params = this.form
          const request = this.data ? $updateDatascopeSql : $addDatascopeSql
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
