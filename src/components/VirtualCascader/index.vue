<template>
  <div class="virtualCascader">
    <div
      :class="[
        'input',
        !(value || []).length && 'placeholder',
        active && 'active',
      ]"
      @click="handleFocus"
    >
      <!-- <span v-show="!(value || []).length">{{ placeholder }}</span> -->
      <template v-if="isMultiple">
        <el-tag
          v-show="(value || []).length"
          type="info"
          size="small"
          class="nameTag"
        >
          {{ tagName }}
        </el-tag>
        <el-tag
          v-show="(value || []).length > 1"
          type="info"
          size="small"
          class="numTag"
        >
          + {{ value.length - 1 }}
        </el-tag>
      </template>
      <template v-else> {{ value.length?tagName:'' }}</template>
      <el-input
        v-model="cascaderInput"
        class="cascaderInput"
        :placeholder="!(value || []).length ? placeholder : ''"
        @input="handleInputWithDebounce"
      />
      <i
        v-if="!(value || []).length"
        :class="[
          'icon',
          'el-icon-arrow-down',
          'arrowIcon',
          showDropdown && 'arrow_up',
        ]"
      />
      <i
        v-else
        :class="['icon', 'el-icon-circle-close', 'closeIcon']"
        @click="handleClear"
      />
    </div>
    <div
      ref="virtualElement"
      :class="[
        'dropdown virtualElement',
        showDropdown ? 'showDrop' : 'hideDrop',
      ]"
    >
      <virtual-list
        v-show="!cascaderInput && !selecting"
        :options="options"
        :select="value"
        :is-multiple="isMultiple"
        @virChangeW="virChangeW"
        @change="handleChangeSelect"
      />

      <virtual-select-list
        v-show="cascaderInput || selecting"
        :options="selectListData"
        :select="value"
        @virChangeW="virChangeW"
        @change="handleChangeVirtualSelect"
      />
    </div>
  </div>
</template>

<script>
import VirtualList from '../VirtualList'
import VirtualSelectList from './VirtualSelectList'

export default {
  components: {
    VirtualList,
    VirtualSelectList
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    isMultiple: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      active: false,
      showDropdown: false,
      data: [],
      completeData: [],
      tagName: '',
      lastModelId: '',
      cascaderInput: '',
      timeoutId: null,
      selectListData: [],
      selecting: false
    }
  },
  watch: {
    options: {
      handler(data) {
        if ((data || []).length) {
          this.completeData = this.getChildrenModel(data, '')
        }
      },
      deep: true,
      immediate: true
    },
    showDropdown(val) {
      if (val) {
        this.virChangeW()
      }
    }
  },
  mounted() {
    window.addEventListener('click', this.windowClick)
    window.addEventListener('resize', this.virChangeW)
    window.addEventListener('scroll', this.virChangeW, true)
  },
  beforeDestroy() {
    window.removeEventListener('click', this.windowClick)
    window.removeEventListener('resize', this.virChangeW)
    window.removeEventListener('scroll', this.virChangeW)
  },

  methods: {
    getChildrenModel(arr, parentName) {
      const selectArr = []
      for (let i = 0; i < arr.length; i++) {
        if ((arr[i].phoneModelVOList || []).length) {
          selectArr.push(
            ...this.getChildrenModel(
              arr[i].phoneModelVOList,
              `${parentName}${arr[i].modelName}/`
            )
          )
        } else {
          const currentItem = { ...arr[i] }
          currentItem.modelName = parentName + currentItem.modelName
          selectArr.push(currentItem)
        }
      }
      return selectArr
    },
    windowClick() {
      this.active = false
      this.showDropdown = false
      this.cascaderInput = ''
      this.selectData = []
      this.selecting = false
    },
    handleChangeSelect(arr) {
      if (!arr.length) {
        this.lastModelId = ''
      } else if (this.lastModelId !== arr[0]) {
        this.lastModelId = arr[0]

        const modelName = this.completeData.find(
          (item) => item.modelId === arr[0]
        ).modelName

        this.tagName = (modelName || '').split('/')[
          (modelName || '').split('/').length - 1
        ]
      }
      this.$emit('change', arr)
    },

    handleChangeVirtualSelect(arr) {
      this.selecting = true
      this.cascaderInput = ''
      this.handleChangeSelect(arr)
    },

    handleFocus(e) {
      e.stopPropagation()
      this.active = true
      // 输入的
      if (this.cascaderInput) {
        this.showDropdown = true
      } else {
        this.showDropdown = true
      }
    },
    handleClear(e) {
      e.stopPropagation()
      this.lastModelId = ''
      this.$emit('change', [])
    },
    virChangeW() {
      const virtualElement = document.querySelector('.virtualElement')
      const inputElement = document.querySelector('.input')
      if (!virtualElement) return
      const clientWidth =
        window.innerWidth ||
        document.documentElement.clientWidth ||
        document.body.clientWidth
      const clientHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight
      const { width, height } = virtualElement.getBoundingClientRect()
      const {
        left: leftI,
        height: heightI,
        bottom: bottomI
      } = inputElement.getBoundingClientRect()
      const isOverBottom = bottomI + height + 4 > clientHeight
      const isOverRight = leftI + width > clientWidth
      virtualElement.style.setProperty(
        'top',
        `${isOverBottom ? -heightI - height + 20 : heightI}px`
      )
      virtualElement.style.setProperty(isOverRight ? 'right' : 'left', '0')
      virtualElement.style.removeProperty(isOverRight ? 'left' : 'right')
    },
    handleInput(val) {
      const selectData = this.completeData.filter((item) =>
        item.modelName
          .split('/')[item.modelName.split('/').length - 1].toLowerCase()
          .includes(val.toLowerCase())
      )

      this.selectListData = selectData
    },
    debounce(func, delay) {
      const vm = this
      return function() {
        const args = arguments
        clearTimeout(vm.timeoutId)
        vm.timeoutId = setTimeout(() => {
          func.apply(vm, args)
        }, delay)
      }
    },
    handleInputWithDebounce: function(val) {
      const debouncedInputHandler = this.debounce(
        () => this.handleInput(val),
        500
      )
      debouncedInputHandler()
    }
  }
}
</script>
<style lang="scss" scoped>
.root {
  display: flex;
}

.virtual-cascader {
  display: inline-block;
  height: 204px;
  width: 180px;
  padding: 6px 0;
}

.virtual-cascader-item {
  height: 34px;
}

.closeIcon {
  // visibility: hidden;
  color: #bfbfbf;
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    color: #333;
  }
}

.input {
  background-color: #fff;
  background-image: none;
  border-radius: 2px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  color: #595959;
  font-size: 14px;
  line-height: 30px;
  outline: none;
  padding: 0 30px 0 14px;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 248px;
  display: inline-flex;
  cursor: pointer;
  position: relative;
  align-items: center;
  flex-wrap: wrap;

  &:hover {
    border-color: #bfbfbf;
  }
}

.placeholder {
  color: #b2b2b2;
}

.active {
  border-color: #2c64ff !important;
}

.virtualCascader {
  position: relative;
  display: inline-block;
}

.dropdown {
  margin: 5px 0;
  font-size: 14px;
  background: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  width: max-content;
  position: absolute;
  // left: 0;
  z-index: 222;
}

.showDrop {
  visibility: auto;
}

.hideDrop {
  visibility: hidden;
}

.icon {
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto;
  display: flex;
  align-items: center;
  right: 9px;
}

.el-icon-arrow-down {
  transition: transform 0.3s;
  color: #bfbfbf;
}

.arrow_up {
  transform: rotateZ(180deg);
}

.nameTag {
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.numTag {
  margin-left: 4px;
}

.cascaderInput {
  min-width: 30px;
  flex: 1;

  ::v-deep {
    .el-input__inner {
      padding: 0;
      border-color: transparent;
      height: calc(100% - 2px);
    }
  }
}
.red-box{
  border: 1px solid red;
}
</style>
