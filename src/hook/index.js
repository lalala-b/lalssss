import { isUndef } from '@/utils'
import { computed, getCurrentInstance } from '@vue/composition-api'

/**
 * v-model控制子组件的显示隐藏
 * @param {*} props
 * @param {*} emit
 */
export const useToggle = function(props) {
  const { emit } = getCurrentInstance()
  if (isUndef(props.value)) {
    console.warn(`props value not be undefined`)
    return
  }
  const show = computed({
    get() {
      return props.value
    },
    set(val) {
      emit('input', val)
    }
  })
  const handleClose = function() {
    show.value = false
  }
  return {
    show,
    handleClose
  }
}

/**
 *
 * @param {Object} params 搜索数据
 * @param {function} fn 回调函数
 */
export const useTableSort = function(params, callBreak) {
  const doSort = function({ prop, order }) {
    let determined
    switch (order) {
        case 'ascending':
          determined = `${prop}`
          break

        case 'descending':
          determined = `-${prop}`
          break

        case null:
          determined = ''
          break
    }
    params.determined = determined
    params.pageNum = 1
    console.log(params, 'params')
    callBreak && callBreak()
  }

  return {
    doSort
  }
}
