<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-02 11:18:01
 * @LastEditTime: 2020-10-30 15:25:16
 * @LastEditors: Linjie
-->
<template>
  <el-form-item>
    <el-select :value="value" :filterable="true" clearable placeholder="全部平台" @input="handleInput">
      <el-option v-for="(item, index) in data" :key="index" :label="item.label" :value="item.value" />
    </el-select>
  </el-form-item>
</template>
<script>
import { $getPlatCondition } from '@/api'

export default {
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    inline: {
      type: Boolean,
      default: true
    },
    query: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      data: []
    }
  },
  created() {
    this.getPlatCondition()
  },
  methods: {
    /**
     * 获取平台列表
     */
    async getPlatCondition() {
      const res = await $getPlatCondition({
        ...this.query
      })
      if (res.code === 1) {
        this.data = res.data.map(item => {
          return {
            label: item.platName,
            value: item.platId
          }
        })
      }
    },
    handleInput(val) {
      this.$emit('input', val)
      this.$emit('platChange', val)
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-platform { margin-right: 10px;
    vertical-align: top;
    &.inline {
      display: inline-block;
    }
  }
</style>
