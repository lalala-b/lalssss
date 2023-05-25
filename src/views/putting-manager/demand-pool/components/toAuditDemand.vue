<template>
  <div>
    <Wrap class="search-view">
      <Search
        :default-params="DEFAULT_PARAMS"
        :source="'toAudit'"
        @onSubmit="onSubmit"
        @onExport="onExport"
      />
    </Wrap>
    <Wrap class="table-view">
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="需求ID" width="100" prop="id" />
        <el-table-column label="账号信息" width="220" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          prop="requirementExamineStatus"
          width="170px"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ getRequirementExamineStatus(row.requirementExamineStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          label="需求创建时间"
          prop="createdTime"
          width="170px"
          sortable="custom"
        />
        <el-table-column label="需求状态" width="110">
          <template slot-scope="{ row }">
            {{ row.requirementStatusDesc }}
            <IconTip
              v-if="
                row.requirementStatusDesc === '议价失败' && row.progressRemark
              "
              type="popover"
              :content="row.progressRemark"
              icon-class="iconcuowu"
            />
          </template>
        </el-table-column>
        <el-table-column label="需求进度" prop="requirementProgress">
          <template slot-scope="{ row }">
            {{ row.requirementProgress | emptyFill }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="需求是否通过" width="130">
          <template slot-scope="{row}">
            {{ getPassList(row.requirementExamineStatus) |emptyFill }}
          </template>
        </el-table-column> -->
        <el-table-column
          label="需求有效期"
          prop="deadlineDateNum"
          sortable="custom"
          width="120"
        >
          <template slot-scope="{ row }">
            {{ row.deadlineDateNum }}日
          </template>
        </el-table-column>
        <el-table-column label="计费方式" prop="chargeTypeDesc" />
        <el-table-column
          label="合作单量"
          prop="coopOrderMaxNum"
          sortable="custom"
          width="110"
        />
        <el-table-column label="预期投放价格">
          <template slot-scope="{ row }">
            {{ row.preDeliveryAmountMin }}~{{ row.preDeliveryAmountMax }}
          </template>
        </el-table-column>
        <el-table-column label="预计发布时间" width="110">
          <template slot-scope="{ row }">
            {{ row.preReleaseVideoTime | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="品牌标签" prop="brandTagStr" />
        <el-table-column label="业务标签" prop="businessTag" />
        <el-table-column label="投放专员" prop="commissionerRealname" />
        <!-- <el-table-column label="备注" prop="remark">
          <template slot-scope="{row}">
            <OverPopover :content="row.remark" :show-count="20" />
          </template>
        </el-table-column> -->
        <el-table-column label="审核备注" prop="requirementExamineRemark">
          <template slot-scope="{ row }">
            <OverPopover
              :content="row.requirementExamineRemark"
              :show-count="20"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-if="$permission('demand-audit') || $permission('demand-ztaudit')"
          label="操作"
          width="120"
          fixed="right"
        >
          <template slot-scope="{ row }">
            <div class="flex flex-dir-col">
              <el-link
                v-if="
                  ([0, 4].includes(row.requirementExamineStatus) &&
                    $permission('demand-audit')) ||
                    ([5].includes(row.requirementExamineStatus) &&
                      $permission('demand-ztaudit'))
                "
                :underline="false"
                type="primary"
                @click="handleAudit(row)"
              >审核</el-link>
              <!-- <el-link v-if="+row.requirementExamineStatus===4" :underline="false" type="primary" @click="handleEdit(row)">编辑</el-link> -->
              <el-link
                v-if="row.requirementExamineStatus===0&&$permission('demand-audit')"
                :underline="false"
                type="primary"
                @click="handleSave(row)"
              >待线下沟通</el-link>
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
    <AuditDemandDialog
      v-if="showAuditDemandDig"
      v-model="showAuditDemandDig"
      :data="editData"
      :audit-status="auditStatus"
      type="edit"
      from="toAuditDemand"
      @success="getCountAndList"
      @handleCrowedDialog="handleCrowedDialog"
    />
    <AccountDialog
      v-if="showAccountDialog"
      v-model="showAccountDialog"
      edit-type="edit"
      :edit-data="editData"
      :meet-user-data="meetUserData"
      :is-affirm="true"
      @updateData="getList"
    />
    <BusinessLinePutDialog
      v-if="showBusinessLineDialog"
      v-model="showBusinessLineDialog"
      :account-id="dialogInfo.accountId"
      :business-line="dialogInfo.businessLine"
      :business-line-date="dialogInfo.businessLineDate"
    />
    <CrowedDataDialog
      v-if="showCrowedDialog"
      v-model="showCrowedDialog"
      :data="crowedData"
    />
  </div>
</template>
<script>
import {
  onMounted,
  reactive,
  toRefs,
  defineAsyncComponent,
  getCurrentInstance
} from '@vue/composition-api'
import Search from '../_com/Search'
import { IconTip, AccountCard, OverPopover } from 'components'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'
import { useTableList, useSearch } from '../_com/hook'
import CrowedDataDialog from '@/views/putting-manager/component/CrowedDataDialog.vue'
import {
  $auditRequirement
} from '@/api/putting-manager'
export default {
  components: {
    Search,
    IconTip,
    OverPopover,
    AccountCard,
    AuditDemandDialog: defineAsyncComponent(() =>
      import('../../component/AuditDemandDialog.vue')
    ),
    AccountDialog: defineAsyncComponent(() =>
      import('../../putting-account/_component/AccountDialog.vue')
    ),
    BusinessLinePutDialog,
    CrowedDataDialog
  },
  setup(props, ctx) {
    const { $message } = getCurrentInstance().proxy
    const DEFAULT_PARAMS = {
      findType: 6
    }
    const state = reactive({
      editData: {},
      showAccountDialog: false,
      meetUserData: [],
      showBusinessLineDialog: false,
      dialogInfo: {},
      showAuditDemandDig: false,
      // isAudit: false,
      showCrowedDialog: false,
      crowedData: {},
      auditStatus: 0
    })
    // const getPassList = (status) => {
    //   const item =
    //  ([{ id: 0, label: '待审核' },
    //   { id: 1, label: '默认值' },
    //   { id: 2, label: '是' },
    //   { id: 3, label: '否' },
    //   { id: 4, label: '待定' }].find(item => +item.id === +status) || {}).label
    //   return item
    // }
    const {
      getList,
      loading,
      handleChangeStatus,
      doSort,
      tableData,
      searchData,
      total
    } = useTableList(DEFAULT_PARAMS)

    const { onSubmit, onExport } = useSearch(
      searchData,
      getList,
      DEFAULT_PARAMS
    )
    const handleBusinessDialog = (val) => {
      state.dialogInfo = val
      state.showBusinessLineDialog = true
    }
    const handleAudit = (row) => {
      state.showAuditDemandDig = true
      state.editData = row
      // state.isAudit = false
      state.auditStatus = row.requirementExamineStatus
    }
    const getCountAndList = () => {
      ctx.emit('getCount')
      getList()
    }
    // const handleEdit = (row) => {
    //   // state.isAudit = true
    //   state.showAuditDemandDig = true
    //   state.editData = row
    // }
    const handleCrowedDialog = (crowedData) => {
      state.showCrowedDialog = true
      state.crowedData = crowedData
    }

    const getRequirementExamineStatus = (val) => {
      switch (val) {
        case 0:
          return '待审核人群画像'
        case 1:
          return '默认值'
        case 2:
          return '是'
        case 3:
          return '否'
        case 4:
          return '待线下沟通'
        case 5:
          return '待审核资金未核算达人'
        default:
          return '--'
      }
    }
    const handleSave = async function(row) {
      try {
        const params = {
          requirementId: row.id,
          requirementExamineStatus: 4
        }
        const res = await $auditRequirement(params)
        if (res.code === 1) {
          getList()
          $message.success('操作成功')
        } else {
          $message.error(res.message)
        }
      } catch (err) {
        if (!err) return
        if (err.__CANCEL__) return
        $message.error(err.message)
      }
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
      onSubmit,
      onExport,
      searchData,
      handleChangeStatus,
      handleBusinessDialog,
      DEFAULT_PARAMS,
      getList,
      handleAudit,
      getRequirementExamineStatus,
      // getPassList,
      getCountAndList,
      // handleEdit,
      handleCrowedDialog,
      handleSave
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .iconcuowu {
    color: #ff0000 !important;
    font-size: 14px;
    cursor: pointer;
  }
  .el-link-gutter {
    margin-right: 12px !important;
  }
}
</style>
