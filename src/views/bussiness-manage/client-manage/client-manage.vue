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
              v-model="target.model.adminCustomerType"
              placeholder="请选择所属客户主要合作类型"
              :filterable="true"
              :clearable="true"
              popper-class="cooperateSelect"
              :popper-append-to-body="false"
            >
              <el-option
                v-for="item in adminCustomerTypeList"
                :key="item.id"
                :label="item.newsContent"
                :value="item.id"
              >
                <div>{{ item.newsContent }}</div>
                <div v-if="item.tipContent" style="font-size: 12px; color:rgb(190,190,190);margin-top: -10px;">{{ item.tipContent }}</div>
              </el-option>
            </el-select>
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
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="table-btn-view m-b-16">
        <el-button v-log type="primary" @click="handleShow('', 'add')">添加客户联系人</el-button>
      </div>
      <el-table
        ref="client"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column label="联系人名称" prop="customerName" />
        <el-table-column prop="companyName" label="所属客户" align="left">
          <template slot-scope="{row}">
            <div>
              {{ row.companyName }}
              <IconTip width="400px" type="popover" icon-class="el-icon-office-building">
                <div>客户公司名称：{{ row.companyName }}</div>
                <div>客户级别：{{ row.customerLevel || '--' }}</div>
                <div>主要合作类型：{{ row.adminCustomerTypeName || '--' }}</div>
                <div>主对接人：{{ row.mainConnectName || '--' }}</div>
                <div>统一社会信用代码：{{ row.creditCode || '--' }}</div>
              </IconTip>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="industryName" label="行业类别">
          <template slot-scope="{ row }">
            {{ row.industryName || '--' }}
          </template>
        </el-table-column>

        <!-- <el-table-column prop="brandNames" label="品牌" /> -->
        <el-table-column label="客户主要合作类型" prop="adminCustomerTypeName">
          <template slot-scope="{ row }">
            {{ row.adminCustomerTypeName || '--' }}
          </template>
        </el-table-column>

        <el-table-column prop="crmName" label="归属商务">
          <template slot-scope="{ row }">
            {{ row.crmName || '--' }}
          </template>
        </el-table-column>

        <el-table-column prop="fieldName" label="联系人负责行业">
          <template slot-scope="{ row }">
            {{ row.fieldName || '--' }}
          </template>
        </el-table-column>

        <!-- <el-table-column label="合作类型" prop="customerTypeName">
          <template slot="header">
            <span>合作类型</span>
            <IconTip
              content="原客户类型，（即将废弃，未来将迁移到商机中）"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.customerTypeName || '--' }}
          </template>
        </el-table-column> -->

        <!-- <el-table-column prop="phone" label="电话" /> -->
        <!-- <el-table-column prop="customerTime" label="对接时间" /> -->
        <!-- <el-table-column prop="purpose_name" label="合作意向"></el-table-column> -->
        <el-table-column label="是否已合作">
          <template slot-scope="{ row }">{{ row.isWorkDesc }}</template>
        </el-table-column>
        <el-table-column prop="production" label="合作产品" />
        <!-- <el-table-column prop="levelName" label="优先级" /> -->
        <!-- <el-table-column prop="discount" label="返点政策"></el-table-column> -->
        <el-table-column prop="workMoney" label="合作金额" sortable="custom" />

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
            <el-link v-log class="m-r-5" type="primary" @click="handleShowDetail(scope.row.customerId)">查看</el-link>
            <el-link v-if="scope.row.editAuth === 1" v-log type="primary" @click="handleShow(scope.row.customerId, 'edit')">编辑</el-link>
            <!-- <el-link @click="handleDel(scope.row)" type="primary" >删除</el-link> -->
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

    <DetailDialog
      v-if="showDialog"
      :id="customerId"
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

  </div>
</template>

<script>
import qs from 'qs'
import Search from '@/components/Search'
import { copy } from '@/components/common'
import tableMixin from '@/mixins/table'
import { Statistics, IconTip } from 'components'
import DetailDialog from './detailDialog'
import Drawer from './drawer'
import { $getCondition, $getList, $getNewIndustryTypeTags } from '@/api/bussiness-manage'
import { $getDeskList } from '@/api/business-desk'
export default {
  components: {
    IconTip,
    vSearch: Search,
    Statistics,
    DetailDialog,
    Drawer
  },
  mixins: [tableMixin],
  data() {
    return {
      showDialog: false,
      customerId: '',
      formConf: {},
      normalFormItemMap: {},
      searchData: {
        customerType: '',
        companyId: '',
        brandId: '',
        levelId: '',
        pageNum: 1,
        determined: '',
        production: '',
        crmId: '',
        customerStatus: '',
        size: 20
      },
      tableData: [],
      total: 0,
      brandNames: '',
      dialogType: 'detail',
      summaryItems: [
        {
          key: 'companyNum',
          text: '合作客户数量',
          val: 0
        },
        {
          key: 'customerNum',
          text: '合作客户联系人数量',
          val: 0
        },
        {
          key: 'workMoneyNum',
          text: '合作金额',
          val: 0
        }
      ],
      detailId: '',
      showDrawer: false,
      adminCustomerTypeList: []
    }
  },
  created() {
    this.buildFormConf()
    this.getCondition()
    this.getList()
    this.getNewIndustryTypeTags()
  },
  mounted() {
    const { flag } = this.$route.query
    if (flag === 'fromOp') {
      this.handleShow('', 'add')
    }
  },
  methods: {
    buildFormConf() {
      const formConf = {
        normal: [
          {
            type: 'input',
            key: 'customerName',
            conf: {
              placeholder: '请输入联系人名称'
            }
          },
          {
            type: 'select',
            key: 'companyId',
            data: [],
            conf: {
              placeholder: '请选择所属客户全称',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'newsContent'
          },
          {
            type: 'cascader',
            key: 'adminIndustryId',
            _key: 'industryTypeTags',
            data: [],
            conf: {
              placeholder: '请选择所属客户行业类别',
              clearable: true
            },
            props: { checkStrictly: true, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' },
            optionValKey: 'tagId',
            optionLabelKey: 'tagName'
          },
          // {
          //   type: 'select',
          //   key: 'adminCustomerType',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择所属客户主要合作类型',
          //     filterable: true,
          //     clearable: true
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'newsContent'
          // },
          {
            type: 'select',
            key: 'brandId',
            data: [],
            conf: {
              placeholder: '请选择品牌',
              filterable: true,
              clearable: true,
              hidden: true
            },
            optionValKey: 'id',
            optionLabelKey: 'newsContent'
          },
          // {
          //   type: 'select',
          //   key: 'customerType',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择合作类型（即将废弃）',
          //     filterable: true,
          //     clearable: true
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'newsContent'
          // },
          {
            type: 'select',
            key: 'crmId',
            data: [],
            conf: {
              placeholder: '请选择归属商务',
              filterable: true,
              clearable: true
            },
            optionValKey: 'id',
            optionLabelKey: 'name'
          },
          {
            type: 'select',
            key: 'production',
            data: [],
            conf: {
              placeholder: '请选择合作产品',
              filterable: true,
              clearable: true
            },
            optionValKey: 'producationName',
            optionLabelKey: 'producationName'
          }
          // {
          //   type: 'select',
          //   key: 'customerProgress',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择客户进展',
          //     filterable: true,
          //     clearable: true
          //   },
          //   optionValKey: 'customerStatusId',
          //   optionLabelKey: 'customerStatusName'
          // },
          // {
          //   type: 'select',
          //   key: 'levelId',
          //   data: [],
          //   conf: {
          //     placeholder: '请选择优先级',
          //     filterable: true,
          //     clearable: true
          //   },
          //   optionValKey: 'id',
          //   optionLabelKey: 'newsContent'
          // }
        ],
        // hasExport: this.$permission('bussiness_client_manage_export')
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
      // this.normalFormItemMap.brandIdByFilter = copy(this.normalFormItemMap.brandId)
      // this.normalFormItemMap.customerSource = {
      //   data: [],
      //   optionValKey: 'id',
      //   optionLabelKey: 'newsContent',
      //   key: 'levelId',
      //   conf: {
      //     placeholder: '请选择客户来源',
      //     clearable: true,
      //     filterable: true
      //   }
      // }
      // this.normalFormItemMap.purposeId = {
      //   data: [],
      //   optionValKey: 'id',
      //   optionLabelKey: 'newsContent',
      //   key: 'purposeId',
      //   conf: {
      //     placeholder: '请选择合作意向',
      //     clearable: true,
      //     filterable: true
      //   }
      // }
      this.normalFormItemMap.industryTypeTags = {
        data: [],
        optionValKey: 'tagId',
        optionLabelKey: 'tagName',
        key: 'industryTypeTags',
        conf: {
          placeholder: '请选择行业类别',
          clearable: true,
          filterable: true
        }
      }
    },
    async getList() {
      const params = copy(this.searchData)

      if (params.createTime) {
        params.createTimeStart = params.createTime[0]
        params.createTimeEnd = params.createTime[1]
      } else {
        params.createTimeStart = ''
        params.createTimeEnd = ''
      }

      delete params.createTime

      if (params && params.adminIndustryId && params.adminIndustryId.length && Array.isArray(params.adminIndustryId)) {
        params.adminIndustryId = params.adminIndustryId[params.adminIndustryId.length - 1]
      }

      this.loading = true
      const deskType = localStorage.getItem('deskType') || ''
      if (deskType) {
        params.from = +deskType === 1 ? 'group' : 'mine'
      }
      const $api = deskType ? $getDeskList : $getList
      const res = await $api(params)
      if (res.code === 1) {
        this.tableData = res.data.list
        this.total = res.data.total
        this.summaryItems.forEach(item => {
          item.val = res.data[item.key] || 0
        })
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
        // this.normalFormItemMap.adminIndustryId.data = res.data.industryTypeTags
        this.normalFormItemMap.brandId.data = res.data.brandTags
        // this.normalFormItemMap.brandIdByFilter.data = res.data.brandTags.filter(item => item.isDeleted === 0)
        this.normalFormItemMap.production.data = res.data.producations
        this.normalFormItemMap.crmId.data = res.data.crmInfo
        // this.normalFormItemMap.customerType.data = res.data.customerTypeTags
        // this.normalFormItemMap.adminCustomerType.data = res.data.customerTypeTags
        const adminCustomerTypeList = res.data.customerTypeTags
        this.adminCustomerTypeList = adminCustomerTypeList.map(item => {
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
        this.normalFormItemMap.adminIndustryId.data = data
      }
    },

    async handleShow(customerId, dialogType = 'detail') {
      this.customerId = customerId
      this.showDialog = true
      this.dialogType = dialogType
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

      if (params.createTime) {
        params.createTimeStart = params.createTime[0]
        params.createTimeEnd = params.createTime[1]
      } else {
        params.createTimeStart = ''
        params.createTimeEnd = ''
      }

      delete params.createTime
      if (params && params.adminIndustryId && params.adminIndustryId.length && Array.isArray(params.adminIndustryId)) {
        params.adminIndustryId = params.adminIndustryId[params.adminIndustryId.length - 1]
      }
      window.location.href = `/api/business/customer/export?${qs.stringify(params)}&componentId=${this.$componentId}`
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

::v-deep {
  .cooperateSelect {
      .el-select-dropdown__item {
          height: auto;
      }
  }
}

</style>
