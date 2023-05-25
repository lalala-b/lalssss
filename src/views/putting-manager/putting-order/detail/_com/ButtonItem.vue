<template>
  <div class="btn-item">
    <slot v-if="$slots.title" name="title" />
    <p v-else class="btn-item_tip">{{ title }}</p>
    <div class="m-t-24">
      <el-tooltip
        v-if="isDisabled"
        v-log
        placement="top"
        content="该账号已被拉黑，详情请咨询中台同事!"
      >
        <el-button class="btn-pass" icon="el-icon-check">通过</el-button>
      </el-tooltip>
      <el-button v-else :loading="loading" type="success" icon="el-icon-check" @click="$emit('success')">通过</el-button>
      <el-button :loading="loading" type="danger" icon="el-icon-close" @click="$emit('reject')">驳回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    isDisabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss" scoped>
  .btn-item {
    &_tip {
      margin-top: 20px;
      font-size: 16px;
      color: #272727;
      line-height: 22px;
    }
  }
  .btn-pass{
    background: #94e6c6;
    color: #FFF;
    border: 1px solid #94e6c6;
  }
  .btn-pass:hover{
     background: #94e6c6;
     color: #FFF;
     border: 1px solid #94e6c6;
  }
</style>
