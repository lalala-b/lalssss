<template>
  <div>
    <Wrap class="m-t-16 table-view">
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        :row-key="getRowKey"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >

        <el-table-column
          prop="workId"
          sortable="custom"
          label="工单号"
          width="90"
        />
        <el-table-column prop="msg" label="提醒内容" width="110">
          <template slot-scope="{ row }">
            <div v-if="row.msg">
              <el-popover
                width="200"
                trigger="hover"
                :content="row.msg"
                placement="top"
              >
                <span slot="reference" class="text-over-hidden-3">{{ row.msg }}</span>
              </el-popover>
            </div>
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column prop="remindUsers" label="提醒对象" width="110">
          <template slot-scope="{ row }">
            {{ row.remindUsers || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="工单状态" width="80">
          <template slot-scope="scope">{{
            WORK_ARR[scope.row.workerStatus]
          }}</template>
        </el-table-column>
        <!-- <el-table-column
          label="工单绩效月"
          prop="monthMoneyNew"
          sortable="custom"
          width="120px"
        >
          <template slot-scope="scope">{{
            scope.row.monthMoneyNew | emptyFill
          }}</template>
        </el-table-column> -->
        <el-table-column label="账号信息" width="180" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="accountBelong" label="订单归属" width="130" />
        <el-table-column prop="fieldName" label="行业">
          <template slot-scope="{ row }">
            {{ row.fieldName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="合作产品-品牌" width="130" align="left">
          <template slot-scope="{ row }">
            <div>{{ row.quotientName }}-{{ row.brandName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商务信息" width="120" align="left">
          <template slot-scope="{ row }">
            <div>
              {{ [row.crmName, row.crmTeamName, row.crmGroupName].filter(item => item).join('-') || '--' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="录单耗时" prop="recordsTime" sortable>
          <template slot-scope="{ row }">
            <div>{{ row.recordsTime || '--' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="executeName" label="执行人" />
        <el-table-column label="商单类型" align="left">
          <template slot-scope="{ row }">
            <div>
              {{
                quotientTypeList[row.quotientType]
                  ? quotientTypeList[row.quotientType].configName
                  : ''
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="款项状态">
          <template slot-scope="{ row }">
            {{ row.paymentStatusName || '--' }}
          </template>
        </el-table-column>

        <el-table-column prop="quotientId" sortable="custom" label="商单号" width="200" />
        <el-table-column prop="productTime" sortable="custom" label="商单成单日期" width="170" />
        <!-- <el-table-column label="已定排期" prop="finishTimeConfirm" width="160" /> -->
        <el-table-column label="视频" width="105" align="left">
          <template slot-scope="{ row }">
            <VideoList
              :list-data="row.videos"
              :options="{
                coverImg: 'videoCoverUrl',
                title: 'titleName',
              }"
              :show-video-count="1"
              :show-video-img="false"
            >
              <div
                v-if="row.videos && row.videos.length > 1"
                slot="more"
                class="more-video"
                @click="handleShow(row, 'detail')"
              >
                更多
              </div>
            </VideoList>
          </template>
        </el-table-column>
        <el-table-column
          prop="executeMoney"
          label="执行金额"
          sortable="custom"
          width="126"
        >
          <template slot="header">
            <IconTip
              content="执行金额=销售收入-销售成本"
              label="执行金额"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <span :class="{ 'tip-red': row.executeMoney < 0 }">
              {{ row.executeMoney }}
            </span>
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
          <template slot-scope="{ row }">
            <span :class="{ 'tip-red': row.performanceMoney < 0 }">
              {{ row.performanceMoney }}
            </span>
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
              <!-- 有权限且为非撤单状态才可编辑 -->
              <IconTip
                v-if="scope.row.editAuth && +scope.row.workerStatus !== 4"
                v-log="{ quotientId: scope.row.quotientId }"
                content="编辑"
                icon-class="iconbianji"
                @click="handleShow(scope.row, 'edit')"
              />
            </div>
            <div v-if="$permission('exception_order_button')">
              <el-button type="text" @click="handleManage(scope.row)">已处理</el-button>
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

    <EditDialog
      v-if="showDialog"
      v-model="showDialog"
      :work-id="workId"
      :dia-log-type="diaLogType"
      :account-type="accountType"
      @success="getList"
    />

    <NewEditDialog
      v-if="showNewDialog"
      v-model="showNewDialog"
      :work-id="workId"
      :dia-log-type="diaLogType"
      @success="getList"
    />
  </div>
</template>
<script>
import {
  $getExceptionWorkerOrderList,
  $dealExceptionWorkerOrder
} from '@/api/bussiness-manage'
import { $getByConfigCode } from '@/api'
import tableMixin from '@/mixins/table'
import { IconTip, AccountCard, VideoList } from 'components'
import EditDialog from '../order/EditDialog'
import NewEditDialog from '../order/NewEditDialog'
export default {
  components: {
    IconTip,
    AccountCard,
    VideoList,
    EditDialog,
    NewEditDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      searchData: {
        orgId: '',
        overDateArr: '',
        accountId: '',
        brandId: '',
        production: '',
        quotientId: '',
        executeGroupId: '',
        executeId: '',
        isOver: '',
        platId: '',
        executeMoneyStart: '',
        executeMoneyEnd: '',
        determined: '',
        belongName: '',
        accountName: '',
        pageNum: 1,
        shield: 0,
        filedIds: []
      },
      quotientTypeList: {},
      WORK_ARR: ['商务信息待录入', '待履约', '已履约', '已核账', '撤单'],
      workStatusList: [
        {
          text: '商务信息待录入',
          val: 0
        },
        {
          text: '待履约',
          val: 1
        },
        {
          text: '已履约',
          val: 2
        },
        {
          text: '已核账',
          val: 3
        },
        {
          text: '撤单',
          val: 4
        }
      ],
      showDialog: false,
      showNewDialog: false,
      diaLogType: 'detail',
      workId: null,
      accountType: 0
    }
  },
  async created() {
    this.getByConfigByCode()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = {...this.searchData}
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        params.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = $getExceptionWorkerOrderList
      $api(params)
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
          } else {
            this.$message.error(res.message)
          }
          this.loading = false
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          if (err.message) {
            this.$message.error(err.message)
          }
          this.loading = false
        })
    },
    getRowKey(row) {
      return row.workId
    },
    // 获取商单类型、合作类型
    getByConfigByCode() {
      const configCodes = ['business_manager_quotient_type']
      $getByConfigCode({ configCodes: configCodes.join(',') })
        .then((res) => {
          if (res.code === 1) {
            this.quotientTypeList =
              res.data.business_manager_quotient_type.reduce((t, n) => {
                console.log(t)
                t[n.extValue] = n
                return t
              }, {})
          } else {
            // this.$message.error()
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    },
    // 查看显示
    handleShow(rowData, diaLogType = 'detail') {
      const { workId, versionNum, accountTypeForJump } = rowData
      this.workId = workId
      if (+versionNum) {
        if (+accountTypeForJump === 2) {
          this.showDialog = true
          this.accountType = +accountTypeForJump
        } else {
          this.showNewDialog = true
        }
      } else {
        this.showDialog = true
      }
      this.diaLogType = diaLogType
    },

    handleManage(row) {
      const { workId } = row
      this.$confirm('确定此工单的异常问题已处理完毕?', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const { code, message } = await $dealExceptionWorkerOrder({ workId })
          if (+code === 1) {
            this.$message.success('处理成功')
            this.getList()
            this.$emit('getExceptionOrderCount')
          } else {
            this.$message.error(message)
          }
        } catch (e) {
          this.$message.error(e)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video-link {
  display: block;
  // width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.getMoreButton {
  margin-left: 10px;

  span {
    transform: scaleX(2) rotate(-90deg);
    transition: all 0.2s;
    display: inline-block;
    font-size: 10px;
    margin-left: 8px;
  }
}

.showMoreButton {
  span {
    transform: scaleX(2) rotate(90deg);
  }
}

.m-r {
  margin-right: 0;
}

.quotientIdInput {
  width: 200px;
}

.download {
  color: #409EFF;
  cursor: pointer;
}

.files {
  display: flex;
  align-items: center;
  color: #67C23A;
}

.close {
  margin-left: 6px;
  cursor: pointer;
  color: #bbb;
}

::v-deep {
  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 124px;
  }
}
</style>
