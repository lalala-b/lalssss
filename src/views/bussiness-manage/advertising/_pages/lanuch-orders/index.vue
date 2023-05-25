<template>
  <div class="P-advertisingLaunchOrders">
    <div>
      <div class="P-advertisingLaunchOrdersSearch search-view">
        <v-search
          ref="search"
          :config="formConf"
          @submit="onSubmit"
          @export="onExport"
          @change="onSearchChange"
        >
          <!-- 平台消耗金额 -->
          <template v-slot:normal="target">
            <el-form-item label="平台消耗金额">
              <flex-row>
                <el-input-number
                  v-model="target.model.xingtuAmountStart"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :min="0"
                  :controls="false"
                  placeholder="金额最小值"
                />
                <!-- <el-input
                  v-model="target.model.xingtuAmountStart"
                  type="number"
                  placeholder="金额最小值"
                  min="0"
                /> -->
                <span class="m-r-5 m-l-5">至</span>
                <el-input-number
                  v-model="target.model.xingtuAmountEnd"
                  class="text-a-l"
                  :precision="2"
                  :max="100000000"
                  :min="0"
                  :controls="false"
                  placeholder="金额最大值"
                />
                <!-- <el-input
                  v-model="target.model.xingtuAmountEnd"
                  type="number"
                  placeholder="金额最大值"
                  min="0"
                /> -->
              </flex-row>
            </el-form-item>

            <el-form-item label="预计发布时间">
              <el-date-picker
                v-model="target.model.timerange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>

            <el-form-item label="视频发布时间">
              <el-date-picker
                v-model="target.model.addTimerange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </template>
          <template slot="btns">
            <!-- 仅liudie可以导出 -->
            <el-button v-if="this.$store.state.user.userInfo.id === 1206" v-log @click="handleExportMail">导出邮寄信息</el-button>
          </template>
        </v-search>
        <div v-loading="loading" class="data-num-view m-t-24">
          <ul>
            <li v-for="item in summaryItems" :key="item.key">
              <span>{{ item.text }}</span>
              <strong>{{ (item.value || 0) | toThousandFilter }}</strong>
            </li>
          </ul>
        </div>
      </div>
      <div class="table-view">
        <p class="m-b-10 color-danger">若一笔订单视频数据较差，第三方平台(星图/快接单)订单任务未取消但重新发布视频的情况，需再次下单提交新视频（金额字段都填0，其他内容与原订单的内容一致）</p>
        <el-table
          ref="flow"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column prop="orderNumber" label="订单号" />
          <el-table-column prop="platName" label="平台" />
          <el-table-column prop="accountName" label="账号" />
          <el-table-column prop="deliveryName" label="投放专员" />
          <el-table-column prop="consumeAmount" label="平台消耗金额" sortable="custom" width="140">
            <template slot="header">
              <el-popover
                placement="top-start"
                width="300"
                trigger="hover"
                content="平台消耗金额（星图、快接单等平台实际消耗金额，包含手续费）"
              >
                <div slot="reference">
                  平台消耗金额
                  <i class="el-icon-question" />
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="deliveryMoney" label="投放价格" sortable="custom" width="100" />
          <el-table-column prop="preReleaseVideoTime" label="预计发布时间" sortable="custom" width="170px" />
          <el-table-column prop="titleName" label="视频" sortable="custom">
            <template slot-scope="s">
              <el-link
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :disabled="s.row.url === ''"
                target="_blank"
              >
                {{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}
              </el-link>
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="视频发布时间" sortable="custom" width="130" />
          <el-table-column prop="flowCount" label="流量" sortable="custom" />
          <el-table-column prop="xtAccountId" label="星图账户" sortable="custom" width="100">
            <template slot-scope="s">
              {{ XT_ACCOUNT_ID[s.row.xtAccountId - 1] && XT_ACCOUNT_ID[s.row.xtAccountId - 1].text }}
            </template>
          </el-table-column>
          <!-- <el-table-column prop="hasInvoice" label="是否收到星图发票" sortable="custom">
            <template slot-scope="s">
              {{ HAS_INVOICE[s.row.hasInvoice] && HAS_INVOICE[s.row.hasInvoice].text }}
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="isRecharge" label="是否充值完成" sortable="custom">
            <template slot-scope="s">
              {{ IS_RECHARGE[s.row.isRecharge] && IS_RECHARGE[s.row.isRecharge].text }}
            </template>
          </el-table-column> -->
          <el-table-column prop="androidDeliveryName" label="组件渠道号" width="110" />
          <el-table-column label="操作" width="70">
            <template slot-scope="s">
              <el-link v-if="$permission('')" v-log type="primary" style="margin-right: 0;" @click="onCellBtn(s.row, 'show')">查看</el-link>
              <el-link v-if="$permission('adv_account_todo') && s.row.canEdit" v-log type="primary" style="margin-right: 0;" @click="onCellBtn(s.row, 'edit')">编辑</el-link>
              <el-link v-if="$permission('adv_account_delect') && s.row.canEdit" v-log type="primary" style="margin-right: 0;" @click="handleDel(s.row)">删除</el-link>
              <el-link v-if="$permission('adv_account_move')" v-log :disabled="s.row.lockStatus !== 0" :type="s.row.lockStatus !== 0 ? 'info' : 'primary'" style="margin-right: 0;" @click="handleMove(s.row)">
                <el-popover
                  v-if="s.row.lockStatus !== 0"
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="该订单已计算完军功，不可移交投放专员。"
                >
                  <div slot="reference">
                    移交
                  </div>
                </el-popover>
                <template v-else>
                  移交
                </template>
              </el-link>
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
            @current-change="getList"
          />
        </div>
      </div>
    </div>
    <v-lanuch-info
      :item="orderItem"
      :show="showLanchInfo"
      :types="btnTypes"
      @update:show="showLanchInfo = false"
      @update:list="getList"
    />
    <v-move
      v-if="moveShow"
      :info-data="orderItem"
      :show.sync="moveShow"
      @success="getList"
    />
  </div>
</template>
<script>
import Search from '@/components/Search'
import tableMixin from '@/mixins/table'
import LanuchInfo from '@/views/putting-manager/_mods/info'
import Move from './_pages/move'
import qs from 'qs'
import {
  copy
} from '@/components/common'
import { $getOrderPuttingList, $getAccountCondition, $getOrderPutting, $delOrderPutting, $getAccountPuttingByPlatId, $getFundOrgId, $getTransferCondition } from '@/api/bussiness-manage'
import './index.scss'

/**
 * 搜索参数
 * @type {Object}
 */
const SEARCH_QUERY_DATA_MODEL = {
  platId: '',
  accountId: '',
  title: '',
  deliveryId: '',
  xtAccountId: '',
  hasInvoice: '',
  invoiceNum: '',
  isRecharge: '',
  rechargeNumber: '',
  xingtuAmountStart: '',
  xingtuAmountEnd: '',
  pageNum: 1,
  size: 20,
  determined: ''
  // f_id: ""
}

const XT_ACCOUNT_ID = [
  {
    'val': 1,
    'text': '向乾'
  },
  {
    'val': 2,
    'text': '乾派'
  },
  {
    'val': 3,
    'text': '快接单'
  },
  {
    'val': 4,
    'text': '线下'
  },
  {
    'val': 5,
    'text': '北京'
  }
]

const HAS_INVOICE = [
  {
    'val': 0,
    'text': '否'
  },
  {
    'val': 1,
    'text': '是'
  }
]

const IS_RECHARGE = [
  {
    'val': 0,
    'text': '否'
  },
  {
    'val': 1,
    'text': '是'
  }
]

export default {
  components: {
    vSearch: Search,
    vLanuchInfo: LanuchInfo,
    vMove: Move
  },
  mixins: [tableMixin],
  data() {
    return {
      formConf: {},
      searchData: { ...SEARCH_QUERY_DATA_MODEL },
      loading: false,
      summaryItems: [
        {
          key: 'orderNum',
          value: 0,
          text: '投放订单数量'
        },
        {
          key: 'accountNum',
          value: 0,
          text: '账号数量'
        },
        {
          key: 'consumeAmount',
          value: 0,
          text: '平台消耗金额'
        }
        // {
        //   key: 'rechargeAmount',
        //   value: 0,
        //   text: '充值金额'
        // }
      ],
      XT_ACCOUNT_ID,
      HAS_INVOICE,
      IS_RECHARGE,
      dialogData: {},
      total: 0,
      btnTypes: 1,
      showLanchInfo: false,
      moveShow: false,
      orderItem: {}
    }
  },
  computed: {
    btnPermission() {
      return {
        hasEdit: true
      }
    }
  },
  created() {
    this.buildFormConf()
    this.getAccountCondition()
    this.getOrgInfo()
    this.getTransferCondition()
    this.getList()
  },
  methods: {
    /**
     * 触发点击导出邮寄信息
     */
    handleExportMail() {
      const params = Object.assign({}, this.searchData, this.$refs.search.form)
      if (params.addTimerange) {
        params.addTimeStart = params.addTimerange[0] + ' 00:00:00'
        params.addTimeEnd = params.addTimerange[1] + ' 23:59:59'
        delete params.addTimerange
      }
      if (params.timerange) {
        params.preReleaseVideoTimeStart = params.timerange[0]
        params.preReleaseVideoTimeEnd = params.timerange[1]
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      window.location.href = `/api/business/foreign/orderPutting/exportCourier?${qs.stringify(params)}&componentId=${this.$componentId}`
      // this.searchData = Object.assign({}, this.searchData, this.$refs.search.form)
      // window.location.href = `/api/business/foreign/orderPutting/exportCourier?${qs.stringify(this.searchData)}&componentId=${this.$componentId}`
    },
    /**
     * 查询条件列表
     */
    async getAccountCondition(params) {
      const res = await $getAccountCondition(params)
      if (res.code === 1) {
        this.advFormItemMap.platId.data = res.data.platInfo
        this.advFormItemMap.accountId.data = res.data.accountInfo
        // this.advFormItemMap.deliveryId.data = res.data.simpleUserInfo
        // this.advFormItemMap.orgId.data = res.data.orgInfo
        // this.tagValueList = res.data.tagValues
      }
    },
    getOrgInfo() {
      if (!this.advFormItemMap.dId && !this.advFormItemMap.fId) {
        return
      }
      $getFundOrgId().then(res => {
        if (res.code === 1) {
          const org = this.advFormItemMap.dId || this.advFormItemMap.fId
          org.data = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    async getList() {
      this.loading = true
      const params = copy(this.searchData)
      if (params.addTimerange) {
        params.addTimeStart = params.addTimerange[0] + ' 00:00:00'
        params.addTimeEnd = params.addTimerange[1] + ' 23:59:59'
        delete params.addTimerange
      }
      if (params.timerange) {
        params.preReleaseVideoTimeStart = params.timerange[0]
        params.preReleaseVideoTimeEnd = params.timerange[1]
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      try {
        const res = await $getOrderPuttingList(params)
        if (res.code === 1) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.summaryItems = this.summaryItems.map(t => {
            t.value = res.data[t.key]
            return t
          })
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }
    },
    buildFormConf() {
      let normal = [
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
          isAccountName: true,
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'input',
          key: 'titleName',
          data: [],
          conf: {
            placeholder: '请输入标题'
          }
        },
        {
          type: 'select',
          key: 'dId',
          data: [],
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          conf: {
            placeholder: '选择军'
          },
          permissionName: 'adv_lau_order_d_j_id'
        },
        {
          type: 'select',
          key: 'fId',
          data: [],
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          conf: {
            placeholder: '选择团'
          },
          permissionName: 'adv_lau_order_f_id'
        },
        {
          type: 'select',
          key: 'deliveryId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '投放专员'
          }
        },
        {
          type: 'select',
          key: 'xtAccountId',
          data: XT_ACCOUNT_ID,
          conf: {
            placeholder: '请选择星图账户'
          }
        },
        // {
        //   type: 'select',
        //   key: 'hasInvoice',
        //   data: HAS_INVOICE,
        //   conf: {
        //     placeholder: '是否收到星图发票'
        //   }
        // },
        // {
        //   type: 'input',
        //   key: 'invoiceNum',
        //   data: [],
        //   conf: {
        //     placeholder: '请输入发票号'
        //   }
        // },
        // {
        //   type: 'select',
        //   key: 'isRecharge',
        //   data: IS_RECHARGE,
        //   conf: {
        //     placeholder: '是否充值完成'
        //   }
        // },
        // {
        //   type: 'input',
        //   key: 'rechargeNumber',
        //   data: [],
        //   conf: {
        //     placeholder: '请输入OA充值申请编号'
        //   }
        // },
        {
          type: 'input',
          key: 'androidDeliveryName',
          data: [],
          conf: {
            placeholder: '组件渠道号'
          }
        },
        {
          type: 'input',
          key: 'orderNumber',
          data: [],
          conf: {
            placeholder: '请输入订单号'
          }
        }
      ]
      const advFormItemMap = {}

      normal = normal.filter((item, index) => {
        if (item.permissionName && !this.$permission(item.permissionName)) {
          return false
        }
        item.index = index
        advFormItemMap[item.key] = item
        return true
      })
      this.advFormItemMap = advFormItemMap
      this.formConf = {
        normal,
        hasExport: this.$permission('advertising_export')
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
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'platId') {
        $getAccountPuttingByPlatId({ platId: val }).then(res => {
          if (res.code === 1) {
            this.advFormItemMap.accountId.data = res.data
          }
        })
        return
      }
      if (item.key === 'dId') {
        model.fId = ''
        model.deliveryId = ''
        this.advFormItemMap.fId.data = []
        this.advFormItemMap.deliveryId.data = []
        this.getTransferCondition(val)
        if (!val) {
          return
        }

        $getFundOrgId({ orgId: val }).then(res => {
          if (res.code === 1) {
            this.advFormItemMap.fId.data = res.data
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
      }
      if (item.key === 'fId') {
        model.deliveryId = ''
        this.advFormItemMap.deliveryId.data = []
        this.getTransferCondition(val)
      }
    },
    // 获取投放专员
    getTransferCondition(orgId) {
      $getTransferCondition({ orgId }).then(res => {
        if (res.code === 1) {
          this.advFormItemMap.deliveryId.data = res.data
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 表格按钮点击响应函数
     * @param  {Object}  row   对应行数据
     * @param  {String}  type  操作类型
     */
    onCellBtn(row, type) {
      if (type === 'edit') { this.btnTypes = 2 } else { this.btnTypes = 1 }
      this.showLanchInfo = true
      $getOrderPutting({
        orderId: row.orderId
      }).then(res => {
        if (res.code === 1) {
          this.orderItem = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      this.searchData = Object.assign({}, this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.addTimerange) {
        params.addTimeStart = params.addTimerange[0] + ' 00:00:00'
        params.addTimeEnd = params.addTimerange[1] + ' 23:59:59'
        delete params.addTimerange
      }
      if (params.timerange) {
        params.preReleaseVideoTimeStart = params.timerange[0]
        params.preReleaseVideoTimeEnd = params.timerange[1]
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      window.location.href = `/api/business/foreign/orderPutting/export?${qs.stringify(params)}&componentId=${this.$componentId}`
    },
    // 删除订单
    handleDel(rowData) {
      this.$confirm('是否确认删除此订单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        $delOrderPutting({
          orderId: rowData.orderId
        }).then(res => {
          if (res.code === 1) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.$bus.$emit('upLog', { orderId: rowData.orderId, operation_module: '删除确定' })
          } else {
            this.$message.error(res.message)
          }
        })
      })
    },
    // 移交订单
    handleMove(rowData) {
      this.moveShow = true
      this.orderItem = rowData
    }
  }
}
</script>
