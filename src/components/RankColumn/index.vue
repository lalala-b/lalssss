<script>
export default {
  name: 'RankColumn',
  functional: true,
  props: {
    level: {
      type: Number,
      default: null
    }
  },
  render(h, context) {
    const { level } = context.props
    return (
      <span>
        { level <= 3
          ? <svg-icon class='level-icon' icon-class={'level' + level} />
          : level
        }
      </span>
    )
  }
}
</script>
