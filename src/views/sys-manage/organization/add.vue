<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:30:12
 * @LastEditTime: 2020-10-26 22:25:28
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="添加子级"
    :visible.sync="value"
    :before-close="close"
    width="30%"
    class="C-organization-add"
  >
    <el-form ref="form" :rules="rules" :model="form" style="width: 100%;">
      <el-form-item label="组织名" prop="orgName">
        <el-input v-model="form.orgName" maxlength="10" style="width: 100%;" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="组织说明">
        <el-input v-model="form.remark" type="textarea" style="width: 100%;" maxlength="50" show-word-limit clearable />
      </el-form-item>
      <el-form-item label="数据域对标">
        <el-select v-if="data.curr.children" v-model="form.dataScopeOrgId">
          <el-option v-for="(item) in data.curr.children" :key="item.id" :value="item.id" :label="item.orgName" />
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $addOrganizationInfo } from '@/api/backend-manage'

const FROM_MODEL = {
  orgName: '',
  remark: '',
  dataScopeOrgId: ''
}

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: { ...FROM_MODEL },
      rules: {
        orgName: [{
          required: true,
          message: '请输入组织名',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    console.log(this.data)
  },
  methods: {
  /**
     * 保存
     */
    async save() {
      var validateResult
      try {
        validateResult = await this.$refs.form.validate()
      } catch (e) {
        validateResult = false
      }
      if (!validateResult) {
        return
      }
      const { orgName, remark, dataScopeOrgId } = this.form
      const params = {
        orgName,
        remark,
        dataScopeOrgId
      }
      if (this.data && this.data.curr) {
        params.parentId = this.data.curr.id
      }
      $addOrganizationInfo(params)
        .then(re => {
          if (re.code === 1) {
            this.$emit('input', false)
            this.$emit('updateTree', false)
            this.$refs.form.resetFields()
          }
        })
    },
    reset() {
      for (const key in this.config) {
        this.config[key].value = ''
      }
    },
    close() {
      this.$emit('input', false)
      this.reset()
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
  .C-organization-add {
    ::v-deep .el-form-item {
      display: flex;
      .el-form-item__label {
        width: 100px;
      }
      .el-form-item__content {
        flex: 1;
      }
    }
  }
</style>
