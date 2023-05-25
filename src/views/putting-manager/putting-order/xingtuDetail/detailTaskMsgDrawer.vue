<template>
  <el-drawer
    title="任务要求"
    :visible.sync="showDrawer"
    direction="rtl"
    :before-close="handleClose"
  >
    <ProgressRightMsg :data="data" :show-btn="false" />

    <div class="line" />

    <IntelligentMsgComp :data="data" :is-detail="true" />
  </el-drawer>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import ProgressRightMsg from './progressRightMsg.vue'
import IntelligentMsgComp from './intelligentMsgComp.vue'

export default defineComponent({
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },

  components: {
    ProgressRightMsg,
    IntelligentMsgComp
  },

  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    const state = reactive({
      loading: false,
      showDrawer: false
    })

    watch(() => props.show, (newVal) => {
      state.showDrawer = newVal
    }, {
      immediate: true
    })

    const handleClose = () => {
      emit('closeDrawer')
    }

    return {
      ...toRefs(state),
      handleClose
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .el-drawer {
    width: 45% !important;
  }
  .el-drawer__header {
    font-size: 18px;
    color: #000;
    margin-bottom: -10px;
    padding-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .el-drawer__body {
    padding: 0;
    overflow: auto;
  }

  .line {
    height: 1px;
    background: #f0f0f0;
    margin: 0 24px;
  }
}
</style>
