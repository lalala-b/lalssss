<template>
  <Wrap>
    <Head title="广告案例" @click="handleMoreClick" />
    <ul class="case-list">
      <li v-for="item in list" :key="item.url" class="case-list-item m-b-16">
        <a :href="item.url" class="flex" target="_blank">
          <img :src="item.flowImg" alt="">
          <div class="flex flex-dir-col">
            <h2 class="text-over-hidden-2">{{ item.titleName }}</h2>
            <div>
              <el-tag size="mini">{{ item.flowContent }}</el-tag>
            </div>
            <div class="fans flex flex1 flex-align-end">
              <i class="iconfont icondianzan_fill" />
              {{ item.thumbUpCount | toFloorThousandsW }}
            </div>
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
          at: 3
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .case {
    &-list {
      &-item {
        &:last-child {
          margin-bottom: 0;
        }
        &:hover {
          h2 {
            color: $--color-primary;
          }
        }
        > a {
          align-items: stretch;
        }
        img {
          width: 75px;
          height: 100px;
          border-radius: 4px;
          margin-right: 12px;
        }
        h2 {
          font-size: $--font-size-extra-small;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
          line-height: 24px;
          margin-bottom: 5px;
        }
        .fans {
          font-size: $--font-size-medium;
          justify-self: flex-end;
          color: #BFBFBF;
          line-height: 16px;
          i {
            font-size: $--font-size-base;
            margin-right: 5px;
          }
        }
      }
    }
  }
</style>
