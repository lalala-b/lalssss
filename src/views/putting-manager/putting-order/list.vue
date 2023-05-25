<template>
  <div class="C-putting-order-list">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
        <template slot="label">
          {{ item.label }} <i v-if="item.val" v-loading="tabNumLoading" class="icon-high">{{ item.val }}</i>
        </template>
        <Wrap>
          <!-- <keep-alive> -->
          <component
            :is="`${activeName}`"
            v-if="activeName === item.name"
            :type="activeName"
            :org-info="orgInfo"
            :plat-data="platData"
            :account-data="accountData"
            :delivery-data="deliveryData"
            @setTabOnlyLoading="setTabOnlyLoading"
            @changeTabNum="changeTabNum"
          />
        <!-- </keep-alive> -->
        </Wrap>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import MyOrder from './_component/list/my_order.vue'
import TeamOrder from './_component/list/team_order.vue'
import WaitOrder from './_component/list/wait_order.vue'
import PaymentOrder from './_component/list/paymentOrder.vue'
import PublishSubmit from './_component/list/publishSubmit.vue'
import AccountingOrder from './_component/list/accountingOrder.vue'
import { $getAccountCondition, $getTransferCondition } from '@/api/bussiness-manage'
import { $getWaitApprovalOrder } from '@/api/putting-manager'

export default {
  components: { MyOrder, TeamOrder, WaitOrder, PaymentOrder, AccountingOrder, PublishSubmit },
  data() {
    return {
      activeName: 'MyOrder',
      tabNumLoading: false,
      tabs: (() => {
        let tab = [
          {
            name: 'MyOrder',
            label: '我的订单',
            permission: 'self_order'
          },
          {
            name: 'WaitOrder',
            label: '待审核订单',
            val: 0,
            loading: false,
            valKey: 'reviewerOrderCount',
            highKey: 'reviewerOrderFlag',
            permission: 'putting_order_wait_tab2'
          },
          {
            name: 'PaymentOrder',
            label: '待下单付款',
            val: 0,
            loading: false,
            valKey: 'waitOrderPayCount',
            highKey: 'waitOrderPayFlag',
            permission: 'putting_order_wait_payment'
          },
          {
            name: 'PublishSubmit',
            label: '待发布提交',
            val: 0,
            loading: false,
            valKey: 'waitVideoSubmitCount',
            highKey: 'waitVideoSubmitFlag',
            permission: 'putting_order_wait_money'
          },
          {
            name: 'AccountingOrder',
            label: '待资金核算',
            val: 0,
            loading: false,
            valKey: 'waitFundRevieweCount',
            highKey: 'waitFundRevieweFlag',
            permission: 'putting_order_wait_money'
          },
          {
            name: 'TeamOrder',
            label: '团队订单',
            permission: 'group_order'
          }
        ]
        // if (!this.$permission('putting_order_wait')) {
        //   tab.splice(1, 1)
        // }
        tab = tab.filter(t => this.$permission(t.permission))
        return tab
      })(),
      platData: [],
      deliveryData: [],
      accountData: [],
      orgInfo: []
    }
  },
  created() {
    const { query } = this.$route
    if (query.activeName) {
      this.activeName = query.activeName
    } else {
      this.activeName = this.tabs[0].name
    }
    this.getAccountCondition()
    this.getTransferCondition()
    // 初始化tab数据
    this.initTabValData()
  },
  methods: {
    getTabItemToIndex(name) {
      for (let index = 0; index < this.tabs.length; index++) {
        const element = this.tabs[index]
        if (element.name === name) {
          return index
        }
      }
      return 0
    },
    // 更新tab上的数值
    changeTabNum({ name, val }) {
      const index = this.getTabItemToIndex(name)
      this.tabs[index].val = val
    },
    setTabOnlyLoading({ name, val }) {
      // console.log(4)
      const index = this.getTabItemToIndex(name)
      this.tabs[index].loading = val
    },
    async getWaitApprovalOrder(params) {
      this.tabNumLoading = true
      const res = await $getWaitApprovalOrder(params, Math.random())
      this.tabNumLoading = false
      if (res.code === 1) {
        return res.data
      } else {
        this.$message.error(res.message || '网络错误')
        return Promise.reject()
      }
    },
    initTabValData() {
      this.getWaitApprovalOrder({}).then(data => {
          const { orderConditionCountVO } = data
          this.tabs.forEach(tab => {
            const { valKey, highKey } = tab
            const val = orderConditionCountVO[valKey]
            const hasHigh = orderConditionCountVO[highKey]
            if (orderConditionCountVO[valKey]) {
              tab.val = val
              tab.hasHigh = hasHigh
            }
          })
        })
        .catch(err => {
          if (err.__CANCEL__) return
          this.$message.error(err.message || '网络错误')
        })
    },
    async getAccountCondition(params) {
      const res = await $getAccountCondition(params)
      if (res.code === 1) {
        this.platData = res.data.platInfo
        this.accountData = res.data.accountInfo
        this.orgInfo = res.data.orgInfo
      }
    },
    // 获取广告师
    getTransferCondition(orgId) {
      $getTransferCondition({ orgId }).then(res => {
        if (res.code === 1) {
          this.deliveryData = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    handleClick(e) {
      const activeName = e.name
      const label = e.label
      this.$router.replace({
        query: {
          activeName,
          tabName: label
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-putting-order-list {
    // ::v-deep .cell { text-align: center; }
    ::v-deep .el-tabs__content {
      overflow: initial;
    }
    .icon-high {
      background-color: #f00;
      color: #fff;
      // width: 16px;
      padding: 0 4px;
      height: 16px;
      line-height: 16px;
      display: inline-block;
      text-align: center;
      border-radius: 10px;
      ::v-deep .el-loading-spinner {
        margin-top: -10px;
        .circular {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>
