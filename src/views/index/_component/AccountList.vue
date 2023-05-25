<template>
  <Wrap class="account flex flex-dir-col">
    <Head title="精选账号" @click="handleMoreClick" />
    <ul class="flex flex-dir-col flex-justify-between">
      <li v-for="item in list" :key="item.url" class="account-list">
        <a class="flex flex-align-center" target="_blank" @click="handleAccountClick(item)">
          <div class="flex flex-align-center flex1">
            <img :src="item.accountImg" alt="">
            <strong class="text-over-hidden">{{ item.accountName }}</strong>
          </div>
          <div class="account-list__tag flex flex-align-center flex1">
            <span v-for="tag in item.tagName.split(',').splice(0, 2)" :key="tag">#{{ tag }}</span>
          </div>
          <div class="flex flex-align-center account-list__fans">
            <i class="iconfont iconfensi_fill" />
            <span data-bold>{{ item.fansNum | toFloorThousandsW }}</span>
          </div>
        </a>
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
      this.$router.push({
        path: `/marketing`,
        query: {
          at: 2
        }
      })
    },
    handleAccountClick(item) {
      this.$router.push({
        path: `/dy-manage/details/${item.accountId}`,
        query: {
          accountName: item.accountName
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .account {
    &-list {
      margin-bottom: 16px;
      cursor: pointer;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        flex-shrink: 0;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        margin-right: 12px;
      }
      strong {
        font-weight: 400;
        flex: 1;
        font-size: $--font-size-extra-small;
        line-height: 18px;
        height: 18px;
        margin-right: 12px;
        max-width: 160px;
      }
      &__tag {
        span {
          font-size: $--font-size-medium;
          color: $--color-primary;
          margin-right: 8px;
        }
      }
      &__fans {
        color: #8C8C8C;
        font-size: $--font-size-medium;
        i {
          color:#D8D8D8;
          font-size: $--font-size-extra-medium;
          margin-right: 4px;
        }
      }
    }
  }
</style>
