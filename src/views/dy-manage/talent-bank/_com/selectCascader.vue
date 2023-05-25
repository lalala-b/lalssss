<template>
  <div class="select-box">
    <div
      v-if="!showSelect"
      :class="`select-title ${showLight ? 'blue-tip' : ''}`"
    >
      <span :class="`${showLight ? 'blue-tip' : 'select-label'}`">{{
        selectLabel ? selectLabel : selectItemData.label
      }}</span>
      <span
        :style="
          selectItem.selectValue && selectItem.selectValue.length
            ? 'padding:0 4px'
            : ''
        "
      >{{ showLight ? count : "" }}</span>
      <i class="el-icon-arrow-down" />
    </div>

    <el-cascader
      ref="cascader"
      v-model="selectItem.selectValue"
      :class="showSelect ? '' : 'audience-select'"
      class="cascader m-r-10 m-b-24"
      :show-all-levels="false"
      :placeholder="selectItemData.placeholder"
      :options="selectItemData.dataList || []"
      :props="{
        checkStrictly: false,
        expandTrigger: 'hover',
        value: 'label',
        label: 'value',
        children: 'children',
        multiple: true,
      }"
      collapse-tags
      @before-remove="handleBeforeRemove"
      @change="handleChangeCascader"
    />
  </div>
</template>

<script>
import {
  computed,
  defineComponent,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import IconTip from '@/components/IconTip'
import { getCurrentInstance } from '@vue/composition-api'
export default defineComponent({
  props: {
    selectItemData: {
      type: Object,
      default() {
        return {}
      }
    },
    showInput: {
      // 是否显示删选范围
      type: Boolean,
      default: true
    },
    showSelect: {
      // 是否显示select框
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy
    const states = reactive({
      selectItem: {
        selectValue: [],
        selectValueTxt: ''
      },
      count: '',
      selectLabel: '',
      tagNameList: []
    })
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      (val) => {
        if (val && val.value) {
          states.selectItem.selectValue = val.value.selectValue
          states.selectItem.selectValueTxt = val.value.selectValueTxt

          if (val.value.selectValue && val.value.selectValue.length) {
            states.count = val.value.selectValue.length
            states.selectItem.selectValueTxt = states.selectItem.selectValue
              .length
              ? states.selectItem.selectValue.length + '项'
              : ''
            emit('updateSearch', {
              ...states.selectItem,
              value: val.value.value
            })
          }
        }
      },
      { deep: true, immediate: true }
    )

    const showLight = computed(() => {
      return states.count
    })
    const handleVisibleChange = (val) => {
      if (val) {
        emit('closeOther')
      }
    }

    const handleReset = (close) => {
      states.count = 0
      states.selectItem.selectValue = []
      states.selectItem.selectValueTxt = ''
      if (close === true) return
      emit('updateSearch')
    }

    const handleChangeCascader = (val) => {
      if (val && val.length === 0) {
        handleReset()
        return
      }
      if ($refs.cascader) {
        const val1 = $refs.cascader
          .getCheckedNodes()
          .filter((item) => !item.hasChildren)
          .map((item) => {
            return item.data.label
          })
        states.count = val1.length
        states.selectItem.selectValueTxt = val1.length
          ? val1.length + '项'
          : ''
        states.count && emit('updateSearch', { ...states.selectItem, value: val1 })
      }
    }
    const handleBeforeRemove = (removeNode) => {
      // 判断要删除的节点是否为已选中的节点
      if (
        this.selectedOptions.some((option) => option.value === removeNode.value)
      ) {
        // 已选中的节点不允许删除，阻止删除行为
        removeNode.cancel = true
      }
    }

    return {
      handleReset,
      ...toRefs(states),
      showLight,
      handleVisibleChange,
      handleChangeCascader,
      handleBeforeRemove
    }
  }
})
</script>

<style lang="scss" scoped>
.blue-tip {
  color: #2c64ff;
}
.select-text {
  width: 200px;
  margin: 0 16px;
  padding-bottom: 4px;
  border-bottom: 1px solid #eee;
}
.select-drap {
  min-width: 200px;
  .input-xs {
    width: 100px;
  }
  padding: 0 24px;
  &-box {
    border-top: 1px solid #eee;
    padding-top: 8px;
  }
}
.el-select-dropdown__item {
  height: 28px !important;
  line-height: 28px !important;
}
.select-box {
  position: relative;
  font-size: 14px;
  .select-label {
    color: #595959;
  }

  .audience-select {
    position: absolute;
    top: 0;
    width: 80px;
    opacity: 0;
  }
}
::v-deep {
  .el-icon-close {
    display: none;
  }
}
</style>
