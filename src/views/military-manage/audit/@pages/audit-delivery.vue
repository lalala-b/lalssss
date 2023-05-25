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
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <div class="flex flex-justify-end">
        <!-- <el-button v-log type="primary" size="small" plain @click="onBatchPass(2)">审核通过</el-button> -->
        <el-button v-log type="primary" size="small" plain @click="onBatchPass(2)">审核通过</el-button>
        <!-- <el-button v-log type="danger" size="small" plain @click="onBatchPass(3)">审核不通过</el-button> -->
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
              <div class="flex flex-align-center">
                <div v-if="row.topFiftyFlag === 1" class="m-r-16"> <svg-icon icon-class="hot" /></div>
                <VideoInfo
                  :info="row"
                  :options="{
                    title: 'titleName'
                  }"
                />
              </div>
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
                v-if="s.row.url"
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :underline="false"
                target="_blank"
              ><svg-icon v-if="s.row.topFiftyFlag === 1" icon-class="hot" />{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="addTime" label="发布时间" width="102" />
          <el-table-column prop="platName" label="平台" />
          <el-table-column prop="accountName" label="账号" /> -->
          <el-table-column prop="flowCount" label="总流量" sortable="custom" width="140" />
          <el-table-column prop="addTime" label="查看素材" width="100">
            <template slot-scope="scope">
              <el-button v-log="{operation_module:'查看素材'}" size="small" @click="handleUpload(scope.row)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="b2cPhoneModel" label="产品型号">
            <template slot-scope="scope">
              {{ scope.row.b2cPhoneModel || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="junType" label="视频类型" width="168" />
          <el-table-column prop="speechcraft" label="话术分类" width="180">
            <template slot-scope="{row}">
              <p>{{ row.speechcraft||'--' }}</p>
              <p>{{ row.secondSpeechcraft||'--' }}</p>
              <p>{{ row.thirdSpeechcraft||'--' }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="editName" label="编辑人员" width="120" />
          <el-table-column prop="cutName" label="剪辑人员" width="120" />
          <el-table-column label="审核" width="120">
            <template slot-scope="scope">
              <div v-if="checkVerifyPermission(scope.row) && +scope.row.operationStatus === 2" class="tableColumn">
                <el-select
                  v-model="scope.row.hdStatus"
                  placeholder="请选择"
                  @change="onBatchPass(scope.row.hdStatus, scope.row)"
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
          <el-table-column v-if="$permission('military-review-modify')||$permission('compute_military')" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button v-if="+scope.row.operationStatus === 2&&$permission('military-review-modify')" v-log class="pad0" type="text" @click="handleEdit(scope.row, 'audit')">审核修改</el-button>
              <el-button v-if="+scope.row.operationStatus === 3&&$permission('compute_military')" v-log class="pad0" type="text" @click="handleEdit(scope.row)">申诉修改</el-button>
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
          />
        </div>
      </div>
    </Wrap>
    <appealDialog :required="true" :show.sync="showAppeal" :type="appealType" :dialog-data="editData" @update="onSubmit({})" />
    <upload-dialog
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
import VirtualCascader from '@/components/VirtualCascader'
import { VideoInfo, AccountCard } from 'components'
import { $getExamineCondition, $getVideoExamineList, $batchMVideo, $getDeliveryAccountByOrgIdOrPlatId, $getAuditOrgInfo } from '@/api/military-manage'
import { downloadFile } from '@/utils/download'

import {
  extend,
  copy
} from '@/components/common'
import uploadDialog from '../../@mods/upload-dialog/index'
import { deepClone } from '@/utils'
import qs from 'qs'

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
  flowStart: '',
  flowEnd: '',
  platId: '',
  editName: '',
  cutName: '',
  accountId: '',
  accountName: '',
  belongName: '',
  titleName: '',
  tag: '',
  hdStatus: '',
  pageNum: 1,
  size: 20,
  determined: '',
  junType: '',
  accountType: '',
  topFiftyFlag: '',
  timerange: []
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
        ...SEARCH_MODEL
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
      method_id: 1,
      virtualData: []
    }
  },
  watch: {
    'searchData.pageNum'(nVal, oVal) {
      if (nVal !== oVal) {
        this.searchData.pageNum = nVal
        this.getList()
      }
    }
  },
  created() {
    this.buildFormConf()
    this.getOrgInfo()
    this.getExamineCondition()
    this.getList()
  },
  methods: {
    getOrgInfo(orgId) {
      $getAuditOrgInfo({ orgId }).then(res => {
        if (res.code === 1) {
          const org = orgId ? this.normalFormItemMap.fId : (this.normalFormItemMap.dId || this.normalFormItemMap.fId)
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
      const params = deepClone(this.searchData)
      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      this.loading = true
      try {
        const res = await $getVideoExamineList(params)
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
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
    async getExamineCondition() {
      const res = await $getExamineCondition()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.plats
        this.normalFormItemMap.accountId.data = res.data.accounts
        this.normalFormItemMap.editAndCutId.data = res.data.employeeNameVO
        this.normalFormItemMap.junType.data = res.data.videoType
        // this.normalFormItemMap.orgId.data = res.data.orgInfos
      }
    },
    buildFormConf() {
      let normal = [
        {
          type: 'select',
          key: 'dId',
          conf: {
            placeholder: '选择军'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'd_j_id'
        },
        {
          type: 'select',
          key: 'fId',
          conf: {
            placeholder: '选择团队'
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId',
          permissionName: 'f_id'
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
            allowCreate: false,
            defaultFirst: true
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
          // data: []
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
          data: [],
          optionLabelKey: 'junType',
          optionValKey: 'junType',
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
          }
        },
        {
          type: 'select',
          key: 'editAndCutId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '请输入人员名称'
          }
        }
      ]
      const normalFormItemMap = {}
      normal = normal.filter((item, index) => {
        if (item.permissionName && !this.$permission(item.permissionName)) {
          return false
        }
        SEARCH_MODEL[item.key] = ''
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: true
      }
    },
    /**
     * 批量审核
     * @param {Number} hdStatus  审核状态
     */
    async onBatchPass(hdStatus, row) {
      let flowIds
      if (!row) {
        if (!this.selected.length) {
          this.$message({
            message: '您还没勾选哦',
            type: 'error'
          })
          return
        }

        flowIds = this.selected.map(function(item) {
          return item.flowId
        })
      } else {
        flowIds = [row.flowId]
      }

      if (+hdStatus === 3) {
        this.editData = JSON.parse(JSON.stringify(row))
        this.appealType = 'audit'
        this.showAppeal = true
        return
      }

      const res = await $batchMVideo({ flowIds, hdStatus })
      if (res.code === 1) {
        if (!row) {
          this.$refs.military.clearSelection()
        }
        this.getList()
        this.$message({
          message: res.message,
          type: 'success'
        })
      } else {
        this.getList()
        this.$message({
          message: res.message,
          type: 'error'
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
      switch (item.key) {
          case 'platId':
            this.getAccount(model)
            break
          case 'dId':
            if (!val) {
              model.fId = ''
              this.normalFormItemMap.fId.data = []
            } else {
              this.getOrgInfo(val)
            }
            this.getAccount(model)
            break
          case 'fId':
            this.getAccount(model)
            break
          default:
            this.searchData[item.key] = val
      }
    },
    /**
     * 获取账户列表
     * @param  {Object}  data  请求参数
     * @return {Object}        promise 对象
     */
    getAccount(model) {
      const orgId = model.orgId
      const platId = model.platId
      $getDeliveryAccountByOrgIdOrPlatId({ orgId, platId }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data.accountInfo || []
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
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = extend(this.searchData, data)
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId
      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      // if (this.$refs.search.$refs.cascader) {
      //   params.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      params.b2cPhoneModelIds = this.virtualData
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      // window.location.href = `/api/video/examine/video/putting/export?${qs.stringify(params)}&componentId=${this.$componentId}`
      downloadFile('/api/video/examine/video/putting/export', {
        ...params,
        componentId: this.$componentId
      })
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData = extend(this.searchData, data)
      this.searchData.pageNum = 1

      // if (this.$refs.search.$refs.cascader) {
      //   this.searchData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      this.searchData.b2cPhoneModelIds = this.virtualData
      // this.searchData.b2cPhoneModelId = this.searchData.b2cPhoneModelId && this.searchData.b2cPhoneModelId.length ? this.searchData.b2cPhoneModelId[this.searchData.b2cPhoneModelId.length - 1] : ''
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.iconcuowu {
  color: #ff0000;
  font-size: 14px;
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
</style>
