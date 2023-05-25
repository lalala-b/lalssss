<template>
  <div class="select-box">
    <el-dropdown
      ref="dropdown"
      trigger="click"
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
      <el-dropdown-menu slot="dropdown">
        <div class="drop">
          <el-checkbox-group
            v-model="selectItem.selectArr"
            @change="handleCheckedChange"
          >
            <el-checkbox
              v-for="item in selectItemData.checkBoxList"
              :key="item.dictValue"
              :label="item.dictValue"
              style="display: block"
            >
              {{ item.dictLabel }}
            </el-checkbox>
          </el-checkbox-group>
          <div v-if="tagList.length && selectItemData.showTag" class="tag-box">
            <el-tag
              v-for="item in tagList"
              :key="item.dictValue"
              size="mini"
              class="m-r-8 m-b-8"
            >{{ item.dictLabel }}</el-tag>
          </div>
          <template v-if="selectItemData && selectItemData.selectKey">
            <el-select
              ref="select"
              v-model="selectItem.selectValue"
              clearable
              class="drop-select m-t-12"
              :placeholder="selectItemData.placeholder"
              @change="handleChangeSelect"
              @click.native.stop
            >
              <el-option
                v-for="item in selectItemData.dataList"
                :key="item.dictValue"
                :value="item.dictValue"
                :label="item.dictLabel"
              />
            </el-select>
          </template>
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
                class="reset"
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
      visible: false,
      tagList: [],
      closeFlag: true,
      isSelected: false, // 是否已经选中提交
      selectItem: {
        selectArr: [],
        selectValue: '',
        selectValueTxt: {}
      }
    })
    // 监听是否存在已有的筛选值
    watch(
      () => props.defaultValue,
      (val) => {
        if (val && val.value) {
          if (states.isSelected) return
          states.selectItem.selectValueTxt = val.value.selectValueTxt
          if (val.value.selectValue) {
            states.selectItem.selectValue = val.value.selectValue
            handleChangeSelect(val.value.selectValue)
          }
          if (val.value.selectArr && val.value.selectArr.length) {
            states.selectItem.selectArr = val.value.selectArr
            handleCheckedChange(val.value.selectArr)
          }
          handleConfirm()
        }
      },
      { deep: true }
    )
    const handleCancel = () => {
      states.closeFlag = false
      $refs.dropdown.visible = false
    }
    const handleConfirm = () => {
      if (states.selectItem.selectArr.length || states.selectItem.selectValue) {
        if (!states.selectItem.selectArr.length) {
          $message.warning('请选择' + props.selectItemData.label.replace('分布', ''))
          return
        }
        if (props.selectItemData.selectKey && !states.selectItem.selectValue) {
          $message.warning(props.selectItemData.placeholder)
          return
        }
        emit('updateSearch', states.selectItem)
        states.isSelected = true
      } else {
        emit('updateSearch')
        states.isSelected = false
      }
       handleCancel()
    }
    // 重置
    const handleReset = (close) => {
      states.isSelected = false
      states.selectItem.selectArr = []
      states.tagList = []
      states.selectItem.selectValue = ''
      states.selectItem.selectValueTxt = {}
      if (close === true) return
      emit('updateSearch')
      handleCancel()
    }
    // 多选
    const handleCheckedChange = (val = []) => {
      states.tagList = props.selectItemData.checkBoxList.filter((item) =>
        val.includes(item.dictValue)
      )
      // 获取dictLabel
      const checkBoxArr = []
      states.tagList.forEach((item, index) => {
        checkBoxArr.push(item.dictLabel)
      })
      states.selectItem.selectValueTxt.checkBoxArr = checkBoxArr
      states.selectItem.selectArr = val
    }
    // 筛选列表
    const handleChangeSelect = (val) => {
      const item =
        props.selectItemData.dataList.find((item) => item.dictValue === val) ||
        {}
      if (item.dictLabel) {
        states.selectItem.selectValueTxt.selectTxt = item.dictLabel
      } else {
        states.selectItem.selectValueTxt.selectTxt = ''
      }
      $set(states.selectItem, 'selectValue', val)
      states.selectItem.selectValue = val
    }
    // 点击菜单可收起
    const handleShow = () => {
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
      handleCheckedChange,
      handleChangeSelect,
      handleCancel,
      toggleDropdown
    }
  }
})
</script>

<style lang="scss" scoped>
.blue-tip {
  color: #2c64ff;
}
.select-drap {
  .input-xs {
    width: 100px;
  }
  padding: 0 24px;
  &-box {
    border-top: 1px solid #eee;
    padding-top: 8px;
  }
}
.el-dropdown-link {
  cursor: pointer;
}
.drop {
  padding: 0 12px;
  min-width: 200px;
  .el-checkbox {
    line-height: 30px;
  }
  &-select {
    width: 246px;
  }
  .tag-box {
    width: 200px;
    padding-top: 12px;
    border-top: 1px solid #eee;
  }
}
</style>
