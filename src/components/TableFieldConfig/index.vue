<template>
  <el-dialog
    title="设置显示的字段"
    :visible="show"
    width="880px"
    @close="onClose"
  >
    <div class="flex" style="justify-content: space-around">
      <div>
        <div v-for="(item, index) in config" :key="`${item.name}${item.field}`" class="m-b-24">
          <div v-if="item.name" class="title">
            <h3 style="display: inline-block">{{ item.name }}</h3>
            <el-button
              v-if="(item.children || []).findIndex((item) => item.cancel) > -1"
              type="text"
              class="m-l-8"
              @click="
                () =>
                  handleChangeSelectAll(
                    item.children.findIndex((item) => !item.defaultShow) > -1,
                    index
                  )
              "
            >
              {{
                item.children.findIndex((item) => !item.defaultShow) > -1
                  ? '全选'
                  : '取消全选'
              }}
            </el-button>
          </div>
          <div :class="[!item.name && 'underline']">
            <span
              v-for="(it, idx) in item.children"
              :key="it.name"
              class="m-r-24 m-t-8 checkBox"
            >
              <template>
                <el-checkbox
                  v-model="it.defaultShow"
                  :label="it.name"
                  :true-label="1"
                  :false-label="0"
                  :disabled="!it.cancel"
                  @change="(e) => handleChangeCheckBox(e, it.name, index, idx, it)"
                />
                <IconTip
                  v-if="it.tip"
                  :content="it.tip"
                  icon-class="iconwenhao"
                />
                <div v-if="it.type === 'radioGroup'" class="flex flex-wrap m-t-8">
                  <div v-for="(radioItem, radioIndex) in it.radioChildren" :key="radioItem.title" class="radioGroupItem">
                    <span>{{ radioItem.title }}</span>
                    <el-radio-group
                      v-model="radioItem.defaultSelect"
                      :disabled="!it.defaultShow"
                      @input="(e) => handleInputRadio(e, index, idx, radioIndex)"
                    >
                      <el-radio-button
                        v-for="portraitItem in radioItem.options"
                        :key="portraitItem"
                        :label="portraitItem"
                      />
                    </el-radio-group>
                  </div>
                </div>
              </template>
            </span>
          </div>
        </div>
      </div>

      <div class="treebox">
        <el-tree
          ref="tree"
          :data="treeSortData"
          node-key="name"
          default-expand-all
          :props="{ label: 'name' }"
          draggable
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drop="handleDrop"
        >
          <span
            slot-scope="{ node, data }"
            class="custom-tree-node flex flex-space-between"
          >
            <span>
              <i v-if="data.cancel" class="el-icon-more" />
              <span :class="!data.cancel && 'disableSpan'">{{
                node.label
              }}</span>
            </span>
            <span>
              <i
                v-if="data.cancel"
                class="el-icon-close"
                @click="() => handleRemoveNode(node, data)"
              />
            </span>
          </span>
        </el-tree>
        <!--

          @node-drag-start="handleDragStart"
          @node-drag-enter="handleDragEnter"
          @node-drag-leave="handleDragLeave"
          @node-drag-over="handleDragOver"
          @node-drag-end="handleDragEnd"
          @node-drop="handleDrop" -->
      </div>
    </div>

    <div slot="footer" class="M-caseDialogFooter">
      <el-button @click="onClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="onConfirm"
      >确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onMounted,
  reactive,
  toRefs,
  computed,
  getCurrentInstance
} from '@vue/composition-api'
import { $updateMenuConfigData, $getMenuConfigData } from '@/api/proprietary-orders'
import IconTip from '@/components/IconTip'

export default defineComponent({
  components: {
    IconTip
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    code: {
      default: '',
      type: String
    },
    configData: {
      default: () => [],
      type: Array
    },
    sortData: {
      default: () => [],
      type: Array
    }
  },

  setup(props, { emit }) {
    const { $message, $store } = getCurrentInstance().proxy

    const state = reactive({
      config: JSON.parse(JSON.stringify(props.configData)),
      sortConfig: JSON.parse(JSON.stringify(props.sortData)),
      loading: false
    })

    const treeSortData = computed(() => {
      return state.sortConfig.map((item) => {
        const newItem = { ...item }
        delete newItem.children
        return newItem
      })
    })

    onMounted(() => {})

    const handleDrop = () => {
      state.sortConfig = [...treeSortData.value].map(item => {
        const newItem = { ...item }
        const allSortData = props.configData.map(item => item.children).flat(Infinity)
        const index = allSortData.findIndex(it => it.field === newItem.field)
        if ((allSortData[index].children || []).length) {
          newItem.children = allSortData[index].children
        }

        return newItem
      })
    }

    const allowDrop = (draggingNode, dropNode, type) => {
      return type !== 'inner'
    }

    const allowDrag = (draggingNode) => {
      return draggingNode.data.cancel
    }

    const changeConfigShowStatus = (data = state.config, name, flag) => {
      const config = JSON.parse(JSON.stringify(data))
      for (let i = 0; i < config.length; i++) {
        if (config[i].name === name) {
          config[i].defaultShow = flag

          state.config = config
          return
        } else {
          for (let j = 0; j < (config[i].children || []).length; j++) {
            if (config[i].children[j].name === name) {
              config[i].children[j].defaultShow = flag

              state.config = config
              return
            }
          }
        }
      }
    }

    const handleRemoveNode = (node, data) => {
      const sortConfig = JSON.parse(JSON.stringify(state.sortConfig))
      const sortIndex = sortConfig.findIndex((item) => item.name === data.name)
      sortConfig.splice(sortIndex, 1)
      state.sortConfig = sortConfig
      changeConfigShowStatus(state.config, data.name, false)
    }

    const handleChangeCheckBox = (e, name, index, idx, item) => {
      const sortConfig = JSON.parse(JSON.stringify(state.sortConfig))
      // 取消勾选
      if (!e) {
        const sortIndex = sortConfig.findIndex((item) => item.name === name)
        sortConfig.splice(sortIndex, 1)
      } else {
        const configItem = { ...state.config[index].children[idx] }
        sortConfig.push(configItem)
      }
      state.sortConfig = sortConfig

      if (!e && (item || {}).type === 'radioGroup') {
        const config = JSON.parse(JSON.stringify(state.config))
        const sortConfig = JSON.parse(JSON.stringify(state.sortConfig))


        config[index].children[idx].radioChildren = config[index].children[idx].radioChildren.map(item => {
          const newItem = { ...item }
          newItem.defaultSelect = newItem.options[0]
          newItem.defaultIndex = 0
          return newItem
        })

        state.config = config
      }
    }

    const handleInputRadio = (e, index, idx, radioIndex) => {
      const config = JSON.parse(JSON.stringify(state.config))
      const sortConfig = JSON.parse(JSON.stringify(state.sortConfig))

      config[index].children[idx].radioChildren[radioIndex] = {
        ...config[index].children[idx].radioChildren[radioIndex],
        defaultIndex: config[index].children[idx].radioChildren[radioIndex].options.indexOf(e)
      }

      // 找到对应的sort中的元素
      const currentSortItem = sortConfig.find(item => item.field === config[index].children[idx].field)
      // 对应的排序的也要改
      currentSortItem.radioChildren[radioIndex] =  {
        ...currentSortItem.radioChildren[radioIndex],
        defaultIndex: currentSortItem.radioChildren[radioIndex].options.indexOf(e),
        defaultSelect: e
      }

      state.config = config
      state.sortConfig = sortConfig
    }

    const handleChangeSelectAll = (flag, index) => {
      const config = JSON.parse(JSON.stringify(state.config))

      // 为真时全选
      if (flag) {
        for (let i = 0; i < (config[index].children || []).length; i++) {
          if (config[index].children[i].defaultShow) {
            continue
          } else {
            config[index].children[i].defaultShow = 1
            handleChangeCheckBox(1, config[index].children[i].name, index, i, config[index].children[i])
          }
        }
      } else {
        // 取消全选
        for (let i = 0; i < (config[index].children || []).length; i++) {
          config[index].children[i].defaultShow = 0
          handleChangeCheckBox(0, config[index].children[i].name, index, i, config[index].children[i])
        }
      }

      state.config = config
    }

    const onClose = () => {
      emit('close')
    }

    const onConfirm = async() => {
      try {
        state.loading = true
        const { code, message } = await $updateMenuConfigData({
          menuCode: props.code,
          customColumns: JSON.stringify({ sort: state.sortConfig, config: state.config })
        })
        state.loading = false
        if (+code === 1) {
          const { data } = await $getMenuConfigData({
            menuCodes: [...new Set([
              'config_pirates_select_button',
              'config_pirates_summary_button',
              'export_code_pirate',
              'config_self_select_button',
              'config_self_summary_button',
              'export_code_propriety',
              props.code
            ])].join(',')
          })
          $store.commit('user/SET_CONFIG', [...(data || [])])
          emit('confirm', { sort: [...state.sortConfig], config: [...state.config] })
        } else {
          $message.error(message)
        }
      } catch (e) {
        state.loading = false
        $message.error(e.message)
      }
    }

    return {
      ...toRefs(state),
      treeSortData,
      handleDrop,
      allowDrop,
      allowDrag,
      handleRemoveNode,
      handleChangeCheckBox,
      handleChangeSelectAll,
      handleInputRadio,
      onClose,
      onConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.checkBox {
  display: inline-block;
}

.el-icon-circle-close {
  cursor: pointer;
}

.el-icon-more {
  transform: rotate(90deg);
}

.disableSpan {
  color: #bfbfbf;
  padding-left: 12px;
}

.flex-space-between {
  justify-content: space-between;
  flex: 1;
}

::v-deep {
  .el-tree-node__expand-icon {
    display: none;
  }
}

.treebox {
  flex-shrink: 0;
  width: 200px;
}

.title {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);

  h3 {
    line-height: 32px;
  }
}

.underline {
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  padding-bottom: 18px;
}

.m-b-24 {
  margin-right: 16px;
}

.flex-wrap {
  flex-wrap: wrap;

}

.radioGroupItem {
  width: 50%;
  margin-bottom: 6px;

  span {
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 6px;
  }
}
</style>
