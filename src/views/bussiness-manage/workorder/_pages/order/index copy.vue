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
          <el-form-item label="执行金额">
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
          <el-form-item label="绩效营收">
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
          <!-- </div> -->
        </template>
        <template v-slot:btns="target">
          <el-button type="primary" plain @click="handleSearchReset(target)">重置</el-button>
          <el-checkbox v-model="target.model.shield" class="m-l-10" true-label="1" false-label="0">屏蔽找靓机工单</el-checkbox>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="m-t-16 table-view">
      <div style="text-align: right;margin: 0 0 20px 0;">
        <!-- <el-button :disabled="!selectedVideos.length" @click="exportVideoInfo">导出视频信息</el-button> -->
        <el-tooltip
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
        </el-tooltip>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="工单状态">
          <template slot-scope="scope">{{ scope.row.isOver === 1 ? '已完成' : '未完成' }}</template>
        </el-table-column>
        <el-table-column prop="quotientId" sortable="custom" label="商单号" width="200" />
        <el-table-column prop="quotientType" label="商单类型" width="120">
          <template slot-scope="{ row }">
            {{ quotientTypeList[row.quotientType] ? quotientTypeList[row.quotientType].configName : '' }}
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
              <IconTip
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

    <EditDialog
      v-if="showDialog"
      v-model="showDialog"
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
import departmentSelect from '@/components/DepartmentSelect'
import { Statistics, IconTip } from 'components'
import Search from '@/components/Search'

export default {
  components: {
    vSearch: Search,
    Statistics,
    departmentSelect,
    IconTip,
    EditDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      showDialog: false,
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
      ]
    }
  },
  created() {
    this.getList()
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
      const data = copy(this.searchData)
      if (data.overDateArr) {
        data.productTimeBegin = data.overDateArr[0]
        data.productTimeEnd = data.overDateArr[1]
        delete data.overDateArr
      }
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
    buildFormConf() {
      let normal = [
        {
          type: 'select',
          key: 'isOver',
          data: [
            {
              text: '已完成',
              val: 1
            },
            {
              text: '未完成',
              val: 0
            }
          ],
          conf: {
            placeholder: '请选择工单状态'
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
        },
        {
          type: 'select',
          key: 'brandId',
          _key: 'brandTags',
          data: [],
          conf: {
            placeholder: '请选择品牌'
          },
          optionValKey: 'id',
          optionLabelKey: 'newsContent'
        },
        {
          type: 'autocomplete',
          key: 'production',
          _key: 'quotientName',
          conf: {
            placeholder: '请输入合作产品',
            fetchSuggestions: this.productSearch
          },
          optionValKey: 'producationName',
          optionLabelKey: 'producationName'
        },
        {
          type: 'input',
          key: 'quotientId',
          conf: {
            placeholder: '请输入商单号'
          },
          premissionName: 'middleground'
        },
        {
          type: 'select',
          key: 'crmGroupId',
          _key: 'crmGroupInfoBOList',
          data: [],
          conf: {
            placeholder: '请选择商务小组'
          },
          optionValKey: 'crmGroupId',
          optionLabelKey: 'crmGroupName'
        },
        {
          type: 'select',
          key: 'crmId',
          _key: 'crmInfo',
          data: [],
          conf: {
            placeholder: '请选择商务'
          },
          optionValKey: 'id',
          optionLabelKey: 'name'
        },
        {
          type: 'select',
          key: 'executeGroupId',
          _key: 'executeGroupInfoBOList',
          data: [],
          conf: {
            placeholder: '请选择执行人小组'
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
            placeholder: '请选择执行人'
          },
          optionValKey: 'executeId',
          optionLabelKey: 'executeName'
        }
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
      const { workId } = rowData
      this.workId = workId
      this.showDialog = true
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
      if (item.key === 'executeGroupId') {
        // 执行人小组
        if (val) {
          this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList.filter(item => (item.executeGroupId === val))
        } else {
          this.normalFormItemMap.executorInfoBOList.data = this.optionsData.executorInfoBOList
        }
        return
      }
      if (item.key === 'crmGroupId') {
        model.crmId = ''
        if (val) {
          this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo.filter(item => (item.orgId === val))
        } else {
          this.normalFormItemMap.crmInfo.data = this.optionsData.crmInfo
        }
        return
      }
    },
    onExport(data) {
      const parms = Object.assign({}, this.searchData, data)
      if (parms.overDateArr) {
        parms.productTimeBegin = parms.overDateArr[0]
        parms.productTimeEnd = parms.overDateArr[1]
        delete parms.overDateArr
      }
      location.href = `/api/work/order/downloadWorkerOrderList?${qs.stringify(parms)}&componentId=${this.$componentId}`
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      data = copy(data)
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
</style>
