<template>
  <div>
    <Wrap class="search-view">
      <Search source="CooperationInHall" :default-params="DEFAULT_PARAMS" @onSubmit="onSubmit" @onExport="onExport" />
    </Wrap>
    <Wrap class="table-view">
      <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
        <el-table-column label="需求ID" width="100" prop="id" />
        <el-table-column label="账号信息" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row">
              <!-- <p v-if="row.tagValue" class="account-tag">
                <span>达人类型：</span>
                <template v-if="row.accountTag">
                  <el-tag v-for="item in row.accountTag.split(',')" :key="item" class="m-r-5" size="mini">{{ item }}</el-tag>
                </template>
                <template v-if="row.tagValue">
                  <el-tag v-for="item in row.tagValue.split(',')" :key="item" class="m-r-5" size="mini">{{ item }}</el-tag>
                </template>
              </p> -->
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column label="需求创建时间" prop="createdTime" width="170px" sortable="custom" />
        <el-table-column label="需求有效期" prop="deadlineDateNum" sortable="custom">
          <template slot-scope="{row}">
            {{ row.deadlineDateNum }}日
          </template>
        </el-table-column>
        <el-table-column label="预期投放价格">
          <template slot-scope="{row}">
            {{ row.preDeliveryAmountMin }}~{{ row.preDeliveryAmountMax }}
          </template>
        </el-table-column>
        <el-table-column label="预计发布时间" width="110">
          <template slot-scope="{row}">
            {{ row.preReleaseVideoTime|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="广告师" prop="advertiserRealname">
          <template slot-scope="{row}">
            {{ row.advertiserRealname|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="投放专员" prop="commissionerRealname" />
        <el-table-column label="议价失败原因" prop="bargainingRemark">
          <template slot-scope="{row}">
            <OverPopover :content="row.bargainingRemark" :show-count="40" />
          </template>
        </el-table-column>】
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <div class="flex flex-dir-col">
              <el-link :underline="false" type="primary" @click="handleShow(row, 'detail')">查看最近提报详情</el-link>
              <template v-if="$permission('demand_for_submission')">
                <el-tooltip
                  v-if="row.defriendFlag"
                  placement="top"
                  :content="row.accountBlockRemark"
                >
                  <el-link disabled size="small" type="info">需求提报</el-link>
                </el-tooltip>
                <el-link v-else :underline="false" type="primary" @click="handleShow(row, 'deman')">需求提报</el-link>
              </template>
              <el-link v-if="$permission('add_demand_for_other')" :underline="false" type="primary" @click="getDeliveryerStatus(row, 'deman','forOther')">需求代提</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <CooperationDetail v-if="showDetail" v-model="showDetail" :data="editData" />
    <DemandDiglog
      v-if="showDemand"
      v-model="showDemand"
      :data="editData"
      :demand-type="demandType"
      :source="1"
      @success="getList"
      @handleBusinessDialog="handleBusinessDialog"
    />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, defineAsyncComponent, getCurrentInstance } from '@vue/composition-api'
import Search from '../_com/Search'
import OverPopover from '@/components/OverPopover'
import AccountCard from '@/components/AccountCard'
import { useSearch, useTableList } from '../_com/hook'
import { $getDeliveryerStatus } from '@/api/bussiness-manage'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'

export default {
  components: {
    Search,
    AccountCard,
    CooperationDetail: defineAsyncComponent(() => import('../_com/CooperationDetail')),
    DemandDiglog: defineAsyncComponent(() => import('../../component/DemandDiglog')),
    OverPopover,
    BusinessLinePutDialog
  },
  setup(props) {
    const _this = getCurrentInstance().proxy
    const DEFAULT_PARAMS = {
      findType: 2
    }
    const state = reactive({
      showDemand: false,
      showDetail: false,
      editData: {},
      demandType: '',
      showBusinessLineDialog: false,
      dialogInfo: {},
      showSubmitTip: false
    })

    const { getList, loading, handleChangeStatus, doSort, tableData, searchData, total } = useTableList(DEFAULT_PARAMS)
    const { onSubmit, onExport } = useSearch(searchData, getList, DEFAULT_PARAMS)

    const handleShow = function(row, type, demandType) {
      // switch (type) {
      //     case 'detail':
      //       state.showDetail = true
      //       break
      //     case 'deman':
      //       state.showDemand = true
      //       break
      //     default:
      //       break
      //   }
      //   state.demandType = demandType
      //   state.editData = row
      if (row.auditReportFlag && type !== 'detail') {
        this.$confirm(`<p>当前达人仍有未完成的订单<span style="color:red">（待审核/待下单付款/待发布提交/待资金核算）</span>，禁止提报需求。</p><p>如仍需提报需求，<span style="color:red">请先线下跟军长沟通确认</span>，再继续提报</p>`, '提示', {
          customClass: 'presenting-confrim-wrap',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '线下已沟通，继续提报',
          cancelButtonText: '暂不提报'
        }).then(() => {
          switch (type) {
            case 'detail':
              state.showDetail = true
              break
            case 'deman':
              state.showDemand = true
              break
            default:
              break
          }
          state.demandType = demandType
          state.editData = row
        }).catch(() => {
          return
        })
        state.showSubmitTip = true
      } else {
        switch (type) {
          case 'detail':
            state.showDetail = true
            break
          case 'deman':
            state.showDemand = true
            break
          default:
            break
        }
        state.demandType = demandType
        state.editData = row
        state.showSubmitTip = false
      }
    }
    const getDeliveryerStatus = (row, source, type) => {
      $getDeliveryerStatus().then(res => {
        if (res.code === 1) {
          handleShow(row, source, type)
        } else {
          _this.$message.error(res.message)
        }
      }).catch(err => {
       console.log(err)
      })
    }
    const handleBusinessDialog = (val) => {
      state.dialogInfo = val
      state.showBusinessLineDialog = true
    }
    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      total,
      loading,
      onSubmit,
      onExport,
      handleChangeStatus,
      handleShow,
      doSort,
      tableData,
      searchData,
      getList,
      DEFAULT_PARAMS,
      getDeliveryerStatus,
      handleBusinessDialog
    }
  }
}
</script>

<style lang="scss">
.el-message-box.presenting-confrim-wrap {
    padding:14px 10px;
    width: 440px;
    height:200px;
    .el-message-box__btns {
      display: flex;
      justify-content: center;
      align-items: center;

      button{
        transform: scale(0.85);
        display:flex;
        justify-content: center;
        align-items: center;
        width:160px;
        height:40px;
        border-radius: 8px;
      }
    }
  }
</style>

