<template>
  <div v-loading="gLoading">
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <div class="search-wrapper slot-search">
            <span>团队筛选</span>
            <div>
              <el-form-item>
                <el-cascader
                  ref="crmCascader"
                  v-model="crmArr"
                  class="cascader"
                  placeholder="请选择商务"
                  :options="((normalFormItemMap || {}).crmGroup || {}).data"
                  :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'orgName', children: 'childOrgName' }"
                  filterable
                  collapse-tags
                  clearable
                  :show-all-levels="false"
                  @change="(val) => onSearchChange(val, 'crm')"
                />
              </el-form-item>

              <el-form-item>
                <el-cascader
                  ref="executeCascader"
                  v-model="executeArr"
                  class="cascader"
                  placeholder="请选择执行人"
                  :options="((normalFormItemMap || {}).executeGroup || {}).data"
                  :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'orgName', children: 'childOrgName' }"
                  filterable
                  collapse-tags
                  clearable
                  :show-all-levels="false"
                  @change="(val) => onSearchChange(val, 'executed')"
                />
              </el-form-item>
            </div>
          </div>
          <div class="search-wrapper slot-search">
            <span>商单筛选</span>
            <div>
              <el-form-item>
                <Select v-model="target.model.companyId" :config="(normalFormItemMap || {}).companyTags || {}" />
              </el-form-item>

              <el-form-item>
                <Select v-model="target.model.brandId" :config="(normalFormItemMap || {}).brandTags || {}" />
              </el-form-item>

              <!-- <el-form-item>
                <Select v-model="target.model.customId" :config="(normalFormItemMap || {}).customerNameAndIdBOList || {}" />
              </el-form-item> -->

              <el-form-item>
                <el-cascader
                  ref="cascader"
                  v-model="target.model.fieldId"
                  class="cascader"
                  placeholder="请选择行业类别"
                  :options="((normalFormItemMap || {}).industryTypeTags || {}).data"
                  :props="{ checkStrictly: true, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' }"
                  collapse-tags
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <el-autocomplete
                  v-model="target.model.production"
                  :fetch-suggestions="productSearch"
                  placeholder="请输入合作产品"
                  value-key="producationName"
                  clearable
                />
              </el-form-item>

              <el-form-item>
                <Select v-model="target.model.accountBelong" :config="(normalFormItemMap || {}).organizationConditionInfoVOList || {}" />
              </el-form-item>

              <el-form-item>
                <Select v-model="target.model.isMoney" :config="(normalFormItemMap || {}).isMoney || {}" />
              </el-form-item>

              <el-form-item v-if="type === 'allInvoice'">
                <Select v-model="target.model.checkAccountsFlag" :config="(normalFormItemMap || {}).checkAccountsFlag || {}" />
              </el-form-item>

              <el-form-item>
                <el-input v-model="target.model.quotientId" placeholder="请输入商单号" clearable />
              </el-form-item>

              <el-form-item>
                <Select v-model="target.model.quotientType" :config="(normalFormItemMap || {}).quotientType || {}" />
              </el-form-item>

            </div>
          </div>
          <!-- <el-form-item label="销售收入">
            <el-input
              v-model="target.model.workMoneyStart"
              type="number"
              placeholder="销售收入最小值"
              min="0"
            />
            <span data-t> 至 </span>
            <el-input
              v-model="target.model.workMoneyEnd"
              type="number"
              placeholder="销售收入最大值"
              min="0"
            />
          </el-form-item> -->
          <div class="search-wrapper slot-search">
            <span>时间筛选</span>
            <div>
              <el-form-item label="成单时间">
                <el-date-picker
                  v-model="target.model.dateArr"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
              <el-form-item label="收款时间">
                <el-date-picker
                  v-model="target.model.dateMoneyArr"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
              </el-form-item>
            </div>
          </div>

        </template>
        <template v-slot:btns="target">
          <el-button type="primary" plain @click="handleSearchReset(target)">重置</el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="table-btn-view m-b-16">
        <el-button v-if="$permission('bill_manage_add') && type === 'allInvoice'" v-log type="primary" @click="handleAdd">添加商单</el-button>
        <el-button v-if="type === 'waitCheckInvoice'" v-log type="primary" @click="handleShowAudit">审核通过</el-button>
      </div>
      <el-table
        ref="client"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        style="width: 100%"
        :row-key="getRowKey"
        @sort-change="doSort"
        @selection-change="handleSelectChange"
      >
        <el-table-column
          v-if="type === 'waitCheckInvoice'"
          type="selection"
          :reserve-selection="true"
          width="55"
        />
        <el-table-column label="商单号" prop="quotientId" />

        <el-table-column label="商单状态">
          <template slot-scope="{ row }">
            {{ row.checkAccountsFlag !== null ? ['未核账', '已核账', '待核账'][row.checkAccountsFlag || 0] : '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="工单"
        >
          <template slot-scope="{ row }">
            <el-button
              v-if="row.workFlag || row.specialWorkFlag"
              class="m-l-0"
              type="text batchEntry"
              @click="handleGoBatchEntry(row)"
            >
              批量录单
            </el-button>
            <br>
            <el-button
              v-if="row.workFlag"
              class="m-l-0"
              type="text"
              @click="handleGoOrder(row, 'order')"
            >视频工单</el-button>
            <br>
            <el-button
              v-if="row.specialWorkFlag"
              class="m-l-0"
              type="text"
              @click="handleGoOrder(row, 'specialOrder')"
            >特殊工单</el-button>
          </template>
        </el-table-column> -->
        <el-table-column prop="companyName" label="客户名称" />
        <el-table-column prop="brandName" label="合作产品-品牌">
          <template slot-scope="{ row }">
            {{ [row.quotientName, row.brandName].filter(item => item).join('-') || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="fieldName" label="行业类型" />
        <!-- <el-table-column prop="customerName" label="客户联系人" /> -->
        <el-table-column prop="crmGroupName" label="商务信息" width="150">
          <template slot-scope="{ row }">
            {{ [row.crmName, row.crmTeamName, row.crmGroupName].filter(item => item).join('-') || '--' }}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="quotientName" label="合作产品" /> -->
        <el-table-column prop="productTime" label="成单日期" width="170" />
        <el-table-column label="商单类型">
          <template slot-scope="{row}">
            {{ (quotientTypeList.find(item => +item.extValue === +row.quotientType) || {}).configName }}
          </template>
        </el-table-column>
        <el-table-column width="200" prop="accountBelong" label="合作账户及归属">
          <template slot-scope="{row}">
            <OverPopover :width="400" :content="row.accountBelong" />
          </template>
        </el-table-column>
        <el-table-column width="200" prop="executeMsg" label="执行信息">
          <template slot-scope="{row}">
            <div>{{ row.executeName }}-{{ row.executeGroup }}</div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" prop="workMoney" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              width="300"
              content="销售收入：项目合作金额（含线下补款、折扣金额、线下返点）。"
              label="销售收入"
            />
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="返点金额" />
        <!-- <el-table-column
          sortable="custom"
          :sort-orders="['descending', 'ascending', null]"
          prop="costMoney"
          label="销售成本"
        >
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              width="300"
              content="销售成本：对公返点+对私返点+折扣金额+抖＋成本+平台手续费+其他成本。"
              label="销售成本"
            />
          </template>
        </el-table-column> -->

        <el-table-column sortable="custom" prop="executeMoneyQuotient" label="执行金额" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="商单执行金额=各工单执行金额之和，工单执行金额=工单销售收入-工单销售成本（不含达人分成成本），销售成本指手续费、抖+等其他费用"
              label="执行金额"
            />
          </template>
        </el-table-column>

        <el-table-column prop="performanceMoney" label="绩效营收" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="商单绩效营收=各工单绩效营收之和（不含撤单的工单）"
              label="绩效营收"
            />
          </template>
        </el-table-column>

        <el-table-column prop="grossProfitMargin" label="毛利率" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="商单毛利率=全部工单的“绩效营收”之和/全部工单的“销售收入”，不含撤单状态的工单"
              label="毛利率"
            />
          </template>
        </el-table-column>

        <el-table-column label="工单收入之和" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="包含视频工单和特殊工单"
              label="工单收入之和"
            />
          </template>
          <template slot-scope="{ row }">
            <p>{{ row.workMoneyAll }}</p>
            <p>（进度：{{ row.workMoneyAllRate }}%）</p>
          </template>
        </el-table-column>

        <el-table-column label="工单返点之和" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="包含视频工单和特殊工单"
              label="工单返点之和"
            />
          </template>
          <template slot-scope="{ row }">
            <p>{{ row.workOrderDiscountAll }}</p>
            <p>（进度：{{ row.discountAllRate }}%）</p>
          </template>
        </el-table-column>

        <el-table-column label="工单履约进度" width="130">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="工单履约进度=（已履约视频工单数+已完成特殊工单数）÷（总视频工单数+总特殊工单数）"
              label="工单履约进度"
            />
          </template>
          <template slot-scope="{ row }">
            <p>{{ row.honorAgreementRate }}%</p>
          </template>
        </el-table-column>
        <!-- <el-table-column sortable="custom" prop="outMoney" label="达人分成成本">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="达人分成成本:（销售收入-销售成本）*达人分成比例"
              label="达人分成成本"
            />
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="executeName" label="执行人" /> -->
        <!-- <el-table-column prop="belongTeamName" label="绩效归属团队" /> -->
        <el-table-column label="是否到款">
          <template slot-scope="scope">{{ scope.row.isMoney === 1 ? '是' : '否' }}</template>
        </el-table-column>

        <el-table-column prop="getMoneyDate" label="到款日期" width="170">
          <template slot-scope="{ row }">{{ row.getMoneyDate || '--' }}</template>
        </el-table-column>

        <el-table-column label="收款截图">
          <template slot-scope="{ row }">
            <!-- <UploadImg v-if="row.transferredScreenshotUrl" :value="row.transferredScreenshotUrl.split(',')" :limit="3" disabled /> -->
            <div v-if="row.transferredScreenshotUrl" class="screenShot">
              <div v-for="item in row.transferredScreenshotUrl.split(',')" :key="item">
                <img :src="item" @click="handlePreview(item)">
              </div>
            </div>
            <div v-else>--</div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" :min-width="$permission(['bill_manage_view', 'bill_manage_edit', 'bill_manage_del', 'bill_manage_video_del']) ? 230 : 120">
          <template slot-scope="scope">
            <div class="flex flex-justify-center">
              <div class="m-r-10">
                <el-button
                  v-if="scope.row.workFlag || scope.row.specialWorkFlag"
                  class="m-l-0"
                  type="text batchEntry"
                  @click="handleGoBatchEntry(scope.row)"
                >
                  批量录单
                </el-button>
                <br v-if="scope.row.workFlag || scope.row.specialWorkFlag">
                <el-button
                  v-if="scope.row.workFlag"
                  class="m-l-0"
                  type="text"
                  @click="handleGoOrder(scope.row, 'order')"
                >视频工单</el-button>
                <br v-if="scope.row.workFlag">
                <el-button
                  v-if="scope.row.specialWorkFlag"
                  class="m-l-0"
                  type="text"
                  @click="handleGoOrder(scope.row, 'specialOrder')"
                >特殊工单</el-button>
                <br v-if="scope.row.specialWorkFlag">
                <!-- 有商机的才有详情 -->
                <el-button
                  v-if="scope.row.opportunityId"
                  class="m-l-0 warning"
                  type="text"
                  @click="handleGoOpportunity(scope.row)"
                >
                  商机详情
                </el-button>
                <br v-if="scope.row.opportunityId">
                <el-button
                  v-if="type === 'waitCheckInvoice'"
                  class="m-l-0 error"
                  type="text"
                  @click="handleAudit([scope.row.quotientId])"
                >
                  审核通过
                </el-button>
              </div>
              <template v-if="$permission(['bill_manage_view', 'bill_manage_edit', 'bill_manage_del', 'bill_manage_video_del'])">
                <IconTip
                  v-if="$permission('bill_manage_view')"
                  v-log="{ quotientId: scope.row.quotientId }"
                  content="查看"
                  class="m-r-10"
                  icon-class="iconxiangqing"
                  @click="handleShow(scope.row)"
                />
                <IconTip
                  v-if="$permission('bill_manage_edit') && scope.row.editAuth"
                  v-log="{ quotientId: scope.row.quotientId }"
                  content="编辑"
                  class="m-r-10"
                  icon-class="iconbianji"
                  @click="handleShow(scope.row, false)"
                />
                <IconTip
                  v-if="$permission('bill_manage_del') && scope.row.editAuth"
                  v-log="{ quotientId: scope.row.quotientId }"
                  content="删除"
                  class="m-r-10"
                  icon-class="iconshanchu"
                  @click="handleDel(scope.row)"
                />
                <IconTip
                  v-if="scope.row.isVideo && $permission('bill_manage_video_del')"
                  v-log="{ quotientId: scope.row.quotientId }"
                  content="视频详情"
                  class="m-r-10"
                  icon-class="iconshipinjiankong"
                  @click="toBillVideo(scope.row)"
                />
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
    <Dialog
      v-if="addVisible"
      :type="dialogType"
      :opp-id="oppId"
      :add-visible.sync="addVisible"
      :is-only-show="isOnlyShow"
      :normal-form-item-map="normalFormItemMap"
      :quotient-id="quotientId"
      :options-data="optionsData"
      @getList="getList"
    />

    <el-dialog classs="auditDialogResult" title="审核结果" :visible.sync="showAuditDialog" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
      <p class="auditDialogResultItem">审核通过：<span class="success">{{ auditMessage.examinePassNum }}</span></p>
      <p class="auditDialogResultItem">审核不通过：<span class="error">{{ auditMessage.examineNoPassNum }}</span></p>
      <p v-if="auditMessage.examineNoPassReason" class="auditDialogResultItem">审核不通过原因：<span>{{ auditMessage.examineNoPassReason }}</span></p>
      <p v-if="(auditMessage.examineNoPassQuotientIdList || []).length" class="auditDialogResultItem">审核不通过的商单：<span>{{ auditMessage.examineNoPassQuotientIdList.join(', ') }}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleConfirmAuditResult">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="预览" :visible.sync="previewDialog">
      <img width="100%" :src="previewUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import VSearch from '@/components/Search'
import { Statistics, IconTip, OverPopover, Select } from 'components'
import Dialog from './dialog'
import { copy } from '@/components/common'
import tableMixin from '@/mixins/table'
import {
  $getBusinessOrderList,
  $deleteQuotientInfo,
  $getQueryCondition,
  $getWorkCount,
  $checkOpportunityDeleted,
  $businessOrderBatchAudit,
  $getNewIndustryTypeTags
} from '@/api/bussiness-manage'
import { $getByConfigCode } from '@/api/index'
import { $getDeskBusinessOrderList } from '@/api/business-desk'
import dayjs from 'dayjs'

// 商单类型
const QUOTIENT_TYPE = [
  {
    val: 1,
    text: '客户自行下单'
  },
  {
    val: 2,
    text: '代客下单'
  }
]

// 公司主体
const COMPANY_TYPE = [
  {
    val: 1,
    text: '乾派'
  },
  {
    val: 2,
    text: '向乾'
  }
]

// 发票状态类型
const RECEIPT_STATUS_TYPE = [
  {
    val: 0,
    text: '未选择'
  },
  {
    val: 1,
    text: '已开发票'
  },
  {
    val: 2,
    text: '未开发票'
  },
  {
    val: 3,
    text: '无需开发票'
  }
]

export default {
  components: {
    VSearch,
    Statistics,
    Dialog,
    IconTip,
    OverPopover,
    Select
  },
  mixins: [tableMixin],
  props: {
    type: {
      type: String,
      default: 'allInvoice'
    }
  },
  data() {
    return {
      formConf: {},
      optionsData: {},
      normalFormItemMap: {},
      searchData: {
        companyId: '',
        brandId: '',
        customId: '',
        production: '',
        accountBelong: '',
        isMoney: '',
        workMoneyStart: '',
        workMoneyEnd: '',
        productTimeStart: '',
        productTimeEnd: '',
        determined: '',
        quotientId: '',
        dateArr: '',
        pageNum: 1
      },
      summaryItems: [
        {
          key: 'total',
          text: '合作产品数量',
          value: 0
        },
        {
          key: 'sumSellIncome',
          // tip: '销售收入：代客下单的商单，则填合同金额；客户自行下单，则填账号刊例',
          text: '销售收入',
          value: 0
        },
        {
          key: 'sumExecuteMoneyQuotient',
          tip: '商单执行金额=各工单执行金额之和，工单执行金额=工单销售收入-工单销售成本（不含达人分成成本），销售成本指手续费、抖+等其他费用',
          text: '执行金额',
          value: 0
        },
        {
          key: 'performanceMoney',
          tip: '绩效营收=列表中全部商单的“绩效营收”之和',
          text: '绩效营收',
          value: 0
        },
        {
          key: 'sumWorkMoney',
          text: '到款金额',
          value: 0
        }
      ],
      quotientId: null,
      addVisible: false, // 编辑 新增弹窗
      isOnlyShow: false,
      quotientTypeList: [],
      QUOTIENT_TYPE, // 商单类型
      COMPANY_TYPE, // 公司主体
      RECEIPT_STATUS_TYPE, // 开票状态
      dialogType: '',
      oppId: '',
      gLoading: false,
      isDeleted: 0,
      selectRows: [],
      previewDialog: false,
      previewUrl: '',
      showAuditDialog: false,
      auditMessage: {},
      crmArr: [],
      executeArr: []
    }
  },
  computed: {
    quotientName() {
      return this.showForm.quotientType
        ? this.QUOTIENT_TYPE.find(
          item => item.val === this.showForm.quotientType
        ).text
        : ''
    },
    companyName() {
      return this.showForm.companyType
        ? this.COMPANY_TYPE.find(
          item => item.val === this.showForm.companyType
        ).text
        : ''
    },
    getInvoiceState(types) {
      return function(types) {
        const invoiceState = RECEIPT_STATUS_TYPE.filter((item) => item.val === types)
        if (invoiceState && invoiceState.length > 0) return invoiceState[0].text
        return '未选择'
      }
    }
  },
  created() {
    this.buildFormConf()
  },
  mounted() {
    const currentMonth = dayjs().format('YYYY-MM')
    const date = currentMonth.split('-')
    const day = new Date(date[0], date[1], 0)
    const timeEnd = date[0] + '-' + date[1] + '-' + day.getDate()
    const timeStart = `${dayjs().year()}-${dayjs().month() + 1}-01`
    this.$set(this.$refs.search.form, 'dateArr', [
      `${timeStart}`,
      `${timeEnd}`
    ])
    this.searchData.dateArr = [`${timeStart + ' 00:00:00'}`, `${timeEnd + ' 23:59:59'}`]
    this.searchData.productTimeStart = timeStart + ' 00:00:00'
    this.searchData.productTimeEnd = timeEnd + ' 23:59:59'

    if (this.type === 'noCheckInvoice') {
      this.$set(this.$refs.search.form, 'checkAccountsFlag', 0)
      this.searchData.checkAccountsFlag = 0
    } else if (this.type === 'waitCheckInvoice') {
      this.$set(this.$refs.search.form, 'checkAccountsFlag', 2)
      this.searchData.checkAccountsFlag = 2
    } else if (this.type === 'checkInvoice') {
      this.$set(this.$refs.search.form, 'checkAccountsFlag', 1)
      this.searchData.checkAccountsFlag = 1
    }

    this.$nextTick(() => {
      this.getList()
      this.getQueryCondition()
      this.getByConfigCode()
    })

    this.$nextTick(async() => {
      const { type, id, oppId } = this.$route.query
      if ((type === 'create' || type === 'edit' || type === 'detail') && (oppId || id)) {
        const { data } = await $checkOpportunityDeleted({ opportunityId: oppId || id })
        this.isDeleted = data
        if (+data === 0) {
          this.gLoading = true
        }
      }
    })

    this.$nextTick(() => {
      const arr = ['对外内容事业群', '商业化事业群', '大运营部']
      const menuList = [...document.getElementsByClassName('el-cascader-menu__list')].slice(0, 2)
      menuList.forEach(item => {
        item.addEventListener('mouseover', (e) => {
          const text = e.target.innerText
          if (arr.indexOf(text) !== -1) {
            e.target.style.cursor = 'not-allowed'
          }
        })
      })
    })
  },
  methods: {
    getRowKey(row) {
      return row.quotientId
    },
    // 获取下拉框数据
    getQueryCondition() {
      $getQueryCondition().then((res) => {
        if (res.code === 1) {
          for (const key in this.normalFormItemMap) {
            this.normalFormItemMap[key].data = res.data[key]
          }
          this.optionsData.executorInfoBOList = res.data.executorInfoBOList || []
          this.optionsData.crmInfo = res.data.crmInfo || []
          this.optionsData.crmTeamList = res.data.crmTeamInfoBOList || []
          this.optionsData.brandTags = this.normalFormItemMap.brandTags

          this.getNewIndustryTypeTags()

          this.$nextTick(async() => {
            const { type, id, oppId } = this.$route.query
            this.gLoading = false
            // 从商机过来创建商单
            if (type === 'create' && id) {
              if (this.isDeleted) return
              this.dialogType = type
              this.oppId = id
              this.showForm = {}
              this.isOnlyShow = false
              this.addVisible = true
              this.quotientId = ''
            }

            // 从商机中查看商单
            if (type === 'detail' && id) {
              if (this.isDeleted) return
              this.dialogType = type
              this.oppId = id
              this.quotientId = id
              this.isOnlyShow = true
              this.addVisible = true
            }

            // 从商机中编辑商单
            if (type === 'edit' && id && oppId) {
              if (this.isDeleted) return
              this.dialogType = type
              this.oppId = oppId
              this.quotientId = id
              this.isOnlyShow = false
              this.addVisible = true
            }
          })
        }
      }).catch(err => {})
    },

    // 获取新的行业类型
    async getNewIndustryTypeTags() {
      const { code, data } = await $getNewIndustryTypeTags()
      if (+code === 1) {
        this.normalFormItemMap.industryTypeTags.data = data
      }
    },

    // 获取下拉框中商单类型
    async getByConfigCode() {
      const { code, data } = await $getByConfigCode({ configCodes: 'business_manager_quotient_type' })
      if (+code === 1) {
        this.normalFormItemMap.quotientType.data = data.business_manager_quotient_type || []
        this.quotientTypeList = data.business_manager_quotient_type || []
      }
    },

    // 创建下拉框
    buildFormConf() {
      const formConf = {
        normal: [
          // {
          //   type: 'select',
          //   key: 'customId',
          //   _key: 'customerNameAndIdBOList',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择客户联系人'
          //   },
          //   optionValKey: 'customerId',
          //   optionLabelKey: 'customerName'
          // },
          // {
          //   type: 'cascader',
          //   key: 'fieldId',
          //   _key: 'industryTypeTags',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择行业类别'
          //   },
          //   props: { checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'newsContent', children: 'child' },
          //   optionValKey: 'id',
          //   optionLabelKey: 'newsContent'
          // },
          // {
          //   type: 'autocomplete',
          //   key: 'production',
          //   _key: 'quotientName',
          //   conf: {
          //     placeholder: '请输入合作产品',
          //     fetchSuggestions: this.productSearch
          //   },
          //   optionValKey: 'producationName',
          //   optionLabelKey: 'producationName'
          // },
          // {
          //   type: 'select',
          //   key: 'accountBelong',
          //   _key: 'organizationConditionInfoVOList',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择账号归属'
          //   },
          //   optionValKey: 'orgName',
          //   optionLabelKey: 'orgName'
          // },
          // {
          //   type: 'select',
          //   key: 'crmGroupId',
          //   _key: 'crmGroupInfoBOList',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择商务团队'
          //   },
          //   optionValKey: 'crmGroupId',
          //   optionLabelKey: 'crmGroupName'
          // },
          // {
          //   type: 'select',
          //   key: 'crmTeamId',
          //   _key: 'crmTeamInfoBOList',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择商务小组'
          //   },
          //   optionValKey: 'crmTeamId',
          //   optionLabelKey: 'crmTeamName'
          // },
          // {
          //   type: 'select',
          //   key: 'crmId',
          //   _key: 'crmInfo',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择商务'
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'name'
          // },
          // 隐藏是为了弹窗内需要用到，便于映射
          {
            type: 'select',
            key: 'executeGroupId',
            _key: 'executeGroupInfoBOList',
            data: [],
            conf: {
              placeholder: '请选择执行人小组',
              hidden: true
            },
            optionValKey: 'executeGroupId',
            optionLabelKey: 'executeGroupName'
          },
          {
            type: 'select',
            key: 'executeId',
            _key: 'executorInfoBOList',
            data: [],
            conf: {
              placeholder: '请选择执行人',
              hidden: true
            },
            optionValKey: 'executeId',
            optionLabelKey: 'executeName'
          }
          // {
          //   type: 'select',
          //   key: 'isMoney',
          //   data: [
          //     {
          //       val: 1,
          //       text: '是'
          //     },
          //     {
          //       val: 0,
          //       text: '否'
          //     }
          //   ],
          //   conf: {
          //     placeholder: '是否到款'
          //   }
          // },
          // {
          //   type: 'select',
          //   key: 'checkAccountsFlag',
          //   data: [
          //     {
          //       val: 0,
          //       text: '未核账'
          //     },
          //     {
          //       val: 1,
          //       text: '已核账'
          //     }
          //   ],
          //   conf: {
          //     placeholder: '商单状态'
          //   }
          // },
          // {
          //   type: 'input',
          //   key: 'quotientId',
          //   conf: {
          //     placeholder: '请输入商单号'
          //   }
          // },
          // {
          //   type: 'select',
          //   key: 'quotientType',
          //   _key: 'quotientType',
          //   data: [],
          //   conf: {
          //     placeholder: '商单类型'
          //   },
          //   optionValKey: 'extValue',
          //   optionLabelKey: 'configName'
          // }
        ],
        // hasExport: this.$permission('bussiness_bill_manage_export')
        hasExport: this.$permission('manager_export')
      }
      if (['/bussiness-manage/my-desk', '/bussiness-manage/my-team-desk'].includes(this.$route.path)) {
        formConf.hasExport = false
      }
      this.formConf = formConf
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        normalFormItemMap[item._key] = item
      })

      normalFormItemMap.crmGroup = {
        type: 'cascader',
        key: 'crmId',
        _key: 'crmGroup',
        data: [],
        conf: {
          placeholder: '请选择商务',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'orgName'
      }

      normalFormItemMap.executeGroup = {
        type: 'cascader',
        key: 'executeId',
        _key: 'executeGroup',
        data: [],
        conf: {
          placeholder: '请选择执行人',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'orgName'
      }

      normalFormItemMap.companyTags = {
        type: 'select',
        key: 'companyId',
        _key: 'companyTags',
        data: [],
        conf: {
          placeholder: '请选择客户名称',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'newsContent'
      }

      normalFormItemMap.brandTags = {
        type: 'select',
        key: 'brandId',
        _key: 'brandTags',
        data: [],
        conf: {
          placeholder: '请选择品牌',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'newsContent'
      }

      normalFormItemMap.customerNameAndIdBOList = {
        type: 'select',
        key: 'customId',
        _key: 'customerNameAndIdBOList',
        data: [],
        conf: {
          placeholder: '请选择客户联系人',
          clearable: true,
          filterable: true
        },
        optionValKey: 'customerId',
        optionLabelKey: 'customerName'
      }

      normalFormItemMap.industryTypeTags = {
        type: 'cascader',
        key: 'fieldId',
        _key: 'industryTypeTags',
        data: [],
        conf: {
          placeholder: '请选择行业类别',
          clearable: true
        },
        props: { checkStrictly: true, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' },
        optionValKey: 'tagId',
        optionLabelKey: 'tagName'
      }

      normalFormItemMap.quotientName = {
        type: 'autocomplete',
        key: 'production',
        _key: 'quotientName',
        conf: {
          placeholder: '请输入合作产品',
          fetchSuggestions: this.productSearch
        },
        optionValKey: 'producationName',
        optionLabelKey: 'producationName'
      }

      normalFormItemMap.organizationConditionInfoVOList = {
        type: 'select',
        key: 'accountBelong',
        _key: 'organizationConditionInfoVOList',
        data: [],
        conf: {
          placeholder: '请选择账号归属',
          clearable: true
        },
        optionValKey: 'orgName',
        optionLabelKey: 'orgName'
      }

      normalFormItemMap.isMoney = {
        type: 'select',
        key: 'isMoney',
        data: [
          {
            val: 1,
            text: '是'
          },
          {
            val: 0,
            text: '否'
          }
        ],
        conf: {
          placeholder: '是否到款',
          clearable: true
        }
      }

      normalFormItemMap.checkAccountsFlag = {
        type: 'select',
        key: 'checkAccountsFlag',
        data: [
          {
            val: 0,
            text: '未核账'
          },
          {
            val: 2,
            text: '待核账'
          },
          {
            val: 1,
            text: '已核账'
          }
        ],
        conf: {
          placeholder: '商单状态',
          clearable: true
        }
      }

      normalFormItemMap.quotientId = {
        type: 'input',
        key: 'quotientId',
        conf: {
          placeholder: '请输入商单号',
          clearable: true
        }
      }

      normalFormItemMap.quotientType = {
        type: 'select',
        key: 'quotientType',
        _key: 'quotientType',
        data: [],
        conf: {
          placeholder: '商单类型',
          clearable: true
        },
        optionValKey: 'extValue',
        optionLabelKey: 'configName'
      }
      this.normalFormItemMap = normalFormItemMap
    },
    // 获取列表
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      // console.log('--------productTimeStart', data)

      if (data.dateArr) {
        data.productTimeStart = data.dateArr[0]
        data.productTimeEnd = data.dateArr[1]
        delete data.dateArr
      } else {
        delete data.productTimeStart
        delete data.productTimeEnd
        delete data.dateArr
      }

      if (data.dateMoneyArr) {
        data.getMoneyDateStart = data.dateMoneyArr[0]
        data.getMoneyDateEnd = data.dateMoneyArr[1]
        delete data.dateMoneyArr
      } else {
        delete data.getMoneyDateStart
        delete data.getMoneyDateEnd
        delete data.dateMoneyArr
      }
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        data.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskBusinessOrderList : $getBusinessOrderList
      $api(data).then((res) => {
        if (res.code === 1) {
          this.summaryItems = this.summaryItems.map((item) => {
            item.val = res.data.statisticsQuotientDataBO[item.key] || 0
            return item
          })
          this.tableData = res.data.businessOrdersVOList
          // console.log(this.tableData, 'tableData')
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        this.loading = false
      })
    },
    // 搜索查询
    onSubmit(data) {
      data = copy(data)
      if (data && data.fieldId && data.fieldId.length && Array.isArray(data.fieldId)) {
        data.fieldId = data.fieldId[data.fieldId.length - 1]
      }

      this.searchData = Object.assign(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    onSearchChange(val, type) {
      const len = val.length
      let nodesInfo = {}
      if (type === 'crm') {
        if (!len) {
          this.searchData.crmGroupId = ''
          this.searchData.crmTeamId = ''
          this.searchData.crmId = ''
          return
        }
       nodesInfo = this.$refs.crmCascader.panel.getNodeByValue(val)
       if (Object.keys(nodesInfo).length) {
          if (nodesInfo.data.depthLayer > 2) {
            if (nodesInfo.data.depthLayer === 3) {
              this.searchData.crmGroupId = val[len - 1]
              this.searchData.crmTeamId = ''
              this.searchData.crmId = ''
              return
            } else if (nodesInfo.parent.data.depthLayer === 3 && nodesInfo.children.length) {
              this.searchData.crmTeamId = val[len - 1]
              this.searchData.crmGroupId = val[len - 2]
              this.searchData.crmId = ''
              return
            }
          } else if (!nodesInfo.data.depthLayer) {
            if (nodesInfo.parent.data.depthLayer === 3 && !nodesInfo.children.length) {
              this.searchData.crmId = val[len - 1]
              this.searchData.crmGroupId = val[len - 2]
              this.searchData.crmTeamId = ''
              return
            } else {
              this.searchData.crmId = val[len - 1]
              this.searchData.crmTeamId = val[len - 2]
              this.searchData.crmGroupId = val[len - 3]
              return
            }
          } else {
            this.crmArr = []
            this.searchData.crmGroupId = ''
            this.searchData.crmTeamId = ''
            this.searchData.crmId = ''
            return
          }
       }
      } else {
        if (!len) {
          this.searchData.executeGroupId = ''
          this.searchData.executeId = ''
          return
        }
        nodesInfo = this.$refs.executeCascader.panel.getNodeByValue(val)
        if (Object.keys(nodesInfo).length) {
          if (nodesInfo.data.depthLayer > 2) {
            if (nodesInfo.data.depthLayer === 3 || (nodesInfo.parent.data.depthLayer === 3 && nodesInfo.children.length)) {
              this.searchData.executeGroupId = val[len - 1]
              this.searchData.executeId = ''
              return
            }
          } else if (!nodesInfo.data.depthLayer) {
            if (nodesInfo.data.executeGroupId && nodesInfo.parent.data.depthLayer === 3 && !nodesInfo.children.length) {
              this.searchData.executeId = val[len - 1]
              this.searchData.executeGroupId = val[len - 2]
              return
            } else {
              this.searchData.executeId = val[len - 1]
              this.searchData.executeGroupId = nodesInfo.data.executeGroupId ? nodesInfo.data.executeGroupId : ''
              return
            }
          } else {
            this.executeArr = []
            this.searchData.executeId = ''
            this.searchData.executeGroupId = ''
            return
          }
        }
      }

      // 执行人小组
      // if (item.key === 'executeGroupId') {
      //   model.executeId = ''
      //   this.searchData.executeId = ''
      //   if (val) {
      //     this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList.filter(item => (item.executeGroupId === val))
      //   } else {
      //     this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList
      //   }
      //   return
      // }
      // if (item.key === 'crmGroupId') {
      //   model.crmTeamId = ''
      //   model.crmId = ''
      //   if (val) {
      //     this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo.filter(item => (+item.orgId === +val))
      //     this.normalFormItemMap.crmTeamInfoBOList.data = this.optionsData.crmTeamList.filter(item => (+item.crmGroupId === +val))
      //   } else {
      //     this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo
      //     this.normalFormItemMap.crmTeamInfoBOList.data = this.optionsData.crmTeamList
      //   }
      //   return
      // }

      // if (item.key === 'crmTeamId') {
      //   model.crmId = ''
      //   if (val) {
      //     this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo.filter(item => (+item.orgId === +val))
      //   } else {
      //     this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo
      //   }
      //   return
      // }
    },
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.dateArr) {
        params.productTimeStart = params.dateArr[0]
        params.productTimeEnd = params.dateArr[1]
        delete params.dateArr
      } else {
        delete params.productTimeStart
        delete params.productTimeEnd
      }
      if (params.dateMoneyArr) {
        params.getMoneyDateStart = params.dateMoneyArr[0]
        params.getMoneyDateEnd = params.dateMoneyArr[1]
        delete params.dateMoneyArr
      }
      if (params && params.fieldId && params.fieldId.length && Array.isArray(params.fieldId)) {
        params.fieldId = params.fieldId[params.fieldId.length - 1]
      }

      window.location.href = `/api/business/order/downloadBusinessOrderList?${qs.stringify(params)}&componentId=${this.$componentId}`
    },
    // 添加
    handleAdd() {
      this.dialogType = ''
      this.oppId = ''
      this.showForm = {}
      this.isOnlyShow = false
      this.addVisible = true
      this.quotientId = ''
    },
    // 查看
    handleShow(rowData, isOnlyShow = true) {
      const { quotientId, opportunityId } = rowData

      // 代表该商单是有商机的
      if (quotientId && opportunityId && !isOnlyShow) {
        this.dialogType = 'edit'
      } else {
        this.dialogType = ''
      }

      this.oppId = String(opportunityId)
      this.quotientId = quotientId
      this.isOnlyShow = isOnlyShow
      this.addVisible = true
    },
    // 删除
    async handleDel(rowData) {
      if (rowData.opportunityId) {
        this.$message.warning('该商单存在绑定的商机，不支持直接删除')
        return
      }
      const { companyName, brandName, customerName, quotientId, quotientName } = {
        ...rowData
      }
      const res = await $getWorkCount({
        quotientId
      })
      let tip = `确定删除对接人${customerName}负责的${companyName}${brandName}品牌合作产品${quotientName}的商单`
      if (res.data) {
        tip += `及相关工单吗?`
      } else {
        tip += '吗?'
      }
      this.$confirm(
        tip,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => $deleteQuotientInfo({ quotientId })).then((res) => {
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getList()
          this.$bus.$emit('upLog', { quotientId, operation_module: '删除确定' })
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        console.error(err)
      })
    },

    handleAudit(list) {
      this.$confirm('确定要审核通过？', '', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'cancel') {
            instance.confirmButtonLoading = false
            done()
          } else {
            instance.confirmButtonLoading = true
            $businessOrderBatchAudit({ quotientIdList: list }).then(({ code, data, message }) => {
              instance.confirmButtonLoading = false
              if (+code === 1) {
                this.auditMessage = data
                this.showAuditDialog = true
                done()
              } else {
                this.$message.error(message)
              }
            }).catch((err) => {
              this.$message.error(err || '请重试')
              instance.confirmButtonLoading = false
            })
          }
        }
      }).then(() => {
      })
    },

    handleConfirmAuditResult() {
      this.showAuditDialog = false
      this.selectRows = []
      this.$refs.client.clearSelection()
      this.getList()
    },

    handlePreview(img) {
      this.previewUrl = img
      this.previewDialog = true
    },

    handleShowAudit() {
      if (!this.selectRows.length) {
        this.$message.error('请选勾选要审核的商单')
        return
      }

      this.handleAudit(this.selectRows.map(item => item.quotientId))
    },

    handleSelectChange(selection) {
      this.selectRows = selection
    },

    // 视频详情
    toBillVideo(rowData) {
      this.$router.push({
        path: '/bussiness-manage/bill-video',
        query: {
          quotientId: rowData.quotientId || '',
          companyName: rowData.companyName || '',
          brandName: rowData.brandName || '',
          quotientName: rowData.quotientName || '',
          customerName: rowData.customerName || '',
          _blank: true
        }
      })
    },
    /*
    输入建议，根据输入内容返回对应得建议
    queryString:输入内容
    */
    productSearch(queryString, cb) {
      const productList = this.normalFormItemMap.quotientName.data.map((item) => {
        item.value = item.producationName
        return item
      }) || []
      const list = queryString ? productList.filter(item => item.producationName.includes(queryString)) : productList
      cb(list)
    },
    // 重置
    handleSearchReset(target) {
      target.reset()
      this.searchData.workMoneyStart = ''
      this.searchData.workMoneyEnd = ''
      this.searchData.dateArr = []
      for (const key in this.optionsData) {
        if (this.normalFormItemMap[key]) {
          this.normalFormItemMap[key].data = this.optionsData[key]
        }
      }
    },

    handleGoOrder(row, type) {
      let path = '/bussiness-manage/workorder'
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        path = +deskType === 1 ? '/bussiness-manage/my-team-desk' : '/bussiness-manage/my-desk'
      }
      const routeUrl = this.$router.resolve({
        path,
        query: {
          id: row.quotientId,
          activeName: type,
          tabName: type === 'order' ? '视频工单' : '特殊工单'
        }
      })
      window.open(routeUrl.href, '_blank')
    },

    handleGoBatchEntry(row) {
      const routeUrl = this.$router.resolve({
        path: '/bussiness-manage/batch-entry',
        query: {
          id: row.quotientId
        }
      })
      console.log(routeUrl)
      window.open(routeUrl.href, '_self')
    },

    handleGoOpportunity(row) {
      if (!(row.jumpButtonControl || {}).jumpOpportunity) {
        this.$message.warning('你没有查看该商机的权限')
        return
      }
      let path = '/bussiness-manage/business_opportunity_manage'
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        path = +deskType === 1 ? '/bussiness-manage/my-team-desk' : '/bussiness-manage/my-desk'
        const routeUrl = this.$router.resolve({
        path,
        query: {
          opportunityId: row.opportunityId,
          activeName: 'Opportunities',
          tabName: +deskType === 1 ? '团队商机' : '我的商机'
        }
      })
      window.open(routeUrl.href, '_blank')
      } else {
        const routeUrl = this.$router.resolve({
        path,
        query: {
          opportunityId: row.opportunityId
        }
      })
      window.open(routeUrl.href, '_blank')
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.P-client {
  padding: 24px;
  background: #fff;
  margin: 0 0 24px;
  .el-link {
    margin-right: 10px;
  }
  .el-input {
    width: 230px;
  }
  .pagenation {
    margin-top: 20px;
    text-align: center;
  }
  .modal-form {
    text-align: left;
  }
  .btn-view {
    text-align: right;
    padding: 10px 50px;
  }
  .upload-view {
    .el-upload-dragger {
      width: 200px;
      // height: 200px;
    }
  }
  .modal-form {
    max-height: 600px;
    overflow-y: scroll;
  }
  .table-head {
    background: #f6f8fa;
  }
  .account-show {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;
  }
  .control-view {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    .el-button {
      margin-top: 10px;
    }
  }
  .show-brief-view {
    .file-content {
      display: flex;
      p {
        width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-link {
        margin-left: 10px;
      }
    }
  }
}

.batchEntry {
  color: #67c23a;
}

.flex-justify-center {
  align-items: center;
}

.warning {
  color: #E6A23C;
}

::v-deep {
  .search-view .el-input, .search-view .el-select, .search-view .el-input-number {
    width: 200px;
  }
}

.success {
  color: #67C23A;
}

.error {
  color: #F56C6C;
}

.screenShot {
  img {
    display: block;
    width: 60px;
    height: 100px;
    cursor: pointer;
    object-fit: contain;
  }
}

.auditDialogResultItem {
  margin-bottom: 10px;
}
</style>
