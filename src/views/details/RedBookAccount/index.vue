<template>
  <div class="account-wrap">
    <div class="account-left-wrap">
      <!-- 账号基本信息 -->
      <AccountData
        :account-detail="accountDetailNewInfo"
        :account-data-loading="accountNewDataLoading"
      />

      <!-- 账号大盘 -->
      <AccountMarket
        :account-detail="accountDetailNewInfo"
        :account-data-loading="accountNewDataLoading"
      />

      <!-- 服务报价 -->
      <ServiceQuotation
        :account-detail="accountDetailNewInfo"
        :account-data-loading="accountNewDataLoading"
      />

      <!-- 内部自营信息 -->
      <SelfData :self-data="selfData" />
    </div>

    <div class="account-right-wrap">
      <el-tabs
        v-model="activeName"
        :class="tabsData.length === 1 ? 'singalPane' : ''"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          v-for="item in tabsData"
          :key="item.id"
          :label="item.title"
          :name="item.name"
        >
          <component
            :is="item.name"
            v-if="activeName === item.name"
            :account-detail="accountDetailInfo"
            :account-new-detail="accountDetailNewInfo"
            :account-data-loading="accountDataLoading"
            :account-new-data-loading="accountNewDataLoading"
            :fans-trend-loading="fansTrendLoading"
            :benefits-info="signContractAccountEquityInfo"
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
  reactive
} from '@vue/composition-api'
import AccountData from './accountDataForRedBook.vue'
import AccountMarket from './AccountMarket.vue'
import ServiceQuotation from './serviceQuotation.vue'
import SelfData from './selfDataForRedBook.vue'
import AccountOverview from './AccountOverview/AccountOverview.vue'
import fundReleaseInformation from './fundReleaseInformation/fundReleaseInformation.vue'
import signAccount from './signAccount/signAccount.vue'
import mediumAccount from './mediumAccount/mediumAccount.vue'
import BenefitsMsg from './benefitsMsg.vue'
import SelfAccountMsg from './selfAccountMsg.vue'
import { $getAccountDetail } from '@/api/account-manage'
import {
  $getAccountInfo,
  $getRedBookAccountDetail,
  $getSignContractAccountEquityInformation
} from '@/api/details'

export default defineComponent({
  components: {
    AccountData,
    ServiceQuotation,
    AccountOverview,
    signAccount,
    mediumAccount,
    fundReleaseInformation,
    AccountMarket,
    SelfData,
    BenefitsMsg,
    SelfAccountMsg
  },
  setup(props, { emit }) {
    const { $route, $message, $permission } = getCurrentInstance().proxy

    const states = reactive({
      accountDetailInfo: {},
      accountDetailNewInfo: {},
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
        }
        // {
        //   id: 3,
        //   title: '受众画像',
        //   name: 'UserAnalysis'
        // }
      ],
      accountDataLoading: false,
      accountNewDataLoading: false,
      videoTrendLoading: false,
      videoCaseLoading: false,
      fansTrendLoading: false,
      selfData: {},
      signContractAccountEquityInfo: {} // 达人权益信息
    })

    // 获取小红书账户信息（旧）
    const getAccountInfoForRedBook = async() => {
      try {
        const { accountId = '', platId = '' } = $route.params
        states.accountDataLoading = true
        const {
          code,
          data,
          message = ''
        } = await $getAccountDetail({
          accountId
        })
        states.accountDataLoading = false
        if (code === 1) {
          // 抖音
          if (+platId === 25) {
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
            data.twentySecondPrice = data.twentySecondPrice || 0
            data.oversixtySecondPrice = data.oversixtySecondPrice || 0
          } else if (+platId === 26) {
            // 快手
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
            data.netPrice = data.netPrice || 0
          } else if (+platId === 2) {
            // B站
            data.customVideoPrice =
              data.customVideoPrice === null
                ? undefined
                : data.customVideoPrice
            data.implantationVideoPrice = data.implantationVideoPrice || 0
            data.directVideoPrice = data.directVideoPrice || 0
            data.forwardSituationPrice = data.forwardSituationPrice || 0
          } else if (+platId === 45) {
            // 小红书
            data.videoPrice =
              data.videoPrice === null ? undefined : data.videoPrice
            data.picturePrice = data.picturePrice || 0
          } else {
            // 其他
            data.sixPrice = data.sixPrice === null ? undefined : data.sixPrice
          }
          if (
            data &&
            Object.keys(data).length &&
            data.operatorName && // 有运营负责人
            $permission('detail_self_msg')
          ) {
            states.tabsData.push({
              id: 6,
              title: '自营信息',
              name: 'SelfAccountMsg'
            })
          }
          states.accountDetailInfo = { ...data, platId: +platId }
        } else {
          $message.error(message)
        }
      } catch (e) {
        states.accountDataLoading = false
        $message.error(String(e?.message))
      }
    }

    // 获取小红书账户基本信息（新）
    const getRedBookAccountDetail = async() => {
      try {
        states.accountNewDataLoading = true
        const res = await $getRedBookAccountDetail({
          accountId: $route.params.accountId || ''
        })
        if (res.code === 1) {
          states.accountNewDataLoading = false
          states.accountDetailNewInfo = res.data
        }
      } catch (e) {
        states.accountNewDataLoading = false
        $message.error(String(e?.message))
      }
    }

    // 切换tab页的点击事件
    const handleTabClick = (tab) => {
      states.activeName = tab.name
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
              id: 2,
              title: '签约信息',
              name: 'signAccount'
            })
          }

          if (
            data.accountInfo.intermediaryAccountFlag &&
            $permission('detail_medium_account')
          ) {
            states.tabsData.push({
              id: 3,
              title: '媒介信息',
              name: 'mediumAccount'
            })
          }

          if (
            data.accountInfo.deliveryAccountFlag &&
            $permission('detail_putting_order_account')
          ) {
            states.tabsData.push({
              id: 4,
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
              id: 5,
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

    getRedBookAccountDetail()
    getAccountInfoForRedBook()
    getInfoHForTabJurisdiction()
    getBenefitsMsg()

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

  .singalPane {
    .el-tabs__active-bar.is-top {
      width: 60px !important;
    }
  }
}

.account-wrap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .account-left-wrap {
    width: 30%;
    position: sticky;
    top: 0px;
  }

  .account-right-wrap {
    width: 68%;
  }
}
</style>
