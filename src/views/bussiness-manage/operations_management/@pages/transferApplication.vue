<template>
  <div class="repeal">
    <wrap v-loading="loading">
      <h3 class="m-b-24">
        {{ detailTitle }}
      </h3>
      <el-steps
        v-if="![6, 7].includes(transferOrderStatus)&&!loading"
        class="m-t-24 m-b-48"
        :active="itemStep"
        finish-status="success"
        :align-center="true"
      >
        <template v-if="detailTitle === '移交申请'">
          <el-step title="移交申请" />
          <el-step title="同意接收" />
          <el-step title="审批通过" />
          <el-step title="核实确认" />
          <el-step title="移交完成" />
        </template>
        <template v-if="detailTitle === '账号运营申请'">
          <el-step title="账号运营申请" />
          <el-step title="审批通过" />
          <el-step title="申请完成" />
        </template>
        <template v-if="detailTitle === '账号修改报备申请'">
          <el-step title="账号修改报备申请" />
          <el-step title="核实通过" />
          <el-step title="申请完成" />
        </template>
      </el-steps>
      <template v-if="!loading">
        <div
          v-if="detailTitle === '移交申请' && transferOrderStatus === 6"
          class="tip-red m-b-48"
        >
          账号移交申请已撤销！
        </div>
        <div
          v-if="detailTitle === '账号修改报备申请' && transferOrderStatus === 6"
          class="tip-red m-b-48"
        >
          账号修改报备申请已撤销！
        </div>
        <template
          v-if="transferOrderStatus === 7 && recordList && recordList.length"
        >
          <div
            v-if="recordList[recordList.length - 1].remark === '拒绝接收'"
            class="tip-red m-b-48"
          >
            账号已被拒绝接收，移交账号失败。
          </div>
          <template v-else>
            <div v-if="detailTitle === '账号运营'" class="tip-red m-b-48">
              账号运营申请未审批通过，已驳回！添加账号失败。
            </div>
            <div v-if="detailTitle === '移交申请'" class="tip-red m-b-48">
              账号移交申请未通过，已驳回！移交账号失败。
            </div>
            <div v-if="detailTitle === '账号修改报备申请'" class="tip-red m-b-48">
              账号修改报备申请未审批通过，已驳回！报备失败。
            </div>
          </template>
        </template>
        <template
          v-if="currentType === 'approval' && transferOrderStatus !== 5"
          class="m-b-16"
        >
          <el-button
            v-if="transferOrderStatus === 1"
            type="success"
            class="m-r-32"
            icon="el-icon-check"
            @click="handleReceive"
          >同意接收</el-button>
          <el-button
            v-if="
              [2, 3].includes(transferOrderStatus) &&
                isHandlePeople &&
                detailTitle !== '账号修改报备申请'
            "
            type="success"
            class="m-r-32"
            icon="el-icon-check"
            @click="handleapproved"
          >审批通过</el-button>
          <el-button
            v-if="transferOrderStatus === 4 && isHandlePeople"
            type="success"
            class="m-r-32"
            icon="el-icon-check"
            @click="handleVerify"
          >核实通过</el-button>
          <el-button
            v-if="[1, 2, 3, 4].includes(transferOrderStatus) && ShowRejected"
            type="danger"
            icon="el-icon-close"
            @click="handleRejected"
          >驳回</el-button>
        </template>
      </template>
      <div class="flex repeal-wrapper m-t-24">
        <div class="repeal-left m-r-24">
          <div class="flex repeal-wrapper">
            <p class="m-r-32">申请人：{{ info.curApplyName | emptyFill }}</p>
            <p class="m-l-32">
              申请单号：{{ info.transferOrderNumber | emptyFill }}
            </p>
          </div>
          <div class="m-t-32 repeal-wrapper">
            <AccountCard :info="info" :options="{ imgUrl: 'avatarUri' }">
              <template v-slot>
                <p v-if="info.platId" class="account-txt">{{ [25,26].includes(info.platId)?info.platName+'号':'ID' }}：{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</p>
                <div
                  v-if="info.upUpNameAndLeader"
                  class="m-t-5"
                  style="text-align: left"
                >
                  <el-tag size="mini" type="danger">{{
                    info.upUpNameAndLeader
                  }}</el-tag>
                </div>
              </template>
            </AccountCard>
            <div>
              <h3 class="m-t-24 m-b-12">当前信息</h3>
              <div class="box-border m-b-16">
                <div>运营负责人： {{ info.curOperatorName | emptyFill }}</div>
                <div>账号归属： {{ info.accountBelong | emptyFill }}</div>
                <div>手机号： {{ info.phone | emptyFill }}</div>
                <div>账号统一名称： {{ info.belongName | emptyFill }}</div>
              </div>
              <template v-if="operationType === '账号移交'">
                <div>
                  移交给： {{ info.newOperatorName | emptyFill }}
                  <span
                    v-if="info.newOperatorNameD"
                  >（{{ info.newOperatorNameD
                  }}{{
                    info.newOperatorNameF ? '-' + info.newOperatorNameF : ''
                  }}）</span>
                </div>
                <div class="flex">
                  <div>移交原因：</div>
                  <div class="item-reason">
                    {{ info.transferReason | emptyFill }}
                  </div>
                </div>
              </template>
              <template v-if="operationType === '账号修改报备'">
                <h3>修改内容</h3>
                <template v-if="info.editAccountReportingBO">
                  <div v-if="info.editAccountReportingBO.inventoryPhone">
                    绑定手机号：
                    {{ info.editAccountReportingBO.inventoryPhone }}
                  </div>
                  <div v-if="info.editAccountReportingBO.realCelebrityName">
                    实名人： {{ info.editAccountReportingBO.realCelebrityName }}
                  </div>
                  <div v-if="info.editAccountReportingBO.idCardNum">
                    实名人身份证： {{ info.editAccountReportingBO.idCardNum }}
                  </div>
                  <div
                    v-if="info.editAccountReportingBO.withdrawalBoundAccount"
                  >
                    提现绑定账户：
                    {{ info.editAccountReportingBO.withdrawalBoundAccount }}
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
        <div class="repeal-wrapper repeal-right">
          <h3 class="m-l-12">流程记录</h3>
          <div class="repeal-wrapper">
            <template v-if="recordList.length">
              <ul v-for="(item, index) in recordList" :key="index">
                <li>
                  <span
                    class="item-record"
                  >{{ item.timeObj.year }}年{{ item.timeObj.month }}月{{
                    item.timeObj.day
                  }}日{{ item.timeObj.hour }}时{{ item.timeObj.minite }}分{{
                    item.timeObj.second
                  }}秒</span>
                  {{ item.userName }}
                  <span class="item-record">{{ item.remark }}</span>
                </li>
              </ul>
            </template>
            <div v-else class="no-data">暂无记录</div>
          </div>
        </div>
      </div>
    </wrap>
  </div>
</template>
<script>
// 移交单状态：1-待接收、2-待审批(团)、3-待审批(军)、4-待核实、5-已完成、6-已撤销、7-已驳回
import {
  computed,
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import {
  $getRemoveInfo,
  $receiveAplication,
  $approvedAccount,
  $verificationPassedAccount,
  $approvedOperateAccount,
  $getAccountOperateDetail,
  $getAccountReportDetail,
  $reportApprovedAccount
} from '@/api/operating-manage'
import { AccountCard } from 'components'
import { commonData } from '../_com/hooks'
import { copy } from '@/utils'
export default defineComponent({
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const { $message, $route, $store, $confirm } = getCurrentInstance().proxy
    const { getTimeObj } = commonData()
    const queryParams = $route.query || {}
    const states = reactive({
      loading: true,
      info: {},
      transferOrderStatus: 1,
      repealLoading: false,
      recordList: [],
      currentType: queryParams.type ? queryParams.type : '',
      curHandlerId: '',
      operationType: queryParams.operationType || '',
      editAccountReportingBO: {},
      showStep: false
    })
    const detailTitle = computed(() => {
      let title = ''
      switch (queryParams.operationType) {
        case '账号运营':
          title = '账号运营申请'
          break
        case '账号修改报备':
          title = '账号修改报备申请'
          break
        case '账号移交':
          title = '移交申请'
          break
      }
      return title
    })
    const isHandlePeople = computed(() => {
      return states.curHandlerId === $store.state.user.userInfo.id
    })
    const ShowRejected = computed(() => {
      if (states.transferOrderStatus === 1) {
        return true
      }
      if ([2, 3].includes(states.transferOrderStatus) && isHandlePeople.value) {
        return true
      }
      if (states.transferOrderStatus === 4 && isHandlePeople.value) {
        return true
      }
      return false
    })
    const itemStep = computed(() => {
      states.showStep = true
      switch (states.transferOrderStatus) {
        case 1:
          return 1
        case 2:
          return 2
        case 3:
          return queryParams.operationType !== '账号移交' ? 1 : 2
        case 4:
          return queryParams.operationType === '账号修改报备' ? 1 : 3
        case 5:
          return 5
      }
    })
    const getRemoveInfo = async function() {
      try {
        states.loading = true
        let $api = ''
        switch (queryParams.operationType) {
          case '账号运营':
            $api = $getAccountOperateDetail
            break
          case '账号修改报备':
            $api = $getAccountReportDetail
            break
          default:
            $api = $getRemoveInfo
            break
        }
        const res = await $api({
          transferOrderId: queryParams.transferOrderId
        })
        if (res.code === 1 && res.data) {
          const list = copy(res.data.recordList) || []
          list.forEach((item) => {
            item.timeObj = getTimeObj(item.createdTime)
          })
          states.recordList = list
          states.info = res.data
          states.curHandlerId = res.data.curHandlerId
          states.transferOrderStatus = res.data.transferOrderStatus
        } else {
          $message.error(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }
    const handleReceive = async() => {
      const res = await $receiveAplication({
        transferOrderId: queryParams.transferOrderId,
        examineStatus: 1
      })
      if (res.code === 1) {
        $message.success('账号已确认接收')
        getRemoveInfo()
      } else {
        $message.error(res.message)
      }
    }
    const handleapproved = async() => {
      let $api = ''
      if (queryParams.operationType === '账号运营') {
        $api = $approvedOperateAccount
      } else {
        $api = $approvedAccount
      }
      const res = await $api({
        transferOrderId: queryParams.transferOrderId,
        examineStatus: 1
      })
      if (res.code === 1) {
        $message.success('账号已审批通过')
        getRemoveInfo()
      } else {
        $message.error(res.message)
      }
    }
    const handleVerify = async() => {
      let $api = ''
      if (queryParams.operationType === '账号移交') {
        $api = $verificationPassedAccount
      } else {
        $api = $reportApprovedAccount
      }
      if (queryParams.operationType === '账号修改报备') {
        await $confirm('修改内容同步更新至【账号盘点库】？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
      const res = await $api({
        transferOrderId: queryParams.transferOrderId,
        examineStatus: 1
      })
      if (res.code === 1) {
        $message.success('账号已核实通过')
        getRemoveInfo()
      } else {
        $message.error(res.message)
      }
    }

    const handleRejected = async() => {
      let $api = ''
      switch (String(states.transferOrderStatus)) {
        case '1':
          // 移交：同意接收驳回
          $api = $receiveAplication
          break
        case '2':
          if (queryParams.operationType === '账号移交') {
            // 移交：审批通过团驳回
            $api = $approvedAccount
          }
          break
        case '3':
          if (queryParams.operationType === '账号移交') {
            $api = $approvedAccount
          } else {
             // 账号运营:审批驳回
            $api = $approvedOperateAccount
          }
          break
        case '4':
          if (queryParams.operationType === '账号移交') {
            // 账号移交核实通过驳回
            $api = $verificationPassedAccount
          } else {
            // 账号修改报备核实通过驳回
            $api = $reportApprovedAccount
          }

          break
      }
      const res = await $api({
        transferOrderId: queryParams.transferOrderId,
        examineStatus: 2,
        transferOrderStatus: states.transferOrderStatus
      })
      if (res.code === 1) {
        $message.success('已驳回')
        getRemoveInfo()
      } else {
        $message.error(res.message)
      }
    }
    getRemoveInfo()
    return {
      ...toRefs(states),
      handleRejected,
      handleReceive,
      handleVerify,
      handleapproved,
      ShowRejected,
      itemStep,
      isHandlePeople,
      detailTitle
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .account-card__image {
    height: 58px;
    width: 58px;
  }
}
.account-txt{
  color: rgb(141, 141, 141);
  font-size: 14px;
}
.repeal {
  font-size: 14px;
  &-wrapper {
    width: 100%;
    border: 1px solid #eee;
    padding: 16px;
  }
  &-left {
    width: 54%;
    line-height: 32px;
    .item-reason {
      width: 300px;
    }
  }
  &-right {
    width: 46%;
    line-height: 32px;
    .item-record {
      color: #7c7777d9;
    }
  }
  .box-border {
    width: 50%;
    border: 1px solid #eee;
  }
  .tip-red {
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
