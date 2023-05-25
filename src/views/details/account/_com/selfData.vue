<template>
  <Wrap class="m-t-16" :has-shadow="true">
    <h3 class="flex">
      <span data-bold>内部自营信息</span>
    </h3>
    <ul class="m-t-16">
      <li>账号统一名称：{{ info.belongName }}</li>
      <li>账号归属：{{ info.dname }}-{{ info.fname }}</li>
      <li>运营负责人：{{ info.operatorName }}</li>
      <li>绑定的用户：<el-tag v-for="item in info.userList" :key="item" class="m-r-5 m-b-5" size="small">{{ item }}</el-tag></li>
      <li>绑定手机号：<el-tag v-for="item in info.bindPhone" :key="item" class="m-r-5 m-b-5" size="small">{{ item }}</el-tag></li>
    </ul>
  </Wrap>
</template>
<script>

export default {
  components: {
  },
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">
  li {
    margin-bottom: 10px;
  }
</style>
