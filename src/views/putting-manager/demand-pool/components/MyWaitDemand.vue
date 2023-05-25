<template>
  <div>
    <Wrap class="search-view">
      <Search :default-params="DEFAULT_PARAMS" source="MyWaitDemand" @onSubmit="onSubmit" @onExport="onExport" />
    </Wrap>
    <Wrap class="table-view">
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
        <el-table-column label="品牌标签" prop="brandTagStr" />
        <el-table-column label="业务标签" prop="businessTag" />
        <el-table-column label="备注" prop="remark">
          <template slot-scope="{row}">
            <OverPopover :content="row.remark" :show-count="20" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="{row}">
            <div class="flex flex-dir-col">
              <el-link v-if="[1,2,4].includes(row.requirementStatus)" :underline="false" type="primary" @click="handleEditProgress(row)">编辑进度</el-link>
              <template v-if="row.requirementStatus === 2 && $permission('negotiation_success')">
                <template v-if="row.defriendFlag">
                  <el-tooltip
                    placement="top"
                    :content="row.accountBlockRemark"
                  >
                    <el-link disabled size="small" type="info">议价成功,下单</el-link>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-tooltip
                    v-if="!row.placeOrderFlag"
                    placement="top"
                    content="请联系账号对接人先补充联系方式后再下单！"
                  >
                    <el-link disabled size="small" type="info">议价成功,下单</el-link>
                  </el-tooltip>
                  <el-link v-else :underline="false" type="primary" @click="handleCreateOrder(row)">议价成功,下单</el-link>
                </template>
              </template>
              <!-- <el-link v-if="row.requirementStatus === 2 && $permission('negotiation_fails')" :underline="false" type="primary" @click="handleShowFailDialog(row)">议价失败</el-link> -->
              <template v-if="row.requirementStatus === 1 && $permission('build_successful')">
                <el-tooltip
                  v-if="row.defriendFlag"
                  placement="top"
                  :content="row.accountBlockRemark"
                >
                  <el-link
                    v-log
                    disabled
                    type="primary"
                  >建联成功</el-link>
                </el-tooltip>
                <el-link v-else :underline="false" type="primary" @click="handleSuccessContact(row)">建联成功</el-link>
              </template>
              <el-link v-if="row.requirementStatus === 1 && $permission('build_fail')" :underline="false" type="primary" @click="handleFailContact(row)">建联失败</el-link>
              <!-- <el-popconfirm
                v-if="row.requirementStatus === 1 && $permission('build_fail')"
                title="确定建联失败吗？"
                @confirm="handleChangeStatus({id: row.id, requirementStatus: 5})"
              >
                <el-link slot="reference" :underline="false" type="primary">建联失败</el-link>
              </el-popconfirm> -->
              <!-- <el-popconfirm
                v-if="row.requirementStatus !== 3 || row.requirementStatus !== 6"
                title="确定取消吗？"
                @confirm="handleChangeStatus({id: row.id, requirementStatus: 6})"
              >
                <el-link slot="reference" type="danger">取消</el-link>
              </el-popconfirm> -->
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
    <AccountDialog
      v-if="showAccountDialog"
      v-model="showAccountDialog"
      edit-type="edit"
      :edit-data="editData"
      :meet-user-data="meetUserData"
      :is-affirm="true"
      @updateData="getList"
    />
    <NegotiationFails v-if="showFailsDialog" :id="editData.id" v-model="showFailsDialog" @success="getList" />
    <PlaceOrder v-if="showPlaceOrder" v-model="showPlaceOrder" :form-data="orderItem" palce-source="putting" @success="getList" @handleBusinessDialog="handleBusinessDialog" />
    <DemandProgress v-if="showDemandProgress" v-model="showDemandProgress" :data="editData" @success="getList" />
    <BuildFails v-if="showBuildDig" :id="editData.id" v-model="showBuildDig" :default-params="DEFAULT_PARAMS" @success="getList" />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, defineAsyncComponent } from '@vue/composition-api'
import Search from '../_com/Search'
import { OverPopover, AccountCard } from 'components'
import { useSearch, useTableList } from '../_com/hook'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'

export default {
  components: {
    Search,
    AccountCard,
    AccountDialog: defineAsyncComponent(() => import('../../putting-account/_component/AccountDialog.vue')),
    NegotiationFails: defineAsyncComponent(() => import('../_com/NegotiationFails.vue')),
    PlaceOrder: defineAsyncComponent(() => import('../../putting-account/_component/PlaceOrder')),
    DemandProgress: defineAsyncComponent(() => import('../_com/DemandProgress.vue')),
    BuildFails: defineAsyncComponent(() => import('../_com/BuildFails.vue')),
    BusinessLinePutDialog,
    OverPopover
  },
  setup(props) {
    const DEFAULT_PARAMS = {
      findType: 4
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
      showBusinessLineDialog: false,
      dialogInfo: {}
    })

    const { getList, loading, handleChangeStatus, doSort, tableData, searchData, total } = useTableList(DEFAULT_PARAMS)

    const { onSubmit, onExport } = useSearch(searchData, getList, DEFAULT_PARAMS)

    // 点击建联成功
    const handleSuccessContact = function(row) {
      state.editData = row
      state.showAccountDialog = true
    }

    // 点击建联成功
    const handleFailContact = function(row) {
      state.editData = row
      state.showBuildDig = true
    }

    // 点击议价失败
    const handleShowFailDialog = function(row) {
      state.showFailsDialog = true
      state.editData = row
    }

    // 下单
    const handleCreateOrder = function(row) {
      state.orderItem = {
        platId: row.platId,
        platName: row.platName,
        accountId: row.accountId,
        accountName: row.accountName,
        accountImg: row.accountImg,
        requirementId: row.id,
        advertiserUserId: row.advertiserUserId,
        businessTag: row.businessTag
      }
      state.showPlaceOrder = true
    }

    // 编辑进度
    const handleEditProgress = function(row) {
      state.showDemandProgress = true
      state.editData = row
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
      tableData,
      total,
      loading,
      onSubmit,
      onExport,
      handleChangeStatus,
      handleSuccessContact,
      handleFailContact,
      handleShowFailDialog,
      handleEditProgress,
      handleCreateOrder,
      doSort,
      searchData,
      DEFAULT_PARAMS,
      getList,
      handleBusinessDialog
    }
  }
}
</script>
<style lang="scss" scoped>
 .copy-blue{
    color: #2c64ff;
    cursor: pointer;
 }
 .copy-grey{
    color: #8C8C8C;
    cursor: pointer;
  }
</style>
