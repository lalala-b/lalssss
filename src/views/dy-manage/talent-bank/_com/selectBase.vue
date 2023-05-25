<template>
  <div class="select-box">
    <el-dropdown
      ref="dropdown"
      trigger="click"
      placement="bottom-start"
      @visible-change="toggleDropdown"
    >
      <div
        :class="`el-dropdown-link flex flex-align-center ${
          isSelected ? 'blue-tip' : ''
        }`"
        @click="handleToggleDropdown"
      >
        <div>{{ selectItemData.label }}</div>
        <i class="el-icon-arrow-down el-icon--right" />
      </div>
      <el-dropdown-menu
        slot="dropdown"
        class="dropdwon-menu"
        :hide-on-click="false"
      >
        <div class="drop select-drap">
          <div v-if="selectItemData.text" class="select-drap-top">
            <div class="select-drap-label">{{ selectItemData.text }}</div>
            <div v-if="selectItemData.showTypeSlect" class="select-drap-box">
              <el-select
                ref="select"
                v-model="selectItem.selectTypeValue"
                clearable
                size="small"
                :placeholder="selectItemData.dataTypePlaceholder"
                @change="handleChangeSelecType"
                @click.native.stop
              >
                <el-option
                  v-for="item in selectItemData.dataTypeList"
                  :key="item.dictValue"
                  :value="item.dictValue"
                  :label="item.dictLabel"
                />
              </el-select>
            </div>
          </div>
          <ul :class="`${selectItemData.text ? 'list-pt-20' : ''} list`">
            <li
              v-for="(item, index) in selectItemData.dataList"
              :key="item.dictValue"
              :class="`${active === index ? 'active' : ''} list-item`"
              @click="handleClick(item, index)"
            >
              {{ item.dictLabel }}
            </li>
          </ul>
        </div>
        <div class="drop-bottom">
          <div v-if="selectItemData.showInput" class="select-drap-box">
            <el-input-number
              v-model="selectItem.startValue"
              placeholder="0"
              :controls="false"
              class="input-xs"
              size="small"
              :min="0"
              :precision="selectItemData.precision === 0 ? 0 : 2"
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
              :precision="selectItemData.precision === 0 ? 0 : 2"
              :min="selectItem.startValue || 0"
              :max="99999999"
            />
            {{ selectItemData.unit || "" }}
          </div>
          <div class="flex flex-justify-between m-t-12">
            <el-link
              size="small"
              type="primary"
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
                class="reset m-r-12"
                @click="handleConfirm"
              >确认</el-button>
            </div>
          </div>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch,
  onMounted,
  onUnmounted
} from '@vue/composition-api'
import IconTip from '@/components/IconTip'
import { getCurrentInstance } from '@vue/composition-api'
export default defineComponent({
  props: {
    selectItemData: {
      type: Object,
      default: () => ({})
    },
    isCpm: {
      type: Boolean,
      default: false
    },
    showSelect: {
      // 是否显示select框
      type: Boolean,
      default: false
    },
    defaultValue: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $refs, $message, $nextTick } = getCurrentInstance().proxy
    const states = reactive({
      selectItem: {
        startValue: undefined,
        endValue: undefined,
        selectValue: '',
        selectValueTxt: '',
        selectTypeValue: '',
        selectTypeTxt: ''
      },
      isSelected: false, // 是否已经选中提交
      selectLabel: '',
      active: ''
    })
    const {
      showRange,
      showInput,
      type,
      text = '',
      inputText = '',
      dataTypePlaceholder = '',
      showTypeSlect = false,
      dataListMsg = '',
      dataTypeList = []
    } = props.selectItemData
    const handleConfirm = () => {
      const { selectValue, startValue, endValue, selectTypeValue } =
        states.selectItem

      if (selectTypeValue || selectValue || startValue || endValue) {
        if (showTypeSlect) {
          if (!['0', '1', '2'].includes(selectTypeValue)) {
            $message.warning(dataTypePlaceholder)
            return
          } else {
            states.selectItem.showTypeSlect = showTypeSlect
            states.selectItem.selectTypeTxt = dataTypeList.find(
              (item) => item.dictValue === selectTypeValue
            ).dictLabel
          }
        }
        if (props.isCpm && (startValue || endValue)) {
          states.selectItem.selectValue = `${startValue || 0}-${
            endValue === 0 ? 0 : endValue || 99999999
          }`
          states.selectItem.selectValueTxt = states.selectItem.selectValue
        }
        if (
          (showInput || showTypeSlect) &&
          props.selectItemData.dataList &&
          props.selectItemData.dataList.length
        ) {
          if (!states.selectItem.selectValue) {
            $message.warning((dataListMsg || text) + '不能为空')
            return
          }
          if (!(startValue || endValue)) {
            $message.warning(inputText + '不能为空')
            return
          }
        }
        states.isSelected = true
        states.selectItem.startValue = startValue || 0
        states.selectItem.endValue = endValue
        emit('updateSearch', { ...states.selectItem })
      } else {
        emit('updateSearch')
      }
      states.closeFlag = false
      $nextTick(() => {
        $refs.dropdown.visible = false
      })
    }
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      (val) => {
        if (val && val.value) {
          states.selectItem.startValue = val.value.startValue
          states.selectItem.endValue = val.value.endValue
          states.selectItem.selectValue = val.value.selectValue
          states.selectItem.selectValueTxt = val.value.selectValueTxt
          if (showTypeSlect) {
            states.selectItem.selectTypeValue = val.value.selectTypeValue
          }
          props.selectItemData.dataList.forEach((item, index) => {
            if (item.dictValue === val.value.selectValue) {
              states.active = index
            }
          })
          if (
            val.value.selectValue ||
            val.value.startValue ||
            val.value.endValue
          ) {
            handleConfirm()
          }
        }
      },
      { deep: true, immediate: true }
    )
    const showLight = () => {
      const { selectValue, startValue, endValue } = states.selectItem
      return !!(selectValue || startValue || endValue)
    }
    const handleVisibleChange = (val) => {
      if (val) {
        emit('closeOther')
      }
    }
    const clearData = () => {
      states.selectItem.startValue = undefined
      states.selectItem.endValue = undefined
      states.selectItem.selectValue = ''
      states.selectItem.selectValueTxt = ''
      if (showTypeSlect) {
        states.selectItem.selectTypeTxt = ''
        states.selectItem.selectTypeValue = ''
      }
    }

    const handleCloseBase = () => {
      states.closeFlag = false
      $refs.dropdown.visible = false
    }

    const handleReset = (close) => {
      states.isSelected = false
      clearData()
      states.active = ''
      states.selectLabel = ''
      if (close === true) return
      emit('updateSearch')
      handleCloseBase()
    }

    const handleCancel = () => {
      handleCloseBase()
    }

    // 点击标题label显示/关闭下拉框
    const handleToggleDropdown = () => {
      if ($refs.dropdown.visible) {
        states.closeFlag = false
      } else {
        states.closeFlag = true
        $refs.dropdown.visible = true
      }
    }

    const toggleDropdown = (val) => {
      if (!val && states.closeFlag) {
        $refs.dropdown.visible = true
      }
    }
    const domClick = (event) => {
      const dropdown = $refs.dropdown?.$el
      if (!dropdown) return
      if (!dropdown?.contains(event.target)) {
        states.closeFlag = false
        $refs.dropdown.visible = false
      }
    }
    const handleClick = (item, index) => {
      states.active = index
      states.selectItem.selectValue = item.dictValue
      states.selectItem.selectValueTxt = item.dictLabel
      if ((type === 1 || showRange) && item.dictLabel) {
        const str = item.dictValue.split('-')
        states.selectItem.startValue = +str[0] || 0
        states.selectItem.endValue = +str[1] || 99999999
      }
    }
    const handleChangeSelecType = () => {}
    onMounted(() => {
      document.addEventListener('click', domClick)
    })
    onUnmounted(() => {
      document.removeEventListener('click', domClick)
    })
    return {
      handleReset,
      handleConfirm,
      handleCancel,
      ...toRefs(states),
      showLight,
      handleVisibleChange,
      handleToggleDropdown,
      toggleDropdown,
      handleClick,
      handleChangeSelecType
    }
  }
})
</script>

<style lang="scss" scoped>
.blue-tip {
  color: #2c64ff;
}
.el-dropdown-link {
  cursor: pointer;
}
.list-pt-20 {
  padding-top: 20px;
}
.select-drap {
  position: relative;
  &-top {
    position: absolute;
    display: flex;
    align-items: center;
    width: 100%;
    background: #fff;
    top: 0;
    left: 0;
    padding-left: 16px;
    height: 24px;
  }
  &-label {
    font-weight: 600;
  }
  &-box {
    margin-left: 8px;
    ::v-deep {
      .el-select {
        width: 114px !important;
      }
    }
  }
  .list {
    min-width: 200px;
    max-height: 200px;
    overflow: auto;
    &-item {
      padding: 0 16px;
      line-height: 28px;
      cursor: pointer;
    }
    &-item:hover {
      background: #f5f7fa;
    }
  }
}
.drop-bottom {
  padding: 0 16px;
  min-width: 200px;
  .select-drap-box {
    border-top: 1px solid #eee;
    padding-top: 8px;
    .input-xs {
      width: 100px;
    }
  }
}
::v-deep {
  .el-checkbox__input {
    display: none;
  }
  .el-checkbox {
    line-height: 32px;
  }
}
.active {
  color: #2c64ff;
}
</style>
