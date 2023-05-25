<template>
  <el-dialog
    title="选择显示的指标"
    :visible="show"
    width="880px"
    @close="onClose"
  >
    <div class="selectAllBox">
      <el-button
        type="text"
        class="m-l-8"
        @click="
          () =>
            handleChangeSelectAll(
              config.findIndex((item) => !item.defaultShow) > -1
            )
        "
      >
        {{
          config.findIndex((item) => !item.defaultShow) > -1
            ? '全选'
            : '取消全选'
        }}
      </el-button>
    </div>
    <div class="flex">
      <div>
        <div>
          <span
            v-for="(it) in config"
            :key="it.name"
            class="m-r-24 m-t-8 checkBox"
          >
            <el-checkbox
              v-model="it.defaultShow"
              :label="it.name"
              :true-label="1"
              :false-label="0"
              :disabled="!it.cancel"
            />
            <IconTip
              v-if="it.tip"
              :content="it.tip"
              icon-class="iconwenhao"
            />
          </span>
        </div>
      </div>
    </div>

    <div slot="footer" class="M-caseDialogFooter">
      <el-button @click="onClose">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {
  defineComponent,
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

    const handleChangeSelectAll = (val) => {
      state.config = state.config.map(item => {
        const newItem = { ...item }
        newItem.defaultShow = val ? 1 : 0
        return newItem
      })
    }

    return {
      ...toRefs(state),
      onClose,
      onConfirm,
      handleChangeSelectAll
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

.selectAllBox {
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
}
</style>
