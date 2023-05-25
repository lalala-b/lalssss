<template>
  <Wrap class="m-b-12 juxing-info">
    <h3 class="m-b-20">流量助推</h3>
    <div class="flex">
      <div class="info-item-money">
        <div>
          {{
            detail.frozenAmount || detail.frozenAmount === 0
              ? detail.frozenAmount
              : '-'
          }}
        </div>
        <div class="money-name">冻结金额(元)</div>
      </div>
      <div class="m-l-16">
        <div>
          {{
            detail.consumptionAmount || detail.consumptionAmount === 0
              ? detail.consumptionAmount
              : '-'
          }}
        </div>
        <div class="money-name">消耗金额(元)</div>
      </div>
    </div>
  </Wrap>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    detail: {
      type: Object,
      default: () => {}
    },
    step: {
      type: Number,
      default: 0
    }
  },
  setup(props, { emit }) {
    // const { $message } = getCurrentInstance().proxy
    return {}
  }
})
</script>
<style lang="scss" scoped>
.juxing-info {
  .info-item-money {
    padding-right: 16px;
    border-right: 1px solid #f3f3f3;
    margin-left: 16px;
  }
  .money-name {
    color: #888;
    margin-top: 16px;
  }
}
</style>
