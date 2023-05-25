<template>
  <el-tooltip
    v-if="type==='tooltip'"
    v-bind="$attrs"
    :placement="$attrs.placement || 'top'"
  >
    <span
      class="tooltip-label flex-inline"
      v-on="$listeners"
    ><span v-if="label">{{ label }}</span><i class="iconfont" type="primary" :class="iconClass" /></span>
    <template slot="content">
      <slot />
    </template>

  </el-tooltip>
  <el-popover
    v-else
    v-bind="$attrs"
    :width="$attrs.width || '240'"
    trigger="hover"
    :placement="$attrs.placement || 'top'"
  >
    <slot />
    <span slot="reference" class="tooltip-label flex-inline flex-align-center"><span v-if="label" :class="labelClass">{{ label }}</span><i class="iconfont" :class="iconClass" /></span>
  </el-popover>
</template>
<script>
import { isArray } from '@/utils'
export default {
  props: {
    type: {
      type: String,
      default() {
        return 'tooltip'
      }
    },
    label: {
      type: String,
      default() {
        return ''
      }
    },
    labelClass: {
      type: String,
      default: ''
    },
    iconClass: {
      type: String,
      default: ''
    }
  },
  methods: {
    isArray(t) {
      return isArray(t)
    }
  }
}
</script>
<style lang="scss" scoped>
  .tooltip-label {
    color: inherit;

    cursor: pointer;
     > span {
      margin-right: 4px;
    }
  }
  .el-form-item {
    .tooltip-label {
      > span {
        margin-right: 0;
      }
    }
    .iconfont {
      margin-left: 4px;
    }
  }

  .iconfont {
    color: inherit;
    font-size: inherit;
    cursor: pointer;
  }
</style>
