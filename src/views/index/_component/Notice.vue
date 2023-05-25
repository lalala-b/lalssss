<template>
  <Wrap>
    <Head title="公告" @click="handleMoreClick" />
    <ul>
      <li v-for="item in list" :key="item.title" class="flex flex-align-center notice-list-item" @click="handleMoreClick">
        <div class="notice-list-item__title">
          <h2 class="text-over-hidden">{{ item.title }}</h2>
        </div>
        <span>{{ item.pushedTime.split(' ')[0] }}</span>
      </li>
    </ul>
  </Wrap>
</template>
<script>
import Head from './_com/Head'
export default {
  components: {
    Head
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    handleMoreClick() {
      this.$router.push(`/announcements`)
    }
  }
}
</script>
<style lang="scss" scoped>
  .notice {
    &-list {
      &-item {
        height: 46px;
        cursor: pointer;
        &:hover {
          h2 {
            color: $--color-primary;
          }
        }
        &__title {
          overflow: hidden;
          flex: 1;
          margin-right: 10px;
          width: 0;
          h2 {
            font-size: $--font-size-extra-small;
            line-height: 24px;
            height: 24px;
            font-weight: 400;
          }
        }
        span {
          font-size: $--font-size-base;
          color: #BFBFBF;
        }
      }
    }
  }
</style>
