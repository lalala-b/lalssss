<template>
  <div>
    <Wrap class="search-view">
      <Search
        :config="formConf"
        @submit="onSubmit"
      />
    </Wrap>
    <Wrap class="table-view">
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <!-- <el-table-column label="组织">
          <template slot-scope="{ row }">
            <div>{{ row.dname }}-{{ row.fname }}</div>
          </template>
        </el-table-column> -->

        <el-table-column prop="deliveryName" label="投放专员" />
        <el-table-column label="承接平台">
          <template v-if="row.platInfo" slot-scope="{row}">
            <el-tooltip v-for="item in row.platInfo" :key="item.platId" effect="dark" :content="item.platName" placement="top">
              <img class="plat-img" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${item.platId}.png`" alt="">
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="对接广告师">
          <template v-if="row.advertiserInfo" slot-scope="{row}">
            {{ row.advertiserInfo.map(item => item.advertiserUserName).join('、') }}
            <!-- {{ row.deliveryName }} -->
          </template>
        </el-table-column>
        <el-table-column label="投放专员状态">
          <template slot-scope="{row}">
            {{ row.deliveryName ? LEAVE_STATUS[row.leaveStatus] : '' }}
          </template>
          <template slot="header">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="300"
              content="投放专员状态系统默认为正常接单，若存在休假、会议等原因导致无法响应需求，可调整投放专员状态为暂停接单，系统将新的需求随机分配给其他投放专员以保障投放流程正常运行。"
            >
              <div slot="reference">
                投放专员状态
                <i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <div>
              <el-button v-if="$permission('putting_appoint_edit')" type="primary" size="small" @click="handleShowDialog(row, 'appoint')">指派</el-button>
              <el-button v-if="row.editLeaveStatusFlag === 1" type="primary" size="small" @click="handleShowDialog(row, 'status')">状态修改</el-button>
              <!-- <el-button v-if="" type="primary" size="mini" @click="handleChangeLeaveStatus(row)">{{ row.leaveStatus === 1 ? '销假': '请假' }}</el-button> -->
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
    <StatusDialog
      v-if="showStatusDiaLog"
      v-model="showStatusDiaLog"
      :edit-data="editData"
      @success="getList"
    />
    <AppointDialog
      v-if="showAppointDialog"
      v-model="showAppointDialog"
      :edit-data="editData"
      @success="getList"
    />
  </div>
</template>
<script>
import Search from '@/components/Search'
import { reactive, toRefs, getCurrentInstance, onMounted, defineAsyncComponent } from '@vue/composition-api'
import { $getCommissionerList, $getDeliveryList } from '@/api/putting-manager'
import { useConstMap } from './_com/hook'
export default {
  components: {
    Search,
    StatusDialog: defineAsyncComponent(() => import('./_com/StatusDialog.vue')),
    AppointDialog: defineAsyncComponent(() => import('./_com/AppointDialog.vue'))
  },
  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const state = reactive({
      formConf: {
        normal: [],
        hasExport: false
      },
      searchData: {
        orgId: '',
        deliveryName: '',
        pageNum: 1
      },
      tableData: [],
      loading: true,
      leaveLoading: false,
      total: 0,
      showStatusDiaLog: false,
      showAppointDialog: false,
      editData: {}
    })

    const { LEAVE_STATUS } = useConstMap()

    const onSubmit = function(data) {
      Object.assign(state.searchData, data)
      getList()
    }

    const getList = function() {
      state.loading = true
      $getCommissionerList({
        ...state.searchData
      }).then(res => {
        if (res.code === 1) {
          state.tableData = res.data
          state.total = res.total
        } else {
          $message.error(res.message)
        }
        state.loading = false
      }).catch(err => {
        if (err.__CANCEL__) return
        $message.error(err.message)
        state.loading = false
      })
    }

    const getCondition = function() {
      $getDeliveryList().then(res => {
        if (res.code === 1) {
          normalFormItemMap.deliveryId.data = res.data
        }
      })
    }

    const normalFormItemMap = {}
    const buildFormConf = function() {
      const normal = [{
        type: 'select',
        key: 'deliveryId',
        data: [],
        conf: {
          placeholder: '请选择投放专员',
          clearable: true,
          filterable: true
        },
        optionLabelKey: 'deliveryName',
        optionValKey: 'deliveryId'
      }]
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      state.formConf.normal = normal
    }
    const handleShowDialog = function(row, type) {
      state.editData = row
      if (type === 'status') {
        state.showStatusDiaLog = true
      }
      if (type === 'appoint') {
        state.showAppointDialog = true
      }
    }

    onMounted(() => {
      getList()
      buildFormConf()
      getCondition()
    })

    return {
      ...toRefs(state),
      LEAVE_STATUS,
      onSubmit,
      getList,
      handleShowDialog
    }
  }
}
</script>
<style lang="scss" scoped>
.plat-img {
  display: inline-flex;
  width: 18px;
  height: 18px;
  margin-left: 2px;
  margin-right: 2px;
  vertical-align: middle;
}
</style>
