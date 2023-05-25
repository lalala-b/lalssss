<template>
  <div>
    <el-card v-loading="accountDataLoading" shadow="always">
      <div class="market-head">
        <span>账号大盘</span>
      </div>

      <ul class="account-market-list m-t-24">
        <li>
          <h4>粉丝数</h4>
          <p>{{ userInfo.fansNum | toThousandsW }}</p>
        </li>
        <li>
          <h4>粉丝获赞</h4>
          <p>{{ userInfo.fansLikeNum | toThousandsW }}</p>
        </li>
        <li>
          <h4>视频总数</h4>
          <p>{{ userInfo.videoNum | toThousandsW }}</p>
        </li>
      </ul>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return {}
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  setup(props, { emit }) {
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.market-head {
  font-size: 16px;
  font-weight: 600;
}

.account-market-list {
  display: flex;
  flex-wrap: wrap;
  background: #F5F7F8;
  border-radius: 2px;

  li {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 0 16px;
    height: 84px;
    box-sizing: border-box;
    width: 33.33%;
    text-align: center;

    h4 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }

    p {
      margin-top: 8px;
      font-size: 20px;
      line-height: 24px;
      font-weight: bold;
      color: #272727;
    }
  }
}
</style>
