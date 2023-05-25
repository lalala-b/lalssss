<template>
  <div>
    <Wrap class="search-view">
      <h2 class="m-b-10">目前有部分平台系统无法采集数据，需要录入视频数据</h2>
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit1"
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

    <Wrap v-loading="loading" class="m-t-16 table-view">
      <div v-if="militaryLockStatus" class="m-b-16">
        <el-button type="primary" @click="dialogVisible = true">添加视频</el-button>
      </div>
      <el-table
        ref="military"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column class-name="table-title" label="标题" width="333" align="left">
          <template slot-scope="s">
            <div class="ta-l">
              <el-link
                :disabled="!s.row.url"
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :underline="false"
                target="_blank"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="platName" label="平台" />
        <el-table-column prop="accountName" label="账号" />
        <el-table-column prop="addTime" label="发布时间" width="110">
          <template slot-scope="scope">{{ scope.row.addTime }}</template>
        </el-table-column>
        <el-table-column prop="flowCount" label="总流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="总点赞量" sortable="custom" />
        <el-table-column prop="createTime" label="录入时间" width="110" />
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
        <el-table-column label="视频类型" prop="junType" width="168" />
        <el-table-column v-if="$permission('command_row')" label="口令" prop="videoCommand" />
        <el-table-column label="编辑人员" prop="editName" width="100" />
        <el-table-column label="剪辑人员" prop="cutName" width="100" />

        <el-table-column v-if="$permission('influence_video_sign')" label="网红" width="140">
          <template slot-scope="{ row }">
            {{ row.influencer|emptyFill }}
            <!-- <el-select
              v-model="row.influencerId"
              placeholder="请选择"
              filterable
              @change="handleInfluencer(row, 'influencer')"
            >
              <el-option
                v-for="item in pirateFrontUsers"
                :key="item.userId"
                :label="item.realname"
                :value="+item.userId"
              />
            </el-select> -->
            <!-- <el-input v-model.trim="row.influencer" style="width:120px" maxlength="8" placeholder="请输入网红" @keyup.enter.native="handleInfluencer(row)" @blur="handleInfluencer(row)" /> -->
          </template>
        </el-table-column>

        <el-table-column v-if="$permission('influence_video_sign')" label="摄影人员" width="120">
          <template slot-scope="{ row }">
            {{ row.photographer|emptyFill }}
            <!-- <el-select
              v-model="row.photographerId"
              placeholder="请选择"
              filterable
              @change="handleInfluencer(row, 'photographer')"
            >
              <el-option
                v-for="item in pirateFrontUsers"
                :key="item.userId"
                :label="item.realname"
                :value="+item.userId"
              />
            </el-select> -->
          </template>
        </el-table-column>

        <el-table-column v-if="militaryLockStatus" label="操作" width="110">
          <template slot-scope="scope">
            <div class="flex flex-justify-around">
              <el-link v-log type="primary" @click="onView(scope.row)">查看</el-link>
              <el-link v-if="hasEditMark(scope.row)" v-log type="primary" @click="onEdit(scope.row)">编辑</el-link>
              <el-link v-if="hasEditMark(scope.row)" v-log type="primary" @click="onDel(scope.row)">删除</el-link>
            </div>
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
      readonly
      :dialog-data="uploadData"
      :show.sync="showUpload"
      @uploadSuccess="getList"
    />
    <import-video
      v-if="dialogVisible&&normalFormItemMap.platId.data"
      :show.sync="dialogVisible"
      :subject="nowRow"
      :soldiers="normalFormItemMap.publicUserId.data"
      :plats="normalFormItemMap.platId.data"
      :video-type="normalFormItemMap.junType.data"
      @confirm="onSubmit1"
      @updaeSuccess="getList"
    />
    <VideoView v-if="dialogViewVisible" v-model="dialogViewVisible" :soldiers="normalFormItemMap.publicUserId.data" :subject="nowRow" />
  </div>
</template>

<script>
import qs from 'qs'
import { copy } from '@/utils'
import tableMixin from '@/mixins/table'
import commonInputMixin from '../../@mods/common-input-mixin'
import { $getVideoInputList, $deleteInputItem, $getExamineSignStatus, $updateVideoInfo, $getPirateFrontUsers } from '@/api/military-manage'
import importVideo from '../../@mods/import-video'
import VideoView from '../@components/view.vue'
import mixin from '../@coms/mixin'
// import { VideoInfo, AccountCard } from 'components'
import VirtualCascader from '@/components/VirtualCascader'
import { downloadFile } from '@/utils/download'

export default {
  components: {
    importVideo,
    VideoView,
    // AccountCard,
    // VideoInfo,
    VirtualCascader
  },
  mixins: [mixin, tableMixin, commonInputMixin],
  data() {
    return {
      dialogVisible: false, // 添加视频弹窗状态
      dialogViewVisible: false, // 添加视频弹窗状态
      searchData: {
        platId: '',
        accountName: '',
        title: '',
        junType: '',
        job: '',
        editId: '',
        cutId: '',
        startTime: '',
        endTime: '',
        flowStart: '',
        flowEnd: '',
        determined: '',
        publicUserId: '',
        pageNum: 1,
        methodId: 1
      },
      methodId: 1,
      formConf: {
        normal: [
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
              defaultFirst: true,
              hasAccount: true
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
          }
        ],
        hasExport: true
      },
      normalFormItemMap: {},
      nowRow: {},
      militaryLockStatus: false,
      pirateFrontUsers: [],
      virtualData: []
    }
  },
  watch: {
    dialogVisible(nVal) {
      if (!nVal) {
        this.nowRow = {}
      }
    }
  },
  created() {
    this.getExamineSignStatus()
    this.getPirateFrontUsers()
  },
  methods: {
    async getPirateFrontUsers() {
      const { code, data } = await $getPirateFrontUsers()
      if (+code === 1) {
        this.pirateFrontUsers = data || []
      }
    },
    /**
     * 修改网红摄影
     */
    handleInfluencer(row, type) {
      const params = {
        flowId: row.uploadId,
        signType: 3
      }

      // 网红
      if (type === 'influencer') {
        const item = this.pirateFrontUsers.find(item => +item.userId === +row.influencerId)
        params.influencerId = row.influencerId
        params.influencer = item.realname
      } else {
        const item = this.pirateFrontUsers.find(item => +item.userId === +row.photographerId)
        params.photographerId = row.photographerId
        params.photographer = item.realname
      }

      $updateVideoInfo(params).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          if (type === 'influencer') {
            row.oldInfluencerId = row.influencerId
          } else {
            row.oldPhotographerId = row.photographerId
          }
        } else {
          this.$message.error('操作失败')
          if (type === 'influencer') {
            row.influencerId = row.oldInfluencerId
          } else {
            row.photographerId = row.oldPhotographerId
          }
        }
      })
    },
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      if (this.$refs.search && this.$refs.search.$refs.cascader) {
        data.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
          return !item.hasChildren
        }).map(item => {
          return item.data.modelId
        }).join(',')
      }
      // data.b2cPhoneModelId = data.b2cPhoneModelId && data.b2cPhoneModelId.length ? data.b2cPhoneModelId[data.b2cPhoneModelId.length - 1] : ''

      $getVideoInputList(data).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data.map(t => {
            t.oldInfluencer = t.influencer
            t.oldInfluencerId = t.influencerId
            t.oldPhotographerId = t.photographerId
            t.oldPhotographer = t.photographer
            return t
          })
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
    buildFormConf() {
      const normalFormItemMap = {}
      this.formConf.normal.forEach((item, index) => {
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
    },
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'platId') {
        model.accountName = ''
        this.normalFormItemMap.accountName.data = this.catchAccountName.filter((item) => (!val || item.platId == val))
      }
    },
    // 删除
    onDel(item) {
      const { uploadId } = item
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return $deleteInputItem({ uploadId })
      }).then((res) => {
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    // 标记状态
    getExamineSignStatus() {
      $getExamineSignStatus().then((res) => {
        if (res.code === 1) {
          this.militaryLockStatus = res.data
        }
      })
    },
    hasEditMark(row) {
      // 控制是否可以操作标记人员
      return row.lockStatus !== 1 && this.militaryLockStatus
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    onEdit(item) {
      this.nowRow = item
      this.dialogVisible = true
    },
    onView(item) {
      this.nowRow = item
      this.dialogViewVisible = true
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      data = copy(data)
      Object.assign(data, this.searchData)
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
      // window.location.href = `/api/video/input/exportExcel?${qs.stringify(data)}&componentId=${this.$componentId}`
      downloadFile('/api/video/input/exportExcel', {
        ...data,
        componentId: this.$componentId
      })
    },
    onSubmit1(data) {
      data = copy(data)
      data.b2cPhoneModelIds = this.virtualData
      this.onSubmit(data)
    }
  }
}
</script>
<style lang="scss" scoped>
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
