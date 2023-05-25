<template>
  <el-dialog
    title="设置导出的字段"
    :visible="show"
    width="75%"
    @close="onClose"
  >
    <div class="flex">
      <div style="flex: 1">
        <div v-for="(item, index) in config" :key="item.name" class="m-b-24">
          <div class="title">
            <h3 style="display: inline-block">{{ item.name }}</h3>
            <el-button
              v-if="(item.children || []).findIndex((item) => item.cancel) > -1"
              type="text"
              class="m-l-8"
              @click="
                () =>
                  handleChangeSelectAll(
                    item.children.findIndex((item) => !item.exportDefaultShow) > -1,
                    index
                  )
              "
            >
              {{
                item.children.findIndex((item) => !item.exportDefaultShow) > -1
                  ? '全选'
                  : '取消全选'
              }}
            </el-button>
          </div>
          <div>
            <span
              v-for="(it, idx) in item.children"
              :key="it.name"
              class="m-t-8 checkBox flex"
            >
              <el-checkbox
                v-model="it.exportDefaultShow"
                :indeterminate="
                  !(it.selectField || []).length
                    ? false
                    : (it.selectField || []).length !==
                      (it.children || []).length
                "
                :label="it.name"
                :true-label="1"
                :false-label="0"
                :disabled="it.exportNotCancel"
                @change="(value) => handleChangeCheckBox(value, index, idx)"
              />
              <el-select
                v-if="(it.children || []).length"
                v-model="it.selectField"
                :disabled="it.exportNotCancel"
                multiple
                collapse-tags
                class="select select-width"
                style="margin-left: 4px;"
                placeholder="请选择"
                @change="(value) => handleChangeExportSelect(value, index, idx)"
              >
                <el-option
                  v-for="i in it.children"
                  :key="i.name"
                  :label="i.name"
                  :value="i.field"
                />
              </el-select>
              <IconTip
                v-if="it.tip"
                :content="it.tip"
                icon-class="iconwenhao"
              />
            </span>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="M-caseDialogFooter">
      <el-button @click="onClose">取消</el-button>
      <el-button
        type="primary"
        :loading="loading"
        @click="onConfirm"
      >导出</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
  onMounted,
  watch,
  reactive,
  toRefs,
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
    }
  },
  setup(props, { emit }) {
    const { $message, $store } = getCurrentInstance().proxy

    const state = reactive({
      config: JSON.parse(JSON.stringify(props.configData)),
      loading: false
    })

    const loadSelectField = (data) => {
      state.config = data.map((item) => {
        const newItem = { ...item }
        newItem.children = newItem.children.map((it) => {
          const newIt = { ...it }
          if ((newIt.children || []).length) {
            newIt.selectField = newIt.children
              .map((item) => {
                if (item.exportDefaultShow) {
                  return item.field
                }

                return ''
              })
              .filter((it) => it)
          }

          return newIt
        })
        return newItem
      })
    }

    onMounted(() => {
      loadSelectField(props.configData || [])
    })

    const handleChangeSelectAll = (flag, index) => {
      const config = JSON.parse(JSON.stringify(state.config))

      // 为真时全选
      if (flag) {
        for (let i = 0; i < (config[index].children || []).length; i++) {
          if (config[index].children[i].exportDefaultShow) {
            continue
          } else {
            config[index].children[i].exportDefaultShow = 1
            // 有三级聚合
            if ((config[index].children[i].children || []).length) {
              let arr = [...(state.config[index].children[i].children || [])]
              arr = arr.map((item) => {
                item.exportDefaultShow = 1
                return item
              })

              config[index].children[i].children = arr
            }
          }
        }
      } else {
        // 取消全选
        for (let i = 0; i < (config[index].children || []).length; i++) {
          config[index].children[i].exportDefaultShow = 0
          let arr = [...(state.config[index].children[i].children || [])]
          arr = arr.map((item) => {
            item.exportDefaultShow = 0
            return item
          })

          config[index].children[i].children = arr
        }
      }

      state.config = config
      loadSelectField(config || [])
    }

    const handleChangeExportSelect = (value, index, idx, flag) => {
      let arr = [...(state.config[index].children[idx].children || [])]
      arr = arr.map((item) => {
        if (value.indexOf(item.field) > -1) {
          item.exportDefaultShow = 1
        } else {
          item.exportDefaultShow = 0
        }
        return item
      })

      const newConfig = [...state.config]
      newConfig[index].children[idx].children = arr

      // 相等即是全选
      if (value.length === arr.length) {
        newConfig[index].children[idx].exportDefaultShow = 1
      } else {
        newConfig[index].children[idx].exportDefaultShow = 0
      }

      if (flag) return newConfig

      state.config = newConfig
      loadSelectField(newConfig || [])
    }

    const handleChangeCheckBox = (value, index, idx) => {
      const newConfig = [...state.config]

      let arr = [...(state.config[index].children[idx].children || [])]
      arr = arr.map((item) => {
        // 全选
        if (value) {
          item.exportDefaultShow = 1
        } else {
          item.exportDefaultShow = 0
        }
        return item
      })
      newConfig[index].children[idx].children = arr

      if (value) {
        newConfig[index].children[idx].exportDefaultShow = 1
      } else {
        newConfig[index].children[idx].exportDefaultShow = 0
      }

      state.config = newConfig
      loadSelectField(newConfig || [])
    }

    const onClose = () => {
      emit('close')
    }

    const onConfirm = async() => {
      try {
        state.loading = true
        const { code, message } = await $updateMenuConfigData({
          menuCode: props.code,
          customColumns: JSON.stringify({ config: state.config })
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
          emit('confirm', { config: state.config })
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
      handleChangeSelectAll,
      handleChangeExportSelect,
      handleChangeCheckBox,
      onClose,
      onConfirm
    }
  }
})
</script>
<style lang="scss" scoped>
.checkBox {
  display: inline-block;
  margin-right: 20px;
  height: 32px;
  margin-top: 10px;
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
  width: 150px;
}

.title {
  padding-bottom: 4px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);

  h3 {
    line-height: 32px;
  }
}

.m-b-24 {
  margin-right: 16px;
}

.select {
  ::v-deep {
    .el-select__tags {
      max-width: 88% !important;
    }
  }
}
.select-width{
  width: 230px !important;
}
</style>
