<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:prv="target">
          <department-select v-if="$permission('middleground')" ref="ori" v-model="target.model.orgId" :inline="true" @orgChange="handleOrgChange" />
        </template>
        <template v-slot:normal="target">
          <!-- <div class="slot-form"> -->
          <el-form-item label="商单成单时间">
            <el-date-picker
              v-model="target.model.overDateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="工单绩效月">
            <el-date-picker
              v-model="target.model.monthMoneyNew"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM"
            />
          </el-form-item>

          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="target.model.releaseTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <!-- <el-form-item v-if="showMore">
            <el-select
              v-model="target.model.platId"
              placeholder="全部平台"
              clearable
              filterable
              @change="handleChangePlat"
            >
              <el-option
                v-for="(opt, index) in (
                  (normalFormItemMap || {}).platId || {}
                ).data || []"
                :key="opt.platId + '' + index"
                :label="opt.platName"
                :value="opt.platId"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="showMore" class="m-r">
            <accountSelect
              key="accountId"
              :conf="((normalFormItemMap || {}).accountId || {}).conf"
              :has-account="
                ((normalFormItemMap || {}).accountId || {}).conf.hasAccount
              "
              :inline="true"
              :form="target.model"
              :list="((normalFormItemMap || {}).accountId || {}).data"
              :no-ajax="true"
              :is-account-name="
                ((normalFormItemMap || {}).accountId || {}).conf
                  .isAccountName
              "
            />
          </el-form-item> -->
          <el-form-item v-if="showMore">
            <Select
              v-model="target.model.brandId"
              :config="(normalFormItemMap || {}).brandTags || {}"
            />
          </el-form-item>

          <el-form-item v-if="showMore">
            <el-autocomplete
              v-model="target.model.production"
              class="inline-input"
              :fetch-suggestions="productSearch"
              placeholder="请输入合作产品"
              :trigger-on-focus="true"
              clearable
              filterable
            />
          </el-form-item>

          <el-form-item v-if="$permission('middleground') && showMore">
            <el-input v-model="target.model.quotientId" placeholder="请输入商单号/工单号" />
          </el-form-item>

          <el-form-item v-if="showMore">
            <el-select
              v-model="target.model.crmGroupId"
              placeholder="请选择CRM小组"
              clearable
              filterable
              @change="() => {
                target.model.crmId = ''
                handleChangeCRM()
              }"
            >
              <el-option
                v-for="(opt, index) in (
                  (normalFormItemMap || {}).crmGroupInfoBOList || {}
                ).data || []"
                :key="opt.crmGroupId + '' + index"
                :label="opt.crmGroupName"
                :value="opt.crmGroupId"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="showMore">
            <Select
              v-model="target.model.crmId"
              :config="(normalFormItemMap || {}).crmInfo || {}"
            />
          </el-form-item>

          <el-form-item v-if="showMore">
            <el-select
              v-model="target.model.executeGroupId"
              placeholder="请选择执行小组"
              clearable
              filterable
              @change="() => {
                target.model.executeId = ''
                handleChangeExecute()
              }"
            >
              <el-option
                v-for="(opt, index) in (
                  (normalFormItemMap || {}).executeGroupInfoBOList || {}
                ).data || []"
                :key="opt.executeGroupId + '' + index"
                :label="opt.executeGroupName"
                :value="opt.executeGroupId"
              />
            </el-select>
          </el-form-item>

          <el-form-item v-if="showMore">
            <Select
              v-model="target.model.executeId"
              :config="(normalFormItemMap || {}).executorInfoBOList || {}"
            />
          </el-form-item>

          <el-form-item v-if="showMore" label="执行金额">
            <div class="flex">
              <el-input
                v-model="target.model.executeMoneyStart"
                type="number"
                placeholder="执行金额最小值"
              />
              <span class="m-l-5 m-r-5">至</span>
              <el-input
                v-model="target.model.executeMoneyEnd"
                type="number"
                placeholder="执行金额最大值"
              />
            </div>
          </el-form-item>
          <el-form-item v-if="showMore" label="绩效营收">
            <div class="flex">
              <el-input
                v-model="target.model.performanceMoneyStart"
                type="number"
                placeholder="绩效营收最小值"
              />
              <span class="m-l-5 m-r-5">至</span>
              <el-input
                v-model="target.model.performanceMoneyEnd"
                type="number"
                placeholder="绩效营收最大值"
              />
            </div>
          </el-form-item>

        </template>
        <template v-slot:btns="target">
          <el-button type="primary" plain @click="handleSearchReset(target)">重置</el-button>
          <el-checkbox v-if="showMore" v-model="target.model.shield" class="m-l-10" true-label="1" false-label="0">屏蔽找靓机工单</el-checkbox>
          <el-button :class="['getMoreButton', showMore && 'showMoreButton']" type="text" @click="handleShowMore">更多筛选<span>&lt;</span></el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="m-t-16 table-view">
      <div style="text-align: right;margin: 0 0 20px 0;">
        <!-- <el-button :disabled="!selectedVideos.length" @click="exportVideoInfo">导出视频信息</el-button> -->
        <!-- <el-tooltip
          v-if="$permission('export_plat_id')"
          content="请使用工单管理中导出的表格模板导入数据"
          placement="top"
        >
          <el-upload
            accept=".xls,.xlsx"
            :with-credentials="true"
            :before-upload="beforeUploadAccount"
            :on-success="uploadAccountSuccess"
            :on-error="uploadAccountError"
            action="/api/work/order/excel/uploadWorkerOrderForEdit"
            name="file"
            :show-file-list="false"
            style="display: inline-block"
            :data="{uploadType: 1}"
          >
            <el-button type="primary">导入平台任务ID</el-button>
          </el-upload>
        </el-tooltip>
        <el-tooltip
          content="请使用工单管理中导出的表格模板导入数据"
          placement="top"
          class="m-l-16"
        >
          <el-upload
            accept=".xls,.xlsx"
            :with-credentials="true"
            :before-upload="beforeUploadAccount"
            :on-success="uploadAccountSuccess"
            :on-error="uploadAccountError"
            action="/api/work/order/excel/uploadWorkerOrderForEdit"
            name="file"
            :show-file-list="false"
            style="display: inline-block"
            :data="{uploadType: 0}"
          >
            <el-button type="primary">导入金额</el-button>
          </el-upload>
        </el-tooltip> -->
        <el-button v-if="$permission('import-repair-order')" type="primary" @click="handleRepairOrderData">导入工单数据</el-button>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column prop="workId" sortable="custom" label="工单号" width="90" />
        <el-table-column label="工单状态" width="80">
          <template slot-scope="scope">{{ WORK_ARR[scope.row.workerStatus] }}</template>
        </el-table-column>
        <el-table-column label="工单绩效月" prop="monthMoneyNew" sortable="custom" width="120px">
          <template slot-scope="scope">{{ scope.row.monthMoneyNew |emptyFill }}</template>
        </el-table-column>
        <el-table-column label="账号信息" width="180" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="accountBelong" label="账号归属" width="130" />
        <el-table-column label="合作产品-品牌" width="130" align="left">
          <template slot-scope="{row}">
            <div>{{ row.quotientName }}-{{ row.brandName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="商务信息" width="120" align="left">
          <template slot-scope="{row}">
            <div>{{ row.crmName }}-{{ row.crmGroupName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="executeName" label="执行人" />
        <el-table-column label="商单类型" align="left">
          <template slot-scope="{row}">
            <div>{{ quotientTypeList[row.quotientType] ? quotientTypeList[row.quotientType].configName : '' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="quotientId" sortable="custom" label="商单号" width="160" />
        <el-table-column prop="productTime" sortable="custom" label="商单成单日期" width="130" />
        <!-- <el-table-column label="已定排期" prop="finishTimeConfirm" width="160" /> -->
        <el-table-column label="视频" width="105" align="left">
          <template slot-scope="{row}">
            <VideoList
              :list-data="row.videos"
              :options="{
                coverImg: 'videoCoverUrl',
                title: 'titleName'
              }"
              :show-video-count="1"
              :show-video-img="false"
            >
              <div v-if="row.videos && row.videos.length > 1" slot="more" class="more-video" @click="handleShow(row, 'detail')">更多</div>
            </VideoList>
          </template>
        </el-table-column>
        <el-table-column prop="executeMoney" label="执行金额" sortable="custom" width="126">
          <template slot="header">
            <IconTip
              content="执行金额=销售收入-销售成本"
              label="执行金额"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">
            <span :class="{'tip-red': row.executeMoney < 0}">
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
          <template slot-scope="{row}">
            <span :class="{'tip-red': row.performanceMoney < 0}">
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
    <ImportRepairOrderDialog v-if="showOrderDataDialog" v-model="showOrderDataDialog" @success="getList" />
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
import qs from 'qs'
import { copy } from '@/utils'
import { $getByConfigCode } from '@/api'
import { $getAccountAndPlatInfo, $getWorkerOrderList, $getQueryCondition, $getAccountInfoByOrgIdOrPlatId } from '@/api/bussiness-manage'
import tableMixin from '@/mixins/table'
import EditDialog from './EditDialog'
import NewEditDialog from './NewEditDialog'
import ImportRepairOrderDialog from './ImportRepairOrderDialog'
import departmentSelect from '@/components/DepartmentSelect'
import { Statistics, IconTip, AccountCard, VideoList, Select } from 'components'
// import accountSelect from '@/components/AccountSelect/index.vue'
import Search from '@/components/Search'
import { date } from '@/components/common'
export default {
  components: {
    vSearch: Search,
    Statistics,
    departmentSelect,
    IconTip,
    EditDialog,
    AccountCard,
    VideoList,
    NewEditDialog,
    ImportRepairOrderDialog,
    // accountSelect,
    Select
  },
  mixins: [tableMixin],
  data() {
    return {
      showDialog: false,
      showNewDialog: false,
      workId: null,
      diaLogType: 'detail',
      formConf: {},
      normalFormItemMap: {},
      optionsData: {},
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
        shield: 0
      },
      videoDateArr: [],
      selectedVideos: [],
      quotientTypeList: {},
      summaryItems: [
        {
          key: 'total',
          text: '工单数量',
          val: 0
        },
        {
          key: 'overCount',
          text: '已完成工单数量',
          val: 0
        },
        {
          key: 'workMoney',
          text: '销售收入',
          val: 0
        },
        {
          key: 'sumMoney',
          text: '执行金额',
          val: 0
        },
        {
          key: 'performanceMoney',
          text: '绩效营收',
          value: 0
        }
      ],
      showOrderDataDialog: false,
      WORK_ARR: ['商务信息待录入', '待履约', '已履约', '已核账', '撤单'],
      accountType: 0,
      formInnner: {
        accountId: '',
        platId: '',
        production: '',
        brandId: ''
      },
      showMore: false
    }
  },
  created() {
    this.$nextTick(() => {
      const { id } = this.$route.query
      if (id && this.$permission('middleground')) {
        this.$set(this.$refs.search.form, 'quotientId', id)
        this.searchData.quotientId = id
        this.showMore = true
      }
      // const A_DAY = 864e5
      // const timeInterval = date('Y-m', new Date(Date.now() - A_DAY))
      // this.$set(this.$refs.search.form, 'monthMoneyNew', [`${timeInterval}`, `${timeInterval}`])
      // this.searchData.monthMoneyNew = [`${timeInterval}`, `${timeInterval}`]
      this.$nextTick(() => {
        this.getList()
      })
    })
    this.buildFormConf()
    this.getBConfigByCode()
    this.loadBaseSearchData()
  },
  methods: {
    uploadAccountError(err) {
      this.uploadAccountLoading = false
      this.$message.error(err)
    },
    uploadAccountSuccess(res) {
      // 上传文件成功
      if (res.code === 1) {
        if (res.data.errorCount === 0) {
          this.$message({
            message: '上传全部成功',
            type: 'success'
          })
        } else {
          const cacheKey = res.data.cacheKey
          const tplUrl = `/api/work/order/excel/downloadWorkerOrderErrInfo?type=2&cacheKey=${cacheKey}`
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: `上传失败工单${res.data.errorCount}个 <a target="_blank" href="${tplUrl}" style="color: #1890ff">下载明细</a>`,
            duration: 0,
            type: 'warning'
          })
        }
        this.getList()
        // this.accountTags = unique(this.accountTags.concat(res.data.successAccountList), 'accountId')
      } else {
        this.$message.error(res.message)
      }
      this.uploadAccountLoading = false
    },
    beforeUploadAccount(file) {
      const re = /\.(xls|xlsx)$/.test(file.name)
      if (re) {
        this.uploadAccountLoading = true
      } else {
        this.$message.error('只支持 Excel 文件')
      }
      return re
    },
    /**
     * 表格选择响应函数
     * @param {Array} val 当前选中的数组
     */
    // handleSelectionChange(val) {
    //   this.selectedVideos = val
    // },
    // 导出所选视频的信息
    exportVideoInfo() {
      window.location.href = `/api/work/order/excel/downloadWorkerOrderForEdit?workIdList=${this.selectedVideos.map(t => t.workId).join(',')}&componentId=${this.$componentId}`
    },
    handleOrgChange() {
      this.$refs.search.form.accountId = ''
      this.$refs.search.form.belongName = ''
      this.$refs.search.form.accountName = ''
      this.getAccountInfoByOrgIdOrPlatId()
    },
    getList() {
      this.loading = true
      const data = this.formattData(this.searchData)
      $getWorkerOrderList(data).then(res => {
        if (res.code === 1) {
          this.summaryItems.forEach(item => {
            item.val = res.data[item.key]
          })
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    formattData(data) {
      data = copy(data)
      if (data.overDateArr) {
        data.productTimeBegin = data.overDateArr[0]
        data.productTimeEnd = data.overDateArr[1]
        delete data.overDateArr
      } else {
        delete data.productTimeBegin
        delete data.productTimeEnd
        delete data.overDateArr
      }

      if (data.monthMoneyNew) {
        data.monthMoneyNewStart = data.monthMoneyNew[0]
        data.monthMoneyNewEnd = data.monthMoneyNew[1]
        delete data.monthMoneyNew
      } else {
        delete data.monthMoneyNewStart
        delete data.monthMoneyNewEnd
        delete data.monthMoneyNew
      }

      if (data.releaseTime) {
        data.addTimeStart = data.releaseTime[0]
        data.addTimeEnd = data.releaseTime[1]
        delete data.releaseTime
      } else {
        delete data.addTimeStart
        delete data.addTimeEnd
        delete data.releaseTime
      }

      return data
    },
    buildFormConf() {
      let normal = [
        {
          type: 'select',
          key: 'workerStatus',
          data: [
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
          conf: {
            placeholder: '请选择工单状态',
            multiple: true,
            deCollapseTags: true
          }
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: {
            placeholder: '请选择平台'
          },
          optionValKey: 'platId',
          optionLabelKey: 'platName'
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请选择账号',
            allowCreate: true,
            defaultFirst: true
          },
          optionValKey: 'accountId',
          optionLabelKey: 'accountName'
        }
        // {
        //   type: 'select',
        //   key: 'brandId',
        //   _key: 'brandTags',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择品牌'
        //   },
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
        //   type: 'input',
        //   key: 'quotientId',
        //   conf: {
        //     placeholder: '请输入商单号/工单号'
        //   },
        //   premissionName: 'middleground'
        // },
        // {
        //   type: 'select',
        //   key: 'crmGroupId',
        //   _key: 'crmGroupInfoBOList',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择CRM小组'
        //   },
        //   optionValKey: 'crmGroupId',
        //   optionLabelKey: 'crmGroupName'
        // },
        // {
        //   type: 'select',
        //   key: 'crmId',
        //   _key: 'crmInfo',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择CRM'
        //   },
        //   optionValKey: 'id',
        //   optionLabelKey: 'name'
        // },
        // {
        //   type: 'select',
        //   key: 'executeGroupId',
        //   _key: 'executeGroupInfoBOList',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择执行人小组'
        //   },
        //   optionValKey: 'executeGroupId',
        //   optionLabelKey: 'executeGroupName'
        // },
        // {
        //   type: 'select',
        //   key: 'executeId',
        //   _key: 'executorInfoBOList',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择执行人'
        //   },
        //   optionValKey: 'executeId',
        //   optionLabelKey: 'executeName'
        // }
      ]
      normal = normal.filter(item => (this.$permission(item.premissionName)))
      this.formConf = {
        normal: normal,
        hasExport: this.$permission('work_order_export')
      }
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        item.index = index
        if (Array.isArray(item.data) && item.data.length === 0 || !item.data) {
          normalFormItemMap[item._key || item.key] = item
        }
      })

      // normalFormItemMap.platId = {
      //   type: 'select',
      //   key: 'platId',
      //   data: [],
      //   conf: {
      //     placeholder: '全部平台',
      //     clearable: true,
      //     filterable: true
      //   },
      //   optionLabelKey: 'platName',
      //   optionValKey: 'platId'
      // }

      // normalFormItemMap.accountId = {
      //   type: 'select',
      //   key: 'accountId',
      //   data: [],
      //   conf: {
      //     placeholder: '请选择账号',
      //     isAccountName: false,
      //     hasAccount: false,
      //     clearable: true,
      //     filterable: true
      //   },
      //   optionLabelKey: 'accountName',
      //   optionValKey: 'accountId'
      // }

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

      normalFormItemMap.quotientName = {
        type: 'autocomplete',
        key: 'production',
        _key: 'quotientName',
        conf: {
          placeholder: '请输入合作产品',
          filterable: true,
          fetchSuggestions: this.productSearch
        },
        optionValKey: 'producationName',
        optionLabelKey: 'producationName'
      }

      normalFormItemMap.crmGroupInfoBOList = {
        type: 'select',
        key: 'crmGroupId',
        _key: 'crmGroupInfoBOList',
        data: [],
        conf: {
          placeholder: '请选择CRM小组',
          clearable: true,
          filterable: true
        },
        optionValKey: 'crmGroupId',
        optionLabelKey: 'crmGroupName'
      }

      normalFormItemMap.crmInfo = {
        type: 'select',
        key: 'crmId',
        _key: 'crmInfo',
        data: [],
        conf: {
          placeholder: '请选择CRM',
          clearable: true,
          filterable: true
        },
        optionValKey: 'id',
        optionLabelKey: 'name'
      }

      normalFormItemMap.executeGroupInfoBOList = {
        type: 'select',
        key: 'executeGroupId',
        _key: 'executeGroupInfoBOList',
        data: [],
        conf: {
          placeholder: '请选择执行人小组',
          clearable: true,
          filterable: true
        },
        optionValKey: 'executeGroupId',
        optionLabelKey: 'executeGroupName'
      }

      normalFormItemMap.executorInfoBOList = {
        type: 'select',
        key: 'executeId',
        _key: 'executorInfoBOList',
        data: [],
        conf: {
          placeholder: '请选择执行人',
          clearable: true,
          filterable: true
        },
        optionValKey: 'executeId',
        optionLabelKey: 'executeName'
      }

      this.normalFormItemMap = normalFormItemMap
    },
    loadBaseSearchData() {
      $getQueryCondition().then((res) => {
        if (res.code === 1) {
          for (const key in res.data) {
            if (this.normalFormItemMap[key]) {
              this.normalFormItemMap[key].data = res.data[key]
            }
          }
          this.optionsData.executorInfoBOList = res.data.executorInfoBOList || []
          this.optionsData.crmInfo = res.data.crmInfo || []
        }
      })
      this.getAccountAndPlatInfo()
      this.$nextTick(this.getAccountInfoByOrgIdOrPlatId)
    },
    // 获取平台
    getAccountAndPlatInfo() {
      $getAccountAndPlatInfo().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.mngPlatInfoVOList
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {})
    },
    // 根据平台、组织获取账号
    getAccountInfoByOrgIdOrPlatId(platId = '') {
      $getAccountInfoByOrgIdOrPlatId({
        orgId: this.$refs.search.form.orgId,
        platId
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {})
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
    // 获取商单类型、合作类型
    getBConfigByCode() {
      const configCodes = ['business_manager_quotient_type']
      $getByConfigCode({ configCodes: configCodes.join(',') }).then(res => {
        if (res.code === 1) {
          this.quotientTypeList = res.data.business_manager_quotient_type.reduce((t, n) => {
            console.log(t)
            t[n.extValue] = n
            return t
          }, {})
        } else {
          // this.$message.error()
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
      })
    },
    /*
    输入建议，根据输入内容返回对应得建议
    queryString:输入内容
    */
    productSearch(queryString, cb) {
      const productList =
        this.normalFormItemMap.quotientName?.data.map(item => {
          item.value = item.text = item.producationName
          return item
        }) || []
      const list = queryString
        ? productList.filter(item => item.text.includes(queryString))
        : productList
      cb(list)
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
      if (item.key === 'platId') {
        model.accountId = ''
        this.getAccountInfoByOrgIdOrPlatId(val)
        return
      }
    },
    onExport(data) {
      data = copy(data)
      if ((data.workerStatus || []).length) {
        data.workerStatus = (data.workerStatus || []).join(',')
      }
      const parms = this.formattData(Object.assign({}, this.searchData, data))
      location.href = `/api/work/order/downloadWorkerOrderList?${qs.stringify(parms)}&componentId=${this.$componentId}`
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      data = copy(data)
      if ((data.workerStatus || []).length) {
        data.workerStatus = (data.workerStatus || []).join(',')
      }
      data.pageNum = 1
      Object.assign(this.searchData, data)
      this.getList()
    },
    handleSearchReset(target) {
      for (const key in this.optionsData) {
        if (this.normalFormItemMap[key]) {
          this.normalFormItemMap[key].data = this.optionsData[key]
        }
      }
      target.reset()
      this.$refs.ori.reset()
    },

    handleRepairOrderData() {
      this.showOrderDataDialog = true
    },

    handleChangePlat(val) {
      this.getAccountInfoByOrgIdOrPlatId(val)
    },

    handleChangeCRM(val) {
      if (val) {
        this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo.filter(item => (item.orgId === val))
      } else {
        this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo
      }
    },

    handleChangeExecute(val) {
      if (val) {
        this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList.filter(item => (item.executeGroupId === val))
      } else {
        this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList
      }
    },

    handleShowMore() {
      this.showMore = !this.showMore
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
      transition: all .2s;
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
</style>
