
<template>
  <div class="table-view">
    <el-table v-scrollbar v-loading="loading" :data="tableData">

      <el-table-column
        prop="quotientId"
        label="商单号"
      >
        <template slot-scope="{ row }">
          {{ row.quotientId || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="customerName"
        label="联系人"
      >
        <template slot-scope="{ row }">
          {{ row.customerName || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="crmName"
        label="归属商务"
      >
        <template slot-scope="{ row }">
          {{ row.crmName || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="brandName"
        label="合作产品"
      >
        <template slot-scope="{ row }">
          {{ row.brandName || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="productTime"
        label="成单日期"
      >
        <template slot-scope="{ row }">
          {{ row.productTime || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="workMoney"
        label="销售收入"
      >
        <template slot-scope="{ row }">
          {{ row.workMoney || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="isMoneyDesc"
        label="是否到款"
      >
        <template slot-scope="{ row }">
          {{ row.isMoneyDesc || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="executeName"
        label="执行人"
      >
        <template slot-scope="{ row }">
          {{ row.executeName || '--' }}
        </template>
      </el-table-column>

    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="10"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs,
  onMounted
} from '@vue/composition-api'
import {
  $getCustomerDetailInvoiceList
} from '@/api/bussiness-manage'
import { copy } from '@/utils'

export default defineComponent({
  components: {},
  props: {
    customerId: {
      type: String | Number,
      default: ''
    }
  },
  setup(props) {
    const { $message, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: [],
      searchData: {
        pageNum: 0,
        pageSize: 10
      }
    })

    const getList = function() {
      state.loading = true
      const searchData = copy(state.searchData)

      return $getCustomerDetailInvoiceList({
        ...searchData,
        customerId: props.customerId
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data.list
            state.total = res.data.total
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      getList
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}
</style>

