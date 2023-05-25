<template>
  <div class="content-wrapper">
    <div v-if="content&&content.length">
      <el-popover
        v-if="(content || '').length > showCount"
        :width="width"
        trigger="hover"
        :content="content"
        placement="top"
      >
        <span slot="reference">{{
          `${(content|| '').substr(0, showCount)}...`
        }}</span>
      </el-popover>
      <span v-else>{{ content }}</span>
    </div>
    <span v-else>--</span>
  </div>
</template>
<script>
import {
  defineComponent
} from '@vue/composition-api'

export default defineComponent({
  props: {
    width: {
      type: Number,
      default: 200
    },
    content: {
      type: String,
      default: ''
    },
    showCount: {
      type: Number,
      default: 20
    }
  },
  setup(props) {
  }
})
</script>

<style lang='scss' scoped>
.content-wrapper{
  cursor: pointer;
}
</style>
