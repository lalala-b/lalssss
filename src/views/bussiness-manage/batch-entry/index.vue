<template>
  <div>
    <wrap class="view">
      <div class="message">
        <span> 商单合作产品：{{ detail.cooperationProducts || '--' }}</span>
        <span> 商单销售收入：{{ detail.quotientMoney || 0 }}</span>
        <span> 商单返点金额：{{ detail.quotientDiscount || 0 }}</span>
        <span> 工单销售收入总和：<span :class="[moneyError && 'errorText']">{{ detail.workMoney || 0 }}</span></span>
        <span> 工单返点总和：<span :class="[discountError && 'errorText']">{{ detail.workDiscount || 0 }}</span></span>
      </div>
    </wrap>

    <wrap class="m-t-16">
      <el-table v-scrollbar v-loading="loading" :data="tableData">
        <el-table-column prop="workId" label="工单号" />

        <el-table-column label="平台-账号" width="200" align="left">
          <template slot-scope="{ row }">
            <AccountCard v-if="+row.special === 0" :info="row" />
            <el-tag
              v-else
              class="m-r-5 m-b-5"
              size="mini"
            >{{ row.platName || '无' }} - {{ row.accountName || '无' }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="订单归属" width="130">
          <template slot-scope="{ row }">
            <span v-if="+row.special === 0">{{
              row.accountBelong ? (String(row.accountBelong).split(',') || [])[0] || '--' : '--'
            }}</span>
            <span v-else>{{ '--' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="工单状态" width="120">
          <template slot-scope="{ row }">
            <span v-if="+row.special === 0">
              {{ orderStatusMap.get(row.workStatus) || '--' }}
              <div v-if="+row.lockMoney">（金额已锁定）</div>
            </span>
            <span v-else>
              {{ +row.workStatus ? '已完成' : '未完成' }}
              <div v-if="+row.lockMoney">（金额已锁定）</div>
            </span>
          </template>
        </el-table-column>

        <!-- <el-table-column width="132">
          <template slot="header">
            <span class="check">
              <span>*</span>
              绩效月
            </span>
          </template>
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.workStatus === 4">{{ row.monthMoney }}</span>
            <el-date-picker
              v-else
              v-model="row.monthMoney"
              :class="['input', row.error && !row.monthMoney && 'errorInput']"
              type="month"
              size="small"
              placeholder="请选择"
            />
          </template>
        </el-table-column> -->

        <el-table-column width="132">
          <template slot="header">
            <span class="check">
              <span>*</span>
              销售收入
            </span>
          </template>
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.workMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.workMoney"
              :class="['input', row.error && !row.workMoney && 'errorInput']"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <!-- <el-table-column width="132">
          <template slot="header">
            <span class="check">
              <span>*</span>
              平台下单价
            </span>
          </template>
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.platOrderMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.platOrderMoney"
              :class="['input', row.error && !row.platOrderMoney && 'errorInput']"
              size="small"
              :min="0"
              :precision="2"
              :max="99999999"
              placeholder="请输入"
            />
          </template>
        </el-table-column> -->

        <el-table-column label="对公返点" width="132">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.discount
            }}</span>
            <el-input-number
              v-else
              v-model="row.discount"
              :min="0"
              :precision="2"
              :max="row.workMoney"
              size="small"
              class="input"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <el-table-column label="对私返点" width="132">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.discountPrivate
            }}</span>
            <el-input-number
              v-else
              v-model="row.discountPrivate"
              :min="0"
              :precision="2"
              :max="row.flowMoney"
              size="small"
              class="input"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <el-table-column label="折扣金额" width="132">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.rebateMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.rebateMoney"
              :min="0"
              :precision="2"
              :max="row.flowMoney"
              size="small"
              class="input"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <el-table-column label="平台手续费" width="132">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.platMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.platMoney"
              size="small"
              class="input"
              :min="0"
              :precision="2"
              :max="99999999"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <el-table-column label="抖+成本" width="132">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.douMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.douMoney"
              size="small"
              class="input"
              :min="0"
              :precision="2"
              :max="99999999"
              placeholder="请输入"
            />
          </template>
        </el-table-column>

        <el-table-column label="其他成本" width="150">
          <template slot-scope="{ row }">
            <span v-if="+row.reconciliationStatus || +row.lockMoney || +row.workStatus === 4">{{
              row.otherMoney
            }}</span>
            <el-input-number
              v-else
              v-model="row.otherMoney"
              size="small"
              class="input"
              :min="0"
              :precision="2"
              :max="99999999"
              placeholder="请输入"
            />
          </template>
        </el-table-column>
      </el-table>

      <div class="saveBox">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button
          type="primary"
          class="saveButton"
          :loading="loading"
          @click="handleSave"
        >保存</el-button>
      </div>
    </wrap>
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  onMounted,
  getCurrentInstance,
  computed,
  watch
} from '@vue/composition-api'
import dayjs from 'dayjs'
import { $getBatchEntryList, $batchUpdateOrder } from '@/api/bussiness-manage'
import AccountCard from '@/components/AccountCard'
import { commonData } from '../order-management/_coms/hooks'

export default defineComponent({
  components: {
    AccountCard
  },
  setup() {
    const { orderStatusMap } = commonData()
    const { $message, $route, $router } = getCurrentInstance().proxy

    const totalWorkMoney = computed(() => {
      let total = 0
      const table = [...states.tableData]
      table.filter(item => +item.workStatus !== 4).forEach((item) => {
        total += +(item.workMoney || 0)
      })
      return total
    })

    const totalRefundMoney = computed(() => {
      let total = 0
      const table = [...states.tableData]
      table.filter(item => +item.workStatus !== 4).forEach((item) => {
        total += +item.discount
        total += +item.discountPrivate
      })
      return total
    })

    const states = reactive({
      detail: {
        cooperationProducts: '',
        quotientDiscount: '',
        quotientMoney: '',
        workDiscount: '',
        workMoney: '',
      },
      moneyError: false,
      discountError: false,
      tableData: [],
      loading: false

    })

    watch(
      () => totalWorkMoney.value,
      (val) => {
        states.detail.workMoney = val
      }
    )

    watch(
      () => totalRefundMoney.value,
      (val) => {
        states.detail.workDiscount = val
      }
    )

    onMounted(async() => {
      const { id } = $route.query || {}
      if (!id) {
        $message.error('商单id不能为空')
        return
      }

      try {
        states.loading = true

        const {
          code,
          data: { batchEntryBO = {}, batchWorkInfo = [] },
          message
        } = await $getBatchEntryList({ quotientId: id })

        states.loading = false

        if (+code === 1) {
          states.detail = {
            cooperationProducts: batchEntryBO.cooperationProducts || '',
            quotientMoney: batchEntryBO.quotientMoney || 0,
            quotientDiscount: batchEntryBO.quotientDiscount || 0,
            workDiscount: batchEntryBO.workDiscount || 0,
            workMoney: batchEntryBO.workMoney || 0,
          }

          states.tableData = batchWorkInfo.map((item) => {
            const newItem = { ...item }
            newItem.douMoney = item.douMoney || 0
            newItem.otherMoney = item.otherMoney || 0
            if (item.workMoney === null) {
              delete newItem.workMoney
            }

            return newItem
          })
        } else {
          $message.error(message)
        }
      } catch (e) {
        states.loading = false
        $message.error(e)
      }
    })

    const handleCancel = () => {
      const routeUrl = $router.resolve({
        path: '/bussiness-manage/bill-manage'
      })
      window.open(routeUrl.href, '_self')
    }

    const handleSave = async() => {
      if (states.detail.workMoney > states.detail.quotientMoney) {
        $message.warning('工单销售收入总和不得大于商单销售收入')
        states.moneyError = true
        return
      }

      if (states.detail.workDiscount > states.detail.quotientDiscount) {
        $message.warning('工单返点总和不得大于商单返点金额')
        states.discountError = true
        return
      }

      states.moneyError = false
      states.discountError = false

      const { id } = $route.query || {}

      let hasError = false

      const checkArr = [...states.tableData].map(item => {
        const newItem = { ...item }
        let error = false

        const { workMoney, discountPrivate, discount, rebateMoney, platMoney, douMoney, otherMoney } = item

        // 对公返点，对私返点，折扣金额，平台手续费，抖+成本，其他成本
        const otherValue = +discountPrivate || +discount || +rebateMoney || +platMoney || +douMoney || +otherMoney

        if (!otherValue && (workMoney === null || workMoney === undefined)) {
          // 其他值空 且 销售收入都是空
          error = false
        } else if (workMoney !== null && workMoney !== undefined) {
          // 销售收入有值
          error = false
        } else {
          error = true
          hasError = true
        }

        newItem.error = error

        return newItem
      })

//  return
      states.tableData = [...checkArr]

      if (hasError) return

      const arr = states.tableData.map(
        ({
          reconciliationStatus,
          accountId,
          workId,
          workMoney,
          discountPrivate,
          discount,
          rebateMoney,
          platMoney,
          otherMoney,
          workStatus,
          douMoney,
          special
        }) => {
          return {
            quotientId: id,
            reconciliationStatus,
            accountId,
            workId,
            workMoney: (workMoney === undefined || workMoney === null) ? null : Number(workMoney || 0).toFixed(2),
            discountPrivate: Number(discountPrivate || 0).toFixed(2),
            discount: Number(discount || 0).toFixed(2),
            rebateMoney: Number(rebateMoney || 0).toFixed(2),
            platMoney: Number(platMoney || 0).toFixed(2),
            otherMoney: Number(otherMoney || 0).toFixed(2),
            workStatus,
            douMoney: Number(douMoney || 0).toFixed(2),
            special
          }
        }
      )

      try {
        states.loading = true

        const { code, message } = await $batchUpdateOrder({ batchUpdateOrderList: arr })

        states.loading = false

        if (+code === 1) {
          $message.success('保存成功')
          setTimeout(() => {
            const routeUrl = $router.resolve({
              path: '/bussiness-manage/bill-manage'
            })
            window.open(routeUrl.href, '_self')
          }, 1000)
        } else {
          $message.error(message)
        }
      } catch (e) {
        states.loading = false
        $message.error(e || '网络错误')
      }
    }

    return {
      ...toRefs(states),
      orderStatusMap,
      handleSave,
      handleCancel
    }
  }
})
</script>
<style lang="scss" scoped>
.message {
  span {
    font-size: 14px;
    margin-right: 40px;
    // margin-bottom: 20px;
    display: inline-block;
  }
}

.check {
  span {
    color: #ff0000;
  }
}

.input {
  width: 122px;
}

::v-deep {
  .el-table__body-wrapper {
    max-height: calc(100vh - 340px);
    overflow: auto;
  }
}

.saveBox {
  display: flex;
  justify-content: flex-end;
  padding-top: 10px;
}

.errorText {
  color: #ff0000;
}

::v-deep {
  .errorInput {
    .el-input__inner {
      border-color: #ff0000 !important;
    }
  }
}
</style>
