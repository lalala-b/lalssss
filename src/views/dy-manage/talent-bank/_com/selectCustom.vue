<template>
  <div class="select-box">
    <div
      v-if="!showSelect"
      :class="`select-title ${showLight ? 'blue-tip' : ''}`"
    >
      <span :class="`${showLight ? 'blue-tip' : 'select-label'}`">{{
        selectLabel ? selectLabel : selectItemData.label
      }}</span>
      <i class="el-icon-arrow-down" />
    </div>

    <el-select
      ref="select"
      v-model="selectItem.selectValue"
      clearable
      :class="showSelect ? '' : 'audience-select'"
      @change="handleChangeSelect"
      @visible-change="handleVisibleChange"
      @clear="handleClear"
    >
      <div v-if="selectItemData.text" class="select-text">
        {{ selectItemData.text }}
      </div>
      <el-option
        v-for="item in selectItemData.dataList"
        :key="item.dictValue"
        :value="item.dictValue"
        :label="item.dictLabel"
      />
      <div class="select-drap">
        <div v-if="selectItemData.showRange" class="select-drap-box">
          <el-input-number
            v-model="selectItem.startValue"
            placeholder="0"
            :controls="false"
            :precision="selectItemData.precision===0?0:2"
            class="input-xs"
            size="small"
            :min="0"
            :max="selectItem.endValue || 99999999"
          />
          {{ selectItemData.unit || "" }}
          <span class="seg">-</span>
          <el-input-number
            v-model="selectItem.endValue"
            placeholder="99999999"
            :controls="false"
            class="input-xs"
            size="small"
            :precision="selectItemData.precision===0?0:2"
            :min="selectItem.startValue || 0"
            :max="99999999"
          />
          {{ selectItemData.unit || "" }}
        </div>
        <div class="flex flex-justify-between m-t-12">
          <el-link
            size="small"
            type="primary"
            class="reset"
            :underline="false"
            @click="handleReset"
          >重置</el-link>
          <div>
            <el-button
              size="small"
              type="default"
              class="reset m-r-8"
              @click="handleCancel"
            >取消</el-button>
            <el-button
              size="small"
              type="primary"
              class="reset"
              @click="handleConfirm"
            >确认</el-button>
          </div>
        </div>
      </div>
    </el-select>
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
        startValue: undefined,
        endValue: undefined,
        selectValue: '',
        selectValueTxt: ''
      },
      selectLabel: ''
    })
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      (val) => {
        if (val && val.value) {
          states.selectItem.startValue = val.value.startValue
          states.selectItem.endValue = val.value.endValue
          states.selectItem.selectValue = val.value.selectValue
          states.selectItem.selectValueTxt = val.value.selectValueTxt
          if (val.value.selectValue) {
            handleChangeSelect(val.value.selectValue)
          }
        }
      },
      { deep: true, immediate: true }
    )

    const showLight = computed(() => {
      const { selectValue, startValue, endValue } = states.selectItem
      return !!(selectValue || startValue || endValue)
    })
    const handleVisibleChange = (val) => {
      if (val) {
        emit('closeOther')
      }
    }
    const handleChangeSelect = (val) => {
      states.selectLabel =
        (
          props.selectItemData.dataList.find(
            (item) => item.dictValue === val
          ) || {}
        ).dictLabel || ''

      states.selectItem.selectValue = val
      states.selectItem.selectValueTxt =
        (
          props.selectItemData.dataList.find(
            (item) => item.dictValue === val
          ) || {}
        ).dictLabel || ''
      if (props.selectItemData.type === 1) {
        states.selectItem.startValue = +val.split('-')[0]
        states.selectItem.endValue = +val.split('-')[1]
      }
      emit('updateSearch', {
        ...states.selectItem,
        type: props.selectItemData.type
      })
    }
    const handleReset = (close) => {
      states.selectItem.startValue = undefined
      states.selectItem.endValue = undefined
      states.selectItem.selectValue = ''
      states.selectItem.selectValueTxt = ''
      states.selectLabel = ''
      if (close === true) return
      emit('updateSearch')
      $refs.select.blur()
    }

    const handleCancel = () => {
      states.selectItem.startValue = ''
      states.selectItem.endValue = ''
      states.selectItem.selectValue = ''
      states.selectItem.selectValueTxt = ''
      $refs.select.blur()
    }
    const handleConfirm = () => {
      states.isSelectFocused = true
      const { startValue, endValue } = states.selectItem
      const { type, showRange } = props.selectItemData
      if (!props.showInput && (startValue || endValue)) return
      if (type === 1 && showRange) {
        states.selectItem.selectValue = `${startValue || 0}-${
          endValue === 0 ? 0 : endValue || 999
        }`
      }
      emit('updateSearch', { ...states.selectItem, type })
      $refs.select.blur()
    }
    const handleClear = (val) => {
      handleReset()
    }
    return {
      handleChangeSelect,
      handleReset,
      handleConfirm,
      handleCancel,
      ...toRefs(states),
      handleClear,
      showLight,
      handleVisibleChange
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
</style>
