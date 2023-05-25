<template>
  <div class="P-advertisingLaunch">
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input-number
                v-model="target.model.fansNumStart"
                placeholder="粉丝最小值"
                :controls="false"
                :min="0"
                :max="100000000"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input-number
                v-model="target.model.fansNumEnd"
                placeholder="粉丝最大值"
                :min="0"
                :controls="false"
                :max="100000000"
              />
            </div>
          </el-form-item>
        </template>
        <template v-slot:btns="target">
          <el-checkbox
            v-model="searchData.doorToDoorRecycling"
            class="m-l-24"
            true-label="1"
            false-label="0"
            @change="onSubmit(target.model)"
          >账号粉丝TOP1城市支持上门回收</el-checkbox>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-between flex-align-center m-b-10">
        <div>
          <p class="tip-red m-b-10">乾派账号请务必先与乾派商务负责人（查看账号达人类型的红色标签）联系拉通信息后再需求提报，请勿私对达人!</p>
          <div class="checkbox-view">
            <el-checkbox
              v-for="item in extFields"
              :key="item.fieldName"
              v-model="item.status"
              :label="item.fieldName"
            >{{ item.chnName }}</el-checkbox>
          </div>
        </div>
        <div>
          <el-button v-if="$permission('add_putting_account')" v-log type="primary" @click="handleAddAccount">添加投放账号</el-button>
          <el-button v-if="$permission('put_count_batch_edit')" type="primary" icon="el-icon-edit" @click="handleBatchEdit">批量修改</el-button>
          <el-button v-if="$permission('set_the_no')" type="primary" @click="handleSetNum">一轮定号</el-button>
        </div>
      </div>
      <el-table
        ref="table"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @sort-change="doSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          v-if="$permission('put_count_batch_edit')"
          type="selection"
          width="42"
        />
        <!-- <el-table-column width="40" align="left">
          <template>
            <svg-icon icon-class="hot" class="hot-icon" />
          </template>
        </el-table-column> -->
        <el-table-column width="30">
          <template slot-scope="{row}">
            <el-tooltip
              v-if="row.redeliveryRecommendFlag === 1"
              effect="dark"
              content="近期账号视频数据表现良好，推荐合作投放！"
              placement="top"
            >
              <svg-icon icon-class="hot" class="hot-icon m-r-5" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="账号信息" width="200" align="left">
          <template slot-scope="{row}">
            <div class="flex flex-align-center">
              <AccountCard :info="row">
                <template slot="last">
                  <!-- <div>
                    <template v-if="row.accountTag">
                      <el-tag v-for="item in row.accountTag.split(',')" :key="item" class="account-tag" size="mini">{{ item }}</el-tag>
                    </template>
                    <template v-if="row.tagValue">
                      <el-tag v-for="item in row.tagValue.split(',')" :key="item" class="account-tag" size="mini">{{ item }}</el-tag>
                    </template>
                  </div> -->

                  <div v-if="row.upUpNameAndLeader" style="text-align:left; margin-bottom: 6px;"><el-tag size="mini" type="danger">{{ row.upUpNameAndLeader }}</el-tag></div>
                  <div v-if="row.mediumTag" style="text-align:left;"><el-tag size="mini" type="danger">{{ row.mediumTag }}</el-tag></div>
                </template>
              </AccountCard>
            </div>

          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝数" sortable="custom" width="110">
          <template slot-scope="{row}">
            <div>
              <span>{{ row.fansNum | toThousandsW }}</span>
              <IconTip v-if="row.xingtuIndexUrl" content="粉丝地域分布" icon-class="iconguanyuwomen" @click="handleShowFansDialog(row)" />
            </div>
          </template>
        </el-table-column>
        <el-table-column v-if="extFields.belongTeam.status" prop="belongTeam" label="所属机构" />
        <el-table-column prop="fansNum" label="粉丝TOP1城市">
          <template slot-scope="{row}">
            {{ row.cityName || '--' }}
            <el-tooltip v-if="row.doorToDoorRecycling == 1" effect="dark" content="支持上门回收" placement="top">
              <i class="el-icon-user-solid" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="cityGrade" label="粉丝TOP1城市等级" width="90">
          <template slot-scope="{row}">
            {{ row.cityGrade || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="星图报价(元)" sortable="custom" prop="xingtuPrice">
          <template slot-scope="s">{{ s.row.xingtuPrice | toThousandsW }} </template>
        </el-table-column>
        <el-table-column prop="cpm" label="CPM" sortable="custom" width="100">
          <template slot="header">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="300"
              content="预期CPM：数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
            >
              <div slot="reference">
                CPM
                <i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
          <template slot-scope="s">
            <div> {{ s.row.cpm | toThousands }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="extFields.avgLikeWeek.status" prop="avgLikeWeek" label="近7日集均点赞数" sortable="custom" width="90">
          <template slot-scope="{row}">{{ (row.avgLikeWeek || 0).toFixed(0) | toThousandsW }}</template>
        </el-table-column>
        <el-table-column v-if="extFields.avgLikeMonth.status" prop="avgLikeMonth" label="近30日集均点赞数" sortable="custom" width="100">
          <template slot-scope="{row}">{{ (row.avgLikeMonth || 0).toFixed(0) | toThousandsW }}</template>
        </el-table-column>
        <el-table-column label="是否合作（合作次数）">
          <template slot-scope="{row}">{{ IS_COOPERATE_MAP[row.isPartner] || '--' }} ({{ row.accountUserCount? row.accountUserCount > 99 ? '99+' : row.accountUserCount : '--' }})</template>
        </el-table-column>
        <!-- <el-table-column v-if="extFields.phone.status" prop="phone" label="联系方式" /> -->
        <!-- <el-table-column prop="realname" label="对接人" width="90px">
          <template slot-scope="{ row }">
            <span>
              {{ row.realname }} <i class="iconfont iconlianxiren realname-iocn" @click="handleShowList(row)" />
            </span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="deadlineDateNum" label="对接保护期" sortable="custom" /> -->
        <el-table-column label="账号状态">
          <template slot-scope="{row}">
            <a
              v-log
              class="flex"
              @click="handleShowDetail(row)"
            >
              {{ STATUS_MAP[row.deliveryStatus] }}
              <i v-if="row.requirementFlag&&[1,3].includes(row.deliveryStatus)||[2,4].includes(row.deliveryStatus)" class="iconfont iconright-circle" />
            </a>
          </template>
        </el-table-column>
        <el-table-column label="C2B每月投放上限/当月剩余次数" width="130">
          <template slot-scope="{row}">
            {{ row.c2bMonthDeliveryCount|emptyFill }}/{{ row.c2bRemainMonthDeliveryCount|emptyFill }}
            <el-tooltip v-if="row.c2bMonthDeliveryCount == 0&&row.c2bRemark" effect="dark" :content="row.c2bRemark" placement="top">
              <i class="iconfont iconcuowu" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="C2B对接人/保护期" width="140">
          <template slot-scope="{ row }">
            <span>
              <IconTip
                v-if="row.c2bAccountBelongPriority"
                content="该账号存在多个对接人，按照对接开始时间升序排序，早对接则享有优先合作权。1号对接人>2号对接人>3号对接人"
                :icon-class="`iconnumber${row.c2bAccountBelongPriority}`"
              />
              {{ row.c2bOppositeUserName|emptyFill }}/{{ row.c2bDeadlineDateNum|emptyFill }}
              <br>
              <i class="iconfont iconlianxiren realname-iocn" @click="handleShowList(row,'C2B')" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="B2C每月投放上限/当月剩余次数" width="130">
          <template slot-scope="{row}">
            {{ row.b2cMonthDeliveryCount|emptyFill }}/{{ row.b2cRemainMonthDeliveryCount|emptyFill }}
            <el-tooltip v-if="row.b2cMonthDeliveryCount == 0&&row.b2cRemark" effect="dark" :content="row.b2cRemark" placement="top">
              <i class="iconfont iconcuowu" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="B2C对接人/保护期" width="140">
          <template slot-scope="{ row }">
            <span>
              <IconTip
                v-if="row.b2cAccountBelongPriority"
                content="该账号存在多个对接人，按照对接开始时间升序排序，早对接则享有优先合作权。1号对接人>2号对接人>3号对接人"
                :icon-class="`iconnumber${row.b2cAccountBelongPriority}`"
              />
              {{ row.b2cOppositeUserName|emptyFill }}/{{ row.b2cDeadlineDateNum|emptyFill }}
              <br>
              <i class="iconfont iconlianxiren realname-iocn" @click="handleShowList(row,'B2C')" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="C2C每月投放上限/当月剩余次数" width="130">
          <template slot-scope="{row}">
            {{ row.c2cMonthDeliveryCount|emptyFill }}/{{ row.c2cRemainMonthDeliveryCount|emptyFill }}
            <el-tooltip v-if="row.c2cMonthDeliveryCount == 0&&row.c2cRemark" effect="dark" :content="row.c2cRemark" placement="top">
              <i class="iconfont iconcuowu" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="realname" label="C2C对接人/保护期" width="140">
          <template slot-scope="{ row }">
            <span>
              <IconTip
                v-if="row.c2cAccountBelongPriority"
                content="该账号存在多个对接人，按照对接开始时间升序排序，早对接则享有优先合作权。1号对接人>2号对接人>3号对接人"
                :icon-class="`iconnumber${row.c2cAccountBelongPriority}`"
              />
              {{ row.c2cOppositeUserName|emptyFill }}/{{ row.c2cDeadlineDateNum|emptyFill }}
              <br>
              <i class="iconfont iconlianxiren realname-iocn" @click="handleShowList(row,'C2C')" />
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否合作">
          <template slot-scope="s">{{ IS_COOPERATE_MAP[s.row.isPartner] || '' }} </template>
        </el-table-column>
        <el-table-column prop="accountUserCount" label="合作次数" sortable="custom">
          <template slot-scope="{row}">
            {{ row.accountUserCount > 99 ? '99+' : row.accountUserCount }}
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="投放上限/月">
          <template slot-scope="s">
            <div>
              <span>{{ s.row.sysPuttingCount }}</span>
              <el-tooltip v-if="s.row.sysPuttingCount == 0&&s.row.remark" effect="dark" :content="s.row.remark" placement="top">
                <i class="iconfont iconcuowu" />
              </el-tooltip>
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="createTime" label="添加时间" sortable="custom" width="170px" /> -->
        <el-table-column label="操作" width="152" fixed="right">
          <template slot-scope="s">
            <div class="table-todo-wrap">
              <el-link v-log size="small" type="primary" @click="handleShow(s.row)">查看</el-link>
              <!-- <template v-if="$permission('putting_place_order') && s.row.orderButtonFlag">
                <el-tooltip
                  v-if="s.row.defriendFlag===1||s.row.deliveryStatus === 2 || s.row.deliveryStatus === 4"
                  placement="top"
                  :content="s.row.defriendFlag!==1?`该账号当前广告师${s.row.advertiserRealname}已发起需求，暂不支持直接下单。请联系投放专员协调。`:'该账号已被拉黑，详情请咨询中台同事!'"
                >
                  <el-link v-log disabled size="small" type="primary" @click="handleOrderShow(s.row)">下单</el-link>
                </el-tooltip>
                <el-link v-else v-log size="small" type="primary" @click="handleOrderShow(s.row)">下单</el-link>
              </template> -->
              <template v-if="$permission('putting_account_edit')">

                <el-tooltip
                  v-if="s.row.defriendFlag"
                  v-log
                  placement="top"
                  :content="s.row.accountBlockRemark"
                >
                  <el-link
                    disabled
                    size="small"
                    type="primary"
                  >编辑</el-link>
                </el-tooltip>
                <el-link v-else v-log size="small" type="primary" @click="handleEdit(s.row)">编辑</el-link>
              </template>

              <el-link v-if="$permission('put_count_edit')" v-log size="small" type="primary" @click="handlePutCountShow(s.row)">限制投放</el-link>
              <!-- <IconTip
                v-log
                content="查看"
                icon-class="iconxiangqing"
                @click="handleShow(s.row)"
              />
              <IconTip
                v-if="btnPermission.hasOrder && s.row.orderButtonFlag"
                v-log
                :content="s.row.deliveryStatus === 2 || s.row.deliveryStatus === 4 ? `该账号当前广告师${s.row.advertiserRealname}已发起需求，暂不支持直接下单。请联系投放专员协调。` : '下单'"
                icon-class="iconxiadan"
                @click="handleOrderShow(s.row)"
              />
              <IconTip
                v-if="btnPermission.hasEdit && s.row.seeAndEditContactAuth === 1"
                v-log
                content="编辑"
                icon-class="iconbianji"
                @click="handleEdit(s.row)"
              />
              <IconTip
                v-if="$permission('put_count_manage')"
                v-log
                content="限制投放"
                icon-class="iconshezhitoufangcishu"
                @click="handlePutCountShow(s.row)"
              /> -->
              <!-- (s.row.deliveryStatus === 1 || s.row.deliveryStatus === 3) &&  -->
              <template v-if="+s.row.b2cMonthDeliveryCount||+s.row.c2cMonthDeliveryCount||+s.row.c2bMonthDeliveryCount">
                <template v-if="s.row.defriendFlag">
                  <el-tooltip
                    placement="top"
                    :content="s.row.accountBlockRemark"
                  >
                    <el-link v-log disabled size="small" type="primary">需求提报</el-link>
                  </el-tooltip>
                </template>
                <template v-else>
                  <el-link
                    v-if="$permission('putting_account_demand_submission') && s.row.isActive === 0"
                    v-log
                    type="primary"
                    @click="handleDemandShow(s.row, 0)"
                  >需求提报</el-link>
                  <el-tooltip
                    v-if="s.row.deliveryStatus === 3 && $permission('putting_account_demand_submission') && s.row.isActive === 1"
                    placement="top"
                    content="该账号在提报合作大厅中存在议价失败的需求，请优先从提报合作大厅提报需求！"
                  >
                    <el-link v-log disabled size="small" type="primary">需求提报</el-link>
                  </el-tooltip>
                </template>
              </template>
              <template v-if="$permission('suggest_cooperation') && s.row.deliveryStatus === 3&&(s.row.c2bRemainMonthDeliveryCount||s.row.b2cRemainMonthDeliveryCount||s.row.c2cRemainMonthDeliveryCount)">
                <el-tooltip
                  v-if="s.row.defriendFlag"
                  v-log
                  placement="top"
                  :content="s.row.defriendFlag!==1?`该账号当前广告师${s.row.advertiserRealname}已发起需求，暂不支持直接下单。请联系投放专员协调。`: s.row.accountBlockRemark"
                >
                  <el-link
                    disabled
                    type="primary"
                    @click="handleDemandShow(s.row, 2)"
                  >建议合作</el-link>
                </el-tooltip>
                <el-link
                  v-else
                  v-log
                  type="primary"
                  @click="handleDemandShow(s.row, 2)"
                >建议合作</el-link>
              </template>
              <template v-if="s.row.deliveryStatus === 1 && $permission('putting_account_build_successful')">
                <el-tooltip
                  v-if="s.row.defriendFlag"
                  placement="top"
                  :content="s.row.accountBlockRemark"
                >
                  <el-link
                    v-log
                    disabled
                    type="primary"
                  >建联成功</el-link>
                </el-tooltip>
                <el-link
                  v-else
                  v-log
                  type="primary"
                  @click="handleEdit(s.row, true)"
                >建联成功</el-link>
              </template>

              <el-link
                v-if="(s.row.deliveryStatus === 1||s.row.deliveryStatus === 3)&& $permission('add_requirement_for_other')&& s.row.isActive === 0&&s.row.sysPuttingCount!==0"
                v-log
                type="primary"
                @click="getDeliveryerStatus(s.row, 0,'forOther')"
              >需求代提</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="handleCurrentChange"
        />
      </div>
    </Wrap>
    <!-- <slot> -->
    <!-- :meet-user-data="filterMeetUserId" -->
    <AccountDialog
      v-if="hasAccountDialog"
      v-model="hasAccountDialog"
      :edit-type="accountEditType"
      :edit-data="accountEditData"
      :is-affirm="isAffirm"
      @updateData="getList"
    />
    <!-- </slot> -->

    <!-- 下单弹框 根据不同页面类型弹出不同框 -->
    <PuttingPlaceOrder v-if="showLanchInfo" v-model="showLanchInfo" :form-data="orderItem" />
    <PutCount
      v-if="putCountShow"
      v-model="putCountShow"
      :is-batch="isBatch"
      :accout-info="accoutInfo"
      @update="getList"
    />
    <RealNameList
      v-if="showReanlNameList"
      v-model="showReanlNameList"
      :info="orderItem"
      :business-line="businessLine"
    />
    <DemandDiglog
      v-if="showDeman"
      v-model="showDeman"
      :data="accountInfo"
      :demand-type="demandType"
      :source="demandSource"
      @success="getList"
      @handleBusinessDialog="handleBusinessDialog"
    />
    <RequireDialog
      v-if="showRequireDetail"
      v-model="showRequireDetail"
      :data="accountInfo"
    />
    <AccountFans
      v-if="showAccountFans"
      v-model="showAccountFans"
      :data="accoutInfo"
    />
    <CooperationDetail v-if="showDetail" v-model="showDetail" :data="accountInfo" :source="'putting-account'" />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
    <SetNumDialog v-if="showSetNoDialog" v-model="showSetNoDialog" @update="getList" />
  </div>
</template>
<script>
import { defineAsyncComponent } from '@vue/composition-api'
import qs from 'qs'
import { copy } from '@/components/common'
import { $getAccountCondition, $getAccountList, $getAccountPuttingByPlatId, $getDeliveryerStatus } from '@/api/bussiness-manage'
import Search from '@/components/Search'
import tableMixin from '@/mixins/table'
import PuttingPlaceOrder from './_component/PlaceOrder.vue'
import RealNameList from './_component/RealnameList'
import RequireDialog from './_component/RequireDialog'
import AccountCard from '@/components/AccountCard'
import { $getDataByDictType } from '@/api'
import AccountDialog from './_component/AccountDialog.vue'
import PutCount from './_component/PutCount'
import { IconTip } from 'components'
import DemandDiglog from '@/views/putting-manager/component/DemandDiglog.vue'
import BusinessLinePutDialog from '@/views/putting-manager/component/businessLinePutDialog.vue'
import { $getPlusAccountInfo } from '@/api/putting-manager'
import { ACCOUNT_STATUS_MAP as STATUS_MAP, ACCOUNT_STATUS_MAP_ARR } from '@/const'
/**
 * 搜索参数
 * @type {Object}
 */
const SEARCH_QUERY_DATA_MODEL = {
  tagValue: '',
  platId: '',
  accountId: '',
  accountName: '',
  belongTeam: '',
  fansNumStart: '',
  fansNumEnd: '',
  page_count: '',
  meetUserId: '',
  xingtuPrices: '',
  pageNum: 1,
  size: 20,
  determined: '',
  isPartner: ''
}

const IS_COOPERATE = [
  {
    'val': 0,
    'text': '否'
  },
  {
    'val': 1,
    'text': '是'
  }
]
const IS_COOPERATE_MAP = {}
IS_COOPERATE.forEach(item => {
  IS_COOPERATE_MAP[item.val] = item.text
})

export default {
  components: {
    vSearch: Search,
    PuttingPlaceOrder,
    AccountDialog,
    AccountCard,
    PutCount,
    RealNameList,
    DemandDiglog,
    RequireDialog,
    AccountFans: defineAsyncComponent(() => import('./_component/AccountFans.vue')),
    IconTip,
    CooperationDetail: defineAsyncComponent(() => import('../demand-pool/_com/CooperationDetail.vue')),
    BusinessLinePutDialog,
    SetNumDialog: defineAsyncComponent(() => import('./_component/SetNumDialog.vue'))
  },
  mixins: [tableMixin],
  data() {
    return {
      extFields: {
        belongTeam: { status: false, chnName: '所属机构' },
        avgLikeWeek: { status: false, chnName: '近7日集均点赞数' },
        avgLikeMonth: { status: false, chnName: '近30日集均点赞数' }
        // phone:{ status: false, chnName: '联系方式' }
      },
      showAccountFans: false,
      hasAccountDialog: false,
      showLanchInfo: false,
      IS_COOPERATE_MAP,
      formConf: {},
      searchData: { ...SEARCH_QUERY_DATA_MODEL },
      orderItem: {
        platName: '',
        accountName: '',
        accountId: '',
        platId: '',
        accountImg: ''
      },
      loading: false,
      accountEditData: null,
      putCountShow: false,
      showReanlNameList: false,
      isBatch: false,
      accoutInfo: {},
      STATUS_MAP,
      showDeman: false,
      demandSource: 0, // 需求来源：0-投放账号库 1-提报合作大厅 2-建议合作 3-议价失败复制订单
      isAffirm: false, // 是否建联
      showRequireDetail: false,
      demandType: '',
      showDetail: false,
      accountId: '',
      deliveryStatus: '',
      dialogInfo: {},
      businessLine: '', // 对接业务线类型
      showBusinessLineDialog: false,
      showSetNoDialog: false,
      showSubmitTip: false,
      getPlusAccountInfo: $getPlusAccountInfo
    }
  },
  computed: {
    filterMeetUserId() {
      return this.normalFormItemMap?.c2bOppositeUserId?.data.filter(item => item.userId) || []
    }
  },
  created() {
    this.buildFormConf()
    this.getAccountCondition()
    this.getFilterList()
  },
  mounted() {
    if (this.$route.query.accountId) {
      this.$set(this.$refs.search.form, 'accountId', +this.$route.query.accountId)
      this.searchData.accountId = +this.$route.query.accountId
    }

    this.getList()
  },
  methods: {
    /**
     * 列表查询数据
     */
    async getList() {
      const params = copy(this.searchData)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      this.loading = true
      try {
      const res = await $getAccountList(params)
      if (res.code === 1) {
        this.tableData = res.data || []
        this.total = res.total
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
      } catch (err) {
        if (err.__CANCEL__) return
        this.$message.error(err.message)
        this.loading = false
      }
    },
    // 获取下拉框选项 CPM
    getFilterList() {
      $getDataByDictType({
        dictTypes: ['sys_search_cpm', 'account_fans_top1_city_grade']
      }, Math.random()).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.cpm.data = res.data.sys_search_cpm
          this.normalFormItemMap.cityGrade.data = res.data.account_fans_top1_city_grade
        }
      })
    },
    /**
     * 查询条件列表
     */
    async getAccountCondition() {
      const res = await $getAccountCondition()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.platInfo
        console.info('====================res.data.accountInfo', res.data.accountInfo.length)
        // this.normalFormItemMap.accountId.data = res.data.accountInfo
        this.normalFormItemMap.tagValue.data = (res.data.tagValues || []).map(item => ({ text: item, val: item }))
        // this.normalFormItemMap.meetUserId.data = res.data.simpleUserInfo
        this.normalFormItemMap.c2bOppositeUserId.data = this.normalFormItemMap.b2cOppositeUserId.data = this.normalFormItemMap.c2cOppositeUserId.data = res.data.simpleUserInfo || []
        this.normalFormItemMap.xingtuPrices.data = res.data.xingtuPrices
      }
    },
    handleShow(row) {
      if ([25, 26].includes(row.platId)) {
       this.$router.push({
          path: `/details/account/${row.platId}/${row.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (row.platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else if (row.platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else {
        this.$router.push({
          path: '/order-account-detail',
          query: {
            accountId: row.accountId,
            accountName: row.accountName,
            type: 3,
            _blank: true
          }
        })
      }
    },
    handleSelectionChange(row) {
      this.selectData = row
    },
    handlePutCountShow(row) {
      this.putCountShow = true
      this.accoutInfo = row
      this.isBatch = false
      this.accoutInfo.accountIds = [row.accountId]
    },
    handleOrderShow(row) {
      if (row.deliveryStatus === 2 || row.deliveryStatus === 4) return
      this.orderItem = {
        platName: row.platName,
        accountName: row.accountName,
        accountId: row.accountId,
        platId: row.platId,
        accountImg: row.accountImg
      }
      // console.log(row)
      this.showLanchInfo = true
    },
    handleEdit(row, isAffirm = false) {
      const rowData = JSON.parse(JSON.stringify(row))
      // this.addForm = rowData
      rowData.inputTags = []
      if (rowData.tagValue) {
        rowData.inputTags = rowData.tagValue.split(',')
      }
      this.accountEditData = rowData
      this.accountEditType = 'edit'
      this.hasAccountDialog = true
      this.isAffirm = isAffirm
    },
    // 对接人信息点击
    handleShowList(row, businessLine) {
      this.orderItem = row
      this.showReanlNameList = true
      this.businessLine = businessLine
    },
    handleSetNum() {
      this.showSetNoDialog = true
    },
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      var normal = [
        {
          type: 'select',
          key: 'deliveryStatus',
          // ,"value": ""
          data: ACCOUNT_STATUS_MAP_ARR,
          optionLabelKey: 'text',
          optionValKey: 'val',
          conf: {
            placeholder: '账号状态'
          }
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '全部平台'
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          lazyLoadApi: this.getPlusAccountInfo,
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'tagValue',
          data: [],
          conf: {
            placeholder: '达人类型'
          }
        },
        {
          type: 'select',
          key: 'cityGrade',
          data: [],
          conf: {
            placeholder: '粉丝TOP1城市等级'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'xingtuPrices',
          // ,"value": ""
          data: [],
          optionLabelKey: 'xingtuPriceKey',
          optionValKey: 'xingtuPriceValue',
          conf: {
            placeholder: '星图报价'
          }
        },
        {
          type: 'select',
          key: 'cpm',
          data: [],
          conf: {
            placeholder: '请选择cpm'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'isPartner',
          // ,"value": ""
          data: IS_COOPERATE,
          conf: {
            placeholder: '是否合作'
          }
        },
        {
          type: 'select',
          key: 'c2bOppositeUserId',
          // ,"value": ""
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: 'C2B对接人'
          }
        },
        {
          type: 'select',
          key: 'b2cOppositeUserId',
          // ,"value": ""
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: 'B2C对接人'
          }
        },
        {
          type: 'select',
          key: 'c2cOppositeUserId',
          // ,"value": ""
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: 'C2C对接人'
          }
        }
        // {
        //   type: 'select',
        //   key: 'meetUserId',
        //   // ,"value": ""
        //   data: [],
        //   optionLabelKey: 'realname',
        //   optionValKey: 'userId',
        //   conf: {
        //     placeholder: '对接人'
        //   }
        // },
      ]
      var formConf = {
        normal,
        hasExport: this.$permission('putting_account_export')
      }
      var normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {
      // if (item.key === 'platId') {
      //   model.accountId = ''
      //   this.normalFormItemMap.accountId.data = []
      //   $getAccountPuttingByPlatId({ platId: val }).then(res => {
      //     if (res.code === 1) {
      //       this.normalFormItemMap.accountId.data = res.data
      //     }
      //   })
      // }
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      this.searchData.pageNum = 1
      this.searchData = Object.assign({}, this.searchData, data)
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      window.location.href = `/api/business/foreign/accountPutting/export?${qs.stringify(params)}&componentId=${this.$componentId}`
    },
    handleAddAccount() {
      this.accountEditType = 'add'
      this.hasAccountDialog = true
      this.accountEditData = null
    },
    // 批量修改投放次数
    handleBatchEdit() {
      if (this.selectData && this.selectData.length > 0) {
        this.isBatch = true
        this.accoutInfo = {
          curPuttingCount: undefined,
          accountIds: this.selectData.map(item => item.accountId)
        }
        this.putCountShow = true
      } else {
        this.$message.info('请选择要修改的数据')
      }
    },
    handleCurrentChange() {
      this.getList()
    },
    handleDemandShow(row, demandSource, type) {
      // this.demandSource = demandSource
      // this.accountInfo = row
      // this.demandType = type
      // this.showDeman = true
      if (row.auditReportFlag && demandSource !== 2) {
        this.$confirm(`<p>当前达人仍有未完成的订单<span style="color:red">（待审核/待下单付款/待发布提交/待资金核算）</span>，禁止提报需求。</p><p>如仍需提报需求，<span style="color:red">请先线下跟军长沟通确认</span>，再继续提报</p>`, '提示', {
          customClass: 'presenting-confrim-wrap',
          closeOnClickModal: false,
          dangerouslyUseHTMLString: true,
          confirmButtonText: '线下已沟通，继续提报',
          cancelButtonText: '暂不提报'
        }).then(() => {
          this.demandSource = demandSource
          this.accountInfo = row
          this.demandType = type
          this.showDeman = true
        }).catch(() => {
          return
        })
        this.showSubmitTip = true
      } else {
          this.demandSource = demandSource
          this.accountInfo = row
          this.demandType = type
          this.showDeman = true
          this.showSubmitTip = false
      }
    },
    handleShowDetail(row) {
      if (row.deliveryStatus === 2 || row.deliveryStatus === 4) {
        this.showRequireDetail = true
        this.accountInfo = row
      } else {
        if (row.requirementFlag) {
           this.showDetail = true
        }
      }
      this.accountInfo = row
    },
    handleShowFansDialog(row) {
      this.accoutInfo = row
      this.showAccountFans = true
    },
    handleBusinessDialog(val) {
      this.dialogInfo = val
      this.showBusinessLineDialog = true
    },
    getDeliveryerStatus(row, source, type) {
      $getDeliveryerStatus().then(res => {
        if (res.code === 1) {
          this.handleDemandShow(row, source, type)
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
       console.log(err)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.P-advertisingLaunch {
  .account-search {
    .el-select-dropdown {
      .el-select-dropdown__item {
        height: auto !important;
        line-height: 1.2 !important;
        padding: 10px;
        .account-img {
          width: 40px;
          border-radius: 50%;
          margin-right: 8px;
        }
        .account-info {
          display: flex;
          flex: 1;
          justify-content: center;
          flex-direction: column;
          margin-right: 10px;
        }
        .account-fans {
          flex: initial;
          width: 80px;
        }
        .account-text1 {
          font-size: 14px;
        }
        .account-text2 {
          font-size: 12px;
          margin-top: 6px;
        }
        .account-name {
          font-weight: bold;
          width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
}
.realname-iocn {
  margin-left: 5px;
  font-size: 14px;
  color: $--color-primary;
  cursor: pointer;
}
.iconright-circle {
  margin-left: 2px;
  font-size: inherit;
  color: $--color-primary;
}
.hot-icon {
  font-size: 20px;
}
.el-icon-user-solid {
  color: $--color-danger;
}
.iconcuowu{
  color: $--color-danger;
  font-size: 14px;
  margin-left: 5px;
}
::v-deep{
  .iconnumber1{
    font-size: 14px !important;
  }
  .iconnumber2{
    font-size: 14px !important;
  }
  .iconnumber3{
    font-size: 14px !important;
  }
}
</style>

<style lang="scss">
.el-message-box.presenting-confrim-wrap {
    padding:14px 10px;
    width: 440px;
    height:200px;
    .el-message-box__btns {
      display: flex;
      justify-content: center;
      align-items: center;

      button{
        transform: scale(0.85);
        display:flex;
        justify-content: center;
        align-items: center;
        width:160px;
        height:40px;
        border-radius: 8px;
      }
    }
  }
</style>
