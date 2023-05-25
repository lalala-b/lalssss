<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        class="P-militarySearch"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:cascader>
          <VirtualCascader
            v-model="virtualData"
            :options="normalFormItemMap.b2cPhoneModelIdStrs.data"
            placeholder="请选择产品型号"
          />
        </template>
        <template v-slot:normal="target">
          <el-form-item label="流量区间" style="margin-right: 50px">
            <div class="flex">
              <el-input v-model="target.model.flowStart" type="number" placeholder="流量最小值" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.flowEnd" type="number" placeholder="流量最大值" />
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
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap v-loading="loading" class="m-t-16 table-view">
      <el-table
        ref="military"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="doSort"
      >
        <!-- <el-table-column type="selection"></el-table-column> -->
        <!-- <el-table-column class-name="table-title" label="标题" width="333" align="left">
          <template slot-scope="s">
            <el-link
              :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
              :href="s.row.url"
              :underline="false"
              target="_blank"
            >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="发布时间" width="102" />
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
        <el-table-column prop="oldFlowCount" label="节点流量" sortable="custom" width="140" />
        <el-table-column prop="oldThumbUpCount" label="节点点赞量" sortable="custom" />
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
        <el-table-column prop="editName" label="编辑人员" width="120" />
        <el-table-column prop="cutName" label="剪辑人员" width="120" />
        <el-table-column label="审核" width="120">
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
            <span>{{ scope.row.editScore === 0 && scope.row.lockStatus === 0 ? '未计算' : scope.row.editScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剪辑军功">
          <template slot-scope="scope">
            <span>{{ scope.row.cutScore === 0 && scope.row.lockStatus === 0 ? '未计算' : scope.row.cutScore }}</span>
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
    </Wrap>
    <upload-dialog
      :dialog-data="uploadData"
      readonly
      :show.sync="showUpload"
      @uploadSuccess="onSubmit(searchData)"
    />
  </div>
</template>

<script>
// import mixin from '../@coms/mixin'
// import commonMixin from '../../@mods/common-mixin'
import tableMixin from '@/mixins/table'
import mixin from '../@coms/mixin'
import uploadDialog from '../../@mods/upload-dialog/index'
import search from '@/components/Search'
import { $getPuttingCondition, $getVideoList, $getAccountsByPlatId, $getSearchOrgInfo } from '@/api/military-manage'
import { Statistics, AccountCard, VideoInfo } from 'components'
import VirtualCascader from '@/components/VirtualCascader'

import {
  extend,
  copy
} from '@/components/common'
import { deepClone } from '@/utils'
import qs from 'qs'
import { $condition } from '@/api/video-manage'
import { downloadFile } from '@/utils/download'
const SEARCH_MODEL = {
  determined: '',
  belongName: '',
  accountName: '',
  accountId: '',
  platId: '',
  hdStatus: '',
  titleName: '',
  junType: '',
  editAndCutId: '',
  jobType: '',
  flowStart: '',
  flowEnd: '',
  startTime: '',
  endTime: '',
  timerange: [],
  pageNum: 1,
  size: 20
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

// 显示用的状态数据
const HD_STATUS_TXT_MAP = copy(HD_STATUS_MAP)
HD_STATUS_TXT_MAP['4'] = '--'

export default {
  components: {
    uploadDialog,
    vSearch: search,
    Statistics,
    AccountCard,
    VideoInfo,
    VirtualCascader
  },
  mixins: [tableMixin, mixin],
  data() {
    return {
      uploadData: {},
      showUpload: false,
      dateArr: [],
      searchData: {
        ...SEARCH_MODEL
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
          val: 0,
          text: '标题数'
        },
        {
          key: 'sumFlowCount',
          val: 0,
          text: '总流量'
        },
        {
          key: 'sumOldFlowCount',
          val: 0,
          text: '节点流量'
        },
        {
          key: 'soilderFlowCount',
          val: 0,
          text: '军功播放量'
        },
        {
          key: 'soilderAllScore',
          val: 0,
          text: '总军功'
        }
      ],
      method_id: 1,
      virtualData: []
    }
  },
  mounted() {
    this.buildFormConf()
    this.getPuttingCondition()
    this.getOrgInfo()
    this.getList()
    // this.getCondition()
    // this.loadBaseSearchData();
  },
  methods: {
    async getCondition() {
      const res = await $condition({
        accountType: 3,
        methodId: 2
      })
      if (res.code === 1) {
        this.normalFormItemMap.accountId.data = res.data || []
      }
    },
    getOrgInfo(orgId) {
      if (!this.normalFormItemMap.fId && !this.normalFormItemMap.dId) {
        return
      }
      $getSearchOrgInfo({ orgId }).then(res => {
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
    getAccount(model) {
      const platId = model.platId
      const orgId = model.fId || model.dId
      model.accountId = ''
      $getAccountsByPlatId({
        platId,
        orgId,
        accountType: 3,
        methodId: 2
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data || []
        }
      })
    },
    async getList() {
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
        const res = await $getVideoList(params)
        if (res.code === 1) {
          this.tableData = res.data.videoPuttingList
          this.total = res.data.total
          const info = { ...res.data.baseVideoStatistics, ...res.data.soilderVideoStatisticsVO }
          this.summaryItems.forEach(t => {
            t.val = info[t.key]
          })
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      }
      this.loading = false
    },
    async getPuttingCondition() {
      const res = await $getPuttingCondition()
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
          type: 'select',
          key: 'hdStatus',
          data: copy(HD_STATUS),
          optionLabelKey: 'text',
          optionValKey: 'val',
          conf: {
            placeholder: '状态选择'
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
          data: [],
          optionLabelKey: 'junType',
          optionValKey: 'junType',
          conf: {
            placeholder: '视频类型'
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
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    // 获取平台数据
    getPlats() {
      return this.getDefPlats().then(re => {
        if (re) {
          this.normalFormItemMap.platId.data = re
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
      const params = Object.assign({}, this.searchData, data)
      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      params.orgId = params.fId || params.dId
      delete params.fId
      delete params.dId

      // if (this.$refs.search.$refs.cascader) {
      //   params.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      // params.b2cPhoneModelId = params.b2cPhoneModelId && params.b2cPhoneModelId.length ? params.b2cPhoneModelId[params.b2cPhoneModelId.length - 1] : ''
      params.b2cPhoneModelIds = this.virtualData
      // window.open(`/api/achievement/putting/video/export?${qs.stringify(params)}&componentId=${this.$componentId}`)
      downloadFile('/api/achievement/putting/video/export', {
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

      // if (this.$refs.search.$refs.cascader) {
      //   this.searchData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      // this.searchData.b2cPhoneModelId = this.searchData.b2cPhoneModelId && this.searchData.b2cPhoneModelId.length ? this.searchData.b2cPhoneModelId[this.searchData.b2cPhoneModelId.length - 1] : ''
      this.searchData.b2cPhoneModelIds = this.virtualData
      this.searchData.pageNum = 1
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
