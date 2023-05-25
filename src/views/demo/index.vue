<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-08-25 14:35:10
 * @LastEditTime: 2020-10-12 14:05:55
 * @LastEditors: Linjie
-->
<template>
  <div>
    <Search
      ref="search"
      :config="formConf"
      @submit="onSubmit"
      @change="onSearchChange"
      @export="onExport"
    >
      <template v-slot:btns>
        <el-button type="primary">按钮X</el-button>
      </template>
    </Search>
  </div>
</template>

<script>
export default {
  name: 'Demo',
  data() {
    return {
      msg: this.$router.history.current.meta.title,
      demos: [1, 2, 3]
    }
  },
  computed: {
    show() {
      console.log(2222)
      return true
    }
  },
  activated() {
    console.log('activated')
  },
  methods: {
    demo() {
      console.log(111)
      return '指令优先级'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>
