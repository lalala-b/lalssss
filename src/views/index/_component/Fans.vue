<template>
  <Wrap v-loading="loading" class="fans-wrap">
    <Head
      class="fans-head"
      title="每日涨粉榜"
      tip="昨日所有抖音+快手自营账号中，涨粉量前6的账号"
      @click="handleMoreClick"
    />
    <!-- <template v-if="hasPermission"> -->
    <ul v-if="fanslist && fanslist.length > 0" class="fans">
      <li v-for="item in fanslist" :key="item.accountId" @click="handleClick(item)">
        <div class="fans-left">
          <img class="fans-left-img" :src="item.accountImg">
          <div class="fans-left-content">
            <div class="fans-left-content-name">
              <span class="text-over-hidden-1">{{ item.accountName }}</span>
              <i
                v-if="item.platName === '抖音'"
                class="iconfont icondouyin_fill"
              />
              <i v-else class="iconfont iconziyuan1" />
            </div>
            <div class="fans-left-content-count">
              粉丝：{{ item.fansAll | toFloorThousandsW }}
            </div>
          </div>
        </div>
        <div class="fans-right">
          <span>昨日新增粉丝：{{ item.fansPv | toFloorThousandsW }}</span>
          <i class="iconfont iconup" />
        </div>
      </li>
    </ul>
    <p v-else class="no-data">{{ loading ? '加载中...' : '暂无数据' }}</p>
    <!-- </template> -->
    <!-- <WithoutPermission v-else /> -->
  </Wrap>
</template>
<script>
import Head from './_com/Head'
// import WithoutPermission from 'components'
import { checkMenuPermission } from '@/permission'

export default {
  components: {
    Head
    // WithoutPermission
  },
  props: {
    fanslist: {
      type: Array,
      default() {
        return []
      }
    },
    loading: Boolean
  },
  computed: {
    hasPermission() {
      return checkMenuPermission('pirate_fans')
    }
  },
  methods: {
    handleMoreClick() {
      if (this.hasPermission) {
        this.$router.push({
          path: '/pirate/fans',
          query: { list: 1 }
        })
      } else {
        this.$alert('你没有该页面的查看权限', {
          confirmButtonText: '确定'
        })
      }
    },
    handleClick(item) {
      const { accountId, platId } = item
      if (!accountId || !platId) return
      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          _blank: true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fans-wrap {
  display: flex;
  flex-direction: column;
  padding: 0 24px;
}
.fans-head {
  height: 64px;
}
.fans {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 23px;
  height: 0;
  > li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    color: #333;
  }
  &-left {
    display: flex;
    align-items: center;
    margin-right: 8px;
    &:hover {
      cursor: pointer;
      color: $--color-primary;
    }
    &-img {
      height: 42px;
      width: 42px;
      border-radius: 50%;
    }
    &-content {
      margin-left: 18px;
      &-name {
        position: relative;
        font-size: $--font-size-base;
        font-weight: 700;
        padding-left: 26px;
        > i {
          position: absolute;
          left: 0;
          top: 50%;
          margin-right: 10px;
          font-size: 16px;
          transform: translateY(-50%);
          &.icondouyin_fill {
            color: #210d1d;
          }
          &.iconziyuan1 {
            color: #ff4906;
          }
        }
      }
      &-count {
        margin-top: 4px;
        font-size: 12px;
      }
    }
  }
  &-right {
    flex-shrink: 0;
    font-size: $--font-size-base;
    color: #333;
    > i {
      margin-left: 18px;
      &.iconup {
        color: #ffc469;
        font-size: 16px;
      }
    }
    &:hover {
      cursor: pointer;
      color: $--color-primary;
    }
  }
}
</style>
