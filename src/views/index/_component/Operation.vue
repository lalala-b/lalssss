<template>
  <Wrap class="operation flex flex-dir-col">
    <Head title="运营技巧" @click="handleMoreClick" />
    <ul class="flex1 flex flex-dir-col flex-justify-between">
      <li v-for="(item, index) in list" :key="item.url" class="operation-list">
        <a class="flex flex-align-center" :href="item.url" target="_blank">
          <!-- <img src="@/assets/404_images/404.png" alt=""> -->
          <img :src="imgArr[index]" alt="">
          <strong class="text-over-hidden">{{ item.title }}</strong>
          <!-- <span>{{ item.pushedTime }}</span> -->
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
  data() {
    const imgArr = []
    for (let i = 0; i < 5; i++) {
      imgArr.push(require(`@/assets/operation_images/operation_${i + 1}.png`))
    }
    return {
      imgArr
    }
  },
  methods: {
    handleMoreClick() {
      this.$router.push({
        path: `/marketing`,
        query: {
          at: 1
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .operation {
    &-list {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      img {
        flex-shrink: 0;
        width: 48px;
        height: 36px;
        border-radius: 4px;
        margin-right: 12px;
      }
      strong {
        font-weight: 400;
        flex: 1;
        font-size: $--font-size-extra-small;
        line-height: 18px;
        height: 18px;
        margin-right: 12px;
      }
      span {
        font-size: $--font-size-base;
        color: #BFBFBF;
      }
    }
  }
</style>
