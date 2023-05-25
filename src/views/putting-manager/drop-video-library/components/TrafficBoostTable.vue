<template>
  <div class="table-view">
    <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
      <el-table-column
        prop="orderInfo"
        label="平台订单信息"
        width="340"
        align="left"
      >
        <template slot-scope="{ row }">
          <AccountCard
            :info="row"
            :options="{ imgUrl: 'accountImg', name: 'starName' }"
          >
            <el-tooltip
              :disabled="!row.supplementOrderNo"
              type="el-popover"
              :content="row.supplementOrderNo"
              placement="top"
            >
              <p class="info-text text-over-hidden-1">
                流量助推订单ID：{{ row.supplementOrderNo || '--' }}
              </p>
            </el-tooltip>
            <p class="info-text">
              平台订单ID：{{ row.orderId || '--' }}
            </p>
            <el-tooltip
              :disabled="!row.taskName"
              type="el-popover"
              :content="row.taskName"
              placement="top"
            >
              <p class="info-text text-over-hidden-1">
                平台任务名称：{{ row.taskName || '--' }}
              </p>
            </el-tooltip>
            <p class="info-text">
              平台任务创建时间：{{
                row.createTime ? row.createTime : '--'
              }}
            </p>
            <p class="info-text">
              组件类型：{{
                +row.taskType === 1 ? '应用': +row.taskType === 2 ?'电商': +row.taskType === 3 ? '品牌' :'未知（未开启）'
              }}
            </p>
          </AccountCard>
        </template>
      </el-table-column>
      <el-table-column prop="starAmount" label="视频价格" />
      <el-table-column prop="amount" label="平台消耗金额" />
      <!-- <el-table-column prop="play" label="流量" /> -->
      <el-table-column width="200" align="left">
        <template slot="header">
          <div class="titleBox">
            <span>推广状态</span>
            <span class="description">(流量助推)</span>
          </div>
        </template>
        <template slot-scope="{ row }">
          <div class="statusBox">
            <p>
              {{ +row.spreadStatus === 1 ? '推广中': +row.spreadStatus === 2 ? '推广完成' : '未知' }}
            </p>
            <p class="info-text">
              开始时间：{{ row.promotionBeginTime || '--' }}
            </p>
            <p class="info-text">
              结束时间：{{ row.closingTime || '--' }}
            </p>
            <p class="info-text">
              优化目标/投放目标：{{ +row.unitType === 1 ? '封面点击' : +row.unitType === 2 ? '行为数' : +row.unitType === 3 ? '激活' : +row.unitType === 4 ? '表单' : '未知' }}
            </p>
            <p class="info-text">
              出价/目标成本：{{ row.unitPrice || '--' }}
            </p>
          </div>
        </template>
      </el-table-column>

      <el-table-column sortable prop="consumeAmount" width="140" align="center">
        <template slot="header">
          <div class="titleBox right">
            <span>实际消耗金额</span>
            <span class="description">(流量助推)</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column sortable prop="conversionCount" width="140" align="center">
        <template slot="header">
          <div class="titleBox right">
            <span>激活数</span>
            <span class="description">(流量助推)</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column sortable prop="cpa" width="140" align="center">
        <template slot="header">
          <div class="titleBox right">
            <span>激活单价</span>
            <span class="description">(流量助推)</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="updatedTime" label="流量助推数据更新时间" width="140" align="center" />
      <!-- <el-table-column sortable prop="totalAmount" label="订单总消耗金额" width="140" align="center" /> -->
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs } from '@vue/composition-api'
import { AccountCard, VideoInfo, IconTip, VideoList } from 'components'
import { useTableSort } from '@/hook'
import { $getKuaishouTrafficBoostList } from '@/api/traffic-boost'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    platOwner: {
      type: String,
      default: '投放'
    }
  },
  components: {
    AccountCard,
    VideoInfo,
    IconTip,
    VideoList
  },

  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: []
    })

    const getList = () => {
      state.loading = true
      return $getKuaishouTrafficBoostList({
        ...props.searchData,
        platOwner: props.platOwner
      })
        .then((res) => {
          state.loading = false
          if (+res.code === 1) {
            state.tableData = (res.data || {}).list || []
            state.total = (res.data || {}).total || 0
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

    const { doSort } = useTableSort(props.searchData, getList)

    return {
      ...toRefs(state),
      doSort,
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
    &-right{
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

.titleBox {
  display: inline-block;
  vertical-align: inherit;

  .description {
    display: block;
    text-align: center;
    font-size: 10px;
  }
}

// .right {
//   .description {
//     display: block;
//     text-align: center;
//     font-size: 10px;
//   }
// }

.statusBox {
  text-align: left;
}
</style>
