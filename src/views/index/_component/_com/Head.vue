<template>
  <div class="flex flex-justify-between flex-align-center">
    <h3 data-bold>{{ title }}
      <IconTip v-if="tip" placement="top" type="popover" icon-class="iconwenhao" :content="tip" />
    </h3>
    <el-link
      v-if="showMore"
      class="flex flex-align-center"
      :underline="false"
      type="primary"
      @click="handleClick"
    >查看更多<i class="iconfont iconyou" /></el-link>
  </div>
</template>
<script>
import { IconTip } from 'components'
export default {
  components: { IconTip },
  props: {
    title: {
      type: String,
      default: ''
    },
    hasActive: {
      type: Boolean,
      default: true
    },
    tip: {
      type: String,
      default: ''
    },
    showMore: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    showMore: {
      handler(val) {
        console.log(val)
      },
      immediate: true
    }
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
<style lang="scss" scoped>
  h3 {
    line-height: 1;
    color: #272727;
    font-weight: 500;
    font-size: 16px;
  }
  ::v-deep {
    .iconwenhao {
      font-size: inherit;
      &:hover {
        color: $--color-primary;
      }
    }
  }
  .iconyou {
    font-size: 14px;
  }
</style>
