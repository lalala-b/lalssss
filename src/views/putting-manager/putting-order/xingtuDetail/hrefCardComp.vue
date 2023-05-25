<template>
  <el-card class="cardWrap" shadow="never">
    <div slot="header" class="header">
      <div class="name">
        <svg-icon v-if="compType === 1" icon-class="ele" />
        <svg-icon v-else-if="compType === 15" icon-class="menu" />
        <span>{{ headerName }}</span>
      </div>
      <el-tooltip :content="isOpen ? '打开链接' : '复制监测链接'" placement="bottom">
        <i v-if="compType !== 15" class="icon el-icon-link" @click="handleLink" />
      </el-tooltip>
    </div>

    <div class="cardBody">
      <slot />
    </div>
  </el-card>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, watch } from '@vue/composition-api'

export default defineComponent({
    props: {
      headerName: {
        type: String,
        default: ''
      },
      linkHref: {
        type: String,
        default: ''
      },
      isOpen: {
        type: Boolean,
        default: true
      },
      compType: {
        type: Number,
        default: 0
      }
    },

  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { navigator } = window
    const { isOpen } = props

    const state = reactive({
      link: ''
    })

    watch(() => props.linkHref, (newVal) => {
      state.link = newVal
    }, {
      immediate: true
    })

    const handleLink = () => {
      if (!isOpen) {
        navigator.clipboard.writeText(state.link).then()
        $message.success('复制成功')
      } else {
        window.open(state.link)
      }
    }

    return {
      handleLink
    }
  }
})
</script>
<style lang="scss" scoped>
  .cardWrap {
    background: #fafafa;
    width: 380px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .name {
        display: flex;
        align-items: center;
        span {
          margin-left: 6px;
        }
      }

      .icon {
        font-size: 16px;
        cursor: pointer;
      }
    }

  ::v-deep {
    .cardBody {
      width: 100%;
      word-wrap: break-word;

      div {
        margin-bottom: 10px;
      }

      i {
        color: rgb(158, 149, 149);
        margin-right: 10px;
      }
    }
  }

  }
</style>
