<template>
  <div>
    <el-table v-scrollbar v-loading="loading" class="table-view" :data="newTableData" @sort-change="doSort">
      <el-table-column
        prop="orderInfo"
        label="账号"
        width="220"
        align="center"
      >
        <template slot-scope="{ row }">
          <AccountCard
            :info="row"
            :options="{ imgUrl: 'accountImg', name: 'accountName' }"
          >
            <p v-if="(row.tagsRelations || []).length" class="m-t-5">
              <el-tag v-for="item in row.tagsRelations" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
            </p>
          </AccountCard>
        </template>
      </el-table-column>
      <el-table-column prop="signUserName" label="经纪人" width="200">
        <template slot-scope="{ row }">
          <span>
            {{
              row.signGroupName || row.signTeamName || row.signUserName ?
                `${row.signGroupName}-${row.signTeamName}-${row.signUserName}`
                :
                '--'
            }}
          </span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="signScheUser" label="签约团队" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.signGroupName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="signTeamName" label="签约小组" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.signTeamName || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="signUserName" label="签约经纪人" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.signUserName || '--' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="bindTime" label="绑定时间" width="180" sortable="custom">
        <template slot-scope="{ row }">
          <span>{{ row.bindTime || '--' }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="preGrade" label="预评级" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.preGrade === "0" || !row.preGrade ? '--' : row.preGrade }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="preGrade" label="粉丝量" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.fansNum | toThousandsW }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="platName" label="平台" /> -->
      <el-table-column prop="signScheUser" label="当前对接人" width="120" sortable="custom">
        <template slot-scope="{ row }">
          <el-tooltip
            class="tooltip"
            :disabled="!row.signScheUser || !row.signScheUser.length"
            type="el-popover"
            placement="right"
            effect="light"
          >
            <div slot="content">
              <el-table :data="row.signScheUser || []">
                <el-table-column prop="signGroupName" label="签约团队" />
                <el-table-column prop="signTeamName" label="签约小组" />
                <el-table-column prop="signUserName" label="经纪人" />
                <el-table-column prop="createdTime" label="绑定时间" width="180" />
              </el-table>
            </div>
            <span class="current">{{ (row.signScheUser || []).length || 0 }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="报价" width="180">
        <template slot-scope="{ row }">
          <div class="price">
            <template v-if="row.platId === 25">
              <p>
                <span>1-20s：</span>
                <span>¥{{ row.twentySecondPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>21-60s：</span>
                <span>¥{{ row.sixPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>60s以上：</span>
                <span>¥{{ row.oversixtySecondPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>全网报价：</span>
                <span>¥{{ row.netPrice | toThousandsW }}</span>
              </p>
            </template>

            <template v-if="row.platId === 26">
              <p>
                <span>达人报价：</span>
                <span>¥{{ row.sixPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>全网报价：</span>
                <span>¥{{ row.netPrice | toThousandsW }}</span>
              </p>
            </template>

            <template v-if="row.platId === 2">
              <p>
                <span>定制视频：</span>
                <span>¥{{ row.customVideoPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>植入视频：</span>
                <span>¥{{ row.implantationVideoPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>直发视频：</span>
                <span>¥{{ row.directVideoPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>转发动态：</span>
                <span>¥{{ row.forwardSituationPrice | toThousandsW }}</span>
              </p>
            </template>

            <template v-if="row.platId === 45">
              <p>
                <span>视频笔记：</span>
                <span>¥{{ row.videoPrice | toThousandsW }}</span>
              </p>
              <p>
                <span>图文笔记：</span>
                <span>¥{{ row.picturePrice | toThousandsW }}</span>
              </p>
            </template>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="入库时间" width="180">
        <template slot-scope="{ row }">
          <div>
            {{ row.createTime || '--' }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="touchAccount" width="120">
        <template slot="header">
          <div>
            被触达次数
            <IconTip
              type="popover"
              content="指该达人被添加为预备签约达人的总次数"
              icon-class="iconwenhao"
            />
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="lastChatTime" label="最近沟通时间" width="180" sortable="custom">
        <template slot-scope="{ row }">
          <div>
            {{ row.lastChatTime || '--' }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="lastChatTime" label="最近沟通经纪人" width="120">
        <template slot-scope="{ row }">
          <div>
            {{ row.lastChatTime || '--' }}
          </div>
        </template>
      </el-table-column> -->
      <el-table-column prop="communicateRecords" label="最近沟通记录" width="160">
        <template slot-scope="{ row }">
          <div v-if="(row.communicateRecords || []).length" class="tagsWrap">
            <el-tag v-for="item in row.communicateRecords.slice(0, 2)" :key="item.id" effect="plain" size="small">
              {{ item }}
            </el-tag>
            <div class="more" @click="handleShowCommunicateRecordDialog(row.accountId, 'view')">更多</div>
          </div>
          <div v-else>--</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="signFailCount" width="140">
        <template slot="header">
          <div>
            签约失败次数
            <IconTip
              type="popover"
              content="指该达人被标记为签约失败的总次数"
              icon-class="iconwenhao"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="failReason" label="签约失败原因" width="110">
        <template slot-scope="{ row }">
          <el-button type="text" @click="handleCheckFailReason(row.accountId)">查看</el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="remark" label="备注">
        <template slot-scope="{ row }">
          <el-tooltip
            :disabled="!row.remark"
            type="el-popover"
            :content="row.remark"
            placement="top"
          >
            <p class="info-text text-over-hidden-2">
              {{ row.remark || '--' }}
            </p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="userSignStatus" label="签约状态">
        <template slot-scope="{ row }">
          <span>
            {{ row.userSignStatus }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="操作" width="200px" fixed="right">
        <template slot-scope="{ row }">
          <!-- 签约中状态的操作 -->
          <div v-if="row.editAuth && row.signStatus === 2">
            <el-button type="text" @click="handleShowCommunicateRecordDialog(row.accountId, 'edit')">填写沟通记录</el-button>
            <el-button type="text" @click="handleShowRemarkDialog(row.accountId)">编辑</el-button>
            <el-button type="text" @click="handleShowSuccessDialog(row.accountId)">签约成功</el-button>
            <!-- <el-button type="text" @click="handleShowSuccessDialog(row.accountId)">签约成功</el-button> -->
            <!-- <el-button v-if="row.editAuth" type="text" @click="handleShowFailDialog(row.accountId)">签约失败</el-button> -->
            <el-button type="text" @click="handleUnbindAccount(row.accountId)">解绑账号</el-button>
          </div>
          <!-- 解除绑定状态的操作 -->
          <div v-if="row.editAuth && row.signStatus === 1">
            <el-button type="text" @click="handleRebindAccount(row.accountId)">重新绑定</el-button>
          </div>
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
        @current-change="getAll"
      />
    </div>
    <FailReasonDialog :show="showReasonDialog" :data="failReasonData" @onClose="showReasonDialog = false" />
    <FailDialog :id="checkAccountId" :show="showFailDialog" :info="failDialogData" @onClose="showFailDialog = false" @getAll="getAll" />
    <!-- <RemarkDialog v-if="showRemarkDialog" :id="checkAccountId" :show="showRemarkDialog" dialog-type="edit" @onClose="showRemarkDialog = false" @getList="getList" /> -->
    <RemarkDialog v-if="showRemarkDialog" :id="checkAccountId" :show="showRemarkDialog" dialog-type="edit" @onClose="showRemarkDialog = false" @getList="getAll" />
    <SupplementDialog v-if="showSuccessDialog" :id="checkAccountId" :show="showSuccessDialog" @onClose="showSuccessDialog = false" @getAll="getAll" />
    <!-- <CommunicateRecordDialog v-if="showCommunicateRecordDialog" :id="checkAccountId" :show="showCommunicateRecordDialog" :dialog-type="communicateRecordDialogType" @onClose="showCommunicateRecordDialog = false" @getList="getList" /> -->
    <CommunicateRecordDialog v-if="showCommunicateRecordDialog" :id="checkAccountId" :show="showCommunicateRecordDialog" :dialog-type="communicateRecordDialogType" @onClose="showCommunicateRecordDialog = false" @getList="getAll" />
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance, reactive, toRefs, watch } from '@vue/composition-api'
import { AccountCard, IconTip } from 'components'
import { $checkFailReason, $failSignProgress, $reBindAccount } from '@/api/sign-progress'
import { useTableSort } from '@/hook'
import FailReasonDialog from './components/FailReasonDialog'
import FailDialog from './components/FailDialog'
import RemarkDialog from './components/RemarkDialog'
import SupplementDialog from './components/SupplementDialog'
import CommunicateRecordDialog from './components/CommunicateRecordDialog.vue'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => ({})
    },
    tableData: {
      type: Array,
      default: () => ([])
    },
    dataTotal: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  components: {
    AccountCard,
    FailReasonDialog,
    FailDialog,
    RemarkDialog,
    SupplementDialog,
    CommunicateRecordDialog,
    IconTip
  },

  setup(props, { emit }) {
    const { $message, $confirm } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      // loading: true,
      newTableData: [],
      showReasonDialog: false,
      failReasonData: [],
      showFailDialog: false,
      failDialogData: {},
      showRemarkDialog: false,
      showCommunicateRecordDialog: false,
      checkAccountId: '',
      showSuccessDialog: false,
      communicateRecordDialogType: 'edit'
    })

    watch(() => [props.tableData, props.dataTotal], (newVal) => {
      state.newTableData = newVal[0]
      state.total = newVal[1]
    }, {
      immediate: true
    })

    // const getList = () => {
    //   state.loading = true
    //   return $getList({
    //     ...props.searchData
    //   })
    //     .then((res) => {
    //       state.loading = false
    //       if (+res.code === 1) {
    //         state.tableData = (res.data || {}).accountInfos || []
    //         state.total = (res.data || {}).total || 0
    //       } else {
    //         $message.error(res.message)
    //       }
    //     })
    //     .catch((err) => {
    //       if (err && err.__CANCEL__) return
    //       state.loading = false
    //       $message.error(err.message || '网络错误')
    //     })
    // }

    const getAll = (params) => {
      emit('getAll', params)
    }

    const { doSort } = useTableSort(props.searchData, getAll)

    const handleCheckFailReason = async(accountId) => {
      const { code, message, data } = await $checkFailReason({ accountId })
      if (+code === 1) {
        state.failReasonData = data || []
        state.showReasonDialog = true
      } else {
        $message.error(message)
      }
    }

    // 解绑账号
    const handleUnbindAccount = (accountId) => {
      $confirm('解绑账号后，你无法再跟进该达人', '解绑账号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async() => {
          const { code, message } = await $failSignProgress({ accountId })
          if (+code === 1) {
            $message({
              type: 'success',
              message: '操作成功'
            })
            emit('getAll')
          } else {
            $message.error(message)
          }
        })
    }

    // 重新绑定
    const handleRebindAccount = (accountId) => {
      $confirm('重新绑定账号后，你可以继续跟进该达人', '重新绑定账号', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(async() => {
          const { code, message } = await $reBindAccount({ accountId })
          if (+code === 1) {
            $message({
              type: 'success',
              message: '操作成功'
            })
            emit('getAll')
          } else {
            $message.error(message)
          }
        })
    }

    const handleShowFailDialog = (accountId) => {
      state.checkAccountId = String(accountId)
      state.showFailDialog = true
    }

    const handleShowSuccessDialog = (accountId) => {
      state.checkAccountId = String(accountId)
      state.showSuccessDialog = true
    }

    const handleShowRemarkDialog = (accountId) => {
      state.checkAccountId = String(accountId)
      state.showRemarkDialog = true
    }

    const handleShowCommunicateRecordDialog = (accountId, type) => {
      state.checkAccountId = String(accountId)
      state.showCommunicateRecordDialog = true
      state.communicateRecordDialogType = type
    }

    return {
      ...toRefs(state),
      // handleGetList,
      // getList,
      getAll,
      doSort,
      handleCheckFailReason,
      handleUnbindAccount,
      handleRebindAccount,
      handleShowFailDialog,
      handleShowSuccessDialog,
      handleShowRemarkDialog,
      handleShowCommunicateRecordDialog
    }
  }
})
</script>

<style scoped lang="scss">
/* .tooltip {
  background: #ccc !important;
} */
.current {
  color: #2c64ff;
}

.price {
  text-align: left;

  p {
    span {
      &:nth-child(1) {
        display: inline-block;
        width: 74px;
      }
    }
  }
}

.ksPrice {
  text-align: center;
}

.tagsWrap {
  .el-tag {
    margin: 4px 6px;
    border-radius: 5px;
  }

  .more {
    color: #2c64ff;
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
