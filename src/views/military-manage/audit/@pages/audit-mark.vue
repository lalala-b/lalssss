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
        <template v-slot:cascader>
          <VirtualCascader
            v-model="virtualData"
            :options="normalFormItemMap.b2cPhoneModelIdStrs.data"
            placeholder="请选择产品型号"
          />
        </template>
        <template v-slot:normal="target">
          <el-form-item label="流量区间">
            <div class="flex">
              <el-input
                v-model="target.model.flowStart"
                type="number"
                placeholder="流量最小值"
                @change="onSearchChange(target.model.flowStart, {'key': 'flowStart'})"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="target.model.flowEnd"
                type="number"
                placeholder="流量最大值"
                @change="onSearchChange(target.model.flowEnd, {'key': 'flowEnd'})"
              />
            </div>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="target.model.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="onSearchChange(target.model.timerange, {'key': 'timerange'})"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="target.model.topFiftyFlag"
              :true-label="1"
              :false-label="0"
              @change="onSearchChange(target.model.topFiftyFlag, {'key': 'topFiftyFlag'})"
            >仅看火爆视频</el-checkbox>
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <div class="controls">
        <div class="control-item">
          <el-switch
            v-if="$permission('compute_military')"
            v-log
            class="m-r-10"
            :value="militaryLockStatus"
            active-text="开启标记"
            inactive-text="停止标记"
            @change="toggleMilitaryLockStatus()"
          />
        <!-- <template v-if="$permission('compute_military')">
          <div>
            <el-date-picker
              v-model="dateStart"
              disabled
              type="date"
              placeholder="开始时间"
            />
            -
            <el-date-picker
              v-model="dateEnd"
              class="m-r-10"
              type="date"
              placeholder="结束时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            />
          </div>
          <el-button class="m-r-10" type="primary" :disabled="calDsiabled" @click="startCalculation">计算军工</el-button>
          {{ calDsiabled ? '计算军工中' : '暂未开始计算军工' }}
        </template> -->
        </div>
        <div class="flex flex-justify-end control-item">
          <el-button v-log type="primary" size="small" plain @click="onBatchPass(2)">审核通过</el-button>
          <!-- <el-button v-log type="danger" size="small" plain @click="onBatchPass(3)">审核不通过</el-button> -->
        </div>
      </div>
      <div v-loading="loading" class="m-t-16 table-view">
        <el-table
          ref="military"
          v-scrollbar
          :data="tableData"
          header-row-class-name="table-header"
          @selection-change="handleSelectionChange"
          @sort-change="doSort"
        >
          <el-table-column :selectable="checkVerifyPermission" type="selection" width="55" />
          <el-table-column class-name="table-title" align="left" label="视频信息" width="400">
            <template slot-scope="{row}">
              <VideoInfo
                :info="row"
                :options="{
                  title: 'titleName'
                }"
              />
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="账号信息" width="200" align="left">
            <template slot-scope="{row}">
              <AccountCard :info="row" />
            </template>
          </el-table-column>
          <!-- <el-table-column class-name="table-title" label="标题" width="333" align="left">
            <template slot-scope="s">
              <el-link
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :underline="false"
                target="_blank"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="addTime" label="发布时间" width="102" /> -->
          <!-- <el-table-column prop="platName" label="平台" /> -->
          <!-- <el-table-column prop="accountName" label="账号" /> -->
          <el-table-column prop="flowCount" label="总流量" sortable="custom" width="140" />
          <el-table-column prop="thumbUpCount" label="总点赞量" sortable="custom" width="120" />
          <el-table-column prop="addTime" label="查看素材" width="100">
            <template slot-scope="scope">
              <el-button v-log="{operation_module: '查看素材'}" size="small" @click="handleUpload(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="b2cPhoneModel" label="产品型号">
            <template slot-scope="scope">
              {{ scope.row.b2cPhoneModel || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="junType" label="视频类型" width="120" />
          <el-table-column prop="editName" label="编辑人员" width="120" />
          <el-table-column prop="cutName" label="剪辑人员" width="120" />

          <el-table-column prop="influencer" label="网红" width="120">
            <template slot-scope="{ row }">
              {{ row.influencer || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="photographer" label="摄影人员" width="120">
            <template slot-scope="{ row }">
              {{ row.photographer || '--' }}
            </template>
          </el-table-column>

          <el-table-column label="审核" width="130">
            <template slot-scope="scope">
              <div v-if="checkVerifyPermission(scope.row) && +scope.row.operationStatus === 2" class="tableColumn">
                <el-select
                  v-model="scope.row.hdStatus"
                  placeholder="请选择"
                  @change="changeState(scope.row, scope.row.hdStatus)"
                >
                  <el-option
                    v-for="opt in HD_STATUS_OPTS.slice(0, 3)"
                    :key="opt.val"
                    :label="opt.text"
                    :value="opt.val"
                  />
                </el-select>
                <el-tooltip
                  v-if="+scope.row.hdStatus === 3 && scope.row.examineFailureReasons"
                  effect="dark"
                  :content="scope.row.examineFailureReasons"
                  placement="top"
                >
                  <i class="iconfont iconcuowu" />
                </el-tooltip>
              </div>
              <div v-else>
                {{ HD_STATUS_TXT_MAP[scope.row.hdStatus || 1] }}
                <el-tooltip
                  v-if="+scope.row.hdStatus === 3 && scope.row.examineFailureReasons"
                  effect="dark"
                  :content="scope.row.examineFailureReasons"
                  placement="top"
                >
                  <i class="iconfont iconcuowu" />
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column v-if="$permission('military-review-modify')||$permission('compute_military') || $permission('audit_mark_delete')" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="+scope.row.operationStatus === 2&&$permission('military-review-modify')" v-log type="text" @click="handleEdit(scope.row, 'audit')">审核修改</el-button>
              <el-button v-if="+scope.row.operationStatus === 3&&$permission('compute_military')" v-log type="text" @click="handleEdit(scope.row)">申诉修改</el-button>
              <el-button
                v-if="scope.row.videoDeleteFlag && $permission('audit_mark_delete')"
                v-log
                class="deleteButton"
                type="text"
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total" class="pagenation-view">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="searchData.pageNum"
            @current-change="getMarkList"
          />
        </div>
      </div>
    </Wrap>
    <appealDialog v-if="showAppeal" :required="true" :show.sync="showAppeal" :type="appealType" :dialog-data="editData" @update="getMarkList" />
    <upload-dialog
      v-if="showUpload"
      :dialog-data="uploadData"
      readonly
      :show.sync="showUpload"
      @uploadSuccess="onSubmit(searchData)"
    />
  </div>
</template>

<script>
import mixin from '../@coms/mixin'
import commonMixin from '../../@mods/common-mixin'
import appealDialog from '../@coms/appealDialog'
import { VideoInfo, AccountCard } from 'components'
import { $getNextOrgInfo } from '@/api'
import {
  $markChange,
  $getMarkList,
  $batchMVideo,
  $getMarkStatus,
  $getSoilderComputeringFlag,
  $getOrgInfo,
  $getAuditAccountByOrgIdOrPlatId,
  $deleteVideoByFlowId
} from '@/api/military-manage'
import qs from 'qs'
import { downloadFile } from '@/utils/download'

import {
  extend,
  copy,
  isArray
} from '@/components/common'
import uploadDialog from '../../@mods/upload-dialog/index'
import VirtualCascader from '@/components/VirtualCascader'
// 审核状态映射
const HD_STATUS_MAP = {
  '1': '待审核',
  '2': '通过',
  '3': '未通过',
  '4': '无需审核'
}

// 查询状态选择数据
const HD_STATUS = Object.keys(HD_STATUS_MAP).map(function(key) {
  return {
    val: Number(key),
    text: HD_STATUS_MAP[key]
  }
})

// 操作的状态数据
const HD_STATUS_OPTS = HD_STATUS.filter(item => {
  return item.val < 5
})

// 显示用的状态数据
const HD_STATUS_TXT_MAP = copy(HD_STATUS_MAP)
HD_STATUS_TXT_MAP['4'] = '--'

// 搜索参数 model
const SEARCH_MODEL = {
  type_id: '',
  flowStart: '',
  flowEnd: '',
  platId: '',
  editName: '',
  cutName: '',
  editAndCutId: '',
  accountId: '',
  accountName: '',
  belongName: '',
  title: '',
  tag: '',
  hdStatus: '',
  pageNum: '',
  determined: '',
  junType: '',
  accountType: '',
  d_id: '',
  f_id: '',
  timerange: '',
  topFiftyFlag: ''
}

/**
 * 检查数据并处理
 * @param  {Object} item 表格行数据
 * @param  {String} type 操作类型
 */
function checkAndPushSoldier(item, type, soldiers) {
  // 复制一份数据，防止污染
  item[`_${type}_soldiers`] = copy(soldiers || [])
  if (
    !item[`_${type}_soldiers`].some(s => {
      return s.val === item[`${type}_id`]
    })
  ) {
    item[`_${type}_soldiers`].push({
      val: item[`${type}_id`],
      text: item[`${type}_name`]
    })
  }
}

export default {
  components: {
    appealDialog,
    uploadDialog,
    AccountCard,
    VideoInfo,
    VirtualCascader
  },
  mixins: [commonMixin, mixin],
  data() {
    return {
      uploadData: {},
      showUpload: false,
      showAppeal: false,
      appealType: '',
      editData: {},
      dateArr: [],
      searchData: {
      },
      formConf: {},
      optionsData: {},
      videoType: '',
      videoTypeItems: [],
      defVideoType: [],
      soldiers: [],
      videoTypes: [],
      selected: [],
      soldierCut: '',
      soldierEdit: '',
      militaryLockStatus: undefined,
      statusLoading: false,
      nowPage: 1,
      HD_STATUS_OPTS,
      HD_STATUS_TXT_MAP,
      dateStart: '', // 计算军工开始时间
      dateEnd: '', // 计算军工结束时间
      calDsiabled: true,
      virtualData: []
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() > Date.now() || time.getTime() < new Date(this.dateStart)
        }
      }
    }
  },
  mounted() {
    this.buildFormConf()
    this.sysGetCondition()
    this.getMarkStatus()
    this.getMarkList()
    // this.getLastSoilderDate()
    this.getSoilderComputeringFlag()
  },
  beforeDestroy() {
    if (this.times) {
      clearInterval(this.times)
    }
  },
  methods: {
    handleDelete(row) {
      this.$confirm('确定要删除此条数据吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await $deleteVideoByFlowId({ flowId: row.flowId })
        console.info('---res', res)
        if (+res.code === 1) {
          this.$message.success('删除成功')
          this.getMarkList()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 计算军工
    // async startCalculation() {
    //   let { dateStart, dateEnd } = this
    //   if (!dateEnd) {
    //     return this.$message.error('请选择结束日期')
    //   }
    //   let confirm
    //   try {
    //     confirm = await this.$confirm(
    //       `计算军功时间段：${parseTime(dateStart, '{y}-{m}-{d}')}～${dateEnd}, \n 请确认开始计算军功！`,
    //       '操作确认',
    //       {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消'
    //       }
    //     )
    //   } catch (e) {
    //     confirm = false
    //   }
    //   if (!confirm) {
    //     return
    //   }
    //   dateEnd = dateEnd + ' 23:59:59'
    //   $startCalculation({ dateStart, dateEnd }).then((res) => {
    //     if (res.code !== 1) {
    //       this.$message.error(res.message)
    //     }
    //   })
    //   // this.getSoilderComputeringFlag()
    //   this.calDsiabled = true
    //   this.times = setInterval(() => {
    //     this.getSoilderComputeringFlag()
    //   }, 60000)
    // },
    getSoilderComputeringFlag() {
      $getSoilderComputeringFlag().then(res => {
        if (res.code === 1) {
          this.calDsiabled = res.data
        }
      })
    },
    // // 获取计算军工的开始日期
    // getLastSoilderDate() {
    //   $getLastSoilderDate().then((res) => {
    //     if (res.code === 1) {
    //       this.dateStart = res.data.lastSoilderDate
    //     }
    //   })
    // },
    /**
     * 获取标记状态
     */
    async getMarkStatus() {
      const res = await $getMarkStatus()
      if (res.code === 1) {
        this.militaryLockStatus = res.data
      }
    },
    /**
     * 查询表格列表
     */
    async getMarkList(data = {}) {
      this.loading = true
      this.searchChangeButNotSubmit = false
      this.searchData = this.buildReqData(
        extend(this.searchData, data),
        '',
        SEARCH_MODEL
      )
      const parmas = copy(this.searchData)
      parmas.orgId = parmas.fId || parmas.dId || ''
      delete parmas.fId
      delete parmas.dId
      delete parmas.timerange

      // if (this.$refs.search && this.$refs.search.$refs.cascader) {
      //   parmas.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      // parmas.b2cPhoneModelId = data.b2cPhoneModelId && data.b2cPhoneModelId.length ? data.b2cPhoneModelId[data.b2cPhoneModelId.length - 1] : ''
      // const params = {}
      parmas.b2cPhoneModelIds = this.virtualData
      try {
        const res = await $getMarkList(parmas)
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      }
    },
    /**
     * 查询条件列表
     */
    async sysGetCondition() {
      const res = await $getOrgInfo()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.plats
        this.normalFormItemMap.accountId.data = res.data.accounts
        this.normalFormItemMap.junType.data = res.data.videoType
        this.normalFormItemMap.editAndCutId.data = res.data.employeeNameVO
        this.normalFormItemMap.dId.data = res.data.orgs
      }
    },
    /**
     * 切换锁定状态
     */
    async toggleMilitaryLockStatus() {
      if (this.statusLoading) {
        return
      }

      var confirm
      try {
        confirm = await this.$confirm(
          `确定要 ${this.militaryLockStatus ? '停止标记' : '开启标记'} 吗？`,
          '操作确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }
        )
      } catch (e) {
        confirm = false
      }
      if (!confirm) {
        return
      }
      this.statusLoading = true
      const res = await $markChange({
        openStatus: !this.militaryLockStatus
      })
      if (res.code === 1) {
        this.statusLoading = false
        this.militaryLockStatus = !this.militaryLockStatus
        this.$message({
          message: res.message,
          type: 'success'
        })
      } else {
        this.$message.error(res.message)
      }
    },
    /**
     * 审核(单条)
     * @param  {Object} item 审核数据
     */
    async changeState(item, hdStatus) {
      var data = {
        flowIds: [item.flowId],
        hdStatus: item.hdStatus
      }

      if (+hdStatus === 3) {
        this.editData = JSON.parse(JSON.stringify(item))
        this.appealType = 'audit'
        this.showAppeal = true
        return
      }

      const res = await $batchMVideo({ ...data })
      if (res.code === 1) {
        // this.getMarkList()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.getMarkList()
      } else {
        this.getMarkList()
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
    },
    /**
     * 批量审核
     * @param {Number} hdStatus  审核状态
     */
    async onBatchPass(hdStatus) {
      if (!this.selected.length) {
        this.$message({
          message: '您还没勾选哦',
          type: 'error'
        })
        return
      }

      const flowIds = this.selected.map(function(item) {
        return item.flowId
      })
      const res = await $batchMVideo({ flowIds, hdStatus })
      if (res.code === 1) {
        this.$refs.military.clearSelection()
        // this.reload(true, "/getMilitaryData", "post", SEARCH_MODEL);
        this.getMarkList()
        this.$message({
          message: res.message,
          type: 'success'
        })
      }
    },
    handleEdit(rowData, type = '') {
      this.editData = JSON.parse(JSON.stringify(rowData))
      this.appealType = type
      this.showAppeal = true
    },
    // 获取平台数据
    getPlats() {
      return this.getDefPlats().then(re => {
        if (re) {
          this.normalFormItemMap.platId.data = re
        }
      })
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     */
    async onSearchChange(val, item, type, index, model) {
      let res = null
      switch (item.key) {
          case 'platId':
            this.getAccount(model)
            model.accountId = ''
            break
          case 'dId':
            if (val) {
              res = await $getNextOrgInfo({ orgId: val })
              if (res.code === 1) {
                this.normalFormItemMap.fId.data = res.data || []
              }
            } else {
              this.normalFormItemMap.fId.data = []
              model.fId = ''
            }
            model.fId = ''
            model.accountId = ''
            this.getAccount(model)
            break
          case 'fId':
            model.accountId = ''
            this.getAccount(model)
            break
          default:
            this.searchData[item.key] = val
      }
    },
    buildFormConf() {
      var normal = [
        {
          type: 'select',
          key: 'dId',
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          data: [],
          conf: {
            placeholder: '选择军'
          }
        },
        {
          type: 'select',
          key: 'fId',
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          data: [],
          conf: {
            placeholder: '选择团'
          }
        },
        {
          type: 'select',
          key: 'platId',
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          data: [],
          conf: {
            placeholder: '全部平台'
          }
        },
        {
          type: 'select',
          key: 'accountId',
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          data: [],
          conf: {
            placeholder: '请输入账号',
            allowCreate: false,
            defaultFirst: true,
            hasAccount: true
          }
        },
        {
          type: 'input',
          key: 'titleName',
          conf: {
            placeholder: '请输入标题'
          }
        },
        {
          type: 'cascaderSlot',
          key: 'b2cPhoneModelIdStrs',
          data: []
          // conf: {
          //   placeholder: '请选择产品型号',
          //   props: { value: 'modelId', expandTrigger: 'hover', label: 'modelName', children: 'phoneModelVOList', multiple: true },
          //   collapseTags: true,
          //   showAllLevels: false,
          //   filterable: true,
          //   ref: 'cascader',
          //   filterMethod: (node, val) => {
          //     const REP = /\s+/g
          //     const txt = (node.text || '').replace(REP, '')
          //     const value = (val || '').replace(REP, '')
          //     if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
          //       return true
          //     }
          //   }
          // },
          // optionValKey: 'modelId',
          // optionLabelKey: 'modelName'
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
          key: 'hdStatus',
          data: HD_STATUS_OPTS,
          conf: {
            placeholder: '审核状态'
          },
          optionLabelKey: 'text',
          optionValKey: 'val'
        },
        {
          type: 'select',
          key: 'jobType',
          data: [
            { val: 'edit', text: '编辑' },
            { val: 'cut', text: '剪辑' }
          ],
          conf: {
            placeholder: '请选择人员职责'
          },
          optionLabelKey: 'text',
          optionValKey: 'val'
        },
        {
          type: 'select',
          key: 'editAndCutId',
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          data: '',
          conf: {
            placeholder: '请输入人员名称'
          }
        }
      ]
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        SEARCH_MODEL[item.key] = ''
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: true
      }
    },
    getAccount(model) {
      const orgId = model.fId || model.dId || ''
      const platId = model.platId
      $getAuditAccountByOrgIdOrPlatId({ orgId, platId }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data.accountInfo
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 表格选择响应函数
     * @param {Array} val 当前选中的数组
     */
    handleSelectionChange(val) {
      this.selected = val
    },
    /**
     * 额外处理一次表格数据
     * @param {Array} data 表格数据
     */
    processTableData(data) {
      if (isArray(data)) {
        data.forEach(item => {
          checkAndPushSoldier(item, 'cut', this.soldiers)
          checkAndPushSoldier(item, 'edit', this.soldiers)
          // NOTE:
          // lockStatus 0 为可编辑，由于不确定后端是否会对历史数据进行处理，
          // 所以这里手动处理一下这个字段把 null, undefined 等都一同转为 false
          item.lockStatus = Boolean(item.lockStatus)
        })
      }
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      var reqData = this.buildReqData(
        extend(this.searchData, data),
        1,
        SEARCH_MODEL
      )
      reqData.orgId = reqData.fId || reqData.dId || ''
      delete reqData.fId
      delete reqData.dId

      // if (this.$refs.search.$refs.cascader) {
      //   reqData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      reqData.b2cPhoneModelIds = this.virtualData
      // reqData.b2cPhoneModelId = reqData.b2cPhoneModelId && reqData.b2cPhoneModelId.length ? reqData.b2cPhoneModelId[reqData.b2cPhoneModelId.length - 1] : ''
      // window.location.href = `/api/video/examine/export?${qs.stringify(reqData)}&componentId=${this.$componentId}`
      downloadFile('/api/video/examine/export', {
        ...reqData,
        componentId: this.$componentId
      })
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData.pageNum = 1
      this.getMarkList(data)
    }
  }
}
</script>
<style lang="scss" scoped>
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.control-item {
  display: flex;
  align-items: center;
}
.search-view {
  margin-bottom: 0;
}

.iconcuowu {
  color: #ff0000;
  font-size: 14px;
  margin-left: 6px;
}

.tableColumn {
  display: flex;
  align-items: center;
}

::v-deep {
  .el-cascader__tags .el-tag {
    margin: 2px 0 2px 1px;
    max-width: 180px;
  }

  // .el-cascader__search-input {
  //   display: none;
  // }
}

.deleteButton {
  color: #f56c6c;
}
</style>
