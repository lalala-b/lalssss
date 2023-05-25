<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-21 14:30:12
 * @LastEditTime: 2020-10-26 22:25:28
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    title="添加菜单"
    :visible.sync="value"
    :before-close="close"
    width="900px"
  >
    <mForm ref="formComponent" :data="form" type="add" />
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import { $addMenu } from '@/api/backend-manage'
import mForm from './form.vue'

const FROM_MODEL = {
  name: '',
  icon: '',
  type: 1,
  code: '',
  remark: ''
}

export default {
  components: { mForm },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    addData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      form: { ...FROM_MODEL }
    }
  },
  computed: {
    ...mapState('menuManage', {
      id: (state) => state.editData.id
    })
  },
  created() {},
  methods: {
    /**
     * 保存
     */
    async save() {
      try {
        const { form = {}} = this.$refs.formComponent
        // (1)组件不能插入菜单
        // (2)按钮不能插入菜单和组件
        if (+this.addData.type === 3 && +form.type === 1) {
          this.$message.error('组件中禁止新建菜单')
          this.getMenuTree()
          return
        }
        if (+this.addData.type === 2) {
          this.$message.error('按钮禁止新建菜单、组件、按钮')
          this.getMenuTree()
          return
        }
        await this.$refs.formComponent.validate()
      } catch (e) {
        return
      }

      const params = this.$refs.formComponent.form
      params.optType = 'add'
      params.pid = this.id
      const res = await $addMenu(params)
      if (res.code === 1) {
        this.$message.success(res.message)
        this.close()
        this.$emit('updateTree')
        this.$emit('createRoute', {
          routeCode: params.code,
          routeName: params.name
        })
      } else {
        this.$message.error(res.message || '网络错误')
      }
    },
    close() {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  ::v-deep {
    .el-form-item {
      width: 50%;
    }
    .el-form-item:first-child {
      width: 100% !important;
    }
  }
}
</style>
