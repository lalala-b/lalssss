import { computed, ref } from '@vue/composition-api'
import { isFunction } from '@/utils'
export const useCountDown = (callbreck, defaultNum = 60) => {
  const countDownNum = ref(0)
  const hasClicked = ref(false)
  let timer

  const countDown = (num) => {
    --num
    countDownNum.value = num
    timer = setTimeout(() => {
      if (num > 0) {
        countDown(num)
      }
    }, 1000)
  }

  const stopCountDown = () => {
    clearTimeout(timer)
    countDownNum.value = 0
  }

  const getCaptcha = () => {
    if (countDownNum.value > 0) {
      return
    }
    isFunction(callbreck) && callbreck()
    hasClicked.value = true
    countDown(defaultNum)
  }

  const captchaText = computed(() => {
    return countDownNum.value > 0
      ? `已发送 ${countDownNum.value}s`
      : hasClicked.value ? '重新发送' : '发送验证码'
  })

  return {
    hasClicked,
    captchaText,
    getCaptcha,
    countDownNum,
    stopCountDown
  }
}
