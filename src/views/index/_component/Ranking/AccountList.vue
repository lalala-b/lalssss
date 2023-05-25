<template>
  <Wrap>
    <Head :title="title" @click="$emit('click')" />
    <ul>
      <li
        v-for="item in list"
        :key="item.id"
        class="account-list flex flex-align-center"
        @click="handleClick(item)"
      >
        <img :src="item.avatarUri" alt="">
        <span>{{ item.nickName }}</span>
        <strong data-bold><i class="iconfont iconfensi_fill" />{{ item.follower | toFloorThousandsW }}</strong>
      </li>
    </ul>
  </Wrap>
</template>
<script>
import Head from '../_com/Head'
export default {
  components: {
    Head
  },
  props: {
    title: {
      default: '',
      type: String
    },
    list: {
      default() {
        return []
      },
      type: Array
    }
  },
  methods: {
    handleClick(item) {
      console.log(item)
      this.$router.push({
        path: `/dy-manage/details/${item.accountId}`,
        query: {
          accountType: item.accountType,
          accountName: item.nickName
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.account-list {
  margin-bottom: 23px;
  cursor: pointer;
  &:last-child {
    margin-bottom: 0;
  }
  &:hover {
    span {
      color: $--color-primary;
    }
  }
  img {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 50%;
  }
  span {
    flex: 1;
    font-size: $--font-size-extra-small;
    color: rgba(0, 0, 0, 0.85);
  }
  strong {
    display: flex;
    align-items: center;
    font-size: $--font-size-medium;
    color: #8C8C8C;
    i {
      margin-right: 4px;
      font-size: $--font-size-extra-small;
      color: #D8D8D8;
    }
  }
}
</style>
