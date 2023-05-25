<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-11 18:00:23
 * @LastEditTime: 2020-09-11 19:00:42
 * @LastEditors: Luoxd
-->
<template>
  <div class="M-select el-select-dropdown el-popper" :style="{ top: top + 'px', left: left + 'px' }">
    <div class="el-scrollbar" style="">
      <div class="el-select-dropdown__wrap el-scrollbar__wrap el-scrollbar__wrap--hidden-default">
        <ul class="el-scrollbar__view el-select-dropdown__list">
          <li v-for="item in list" :key="item.value" class="el-select-dropdown__item" :label="item.label" :value="item.value">
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: '',
      left: 0,
      top: 0,
      list: [
        { label: '1111111', value: '1111111' },
        { label: '2222222', value: '222222' },
        { label: '33333', value: '3333' },
        { label: '44444', value: '4444' }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      window.addEventListener('click', this.onClick, false)
    },
    onClick(node) {
      const { target } = node
      if (target.getAttribute('_selectBtn') === null) {
        return
      }
      const { x, y } = target.getClientRects()[0]
      console.log(x, y, '=--')
      this.top = y
      this.left = x
    }
  }
}
</script>
<style lang="scss" scoped>
  .M-select {
    position: absolute;
  }
</style>
