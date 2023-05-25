<template>
  <div>
    <Wrap class="search-wrapper">
      <span>团队筛选</span>
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:prv="target">
          <department-select
            v-if="$permission('middleground')"
            ref="org"
            v-model="searchData.orgId"
            :inline="true"
            :show-group="false"
            @orgChange="handleOrgChange($event, target.model)"
          />
        </template>
        <template v-slot:normal="target">
          <!-- <br> -->
          <div class="search-wrapper slot-search">
            <span>订单筛选</span>
            <div>
              <el-form-item>
                <Select
                  v-model="target.model.brandId"
                  :config="(normalFormItemMap || {}).brandTags || {}"
                />
              </el-form-item>
              <el-form-item>
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
              <el-form-item>
                <Select
                  v-model="target.model.isOver"
                  :config="(normalFormItemMap || {}).isOver || {}"
                />
              </el-form-item>
              <el-form-item v-if="$permission('middleground')">
                <el-input
                  v-model="target.model.quotientId"
                  placeholder="请输入商单号/工单号"
                />
              </el-form-item>
            </div>
          </div>
          <div class="search-wrapper slot-search">
            <span>时间筛选</span>
            <div>
              <el-form-item label="履约完成时间">
                <el-date-picker
                  v-model="target.model.dateArr"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                />
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
            </div>
          </div>
        </template>
        <template v-slot:btns="target">
          <el-button
            type="primary"
            plain
            @click="handleSearchReset(target)"
          >重置</el-button>
          <el-checkbox
            v-model="target.model.shield"
            class="m-l-10"
            true-label="1"
            false-label="0"
          >屏蔽找靓机工单</el-checkbox>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap class="m-t-16 table-view">
      <el-table
        ref="client"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="doSort"
      >
        <el-table-column label="工单状态">
          <template slot-scope="scope">{{
            scope.row.isOver === 1 ? '已完成' : '未完成'
          }}</template>
        </el-table-column>
        <el-table-column
          prop="quotientId"
          sortable="custom"
          label="商单号"
          width="200"
        />
        <el-table-column prop="specialWorkId" label="工单号" width="70" />
        <el-table-column prop="quotientType" label="商单类型" width="120">
          <template slot-scope="{ row }">
            {{
              quotientTypeList[row.quotientType]
                ? quotientTypeList[row.quotientType].configName
                : ''
            }}
          </template>
        </el-table-column>
        <el-table-column prop="productTime" sortable="custom" label="商单成单日期" width="170" />
        <el-table-column label="工单绩效月" prop="monthMoneyNew" sortable="custom" width="120px">
          <template slot-scope="scope">{{ scope.row.monthMoneyNew |emptyFill }}</template>
        </el-table-column>
        <el-table-column prop="businessGroupName" label="团队" />
        <el-table-column label="创作者" prop="businessUserName" width="90px">
          <template slot-scope="scope">{{
            scope.row.businessUserName | emptyFill
          }}</template>
        </el-table-column>
        <el-table-column prop="brandName" label="品牌" />
        <el-table-column prop="quotientName" label="合作产品" />
        <el-table-column
          label="履约完成时间"
          prop="monthMoneyNew"
          sortable="custom"
          width="140px"
        >
          <template slot-scope="scope">{{
            scope.row.finishTime | emptyFill
          }}</template>
        </el-table-column>
        <el-table-column
          prop="executeMoney"
          label="执行金额"
          sortable="custom"
          width="130"
        >
          <template slot="header">
            <IconTip
              content="执行金额=销售收入-销售成本"
              label="执行金额"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <el-table-column prop="performanceMoney" label="绩效营收">
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
                @click="handleShow(scope.row)"
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
      :special-work-id="specialWorkId"
      :dia-log-type="diaLogType"
      @success="getList"
    />
  </div>
</template>
<script>
import qs from 'qs'
import {
  $getSpecialWorkerOrderList,
  $getTeamAndMember,
  $getQueryCondition,
  $getCooperationMember
} from '@/api/bussiness-manage'
import { $getByConfigCode } from '@/api/index'
import Search from '@/components/Search'
import departmentSelect from '@/components/DepartmentSelect'
import { Statistics, IconTip, Select } from 'components'
import { copy } from '@/components/common'
import tableMixin from '@/mixins/table'
import EditDialog from './EditDialog'
import { $getDeskSpecialWorkerOrderList } from '@/api/business-desk'
export default {
  components: {
    vSearch: Search,
    Statistics,
    IconTip,
    departmentSelect,
    EditDialog,
    Select
  },
  mixins: [tableMixin],
  data() {
    return {
      showDialog: false,
      diaLogType: 'detail',
      requestLoading: false,
      specialWorkId: '',
      formConf: {},
      normalFormItemMap: {},
      optionsData: {},
      searchData: {
        isOver: '',
        businessGroup: '',
        businessUser: '',
        brandId: '',
        production: '',
        quotientId: '',
        pageNum: 1,
        dateArr: [],
        overDateArr: [],
        determined: '',
        shield: 0
      },
      tableData: [],
      total: 0,
      summaryItems: [
        {
          key: 'total',
          text: '工单数量',
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
          val: 0
        },
        {
          key: 'workMoney',
          text: '销售收入',
          val: 0
        }
      ],
      quotientTypeList: {}
    }
  },
  watch: {},
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
    this.loadBaseSearchData()
    this.getBConfigByCode() // 获取商单类型
    this.getCooperationMember() // 获取合作人员
  },
  methods: {
    handleShow(rowData, diaLogType = 'detail') {
      this.specialWorkId = rowData.specialWorkId
      this.showDialog = true
      this.diaLogType = diaLogType
    },
    // 获取合作人员
    getCooperationMember(orgId) {
      $getCooperationMember({ orgId: orgId }).then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.businessUser.data = res.data
        }
      })
    },
    getBConfigByCode() {
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
            // this.workCooperationType = res.data.business_manager_special_work_cooperation_type || []
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
    buildFormConf() {
      const isOver = [
        {
          text: '未完成',
          val: 0
        },
        {
          text: '已完成',
          val: 1
        }
      ]

      let normal = [
        {
          type: 'select',
          key: 'businessUser',
          data: [],
          conf: {
            placeholder: '请选择创作者'
          },
          optionValKey: 'id',
          optionLabelKey: 'name'
        }
        // {
        //   type: 'select',
        //   key: 'brandId',
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
        //   conf: {
        //     placeholder: '请输入合作产品',
        //     fetchSuggestions: this.productSearch
        //   }
        // },
        // {
        //   type: 'input',
        //   key: 'quotientId',
        //   conf: {
        //     placeholder: '请输入商单号/工单号'
        //   },
        //   premissionName: 'middleground'
        // }
      ]

      normal = normal.filter((item) => this.$permission(item.premissionName))
      this.formConf = {
        normal: normal,
        // hasExport: this.$permission('work_order_export')
        hasExport: this.$permission('manager_export')
      }
      if (['/bussiness-manage/my-desk', '/bussiness-manage/my-team-desk'].includes(this.$route.path)) {
        this.formConf.hasExport = false
      }
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      normalFormItemMap.isOver = {
        type: 'select',
        key: 'isOver',
        data: isOver,
        conf: {
          placeholder: '请选择工单状态',
          clearable: true,
          filterable: true
        },
        optionValKey: 'val',
        optionLabelKey: 'text'
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
      this.normalFormItemMap = normalFormItemMap
    },
    // 载入搜索区域数据
    async loadBaseSearchData() {
      // this.getTeamAndMember()
      this.getQueryCondition()
    },
    // 获取分组及创作者
    getTeamAndMember(orgId) {
      $getTeamAndMember({ orgId }).then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.businessGroup.data =
            res.data.organizationInfoList
          this.normalFormItemMap.businessUser.data =
            res.data.simpleUserInfoVOList
          this._businessUser = res.data.simpleUserInfoVOList
        }
      })
    },
    getQueryCondition() {
      $getQueryCondition().then((res) => {
        this.normalFormItemMap.brandTags.data = res.data.brandTags
        this.quotientName = res.data.quotientName
      })
    },
    handleSelectionChange(selectRows) {},
    /*
    输入建议，根据输入内容返回对应得建议
    queryString:输入内容
    */
    productSearch(queryString, cb) {
      const productList =
        this.quotientName.map((item) => {
          item.value = item.text = item.producationName
          return item
        }) || []
      const list = queryString
        ? productList.filter((item) => item.text.includes(queryString))
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
      if (item.key === 'businessGroup') {
        // console.log(this._businessUser.filter(item => (item.did == val)))
        model.businessUser = ''
        this.normalFormItemMap.businessUser.data = []
        if (val) {
          this.normalFormItemMap.businessUser.data = this._businessUser.filter(
            (item) => item.dId === val
          )
        } else {
          this.normalFormItemMap.businessUser.data = [...this._businessUser]
        }
      }
    },
    handleOrgChange(val, model) {
      model.businessUser = ''
      this.normalFormItemMap.businessUser.data = []
      if (val) {
        // this.getTeamAndMember(val)
        this.getCooperationMember(val)
      }
    },
    formattData(data) {
      data = copy(data)
      if (data.dateArr) {
        data.finishTimeStart = data.dateArr[0]
        data.finishTimeEnd = data.dateArr[1]
        delete data.dateArr
      }
      if (data.overDateArr) {
        data.productTimeBegin = data.overDateArr[0]
        data.productTimeEnd = data.overDateArr[1]
        delete data.overDateArr
      }
      if (data.monthMoneyNew) {
        data.monthMoneyNewStart = data.monthMoneyNew[0]
        data.monthMoneyNewEnd = data.monthMoneyNew[1]
        delete data.monthMoneyNew
      }
      return data
    },
    // 导出
    onExport(data) {
      const parms = this.formattData(Object.assign({}, this.searchData, data))
      location.href = `/api/special/worker/downloadSpecialWorkerOrderList?${qs.stringify(
        parms
      )}&componentId=${this.$componentId}`
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      data = copy(data)
      data.pageNum = 1
      this.searchData = Object.assign(this.searchData, data)
      this.getList()
    },

    // 获取列表
    getList() {
      const data = this.formattData(this.searchData)
      this.loading = true
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        data.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskSpecialWorkerOrderList : $getSpecialWorkerOrderList
      $api(data)
        .then((res) => {
          if (res.code === 1) {
            this.tableData = res.data.list
            this.total = res.data.total
            this.summaryItems.forEach((item) => {
              item.val = res.data[item.key] || 0
            })
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

    handleSearchReset(target) {
      this.$refs.org.reset()
      target.reset()
      this.searchData.dateArr = []
      this.searchData.overDateArr = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
