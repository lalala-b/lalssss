<script>
export default {
  name: 'Title',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props
    const { attrs, staticClass } = context.data
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={[icon, 'iconfont']} />)
    }

    if (title) {
      vnodes.push(<span>{(title)}</span>)
    }
    if (context.scopedSlots.right) {
      vnodes.push(context.scopedSlots.right())
    }
    // console.log(vnodes)
    return (
      <div class={'q-title ' + staticClass || ''} {...attrs} data-bold >
        { vnodes }
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
  .q-title {
    display: inline-flex;
    padding: 20px 24px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
    font-size: $--font-size-base;
    line-height: 24px;
    color: #272727;
    .iconfont {
      margin-right: 4px;
      color: $--color-primary;
    }
  }
</style>
