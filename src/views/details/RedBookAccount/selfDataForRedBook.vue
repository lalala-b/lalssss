<template>
  <Wrap class="m-t-16" :has-shadow="true">
    <h3 class="self-head">
      <span>内部自营信息</span>
    </h3>
    <ul class="m-t-16">
      <li>账号统一名称：{{ selfData.belongName || '--' }}</li>
      <li>账号归属：{{ selfData.dname }}-{{ selfData.fname }}</li>
      <li>运营负责人：{{ selfData.operatorName || '--' }}</li>
      <li>绑定的用户：
        <template v-if="(selfData.userList || []).length">
          <el-tag v-for="item in selfData.userList" :key="item" class="m-r-5 m-b-5" size="small">{{ item }}</el-tag>
        </template>
        <span v-else>--</span>
      </li>
      <li>绑定手机号：
        <template v-if="(selfData.bindPhone || []).length">
          <el-tag v-for="item in selfData.bindPhone" :key="item" class="m-r-5 m-b-5" size="small">{{ item }}</el-tag>
        </template>
        <span v-else>--</span>
      </li>
    </ul>
  </Wrap>
</template>
<script>

export default {
  props: {
    selfData: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style scoped lang="scss">
  .self-head {
    font-size: 16px;
    font-weight: 600;
  }

  li {
    margin-bottom: 10px;
  }
</style>
