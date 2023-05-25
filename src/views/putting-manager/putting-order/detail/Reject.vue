<template>
  <div>
    <p class="reject-tip">驳回后订单将返回由申请人重新填写！</p>
    <el-form
      class="m-t-10"
      label-width="80px"
      label-position="left"
      label-suffix="："
    >
      <el-form-item class="is-required" label="备注">
        <el-input v-model="note" type="textarea" placeholder="驳回原因" maxlength="50" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    note: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }

}
</script>
<style lang="scss" scoped>
  .reject-tip {
    margin-top: 20px;
    font-size: 16px;
    color: #272727;
    line-height: 22px;
  }
</style>
