import { deepClone, isArray, isFunction } from '@/utils'
import Echarts, { ThemeName } from '../helper'

/** Echart 实例存储数组 */
const Charts = []

/** 模块缓存 id */
var CID = Math.ceil(
  Math.random() * 1024 * 1024
)

/** 节流 */
function throttle(fn, delay) {
  var timer = null
  return function() {
    var context = this
    var args = arguments
    clearTimeout(timer)
    timer = setTimeout(function() {
      fn.apply(context, args)
    }, delay)
  }
}

const resize = throttle(function() {
  if (isArray(Charts) && Charts.length) {
    Charts.forEach(function(chart) {
      if (chart) {
        chart.resize({
          width: chart.$target.clientWidth
        })
      }
    })
  }
}, 200)
// 浏览器视窗变化，手工设置图表宽度
window.onresize = resize
/** 创建图表实例 */
function createdChart(target) {
  // , { devicePixelRatio: 2.5 }
  const subject = Echarts.init(target, ThemeName, { renderer: 'svg' })
  // 缓存 id 用于后续的实例操作
  subject.$cacheId = `VC_${(++CID).toString(16)}_${Date.now().toString(16)}`
  if (!subject.$target) {
    subject.$target = target
  }
  Charts.push(subject)
  return subject
}

export default {
  props: {
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    formater: {
      type: Function,
      default: function(data, subject) {
        return data
      }
    },
    data: {
      type: Object | Array,
      defalut() {
        return {}
      }
    },
    map: {
      type: Object,
      defalut() {
        return {
          x: 'terms',
          y: 'values',
          cates: 'cates'
        }
      }
    }
  },
  data() {
    return {
      options: null
    }
  },
  watch: {
    data: {
      deep: true,
      handler() {
        isFunction(this._formmate) && this._formmate()
        this.setData()
      }
    }
  },
  created() {
    this.$chart = null
    this.$bus.$on('toggleSideBar', () => {
      this.$nextTick(() => {
        this.$chart && this.$chart.resize({
          width: this.$chart.$target.clientWidth
        })
      })
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.$chart = createdChart(this.$refs.content, {})
      if (this.$parent) {
        this.$parent.$chart = this.$chart
      }
      this.$chart.on('click', (res) => {
        this.$emit('click', res, this)
      })
      // 调用函数处理数据
      isFunction(this._formmate) && this._formmate()
      this.setData()
    })
  },
  beforeDestroy() {
    if (this.$chart) {
      for (let i = 0; i < Charts.length; i++) {
        if (Charts[i] && Charts[i].$cacheId === this.$chart.$cacheId) {
          Charts.splice(i, 1)
          break
        }
      }
      this.$chart.dispose()
      this.$chart = null
    }
    this.$bus.$off('toggleSideBar')
  },
  methods: {
    setData() {
      this.options = this.formater(deepClone(this.options), this)
      this.$chart.setOption(this.options)
    }
  },
  render(h) {
    return (
      <div class='m-chartConInner' ref='content'></div>
    )
  }
}
