<template>
  <div v-loading="!accountData" class="C-account-video">
    <!-- beetle merge test code... -->
    <template v-if="accountData">
      <div class="data">
        <template v-for="(item, index) in dataList">
          <div v-if="(index === 0 && (data.accountType !== 2 && data.accountType !== 30)) || index !== 0" :key="index" class="data-item">
            <p class="data-title">
              <i class="iconfont" :class="item.icon" />{{ item.title }}
            </p>
            <p class="data-nums">
              <span class="data-value">{{ item.value | toThousandsW }}</span>
              <span :class="{ 'data-up': item.new > 0, 'data-down': item.new <= 0 }" />
              <span class="data-increase">{{ item.new | toThousandsW }}</span>
            </p>
            <!-- <p class="data-new"></p> -->
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      dataList: [
        { title: '播放', value: 0, new: 0, icon: 'iconbofang_fill', color: '#2997ff' },
        { title: '点赞', value: 0, new: 0, icon: 'icondianzan_fill', color: '#13ce66' },
        { title: '评论', value: 0, new: 0, icon: 'iconpinglun_fill', color: '#909399' },
        { title: '转发', value: 0, new: 0, icon: 'iconzhuanfa_fill', color: '#ffba00' }

      ]
    }
  },
  inject: ['$response'],
  computed: {
    data() {
      return this.$response.detailData
    },
    accountData() {
      return this.$response.accountData
    }
  },
  watch: {
    data(val) {
      this.setDataList(val)
    }
  },
  created() {
    this.setDataList(this.data)
  },
  methods: {
    setDataList(val) {
      this.dataList = [
        { title: '播放', value: val.flowCount, new: val.addFlow, icon: 'iconzhengli', color: '#2997ff' },
        { title: '点赞', value: val.thumbUpCount, new: val.addDig, icon: 'icondianzan_fill', color: '#13ce66' },
        { title: '评论', value: val.commentCount, new: val.addCom, icon: 'iconpinglun_fill', color: '#909399' },
        { title: '转发', value: val.forwardedCount, new: val.addShare, icon: 'iconzhuanfa_fill', color: '#ffba00' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-account-video {
    display: flex;
    .account {
      display: flex;
      &-avater {
        width: 80px;
        img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
        }
      }
      &-info {
        margin-top: 10px;
        flex: 1;
        display: flex;
        // align-items: center;

        flex-direction: column;
        margin-left: 12px;
      }
      &-name {
        font-size: 18px;
      }
      &-text {
        color: #999;
        font-size: 12px;
        margin-top: 2px;
      }
      &-label {
        margin-top: 4px;
        img {
          width: 20px;
          margin-right: 4px;
        }
      }
    }
    .data {
      flex: 1;
      display: flex;
      &-increase {
        color: $--color-text-danger;
        font-size: 12px;
      }
      &-nums {
        display: flex;
        align-items: center;
        margin-top: 4px;
      }
      &-up {
        margin-right: 2px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-bottom: 4px solid $--color-danger;
      }
      &-down {
        margin-right: 2px;
        width: 0;
        height: 0;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top: 4px solid $--color-danger;
      }
      &-item {
        // flex: 1;
        margin-right: 65px;
        position: relative;
      }
      &-title {
        font-size: 12px;
        text-align: left;
        display: flex;
        align-items: center;
        color: #BFBFBF;
        i {
          margin-right: 4px;
          font-size: 14px;
          color: #BFBFBF;
        }
      }
      &-value {
        // margin-top: 8px;
        font-size: 20px;
        line-height: 20px;
        font-weight: bold;
        margin-right: 4px;
      }
      &-new {
        margin-top: 10px;
        font-size: 14px;
      }
      &-line {
        position: absolute;
        right: 0;
        top: 0;
        width: 1px;
        height: 100%;
        background-color: #eee;
      }
    }
    .xingtu-grade {
      display: inline-block;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      background: url('../../_img/leavel_bg.png') center center no-repeat;
      background-size: contain;
      vertical-align: top;
      margin-left: 4px;
    }
  }
</style>
