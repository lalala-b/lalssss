<template>
  <div>
    <Wrap class="search-view">
      <Search :default-params="DEFAULT_PARAMS" source="MyWaitDemand" @onSubmit="onSubmit" @onExport="onExport" />
    </Wrap>

    <Wrap class="table-view">
      <div class="flex flex-justify-end m-b-24">
        <el-button v-if="$permission('all_wait_demand_move')" type="primary" @click="handleShowAllWaitDemandDialog">待处理需求批量移交</el-button>
      </div>
      <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
        <el-table-column label="账号信息" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row">
              <!-- <p v-if="row.tagValue" class="account-tag">
                <span>达人类型：</span>
                <template v-if="row.accountTag">
                  <el-tag v-for="item in row.accountTag.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
                </template>
                <template v-if="row.tagValue">
                  <el-tag v-for="item in row.tagValue.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
                </template>
              </p> -->
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column label="需求创建时间" prop="createdTime" width="170px" sortable="custom" />
        <el-table-column label="广告师" prop="advertiserRealname" />
        <el-table-column label="投放专员" prop="commissionerRealname" />
        <el-table-column label="需求状态" prop="requirementStatusDesc" />
        <el-table-column label="需求进度" prop="requirementProgress">
          <template slot-scope="{row}">
            {{ row.requirementProgress|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="需求有效期" prop="deadlineDateNum" sortable="custom">
          <template slot-scope="{row}">
            {{ row.deadlineDateNum }}日
          </template>
        </el-table-column>
        <el-table-column label="计费方式" prop="chargeTypeDesc" />
        <el-table-column label="合作单量" prop="coopOrderMaxNum" sortable="custom" />
        <el-table-column label="预期投放价格" width="120">
          <template slot-scope="{row}">
            {{ row.preDeliveryAmountMin }}~{{ row.preDeliveryAmountMax }}
          </template>
        </el-table-column>
        <el-table-column label="预计发布时间" width="200">
          <template slot-scope="{row}">
            {{ row.preReleaseVideoTime|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="品牌标签" prop="brandTagStr" />
        <el-table-column label="业务标签" prop="businessTag" />
        <el-table-column label="备注" prop="remark">
          <template slot-scope="{row}">
            <OverPopover :content="row.remark" :show-count="40" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="120">
          <template slot-scope="{row}">
            <div class="flex flex-dir-col">
              <el-link
                v-if="row.transferFlag"
                :underline="false"
                type="primary"
                @click="handleShowSingleDialog(row)"
              >
                需求移交
              </el-link>
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

    <AllWaitDemandDialog :show="showAllWaitDemandDialog" :wait-list="handUserList" :list="receiveUserList" @onClose="showAllWaitDemandDialog = false" @getList="getList" />

    <SingleDemandDialog :show="showSingleDemandDialog" :data="singleData" :list="fundList" @onClose="showSingleDemandDialog = false" @getList="getList" />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import Search from '../_com/Search'
import AccountCard from '@/components/AccountCard'
import { useSearch, useTableList } from '../_com/allWaitHook'
import AllWaitDemandDialog from './AllWaitDemandDialog.vue'
import SingleDemandDialog from './SingleDemandDialog.vue'
import { $getAllCommissionerList, $getFundUser, $getFundUsers } from '@/api/putting-manager'
import OverPopover from '@/components/OverPopover'

export default {
  components: {
    Search,
    AccountCard,
    AllWaitDemandDialog,
    SingleDemandDialog,
    OverPopover
  },
  setup(props) {
    const { $message } = getCurrentInstance().proxy

    const DEFAULT_PARAMS = {
      findType: 5
    }

    const state = reactive({
      showDemandProgress: false,
      showDemandDig: false,
      showAccountDialog: false,
      showFailsDialog: false,
      showPlaceOrder: false,
      orderItem: {},
      editData: {},
      meetUserData: [],
      showBuildDig: false,
      showAllWaitDemandDialog: false,
      showSingleDemandDialog: false,
      handUserList: [],
      receiveUserList: [],
      singleData: {},
      fundList: []
    })

    const getUserList = async() => {
        const handData = await $getAllCommissionerList({ isTakeOver: 0 })
        if (+handData.code === 1) {
          state.receiveUserList = handData.data
        }

        const receiveData = await $getFundUser()
        if (+receiveData.code === 1) {
          state.handUserList = receiveData.data
        }
    }
    const getFundUsers = async() => {
      const res = await $getFundUsers()
      if (+res.code === 1) {
        state.fundList = res.data
      }
    }
    const handleShowSingleDialog = (item) => {
      getUserList()
      state.singleData = item
      state.showSingleDemandDialog = true
    }

    const handleShowAllWaitDemandDialog = (item) => {
      getUserList()
      state.showAllWaitDemandDialog = true
    }

    const { getList, loading, handleChangeStatus, doSort, tableData, searchData, total } = useTableList(DEFAULT_PARAMS)

    const { onSubmit, onExport } = useSearch(searchData, getList, DEFAULT_PARAMS)

    onMounted(() => {
      getList()
      getUserList()
      getFundUsers()
    })

    return {
      ...toRefs(state),
      tableData,
      total,
      loading,
      onSubmit,
      onExport,
      handleChangeStatus,
      // handleSuccessContact,
      // handleFailContact,
      // handleShowFailDialog,
      // handleEditProgress,
      // handleCreateOrder,
      doSort,
      searchData,
      DEFAULT_PARAMS,
      getList,
      handleShowSingleDialog,
      handleShowAllWaitDemandDialog
    }
  }
}
</script>
