<template>
  <div class="C-putting-order-sort">
    <div class="flex">
      <div class="flex-key">排序</div>
      <div class="flex-value">
        <el-radio-group v-model="sort" @change="handleSort">
          <el-radio-button label="">全部</el-radio-button>
          <el-radio-button label="consumeAmount">平台消耗金额</el-radio-button>
          <el-radio-button label="deliveryMoney">投放价格</el-radio-button>
          <el-radio-button label="flowCount">流量</el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      sort: ''
    }
  },
  methods: {
    handleSort() {
      this.$emit('update')
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-sort {
    display: flex;
    flex-direction: row-reverse;
    margin-bottom: 20px;
    .flex {
      display: flex;
      &-key {
        display: flex;
        align-items: center;
        font-size: 16px;
        margin-right: 10px;
      }
      &-value {
        flex: 1;
      }
    }
  }
</style>
