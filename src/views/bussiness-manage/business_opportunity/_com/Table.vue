
<template>
  <div class="table-view">
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      @sort-change="doSort"
    >
      <el-table-column prop="opportunityId" label="商机ID" />
      <el-table-column
        prop="businessUserName"
        label="商务人员"
        width="100"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{ row.businessUserName || '--' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="110"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{
            row.createTime
              ? dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="客户">
        <template slot-scope="{ row }">
          {{ row.companyName || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="返点比例" width="160">
        <template slot-scope="{ row }">
          <div v-if="row.selfRatio || row.signRatio">
            自营返点比例：{{ `${row.selfRatio}%` || '--' }}<br>
            签约返点比例：{{ `${row.signRatio}%` || '--' }}
          </div>
          <div v-else>
            {{ row.refundRatio || '--' }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="isNewCustomerFlag"
        label="是否新客户"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{ +row.isNewCustomerFlag ? '是' : '否' }}
        </template>
      </el-table-column>
      <el-table-column prop="fieldName">
        <template slot="header">
          行业
          <IconTip
            type="popover"
            content="客户联系人负责的行业（不一定是客户的企业所在行业）"
            icon-class="iconwenhao"
          />
        </template>
        <template slot-scope="{ row }">
          {{ row.fieldName || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="brandName" label="品牌">
        <template slot-scope="{ row }">
          {{ row.brandName || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="customerName" label="客户联系人">
        <template slot-scope="{ row }">
          {{ row.customerName || '--' }}
        </template>
      </el-table-column>
      <el-table-column prop="requirementDesc" width="120" label="需求描述">
        <template slot-scope="{ row }">
          <el-popover
            v-if="(row.requirementDesc || '').length > 20"
            width="200"
            trigger="hover"
            placement="top"
          >
            <span v-html="row.requirementDesc.replace(/[\n\r]/g,'<br>')" />
            <span slot="reference">{{
              `${(row.requirementDesc || '').substr(0, 20)}...`
            }}</span>
          </el-popover>
          <span v-else>{{ row.requirementDesc }}</span>
        </template>
      </el-table-column>

      <el-table-column
        prop="opportunityQuality"
        label="商机优质度"
        :sortable="true"
      >
        <template slot-scope="{ row }">
          {{
            (
              opportunityQualityData.find(
                (item) => +item.id === +row.opportunityQuality
              ) || {}
            ).val || '--'
          }}
        </template>
      </el-table-column>
      <!-- <el-table-column  prop="businessUserName" label="商务信息" width="100">
        <template slot-scope="{ row }">
          {{
            [row.businessUserName, row.businessTeamName].filter((item) => item).join('-') || '--'
          }}
        </template>
      </el-table-column> -->

      <el-table-column prop="recommendAccounts" label="推荐账号" width="100">
        <template slot-scope="{ row }">
          <el-popover
            v-if="(row.recommendAccounts || '').length > 20"
            width="200"
            trigger="hover"
            :content="row.recommendAccounts"
            placement="top"
          >
            <span slot="reference">{{
              `${(row.recommendAccounts || '').substr(0, 20)}...`
            }}</span>
          </el-popover>
          <span v-else>{{ row.recommendAccounts }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="coopStatus" label="合作状态">
        <template slot-scope="{ row }">
          {{ ['等待结果', '确认合作', '暂不合作'][row.coopStatus] || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="refuseCoopReason" label="不合作原因">
        <template slot-scope="{ row }">
          {{ row.refuseCoopReason || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="note" label="备注">
        <template slot-scope="{ row }">
          <el-popover
            v-if="(row.note || '').length > 20"
            width="200"
            trigger="hover"
            :content="row.note"
            placement="top"
          >
            <span slot="reference">{{
              `${(row.note || '').substr(0, 20)}...`
            }}</span>
          </el-popover>
          <span v-else>{{ row.note|emptyFill }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商单">
        <template slot-scope="{ row }">
          <template v-if="+row.coopStatus === 1">
            <el-button
              v-if="!row.quotientId && row.editAuth"
              type="text"
              @click="handleCreateBusiness(row)"
            >
              创建商单
            </el-button>
            <template v-if="row.quotientId" class="m-l-0">
              <el-button type="text" @click="handleCheckBusiness(row)">
                查看商单
              </el-button>
              <br>
              <el-button
                v-if="row.editAuth"
                type="text"
                class="m-l-0"
                @click="handleEditBusiness(row)"
              >
                编辑商单
              </el-button>
            </template>
          </template>
          <!-- <el-button
            type="text"
            @click="handleGoOrder(row)"
          >查看详情</el-button> -->
        </template>
      </el-table-column>

      <el-table-column label="工单">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.workFlag"
            class="m-l-0"
            type="text"
            @click="handleGoOrder(row, 'order')"
          >视频工单</el-button>
          <br>
          <el-button
            v-if="row.specialWorkFlag"
            class="m-l-0"
            type="text"
            @click="handleGoOrder(row, 'specialOrder')"
          >特殊工单</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="createUser" label="创建人">
        <template slot-scope="{ row }">{{ row.createUser|emptyFill }}</template>
      </el-table-column>
      <!-- <el-table-column prop="createTime" label="创建时间">
        <template slot-scope="{ row }">{{ row.createTime|emptyFill }}</template>
      </el-table-column> -->
      <el-table-column label="操作" width="160" fixed="right">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleShowOpportunity(row, 'detail')"
          >查看</el-button>

          <el-button
            v-if="row.editAuth && +row.coopStatus !== 2"
            type="text"
            @click="handleShowOpportunity(row, 'edit')"
          >编辑</el-button>

          <el-button
            v-if="row.editAuth"
            class="delete"
            type="text"
            @click="handleDelete(row)"
          >删除</el-button>

          <el-button
            v-if="row.editAuth && +row.coopStatus === 0"
            type="text"
            @click="handleShowFinal(row)"
          >确认合作</el-button>

          <el-button
            v-if="row.editAuth && +row.coopStatus === 0"
            type="text"
            @click="handleShowReason(row)"
          >暂不合作</el-button>
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

    <ReasonDialog
      :data="dialogItem"
      :type="reasonDialogType"
      :show="showReasonDialog"
      @close="showReasonDialog = false"
      @getList="handleGetList"
    />

    <FinalAccountDialog
      :data="dialogItem"
      :type="finalDialogType"
      :show="showFinalDialog"
      @close="showFinalDialog = false"
      @getList="handleGetList"
    />

    <OpportunityDialog
      v-if="showOpportunityDialog"
      :normal-form-item-map="normalFormItemMap"
      :data="dialogItem"
      :type="opportunityDialogType"
      :show="showOpportunityDialog"
      :opportunity-id="dialogItem.opportunityId"
      @close="showOpportunityDialog = false"
      @getList="handleGetList"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import {
  $getBusinessOpportunityList,
  $deleteOpportunity
} from '@/api/bussiness-manage'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'
import dayjs from 'dayjs'
import { IconTip } from 'components'
import ReasonDialog from '../components/ReasonDialog.vue'
import FinalAccountDialog from '../components/FinalAccountDialog.vue'
import OpportunityDialog from '../components/OpportunityDialog.vue'
import { $getDeskBusinessOpportunityList } from '@/api/business-desk'
export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    },
    normalFormItemMap: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ReasonDialog,
    FinalAccountDialog,
    OpportunityDialog,
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $router, $confirm } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: false,
      tableData: [],
      dialogItem: {},
      showReasonDialog: false,
      reasonDialogType: '',
      showFinalDialog: false,
      finalDialogType: '',
      showOpportunityDialog: false,
      opportunityDialogType: '',
      opportunityQualityData: [
        {
          id: 0,
          val: '低'
        },
        {
          id: 1,
          val: '中'
        },
        {
          id: 2,
          val: '高'
        }
      ]
    })

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        searchData.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskBusinessOpportunityList : $getBusinessOpportunityList
    //  console.log(searchData)
      return $api({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            // state.tableData = res.data.list
            state.tableData = res.data || []
            state.total = res.total
            // console.log(state.tableData, 'table')
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

    const handleGoOrder = (row, type) => {
      const routeUrl = $router.resolve({
        path: '/bussiness-manage/workorder',
        query: {
          id: row.quotientId,
          activeName: type,
          tabName: type === 'order' ? '视频工单' : '特殊工单'
        }
      })
      window.open(routeUrl.href, '_blank')
    }

    const handleDelete = (row) => {
      $confirm(
        '删除商机后，若已生成商单，则对应的商单和工单均会被删除，且不可恢复，确认删除？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async() => {
        try {
          const { code, message } = await $deleteOpportunity({
            opportunityId: row.opportunityId
          })
          if (+code === 1) {
            $message.success('删除成功')
            handleGetList()
          } else {
            $message.error(message || '网络错误')
          }
        } catch (e) {
          $message.error(e || '网络错误')
        }
      })
    }

    const handleGetList = () => {
      emit('getList')
    }

    const handleShowReason = (row) => {
      state.dialogItem = row
      state.showReasonDialog = true
    }

    const handleShowFinal = (row) => {
      state.dialogItem = row
      state.showFinalDialog = true
    }

    const handleShowOpportunity = (row, type) => {
      state.dialogItem = row
      state.opportunityDialogType = type
      state.showOpportunityDialog = true
    }

    const handleCreateBusiness = (row) => {
      const routeUrl = $router.resolve({
        path: '/bussiness-manage/bill-manage',
        query: {
          type: 'create',
          id: row.opportunityId
        }
      })
      window.open(routeUrl.href, '_self')
    }

    const handleCheckBusiness = (row) => {
      const routeUrl = $router.resolve({
        path: '/bussiness-manage/bill-manage',
        query: {
          type: 'detail',
          id: row.quotientId,
          oppId: row.opportunityId
        }
      })
      window.open(routeUrl.href, '_blank')
    }

    const handleEditBusiness = (row) => {
      const routeUrl = $router.resolve({
        path: '/bussiness-manage/bill-manage',
        query: {
          type: 'edit',
          id: row.quotientId,
          oppId: row.opportunityId
        }
      })
      window.open(routeUrl.href, '_blank')
    }

    return {
      ...toRefs(state),
      doSort,
      getList,
      handleGoOrder,
      handleDelete,
      handleGetList,
      handleShowReason,
      handleShowFinal,
      handleShowOpportunity,
      handleCreateBusiness,
      handleCheckBusiness,
      handleEditBusiness,
      dayjs
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

.delete {
  color: #ff0000;
}

.m-l-0 {
  margin-left: 0;
}

.popoverItem {
  width: 100px;
}
</style>

