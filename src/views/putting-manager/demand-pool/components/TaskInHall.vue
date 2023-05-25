<template>
  <div>
    <Wrap class="search-view">
      <Search source="TaskInHall" :default-params="DEFAULT_PARAMS" @onSubmit="onSubmit" @onExport="onExport" @sort-change="doSort" />
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
        <el-table-column label="需求提交时间" prop="createdTime" width="104" sortable="custom" />
        <el-table-column label="广告师" prop="advertiserRealname" width="104" />
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
            <OverPopover :content="row.remark" :show-count="40" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{row}">
            <div class="flex flex-dir-col">
              <template v-if="$permission('build_successful_in_hall')">
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
    <AccountDialog
      v-if="showAccountDialog"
      v-model="showAccountDialog"
      edit-type="edit"
      :edit-data="editData"
      :is-affirm="true"
      @updateData="getList"
    />
  </div>
</template>
<script>
import { onMounted, reactive, toRefs, defineAsyncComponent } from '@vue/composition-api'
import Search from '../_com/Search'
import AccountCard from '@/components/AccountCard'
import OverPopover from '@/components/OverPopover'
import { useSearch, useTableList } from '../_com/hook'
export default {
  components: {
    Search,
    AccountCard,
    OverPopover,
    AccountDialog: defineAsyncComponent(() => import('../../putting-account/_component/AccountDialog.vue'))

  },
  setup(props) {
    const DEFAULT_PARAMS = {
      findType: 3
    }
    const state = reactive({
      showDemandDig: false,
      editData: {},
      showAccountDialog: false
    })

    const { getList, loading, handleChangeStatus, doSort, tableData, searchData, total } = useTableList(DEFAULT_PARAMS)
    const { onSubmit, onExport } = useSearch(searchData, getList, DEFAULT_PARAMS)

    // 点击建联成功
    const handleSuccessContact = function(row) {
      state.editData = row
      state.showAccountDialog = true
    }

    onMounted(() => {
      getList()
    })

    return {
      ...toRefs(state),
      loading,
      total,
      tableData,
      doSort,
      onSubmit,
      onExport,
      handleChangeStatus,
      handleSuccessContact,
      getList,
      DEFAULT_PARAMS,
      searchData
    }
  }
}
</script>
