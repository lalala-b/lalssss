<template>
  <div class="detail flex">
    <div class="detail-left" :loading="loading">
      <!-- 基本信息 -->
      <UserInfo :account-info="info.accountInfo" />
      <!-- 账号大盘 -->
      <AccountData
        :account-data="info.accountData"
        :account-type="info.accountInfo.accountType"
        :plat-id-prop="info.accountInfo.platId"
      />
      <!-- 巨量星图信息 -->
      <XtInfo v-if="platId == 25" :xt-info="info.xtInfo" />
      <ClInfo v-if="platId == 26" :info="info.kuaishouJuxingInfoVO" />
      <!-- 内部自营信息 -->
      <SelfData :info="info.selfOperateAccountVO" />
    </div>
    <el-tabs
      v-model="activeName"
      type="card"
      class="detail-right"
      @tab-click="handleAct"
    >
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      >
        <keep-alive>
          <component
            :is="item.name"
            v-if="activeName === item.name"
            :account-id="accountId"
            :account-type="info.accountInfo.accountType"
            :xt-info="info.xtInfo"
            :ks-info="info.kuaishouJuxingInfoVO"
            :benefits-info="signContractAccountEquityInfo"
            :self-info="accountSelfMsg"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import UserInfo from './_com/userInfo'
import XtInfo from './_com/xtInfo'
import ClInfo from './_com/clInfo'
import AccountData from './_com/accountData'
import SelfData from './_com/selfData'
import Account from './_pages/account'
import VideoList from './_pages/videoList'
import AudienceAnalysis from './_pages/AudienceAnalysis'
import FansAnalysis from './_pages/fansAnalysis'
import SignAccount from './_pages/signAccount/'
import MediumAccount from './_pages/mediumAccount/'
import PuttingOrderAccount from './_pages/puttingOrderAccount/'
import BenefitsMsg from './_pages/benefitsMsg.vue'
import SelfAccountMsg from './_pages/selfAccountMsg.vue'
import {
  $getAccountInfo,
  $getSignContractAccountEquityInformation
} from '@/api/details'
import {
  $getAccountDetail
} from '@/api/operating-manage'
export default {
  components: {
    Account,
    AccountData,
    SelfData,
    VideoList,
    AudienceAnalysis,
    SignAccount,
    MediumAccount,
    PuttingOrderAccount,
    UserInfo,
    XtInfo,
    ClInfo,
    FansAnalysis,
    BenefitsMsg,
    SelfAccountMsg
  },
  data() {
    return {
      info: {
        accountData: {},
        accountInfo: {},
        xtInfo: {},
        kuaishouJuxingInfoVO: {},
        selfOperateAccountVO: {}
      },
      signContractAccountEquityInfo: {}, // 达人权益信息
      accountId: null,
      activeName: 'account',
      loading: false,
      platId: null,
      accountSelfMsg: {} // 达人自营信息
    }
  },
  provide() {
    return {
      $info: this.info
    }
  },
  computed: {
    tabList() {
      const list = [
        {
          label: '账号概览',
          name: 'account'
        },
        {
          label: '视频列表',
          name: 'videoList'
        }
      ]
      if (this.info.accountInfo.xingtuIndexUrl) {
        if (this.info.accountInfo.platId === 25) {
          list.push({
            label: '受众画像',
            name: 'AudienceAnalysis'
          })
        } else {
          list.push({
            label: '粉丝画像',
            name: 'FansAnalysis'
          })
        }
      }
      if (
        this.info.accountInfo.signContractAccountFlag &&
        this.$permission('detail_sign_account')
      ) {
        list.push({
          label: '签约信息',
          name: 'signAccount'
        })
      }

      if (
        this.info.accountInfo.intermediaryAccountFlag &&
        this.$permission('detail_medium_account')
      ) {
        list.push({
          label: '媒介信息',
          name: 'mediumAccount'
        })
      }

      if (
        this.info.accountInfo.deliveryAccountFlag &&
        this.$permission('detail_putting_order_account')
      ) {
        list.push({
          label: '基金投放信息',
          name: 'puttingOrderAccount'
        })
      }

      if (
        this.signContractAccountEquityInfo &&
        Object.keys(this.signContractAccountEquityInfo).length &&
        this.$permission('detail_benefits_msg')
      ) {
        list.push({
          label: '达人权益信息',
          name: 'BenefitsMsg'
        })
      }

      if (
        this.accountSelfMsg &&
        Object.keys(this.accountSelfMsg).length &&
        this.$permission('detail_self_msg')
      ) {
        list.push({
          label: '自营信息',
          name: 'SelfAccountMsg'
        })
      }
      return list
    }
  },
  created() {
    this.accountId = this.$route.params.accountId
    this.platId = this.$route.params.platId
    this.accountType = this.$route.query.accountType || 30
    this.getAccountInfo()
    this.getSignContractAccountEquityInformation()
    this.getAccountSelfDetail()
  },
  methods: {
    getAccountInfo() {
      this.loading = true
      $getAccountInfo({
        accountId: this.accountId,
        platId: this.platId,
        accountType: this.accountType
      })
        .then((res) => {
          if (res.code === 1) {
            Object.assign(this.info, res.data || {})
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
          this.loading = false
        })
    },

    // 获取达人权益信息的数据
    async getSignContractAccountEquityInformation() {
      try {
        const {
          code,
          data,
          message = ''
        } = await $getSignContractAccountEquityInformation({
          accountId: this.accountId
        })
        if (+code === 1) {
          this.signContractAccountEquityInfo = data
        } else {
          this.$message.error(message)
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    // 获取达人自营信息
    async getAccountSelfDetail() {
      try {
        const {
          code,
          data,
          message = ''
        } = await $getAccountDetail({
          accountId: this.accountId
        })
        if (+code === 1) {
          // 抖音
          if (this.platId === 25) {
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
            data.twentySecondPrice = data.twentySecondPrice || 0
            data.oversixtySecondPrice = data.oversixtySecondPrice || 0
          } else if (this.platId === 26) { // 快手
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
          } else if (this.platId === 2) { // B站
            data.customVideoPrice = data.customVideoPrice === null ? undefined : data.customVideoPrice
            data.implantationVideoPrice = data.implantationVideoPrice || 0
            data.directVideoPrice = data.directVideoPrice || 0
            data.forwardSituationPrice = data.forwardSituationPrice || 0
          } else if (this.platId === 45) { // 小红书
            data.videoPrice = data.videoPrice === null ? undefined : data.videoPrice
            data.picturePrice = data.picturePrice || 0
          } else { // 其他
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
          }
          this.accountSelfMsg = { ...data, platId: +this.platId }
        } else {
          this.$message.error(message)
        }
      } catch (err) {
        this.$message.error(err.message)
      }
    },

    handleAct(e) {
      this.activeName = e.name
    }
  }
}
</script>

<style scoped lang="scss">
.detail {
  position: relative;
  align-items: start;
  &-left {
    position: sticky;
    top: 0;
    flex-shrink: 0;
    width: 396px;
    margin-right: 24px;
    &::-webkit-scrollbar {
      display: none;
    }
  }
  &-right {
    position: relative;
    flex: 1;
    width: 0;
    ::v-deep {
      > .el-tabs__header {
        position: sticky;
        top: 0;
        z-index: 10;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          top: -24px;
          height: 24px;
          background: #f5f5f5;
        }
      }
      .el-tabs__content {
        overflow: inherit;
        flex: 1;
      }
    }
  }
}
</style>
