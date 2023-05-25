<template>
  <Wrap class="P-advertisingLaunch">
    <div>
      <div class="search-view">
        <v-search
          ref="search"
          :config="formConf"
          @submit="onSubmit"
          @export="onExport"
          @change="onSearchChange"
        >
          <template v-slot:normal>
            <!-- <el-form-item label="投放价格区间">
              <div class="flex">
                <el-input
                  v-model="target.model.deliveryMoneyStart"
                  type="number"
                  placeholder="价格最小值"
                  min="0"
                />
                <span class="m-r-5 m-l-5">至</span>
                <el-input
                  v-model="target.model.deliveryMoneyEnd"
                  type="number"
                  placeholder="价格最大值"
                  min="0"
                />
              </div>
            </el-form-item> -->
            <!-- <el-form-item label="CPM区间">
              <div class="flex">
                <el-input
                  v-model="target.model.cpmStart"
                  type="number"
                  placeholder="CPM最小值"
                  min="0"
                />
                <span class="m-r-5 m-l-5">至</span>
                <el-input
                  v-model="target.model.cpmEnd"
                  type="number"
                  placeholder="CPM最大值"
                  min="0"
                />
              </div>
            </el-form-item> -->

            <!-- <el-form-item label="流量区间">
              <div class="flex">
                <el-input
                  v-model="target.model.flowCountStart"
                  type="number"
                  placeholder="流量最小值"
                  min="0"
                />
                <span class="m-r-5 m-l-5">至</span>
                <el-input
                  v-model="target.model.flowCountEnd"
                  type="number"
                  placeholder="流量最大值"
                  min="0"
                />
              </div>
            </el-form-item> -->

            <el-form-item label="时间范围">
              <el-date-picker
                ref="date"
                v-model="timerange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
          </template>
        </v-search>
        <Statistics
          v-loading="loading"
          class="statistics"
          :data="summaryItems"
        />
      </div>
    </div>
    <div v-if="refresh1" class="table-view">
      <div
        v-if="extFields && extFields.length"
        class="checkbox-view m-t-24 m-b-16"
      >
        <el-checkbox-group v-model="extCols">
          <el-checkbox
            v-for="item in extFields"
            :key="item.field_id"
            :label="item.fieldName"
          >{{ item.chn_name }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="视频信息" width="400" align="left">
          <template slot-scope="{ row }">
            <VideoInfo :info="row">
              <template v-slot:link>
                <div class="video-link-info">
                  <span
                    class="m-r-5"
                  >组件类型：{{ linkType[row.linkUseType] }}</span>
                  <span>组件渠道号：{{ row.androidDeliveryName }}</span>
                </div>
              </template>
            </VideoInfo>
          </template>
        </el-table-column>
        <el-table-column label="账号信息" align="left" width="200">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="{ name: 'nickName' }" />
          </template>
        </el-table-column>
        <el-table-column v-if="![80,891].includes(+searchData.dId)" prop="advertiserRealname" label="广告师" />
        <el-table-column v-if="![80].includes(+searchData.dId)" prop="deliveryName" label="投放专员" />
        <el-table-column label="编导人员">
          <template slot-scope="{row}">{{ row.choreographerName|emptyFill }}</template>
        </el-table-column>
        <el-table-column
          prop="flowCount"
          label="总流量"
          sortable="custom"
          width="100"
        />
        <el-table-column
          v-if="![80].includes(+searchData.dId)"
          prop="fansNum"
          label="粉丝数"
          sortable="custom"
          width="100"
        />
        <template v-for="item in extFields.slice(0, extFields.length - 1)">
          <el-table-column
            v-if="extColsStatus[item.fieldName]&&!['appNewDeviceQty','cpa'].includes(item.fieldName)"
            :key="item.field_id"
            :prop="item.fieldName"
            :label="item.chn_name"
            sortable="custom"
            width="100"
          />
        </template>
        <el-table-column
          prop="deliveryMoney"
          label="投放价格"
          sortable="custom"
          width="130"
        >
          <template slot="header">
            投放价格
            <IconTip
              type="popover"
              content="投放价格=投放下单报价+平台手续费 +补款金额+ （抖+成本） + 其他成本 - 已资金核算完订单的返款金额；如该视频资金核算完成，则展示该视频实际消耗金额。"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <el-table-column prop="cpm" label="CPM" sortable="custom" />
        <el-table-column
          v-if="![80,891].includes(+searchData.dId)"
          prop="cptClick"
          label="组件点击量"
          sortable="custom"
          width="120"
        />
        <el-table-column v-if="![891].includes(+searchData.dId)" prop="activeUV" label="" sortable="custom">
          <template slot="header">
            新增激活
            <IconTip
              type="popover"
              content="2022年8月2日快手改为曝光口径"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.activeUV | toThousands }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="extColsStatus.appNewDeviceQty"
          prop="appNewDeviceQty"
          label="安卓新增激活"
          sortable="custom"
        >
          <template slot="header">
            安卓新增激活
            <IconTip
              type="popover"
              content="安卓新增激活：统计口径为有点击组件且历史从未安装app的可监测安卓新用户。系统每日更新一次。"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="s">
            {{ s.row.appNewDeviceQty | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="![891].includes(+searchData.dId)||extColsStatus.cpa" prop="cpa" label="CPA" sortable="custom" width="100">
          <template slot="header">
            CPA
            <IconTip
              type="popover"
              content="抖音/快手：CPA=投放价格/新增激活，头条：CPA=投放价格/安卓新增激活。"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="s">
            {{ s.row.cpa | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===891" :key="'14'" prop="junType" label="视频类型" />
        <el-table-column v-if="+searchData.dId===891&&extColsStatus.b2cPhoneNetPayOrderQtySum" :key="'15'" prop="b2cPhoneNetPayOrderQtySum" label="B2C手机净支付数量" sortable="custom" width="180">
          <template slot-scope="{ row }">
            {{ row.b2cPhoneNetPayOrderQtySum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===891" :key="'16'" prop="b2cPhoneNetPayAmtSum" label="B2C手机净支付金额" sortable="custom" width="180">
          <template slot-scope="{ row }">
            {{ row.b2cPhoneNetPayAmtSum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===891" :key="'17'" prop="b2cRoi" label="" sortable="custom" width="140">
          <template slot="header">
            B2C-ROI
            <IconTip
              type="popover"
              content="B2C-ROI = B2C手机净支付金额/投放价格"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.b2cRoi | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===80&&extColsStatus.c2bRecAllFinishOrderQtySum" :key="13" prop="c2bRecAllFinishOrderQtySum" label=" C2B总成交量" sortable="custom">
          <template slot-scope="{ row }">
            {{ row.c2bRecAllFinishOrderQtySum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===80" :key="'15'" prop="c2bRecAllFinishOrderAmtSum" label="C2B总交易额" sortable="custom" width="130">
          <template slot-scope="{ row }">
            {{ row.c2bRecAllFinishOrderAmtSum | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===80" :key="'14'" prop="c2bRecoveredCustomerUnitPrice" label="" sortable="custom" width="170">
          <template slot="header">
            C2B回收客单价
            <IconTip
              type="popover"
              content="回收客单价=C2B总交易额/C2B总成交量"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.c2bRecoveredCustomerUnitPrice | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===80" :key="'16'" prop="c2bRoi" label="C2B-ROI" sortable="custom" width="140">
          <template slot="header">
            C2B-ROI
            <IconTip
              type="popover"
              content="C2B-ROI=C2B总交易额/投放价格"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.c2bRoi | toThousands }}
          </template>
        </el-table-column>
        <el-table-column v-if="+searchData.dId===891" prop="b2cPhoneModel" width="130" label="产品型号">
          <template slot-scope="scope">
            {{ scope.row.b2cPhoneModel || '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="+did===80||+did===0" label="审批备注" prop="requirementExamineRemark">
          <template slot-scope="{row}">
            <OverPopover :content="row.requirementExamineRemark" :show-count="20" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="80">
          <template slot-scope="s">
            <!-- <IconTip
              v-log="{ flowId: s.row.flowId, orderId: s.row.flowId, titleName: s.row.titleName }"
              icon-class="iconxiangqing"
              content="查看详情"
              @click="onCellBtn(s.row, 'detail')"
            /> -->
            <el-link
              v-log="{
                flowId: s.row.flowId,
                orderId: s.row.flowId,
                titleName: s.row.titleName,
              }"
              type="primary"
              @click="onCellBtn(s.row, 'detail')"
            >查看详情</el-link>
            <el-link v-if="$permission('put_count_edit')" v-log size="small" type="primary" @click="handlePutCountShow(s.row)">限制投放</el-link>
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
    <v-dialog v-if="dialogStatus" v-model="dialogStatus" :row-info="rowInfo" />
    <PutCount
      v-if="putCountShow"
      v-model="putCountShow"
      :is-batch="isBatch"
      :accout-info="accoutInfo"
      @update="getList"
    />
  </Wrap>
</template>
<script>
import dayjs from 'dayjs'
import { OverPopover, Search } from 'components'
import tableMixin from '@/mixins/table'
import dialog from './_components/dialog'
import { Statistics, VideoInfo, AccountCard, IconTip } from 'components'
import PutCount from '@/views/putting-manager/putting-account/_component/PutCount.vue'
import { copy } from '@/components/common'
import { unique } from '@/utils'

import {
  $getVideoCondition,
  $getVideoPuttingList,
  $getAccountPuttingByPlatId,
  $getFundOrgId,
  $getTransferCondition,
  $getVideoType,
  $getBasePlat
} from '@/api/bussiness-manage'
import {
  $getVideoConditionNew,
  $getVideoPuttingListNew,
  $getAccountPuttingByPlatIdNew,
  $getFundOrgIdNew,
  $getTransferConditionNew,
  $getFundUser
} from '@/api/putting-manager'
import { $getDataByDictType } from '@/api'
import { LINK_TYPE } from '@/const'
import './index.scss'
import qs from 'qs'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'

/**
 * 搜索参数
 * @type {Object}
 */
const timerange = [
  dayjs().add(-7, 'day').format('YYYY-MM-DD'),
  dayjs().format('YYYY-MM-DD')
]
const SEARCH_QUERY_DATA_MODEL = {
  videoTag: '',
  platId: '',
  junType: '',
  accountId: '',
  accountName: '',
  deliveryId: '',
  phone: '',
  belongTeam: '',
  deliveryMoneyStart: '',
  deliveryMoneyEnd: '',
  cpmStart: '',
  orgId: '',
  cpmEnd: '',
  flowCountStart: '',
  flowCountEnd: '',
  addTimeStart: '',
  addTimeEnd: '',
  pageNum: 1,
  size: 20,
  determined: '',
  timerange
}

export default {
  components: {
    vSearch: Search,
    vDialog: dialog,
    VideoInfo,
    Statistics,
    IconTip,
    AccountCard,
    PutCount,
    OverPopover
  },
  mixins: [tableMixin],
  props: {
    pageType: {
      type: String,
      default: ''
    }
  },
  data() {
    // 可控制的列
    var extFields = [
      { status: false, fieldName: 'thumbUpCount', chn_name: '点赞数' },
      { status: false, fieldName: 'commentCount', chn_name: '评论数' },
      { status: false, fieldName: 'forwardedCount', chn_name: '转发数' },
      { status: false, fieldName: 'rebateAmount', chn_name: '返款' },
      { status: false, fieldName: 'appNewDeviceQty', chn_name: '安卓新增激活' }
    ]
    // 可控制列显示状态
    var extColsStatus = {}
    // 可控制列选择状态
    var extCols = []
    extFields.forEach((item) => {
      if (item.status) {
        extCols.push(item.fieldName)
      }
      extColsStatus[item.fieldName] = item.status
    })

    return {
      timerange,
      formConf: {},
      searchData: { ...SEARCH_QUERY_DATA_MODEL },
      loading: false,
      summaryItems: [
        {
          key: 'titleNum',
          val: null,
          text: '标题'
        },
        {
          key: 'flowCountNum',
          val: null,
          text: '流量'
        },
        {
          key: 'deliveryMoneyNum',
          val: null,
          text: '投放价格'
        },
        {
          key: 'cpm',
          val: null,
          text: 'CPM'
        },
        {
          key: 'cptClickNum',
          val: null,
          text: '组件点击量'
        },
        {
          key: 'activeUV',
          val: null,
          text: '新增激活',
          tip: '2022年8月2日快手改为曝光口径'
        },
        {
          key: 'cpa',
          val: null,
          text: 'CPA',
          tip: 'CPA=投放金额/新增激活，即拉新用户的广告成本；其中点击新增激活统计口径为有点击组件且历史从未安装app的可监测新用户，快手侧数据为曝光口径，因此快手新增激活统计口径为曝光用户下载App的监测用户量'
        }
        // {
        //   key: 'thumbUpCountNum',
        //   val: 0,
        //   text: '点赞'
        // }

        // {
        //   key: 'appNewDeviceQtyNum',
        //   val: 0,
        //   text: '安卓新增激活'
        // },
      ],
      extFields,
      extCols,
      extColsStatus,
      dialogStatus: false,
      rowInfo: {},
      video: {
        url: '',
        playing: false
      },
      chartsData: null,
      linkType: LINK_TYPE,
      putCountShow: false,
      isBatch: false,
      accoutInfo: {},
      did: '',
      filedList: extFields,
      refresh1: true
    }
  },
  watch: {
    extCols(nVal) {
      Object.keys(this.extColsStatus).forEach((key) => {
        const status = nVal.indexOf(key) !== -1
        this.extColsStatus[key] = status
      })
    }
  },
  created() {
    this.buildFormConf()
    this.getVideoCondition()
    this.getOrgInfo()
    this.getTransferCondition()
    this.getList()
    this.getBusinessTags()
    this.getFundUser()
    this.getVideoType()
    this.getB2CPhoneModel()
    this.getBasePlat()
  },
  mounted() {
    this.did = this.$store.state.user.userInfo.did
    const query = this.$route.query
    if (Object.keys(query).length) {
      this.$set(this.$refs.search.form, 'platId', +query.platId || '')
      this.$set(this.$refs.search.form, 'accountId', +query.accountId || '')
      const ajax =
          this.pageType === 'putting_manager'
            ? $getAccountPuttingByPlatIdNew
            : $getAccountPuttingByPlatId
        ajax({ platId: query.platId }).then((res) => {
          if (res.code === 1) {
            this.normalFormItemMap.accountId.data = res.data
          }
        })
      this.searchData.accountId = query.accountId
      this.searchData.platId = query.platId
      this.timerange = ''
      this.searchData.timerange = ''
    }
    this.getList()
  },
  methods: {
    formatFileds(did) {
      const filedList = copy(this.filedList)
      const A2List = [
        { status: false, fieldName: 'advertiserRealname', chn_name: '广告师' },
        { status: false, fieldName: 'deliveryName', chn_name: '投放专员' },
        { status: false, fieldName: 'fansNum', chn_name: '粉丝数' },
        { status: false, fieldName: 'cptClick', chn_name: '组件点击量' },
        { status: false, fieldName: 'c2bRecAllFinishOrderQtySum', field_id: 12, chn_name: 'C2B总成交量' }
      ]
      var A5List = [
        { status: false, fieldName: 'advertiserRealname', chn_name: '广告师' },
        { status: false, fieldName: 'cptClick', chn_name: '组件点击量' },
        { status: false, fieldName: 'activeUV', chn_name: '新增激活' },
        { status: false, fieldName: 'cpa', chn_name: 'CPA' },
        { status: false, fieldName: 'b2cPhoneNetPayOrderQtySum', chn_name: 'B2C手机净支付数量' }
      ]
      let list = [...this.filedList]
      if (+did === 80) {
        list = filedList.concat(A2List)
      } else if (+did === 891) {
        list = filedList.concat(A5List)
      }
      this.extFields = list
      this.extColsStatus = {}
      this.extCols = []
      this.extFields.forEach((item) => {
        if (item.status) {
          this.extCols.push(item.fieldName)
        }
        this.extColsStatus[item.fieldName] = item.status
      })
    },
    async getBasePlat() {
      const res = await $getBasePlat()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data
      }
    },
    getOrgInfo() {
      if (!this.normalFormItemMap.dId && !this.normalFormItemMap.fId) {
        return
      }
      const ajax =
        this.pageType === 'putting_manager' ? $getFundOrgIdNew : $getFundOrgId
      ajax()
        .then((res) => {
          if (res.code === 1) {
            const org = this.normalFormItemMap.dId || this.normalFormItemMap.fId
            org.data = res.data
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    },
    async getList(type) {
      if (type === 1) this.refresh1 = false
      this.loading = true
      const params = copy(this.searchData)
      if (params.timerange) {
        params.addTimeStart = params.timerange[0] || ''
        params.addTimeEnd = params.timerange[1] || ''
        if (params.addTimeEnd) {
          params.addTimeEnd += ' 23:59:59'
        }
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      try {
        const ajax =
          this.pageType === 'putting_manager'
            ? $getVideoPuttingListNew
            : $getVideoPuttingList
        const res = await ajax(params, { timeout: 30000 })
        if (res.code === 1 && res.data) {
           if (type === 1) this.refresh1 = true
          // const wMap = {
          //   flowCountNum: true,
          //   thumbUpCountNum: true,
          //   cptClickNum: true,
          //   deliveryMoneyNum: true
          // }
          this.summaryItems.forEach((t) => {
            t.val = res.data[t.key]
            // if (wMap[t.key] && t.val > 10000) {
            //   t.val = Number((t.val / 10000).toFixed(2))
            //   t.hasW = true
            // } else {
            //   t.hasW = false
            // }
          })
          this.tableData = res.data.list || []
          this.total = res.data.total || 0
        } else {
          if (type === 1) this.refresh1 = true
          this.$message.error(res.message)
        }
        if (type === 1) this.refresh1 = true
        this.loading = false
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        if (type === 1) this.refresh1 = true
        this.loading = false
        this.$message.error(err.message)
      }
    },

    async getVideoType(val) {
      const res = await $getVideoType({ brand: val })
      const { code, data = [] } = res || {}
      if (+code === 1) {
        this.normalFormItemMap.junType.data = data
      }
    },

    /*
     * 获取业务标签
     */
    getBusinessTags() {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then((res) => {
        if (res.code === 1) {
          this._businessTags = res.data
          this.normalFormItemMap.businessTag.data = unique(
            [
              ...res.data.zz_putting_business_tag,
              ...res.data.zlj_putting_business_tag
            ],
            'dictValue'
          )
          // this.businessTags = res.data.zz_putting_business_tag
        }
      })
    },

    getFundUser() {
      $getFundUser().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.advertiserUserId.data = res.data
          this.normalFormItemMap.deliveryId.data = res.data
          this.normalFormItemMap.choreographerId.data = res.data
        }
      })
    },

    async getVideoCondition() {
      const ajax =
        this.pageType === 'putting_manager'
          ? $getVideoConditionNew
          : $getVideoCondition
      const res = await ajax()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.platInfo
        this.normalFormItemMap.accountId.data = res.data.accountInfo
        // this.normalFormItemMap.deliveryId.data = res.data.simpleUserInfo
        // this.normalFormItemMap.orgId.data = res.data.orgInfo
        this.normalFormItemMap.contentType.data = res.data.contentType.map(
          (item) => ({ text: item, val: item })
        )
        // this.normalFormItemMap.junType.data = res.data.junType.map(item => ({ text: item, val: item }))
      }
    },
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      let normal = [
        {
          type: 'select',
          key: 'videoTag',
          // ,"value": ""
          data: [
            { val: '转转', text: '转转' },
            { val: '找靓机', text: '找靓机' }
          ],
          conf: {
            placeholder: '品牌标签'
          }
        },
        {
          type: 'select',
          key: 'businessTag',
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue',
          data: [],
          conf: {
            placeholder: '业务标签'
          }
        },
        {
          type: 'cascader',
          key: 'b2cPhoneModelIdStrs',
          data: [],
          conf: {
            placeholder: '请选择产品型号',
            props: { value: 'modelId', expandTrigger: 'hover', label: 'modelName', children: 'phoneModelVOList', multiple: true },
            collapseTags: true,
            filterable: true,
            showAllLevels: false,
            ref: 'cascader',
            filterMethod: (node, val) => {
              const REP = /\s+/g
              const txt = (node.text || '').replace(REP, '')
              const value = (val || '').replace(REP, '')
              if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
                return true
              }
            }
          },
          optionValKey: 'modelId',
          optionLabelKey: 'modelName'
        },
        {
          type: 'select',
          key: 'junType',
          optionLabelKey: 'junType',
          optionValKey: 'junType',
          data: [],
          conf: {
            placeholder: '视频类型'
          }
        },
        {
          type: 'select',
          key: 'contentType',
          data: [],
          conf: {
            placeholder: '内容类别'
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
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'input',
          key: 'titleName',
          data: '',
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
          permissionName: 'putting_video_d_id'
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
          permissionName: 'putting_video_f_id'
        },
        {
          type: 'select',
          key: 'advertiserUserId',
          data: [],
          conf: {
            placeholder: '请选择广告师'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
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
          key: 'choreographerId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '编导人员'
          }
        },
        // {
        //   type: 'select',
        //   key: 'junType',
        //   data: [],
        //   conf: {
        //     placeholder: '视频类型'
        //   }
        // },
        // {
        //   type: 'input',
        //   key: 'phone',
        //   data: '',
        //   conf: {
        //     placeholder: '请输入联系方式'
        //   }
        // },
        {
          type: 'input',
          key: 'orderCommand',
          data: [],
          conf: {
            placeholder: '请输入口令'
          }
        }
        // {
        //   type: 'input',
        //   key: 'belongTeam',
        //   data: '',
        //   conf: {
        //     placeholder: '所属机构'
        //   }
        // }
        // {
        //   type: 'input',
        //   key: 'androidDeliveryName',
        //   data: '',
        //   conf: {
        //     placeholder: '组件渠道号'
        //   }
        // }
      ]

      const normalFormItemMap = {}
      normal = normal.filter((item, index) => {
        if (item.permissionName && !this.$permission(item.permissionName)) {
          return false
        }
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: this.$permission('putting_video_export')
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
        model.accountId = ''
        this.normalFormItemMap.accountId.data = []
        const ajax =
          this.pageType === 'putting_manager'
            ? $getAccountPuttingByPlatIdNew
            : $getAccountPuttingByPlatId
        ajax({ platId: val }).then((res) => {
          if (res.code === 1) {
            this.normalFormItemMap.accountId.data = res.data
          }
        })
        return
      }
      if (item.key === 'dId') {
        model.fId = ''
        model.advertiserUserId = ''
        model.choreographerId = ''
        this.normalFormItemMap.fId.data = []
        this.normalFormItemMap.advertiserUserId.data = []
        this.normalFormItemMap.choreographerId.data = []
        this.getTransferCondition(val)
        if (!val) return
        this.formatFileds(val)
        const ajax =
          this.pageType === 'putting_manager' ? $getFundOrgIdNew : $getFundOrgId
        ajax({ orgId: val })
          .then((res) => {
            if (res.code === 1) {
              this.normalFormItemMap.fId.data = res.data
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            if (err.__CANCEL__) {
              return
            }
            this.$message.error(err.message)
          })
      }
      if (item.key === 'fId') {
        model.advertiserUserId = ''
        model.choreographerId = ''
        this.normalFormItemMap.advertiserUserId.data = []
        this.normalFormItemMap.choreographerId.data = []
        this.getTransferCondition(val)
      }
      if (item.key === 'videoTag') {
        this.getVideoType(val)
        model.businessTag = ''
        if (!val) {
          this.normalFormItemMap.businessTag.data = unique(
            [
              ...this._businessTags.zz_putting_business_tag,
              ...this._businessTags.zlj_putting_business_tag
            ],
            'dictValue'
          )
          return
        }
        if (val === '找靓机') {
          this.normalFormItemMap.businessTag.data =
            this._businessTags.zlj_putting_business_tag
        } else {
          this.normalFormItemMap.businessTag.data =
            this._businessTags.zz_putting_business_tag
        }
      }
    },
    // 获取广告师
    getTransferCondition(orgId) {
      const $api =
        this.pageType === 'putting_manager'
          ? $getTransferConditionNew
          : $getTransferCondition
      $api({ orgId }).then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.advertiserUserId.data = res.data
          this.normalFormItemMap.choreographerId.data = res.data
        }
      })
    },
    /**
     * 表格按钮点击响应函数
     * @param  {Object}  row   对应行数据
     */
    async onCellBtn(row) {
      const { flowId, androidDeliveryName, orderId, platId, monitoringModeType } = row
      this.rowInfo = { flowId, androidDeliveryName, orderId, platId, monitoringModeType }
      this.dialogStatus = true
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      this.searchData.pageNum = 1
      this.searchData = Object.assign({}, this.searchData, data, {
        timerange: this.timerange
      })
      if (this.$refs.search.$refs.cascader) {
        this.searchData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
          return !item.hasChildren
        }).map(item => {
          return item.data.modelId
        }).join(',')
      }
      // this.searchData.b2cPhoneModelId = this.searchData.b2cPhoneModelId && this.searchData.b2cPhoneModelId.length ? this.searchData.b2cPhoneModelId[this.searchData.b2cPhoneModelId.length - 1] : ''
      this.getList(1)
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data, {
        timerange: this.timerange
      })
      if (params.timerange) {
        params.addTimeStart = params.timerange[0]
        params.addTimeEnd = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId

      if (this.$refs.search.$refs.cascader) {
        params.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
          return !item.hasChildren
        }).map(item => {
          return item.data.modelId
        }).join(',')
      }
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      window.open(
        `/api/business/foreign/videoPutting${
          this.pageType === 'putting_manager' ? '/new' : ''
        }/export?${qs.stringify(params)}&componentId=${this.$componentId}`
      )
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        this.normalFormItemMap.b2cPhoneModelIdStrs.data = data || []
      }
    },
    handlePutCountShow(row) {
      console.info('--row', row)
      this.putCountShow = true
      this.accoutInfo = row
      this.isBatch = false
      this.accoutInfo.accountIds = [row.accountId]
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .total-wrap {
    background: rgba(0, 95, 246, 0.05);
  }
}
.video-link-info {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 17px;
}

::v-deep {
  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 180px;
  }

  .el-cascader__search-input {
    // display: none;
  }
}
</style>
