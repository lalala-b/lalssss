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
        @click="handleShow"
      >
        <div>{{ selectItemData.label }}</div>
        <i class="el-icon-arrow-down el-icon--right" />
      </div>
      <el-dropdown-menu slot="dropdown" :hide-on-click="false">
        <div class="drop">
          <div class="flex">
            <div
              v-for="(item, index) in selectItemData.selectList"
              :key="index"
              class="drop-select-item"
            >
              <span class="drop-label">{{ item.label || "" }}</span>
              <el-date-picker
                v-if="item.type === 'date'"
                v-model="selectItem[item.key]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                @click.stop
                @change="handleDatePicker(item, index)"
              />
              <template v-if="item.type === 'select'">
                <el-select
                  v-if="item.type !== 'inputRange'"
                  ref="select"
                  v-model="selectItem[item.key]"
                  class="platSelect"
                  clearable
                  :placeholder="item.placeholder"
                  @click.stop
                  @change="(val) => handleChange(item, val, index)"
                >
                  <el-option
                    v-for="_item in item.dataList"
                    :key="_item.dictValue"
                    :label="_item.dictLabel"
                    :value="_item.dictValue"
                  />
                  <div v-if="item.customFlag" class="select-drap">
                    <div class="select-drap-box">
                      <el-input-number
                        v-model="selectRange[item.key + 'Start']"
                        placeholder="0"
                        :controls="false"
                        class="input-xs"
                        size="small"
                        :min="0"
                        :max="selectRange[item.key + 'End'] || 99999999"
                        @input="(val) => handleRange(item.key, index)"
                      />
                      <span class="seg">-</span>
                      <el-input-number
                        v-model="selectRange[item.key + 'End']"
                        placeholder="99999999"
                        :controls="false"
                        class="input-xs"
                        size="small"
                        :min="selectRange[item.key + 'Start'] || 0"
                        :max="99999999"
                        @input="(val) => handleRange(item.key, index)"
                      />
                    </div>
                  </div>
                </el-select>
              </template>
              <template v-if="item.type === 'inputRange'">
                <el-input-number
                  v-model="(selectItem[item.key].value || {}).start"
                  placeholder="0"
                  :controls="false"
                  class="input-xs"
                  :min="0"
                  :precision="item.precision"
                  :max="
                    (selectItem[item.key].value || {}).end ||
                      item.max ||
                      99999999
                  "
                  @input="(val) => handleInput(item)"
                />
                {{ selectItemData.selectList[index].unit || "" }}
                <span class="seg">-</span>
                <el-input-number
                  v-model="(selectItem[item.key].value || {}).end"
                  :placeholder="item.max ? item.max + '' : '99999999'"
                  :controls="false"
                  class="input-xs"
                  :precision="item.precision"
                  :min="(selectItem[item.key].value || {}).start || 0"
                  :max="item.max ? item.max : 99999999"
                  @input="(val) => handleInput(item)"
                />
                {{ selectItemData.selectList[index].unit || "" }}
              </template>
            </div>
          </div>
        </div>
        <div class="flex flex-justify-between m-t-12">
          <el-link
            size="small"
            type="primary"
            class="m-l-16"
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
      default() {
        return {}
      }
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
    const { $refs, $set, $message } = getCurrentInstance().proxy
    const states = reactive({
      selectItem: {},
      selectData: [],
      isSelected: false, // 是否已经选中提交
      hasData: false,
      closeFlag: true,
      dateValue: '',
      selectRange: {}
    })
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      function(val) {
        if (val && val.value && val.value.length) {
          const arr = val.value
          arr.forEach((item, index) => {
            if (item.type === 'inputRange') {
              $set(states.selectItem[item.key], 'value', {
                start: item.value.start,
                end: item.value.end
              })
              handleInput(item)
            }
            if (item.type === 'select') {
              if (item.customFlag) {
                 states.selectRange = {}
                if (item.value) {
                  handleChange(item, item.value, index)
                } else if (item.start || item.end) {
                  $set(states.selectRange, item.key + 'Start', item.start)
                  item.end && $set(states.selectRange, item.key + 'End', item.end || '')
                  handleRange(item.key, index)
                }
              } else {
                handleChange(item, item.value, index)
              }
            }
            if (item.type === 'date') {
              if (item.value && item.value.start) {
                states.selectItem[item.key] = [
                  item.value.start ? item.value.start.split(' ')[0] : '',
                  item.value.end ? item.value.end.split(' ')[0] : ''
                ]
              }
              handleDatePicker(item, index)
            }
          })
          states.hasData = true
          handleConfirm(0)
        }
      },
      { deep: true, immediate: true }
    )
    watch(
      () => props.selectItemData,
      (val) => {
        if (val.selectList && val.selectList.length) {
          const obj = {}
          states.selectData = []
          val.selectList.forEach((item) => {
            if (item.type === 'inputRange') {
              states.selectData.push({
                label: item.label,
                value: {},
                type: 'inputRange',
                key: item.key,
                unit: item.unit
              })
              obj[item.key] = {
                key: item.key,
                type: 'inputRange',
                unit: item.unit
              }

              $set(obj[item.key], 'value', {
                start: undefined,
                end: undefined
              })
            }
            if (item.type === 'select') {
              states.selectData.push({
                label: item.label,
                text: '',
                value: undefined,
                key: item.key
              })
              obj[item.key] = undefined
            }
            if (item.type === 'date') {
              states.selectData.push({
                label: item.label,
                text: '',
                value: '',
                key: item.key
              })
              obj[item.key] = ''
            }
          })
          states.selectItem = obj
        }
      },
      { immediate: true, deep: true }
    )
    watch(
      () => states.selectData,
      (val) => {
        states.hasData = val.findIndex((item) => item.value !== '') > -1
      },
      { deep: true, immediate: true }
    )
    // 取消
    const handleCancel = () => {
      states.closeFlag = false
      $refs.dropdown.visible = false
    }
    // 确认
    const handleConfirm = (watchFlag) => {
      let flag = true
      if (!states.selectData.length) {
        emit('updateSearch', JSON.parse(JSON.stringify(states.selectData)))
        handleCancel()
        return
      }
      if (watchFlag !== 0) {
        try {
          props.selectItemData.selectList.forEach((item) => {
            // if (item.type === 'inputRange' && states.selectItem[item.key]&&item.customFlag) {
            //   const { start, end } = (states.selectItem[item.key] || {}).value
            //   if (start && !end) {
            //     states.selectItem[item.key].value.end = item.max || ''
            //   }
            // }
            if (
              (item.type !== 'inputRange' && !states.selectItem[item.key]) ||
              (item.type === 'inputRange' &&
                !states.selectItem[item.key].value.start &&
                !states.selectItem[item.key].value.end)
            ) {
              flag = false
              $message.warning(item.placeholder)
              throw new Error(item.placeholder)
            }
          })
        } catch (error) {
          console.info()
        }
      }
      if (flag) {
        states.isSelected = states.hasData || states.selectData.findIndex((item) => item.value !== '') > -1
        emit('updateSearch', JSON.parse(JSON.stringify(states.selectData)))
        handleCancel()
      }
    }
    // 重置
    const handleReset = (close = '') => {
      states.isSelected = false
      Object.keys(states.selectItem).forEach((item, index) => {
        // 清除范围值的input框
        if ((states.selectItem[item] || {}).type === 'inputRange') {
          states.selectItem[item].value.start = undefined
          states.selectItem[item].value.end = undefined
          $set(states.selectItem[item], 'value', {
            start: undefined,
            end: undefined
          })
        } else {
          $set(states.selectItem, item, undefined)
          states.selectItem[item] = undefined
        }
      })
      states.selectData.forEach((item) => {
        item.value = ''
        item.text = ''
      })
      if (close === true) return
      emit('updateSearch', states.selectData)
      handleCancel()
    }
    const handleChange = (_item, val, parentIndex) => {
      states.selectData = states.selectData.filter((item) => item)
      states.selectItem[_item.key] = val || undefined
      const _index = (states.selectData || []).findIndex(
        (item) => item?.key === _item.key
      )
      const dataList = props.selectItemData.selectList[parentIndex].dataList
      const text =
        (dataList.find((item) => item.dictValue === val) || {}).dictLabel || ''
      states.selectData[_index].value = val
      states.selectData[_index].text = text || ''
      states.selectData[_index].type = _item.type
       if (_item.customFlag) {
        handleRange(_item.key, parentIndex, val)
      }
    }
    const handleShow = () => {
      if ($refs.dropdown.visible) {
        states.closeFlag = false
      } else {
        states.closeFlag = true
        $refs.dropdown.visible = true
      }
    }
    const handleInput = (item) => {
      const curIndex = (states.selectData || []).findIndex(
        (curItem) => curItem.key === item.key
      )
      if (curIndex > -1) {
        states.selectData[curIndex] = {
          ...states.selectItem[item.key]
        }
      } else {
        states.selectData.push({
          ...states.selectItem[item.key]
        })
      }
    }
    const toggleDropdown = (val) => {
      if (!val && states.closeFlag) {
        $refs.dropdown.visible = true
      }
    }
    const handleDatePicker = (item, parentIndex) => {
      states.selectData[parentIndex] = {
        ...item,
        value: {
          start: states.selectItem[item.key][0]
            ? states.selectItem[item.key][0] + ' 00:00:00'
            : '',
          end: states.selectItem[item.key][1]
            ? states.selectItem[item.key][1] + ' 23:59:59'
            : ''
        },
        text:
          states.selectItem[item.key][0] +
          ' 至 ' +
          states.selectItem[item.key][1]
      }
    }
    const handleRange = (key, parentIndex, val) => {
      // 选择了列表值，将自定义区间的第一个修改为筛选的值
       if (val) {
          $set(states.selectRange, key + 'Start', +states.selectItem[key])
          $set(states.selectRange, key + 'End', undefined)
          return
        }
       states.selectItem[key] = states.selectRange[key + 'End']
        ? `${states.selectRange[key + 'Start'] || 0} ~ ${
            states.selectRange[key + 'End']
          }`
        : states.selectRange[key + 'Start'] + ''
      states.selectData[parentIndex] = {
        ...states.selectData[parentIndex],
        start: states.selectRange[key + 'Start'] || 0,
        end: states.selectRange[key + 'End'] || '',
        text: states.selectRange[key + 'End'] ? states.selectItem[key] : states.selectItem[key] + '～无限',
        value: val || '',
        type: 'select',
        customFlag: true
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
    onMounted(() => {
      document.addEventListener('click', domClick)
    })
    onUnmounted(() => {
      document.removeEventListener('click', domClick)
    })
    return {
      ...toRefs(states),
      handleReset,
      handleShow,
      handleConfirm,
      handleCancel,
      handleChange,
      toggleDropdown,
      handleInput,
      handleDatePicker,
      handleRange
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
.drop {
  .input-xs {
    width: 100px !important;
  }
  padding: 0 12px;
  &-label {
    font-size: 14px;
    margin-right: 4px;
  }
  &-select-item:nth-child(2n + 1) {
    margin-right: 24px;
  }
}
.select-drap{
  padding: 16px;
  ::v-deep{
    .el-input-number--small{
      width: 100px !important;
    }
  }
}
</style>
