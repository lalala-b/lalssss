<template>
  <el-dialog
    :visible="show"
    title="批量找号"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-select
      v-if="type === 'other'"
      v-model="plat"
      class="platSelect"
      placeholder="请选择平台"
    >
      <el-option
        v-for="item in plats"
        :key="item.platId"
        :label="item.platName"
        :value="item.platId"
      />
    </el-select>
    <span v-else>平台：{{ type === 'douyin' ? '抖音' : type === 'kuaishou' ? '快手' : type === 'bilibili' ? 'B站' : type === 'xiaohongshu' ? '小红书' : '' }}</span>

    <div class="description">请输入<span class="alt">账号名称</span>，一行一个，最多200个</div>

    <el-input
      v-model="accounts"
      :placeholder="type === 'other' ? '请选择平台后再输入账号名称' : '输入账号名称' "
      :disabled="!plat"
      type="textarea"
      :rows="10"
    />
    <span v-show="showError" class="error">请输入账号信息！</span>

    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, computed, watch } from '@vue/composition-api'
import { IconTip } from 'components'
import { $getFinalAccountList, $chooseFinalAccount } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    batchSearchValue: {
      type: Array,
      default: () => []
    },
    batchSearchPlatId: {
      type: String | Number,
      default: ''
    },
    platList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $confirm, $router, $refs, $nextTick } = getCurrentInstance().proxy

    const showDialog = computed(() => props.show)

    const plats = computed(() => props.platList)

    const state = reactive({
      listLoading: true, //
      btnLoading: false,
      plat: '',
      accounts: '',
      showError: false
    })

    watch(showDialog, (val) => {
      if (val) {
        if (props.type === 'douyin') {
          state.plat = 25
        } else if (props.type === 'kuaishou') {
          state.plat = 26
        } else if (props.type === 'bilibili') {
          state.plat = 2
        } else if (props.type === 'xiaohongshu') {
          state.plat = 45
        } else if (props.type === 'other') {
          state.plat = ''
        }
        state.accounts = props.batchSearchValue.slice(0, 200).join('\n') || ''
        if (props.batchSearchPlatId) {
          state.plat = +props.batchSearchPlatId
        }
        state.showError = false
        // state.listLoading = false
      }
    })

    watch(plats, (val) => {
      if (val.length) {
        // state.listLoading = false
      }
    })

    watch(() => state.plat, () => {
      // state.accounts = ''
    })

    watch(() => state.accounts, (val) => {
      const accountArr = encodeURIComponent(val).split('%0A').map(item => decodeURIComponent(item).replace(/^\s*|\s*$/g, '')).filter(item => item)
      if (accountArr.length) {
        state.showError = false
        return
      }
    })

    const handleClose = () => {
      emit('close')
    }

    const handleConfirm = async() => {
      const accountArr = encodeURIComponent(state.accounts).split('%0A').map(item => decodeURIComponent(item).replace(/^\s*|\s*$/g, '')).filter(item => item)
      if (!accountArr.length) {
        state.showError = true
        return
      }

      state.showError = false

      if (accountArr.length > 200) {
        $message.error('账号最多200个')
        return
      }

      emit('search', { accounts: accountArr, plat: state.plat })
      emit('close')
    }

    return {
      ...toRefs(state),
      handleClose,
      handleConfirm,
      plats
    }
  }
})
</script>

<style lang="scss" scoped>
.platSelect {
  width: 100%;
}

.description {
  margin: 16px 0;
}

.alt {
  color: #2c64ff;
}

.error {
  color: #ff0000;
  font-size: 10px;
}
</style>
