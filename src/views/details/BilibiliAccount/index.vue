<template>
  <div class="account-wrap">
    <div class="account-left-wrap">
      <!-- 账号基本信息 -->
      <AccountData
        :user-info="userInfoForBilibili"
        :account-data-loading="accountDataLoading"
      />

      <!-- 账号大盘 -->
      <AccountMarket
        :user-info="userInfoForBilibili"
        :account-data-loading="accountDataLoading"
      />

      <!-- 服务报价 -->
      <ServiceQuotation
        :user-info="userInfoForBilibili"
        :account-data-loading="accountDataLoading"
      />

      <!-- 内部自营信息 -->
      <SelfData :self-data="selfData" />
    </div>

    <div class="account-right-wrap">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane
          v-for="item in tabsData"
          :key="item.id"
          :label="item.title"
          :name="item.name"
        >
          <component
            :is="item.name"
            v-if="activeName === item.name"
            :user-info="userInfoForBilibili"
            :recent-video-trend-data="recentVideoTrendData"
            :video-case-list="videoCaseList"
            :fan-num-trend-list="fanNumTrendList"
            :account-data-loading="accountDataLoading"
            :video-trend-loading="videoTrendLoading"
            :video-case-loading="videoCaseLoading"
            :fans-trend-loading="fansTrendLoading"
            :benefits-info="signContractAccountEquityInfo"
            :self-info="accountSelfMsg"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  getCurrentInstance,
  toRefs,
  reactive,
  watch
} from '@vue/composition-api'
import AccountData from './accountDataForBilibili.vue'
import AccountMarket from './AccountMarket.vue'
import ServiceQuotation from './serviceQuotation.vue'
import SelfData from './selfDataForBilibili.vue'
import AccountOverview from './AccountOverview/AccountOverview.vue'
import VideoList from './VideoList/VideoList'
import UserAnalysis from './userAnalysis/userAnalysis.vue'
import fundReleaseInformation from './fundReleaseInformation/fundReleaseInformation.vue'
import signAccount from './signAccount/signAccount.vue'
import mediumAccount from './mediumAccount/mediumAccount.vue'
import BenefitsMsg from './benefitsMsg.vue'
import SelfAccountMsg from './selfAccountMsg.vue'
import {
  $getAccountInfoForBiliBili,
  $getRecentVideoTrend,
  $getVideoCaseList,
  $getFanNumTrendList,
  $getAccountInfo,
  $getPlatformId,
  $getSignContractAccountEquityInformation
} from '@/api/details'
import {
  $getAccountDetail
} from '@/api/operating-manage'

export default defineComponent({
  components: {
    AccountData,
    ServiceQuotation,
    AccountOverview,
    UserAnalysis,
    signAccount,
    mediumAccount,
    fundReleaseInformation,
    AccountMarket,
    SelfData,
    VideoList,
    BenefitsMsg,
    SelfAccountMsg
  },
  setup(props, { emit }) {
    const { $route, $message, $permission } = getCurrentInstance().proxy

    const states = reactive({
      userInfoForBilibili: {},
      recentVideoTrendData: {},
      fanNumTrendList: [],
      videoCaseList: {},
      upperMid: '',
      activeName: 'AccountOverview',
      tabsData: [
        {
          id: 1,
          title: '账号概览',
          name: 'AccountOverview'
        },
        {
          id: 2,
          title: '视频列表',
          name: 'VideoList'
        },
        {
          id: 3,
          title: '受众画像',
          name: 'UserAnalysis'
        }
      ],
      accountDataLoading: false,
      videoTrendLoading: false,
      videoCaseLoading: false,
      fansTrendLoading: false,
      selfData: {},
      signContractAccountEquityInfo: {}, // 达人权益信息
      accountSelfMsg: {} // 达人自营信息
    })

    // 根据账号id获取花火id
    const getPlatformId = async() => {
      try {
        const { accountId } = $route.params
        const { code, data } = await $getPlatformId({ accountId })
        if (+code === 1) {
          states.upperMid = data.platformId
        }
      } catch (e) {
        $message.error(String(e?.message))
      }
    }

    // 获取B站账户信息
    const getAccountInfoForBiliBili = async() => {
      try {
        states.accountDataLoading = true
        const { code, data } = await $getAccountInfoForBiliBili({
          upperMid: states.upperMid
        })
        if (!data) {
          states.accountDataLoading = false
          return $message.error('暂无此用户信息')
        }
        // states.upperMid = upperMid
        if (+code === 1) {
          states.userInfoForBilibili = data || {}
          if (states.userInfoForBilibili.tags) {
            states.userInfoForBilibili.tags = JSON.parse(
              JSON.stringify(states.userInfoForBilibili.tags || '[]')
            )
              .slice(1, -1)
              .split(',')
            states.userInfoForBilibili.tags =
              states.userInfoForBilibili.tags.map((item) => {
                return item.slice(1, -1)
              })
          }
          if (states.userInfoForBilibili.characterTag) {
            states.userInfoForBilibili.characterTag = JSON.parse(
              JSON.stringify(states.userInfoForBilibili.characterTag || '[]')
            )
              .slice(1, -1)
              .split(',')
            states.userInfoForBilibili.characterTag =
              states.userInfoForBilibili.characterTag.map((item) => {
                return item.slice(1, -1)
              })
          }
        }
        states.accountDataLoading = false
      } catch (e) {
        states.accountDataLoading = false
        $message.error(String(e?.message))
      }
    }

    // 获取最近10个视频的信息趋势
    const getRecentVideoTrend = async() => {
      try {
        states.videoTrendLoading = true
        const { code, data } = await $getRecentVideoTrend({
          upperMid: states.upperMid
        })
        if (+code === 1) {
          states.recentVideoTrendData = data || {}
        }
        states.videoTrendLoading = false
      } catch (e) {
        states.videoTrendLoading = false
        $message.error(String(e?.message))
      }
    }

    // 获取作品案例信息
    const getVideoCaseList = async() => {
      try {
        states.videoCaseLoading = true
        const { code, data } = await $getVideoCaseList({
          upperMid: states.upperMid
        })
        if (+code === 1) {
          states.videoCaseList = data || []
        }
        states.videoCaseLoading = false
      } catch (e) {
        states.videoCaseLoading = false
        $message.error(String(e?.message))
      }
    }

    // 获取粉丝趋势数据
    const getFanNumTrendList = async() => {
      try {
        states.fansTrendLoading = true
        const { code, data } = await $getFanNumTrendList({
          upperMid: states.upperMid
        })
        if (+code === 1) {
          states.fanNumTrendList = data || []
        }
        states.fansTrendLoading = false
      } catch (e) {
        states.fansTrendLoading = false
        $message.error(String(e?.message))
      }
    }

    // 切换tab页的点击事件
    const handleTabClick = (tab) => {
      states.activeName = tab.name

      // if (tab.name === 'AccountOverview') {
      //   getRecentVideoTrend()
      //   getAccountInfoForBiliBili()
      // } else if (tab.name === 'VideoList') {
      //   getVideoCaseList()
      // } else if (tab.name === 'UserAnalysis') {
      //   getFanNumTrendList()
      //   getAccountInfoForBiliBili()
      // }
    }

    // 主要获取是否展示签约信息/媒介信息/基金投放信息的显示字段
    const getInfoHForTabJurisdiction = async() => {
      try {
        const { accountId, platId } = $route.params
        const { accountType = 30 } = $route.query
        const { code, data } = await $getAccountInfo({
          accountId: accountId,
          platId: platId,
          accountType: accountType
        })
        if (code === 1) {
          if (
            data.accountInfo.signContractAccountFlag &&
            $permission('detail_sign_account')
          ) {
            states.tabsData.push({
              id: 4,
              title: '签约信息',
              name: 'signAccount'
            })
          }

          if (
            data.accountInfo.intermediaryAccountFlag &&
            $permission('detail_medium_account')
          ) {
            states.tabsData.push({
              id: 5,
              title: '媒介信息',
              name: 'mediumAccount'
            })
          }

          if (
            data.accountInfo.deliveryAccountFlag &&
            $permission('detail_putting_order_account')
          ) {
            states.tabsData.push({
              id: 6,
              title: '基金投放信息',
              name: 'fundReleaseInformation'
            })
          }

          if (Object.keys(data.selfOperateAccountVO).length) {
            states.selfData = data.selfOperateAccountVO
          }
        }
      } catch (e) {
        if (e.__CANCEL__) {
          return
        }
        $message.error(String(e?.message))
      }
    }

    // 获取达人权益信息
    const getBenefitsMsg = async() => {
      try {
        const { accountId } = $route.params

        const {
          code,
          data,
          message = ''
        } = await $getSignContractAccountEquityInformation({
          accountId
        })
        if (+code === 1) {
          states.signContractAccountEquityInfo = data
          if (
            states.signContractAccountEquityInfo &&
            Object.keys(states.signContractAccountEquityInfo).length &&
            $permission('detail_benefits_msg')
          ) {
            states.tabsData.push({
              id: 7,
              title: '达人权益信息',
              name: 'BenefitsMsg'
            })
          }
        } else {
          $message.error(message)
        }
      } catch (err) {
        $message.error(err.message)
      }
    }

    // 获取自营信息
    const getAccountSelfDetail = async() => {
      try {
        const { accountId, platId } = $route.params
        const {
          code,
          data,
          message = ''
        } = await $getAccountDetail({
          accountId
        })
        if (+code === 1) {
          // 抖音
          if (+platId === 25) {
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
            data.twentySecondPrice = data.twentySecondPrice || 0
            data.oversixtySecondPrice = data.oversixtySecondPrice || 0
          } else if (+platId === 26) { // 快手
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
          } else if (+platId === 2) { // B站
            data.customVideoPrice = data.customVideoPrice === null ? undefined : data.customVideoPrice
            data.implantationVideoPrice = data.implantationVideoPrice || 0
            data.directVideoPrice = data.directVideoPrice || 0
            data.forwardSituationPrice = data.forwardSituationPrice || 0
          } else if (+platId === 45) { // 小红书
            data.videoPrice = data.videoPrice === null ? undefined : data.videoPrice
            data.picturePrice = data.picturePrice || 0
          } else { // 其他
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
          }
          if (
            data &&
            Object.keys(data).length &&
            data.operatorName &&
            $permission('detail_self_msg')
          ) {
            states.tabsData.push({
              id: 8,
              title: '自营信息',
              name: 'SelfAccountMsg'
            })
          }
          states.accountSelfMsg = { ...data, platId: +platId }
        } else {
          $message.error(message)
        }
      } catch (err) {
        $message.error(err.message)
      }
    }

    getPlatformId()

    watch(
      () => states.upperMid,
      (val) => {
        if (val) {
          getAccountInfoForBiliBili()
          getRecentVideoTrend()
          getVideoCaseList()
          getInfoHForTabJurisdiction()
          getFanNumTrendList()
          getBenefitsMsg()
          getAccountSelfDetail()
        }
      },
      {
        immediate: true
      }
    )
    // getFanNumTrendList()

    return {
      ...toRefs(states),
      handleTabClick
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep {
  .el-card {
    margin-bottom: 20px;
    position: relative;
  }

  .el-tabs__header {
    padding: 6px;
    padding-bottom: 0;
    border-radius: 5px;

    .el-tabs__nav-wrap {
      &::after {
        height: 0;
      }
    }
  }

  .el-tab-pane {
    margin-top: 20px;
  }
}

.account-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .account-left-wrap {
    width: 32%;
    position: sticky;
    top: 0px;
  }

  .account-right-wrap {
    width: 67%;
  }
}
</style>
