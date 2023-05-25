<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:30:12
 * @LastEditTime: 2020-11-27 11:06:46
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="取消订单"
    :visible="value"
    :before-close="close"
    width="520px"
  >
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="选择角色" prop="roleIdList" style="margin-bottom: 0;" />
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import { $getRoleList, $bindRoleForMenu } from '@/api/backend-manage'

const FROM_MODEL = {
  roleIdList: null
}

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateMenu = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请选择角色'))
      } else {
        callback()
      }
    }
    return {
      form: { ...FROM_MODEL },
      options: [],
      rules: {
        roleIdList: [{
          required: true,
          validator: validateMenu,
          trigger: 'change'
        }]
      }
    }
  },
  computed: {
    ...mapState('menuManage', {
      id: state => state.editData.id
    })
  },
  created() {
    if (this.data) {
      const { data } = this
      this.form = {
        id: data.id,
        icon: data.icon,
        code: data.code,
        type: data.type || 1,
        pid: data.pid,
        name: data.name,
        remark: data.remark
      }
    }
    this.getRoleList()
  },
  methods: {
    ...mapActions('menuManage', [
      'updateData'
    ]),
    async getRoleList() {
      try {
        const res = await $getRoleList({ size: 10000 })
        if (res.code === 1) {
          this.options = res.data
        }
      } catch (err) {
        this.$message.error(err)
      }
    },
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
      try {
        const res = await $bindRoleForMenu({
          menuId: this.id,
          roleIdList: this.form.roleIdList
        })
        if (res.code === 1) {
          this.$message.success(res.message || '操作成功')
          this.close()
          this.updateData(this.id)
        } else {
          this.$message.error(res.message || '网络错误')
        }
      } catch (err) {
        console.log(err)
      }
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
