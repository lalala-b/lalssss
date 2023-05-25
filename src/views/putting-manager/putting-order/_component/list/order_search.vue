<!-- eslint-disable no-const-assign -->
<!-- eslint-disable no-const-assign -->
<template>
  <div class="C-puttig-order-search search-view">
    <v-search
      ref="search"
      :config="formConf"
      @submit="onSubmit"
      @export="onExport"
      @change="onSearchChange"
    >
      <template v-slot:cascader>
        <VirtualCascader
          v-model="virtualData"
          :options="advFormItemMap.b2cPhoneModelIdStrs.data"
          placeholder="请选择产品型号"
        />
      </template>
      <!-- 平台消耗金额 -->
      <template v-slot:normal="target">

        <el-form-item label="平台消耗金额">
          <flex-row :no-bottom="true">
            <el-input-number
              v-model="target.model.xingtuAmountStart"
              class="text-a-l"
              :max="100000000"
              :min="0"
              :controls="false"
              placeholder="金额最小值"
            />
            <span class="m-r-5 m-l-5">至</span>
            <el-input-number
              v-model="target.model.xingtuAmountEnd"
              class="text-a-l"
              :max="100000000"
              :min="0"
              :controls="false"
              placeholder="金额最大值"
            />
          </flex-row>
        </el-form-item>
        <template v-if="tabType === 'TeamOrder'">
          <el-form-item label="订单创建时间">
            <el-date-picker
              v-model="target.model.createdTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
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
        <el-form-item
          v-if="['AccountingOrder', 'TeamOrder'].includes(tabType)"
          label="返款时间"
        >
          <el-date-picker
            v-model="target.model.rebateTime"
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
        <el-form-item v-if="tabType==='TeamOrder'" label="平台任务创建时间">
          <el-date-picker
            v-model="target.model.thirdOrderIdTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
      </template>
      <template v-slot:btns="target">
        <el-link v-if="downLoading&&tabType==='TeamOrder'" class="m-l-8" type="warning" disabled>文件下载中...</el-link>
        <!-- 仅liudie可以导出 -->
        <!-- <el-button v-if="this.$store.state.user.userInfo.id === 1206" v-log @click="handleExportMail">导出邮寄信息</el-button> -->
        <div
          v-if="['MyOrder', 'AccountingOrder', 'TeamOrder'].includes(tabType)"
          class="flex-inline flex-justify-end m-l-24 screen"
        >
          <el-checkbox
            v-model="target.model.rebateAmountFlag"
            :true-label="1"
            :false-label="null"
            @change="onSubmit(target.model)"
          >含返款</el-checkbox>
          <el-checkbox
            v-model="target.model.rebateScreenshotFlag"
            :true-label="1"
            :false-label="null"
            @change="onSubmit(target.model)"
          >已上传返款截图</el-checkbox>
          <el-checkbox
            v-model="target.model.addAmountFlag"
            :true-label="1"
            :false-label="null"
            @change="onSubmit(target.model)"
          >含补款</el-checkbox>
          <!-- <el-checkbox v-model="searchData.contractUrlFlag" :true-label="1" :false-label="null" @change="getSearchData">已上传合同</el-checkbox> -->
          <!-- <div class="m-l-24">
          <span class="m-r-10">是否已确认合同</span>
          <el-radio-group v-model="searchData.confirmContractUrlFlag" @change="getSearchData">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div> -->
          <div class="m-l-24">
            <span class="m-r-10">订单是否放弃合作</span>
            <el-radio-group
              v-model="target.model.orderCooperationStatus"
              @change="onSubmit(target.model)"
            >
              <el-radio :label="0">否</el-radio>
              <el-radio :label="1">是，达人放弃合作</el-radio>
              <el-radio :label="2">是，我司放弃合作</el-radio>
            </el-radio-group>
          </div>

          <div v-if="tabType === 'TeamOrder'" class="m-l-24">
            <el-button
              v-if="$permission('mail_order_export')"
              type="primary"
              @click="handleBulkExport"
            >含邮寄信息订单导出</el-button>
            <el-button
              v-if="$permission('mail_order_import')"
              type="primary"
              @click="handleBulkImport"
            >邮寄快递单号批量导入</el-button>
          </div>
        </div>
      </template>
    </v-search>
  </div>
</template>
<script>
import Search from '@/components/Search'
import qs from 'qs'
import VirtualCascader from '@/components/VirtualCascader'
import {
  $getAccountPuttingByPlatId,
  $getTransferCondition,
  $getFundOrgId
} from '@/api/bussiness-manage'
import { $getDataByDictType } from '@/api'
import { $getFundUser, $getPlusAccountInfo } from '@/api/putting-manager'
import { $getB2CPhoneModel } from '@/api/bussiness-manage'
// import { downloadFile } from '@/utils/download'
import { $getGroupOrder } from '@/api/putting-manager'
import axios from 'axios'
import { copy } from '@/utils'
const XT_ACCOUNT_ID = [
  {
    val: 1,
    text: '向乾'
  },
  {
    val: 2,
    text: '乾派'
  },
  {
    val: 3,
    text: '快接单'
  },
  {
    val: 4,
    text: '线下'
  },
  {
    val: 5,
    text: '北京'
  }
]

export default {
  components: {
    vSearch: Search,
    VirtualCascader
    // DepartmentSelect
  },
  props: {
    exportPermission: {
      type: String,
      default: ''
    },
    businessStatus: {
      type: String,
      default: ''
    },
    platData: {
      type: Array,
      default() {
        return []
      }
    },
    accountData: {
      type: Array,
      default() {
        return []
      }
    },
    deliveryData: {
      type: Array,
      default() {
        return []
      }
    },
    orgInfo: {
      type: Array,
      default() {
        return []
      }
    },
    tabType: {
      type: String,
      default: ''
    },
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const id = 0
    return {
      formConf: {},
      _businessTags: {},
      config: {
        filterable: true,
        clearable: true,
        allowCreate: true,
        defaultFirst: true,
        placeholder: '请选择账号',
        optionLabelKey: 'accountName',
        optionValKey: 'accountId'
      },
      flag: false,
      cascaderProps: {
        checkStrictly: false,
        children: 'phoneModelVOList',
        emitPath: false,
        multiple: true,
        label: 'modelName',
        value: 'modelId'
      },
      virtualData: [],
      downLoading: false,
      getPlusAccountInfo: $getPlusAccountInfo
    }
  },
  watch: {
    platData(val) {
      this.advFormItemMap.platId.data = val
    },
    // accountData(val) {
    //   this.advFormItemMap.cusAccountId.data = val
    // },
    deliveryData: {
      handler(val) {
        // if (val && val.length && this.tabType !== 'MyOrder' && this.advFormItemMap) {
        if (val && val.length && this.advFormItemMap) {
          this.advFormItemMap.deliveryId.data = val
        }
      },
      immediate: true
    },
    businessStatus(status) {
      const tabType = this.tabType
      if (
        (tabType === 'WaitOrder' ||
          tabType === 'PaymentOrder' ||
          tabType === 'PublishSubmit' ||
          tabType === 'AccountingOrder') &&
        status === '7'
      ) {
        const config = {
          type: 'select',
          key: 'chargeType',
          data: require('@/const').PUT_CHARGE_TYPE_ARR,
          conf: {
            placeholder: '请选择计费方式'
          }
        }
        this.formConf.normal.splice(5, 0, config)
        this.advFormItemMap.chargeType = config
      } else {
        if (this.advFormItemMap.chargeType) {
          this.formConf.normal.splice(5, 1)
        }
        this.$refs.search.form.chargeType = null
        this.$delete(this.advFormItemMap, 'chargeType')
      }
      this.updateSearchData(this.$refs.search.form)
      this.$emit('updateSearchData', this.searchData)

      this.$set(this.$refs.search.form, 'orderPaymentFlag', '')
    },
    orgInfo(val) {
      if (this.tabType !== 'MyOrder') {
        const org = this.advFormItemMap.dId || this.advFormItemMap.fId
        org && (org.data = val)
      }
    }
  },
  created() {
    this.buildFormConf()
    this.getBusinessTag()
    this.getFundUser()
    if (this.tabType === 'TeamOrder') {
       this.getB2CPhoneModel()
    }

    if (this.platData) {
      this.advFormItemMap.platId.data = this.platData
    }
    // if (this.accountData) {
    //   this.advFormItemMap.cusAccountId.data = this.accountData
    // }
    if (this.deliveryData && this.tabType !== 'MyOrder') {
      this.advFormItemMap.deliveryId.data = this.deliveryData
    }
    if (this.orgInfo && this.tabType !== 'MyOrder') {
      const org = this.advFormItemMap.dId || this.advFormItemMap.fId
      org && (org.data = this.orgInfo)
    }
  },
  methods: {
    filterMethod(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (
        !!~txt.indexOf(val) ||
        !!~txt.toUpperCase().indexOf(value.toUpperCase())
      ) {
        return true
      }
    },
    visibleChange(val) {
      if (val) {
        console.info(val)// 此处可以出来选中下拉选项，清空input搜索值
      }
      this.$nextTick(() => {
        // 添加这段代码
        const $el = document.querySelectorAll('.el-cascader-panel .el-cascader-node[aria-owns]')
        Array.from($el).map((item) => item.removeAttribute('aria-owns'))// 消除dom层级之间的关系
      })
    },
    handleVideoTagChange(value) {
      this.$refs.search.form.businessTag = ''
      if (value === '找靓机') {
        this.advFormItemMap.businessTag.data =
          this._businessTags.zlj_putting_business_tag
      } else {
        this.advFormItemMap.businessTag.data =
          this._businessTags.zz_putting_business_tag
      }
    },
    // 获取业务标签
    getBusinessTag() {
      $getDataByDictType({
        dictTypes: ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }).then((res) => {
        if (res.code === 1) {
          this._businessTags = res.data
          if (this.$refs.search.form.videoTag === '找靓机') {
            this.advFormItemMap.businessTag.data =
              this._businessTags.zlj_putting_business_tag
          } else {
            this.advFormItemMap.businessTag.data =
              this._businessTags.zz_putting_business_tag
          }
          // this.businessTags = res.data.zz_putting_business_tag
        }
      })
    },
    getFundUser() {
      $getFundUser().then((res) => {
        if (res.code === 1) {
          this.advFormItemMap.advertiserUserId.data = res.data
          if (this.advFormItemMap.choreographerId) {
            this.advFormItemMap.choreographerId.data = res.data
          }
        }
      })
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
        // this.advFormItemMap.cusAccountId.data = []
        $getAccountPuttingByPlatId({ platId: val }).then((res) => {
          if (res.code === 1) {
            // this.advFormItemMap.cusAccountId.data = res.data
          }
        })
        return
      } else if (item.key === 'videoTag') {
        this.handleVideoTagChange(val)
      }
      if (item.key === 'dId') {
        model.fId = ''
        model.advertiserUserId = ''
        model.choreographerId = ''
        this.advFormItemMap.fId.data = []
        this.advFormItemMap.advertiserUserId.data = []
        if (this.advFormItemMap.choreographerId) {
          this.advFormItemMap.choreographerId.data = []
        }
        this.getTransferCondition(val)
        if (!val) {
          return
        }

        $getFundOrgId({ orgId: val })
          .then((res) => {
            if (res.code === 1) {
              this.advFormItemMap.fId.data = res.data
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
        this.advFormItemMap.advertiserUserId.data = []
        if (this.advFormItemMap.choreographerId) {
          this.advFormItemMap.choreographerId.data = []
        }
        this.getTransferCondition(val)
      }
    },
    // 获取广告师
    getTransferCondition(orgId) {
      $getTransferCondition({ orgId })
        .then((res) => {
          if (res.code === 1) {
            this.advFormItemMap.advertiserUserId.data = res.data
            if (this.advFormItemMap.choreographerId) {
              this.advFormItemMap.choreographerId.data = res.data
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
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
            placeholder: '请选择平台'
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          isAccountName: true,
          lazyLoadApi: this.getPlusAccountInfo,
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          }
        },
        // {
        //   type: 'cascaderSlot',
        //   slotName: 'accountSelect',
        //   key: 'cusAccountId',
        //   data: []
        // },
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
          key: 'videoTag',
          data: [
            {
              val: '转转',
              text: '转转'
            },
            {
              val: '找靓机',
              text: '找靓机'
            }
          ],
          conf: {
            placeholder: '请选择品牌标签'
          }
        },
        {
          type: 'select',
          key: 'businessTag',
          data: [],
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue',
          conf: {
            placeholder: '请选择业务标签'
          }
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
            placeholder: '请选择投放专员'
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
        {
          type: 'input',
          key: 'androidDeliveryName',
          data: [],
          conf: {
            placeholder: '请输入组件渠道号'
          }
        },
        {
          type: 'input',
          key: 'orderNumber',
          data: [],
          conf: {
            placeholder: '请输入乾数据订单号'
          }
        },
        {
          type: 'input',
          key: 'orderCommand',
          data: [],
          conf: {
            placeholder: '请输入口令'
          }
        }
      ]
      if (this.tabType === 'TeamOrder') {
        normal.splice(0, 0, {
          type: 'select',
          key: 'businessStatus',
          data: [
            {
              val: '1,2',
              text: '待审核'
            },
            {
              val: '5',
              text: '待下单付款'
            },
            {
              val: '6',
              text: '待发布提交'
            },
            {
              val: '17',
              text: '待平台订单完成'
            },
            {
              val: '7',
              text: '待资金核算'
            },
            {
              val: '8',
              text: '已驳回'
            },
            {
              val: '9',
              text: '已取消'
            },
            {
              val: '10',
              text: '已完成'
            }
          ],
          conf: {
            placeholder: '请选择订单状态'
          }
        })
        normal.splice(6, 0, {
          type: 'cascaderSlot',
          key: 'b2cPhoneModelIdStrs',
          data: []
          // conf: {
          //   placeholder: '请选择产品型号',
          //   props: {
          //     value: 'modelId',
          //     expandTrigger: 'hover',
          //     label: 'modelName',
          //     children: 'phoneModelVOList',
          //     multiple: true
          //   },
          //   collapseTags: true,
          //   showAllLevels: false,
          //   filterable: true,
          //   ref: 'cascader',
          //   filterMethod: (node, val) => {
          //     const REP = /\s+/g
          //     const txt = (node.text || '').replace(REP, '')
          //     const value = (val || '').replace(REP, '')
          //     if (
          //       !!~txt.indexOf(val) ||
          //       !!~txt.toUpperCase().indexOf(value.toUpperCase())
          //     ) {
          //       return true
          //     }
          //   }
          // },
          // optionValKey: 'modelId',
          // optionLabelKey: 'modelName'
        })

        normal.splice(8, 0, {
          type: 'select',
          key: 'choreographerId',
          data: [],
          conf: {
            placeholder: '请选择编导'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        })
        normal.splice(13, 0, {
          type: 'input',
          key: 'thirdOrderId',
          data: [],
          conf: {
            placeholder: '请输入平台订单ID'
          }
        })
      }
      switch (this.tabType) {
        case 'TeamOrder':
        case 'PaymentOrder':
        case 'PublishSubmit':
        case 'AccountingOrder':
          normal.unshift({
            type: 'select',
            key: 'fId',
            data: [],
            optionLabelKey: 'orgName',
            optionValKey: 'orgId',
            conf: {
              placeholder: '请选择团'
            },
            permissionName: 'adv_lau_order_f_id'
          })
          normal.unshift({
            type: 'select',
            key: 'dId',
            data: [],
            optionLabelKey: 'orgName',
            optionValKey: 'orgId',
            conf: {
              placeholder: '请选择军'
            },
            permissionName: 'adv_lau_order_d_j_id'
          })
          break
      }
      if (this.tabType === 'PaymentOrder') {
        normal.push({
          type: 'select',
          key: 'approvalPaymentProgress',
          data: [
            {
              val: '1',
              text: '正常下单'
            },
            {
              val: '2',
              text: '延后下单'
            }
          ],
          conf: {
            placeholder: '请选择下单付款进度'
          }
        })
      }
      if (this.tabType === 'AccountingOrder') {
        const config = {
          type: 'select',
          key: 'chargeType',
          data: require('@/const').PUT_CHARGE_TYPE_ARR,
          conf: {
            placeholder: '请选择计费方式'
          }
        }
        normal.splice(
          normal.findIndex((item) => item.key === 'videoTag'),
          0,
          config
        )
      }
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
        hasExport: this.exportPermission
          ? this.$permission(this.exportPermission)
          : true
      }
    },
    formatData(data) {
      const params = copy(data)
      params.pageNum = 1
      if (params.timerange) {
        params.preReleaseVideoTimeStart = params.timerange[0]
        params.preReleaseVideoTimeEnd = params.timerange[1]
        delete params.timerange
      } else {
        params.preReleaseVideoTimeStart = ''
        params.preReleaseVideoTimeEnd = ''
      }

      if (params.createdTime) {
        params.createdTimeStart =
          params.createdTime[0] + ' 00:00:00'
        params.createdTimeEnd =
          params.createdTime[1] + ' 23:59:59'
        delete params.createdTime
      } else {
        params.createdTimeStart = ''
        params.createdTimeEnd = ''
      }

      if (params.addTimerange) {
        params.addTimeStart =
          params.addTimerange[0] + ' 00:00:00'
        params.addTimeEnd =
          params.addTimerange[1] + ' 23:59:59'
        delete params.addTimerange
      } else {
        params.addTimeStart = ''
        params.addTimeEnd = ''
      }

      if (params.rebateTime) {
        params.rebateTimeBegin = params.rebateTime[0]
        params.rebateTimeEnd = params.rebateTime[1]
        delete params.rebateTime
      } else {
        params.rebateTimeBegin = ''
        params.rebateTimeEnd = ''
      }

      if (params.thirdOrderIdTime) {
        params.thirdOrderIdTimeStart = params.thirdOrderIdTime[0] + ' 00:00:00'
        params.thirdOrderIdTimeEnd = params.thirdOrderIdTime[1] + ' 23:59:59'
        delete params.thirdOrderIdTime
      } else {
        params.thirdOrderIdTimeStart = ''
        params.thirdOrderIdTimeEnd = ''
      }

      params.orgId = params.fId || params.dId || null
      delete params.fId
      delete params.dId
      // tab类型
       if (this.businessStatus) {
        params.businessStatus =
          +this.businessStatus === 0 ? null : this.businessStatus
      }
      params.b2cPhoneModelIds = this.virtualData
      return params
    },
    updateSearchData(data) {
      this.searchData = Object.assign({}, this.searchData, data)
      this.searchData.pageNum = 1
      if (this.searchData.timerange) {
        this.searchData.preReleaseVideoTimeStart = this.searchData.timerange[0]
        this.searchData.preReleaseVideoTimeEnd = this.searchData.timerange[1]
        delete this.searchData.timerange
      } else {
        this.searchData.preReleaseVideoTimeStart = ''
        this.searchData.preReleaseVideoTimeEnd = ''
      }

      if (this.searchData.createdTime) {
        this.searchData.createdTimeStart =
          this.searchData.createdTime[0] + ' 00:00:00'
        this.searchData.createdTimeEnd =
          this.searchData.createdTime[1] + ' 23:59:59'
        delete this.searchData.createdTime
      } else {
        this.searchData.createdTimeStart = ''
        this.searchData.createdTimeEnd = ''
      }

      if (this.searchData.addTimerange) {
        this.searchData.addTimeStart =
          this.searchData.addTimerange[0] + ' 00:00:00'
        this.searchData.addTimeEnd =
          this.searchData.addTimerange[1] + ' 23:59:59'
        delete this.searchData.addTimerange
      } else {
        this.searchData.addTimeStart = ''
        this.searchData.addTimeEnd = ''
      }

      if (this.searchData.rebateTime) {
        this.searchData.rebateTimeBegin = this.searchData.rebateTime[0]

        this.searchData.rebateTimeEnd = this.searchData.rebateTime[1]
        delete this.searchData.rebateTime
      } else {
        this.searchData.rebateTimeBegin = ''
        this.searchData.rebateTimeEnd = ''
      }
      if (this.searchData.thirdOrderIdTime) {
        this.searchData.thirdOrderIdTimeStart = this.searchData.thirdOrderIdTime[0] + ' 00:00:00'
        this.searchData.thirdOrderIdTimeEnd = this.searchData.thirdOrderIdTime[1] + ' 23:59:59'
      } else {
        this.searchData.thirdOrderIdTimeStart = ''
        this.searchData.thirdOrderIdTimeEnd = ''
      }
      delete this.searchData.thirdOrderIdTime

      if (this.businessStatus) {
        this.searchData.businessStatus = this.businessStatus
      } else {
        this.searchData.businessStatus = data.businessStatus || null
      }
      this.searchData.orgId = data.fId || data.dId || null
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      const params = this.formatData(data)
      this.searchData = Object.assign({}, this.searchData, params)
      // this.updateSearchData(data)
      // this.searchData.b2cPhoneModelIds = this.virtualData
      this.$emit('getTableData', this.searchData)
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const tabType = this.tabType
      let params = Object.assign({}, this.searchData, data)
      if (
        tabType === 'WaitOrder' ||
        tabType === 'PaymentOrder' ||
        tabType === 'PublishSubmit' ||
        tabType === 'AccountingOrder'
      ) {
        params = Object.assign(this.$parent.searchData, params)
      }
      const _params = this.formatData(params)
      let url = ''
      switch (this.tabType) {
        case 'MyOrder':
          url = '/api/delivery/new/exportSelfOrder'
          break
        case 'TeamOrder':
          url = '/api/delivery/new/exportGroupOrder'
          break
        case 'WaitOrder':
        case 'PaymentOrder':
        case 'PublishSubmit':
        case 'AccountingOrder':
          url = '/api/delivery/new/exportWaitApprovalOrder'
          break
      }
      if (this.tabType === 'TeamOrder') {
        this.getTotal(_params, url)
      } else {
        window.open(
        `${url}?${qs.stringify(_params)}&componentId=${this.$componentId}`
        )
      }
    },
    /**
     * search表单参数格式化
     */
    formSearchData(params) {
      if (params.addTimerange) {
        params.addTimeStart = params.addTimerange[0] + ' 00:00:00'
        params.addTimeEnd = params.addTimerange[1] + ' 23:59:59'
        delete params.addTimerange
      }
      if (params.timerange) {
        params.preReleaseVideoTimeStart = params.timerange[0]
        params.preReleaseVideoTimeEnd = params.timerange[1]
        delete params.timerange
      } else {
        params.preReleaseVideoTimeStart = null
        params.preReleaseVideoTimeEnd = null
      }

      if (params.createdTime) {
        params.createdTimeStart = params.createdTime[0] + ' 00:00:00'
        params.createdTimeEnd = params.createdTime[1] + ' 23:59:59'
        delete params.createdTime
      } else {
        params.createdTimeStart = null
        params.createdTimeEnd = null
      }

      if (params.rebateTime) {
        params.rebateTimeBegin = params.rebateTime[0]
        params.rebateTimeEnd = params.rebateTime[1]
        delete params.rebateTime
      } else {
        params.rebateTimeBegin = null
        params.rebateTimeEnd = null
      }
       if (params.thirdOrderIdTime) {
        params.thirdOrderIdTimeStart = params.thirdOrderIdTime[0] + ' 00:00:00'
        params.thirdOrderIdTimeEnd = params.thirdOrderIdTime[1] + ' 23:59:59'
        delete params.thirdOrderIdTime
      } else {
        params.thirdOrderIdTimeStart = null
        params.thirdOrderIdTimeEnd = null
      }
      if (this.businessStatus) {
        params.businessStatus =
          this.businessStatus == 0 ? null : this.businessStatus
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
    },
    /**
     * 邮寄快递单号批量导入
     */
    handleBulkImport() {
      this.$emit('handleBulkImport', !this.showDialog)
    },
    /**
     * 邮寄快递单号批量导出
     */
    handleBulkExport() {
      const params = Object.assign({}, this.searchData, this.$refs.search.form)
      // this.formSearchData(params)
      const _params = this.formatData(params)
      const url = '/api/delivery/new/exportGroupMailOrder'
      window.open(
        `${url}?${qs.stringify(_params)}&componentId=${this.$componentId}`
      )
    },
    getTotal(params, url) {
      params = Object.assign({}, this.searchData, params || {}, { pageNum: this.pageNum, size: this.size, determined: this.determined })
      this.params = params
      $getGroupOrder(params).then(res => {
        if (!res.data) return
        const { total } = res.data
        if (total) {
          if (total > 10000) {
            this.$message.error('目前仅支持导出10000条')
          } else {
           this.downloadFile(url, {
            ...params,
            componentId: this.$componentId
           })
          }
        }
      })
    },
    async getB2CPhoneModel() {
      const { code, data } = await $getB2CPhoneModel()
      if (+code === 1) {
        if (this.advFormItemMap.b2cPhoneModelIdStrs) {
          this.advFormItemMap.b2cPhoneModelIdStrs.data = data || []
        }
      }
    },
    downloadFile(url, params) {
      this.downLoading = true
      axios({
        method: 'post',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        url,
        responseType: 'blob',
        data: JSON.stringify(params)
      }).then((res) => {
        let fileName = ''
        const contentDisposition = res.headers['content-disposition']
        if (contentDisposition) {
          fileName = window.decodeURI(
            res.headers['content-disposition'].split('=')[1],
            'UTF-8'
          )
        }

        const blob = new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })
        this.downLoading = false
        if (navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, fileName)
        } else {
          const blobUrl = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = blobUrl
          a.download = fileName
          a.style.display = 'none'
          a.click()
          URL.revokeObjectURL(blobUrl)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.C-puttig-order-search {
  background-color: #fff;
}

.screen {
  flex-wrap: wrap;
}

::v-deep {
  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 180px;
  }
  .el-cascader__tags .el-tag .el-icon-close{
    display: none;
  }
  // .el-cascader__search-input {
  //   display: none;
  // }
}
</style>
