<template>
  <el-input v-model="num" v-bind="$attrs" onkeyup="value=value.replace(/[^\d]/g, '')"></el-input>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'

export default defineComponent({
  props: {
    value: {
      type: Number | String,
      default: null
    },
    max: {
      type: Number | String,
      default: null
    }
  },
  setup(props, {emit}) {
    const getMidNum = (str, start, len) => {
      if (start + len > 0) {

        return +str.substr(start < 0 ? 0 : start, start < 0 ? start + len : len)
      } else {
        return 0
      }
    }

    const bigNumCompare = (a, b) => {
      let back = 0
      let max = Math.ceil(Math.max(a.length, b.length) / 15)
      //分成多少段,从左边开始
      for (let i = max; i > 0; i--) {
        let num1 = getMidNum(a, a.length - i * 15, 15)
        let num2 = getMidNum(b, b.length - i * 15, 15)
        //15位数字相减
        let cur = num1 - num2
        if (cur < 0) {
          back = -1
          break
        } else if (cur > 0) {
          back = 1
          break
        }
      }
      return back
    }

    const num = computed({
      get() {
        return props.value
      },
      set(value) {
        if (bigNumCompare(String(value), String(props.max)) > 0 && props.max) {
          emit('input', props.max)
        } else {
          emit('input', value.replace(/[^\d]/g, ''))
        }
      }
    })
    return {
      num
    }
  },
})
</script>
