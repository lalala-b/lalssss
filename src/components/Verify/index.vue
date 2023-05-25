<template>
  <div class="flex">
    <l-number v-model="verificationCode" :maxlength="maxlength" placeholder="请输入验证码" />
    <el-button
      class="get-captcha"
      :class="{ 'get-captcha-disabled': countDownNum> 0}"
      type="text"
      :disabled="countDownNum > 0"
      @click="handleGetCaptch"
    >{{ captchaText }}</el-button>
  </div>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import { useCountDown } from './hook'
export default defineComponent({
  props: {
    value: Number | String,
    defaultNum: {
      type: Number,
      default: 60
    },
    maxlength: Number
  },
  setup(props, { emit }) {
    const { captchaText, getCaptcha, countDownNum, hasClicked, stopCountDown } = useCountDown(props.handleGetCaptcha, props.defaultNum)
    const verificationCode = computed({
      get() {
        return props.value
      },
      set(value) {
        return emit('input', value)
      }
    })
    const handleGetCaptch = () => {
      emit('handleGetCaptch', (isStop = false) => {
        if (isStop) stopCountDown()
        else getCaptcha()
      })
    }
    return {
      hasClicked,
      countDownNum,
      verificationCode,
      handleGetCaptch,
      captchaText
    }
  }
})
</script>

<style lang="scss" scoped>

  .get-captcha {
    display: inline-block;
    width: 102px;
  }
</style>
