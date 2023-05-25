<template>
  <Wrap>
    <Search @onSubmit="onSubmit" />
    <Statistics :dark="true" :data="summaryItems" :loading="loading" />
    <el-table
      v-loading="loading"
      v-scrollbar
      :data="tableData"
      header-row-class-name="table-header"
      class="m-t-16"
      @sort-change="doSort"
    >
      <el-table-column label="工单状态">
        <template slot-scope="scope">{{ scope.row.isOver === 1 ? '已完成' : '未完成' }}</template>
      </el-table-column>
      <el-table-column prop="quotientId" sortable="custom" label="商单号" width="200" />
      <el-table-column prop="quotientType" label="商单类型" width="120">
        <template slot-scope="{ row }">
          {{ row.quotientType === 1 ? '客户自行下单' : '代客下单' }}
        </template>
      </el-table-column>
      <el-table-column prop="productTime" sortable="custom" label="商单成单日期" width="180" />
      <el-table-column prop="accountBelong" label="账号归属" />
      <el-table-column prop="platName" label="平台" />
      <el-table-column prop="accountName" label="账号">
        <template slot-scope="{row}">
          <a :href="row.accountLoginUrl" target="_blank">
            {{ row.accountName }}
          </a>
        </template>
      </el-table-column>
      <el-table-column prop="brandName" label="品牌" />
      <el-table-column prop="quotientName" label="合作产品" />
      <el-table-column prop="crmGroupName" label="商务小组" width="90" />
      <el-table-column prop="crmName" label="商务" />
      <el-table-column prop="executeName" label="执行人" />
      <el-table-column label="已定排期" prop="finishTimeConfirm" width="160" />
      <el-table-column label="视频" width="300">
        <template slot-scope="scope">
          <el-link
            v-for="(item, index) in scope.row.videos"
            :key="index"
            class="video-link"
            type="primary"
            target="_blank"
            :href="item.url"
          >{{ item.titleName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="executeMoney" label="执行金额" sortable="custom" width="130">
        <template slot="header">
          <IconTip
            content="执行金额=销售收入-销售成本"
            label="执行金额"
            icon-class="iconwenhao"
          />
        </template>
      </el-table-column>
      <el-table-column prop="performanceMoney" label="绩效营收" width="110">
        <template slot="header">
          <IconTip
            content="绩效营收=执行金额-达人分成成本"
            label="绩效营收"
            icon-class="iconwenhao"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" fixed="right">
        <template slot-scope="scope">
          <div class="flex flex-justify-center">
            <IconTip
              v-log="{ quotientId: scope.row.quotientId }"
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(scope.row, 'detail')"
            />
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
    <EditDialog
      v-if="showDialog"
      v-model="showDialog"
      :work-id="workId"
      :dia-log-type="diaLogType"
    />
  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { Statistics, IconTip } from 'components'
import EditDialog from '@/views/bussiness-manage/workorder/_pages/order/EditDialog.vue'
import Search from './search.vue'
import { useOrder } from '../hooks'

const useDialog = () => {
  const showDialog = ref(false)
  const workId = ref(null)
  const diaLogType = ref(null)
  const handleShow = (row, type = 'detail') => {
    console.log(row)
    workId.value = row.workId
    showDialog.value = true
    diaLogType.value = type
}
  return {
    showDialog,
    workId,
    diaLogType,
    handleShow
  }
}

export default defineComponent({
  components: { Statistics, IconTip, Search, EditDialog },
  setup() {
    const { $route } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const {
      loading,
      summaryItems,
      tableData,
      total,
      getList,
      onSubmit,
      setSearchData,
      searchData,
      doSort
    } = useOrder()
    setSearchData({ accountId })
    getList()

    const {
      showDialog,
      workId,
      diaLogType,
      handleShow
    } = useDialog()
    return {
      doSort,
      loading,
      summaryItems,
      tableData,
      onSubmit,
      showDialog,
      workId,
      diaLogType,
      handleShow,
      total,
      getList,
      searchData
    }
  }
})
</script>
