<template>
  <div class="summary">
    <h2>总数据概览</h2>
    <ul class="flex m-t-16">
      <li v-for="(item, key) in list" :key="key">
        <div class="flex flex-align-center">
          <div class="title">{{ item.text }}</div>
          <IconTip
            v-if="item.tip"
            type="popover"
            :content="item.tip"
            icon-class="iconwenhao"
          />
        </div>
        <h3 data-bold>{{ (item.val === '' || item.val === undefined ? '--' : item.val) | toThousandFilter }}</h3>

        <slot :item="item" />
      </li>
    </ul>
    <slot name="more" />
  </div>
</template>
<script>
import { IconTip } from 'components'
export default {
  components: { IconTip },
  props: {
    list: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .summary {
    padding: 24px;
    background: #fff;
    li {
      flex: 1;
      padding: 24px;
      margin-right: 16px;
      background: #FAFAFA;
      border-radius: 4px;
      min-height: 104px;
      &:last-child {
        margin-right: 0;
      }
      .title {
        font-size: 14px;
        line-height: 20px;
        color: rgba(0, 0, 0, 0.85);
        margin-right: 8px;
      }
      h3 {
        margin-top: 4px;
        font-size: 30px;
        color: #000000;
        line-height: 32px;
      }
    }
  }
</style>
