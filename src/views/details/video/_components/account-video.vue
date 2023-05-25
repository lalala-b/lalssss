<template>
  <div v-if="accountData" class="C-flow">
    <div class="account">
      <div class="account-avater">
        <img :src="accountData.accountImg" alt="">
      </div>
      <div class="account-info">
        <p class="account-name">{{ data.accountName }}
          <img :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${data.platId}.png`" alt="">
          <!-- <a v-if="data.xingtuIndexUrl" :href="data.xingtuIndexUrl" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" content="星图主页链接" placement="top">
              <svg-icon icon-class="xintu" />
            </el-tooltip>
          </a> -->
          <a v-if="data.xingtuIndexUrl" :href="data.xingtuIndexUrl" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" :content="THIRD_INDEX_URL_MAP[data.platId].tip" placement="top">
              <svg-icon :icon-class="THIRD_INDEX_URL_MAP[data.platId].iconClass" />
            </el-tooltip>
          </a>
          <!-- <a v-if="data.juxingIndexUrl" :href="data.juxingIndexUrl" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" content="聚星主页链接" placement="top">
              <svg-icon icon-class="juxing" />
            </el-tooltip>
          </a> -->
          <el-tooltip v-if="data.organizationStarFlag" class="m-r-5" effect="dark" content="机构达人" placement="top">
            <svg-icon icon-class="jigoudaren" />
          </el-tooltip>
          <el-tooltip v-if="data.corporateStarFlag" class="m-r-5" effect="dark" content="支持对公" placement="top">
            <svg-icon icon-class="zhichiduigong" />
          </el-tooltip>
        </p>
        <p class="account-text">ID:{{ data.eid }}</p>
        <p v-if="accountData.provinceName" class="account-text">{{ accountData.provinceName }}-{{ accountData.cityName }}</p>
        <div class="account-label">
          <i v-if="accountData.xingtuGrade" class="xingtu-grade">{{ accountData.xingtuGrade }}</i>
        </div>
      </div>
      <div v-if="$response.detailData.selfOperateAccountFlag">
        <div>账号归属：{{ accountData.dname }}-{{ accountData.fname }}</div>
        <div>账号统一名称：{{ accountData.belongName || '--' }}</div>
      </div>
    </div>
    <div class="flex">
      <div v-for="(item, index) in config" :key="index" class="flow-item">
        <p class="item-title">
          <i class="iconfont" :class="item.icon" :style="{ color: item.color }" />{{ item.title }}
        </p>
        <p v-if="item.value" class="item-data" data-bold>{{ item.value | toThousandsW }}</p>
        <p v-else class="item-data">-</p>
      </div>
    </div>
  </div>
</template>
<script>
import { THIRD_INDEX_URL_MAP } from '@/const'
export default {
  data() {
    return {
      config: [
        { title: '粉丝量', value: 0, icon: 'iconzhengli', color: '#2997ff' },
        { title: '集均播放量', value: 0, icon: 'iconzantong', color: '#13ce66' },
        { title: '集均点赞量', value: 0, icon: 'iconxinxi', color: '#909399' },
        { title: '集均评论量', value: 0, icon: 'iconfenxiang', color: '#ffba00' }
      ],
      THIRD_INDEX_URL_MAP
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
  // created() {
  //   this.setConfig(this.accountData)
  // },
  watch: {
    accountData(val) {
      this.setConfig(val)
    }
  },
  methods: {
    setConfig(data) {
      this.config = [
        { title: '粉丝量', value: data.fans, icon: 'iconzhengli', color: '#2997ff' },
        { title: '集均播放量', value: data.avgPlay, icon: 'iconzantong', color: '#13ce66' },
        { title: '集均点赞量', value: data.avgLike, icon: 'iconxinxi', color: '#909399' },
        { title: '集均评论量', value: data.avgComment, icon: 'iconfenxiang', color: '#ffba00' }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-flow {
    // padding: 15px 0;
    border-left: 1px solid #F0F0F0;
    .flex {
      display: flex;
      flex-wrap: wrap;
      position: relative;
      margin-top: 18px;
    }
    .account {
      display: flex;
      padding-left: 24px;
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
        img {
          width: 20px;
          margin-right: 4px;
          position: relative;
          top: 2px;
        }
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
    .col-line {
      height: 90%;
      width: 1px;
      background-color: #ddd;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateY(-50%);
      opacity: .5;
    }
    .row-line {
      height: 1px;
      width: 90%;
      background-color: #ddd;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%);
      opacity: .5;
    }
    .flow-item {
      flex: 1;
      width: 140px;
      text-align: center;
      .item-title {
        font-size: 12px;
        color: $--color-text-placeholder;
        i {
          margin-right: 4px;
          font-size: 16px;
        }
      }
      .item-data {
        font-size: 20px;
      }
      .item-text {
        font-size: 12px;
      }
    }
    .xingtu-grade {
      display: inline-block;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 22px;
      font-size: 12px;
      color: #fff;
      margin-left: -1px;
      background: url('../../_img/leavel_bg.png') center center no-repeat;
      background-size: contain;
      vertical-align: top;
      margin-left: 4px;
    }
  }
</style>
