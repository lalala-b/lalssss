<template>
  <div>
    <Wrap class="search-view">
      <Search :default-params="DEFAULT_PARAMS" @onSubmit="onSubmit" @onExport="onExport" />
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
        <el-table-column label="需求状态" width="110">
          <template slot-scope="{row}">
            {{ row.requirementStatusDesc }}
            <IconTip
              v-if="row.requirementStatusDesc==='议价失败'&&row.progressRemark"
              type="popover"
              :content="row.progressRemark"
              icon-class="iconcuowu"
            />
          </template>
        </el-table-column>
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
        <el-table-column label="投放专员" prop="commissionerRealname" />
        <el-table-column label="备注" prop="remark">
          <template slot-scope="{row}">
            <OverPopover :content="row.remark" :show-count="20" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="{row}">
            <div class="flex flex-dir-col">
              <!-- ||row.requirementStatus !== 3 && row.requirementStatus !== 6 && row.requirementStatus !== 4 -->
              <div v-if="![3,4,6].includes(+row.requirementStatus)">
                <el-link class="el-link-gutter" :underline="false" type="primary" @click="handleEdit(row)">编辑</el-link>
                <el-popconfirm
                  title="确定取消吗？"
                  @confirm="handleChangeStatus({id: row.id, requirementStatus: 6})"
                >
                  <el-link slot="reference" :underline="false" type="danger">取消</el-link>
                </el-popconfirm>
              </div>
              <template v-if="row.requirementStatusDesc === '建联中' && $permission('build_my_successful')">
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
    <DemandDiglog v-if="showDemandDig" v-model="showDemandDig" :data="editData" type="edit" @success="getList" @handleBusinessDialog="handleBusinessDialog" />
    <AccountDialog
      v-if="showAccountDialog"
      v-model="showAccountDialog"
      edit-type="edit"
      :edit-data="editData"
      :meet-user-data="meetUserData"
      :is-affirm="true"
      @updateData="getList"
    />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, defineAsyncComponent } from '@vue/composition-api'
import Search from '../_com/Search'
import { IconTip, AccountCard, OverPopover } from 'components'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'

import { useTableList, useSearch } from '../_com/hook'
export default {
  components: {
    Search,
    IconTip,
    OverPopover,
    AccountCard,
    DemandDiglog: defineAsyncComponent(() => import('../../component/DemandDiglog')),
    AccountDialog: defineAsyncComponent(() => import('../../putting-account/_component/AccountDialog.vue')),
    BusinessLinePutDialog
  },
  setup(props) {
    const DEFAULT_PARAMS = {
      findType: 1
    }
    const state = reactive({
      showDemandDig: false,
      editData: {},
      showAccountDialog: false,
      meetUserData: [],
      showBusinessLineDialog: false,
      dialogInfo: {}
    })
    const { getList, loading, handleChangeStatus, doSort, tableData, searchData, total } = useTableList(DEFAULT_PARAMS)

    const { onSubmit, onExport } = useSearch(searchData, getList, DEFAULT_PARAMS)

    const handleEdit = function(row) {
      state.showDemandDig = true
      state.editData = row
    }
    // 点击建联成功
    const handleSuccessContact = function(row) {
      state.editData = row
      state.showAccountDialog = true
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
      doSort,
      loading,
      handleEdit,
      onSubmit,
      onExport,
      searchData,
      handleChangeStatus,
      DEFAULT_PARAMS,
      getList,
      handleSuccessContact,
      handleBusinessDialog
    }
  }
}

</script>
<style lang="scss" scoped>
::v-deep{
  .iconcuowu {
    color: #ff0000 !important;
    font-size: 14px;
    cursor: pointer;
  }
  .el-link-gutter{
    margin-right: 12px !important;
  }
}
</style>
