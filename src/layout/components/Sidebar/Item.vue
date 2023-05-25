<script>
export default {
  name: 'MenuItem',
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
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={[icon, 'sub-el-icon iconfont']} />)
    }

    if (title) {
      vnodes.push(<span class='menu-text' slot='title'>{(title)}</span>)
    }
    return vnodes
  }
}
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  font-size: $--font-size-base;
}
.menu-text {
  font-size: 14px;
}
</style>
