import { toRefs, reactive, defineComponent, defineAsyncComponent, computed, onMounted } from '@vue/composition-api'
import { isArray, isUndef } from '@/utils'
import Loading from '@/components/Loading'
import './index.scss'

/** 图表类型 */
// const ChartTypes = {
//   line: import('./types/line')
// }

/** 图表主模块 */
const VChart = defineComponent({
  name: 'VChart',
  props: {
    data: {
      type: Object | Array,
      default() {
        return {}
      }
    },
    type: {
      type: String,
      default: 'line'
    },
    loading: {
      type: Boolean,
      default: false
    },
    map: {
      type: Object,
      default() {
        return {
          x: 'terms',
          y: 'values',
          cates: 'cates'
        }
      }
    },
    config: {
      type: Object,
      default() {
        return {}
      }
    },
    formater: {
      type: Function,
      default: function(data) {
        return data
      }
    },
    vh: {
      type: Number,
      default: 380
    }
  },
  components: { Loading },
  setup(props) {
    const data = reactive({
      isEmpty: computed(() => {
        // if (props.data) {
        //   if (props.data.values && isArray(props.data.values[0])) {
        //     console.log(props.data.values)
        //     return !props.data.values.every(item => item && item.length > 0)
        //   }
        //   return !props.data.values
        // }
        // if (props.type === 'map') return false
        return !(props.data && (isArray(props.data.values) ? !isUndef(props.data.values[0]) : props.data.values))
      }),
      Comp: computed(() => {
        return defineAsyncComponent(() => {
          return import(`./types/${props.type}`)
        })
      })
    })
    return {
      ...toRefs(data)
    }
  },
  render(h) {
    return (
      <section class='m-chart' ref='main'>
       { h('div', { class: 'm-chartCon', style: `height:${this.vh}px` }, [
              this.loading
                ? <Loading />
                : this.isEmpty
                              ? <section class='m-chartEmpty'>暂无数据</section>
                              : h(this.Comp, {
                                  props: {
                                    ref: 'chart',
                                    config: this.config,
                                    formater: this.formater,
                                    data: this.data,
                                    map: this.map
                                  },
                                  on: {
                                    click: (res) => this.$emit('click', res)
                                  }
                                })

        ])}
      </section>
    )
  }
})

export default VChart
