<template>
  <div>
    <div class="table-view m-t-16">
      <el-table
        ref="accounts"
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号" width="140" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column label="账号状态" align="left">
          <template slot-scope="{ row }">
            {{ getAccountType.get(row.accountStatus) }}
          </template>
        </el-table-column>
        <el-table-column label="账号归属" width="100" align="left">
          <template slot-scope="{ row }">
            {{ row.accountBelong|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" width="100" label="运营负责人">
          <template slot-scope="{ row }">
            {{ row.curOperatorName | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="opportunityTotal"
          sortable="custom"
          width="160px"
        >
          <template slot="header">
            <IconTip
              content="指账号在商机中被商务添加为推荐账号的总次数；问询总次数=MCN商机问询总数+向乾商机问询总数"
              label="问询总数"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <template v-if="row.opportunityTotal">
                <span>{{ row.opportunityTotal }}</span>
                <!-- <IconTip
                  v-if="row.mcnOpportunityDataBO"
                  icon-class="icontongjiliebiao"
                  @click="handleBussiness(row, 'Mcn')"
                >
                  <div>
                    MCN商机问询总数
                    {{ row.mcnOpportunityDataBO.totalOpportunitySum }}
                  </div>
                  <div>
                    等待结果 {{ row.mcnOpportunityDataBO.waitOpportunitySum }}
                  </div>
                  <div>
                    确认合作（含此账号）{{
                      row.mcnOpportunityDataBO.confirmOpportunitySum
                    }}
                  </div>
                  <div>
                    确认合作（不含此号）{{
                      row.mcnOpportunityDataBO.confirmOppNotIncludedSum
                    }}
                  </div>
                  <div>
                    暂不合作 {{ row.mcnOpportunityDataBO.refuseOpportunitySum }}
                  </div>
                  <div>
                    问询成功率
                    {{
                      row.mcnOpportunityDataBO.accountWinTenderRatio === 0 ||
                        row.mcnOpportunityDataBO.accountWinTenderRatio > 0
                        ? row.mcnOpportunityDataBO.accountWinTenderRatio + '%'
                        : ''
                    }}
                  </div>
                  <div>点击图标查看商机明细</div>
                </IconTip> -->
                <IconTip
                  v-if="row.xiangQianOpportunityDataBO"
                  icon-class="icontongjiliebiao"
                  class="MCN-icon"
                  @click="handleBussiness(row, 'CommercialOpportunity')"
                >
                  <div>
                    商机问询总数
                    {{ row.xiangQianOpportunityDataBO.totalOpportunitySum }}
                  </div>
                  <div>
                    等待结果
                    {{ row.xiangQianOpportunityDataBO.waitOpportunitySum }}
                  </div>
                  <div>
                    确认合作（含此账号）{{
                      row.xiangQianOpportunityDataBO.confirmOpportunitySum
                    }}
                  </div>
                  <div>
                    确认合作（不含此号）{{
                      row.xiangQianOpportunityDataBO.confirmOppNotIncludedSum
                    }}
                  </div>
                  <div>
                    暂不合作
                    {{ row.xiangQianOpportunityDataBO.refuseOpportunitySum }}
                  </div>
                  <div>
                    问询成功率
                    {{
                      row.xiangQianOpportunityDataBO.accountWinTenderRatio ===
                        0 ||
                        row.xiangQianOpportunityDataBO.accountWinTenderRatio > 0
                        ? row.xiangQianOpportunityDataBO.accountWinTenderRatio +
                          '%'
                        : ''
                    }}
                  </div>
                  <div>点击图标查看商机明细</div>
                </IconTip>
              </template>
              <template v-else>--</template>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="recommendSuccessRatio"
          sortable="custom"
          width="160"
        >
          <template slot="header">
            <IconTip
              content="指商机中，账号最终合作的总次数/账号被商务添加为推荐账号的总次数*100%"
              label="问询成功率"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            <span>{{
              row.recommendSuccessRatio === 0 || row.recommendSuccessRatio > 0
                ? row.recommendSuccessRatio + '%'
                : '--'
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合作评分" width="130">
          <template slot-scope="{row}">
            <div class="price">
              <p>
                <span>响应速度：</span>
                <span>{{ row.responseSpeedScore | toThousandsW }}</span>
              </p>
              <p>
                <span>配合度：</span>
                <span>{{ row.cooperationScore | toThousandsW }}</span>
              </p>
              <p>
                <span>内容创意：</span>
                <span>{{ row.contentCreativeScore | toThousandsW }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom" width="100">
          <template slot-scope="{ row }">
            {{ row.fansNum | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fansIncrementNumWeek"
          label="近7日涨粉数"
          sortable="custom"
          width="110"
        >
          <template slot-scope="{ row }">
            {{ row.fansIncrementNumWeek | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="addFansMonth"
          label="近30日涨粉数"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.addFansMonth | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgFlowWeek"
          label="近7天集均流量"
          sortable="custom"
          width="120"
        >
          <template slot-scope="{ row }">
            {{ row.avgFlowWeek | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgFlowMonth"
          label="近30天集均流量"
          sortable="custom"
          width="130"
        >
          <template slot-scope="{ row }">
            {{ row.avgFlowMonth | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="报价" prop="twentySecondPrice" width="152" text-align="left">
          <template slot="header">
            <IconTip
              v-if="getPlatPriceTip"
              :content="getPlatPriceTip"
              label="报价"
              icon-class="iconwenhao"
            />
            <span v-else>报价</span>
          </template>
          <template slot-scope="{row}">
            <div class="price">
              <template v-if="type === 'douyin'">
                <p v-if="checkTableRowShow.twentySecondPrice">
                  <span>1-20s：</span>
                  <span>¥{{ row.twentySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.quotePrice">
                  <span>21-60s：</span>
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.oversixtySecondPrice">
                  <span>60s以上：</span>
                  <span>¥{{ row.oversixtySecondPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.netPrice">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'kuaishou'">
                <p v-if="checkTableRowShow.quotePrice">
                  <span>达人报价：</span>
                  <span>¥{{ row.quotePrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.netPrice">
                  <span>全网报价：</span>
                  <span>¥{{ row.netPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'bilibili'">
                <p v-if="checkTableRowShow.customVideoPrice">
                  <span>定制视频：</span>
                  <span>¥{{ row.customVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.implantationVideoPrice">
                  <span>植入视频：</span>
                  <span>¥{{ row.implantationVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.directVideoPrice">
                  <span>直发视频：</span>
                  <span>¥{{ row.directVideoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.forwardSituationPrice">
                  <span>转发动态：</span>
                  <span>¥{{ row.forwardSituationPrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'xiaohongshu'">
                <p v-if="checkTableRowShow.videoPrice">
                  <span>视频笔记：</span>
                  <span>¥{{ row.videoPrice | toThousandsW }}</span>
                </p>
                <p v-if="checkTableRowShow.picturePrice">
                  <span>图文笔记：</span>
                  <span>¥{{ row.picturePrice | toThousandsW }}</span>
                </p>
              </template>

              <template v-if="type === 'other'">
                <p class="other">¥{{ row.quotePrice | toThousandsW }}</p>
              </template>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="历史毛利率" prop="grossProfitRate" width="120" sortable="custom">
          <template slot="header">
            <IconTip
              content="该账号，最近两个月“档期”的工单毛利率的平均值，每天0点更新一次"
              label="历史毛利率"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">
            {{ (row.grossProfitRate === null || row.grossProfitRate === undefined) ? '--' : `${row.grossProfitRate}%` }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="s">
            <div class="flex flex-justify-center flex-dir-col">
              <div class="flex flex-justify-center">
                <IconTip
                  v-log="{
                    accountId: s.row.accountId,
                    accountName: s.row.accountName,
                  }"
                  content="查看"
                  icon-class="iconxiangqing"
                  @click="handleGoDetail(s.row)"
                />
                <IconTip
                  v-if="source==='myOperate' || s.row.transferAuthFlag"
                  v-log="{
                    accountId: s.row.accountId,
                    accountName: s.row.accountName,
                  }"
                  :class="s.row.viewFlag?'remove-ing':''"
                  :content="s.row.viewFlag?'该账号移交已在移交中':'账号移交'"
                  icon-class="iconinteration"
                  @click="handleRemove(s.row)"
                />
                <IconTip
                  v-if="(source==='myOperate'|| source==='allOperate') && s.row.editFlag"
                  v-log="{
                    accountId: s.row.accountId,
                    accountName: s.row.accountName,
                  }"
                  content="编辑"
                  icon-class="iconbianji"
                  @click="handleEdit(s.row)"
                />
              </div>

              <el-tooltip placement="top">
                <div slot="content">{{ source === 'myOperate' ? '档期管理' : '账号档期' }}</div>
                <div class="dangqi" @click="handleToDq(s.row)">档</div>
              </el-tooltip>
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
    </div>
    <RemoveDialog
      v-if="removeDialog"
      v-model="removeDialog"
      :dialog-type="'remove'"
      :source="'studio'"
      :row="row"
      @getList="getList"
      @close="removeDialog = false"
    />
    <EditDialog
      v-if="editDialog"
      v-model="editDialog"
      :type="type"
      :row="row"
      @success="getList"
      @close="editDialog = false"
    />
    <CalendarWrap :show="showCalendarDialog" :account-id="dqAccountId" :is-account-quotes-lib="source==='allOperate' ? true : false" :account-dq-msg="accountDqMsg" @closeCalendarWrap="showCalendarDialog = false" />
  </div>
</template>
<script>
import { AccountCard, IconTip } from 'components'
import { useTableSort } from '@/hook'
import { getCurrentInstance, reactive, toRefs, computed } from '@vue/composition-api'
import { commonData } from '../../_com/hooks'
import { copy } from '@/utils'
import {
  $groupAccountList,
  $getMyStudioList,
  $getTiktokMyStudioList,
  $getKuaishouMyStudioList,
  $getBilibiliMyStudioList,
  $getRedbookMyStudioList,
  $getTiktokGroupAccountList,
  $getKuaishouGroupAccountList,
  $getBilibiliGroupAccountList,
  $getRedbookGroupAccountList
} from '@/api/operating-manage'
import RemoveDialog from '../../_com/RemoveDialog.vue'
import EditDialog from '../../_com/EditDialog.vue'
import CalendarWrap from '@/views/sign-manage/@pages/sign-contract/accounts/_com/calendarWrap.vue'
export default {
  components: {
    IconTip,
    AccountCard,
    RemoveDialog,
    EditDialog,
    CalendarWrap
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    source: {
      type: String,
      default: ''
    },
    searchData: {
      type: Object,
      default() {
        return {}
      }
    },
    inquiryTime: {
      type: Array,
      default() {
        return []
      }
    },
    checkTableRowShow: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { $message, $router, $nextTick } = getCurrentInstance().proxy
    const { approvalStatusType, getAccountType } = commonData()
    const states = reactive({
      tableData: [],
      total: 0,
      loading: false,
      row: {},
      removeDialog: false,
      editDialog: false,
      dqAccountId: 0,
      showCalendarDialog: false,
      accountDqMsg: {}
    })

    const getPlatPriceTip = computed(() => {
        let plat = ''
        switch (props.type) {
          case 'douyin':
            plat = '星图'
            break
          case 'kuaishou':
            plat = '磁力巨星'
            break
          case 'bilibili':
            plat = '花火'
            break
          case 'xiaohongshu':
            plat = '小红书'
            break
          case 'other':
            plat = ''
            break
        }
        return plat ? `账号报价来源于${plat}平台，系统每周自动更新一次，可能存在一定偏差，支持编辑校准。` : ''
      }
    )

    const handleRemove = (row) => {
      if (row.viewFlag) return
      states.removeDialog = true
      states.row = row
    }
    const handleEdit = (row) => {
      states.editDialog = true
      states.row = row
    }
    const handleBussiness = (row, name) => {
      let url = '/bussiness-manage/business_opportunity_manage'

      if (+row.opportunitySwitch === 1) {
        url = '/qp/business-opportunity-manage'
      }

      $router.push({
        path: url,
        query: {
          accountId: row.accountId,
          platId: row.platId,
          time: props.inquiryTime ? String(props.inquiryTime) : '',
          _blank: true
        }
      })
    }
    const getList = function(source) {
      const type = props.source || source
      const searchData = copy(props.searchData)

      states.loading = true
      let $api
      if (type === 'myOperate') {
        if (props.type === 'douyin') {
          $api = $getTiktokMyStudioList
        } else if (props.type === 'kuaishou') {
          $api = $getKuaishouMyStudioList
        } else if (props.type === 'bilibili') {
          $api = $getBilibiliMyStudioList
        } else if (props.type === 'xiaohongshu') {
          $api = $getRedbookMyStudioList
        } else if (props.type === 'other') {
          $api = $getMyStudioList
        }
      } else {
        if (props.type === 'douyin') {
          $api = $getTiktokGroupAccountList
        } else if (props.type === 'kuaishou') {
          $api = $getKuaishouGroupAccountList
        } else if (props.type === 'bilibili') {
          $api = $getBilibiliGroupAccountList
        } else if (props.type === 'xiaohongshu') {
          $api = $getRedbookGroupAccountList
        } else if (props.type === 'other') {
          $api = $groupAccountList
        }
      }
      return $api({
        ...searchData
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data
            states.total = res.total || 0
          } else {
            states.tableData = []
            states.total = 0
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          if (err === null) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    // 查看
    const handleGoDetail = ({
      accountId = '',
      platId = '',
      accountName,
      accountType
    }) => {
      if ([25, 26].includes(platId)) {
        $router.push({
          path: `/details/account/${platId}/${accountId}`,
          query: {
            accountType: accountType,
            name: accountName,
            platId: platId,
            _blank: true
          }
        })
      } else if (platId === 2) {
        $router.push({
          path: `/details/bilibili-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else if (platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else {
        window.open(`#/account-manage/account-detail?accountId=${accountId}`)
      }
    }

    const handleToDq = (row) => {
      states.dqAccountId = +row.accountId
      states.showCalendarDialog = true
      states.accountDqMsg = row
    }

    const closeCalendarWrap = () => {
      states.showCalendarDialog = false
    }

    // 排序
    const doSort = ({ prop, order }) => {
      let determined
      switch (order) {
          case 'ascending':
            determined = `${prop}`
            break

          case 'descending':
            determined = `-${prop}`
            break

          case null:
            determined = ''
            break
      }
      props.searchData.determined = determined
      props.searchData.pageNum = 1

      $nextTick(() => {
        getList()
      })
    }

    return {
      ...toRefs(states),
      doSort,
      getList,
      handleGoDetail,
      approvalStatusType,
      handleEdit,
      handleRemove,
      getAccountType,
      getPlatPriceTip,
      handleBussiness,
      handleToDq,
      closeCalendarWrap
    }
  }
}
</script>
<style lang="scss" scoped>
.MCN-icon{
  ::v-deep{
    .iconfont{
      color: #ff6f00 !important;
    }
  }
}
.row-title{
  display: flex;
  justify-content: flex-start;
  color: #6c6d6d;
  font-size: 12px;
  width:100px;
}
.row-value{
  padding-left: 4px;
  display: flex;
  justify-content: flex-start;
  width:125px;
}
::v-deep {
  .remove-ing{
    .iconinteration:before {
      color: #9f9fa0;
    }
  }
}

.price {
  text-align: left;

  p {
    span:nth-child(1) {
      display: inline-block;
      width: 70px;
    }
  }
}

.other {
  text-align: center;
}

.dangqi{
  width:24px;
  height:24px;
  border-radius: 50%;
  border:1px solid #2c64ff;
  color:#2c64ff;
  margin:0 auto;
  margin-top:10px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  caret-color: transparent;
}
</style>
