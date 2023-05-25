<template>
  <Wrap v-loading="loading">
    <ul class="list flex flex-wrap">
      <li>账号状态：{{ data.accountStatus == 0 ? '上架' : '下架' }}</li>
      <li>返点：{{ data.rebate || 0 }}%</li>
      <li>联系方式：{{ data.bindPhone || '--' }}</li>
      <li>省市地址：{{ data.provName }} - {{ data.cityName }}</li>
      <li>媒介采买人：{{ data.realName || '--' }}</li>
      <li v-if="data.createTime" class="block">媒介账号添加时间：{{ data.createTime || '--' }}</li>
      <li class="block">备注：{{ data.realName || '--' }}</li>
    </ul>
  </Wrap>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { IconTip } from 'components'
export default defineComponent({
  components: { IconTip },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
  }
})
</script>

<style lang="scss" scoped>
.list {
  li {
    &.block {
      width: 100%;
      max-width: 100%;
    }
    width: 20%;
    max-width: 245px;
    min-width: 220px;
    font-size: 16px;
    color: #595959;
    line-height: 22px;
    margin-bottom: 16px;
    margin-right: 12px;
  }
}
</style>
