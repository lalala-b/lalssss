<template>
  <el-checkbox
    :value="checked"
    :disabled="!disabledCheck"
    :indeterminate="indeterminated"
    @change="handleChange"
  />
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      default: () => []
    },
    currentOptions: {
      type: Array,
      default: () => []
    },
    select: {
      type: Array,
      default: () => []
    },
    currentId: {
      type: Number,
      default: 0
    },
    disabledCheck: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      checked: false,
      indeterminated: false
    }
  },
  computed: {
    checkboxOptions() {
      return this.options
    }
  },
  watch: {
    select: {
      handler() {
        const isLastLevel = !(
          this.currentOptions.find((item) => item.modelId === this.currentId) ||
          {}
        ).phoneModelVOList?.length

        const checked = isLastLevel
          ? this.select.includes(this.currentId)
          : this.isContained(
              this.select,
              this.getChildrenModelId(
                (
                  this.currentOptions.find(
                    (item) => item.modelId === this.currentId
                  ) || {}
                ).phoneModelVOList || []
              )
            )

        this.checked = checked

        // 最后一级 false , 已经是选中态 false  其余情况做比较
        this.indeterminated = isLastLevel
          ? false
          : checked
          ? false
          : this.checkArraySubset(
              this.getChildrenModelId(
                (
                  this.currentOptions.find(
                    (item) => item.modelId === this.currentId
                  ) || {}
                ).phoneModelVOList || []
              ),
              this.select || []
            )
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    getChildrenModelId(arr) {
      return arr.flatMap((item) =>
        (item.phoneModelVOList || []).length
          ? this.getChildrenModelId(item.phoneModelVOList)
          : item.modelId
      )
    },
    handleChange(status) {
      const { currentId, currentOptions } = this

      const childrenArr =
        currentOptions.find((item) => item.modelId === currentId)
          .phoneModelVOList || []

      if (status) {
        if (childrenArr.length) {
          // 点击的不是最后一级
          this.$emit('updateSelect', [
            ...new Set([
              ...this.select,
              ...this.getChildrenModelId(childrenArr)
            ])
          ])
        } else {
          this.$emit('updateSelect', [...new Set([...this.select, currentId])])
        }
      } else {
        const newSelect = [...this.select]

        const currentIndex = newSelect.findIndex((item) => item === currentId)

        if (childrenArr.length) {
          // 点击的不是最后一级
          const childrenModelIdArr = this.getChildrenModelId(childrenArr)
          this.$emit('updateSelect', [
            ...this.removeArrayValues(newSelect, childrenModelIdArr)
          ])
        } else {
          newSelect.splice(currentIndex, 1)
          this.$emit('updateSelect', [...new Set([...newSelect])])
        }
      }
    },
    // 判断a数组是否将b完全包含
    isContained(arrA, arrB) {
      if (!Array.isArray(arrA) || !Array.isArray(arrB)) {
        return false
      }

      if (arrA.length < arrB.length) {
        return false
      }

      for (const element of arrB) {
        if (!arrA.includes(element)) {
          return false
        }
      }

      return true
    },
    // 判断a1数组是否将a2包含
    checkArraySubset(arr1 = [], arr2 = []) {
      for (let i = 0; i < arr2.length; i++) {
        if (arr1.includes(arr2[i])) {
          return true
        }
      }
      return false
    },
    // 从一个数组中删除另一个数组的所有值
    removeArrayValues(arr1, arr2) {
      return arr1.filter((item) => !arr2.includes(item))
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }

  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>
