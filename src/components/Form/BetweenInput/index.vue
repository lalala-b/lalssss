<template>
  <div class="between-input">
    <input v-model="min" class="el-input__inner" :placeholder="startPlaceholder" @blur="handleBlur">
    <input class="el-input__inner between-input__split" disabled :placeholder="rangeSeparator" style="width:30px">
    <input v-model="max" class="el-input__inner" :placeholder="endPlaceholder" @blur="handleBlur">
  </div>
</template>
<script>
export default {
  name: 'BetweenInput',
  props: {
    startPlaceholder: {
      type: String,
      default: '最小值'
    },
    endPlaceholder: {
      type: String,
      default: '最大值'
    },
    rangeSeparator: {
      type: String,
      default: '~'
    },
    value: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      min: null,
      max: null
    }
  },
  created() {
    this.timer = null
    if (this.value.length > 0) {
      this.min = this.value[0]
      this.max = this.value[1]
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  methods: {
    handleBlur() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.$emit('input', [this.min, this.max])
      }, 500)
    }
  }
}
</script>
<style lang="scss" scoped>
  .between-input {
    display: flex;
    > input {
      width: 126px;
      padding: 5px 12px;
      margin-right: -1px;
      text-align: center;

      &:last-child {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-left-width: 0;
        &:hover, &:focus {
          border-left-width: 1px;
        }
      }
      &:first-child {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        &:hover, &:focus {
          z-index: 1;
        }
      }
      box-sizing: border-box;
    }
    &__split{
      padding: 0;
      text-align: center;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
    }

  }
</style>
