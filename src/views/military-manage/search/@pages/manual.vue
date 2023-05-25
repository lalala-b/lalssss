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
        <template v-slot:prv>
          <departmentSelect v-model="searchData.orgId" :inline="true" @orgChange="orgChange" />
        </template>
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
              <el-input v-model="target.model.flowStart" type="number" placeholder="流量最小值" min="0" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.flowEnd" type="number" placeholder="流量最大值" min="0" />
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
    <Wrap class="m-t-16 m-t-16">
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap v-loading="loading" class="m-t-16 table-view">
      <el-table
        ref="military"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column class-name="table-title" label="标题" width="333" align="left">
          <template slot-scope="s">
            <el-link
              :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
              :href="s.row.url"
              :disabled="s.row.url === ''"
              target="_blank"
              :underline="false"
            >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="addTime" label="发布时间" width="102" />
        <el-table-column prop="platName" label="平台" />
        <el-table-column prop="accountName" label="账号" align="left" />
        <el-table-column prop="flowCount" label="节点流量" sortable="custom" width="120" />
        <el-table-column prop="thumbUpCount" label="节点点赞量" sortable="custom" width="120" />
        <el-table-column prop="createTime" label="更新时间" width="102" />
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
            <span>{{ (scope.row.editScore > 0 || scope.row.lockStatus) ? scope.row.editScore : "未计算" }}</span>
          </template>
        </el-table-column>
        <el-table-column label="剪辑军功">
          <template slot-scope="scope">
            <span>{{ (scope.row.cutScore > 0 || scope.row.lockStatus) ? scope.row.cutScore : "未计算" }}</span>
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
          @current-change="getList"
        />
      </div>
    </Wrap>
    <upload-dialog
      :dialog-data="uploadData"
      readonly
      :show.sync="showUpload"
      @uploadSuccess="getList"
    />
  </div>
</template>

<script>
import qs from 'qs'
import departmentSelect from '@/components/DepartmentSelect'

import tableMixin from '@/mixins/table'
import commonInputMixin from '../../@mods/common-input-mixin'
import { copy } from '@/components/common'
import { Statistics } from 'components'
import VirtualCascader from '@/components/VirtualCascader'
import mixin from '../@coms/mixin'
import { $getByHandVideoInputList, $getInputAccountByOrgIdOrPlatId } from '@/api/military-manage'
import { downloadFile } from '@/utils/download'
export default {
  components: {
    Statistics,
    departmentSelect,
    VirtualCascader
  },
  mixins: [tableMixin, commonInputMixin, mixin],
  data() {
    return {
      summaryItems: [
        {
          key: 'total',
          text: '标题数',
          val: 0
        },
        {
          key: 'sumFlow',
          text: '播放量(军功)',
          val: 0
        },
        {
          key: 'sumThumbUpCount',
          text: '总点赞量',
          val: ''
        },
        {
          key: 'sumScore',
          text: '总军功',
          val: 0
        }
      ],
      searchData: {
        platId: '',
        accountName: '',
        title: '',
        junType: '',
        job: '',
        startTime: '',
        endTime: '',
        flowStart: '',
        flowEnd: '',
        determined: '',
        orgId: '',
        publicUserId: '',
        pageNum: 1
      },
      methodId: 2,
      virtualData: []
    }
  },
  methods: {
    orgChange(val, level) {
      if (level === 1) {
        this.$bus.$emit('platChange')
        // this.$refs.search.form.editAndCutId = ''
        this.$refs.search.form.junType = ''
        this.$refs.search.form.accountName = ''
        this.getCondition(false)
      } else {
        this.$refs.search.form.accountName = ''
        this.getCondition(true)
      }
    },
    onSearchChange(val, item, type, index, model) {
      switch (item.key) {
          case 'platId':
            this.getCondition(true)
            model.accountName = ''
            break
      }
    },
    async getCondition(justAcc = false) {
      const res = await $getInputAccountByOrgIdOrPlatId({
        platId: this.$refs.search.form.platId,
        orgId: this.searchData.orgId
      })
      if (res.code === 1) {
        this.normalFormItemMap.accountName.data = res.data.videoInputAccountConditionVO || []
        if (!justAcc) {
          // this.normalFormItemMap.editAndCutId.data = res.data.employeeNameVO || []
          this.normalFormItemMap.junType.data = res.data.junTypes || []
        }
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
          key: 'accountName',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountName',
          conf: {
            placeholder: '请输入账号',
            allowCreate: false,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'hdStatus',
          data: copy(this.HD_STATUS),
          conf: {
            placeholder: '状态选择'
          }
        },
        {
          type: 'input',
          key: 'title',
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
          key: 'job',
          data: [
            { val: 'edit', text: '编辑' },
            { val: 'cut', text: '剪辑' }
          ],
          conf: {
            placeholder: '请选择人员职责'
          }
        },
        {
          type: 'select',
          key: 'publicUserId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '请输入人员名称'
          }
        },
        {
          type: 'date-picker',
          key: 'timerange',
          hide: true
        }
      ]
      const normalFormItemMap = {}
      normal = normal.filter((item) => (this.$permission(item.permissionName)))
      normal.forEach((item, index) => {
        normalFormItemMap[item.key] = item
      })
      this.formConf = {
        normal,
        hasExport: true
      }

      this.normalFormItemMap = normalFormItemMap
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    onExport(data) {
      data = Object.assign({}, this.searchData, data)
      if (data.timerange) {
        data.startTime = data.timerange[0]
        data.endTime = data.timerange[1]
        delete data.timerange
      } else {
        data.startTime = ''
        data.endTime = ''
      }
      const job = data.job
      const jobMap = {
        editId: 'edit',
        cutId: 'cut',
        publicUserId: ''
      }
      for (const key in jobMap) {
        if (job === jobMap[key]) {
          data[key] = data.publicUserId
        } else {
          data[key] = ''
        }
      }

      // if (this.$refs.search.$refs.cascader) {
      //   data.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      data.b2cPhoneModelIds = this.virtualData
      // data.b2cPhoneModelId = data.b2cPhoneModelId && data.b2cPhoneModelId.length ? data.b2cPhoneModelId[data.b2cPhoneModelId.length - 1] : ''
      // window.location.href = `/api/video/input/exportByHandVideoInputListExcel?${qs.stringify(data)}&componentId=${this.$componentId}`
      downloadFile('/api/achievement/putting/video/export', {
        ...data,
        componentId: this.$componentId
      })
    },
    getList() {
      this.loading = true
      const data = copy(this.searchData)

      // if (this.$refs.search && this.$refs.search.$refs.cascader) {
      //   data.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      data.b2cPhoneModelIds = this.virtualData
      // data.b2cPhoneModelId = data.b2cPhoneModelId && data.b2cPhoneModelId.length ? data.b2cPhoneModelId[data.b2cPhoneModelId.length - 1] : ''
      $getByHandVideoInputList(data).then((res) => {
        if (res.code === 1) {
          this.summaryItems = this.summaryItems.map((item) => {
            item.val = res.data.statisticsVideoInputData[item.key] || 0
            return item
          })
          this.tableData = res.data.getVideoInputVOList
          this.total = res.data.statisticsVideoInputData.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
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
