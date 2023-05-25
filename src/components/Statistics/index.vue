<template>
  <ul v-loading="loading" class="total-wrap" :class="classObject">
    <li
      v-for="(item, index) in list"
      :key="item[mergeOptions.key]"
      :class="['total-list', index === list.length-1 && 'last-total-list']"
    >
      <div v-if="hasIcon && !isInline" class="total-list__icon">
        <svg-icon v-if="iconType(item.icon) === 'svg'" />
        <i
          :class="[item.icon, { iconfont: iconType(item.icon) === 'iconfont' }]"
        />
      </div>
      <div class="total-list__data">
        <strong v-if="direction === 'top'" :class="[item.type === 'error' && 'error']">{{
          item[mergeOptions.value] === null ||
            item[mergeOptions.value] === undefined
            ? '--'
            : item[mergeOptions.value]
        }}<i data-bold>{{ item.unit }}</i></strong>
        <span>
          {{ item[mergeOptions.label] }}
          <span v-if="item[mergeOptions.discription]" class="discription">{{
            item[mergeOptions.discription]
          }}</span>
          <IconTip
            v-if="item[mergeOptions.tip]"
            type="popover"
            :content="item[mergeOptions.tip]"
            icon-class="iconwenhao"
          />
        </span>
        <strong v-if="direction !== 'top'" :class="[item.type === 'error' && 'error']">{{
          item[mergeOptions.value] === null ||
            item[mergeOptions.value] === undefined
            ? '--'
            : item[mergeOptions.value]
        }}<i data-bold>{{ item.unit }}</i></strong>
      </div>
    </li>
  </ul>
</template>
<script>
import { copy } from '../common'
export default {
  components: {
    IconTip: () => import('@/components/IconTip')
  },
  props: {
    data: {
      type: Array,
      require: true,
      default() {
        return []
      }
    },
    options: {
      type: Object,
      default() {
        return {
          label: 'text',
          value: 'val',
          key: 'key',
          tip: 'tip',
          discription: 'discription'
        }
      }
    },
    isInline: {
      default: false,
      type: Boolean
    },
    dark: {
      default: false,
      type: Boolean
    },
    hasIcon: {
      default: false,
      type: Boolean
    },
    loading: {
      default: false,
      type: Boolean
    },
    direction: {
      type: String,
      default: ''
    }
  },
  computed: {
    mergeOptions() {
      return Object.assign({}, this.options, this.defaultOptions)
    },
    list() {
      return this.data.map((item) => {
        const cpItem = copy(item)
        const value = cpItem[this.mergeOptions.value]
        cpItem.unit = ''
        if (!value) return cpItem
        if (value > 100000000 || value < -100000000) {
          cpItem[this.mergeOptions.value] = Number(
            (value / 100000000).toFixed(2)
          )
          cpItem.unit = '亿'
        } else if (value > 10000 || value < -10000) {
          cpItem[this.mergeOptions.value] = Number((value / 10000).toFixed(2))
          cpItem.unit = 'W'
        }
        return cpItem
      })
    },
    classObject() {
      return {
        'total-wrap__inline': this.isInline,
        'total-wrap__icons': this.hasIcon,
        'total-wrap__dark': this.dark
      }
    }
  },
  methods: {
    iconType(iconClass) {
      if (!iconClass) {
        return ''
      }
      if (iconClass.indexOf('el') === 0) {
        return 'el'
      } else if (iconClass.indexOf('icon') === 0) {
        return 'iconfont'
      }
      return 'svg'
    }
  }
}
</script>
<style lang="scss" scoped>
.total-wrap {
  display: flex;
  align-items: center;
  width: 100%;
  height: 92px;
  overflow: auto;

  &__dark {
    background: rgba(0, 95, 246, 0.05);
    .total-list {
      &::after {
        display: none;
      }
    }
  }
  .total-list {
    position: relative;
    display: flex;
    flex: 1;
    justify-content: center;
    flex-shrink: 0;
    min-width: 15%;

    &:last-child::after {
      width: 0;
    }
    &::after {
      content: '';
      position: absolute;
      right: 0;
      top: 50%;
      height: 56px;
      width: 1px;
      background: #f0f0f0;
      transform: translateY(-50%);
    }
    &__data {
      display: flex;
      flex-direction: column;
      align-items: center;
      span {
        line-height: 20px;
        font-size: 14px;
        margin-bottom: 8px;
        text-align: center;
      }

      .discription {
        color: rgb(177, 176, 176);
        font-size: 10px;
        display: block;
        margin-bottom: -8px;
        text-align: center;
      }

      strong {
        font-weight: bold;
        line-height: 32px;
        font-size: 30px;
        color: $--color-primary;
        i {
          line-height: 22px;
          font-weight: Semibold;
          font-size: 16px;
          margin-left: 4px;
        }
      }
    }
  }

  .last-total-list::after {
    width: 0;
  }

  &__icons {
    .total-list {
      &__icon {
        width: 64px;
        height: 64px;
        margin-right: 8px;
        border-radius: 50%;
        background: #fff;
        text-align: center;
        line-height: 64px;
        color: $--color-primary;
        i {
          font-size: 64px;
        }
      }
      &__data {
        align-items: flex-start;
      }
    }
  }
  &__inline {
    .total-list {
      &::after {
        display: none;
      }
      &__data {
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        span {
          margin-bottom: 0;
          margin-right: 4px;
        }
      }
    }
  }
}

.error {
  color: #F56C6C !important;
}
</style>
