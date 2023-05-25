<template>
  <div class="no-data">
    <i class="iconfont iconempty-folder" />
    <div class="no-data-txt">
      <p>很抱歉，你没有该内容的查看权限</p>
      <p>先看看其他模块吧</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    code: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding-bottom: 32px;
  ::v-deep .iconempty-folder {
    font-size: 82px;
    color: #afafaf;
    margin-bottom: 12px;
  }
  &-txt {
    font-size: 14px;
    color: #afafaf;
  }
}
</style>
