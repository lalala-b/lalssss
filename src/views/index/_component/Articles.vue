<template>
  <Wrap class="article">
    <Head title="热门文章" :show-more="showMore" @click="handleMoreClick" />
    <ul v-loading="loading" class="flex article-list">
      <li v-for="item in list" :key="item.url" class="article-list-items">
        <a class="flex flex-dir-col" :href="item.url" target="_blank" @click="handleArticleClick(item)">
          <div class="article-list-items__img">
            <img :src="item.image" alt="">
          </div>
          <h2>{{ item.title }}</h2>
        </a>
        <div class="flex flex-justify-between flex-align-center m-t-16">
          <p>{{ item.pushedTime }}</p>
          <i class="iconfont iconiconbuzantong" :class="{'is-active': item.trampledFlag === 1}" @click="updateArticless(item)" />
        </div>
      </li>
      <li v-for="item in emptyLength" :key="item" class="article-list-items flex">
        <ArticlesEmpty />
      </li>
    </ul>
  </Wrap>
</template>
<script>
import Head from './_com/Head'
import ArticlesEmpty from './_com/ArticlesEmpty'
import { isArray } from '@/utils'
import { $getArticless, $updateArticless } from '@/api/home'
import { checkMenuPermission } from '@/permission'
export default {
  components: {
    Head,
    ArticlesEmpty
  },
  data() {
    return {
      list: [],
      loading: true
    }
  },
  computed: {
    emptyLength() {
      if (isArray(this.list)) {
          return 6 - this.list.length
      } else {
        return 6
      }
    },
    showMore() {
      return checkMenuPermission('marketing')
    }
  },
  created() {
    this.getArticless()
  },
  methods: {
    getArticless() {
      $getArticless({ size: 6, isFilter: 1 }).then(res => {
        if (res.code === 1) {
          this.list = res.data
        }
        this.loading = false
      })
    },
    handleMoreClick() {
      this.$router.push({
        path: `/marketing`,
        query: {
          at: 0
        }
      })
    },
    handleArticleClick(item) {
      $updateArticless({
        id: item.id,
        type: 1
      })
    },
    updateArticless(item) {
      item.trampledFlag = item.trampledFlag === 1 ? 0 : 1
      $updateArticless({
        id: item.id,
        type: 2,
        trampledFlag: item.trampledFlag
      }).then(res => {
        if (res.code !== 1) {
          this.$message.error(res.message)
          // this.getArticless()
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .article {
    padding-right: 24px;
    padding-left: 24px;
    &-list {
      margin-top: 25px;
      &-items {
        flex: 1;
        margin-right: 24px;
        &:nth-child(6n) {
          margin-right: 0;
        }
        > a:hover {
          h2 {
            color: $--color-primary;
          }
        }
        > a {
          width: 100%;
        }
        &__img {
          position: relative;
          overflow: hidden;
          width: 100%;
          padding-bottom: 54%;
          border-radius: 10px;
          box-shadow: 0 8px 12px rgba(56,123,193, .1);
          img {
            position: absolute;
            top: 50%;
            left: 0;
            width: 100%;
            height: 100%;
            transform: translateY(-50%);
            object-fit: cover;
          }
        }
        h2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          margin-top: 18px;
          height: 48px;
          line-height: 24px;
          font-size: $--font-size-extra-small;
          font-weight: 400;
          color: rgba(0, 0, 0, 0.85);
        }
        p {
          height: 22px;
          font-size: $--font-size-base;
          font-weight: 400;
          color: #BFBFBF;
          line-height: 22px;
        }
      }
      .iconfont {
        color: #AFAFAF;
        // &:hover {
        //   color: $--color-primary;;
        // }
        &.is-active {
          color: $--color-primary;
        }
        cursor: pointer;
      }
    }
  }
</style>
