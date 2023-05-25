<template>
  <div ref="container" class="container">
    <div ref="list" class="virtual-list">
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        class="list-item"
        :style="{ transform: `translateY(${item.top}px)` }"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      items: [
        // list of items
      ],
      visibleItems: [],
      itemHeight: 34,
      scrollTop: 0
    }
  },
  mounted() {
    this.items = Array.from({ length: 100000 }, (_, i) => ({
      content: `Item ${i}`,
      height: this.itemHeight
    }))
    this.updateVisibleItems()
    this.$refs.container.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    this.$refs.list.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.scrollTop = this.$refs.container.scrollTop
      this.updateVisibleItems()
    },
    updateVisibleItems() {
      const container = this.$refs.container
      const list = this.$refs.list
      const { itemHeight, scrollTop } = this
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex = startIndex + Math.ceil(container.clientHeight / itemHeight)
      this.visibleItems = this.items.slice(startIndex, endIndex).map(
        (item, i) => ({
          ...item,
          top: (i + startIndex) * itemHeight
        })
      )
      list.style.height = `${this.items.length * itemHeight}px`
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  height: 300px;
  overflow-y: auto;
}

.virtual-list {
  position: relative;
}

.list-item {
  position: absolute;
  height: 34px;
}
</style>
