<script>
export default {
  name: 'Wrap',
  functional: true,
  render(h, context) {
    return h('div', {
      class: `q-wrap`,
      ...context.data
    }, context.slots().default)
  }
}
</script>

<style lang="scss">
  .q-wrap {
    padding: 24px;
    background: #fff;
    border-radius: 4px;
    box-sizing: border-box;
  }
</style>
