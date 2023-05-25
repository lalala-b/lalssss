<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        class="P-militarySearch"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:prv>
          <departmentSelect v-model="searchData.orgId" :inline="true" :need-last-level="false" @orgChange="orgChange" />
        </template>
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
              <el-input v-model="target.model.flowStart" type="number" placeholder="流量最小值" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.flowEnd" type="number" placeholder="流量最大值" />
            </div>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap class="m-t-16 table-view">
      <div v-loading="loading">
        <el-table
          ref="military"
          v-scrollbar
          :data="tableData"
          header-row-class-name="table-header"
          @selection-change="handleSelectionChange"
          @sort-change="doSort"
        >
          <!-- <el-table-column type="selection"></el-table-column> -->
          <!-- <el-table-column class-name="table-title" label="标题" align="left" width="333">
            <template slot-scope="s">
              <el-link
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :disabled="s.row.url === ''"
                target="_blank"
                :underline="false"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="addTime" label="发布时间" width="102" />
          <el-table-column prop="platName" label="平台" />
          <el-table-column prop="accountName" label="账号" align="left" /> -->
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
          <el-table-column label="账号信息" width="200" align="left">
            <template slot-scope="{row}">
              <AccountCard :info="row" />
            </template>
          </el-table-column>
          <el-table-column prop="flowCount" label="总流量" sortable="custom" width="140" />
          <el-table-column prop="oldFlowCount" label="节点流量" sortable="custom" width="120" />
          <el-table-column prop="thumbUpCount" label="总点赞量" sortable="custom" width="120" />
          <el-table-column prop="oldThumbUpCount" label="节点点赞量" sortable="custom" width="120" />
          <el-table-column prop="updateTime" label="更新时间" width="102" />
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
          <el-table-column prop="junType" label="视频类型" width="168" />
          <el-table-column v-if="$permission('command_row')" prop="videoCommand" label="口令" />
          <el-table-column prop="editName" label="编辑人员" width="120" />
          <el-table-column prop="cutName" label="剪辑人员" width="120" />
          <el-table-column v-if="$permission('influence_video_look')" prop="influencer" label="网红" width="120">
            <template slot-scope="{ row }">
              {{ row.influencer || '--' }}
            </template>
          </el-table-column>
          <el-table-column v-if="$permission('influence_video_look')" prop="photographer" label="摄影人员" width="120">
            <template slot-scope="{ row }">
              {{ row.photographer || '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="cutName" label="审核" width="120">
            <template slot-scope="scope">
              {{ HD_STATUS_TXT_MAP[scope.row.hdStatus] }}
              <el-tooltip
                v-if="+scope.row.hdStatus === 3 && scope.row.examineFailureReasons"
                effect="dark"
                :content="scope.row.examineFailureReasons"
                placement="top"
              >
                <i class="iconfont iconcuowu" />
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="编辑军功">
            <template slot-scope="scope">
              <span v-if="scope.row.lockStatus">{{ scope.row.editScore }}</span>
              <span v-else>{{ scope.row.editScore > 0 ? scope.row.editScore : '未计算' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="剪辑军功">
            <template slot-scope="scope">
              <span v-if="scope.row.lockStatus">{{ scope.row.cutScore }}</span>
              <span v-else>{{ scope.row.cutScore > 0 ? scope.row.cutScore : '未计算' }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="total" class="pagenation-view">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="nowPage"
            @current-change="changePage"
          />
        </div>
      </div>
    </Wrap>
    <upload-dialog
      :dialog-data="uploadData"
      readonly
      :show.sync="showUpload"
      @uploadSuccess="sysGetList(searchData)"
    />
  </div>
</template>

<script>
import mixin from '../@coms/mixin'
import commonMixin from '../../@mods/common-mixin'
import uploadDialog from '../../@mods/upload-dialog/index'
import { $sysGetCondition, $sysGetList, $getAccontByOrgIdOrPlatId } from '@/api/military-manage'
import departmentSelect from '@/components/DepartmentSelect/index.vue'
import { Statistics, AccountCard, VideoInfo } from 'components'
import VirtualCascader from '@/components/VirtualCascader'
import { downloadFile } from '@/utils/download'
import {
  copy,
  date
} from '@/components/common'

import { param } from '@/utils'
const A_DAY = 864e5

const SEARCH_MODEL = {
  determined: '',
  belongName: '',
  accountName: '',
  accountId: '',
  platId: '',
  type_id: '',
  orgId: '',
  flowStart: '',
  flowEnd: '',
  timerange: [],
  jobType: '',
  junType: ''
}
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
console.log(HD_STATUS)
// 显示用的状态数据
const HD_STATUS_TXT_MAP = copy(HD_STATUS_MAP)
HD_STATUS_TXT_MAP['4'] = '--'

export default {
  components: {
    uploadDialog,
    departmentSelect,
    Statistics,
    AccountCard,
    VideoInfo,
    VirtualCascader
  },
  mixins: [commonMixin, mixin],
  data() {
    return {
      uploadData: {},
      showUpload: false,
      dateArr: [],
      searchData: {
        orgId: ''
      },
      formConf: {},
      optionsData: {},
      soldiers: [],
      selected: [],
      soldierCut: '',
      soldierEdit: '',
      HD_STATUS_TXT_MAP,
      summaryItems: [
        {
          key: 'sumVideo',
          text: '标题数',
          val: ''
        },
        {
          key: 'sumFlowCount',
          text: '总流量',
          val: ''
        },
        {
          key: 'sumOldFlowCount',
          text: '节点流量',
          val: ''
        },
        {
          key: 'sumThumbUpCount',
          text: '总点赞量',
          val: ''
        },
        {
          key: 'sumOldThumbUpCount',
          text: '节点点赞量',
          val: ''
        },
        {
          key: 'soilderFlowCount',
          text: '军功播放量',
          val: ''
        },
        {
          key: 'soilderAllScore',
          text: '总军功',
          val: ''
        }
      ],
      virtualData: []
    }
  },
  mounted() {
    this.buildFormConf()
    this.sysGetCondition()
    this.initTimes()
    this.sysGetList()
    this.getCondition()
  },
  methods: {
    orgChange(val, level) {
      // if (level === 1) {
      this.$bus.$emit('platChange')
      this.$refs.search.form.editAndCutId = ''
      this.$refs.search.form.junType = ''
      this.getCondition(false)
      // } else {
      //   this.getCondition(true)
      // }
    },
    changePage() {
      this.sysGetList()
    },
    initTimes() {
      const ts = A_DAY * 7
      const start = date('Y-m-d', new Date(Date.now() - ts))
      const end = date('Y-m-d', new Date())
      if (this.searchData.timerange === undefined) {
        this.$set(this.searchData, 'timerange', [start, end])
      } else {
        this.searchData.timerange = [start, end]
      }
    },
    /**
     * 获取表格数据
     */
    async sysGetList(data = {}) {
      this.searchChangeButNotSubmit = false
      // this.searchData = this.buildReqData(
      //   extend(this.searchData, data),
      //   1,
      //   SEARCH_MODEL
      // );
      this.searchData = Object.assign({}, SEARCH_MODEL, this.searchData, data)
      const params = {
        pageNum: this.nowPage,
        size: 20,
        ...this.searchData
        // platId:
      }

      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
      }

      params.timerange = null
      this.loading = true
      try {
        const res = await $sysGetList(params)
        if (res.code === 1) {
          this.tableData = res.data.collectionVideoList
          // res.data.
          const assign = Object.assign({}, res.data.baseVideoStatistics, res.data.soilderVideoStatisticsVO)
          this.summaryItems.forEach(t => {
            t.val = assign[t.key]
          })
          this.total = res.data.total
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
     * 条件获取
     */
    async sysGetCondition() {
      const res = await $sysGetCondition({
        isOnline: 1
      })
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.plats
      }
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    buildReqParams() {
      return [this.buildReqData(this.searchData, 1, SEARCH_MODEL)]
    },
    async getCondition(justAcc = false) {
      const res = await $getAccontByOrgIdOrPlatId({
        platId: this.searchData.platId,
        orgId: this.searchData.orgId,
        accountType: 1,
        methodId: 2
      })
      if (res.code === 1) {
        this.normalFormItemMap.accountId.data = res.data.accountInfo || []
        if (!justAcc) {
          this.normalFormItemMap.editAndCutId.data = res.data.employeeNameVO || []
          this.normalFormItemMap.junType.data = res.data.videoType || []
        }
      }
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     */
    async onSearchChange(val, item, type, index, model) {
      switch (item.key) {
          case 'platId':
            this.searchData['platId'] = val
            this.getCondition(true)
            break
          default:
            this.searchData[item.key] = val
      }
    },
    buildFormConf() {
      var normal = [
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
            defaultFirst: true,
            hasAccount: true
          }
        },
        {
          type: 'select',
          key: 'hdStatus',
          data: copy(HD_STATUS),
          conf: {
            placeholder: '状态选择'
          },
          optionLabelKey: 'text',
          optionValKey: 'val'
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
          data: [],
          optionLabelKey: 'junType',
          optionValKey: 'junType',
          conf: {
            placeholder: '视频类型'
          }
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
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
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
      const params = Object.assign({}, this.searchData, data)
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
      // window.location.href = `/api/video/collect/export?${param(params)}&componentId=${this.$componentId}`
      downloadFile('/api/video/collect/export', {
        ...params,
        componentId: this.$componentId
      })
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.nowPage = 1
      const params = copy(data)

      // if (this.$refs.search.$refs.cascader) {
      //   params.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      params.b2cPhoneModelIds = this.virtualData
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      this.sysGetList(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.iconcuowu {
  color: #ff0000;
  font-size: 14px;
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
