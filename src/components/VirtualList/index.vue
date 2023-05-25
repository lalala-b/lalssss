<template>
  <div class="root">
    <div ref="container" class="container">
      <div ref="list" class="virtual-list">
        <div
          v-for="(item, index) in visibleItems"
          :key="item.modelId"
          class="list-item"
          :style="{ transform: `translateY(${item.top}px)` }"
          @click="(e) => handleLoadChildren(e, index, !(item.phoneModelVOList || []).length)"
        >
          <CheckBox
            v-if="isMultiple"
            :select="select"
            :current-id="item.modelId"
            :disabled-check="isMultiple?true:!item.phoneModelVOList"
            :current-options="items"
            :options="(items[childIndex] || {}).phoneModelVOList || []"
            @updateSelect="handleUpdateSelect"
          />
          <span
            ref="label"
            :class="[
              'label',
              (((items[childIndex] || {}).phoneModelVOList || []).length
                ? clickModelId === item.modelId
                : select.includes(item.modelId)) && 'activeLabel',
            ]"
            :title="item.modelName"
          >
            {{ item.modelName }}
          </span>
          <i
            v-show="(item.phoneModelVOList || []).length"
            :class="['el-icon-arrow-right', clickModelId === item.modelId && 'activeArrow']"
          />
        </div>
      </div>
    </div>
    <template
      v-if="
        childIndex !== null &&
          ((items[childIndex] || {}).phoneModelVOList || []).length
      "
    >
      <virtual-list
        :options="items[childIndex].phoneModelVOList"
        :select="select"
        :is-multiple="isMultiple"
        @virChangeW="virChangeW"
        @change="handleUpdateSelect"
      />
    </template>
  </div>
</template>
<script>
import CheckBox from './CheckBox'

export default {
  name: 'VirtualList',
  components: {
    CheckBox
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    select: {
      type: Array,
      default: () => []
    },
    isMultiple: {
      type: Boolean,
      default: true
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
  computed: {
    cascaderOptions() {
      return this.options
    }
  },
  watch: {
    isMultiple(val) {
      console.info('===============val', val)
    },
    options: {
      handler(data) {
        this.items = data
        this.childIndex = 0
        // 不多选宽度减少
          this.$refs.container &&
          (this.$refs.container.style.minWidth = `${115 + (this.isMultiple ? 65 : 50)}px`)
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
        startIndex + Math.ceil(container.clientHeight / itemHeight) || 6
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
            ...(this.$refs.label || []).map((item) => item.clientWidth)
          )
        }
        this.maxWidth = maxWidth
        container.style.minWidth = `${maxWidth >= 115 ? (maxWidth + (this.isMultiple ? 65 : 50)) : (this.isMultiple ? 180 : 165)}px`
      })
    },
    handleLoadChildren(e, index, isLast) {
      e.stopPropagation()
      const currentModelId = this.visibleItems[index].modelId
      this.clickModelId = currentModelId
      const completedIndex = this.items.findIndex(
        (item) => +item.modelId === +currentModelId
      )
      this.childIndex = completedIndex < 0 ? null : completedIndex

      // 点击的最后一级并且是单选, 额外执行选中
      if (isLast && !this.isMultiple) {
        this.handleUpdateSelect([...new Set([...this.select, currentModelId])])
      }
    },
    handleUpdateSelect(select) {
      let newSelect = [...select]
      if (!this.isMultiple) {
        newSelect = newSelect.slice(-1)
      }
      this.$emit('change', newSelect)
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
  padding-left: 10px;
  font-size: 14px;
  color: #606266;
  flex: 1;
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

.activeArrow {
  color: #409eff;
}
</style>
