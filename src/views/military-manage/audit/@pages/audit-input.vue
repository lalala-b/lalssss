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
    <Wrap class="m-t-16 table-view">
      <div class="flex flex-justify-end controls m-b-16">
        <el-button v-log type="primary" size="small" plain @click="onBatchPass(2)">审核通过</el-button>
        <!-- <el-button v-log type="danger" size="small" plain @click="onBatchPass(3)">审核不通过</el-button> -->
      </div>
      <div v-loading="loading">
        <el-table
          ref="military"
          v-scrollbar
          :data="tableData"
          header-row-class-name="table-header"
          @selection-change="handleSelectionChange"
          @sort-change="doSort"
        >
          <el-table-column type="selection" width="55" :selectable="checkVerifyPermission" />
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
          <el-table-column prop="platName" label="平台" />
          <el-table-column prop="accountName" label="账号" />
          <el-table-column prop="addTime" label="发布时间" width="102" />
          <el-table-column prop="flowCount" label="总流量" sortable="custom" width="140" />
          <el-table-column prop="thumbUpCount" label="总点赞量" sortable="custom" width="120" />
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
          <el-table-column label="审核" width="120">
            <template slot-scope="scope">
              <div v-if="checkVerifyPermission(scope.row) && +scope.row.operationStatus === 2" class="tableColumn">
                <el-select
                  v-model="scope.row.hdStatus"
                  placeholder="请选择"
                  @change="changeState(scope.row)"
                >
                  <el-option
                    v-for="opt in HD_STATUS.slice(0, 3)"
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
                {{ HD_STATUS_TXT_MAP[scope.row.hdStatus] }}
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
          <el-table-column v-if="$permission('military-review-modify')||$permission('compute_military')" label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button v-if="+scope.row.operationStatus === 2&&$permission('military-review-modify')" v-log type="text" @click="handleEdit(scope.row, 'audit')">审核修改</el-button>
              <el-button v-if="+scope.row.operationStatus === 3&&$permission('compute_military')" v-log type="text" @click="handleEdit(scope.row)">申诉修改</el-button>
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
      </div>
    </Wrap>
    <appealDialog
      v-if="showAppeal"
      :required="false"
      :show.sync="showAppeal"
      :type="appealType"
      :dialog-data="editData"
      source="input"
      @update="onSubmit()"
    />
    <upload-dialog
      v-if="showUpload"
      :dialog-data="uploadData"
      readonly
      :show.sync="showUpload"
      @uploadSuccess="onSubmit()"
    />
  </div>
</template>

<script>
import qs from 'qs'
import tableMixin from '@/mixins/table'
import mixin from '../@coms/mixin'
import { copy, isString } from '@/components/common'
import appealDialog from '../@coms/appealDialog'
import uploadDialog from '../../@mods/upload-dialog/index'
// import { VideoInfo, AccountCard } from 'components'
import VirtualCascader from '@/components/VirtualCascader'
import VSearch from '@/components/Search'
import { $getExamineInputVideoList, $setExamineVideo, $getAccountCondition, $getInputAccountByOrgIdOrPlatId } from '@/api/military-manage'
import { $getNextOrgInfo } from '@/api'
import { downloadFile } from '@/utils/download'
// 权限 jun_type 类型
const PRO_TYPES_REG_EXP = /[A-Z]$/

/**
 * 判断传入的 type 在不在指定范围
 * @param  {Minx}    type 待判断类型
 * @return {Boolean}      判断结果
 */
function checkJunpType(type) {
  return PRO_TYPES_REG_EXP.test(String(type))
}

const HD_STATUS_MAP = {
  '1': '待审核',
  '2': '通过',
  '3': '未通过',
  '4': '无需审核'
}

const HD_STATUS = Object.keys(HD_STATUS_MAP).map((key) => ({
  val: Number(key),
  text: HD_STATUS_MAP[key]
}))

// 显示用的状态数据
const HD_STATUS_TXT_MAP = copy(HD_STATUS_MAP)
HD_STATUS_TXT_MAP['4'] = '--'

export default {
  components: {
    VSearch,
    uploadDialog,
    appealDialog,
    VirtualCascader
  },
  mixins: [tableMixin, mixin],
  data() {
    return {
      formConf: {},
      HD_STATUS_TXT_MAP,
      HD_STATUS,
      uploadData: {},
      showUpload: false,
      showAppeal: false,
      appealType: '',
      editData: {},
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
      selected: [],
      virtualData: []
    }
  },
  created() {
    this.buildFormConf()
    this.getAccountCondition()
    this.getList()
  },
  methods: {
    // 获取筛选条件
    getAccountCondition() {
      $getAccountCondition({
        type: 1,
        platId: this.searchData.platId,
        methodId: this.methodId
      }).then((res) => {
        if (res.code === 1) {
          this.catchAccountName = res.data.videoInputAccountConditionVOList
          this.normalFormItemMap.platId.data = res.data.platInfo
          this.normalFormItemMap.accountName.data = res.data.videoInputAccountConditionVOList
          this.normalFormItemMap.publicUserId.data = res.data.employeeNameVO
          this.normalFormItemMap.junType.data = res.data.videoTypeList
          this.normalFormItemMap.dId.data = res.data.orgs
        }
      })
    },
    async onSearchChange(val, item, type, index, model) {
      let res = null
      switch (item.key) {
          case 'platId':
            this.getAccount(model)
            model.accountName = ''
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
            model.accountName = ''
            this.getAccount(model)
            break
          case 'fId':
            this.getAccount(model)
            model.accountName = ''
            break
          default:
            this.searchData[item.key] = val
      }
    },
    buildFormConf() {
      let normal = [
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
          data: [],
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
          optionValKey: 'modelId',
          optionLabelKey: 'modelName'
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
    getAccount(model) {
      const orgId = model.fId || model.dId || ''
      const platId = model.platId
      $getInputAccountByOrgIdOrPlatId({ orgId, platId }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountName.data = res.data.videoInputAccountConditionVO
        } else {
          this.$message.error(res.error)
        }
      })
    },
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      data.orgId = data.fId || data.dId || ''
      delete data.fId
      delete data.dId
      $getExamineInputVideoList(data).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
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
    },
    onExport(data) {
      data = Object.assign({}, this.searchData, data)

      data.orgId = data.fId || data.dId || ''
      delete data.fId
      delete data.dId
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
      // data.b2cPhoneModelId = data.b2cPhoneModelId && data.b2cPhoneModelId.length ? data.b2cPhoneModelId[data.b2cPhoneModelId.length - 1] : ''
      data.b2cPhoneModelIds = this.virtualData
      // window.location.href = `/api/video/input/exportExamineInputVideoListExcel?${qs.stringify(data)}&componentId=${this.$componentId}`
      downloadFile('/api/video/input/exportExamineInputVideoListExcel', {
        ...data,
        componentId: this.$componentId
      })
    },
    onBatchPass(hdStatus) {
      if (!this.selected.length) {
        this.$message.info('您还没勾选哦')
        return
      }
      const uploadIdList = this.selected.map(function(item) {
        return item.uploadId
      })
      this.setExamineVideo({
        uploadIdList,
        hdStatus
      }, 1)
    },
    handleSelectionChange(val) {
      this.selected = val
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    checkVerifyPermission(item) {
      // 没传 item 的话就是在表格外调用，这个时候不执行单条数据的检查逻辑
      if (!item.lockStatus && item.editId !== 0 && item.cutId !== 0 && checkJunpType(isString(item.junType) ? item.junType : item.junType.text)) {
        return true
      }
      return false
    },
    changeState(item) {
      const data = {
        uploadIdList: [item.uploadId],
        hdStatus: item.hdStatus
      }
      this.setExamineVideo(data)
    },
    setExamineVideo(data, type) {
      $setExamineVideo(data).then((res) => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          // if (type === 1) {
          this.getList()
          // }
        } else {
          this.getList()
          this.$message.error(res.message)
        }
      })
    },
    handleEdit(rowData, type = '') {
      this.editData = copy(rowData)
      this.appealType = type
      this.showAppeal = true
    },
    onSubmit(data) {
      data = copy(data)
      const searchData = Object.assign(this.searchData, data)
      if (searchData.timerange) {
        searchData.startTime = searchData.timerange[0]
        searchData.endTime = searchData.timerange[1]
        delete searchData.timerange
      } else {
        searchData.startTime = ''
        searchData.endTime = ''
      }
      const job = searchData.job
      const jobMap = {
        editId: 'edit',
        cutId: 'cut',
        publicUserId: ''
      }
      for (const key in jobMap) {
        if (job === jobMap[key]) {
          searchData[key] = searchData.publicUserId
        } else {
          searchData[key] = ''
        }
      }

      // if (this.$refs.search.$refs.cascader) {
      //   searchData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }

      // searchData.b2cPhoneModelId = searchData.b2cPhoneModelId && searchData.b2cPhoneModelId.length ? searchData.b2cPhoneModelId[searchData.b2cPhoneModelId.length - 1] : ''
      searchData.b2cPhoneModelIds = this.virtualData
      this.searchData = searchData
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
