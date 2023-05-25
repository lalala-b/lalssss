<template>
  <div class="root">
    <div ref="container" class="container">
      <div ref="list" class="virtual-list">
        <div
          v-for="(item) in visibleItems"
          :key="item.modelId"
          class="list-item"
          :style="{ transform: `translateY(${item.top}px)` }"
          @click="(e) => handleSelect(e, item.modelId)"
        >
          <span
            ref="label"
            :class="[
              'label', select.includes(item.modelId) && 'activeLabel',
            ]"
            :title="item.modelName"
          >
            {{ item.modelName }}
          </span>

          <i
            v-show="select.includes(item.modelId)"
            :class="['el-icon-check', 'checkIcon']"
          />
        </div>
      </div>
      <span v-if="!(visibleItems || []).length" class="nothing">无匹配数据</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'VirtualList',
  components: {
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    select: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      childIndex: 0,
      // 获取当前点击的id 与向下传递的currentId做对比，只更新当前点击的
      items: [
        // list of items
      ],
      visibleItems: [],
      clickModelId: null,
      itemHeight: 34,
      scrollTop: 0,
      maxWidth: 115
    }
  },
  // computed: {
  //   cascaderOptions() {
  //     return this.options
  //   }
  // },
  watch: {
    options: {
      handler(data) {
        this.items = data
        this.childIndex = 0
          this.$refs.container &&
          (this.$refs.container.style.minWidth = `${115 + 65}px`)
        this.$refs.container && (this.$refs.container.scrollTop = 0)
        this.$nextTick(() => {
          this.updateVisibleItems()
          this.$nextTick(() => {
            if (this.items[0]) {
              this.clickModelId = this.items[0].modelId
            }
          })
        })
      },
      deep: true,
      immediate: true
    },
    maxWidth: {
      immediate: true,
      handler() {
        this.$emit('virChangeW')
      }
    }
  },
  mounted() {
    this.$refs.container.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    virChangeW() {
      this.$emit('virChangeW')
    },
    handleScroll(e) {
      e.stopPropagation()
      this.scrollTop = this.$refs.container.scrollTop
      this.updateVisibleItems()
      this.$emit('virChangeW')
    },
    updateVisibleItems() {
      const container = this.$refs.container
      if (!container) return

      const list = this.$refs.list
      const { itemHeight, scrollTop } = this
      const startIndex = Math.floor(scrollTop / itemHeight)
      const endIndex =
        startIndex + Math.ceil(container.clientHeight / itemHeight)
      this.visibleItems = this.items
        .slice(startIndex, endIndex)
        .map((item, i) => ({
          ...item,
          top: (i + startIndex) * itemHeight
        }))
      list.style.height = `${this.items.length * itemHeight}px`
      this.$nextTick(() => {
        const labelRefs = this.$refs.label || []
        let maxWidth = 115
        if (labelRefs.length) {
          maxWidth = Math.max(
            ...labelRefs.map((item) => item.clientWidth)
          )
        }

        this.maxWidth = maxWidth
        container.style.minWidth = `${maxWidth >= 115 ? (maxWidth + 65) : 180}px`
      })
    },
    handleSelect(e, modelId) {
      e.stopPropagation()
      const currentIndex = this.select.findIndex(item => item === modelId)
      // 有 删除
      const selected = [...this.select]
      if (currentIndex > -1) {
        selected.splice(currentIndex, 1)
      } else {
        selected.push(modelId)
      }

      this.handleUpdateSelect(selected)
    },
    handleUpdateSelect(select) {
      this.$emit('change', select)
    }
  }
}
</script>
<style lang="scss" scoped>
.root {
  display: inline-block;
  height: 204px;
  color: #606266;
}

.container {
  height: 204px;
  padding: 6px 0;
  min-width: 180px;
  display: inline-block;
  overflow-y: auto;
  border-right: 1px solid #e4e7ed;
  position: relative;
}

.virtual-list {
  position: relative;
}

.list-item {
  position: absolute;
  height: 34px;
  display: flex;
  align-items: center;
  padding: 0 30px 0 20px;
  width: 100%;
  cursor: pointer;
}

.label {
  // padding-left: 10px;
  font-size: 14px;
  color: #606266;
  // flex: 1;
  white-space: nowrap;
}

.el-icon-arrow-right {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 6px;
  margin: auto;
  display: flex;
  align-items: center;
}

.activeLabel {
  color: #409eff;
  font-weight: 700;
}

.checkIcon {
  color: #409eff;
  font-weight: 700;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 6px;
  margin: auto;
  display: flex;
  align-items: center;
}

.nothing {
  color: #c0c4cc;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  height: fit-content;
  width: fit-content;
}
</style>
