import { reactive, ref, defineComponent } from '@vue/composition-api'
import { Pagination } from 'element-ui'

const PageCard = defineComponent({
  name: 'PageCard',
  props: {
    size: {
      type: Number,
      default: 10
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props) {
    // 总条数
    const total = ref(props.data.length || 100)
    // 当前页数
    const page = ref(0)
    // 当前展示
    const list = reactive([])

    return {
      total,
      page,
      list
    }
  },
  render(h) {
    console.log(this.$slots.content, '---')
    // const contentSlot = defineComponent(this.$slots.default])
    return (
      <section>
        {this.$slots.content}
        {h(Pagination, {
          attrs: {
            background: true,
            layout: 'prev, pager, next, jumper',
            pageSize: this.size,
            total: this.toal,
            currentPage: this.page
          }
        })}
      </section>
    )
  }
})

export default PageCard
