<template>
  <div :class="{'flex flex-justify-center': type != 0}" class="budget-wrap">
    <i v-if="type != 0" class="budget-wrap__before" />
    <template v-for="(item, index) in items">
      <div
        :key="index"
        class="flex flex-align-center flex-dir-col budget-wrap__list"
        :class="{'budget-wrap__list-pitcher': type === 0}"
      >
        <i v-if="items.length - 1 === index" class="budget-wrap__ward-before" />
        <i v-if="index === 0 && type !== 0" class="budget-wrap__ward-after" />
        <BudgetItem :item="item" :is-pitcher="type === 0" :param-date="paramDate" :open="open" />
        <template v-if="item.children && item.children.length > 0 && !item.close ">
          <BudgetSubItem
            :items="item.children"
            :type="item.isParent"
            :color="item.color"
            :param-date="paramDate"
            :open="open"
          />
        </template>
      </div>
    </template>
  </div>
</template>
<style lang="scss" scoped></style>
<script>
import BudgetItem from './BudgetItem'
export default {
  name: 'BudgetSubItem',
  components: {
    BudgetItem
  },
  props: {
    open: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default() {
        return []
      }
    },
    type: {
      type: Number,
      default: 1
    },
    paramDate: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>
<style lang="scss" scoped>
  .budget-wrap {
    margin: 0 auto;
    position: relative;
    &__before {
      position: absolute;
      top: -22px;
      left: 89px;
      right: 89px;
      height: 2px;
      background: #3a3838;
    }
    &__list {
      position: relative;
      margin-right: 40px;
      :last-child {
        margin-right: 0;
      }
      &-pitcher {
        position: relative;
        margin-right: 0;
        &:first-child {
          &::after {
            content: "";
            position: absolute;
            left: 50%;
            top: -22px;
            height: 18px;
            width: 2px;
            background: #3a3838;
            transform: translateX(-50%);
          }
          &::before {
            content: "";
            position: absolute;
            top: -6px;
            left: 50%;
            width: 0;
            height: 0;
            border: 4px solid;
            border-color: #3a3838 transparent  transparent;
            transform: translateX(-50%);
          }
        }
      }
    }
    &__ward-before {
      position: absolute;
      top: -22px;
      left: 50%;
      right: 0;
      height: 2px;
      background: #f5f7fa;
      transform: translateX(1px);
      z-index: 2;
    }
    &__ward-after {
      position: absolute;
      top: -22px;
      right: 50%;
      left: 0;
      height: 2px;
      background: #f5f7fa;
      transform: translateX(-1px);
      z-index: 2;
    }
  }
</style>
