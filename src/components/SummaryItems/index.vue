<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-08 11:56:10
 * @LastEditTime: 2020-10-09 15:33:17
 * @LastEditors: Luoxd
-->
<template>
  <ul v-loading="loading" class="data-num-view">
    <li v-for="item in summaryItems" :key="item.key">
      <span>
        <el-popover
          v-if="item.tip"
          placement="top-start"
          width="300"
          trigger="hover"
          :content="item.tip"
        >
          <div slot="reference">
            {{ item.text }}
            <i class="el-icon-question" />
          </div>
        </el-popover>
        <template v-else>
          {{ item.text }}
        </template>
      </span>
      <strong>{{ item.val || 0 | toThousands }}{{ item.unit || '' }}</strong>
    </li>
  </ul>
</template>
<script>
export default {
  props: {
    summaryItems: {
      type: Array,
      default: function() {
        return []
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="scss">

</style>
