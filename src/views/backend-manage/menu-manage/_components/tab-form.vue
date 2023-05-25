<template>
  <el-form ref="form" :inline="true" :model="form" label-width="90px">
    <el-form-item label="角色名称">
      <el-input v-model="form.roleName" maxlength="30" show-word-limit clearable />
    </el-form-item>
    <el-form-item label="角色类型">
      <el-radio-group v-model="form.typeId">
        <el-radio-button :label="1">特殊</el-radio-button>
        <el-radio-button :label="3">海盗</el-radio-button>
        <el-radio-button :label="5">乾派</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <slot :row="form" />
    <el-form-item label="">
      <el-button size="small" type="primary" @click="handleSearch">搜索</el-button>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      form: {
        roleName: '',
        typeId: null
      }
    }
  },
  created() {
    if (this.config && typeof this.config === 'object') {
      for (const key in this.config) {
        this.$set(this.form, key, this.config[key])
      }
    }
  },
  methods: {
    handleSearch() {
      this.$emit('save', this.form)
    },
    reset() {
      this.form = {
        roleName: '',
        typeId: null
      }
    }
  }
}
</script>
