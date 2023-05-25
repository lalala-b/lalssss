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
        <template v-slot:normal="target">
          <el-form-item>
            <el-select
              v-model="target.model.customerType"
              placeholder="请选择合作类型"
              :filterable="true"
              :clearable="true"
              popper-class="cooperateSelect"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in customerTypeList"
                :key="item.id"
                :label="item.newsContent"
                :value="item.id"
              >
                <div>{{ item.newsContent }}</div>
                <div v-if="item.tipContent" style="font-size: 12px; color:rgb(190,190,190);margin-top: -10px;">{{ item.tipContent }}</div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="最近一次下单时间">
            <el-date-picker
              v-model="target.model.orderTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.createTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <!-- <Wrap class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap> -->
    <Wrap class="table-view m-t-16">
      <div class="table-btn-view m-b-16">
        <el-button v-if="$permission('customer_manage_add_button')" v-log type="primary" @click="handleShowDialog('add')">添加客户</el-button>
      </div>
      <el-table
        ref="client"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        row-key="id"
        @sort-change="doSort"
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column prop="companyName" label="客户全称" align="left">
          <template slot-scope="{row}">
            <div>
              {{ row.companyName }}
              <!-- <IconTip width="400px" type="popover" icon-class="el-icon-office-building">
                <div>客户公司名称：{{ row.companyName }}</div>
                <div>统一社会信用代码：{{ row.creditCode }}</div>
              </IconTip> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="industryName" label="行业类别">
          <template slot-scope="{ row }">
            {{ row.industryName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="主要合作类型" prop="customerTypeName">
          <template slot-scope="{ row }">
            {{ row.customerTypeName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="主对接人" prop="mainConnectName">
          <template slot-scope="{ row }">
            {{ row.mainConnectName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="AM对接人" prop="ams">
          <template slot-scope="{ row }">
            <span v-if="(row.ams || []).length <= 1">{{ (row.ams || [])[0] || '--' }}</span>
            <template v-else>
              <IconTip width="50px" popper-class="popper" type="popover" :label="row.ams.length.toString()" label-class="tooltip">
                <div v-for="(item, index) in row.ams" :key="`${item}_${index}`">{{ item }}</div>
              </IconTip>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="平均每月下单营收" prop="averageIncome">
          <template slot="header">
            <span>平均每月下单营收</span>
            <IconTip
              type="popper"
              icon-class="iconwenhao"
            >
              <template>
                例：今天是7月15日：<br>
                近6个月的平均营收：只统计2月~7月的月均营收数据（但是7月份只能统计到14日）
              </template>
            </IconTip>
          </template>
          <template slot-scope="{ row }">
            {{ row.averageIncome || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="本月营收" prop="currentMonthWorkMoney">
          <template slot="header">
            <span>本月营收</span>
            <IconTip
              width="100px"
              type="popper"
              content="不计算今日的营收"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            ￥{{ row.currentMonthWorkMoney | toThousands }}
          </template>
        </el-table-column>
        <el-table-column label="最近一次成单日期" prop="lastOrderTime">
          <template slot-scope="{ row }">
            {{ row.lastOrderTime || '--' }}
          </template>
        </el-table-column>

        <el-table-column label="月营收趋势" width="200px">
          <template slot="header">
            <span>月营收趋势</span>
            <IconTip
              type="popper"
              icon-class="iconwenhao"
            >
              <template>
                例1：今天是7月15日：<br>
                近12个月营收趋势：只统计去年9月~今年7月的月营收数据，并以每2个自然月为一个节点呈现趋势（但是7月份只能统计到14日）<br><br>
                例2：今天是6月15日：<br>
                近12个月营收趋势：只统计去年7月~今年6月的月营收数据，并以每2个自然月为一个节点呈现趋势（但是6月份只能统计到14日）
              </template>
            </IconTip>
          </template>
          <template slot-scope="{ row }">
            <VLine v-if="row.averageTrend.length" :id="row.id" :data="row.averageTrend" />
            <span v-else>--</span>
          </template>
        </el-table-column>

        <el-table-column label="创建人" prop="createName">
          <template slot-scope="{ row }">
            {{ row.createName || '--' }}
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime" width="108px">
          <template slot-scope="{ row }">
            {{ row.createTime || '--' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-link v-log class="m-r-5" type="primary" @click="handleShowDetail(scope.row.id)">查看</el-link>
            <el-link v-if="+scope.row.canEdit === 1" v-log class="m-l-12" type="primary" @click="handleShowDialog('edit', scope.row.id)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>

    <Dialog
      v-if="showDialog"
      :id="dialogId"
      :show-dialog="showDialog"
      :dialog-type="dialogType"
      :normal-form-item-map="normalFormItemMap"
      @close="showDialog = false"
      @success="handleSuccess"
    />

    <Drawer
      :id="detailId"
      :show-drawer="showDrawer"
      @close="showDrawer = false"
    />

    <!-- <DetailDialog
      v-if="showDetail"
      v-model="showDetail"
      :dialog-type="dialogType"
      :customer-id="customerId"
      :normal-form-item-map="normalFormItemMap"
      @success="getList"
    /> -->
  </div>
</template>

<script>
import qs from 'qs'
import Search from '@/components/Search'
import { copy } from '@/components/common'
import tableMixin from '@/mixins/table'
import { IconTip } from 'components'
import VLine from './line.vue'
import Dialog from './dialog.vue'
import Drawer from './drawer.vue'
// import DetailDialog from './detailDialog'
import {
  $getCondition,
  $getMainConnectsCondition,
  $getAMCondition,
  $getAverageCondition,
  $getCreatePersonCondition,
  $getCustomerList,
  $getNewIndustryTypeTags
} from '@/api/bussiness-manage'
import { $getDeskCustomerList } from '@/api/business-desk'
export default {
  components: {
    IconTip,
    vSearch: Search,
    VLine,
    Dialog,
    Drawer
    // Statistics
    // DetailDialog
  },
  mixins: [tableMixin],
  data() {
    return {
      showDetail: false,
      customerId: '',
      formConf: {},
      normalFormItemMap: {},
      searchData: {
        customerType: '',
        companyId: '',
        pageNum: 1,
        size: 20
      },
      tableData: [],
      total: 0,
      dialogType: 'detail',
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      lineConfig: {
        legend: {
          // selectedMode: 'single'
        },
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }],
        seriesConfig: {
          type: 'line',
          data: null
        }
      },
      showDialog: false,
      dialogId: '',
      detailId: '',
      showDrawer: false,
      customerTypeList: []
    }
  },
  created() {
    this.buildFormConf()
    this.getCondition()
    this.getMainConnectsCondition()
    this.getAMCondition()
    this.getAverageCondition()
    this.getCreatePersonCondition()
    this.getList()
    this.getNewIndustryTypeTags()
  },
  mounted() {
    const { id, flag } = this.$route.query
    if (id) {
      this.detailId = id
      this.showDrawer = true
    }
    if (flag === 'fromClient') {
      this.dialogType = 'add'
      this.showDialog = true
    }
  },
  deactivated() {
    this.showDrawer = false
  },
  methods: {
    buildFormConf() {
      const formConf = {
        normal: [
          {
            type: 'select',
            key: 'companyId',
            data: [],
            conf: {
              placeholder: '请选择客户全称',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'newsContent'
          },
          {
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
          },
          // {
          //   type: 'select',
          //   key: 'customerType',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择合作类型',
          //     filterable: true,
          //     clearable: true
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'newsContent'
          // },
          {
            type: 'select',
            key: 'createId',
            data: [],
            conf: {
              placeholder: '请选择创建人',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'name'
          },
          {
            type: 'select',
            key: 'mainConnectId',
            data: [],
            conf: {
              placeholder: '请选择主对接人',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'name'
          },
          {
            type: 'select',
            key: 'amId',
            data: [],
            conf: {
              placeholder: '请选择AM对接人',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'name'
          },
          {
            type: 'select',
            key: 'averageIncomeType',
            data: [],
            conf: {
              placeholder: '请选择平均月下单营收',
              filterable: true,
              clearable: true
            },
            optionValKey: 'value',
            optionLabelKey: 'name'
          }
        ],
        // hasExport: this.$permission('customer_manage_export')
        hasExport: this.$permission('manager_export')
      }
      if (['/bussiness-manage/my-desk', '/bussiness-manage/my-team-desk'].includes(this.$route.path)) {
        formConf.hasExport = false
      }
      this.formConf = formConf
      // 构建搜索表单项映射
      var normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
    },
    async getList() {
      const params = copy(this.searchData)
      if (params.orderTime) {
        params.orderBeginTime = params.orderTime[0]
        params.orderEndTime = params.orderTime[1]
      } else {
        params.orderBeginTime = ''
        params.orderEndTime = ''
      }

      if (params.createTime) {
        params.createTimeStart = params.createTime[0]
        params.createTimeEnd = params.createTime[1]
      } else {
        params.createTimeStart = ''
        params.createTimeEnd = ''
      }

      if (params && params.fieldId && params.fieldId.length && Array.isArray(params.fieldId)) {
        params.industryId = params.fieldId[params.fieldId.length - 1]
      }

      delete params.fieldId
      delete params.orderTime
      delete params.createTime

      this.loading = true
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        params.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskCustomerList : $getCustomerList
      const res = await $api(params)
      if (res.code === 1) {
        this.tableData = res.data.list || []
        this.total = res.data.total
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    },
    /**
     * 获取查询条件信息
     */
    async getCondition() {
      const res = await $getCondition()
      if (res.code === 1) {
        this.normalFormItemMap.companyId.data = res.data.companyTags
        const customerTypeList = res.data.customerTypeTags
        // this.normalFormItemMap.customerType.data = res.data.customerTypeTags
        this.normalFormItemMap.crmInfo = {
          data: res.data.crmInfo
        }

        this.customerTypeList = customerTypeList.map(item => {
          const newsContent = item.newsContent
          switch (newsContent) {
            case '代理-媒介代理':
              item.tipContent = '以代理身份，对接直客品牌方，不出方案，主要采买市场上账号。'
              break
            case '代理-方案代理':
              item.tipContent = '以代理身份，对接直客品牌方，出创意方案，主要采买市场上账号。'
              break
            case 'MCN-渠道':
              item.tipContent = '以MCN身份，对接渠道代理公司，合作自家账号或者采买市场上账号。'
              break
            case 'MCN-直采':
              item.tipContent = '以MCN身份，对接直客品牌方，合作自家账号。'
              break
            default:
              item.tipContent = ''
              break
          }
          return item
        })
        // this.normalFormItemMap.customerProgress.data = res.data.customerStatusList
        // this.normalFormItemMap.levelId.data = res.data.levelTags
        // this.normalFormItemMap.customerSource.data = res.data.customerSourceTags
        // this.normalFormItemMap.purposeId.data = res.data.industryTypeTags
      }
    },

    async getNewIndustryTypeTags() {
      const { code, data } = await $getNewIndustryTypeTags()
      if (+code === 1) {
        this.normalFormItemMap.fieldId.data = data
      }
    },

    async getMainConnectsCondition() {
      const { code, data } = await $getMainConnectsCondition()
      if (+code === 1) {
        this.normalFormItemMap.mainConnectId.data = data || []
      }
    },

    async getAMCondition() {
      const { code, data } = await $getAMCondition()
      if (+code === 1) {
        this.normalFormItemMap.amId.data = data || []
      }
    },

    async getAverageCondition() {
      const { code, data } = await $getAverageCondition()
      if (+code === 1) {
        this.normalFormItemMap.averageIncomeType.data = data || []
      }
    },

    async getCreatePersonCondition() {
      const { code, data } = await $getCreatePersonCondition()
      if (+code === 1) {
        this.normalFormItemMap.createId.data = data || []
      }
    },

    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {},
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)

      if (params.orderTime) {
        params.orderBeginTime = params.orderTime[0]
        params.orderEndTime = params.orderTime[1]
      } else {
        params.orderBeginTime = ''
        params.orderEndTime = ''
      }

      if (params.createTime) {
        params.createTimeStart = params.createTime[0]
        params.createTimeEnd = params.createTime[1]
      } else {
        params.createTimeStart = ''
        params.createTimeEnd = ''
      }

      if (params && params.fieldId && params.fieldId.length && Array.isArray(params.fieldId)) {
        params.industryId = params.fieldId[params.fieldId.length - 1]
      }

      delete params.fieldId
      delete params.orderTime
      delete params.createTime

      window.location.href = `/api/business/admin/export?${qs.stringify(params)}&componentId=${this.$componentId}`
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData = Object.assign({}, this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },

    handleShowDialog(type, id) {
      this.dialogType = type
      this.dialogId = type === 'add' ? '' : id
      this.showDialog = true
    },

    handleSuccess() {
      this.showDialog = false
      this.getList()
    },

    handleShowDetail(id) {
      this.showDrawer = true
      this.detailId = id
    }
  }
}
</script>

<style lang="scss" scoped>
.P-client {
  // padding: 24px;
  background: #fff;
  margin: 0 0 24px;
  // .el-input {
  //   width: 200px;
  // }
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
  .summary {
    height: 112px;
    background-color: #f5f7fa;

    ul {
      width: 100%;
      display: flex;
      padding: 24px 0;
    }

    li {
      flex: 1;
      text-align: center;
      &:nth-child(2) {
        border-left: 1px solid #e4e7ed;
        border-right: 1px solid #e4e7ed;
      }
    }

    span {
      color: #909399;
      font-size: 12px;
    }

    strong {
      color: #303133;
      display: block;
      font-size: 30px;
      margin: 12px 0 0;
      font-weight: normal;
    }
  }
  .table-head {
    background: #f6f8fa;
  }
  .receipt-box {
    border: 1px solid lightblue;
    padding: 0 10px;
    border-radius: 5px;
  }

}
.C-client-add {
  .el-tag {
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .input-new-tag {
    width: 100px;
  }
  .button-new-tag {
    vertical-align: top;
  }
}

.iconfont.el-icon-office-building {
  color: $--color-primary;
}

.chart {
  width: 200px;
  height: 200px;
}

.popper {
  min-width: 70px;
}

.tooltip {
  color: #409EFF;
}

::v-deep {
  .cooperateSelect {
      .el-select-dropdown__item {
          height: auto;
      }
  }
}
</style>
