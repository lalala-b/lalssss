<template>
  <div class="table-view">
    <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
      <el-table-column prop="createdTime" label="创建时间" width="100" />
      <el-table-column prop="workId" label="工单号" />
      <el-table-column label="商单号">
        <template slot-scope="{ row }">
          {{ row.quotientId || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="orderName" label="订单名称" />
      <el-table-column prop="workStatus" label="工单状态">
        <template slot-scope="{ row }">
          <span>{{ ['商务信息待录入', '待履约', '已履约', '已核账', '撤单'][row.workStatus] }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessGroupName" label="商务小组" />
      <el-table-column prop="businessDockingPeopleName" label="商务对接人" width="90" />
      <el-table-column prop="mediumPrincipalName" label="媒介采买人" width="90" />
      <el-table-column prop="mediumDeliveryUserName" label="媒介投放人" width="90">
        <template slot-scope="{ row }">
          <span>{{ row.mediumDeliveryUserName|emptyFill }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderInfo"
        label="下单账号"
        width="210"
        align="left"
      >
        <template slot-scope="{ row }">
          <AccountCard
            :info="row"
            :options="{ imgUrl: 'accountImg', name: 'accountName' }"
          />
        </template>
      </el-table-column>
      <el-table-column prop="finishTimeConfirm" label="已定排期" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.finishTimeConfirm || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="platAccountQuotation" label="平台账号报价">
        <template slot-scope="{ row }">
          <span>{{ row.platAccountQuotation || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="videoReleaseTime" label="视频发布时间" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.addTime || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="isRebate" label="是否返款">
        <template slot-scope="{ row }">
          <span>{{ +row.isRebate === 1 ? '已返款' : '未返款' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rebateTime" label="返款时间" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.rebateTime || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="remark" label="备注">
        <template slot-scope="{ row }">
          <span>{{ row.remark || '--' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right">
        <template slot-scope="{ row }">
          <IconTip
            content="查看"
            icon-class="iconxiangqing"
            @click="handleShow(row)"
          />
          <IconTip
            v-if="[1, 2, 3, 4].includes(Number(row.workStatus))"
            content="编辑"
            icon-class="iconbianji"
            @click="handleEdit(row)"
          />
        </template>
      </el-table-column>
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

    <DetailDialog v-if="showDialog" :id="detailId" :show="showDialog" :type="dialogType" :account-id="accountId" @getList="handleGetList" @close="showDialog = false" />
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
import { AccountCard, VideoInfo, IconTip, VideoList } from 'components'
import { $getSummaryList } from '@/api/medium-manage'
import { useTableSort } from '@/hook'
import DetailDialog from './dialog.vue'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    AccountCard,
    VideoInfo,
    IconTip,
    VideoList,
    DetailDialog
  },

  setup(props, { emit }) {
    const { $message, $route } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: [],
      showDialog: false,
      dialogType: 'show',
      detailId: 0,
      accountId: 0
    })

    onMounted(() => {
      const { workId, type } = $route.query
      if (workId && type === 'edit') {
        state.dialogType = 'edit'
        state.showDialog = true
        state.detailId = +workId
      }
    })

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $getSummaryList({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            // res.data.list.forEach((item) => {
            //   const list = item.componentClickConversionRelationVideoVOList
            //   if (Array.isArray(list) && list.length >= 1) {
            //     item.videoList = list.slice(0, list.length - 1).reverse()
            //     item.videoInfo = list[list.length - 1]
            //   } else {
            //     item.videoList = []
            //     item.videoInfo = {}
            //   }
            // })
            state.tableData = res.data.mediumOrder || []
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
    // 排序
    const { doSort } = useTableSort(props.searchData, getList)

    const handleShow = ({ workId }) => {
      state.dialogType = 'show'
      state.showDialog = true
      state.detailId = workId
    }

    const handleEdit = ({ workId, accountId }) => {
      state.dialogType = 'edit'
      state.showDialog = true
      state.detailId = workId
      state.accountId = accountId
    }

    const handleClose = () => {
    }

    const handleGetList = () => {
      emit('getList')
    }

    return {
      ...toRefs(state),
      doSort,
      getList,
      handleShow,
      handleEdit,
      handleClose,
      handleGetList
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
</style>
