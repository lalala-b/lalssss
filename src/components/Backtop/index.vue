<template>
  <el-backtop :target="target" class="m-backtop" :class="{'m-backtopSmallRound': type === 'smallRound'}" :bottom="bottom" :right="right" :visibility-height="visibilityHeight">
    <div>UP</div>
  </el-backtop>
</template>
<script>
export default {
  name: 'Backtop',
  props: {
    bottom: {
      type: Number,
      default: 40
    },
    right: {
      type: Number,
      default: 40
    },
    visibilityHeight: {
      type: Number,
      default: 50
    },
    target: {
      type: String,
      default: 'body'
    },
    type: {
      type: String,
      default: 'round'
    }
  }
}
</script>
<style lang="scss">
.m-backtop {
  &SmallRound {
    border-radius: 2px;
  }
}
</style>
