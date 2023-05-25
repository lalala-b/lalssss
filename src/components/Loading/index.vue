<template>
  <div class="loading-wrap">
    <i class="el-icon-loading m-r-5" />  <span class="loading" :data-content="text">{{ text }}</span>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '拼命加载中...'
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  min-height: 100px;
  font-size: 20px;
  color: #000;
}
.loading {
  position: relative;
  color: hsla(0,0%,0%,.3);
  &::before {
    content: attr(data-content);
    position: absolute;
    white-space: nowrap;
    height: 100%;
    overflow: hidden;
    max-width: 100%;
    color: black;
    // background-image: -webkit-linear-gradient(right, rgb(253, 119, 30), rgb(194, 202, 75));
    // -webkit-background-clip: text;
    // -webkit-text-fill-color: transparent;
    animation: loading 2s linear infinite;
  }
}
@keyframes loading {
  from { max-width: 0; }
}
</style>
