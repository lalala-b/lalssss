<template>
  <div name="Mark" class="P-militaryManageVideoMarkPm">
    <Wrap class="search-view">
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
            :options="normalFormItemMap.b2cPhoneModelIdStrs.data"
            placeholder="请选择产品型号"
          />
        </template>
        <template v-slot:normal>
          <el-form-item label="流量区间" style="margin-right: 50px">
            <div class="flex">
              <el-input
                v-model="searchData.flowStart"
                type="number"
                placeholder="流量最小值"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="searchData.flowEnd"
                type="number"
                placeholder="流量最大值"
              />
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
      <div class="flex flex-justify-between m-b-16 flex-align-center">
        <div class="unmark">
          <el-link type="danger" :underline="false">视频类型、编辑人员、剪辑人员都标记完整才能计算军功，截至当前存在{{ unmark }}条未标记完整！</el-link>
        </div>
        <div class="m-l-24">
          <div class="flex flex-align-center m-b-12">
            <div class="mark-title">请选择批量标记字段：</div>
            <el-radio-group v-model="markType" @change="handleMarkRadio">
              <el-radio :label="'b2cPhoneModelId'">产品型号</el-radio>
              <el-radio :label="'videoType'">视频类型</el-radio>
              <el-radio :label="'editId'">编辑人员</el-radio>
              <el-radio :label="'cutId'">剪辑人员</el-radio>
              <el-radio v-if="$permission('influence_video_sign')" :label="'influencerId'">网红艺人</el-radio>
              <el-radio v-if="$permission('influence_video_sign')" :label="'photographerId'">摄影人员</el-radio>
            </el-radio-group>
          </div>
          <div class="flex flex-align-center">
            <div class="mark-title">请选择批量标记内容：</div>
            <template v-if="markType==='b2cPhoneModelId'">
              <el-cascader
                v-model="b2cPhoneModelId"
                placeholder="产品型号"
                :show-all-levels="false"
                :options="modelData"
                :props="{
                  checkStrictly: false,
                  expandTrigger: 'hover',
                  value: 'modelId',
                  label: 'modelName',
                  children: 'phoneModelVOList' }"
                filterable
                clearable
                :filter-method="dataFilter"
              />
            </template>
            <template v-else>
              <el-select
                v-model="markValue"
                clearable
                filterable
                placeholder="请选择"
                @change="handleMarkValue"
              >
                <el-option
                  v-for="item in markList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </template>
            <el-button class="m-l-12" type="primary" @click="confirmMark">确认批量标记</el-button>
          </div>
        </div>
        <!-- <div class="flex flex1 flex-align-center flex-justify-around">
          <div v-if="militaryLockStatus" class="control-item">
            <div>
              <el-cascader
                v-model="b2cPhoneModelId"
                placeholder="产品型号"
                :options="modelData"
                :props="{
                  checkStrictly: false,
                  expandTrigger: 'hover',
                  value: 'modelId',
                  label: 'modelName',
                  children: 'phoneModelVOList' }"
                filterable
                clearable
                :filter-method="dataFilter"
              />
            </div>
            <div class="m-t-10">
              <el-button v-log type="primary" plain @click="onBatchMark('phone')">批量标记产品型号</el-button>
            </div>
          </div>
          <div v-if="militaryLockStatus" class="control-item">
            <div>
              <el-select
                v-model="videoType"
                clearable
                filterable
                placeholder="视频类型"
              >
                <el-option
                  v-for="item in videoTypeItems"
                  :key="item.junType"
                  :label="item.junType"
                  :value="item.junType"
                />
              </el-select>
            </div>
            <div class="m-t-10">
              <el-button v-log type="primary" plain @click="onBatchMark('video')">批量标记视频类型</el-button>
            </div>
          </div>
          <div v-if="militaryLockStatus && normalFormItemMap.editAndCutId.data.length" class="control-item">
            <div>
              <el-select v-model="soldierEdit" filterable clearable placeholder="编辑人员">
                <el-option
                  v-for="item in normalFormItemMap.editAndCutId.data"
                  :key="item.userId"
                  :label="item.realname"
                  :value="item.userId + '-' + item.realname"
                />
              </el-select>
            </div>
            <div class="m-t-10">
              <el-button
                v-log
                type="primary"
                plain
                @click="onBatchEditOrCut('edit')"
              >批量标记编辑人员</el-button>
            </div>
          </div>
          <div v-if="militaryLockStatus" class="control-item">
            <div>
              <el-select v-model="soldierCut" filterable clearable placeholder="剪辑人员">
                <el-option
                  v-for="item in normalFormItemMap.editAndCutId.data"
                  :key="item.userId"
                  :label="item.realname"
                  :value="item.userId + '-' + item.realname"
                />
              </el-select>
            </div>
            <div class="m-t-10">
              <el-button v-log type="primary" plain @click="onBatchEditOrCut('cut')">批量标记剪辑人员</el-button>
            </div>
          </div>
        </div> -->
      </div>
      <el-table
        ref="military"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        row-key="flowId"
        header-row-class-name="table-header"
        @selection-change="handleSelectionChange"
        @sort-change="doSort"
      >
        <el-table-column type="selection" :selectable="hasEditMark" :reserve-selection="true" />
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
        <!-- <el-table-column class-name="table-title" label="标题" width="333" align="left">
          <template slot-scope="s">
            <div class="ta-l">
              <el-link
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :underline="false"
                target="_blank"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </div>
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="addTime" label="添加时间" width="110" /> -->
        <el-table-column prop="addTime" label="上传素材" width="100">
          <template slot-scope="scope">
            <el-button v-log size="small" @click="handleUpload(scope.row)">上传</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="platName" label="平台" />
        <el-table-column prop="accountName" label="账号" /> -->

        <el-table-column prop="flowCount" label="总流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="总点赞量" sortable="custom" />
        <el-table-column prop="updateTime" label="更新时间" width="110" />
        <el-table-column label="产品型号" width="210" :fixed="militaryLockStatus ? 'right' : false">
          <template slot-scope="scope">
            <!-- <el-cascader
              v-if="hasEditMark(scope.row)"
              v-model="scope.row.b2cPhoneModelId"
              placeholder="请选择产品型号"
              class="m-r-10"
              :options="modelData"
              :show-all-levels="false"
              :props="{
                checkStrictly: false,
                expandTrigger: 'hover',
                value: 'modelId',
                label: 'modelName',
                children: 'phoneModelVOList' }"
              filterable
              clearable
              :filter-method="dataFilter"
              @change="changePhoneType(scope.row, scope.row.b2cPhoneModelId)"
              @visible-change="handleShowOptions($event, scope.row, 'phoneTypeShow')"
            /> -->
            <div v-if="hasEditMark(scope.row)">
              <span>{{ scope.row.b2cPhoneModel }}</span>
              <el-button
                type="text"
                @click="handleShowMarkVideoDialog(scope.row)"
              >
                {{ scope.row.b2cPhoneModelId ? '修改标记' : '视频标记' }}
              </el-button>
            </div>
            <div v-else>{{ scope.row.b2cPhoneModel }}</div>
          </template>
        </el-table-column>
        <el-table-column label="视频类型" width="138" :fixed="militaryLockStatus ? 'right' : false">
          <template slot-scope="scope">
            <el-select
              v-if="hasEditMark(scope.row)"
              v-model="scope.row.junType"
              placeholder="视频类型"
              value-key="val"
              filterable
              @change="changeVideoType(scope.row, scope.row.junType)"
              @visible-change="handleShowOptions($event, scope.row, 'junTypeShow')"
            >
              <template v-if="scope.row.junTypeShow">
                <el-option
                  v-for="item in videoTypeItems"
                  :key="item.junType"
                  :label="item.junType"
                  :value="item.junType"
                />
              </template>
            </el-select>
            <div v-else>{{ scope.row.junType }}</div>
          </template>
        </el-table-column>
        <el-table-column v-if="$permission('command_row')" prop="videoCommand" label="口令" width="140">
          <template slot-scope="{ row }">
            <el-input v-model.trim="row.videoCommand" maxlength="6" :disabled="$permission('influence_video_sign')" @keyup.enter.native="hanldeChangeWand(row)" @blur="hanldeChangeWand(row)">
              <!-- <template slot="append"><el-button type="primary" size="mini" :class="[{'btn-edit': row.videoCommand !== row._videoCommand}]" @click="hanldeChangeWand(row)">确定</el-button></template> -->
            </el-input>
          </template>
        </el-table-column>

        <el-table-column label="编辑人员" width="110" :fixed="militaryLockStatus ? 'right' : false">

          <template slot-scope="scope">
            <el-select
              v-if="hasEditMark(scope.row)"
              v-model="scope.row.editId"
              placeholder="请选择"
              filterable
              @change="changeCutAndEdit(scope.row, 'edit')"
              @visible-change="handleShowOptions($event, scope.row, 'editShow')"
            >
              <template v-if="scope.row.editShow">
                <el-option
                  v-for="item in normalFormItemMap.editAndCutId.data"
                  :key="item.userId"
                  :label="item.realname"
                  :value="`${item.userId}-${item.realname}`"
                />
              </template>
              <template v-else>
                <el-option
                  :key="scope.row.editId"
                  :value="scope.row.editId"
                  :label="scope.row.editName"
                />
              </template>
            </el-select>
            <div v-else>{{ scope.row.editName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="剪辑人员" width="110" :fixed="militaryLockStatus ? 'right' : false">
          <template slot-scope="scope">
            <el-select
              v-if="hasEditMark(scope.row)"
              v-model="scope.row.cutId"
              placeholder="请选择"
              filterable
              @change="changeCutAndEdit(scope.row, 'cut')"
              @visible-change="handleShowOptions($event, scope.row, 'cutShow')"
            >
              <template v-if="scope.row.cutShow">
                <el-option
                  v-for="item in normalFormItemMap.editAndCutId.data"
                  :key="item.userId"
                  :label="item.realname"
                  :value="`${item.userId}-${item.realname}`"
                />
              </template>
              <template v-else>
                <el-option
                  :key="scope.row.cutId"
                  :value="scope.row.cutId"
                  :label="scope.row.cutName"
                />
              </template>
            </el-select>
            <div v-else>{{ scope.row.cutName }}</div>
          </template>
        </el-table-column>

        <el-table-column v-if="$permission('influence_video_sign')" label="网红" width="140" :fixed="militaryLockStatus ? 'right' : false">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.influencerId"
              placeholder="请选择"
              filterable
              @change="handleInfluencer(row, 'influencer')"
              @visible-change="handleShowOptions($event, row, 'influencerShow')"
            >
              <el-option
                v-for="item in pirateFrontUsers"
                :key="item.userId"
                :label="item.realname"
                :value="+item.userId"
              />
            </el-select>
            <!-- <el-input v-model.trim="row.influencer" style="width:120px" maxlength="8" placeholder="请输入网红" @keyup.enter.native="handleInfluencer(row)" @blur="handleInfluencer(row)" /> -->
          </template>
        </el-table-column>

        <el-table-column v-if="$permission('influence_video_sign')" label="摄影人员" width="120" :fixed="militaryLockStatus ? 'right' : false">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.photographerId"
              placeholder="请选择"
              filterable
              @change="handleInfluencer(row, 'photographer')"
              @visible-change="handleShowOptions($event, row, 'photographerShow')"
            >
              <el-option
                v-for="item in pirateFrontUsers"
                :key="item.userId"
                :label="item.realname"
                :value="+item.userId"
              />
            </el-select>
          </template>
        </el-table-column>

      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <upload-dialog
      :dialog-data="uploadData"
      :show.sync="showUpload"
      @uploadSuccess="getList"
    />

    <mark-video-dialog
      :id="markVideoRowData.b2cPhoneModelId"
      :show="showMarkVideoDialog"
      :row-data="markVideoRowData"
      :data="modelData"
      @close="showMarkVideoDialog = false"
      @confirm="handleConfirmMarkVideo"
    />
    <!-- <SelectPeople /> -->
  </div>
</template>

<script>
import mixin from '../@coms/mixin'
import commonMixin from '../../@mods/common-mixin'
import uploadDialog from '../../@mods/upload-dialog/index'
import MarkVideoDialog from '../@components/mark-video-dialog.vue'
import { VideoInfo, AccountCard } from 'components'
import VirtualCascader from '@/components/VirtualCascader'
// import { $getB2CPhoneModel } from '@/api/bussiness-manage'
import {
  extend,
  copy,
  isArray
} from '@/components/common'
import {
  unique
} from '@/utils'
import {
  $getCondition,
  $getAchievementList,
  $putAchievementVideo,
  $getVideoUnSign,
  $getMarkAccount,
  $updateVideoInfo,
  $getLastSoilderDate,
  $updatePhoneModel,
  $getPirateFrontUsers
} from '@/api/military-manage'
import qs from 'qs'
import dayjs from 'dayjs'
import { downloadFile } from '@/utils/download'
const SEARCH_MODEL = {
  accountId: '',
  // belongName: '',
  determined: '',
  flowStart: '',
  flowEnd: '',
  timerange: '',
  editId: '',
  cutId: ''
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
function initDate() {
  const start = dayjs().add(-7, 'day').format('YYYY-MM-DD')
  const end = dayjs().format('YYYY-MM-DD')
  return [start, end]
}

export default {
  components: {
    uploadDialog,
    AccountCard,
    VideoInfo,
    VirtualCascader,
    MarkVideoDialog
    // SelectPeople
  },
  mixins: [commonMixin, mixin],
  data() {
    return {
      uploadData: {},
      showUpload: false,
      searchData: {
        timerange: undefined
      },
      size: 20,
      unmark: 0,
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
            key: 'accountId',
            data: [],
            optionLabelKey: 'belongName',
            optionValKey: 'accountId',
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
            key: 'jobType',
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
            key: 'editAndCutId',
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
      optionsData: {},
      videoType: '',
      videoTypeItems: [],
      defVideoType: [],
      soldiers: [],
      videoTypes: [],
      selected: {},
      soldierCut: '',
      soldierEdit: '',
      methodId: 1,
      modelData: [],
      b2cPhoneModelId: '',
      pirateFrontUsers: [],
      markValue: '',
      markType: 'videoType',
      markList: [],
      markValueList: [],
      virtualData: [],
      showMarkVideoDialog: false,
      markVideoRowData: {}
    }
  },
  async created() {
    this.buildFormConf()
    // this.getB2CPhoneModel()
    this.getCondition()
    this.getPirateFrontUsers()
    const timerange = await this.getDefaultStartTimes()
    this.searchData.timerange = timerange
    this.getList()
  },

  methods: {
    handleShowMarkVideoDialog(row) {
      this.showMarkVideoDialog = true
      this.markVideoRowData = { ...row }
    },
    handleConfirmMarkVideo() {
      this.showMarkVideoDialog = false
      this.getList(false)
    },
    async getPirateFrontUsers() {
      const { code, data } = await $getPirateFrontUsers()
      if (+code === 1) {
        this.pirateFrontUsers = data || []
      }
    },
    dataFilter(node, val) {
      const REP = /\s+/g
      const txt = (node.text || '').replace(REP, '')
      const value = (val || '').replace(REP, '')
      if (!!~txt.indexOf(val) || !!~txt.toUpperCase().indexOf(value.toUpperCase())) {
        return true
      }
    },
    async getDefaultStartTimes() {
      const res = await $getLastSoilderDate()
      if (res.code === 1) {
        const start = dayjs(res.data.startSoilderDate).format('YYYY-MM-DD')
        const end = dayjs(start).add(7, 'day').format('YYYY-MM-DD')
        return [start, end]
      } else {
        return initDate()
      }
    },
    handleShowOptions(show, row, type) {
      row[type] = show
    },
    selectable(row) {
      this.hasEditMark(row)
      // const hasEdit = this.hasEditMark(row)
      // if (hasEdit) {}
    },
    /**
     * 修改网红
     */
    handleInfluencer(row, type) {
      // if (!row.influencer) {
      //   return
      // }

      const params = {
        flowId: row.flowId,
        signType: 1
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
        } else {
          this.$message.error('操作失败')
          if (type === 'influencer') {
            row.influencerId = ''
            row.influencer = ''
          } else {
            row.photographerId = ''
            row.photographer = ''
          }
        }
      })
    },
    // 口令更改
    hanldeChangeWand(row) {
      if (row.videoCommand === row._videoCommand) {
        // 口令未更改
        return
      }
      if (!row.videoCommand) {
        row.videoCommand = row._videoCommand
        return this.$message.error('请输入正确的口令')
      }
      $updateVideoInfo({
        flowId: row.flowId,
        signType: 1,
        influencer: row.influencer,
        videoCommand: row.videoCommand
      }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          row._videoCommand = row.videoCommand
        } else {
          row.videoCommand = row._videoCommand
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        row.videoCommand = row._videoCommand
        this.$message.error(err.message)
      })
    },
    checkVerifyPermission(item) {
      // 没传 item 的话就是在表格外调用，这个时候不执行单条数据的检查逻辑
      return false
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     */
    async onSearchChange(val, item, type, index, model) {
      this.searchData[item.key] = val
      switch (item.key) {
          case 'platId':
            this.getAccount()
            break
      }
    },
    getAccount() {
      $getMarkAccount({
        platId: this.searchData.platId,
        accountType: 1,
        methodId: this.methodId
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data.accountInfo || []
        }
      })
    },
    async getCondition() {
      try {
        const res = await $getCondition({ methodId: this.methodId })
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.plats
          this.normalFormItemMap.accountId.data = unique(res.data.accounts, 'belongName')
          this.normalFormItemMap.editAndCutId.data = res.data.employeeNameVO
          this.normalFormItemMap.junType.data = res.data.videoType
          this.videoTypeItems = res.data.videoType
          this.formatList('videoType')
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
      }
    },
    // 批量标记列表
    formatList(markType) {
      const data = {
        videoType: this.normalFormItemMap.junType.data,
        photographerId: this.pirateFrontUsers,
        influencerId: this.pirateFrontUsers,
        editId: this.normalFormItemMap.editAndCutId.data,
        cutId: this.normalFormItemMap.editAndCutId.data
      }
      if (markType && data[`${markType}`] && data[`${markType}`].length) {
      const list = []
       data[`${markType}`].forEach(item => {
          if (markType === 'videoType') {
            list.push({ label: item.junType, value: item.junType })
          } else {
            list.push({ label: item.realname, value: item.userId })
          }
        })
        this.markList = list
      }
    },
    /**
     * 获取表格列表数据
     */
    async getList(loading = true) {
      this.loading = loading
      this.loadUnmark()
      this.searchChangeButNotSubmit = false
      const params = copy(this.searchData)
      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      try {
        const res = await $getAchievementList(params)
        if (res.code === 1) {
          this.total = res.total
          this.tableData = res.data.map(t => {
            if (t.editId) {
              t.editId = t.editId + '-' + t.editName
            } else {
              t.editId = null
            }
            if (t.cutId) {
              t.cutId = t.cutId + '-' + t.cutName
            } else {
              t.cutId = null
            }
            t._videoCommand = t.videoCommand
            t.junTypeShow = false
            t.cutShow = false
            t.editShow = false
            t.phoneModelId = this.getPhoneModel(t.phoneModelId)
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
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      }
    },
    hasEditMark(row) {
      // 控制是否可以操作标记人员
      return (!row.lockStatus && this.militaryLockStatus)
    },
    handleUpload(rowData) {
      this.uploadData = copy(rowData)
      this.showUpload = true
    },
    loadUnmark() {
      $getVideoUnSign().then(res => {
        if (res.code === 1) {
          this.unmark = res.data
        } else {
          this.$message.error(res.message)
        }
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

      // if (this.$refs.search.$refs.cascader) {
      //   reqData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      reqData.b2cPhoneModelIds = this.virtualData
      // reqData.b2cPhoneModelId = reqData.b2cPhoneModelId && reqData.b2cPhoneModelId.length ? reqData.b2cPhoneModelId[reqData.b2cPhoneModelId.length - 1] : ''
      // window.location.href = `/api/achievement/video/export?${qs.stringify(reqData)}&componentId=${this.$componentId}`
      downloadFile('/api/achievement/video/export', {
        ...reqData,
        componentId: this.$componentId
      })
    },
    buildFormConf() {
      const normalFormItemMap = {}
      this.formConf.normal.forEach(function(item, index) {
        console.info('---iyem.key', item, item.key)
        normalFormItemMap[item.key] = item
        // SEARCH_MODEL[item.key] = ''
      })
      this.normalFormItemMap = normalFormItemMap
    },
    buildReqParams() {
      return [this.buildReqData(this.searchData, 1, SEARCH_MODEL)]
    },
    /**
     * 剪辑 || 编辑
     * @param  {Number} flowId        处理的数据 flow id
     * @param  {Number} cut_or_editId 操作者 id
     * @param  {String} type           操作类型
     */
    changeCutAndEdit(row, type) {
      const { saveFlowIds, updateFlowIds } = this.getParamsFlowIds(row, type)

      const data = { saveFlowIds, updateFlowIds, updateType: type === 'cut' ? 2 : 3 }

      if (type === 'cut') {
        const split = row.cutId.split('-')
        data.cutId = split[0]
        data.cutName = split[1] || ''
      } else {
        const split = row.editId.split('-')
        data.editId = split[0]
        data.editName = split[1] || ''
      }

      $putAchievementVideo(data)
        .then(re => {
          if (re.code === 1) {
            this.$message.success(re.message || '操作成功')
          } else {
            this.$message.error(re.message)
          }
          this.getList(false)
        })
    },
    /**
     * 标记视频类型
     * @param  {Number} flowId     处理的数据 flow id
     * @param  {Number} junType    视频类型 id
     * @param  {String} platId     平台
     */
    changeVideoType(row, junType) {
      const { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds } = this.getParamsFlowIds2(row, true)

      const data = { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds, updateType: 1, junType: junType }
      $putAchievementVideo(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
          } else {
            this.$message.error(re.message)
          }
          this.getList(false)
        })
    },
    changePhoneType(row, phoneType) {
      let b2cPhoneModelId = ''
      if ((phoneType || []).length > 1) {
        b2cPhoneModelId = phoneType[phoneType.length - 1]
      } else {
        b2cPhoneModelId = ''
      }
      const data = { flowId: row.flowId, b2cPhoneModelId: b2cPhoneModelId }

      $updatePhoneModel(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
          } else {
            this.$message.error(re.message)
          }
          this.getList(false)
        })
    },
    /**
     * 表格选择响应函数
     * @param {Array} val 当前选中的数组
     */
    handleSelectionChange(val) {
      // console.log(val, '--val')
      this.selected = val
      // this.$set(this.selected, val, val)
    },
    // 批量标记
    onBatchMark(type) {
      if (this.searchChangeButNotSubmit) {
        this.$message({
          message: '搜索条件已改变，请先查询数据',
          type: 'warning'
        })
        return
      }

      // if (!this.searchData.platId) {
      //   this.$tip("请选择平台", "warning");
      //   return;
      // }

      if (!this.selected.length) {
        this.$message({
          message: '您还没勾选哦',
          type: 'error'
        })
        return
      }
      // let b2cPhoneModelId = ''
      // if (type === 'phone' && !this.b2cPhoneModelId.length) {
      //   this.$message({
      //     message: `请选择产品型号`,
      //     type: 'error'
      //   })
      //   return
      // } else {
      //   b2cPhoneModelId = this.b2cPhoneModelId[this.b2cPhoneModelId.length - 1]
      // }
      let b2cPhoneModelId = ''
      if (this.markType === 'b2cPhoneModelId') {
        if (this.b2cPhoneModelId.length) {
          b2cPhoneModelId = this.b2cPhoneModelId[this.b2cPhoneModelId.length - 1]
        } else {
          this.$message({
            message: '请选择产品型号',
            type: 'error'
          })
          return
        }
      }

      // if (type === 'video' && !this.videoType) {
      //   this.$message({
      //     message: `请选择视频类型`,
      //     type: 'error'
      //   })
      //   return
      // }
      if (!this.markValue && this.markType !== 'b2cPhoneModelId') {
        let message = ''
        switch (this.markType) {
          case 'influencerId':
            message = '请选择网红艺人'
          break
          case 'photographerId':
            message = '请选择摄影人员'
          break
          case 'videoType':
            message = '请选择视频类型'
          break
          case 'cutId':
            message = '请选择剪辑人员'
          break
          case 'editId':
            message = '请选择编辑人员'
          break
        }
        this.$message({
          message: message,
          type: 'error'
        })
        return
      }
      const { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds } = this.getParamsFlowIds2()
      const data = { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds }

      let updateType = 4
      if (this.markType) {
        switch (this.markType) {
          case 'influencerId':
           updateType = 5
          break
          case 'photographerId':
            updateType = 6
          break
          case 'videoType':
            updateType = 1
          break
          case 'cutId':
            updateType = 2
          break
          case 'editId':
           updateType = 3
          break
        }
      }
      data.updateType = updateType
      if (this.markType === 'b2cPhoneModelId') {
        data.b2cPhoneModelId = b2cPhoneModelId
      } else {
        if (this.markType === 'videoType') {
          data.junType = this.markValue
        } else {
          data[this.markType] = this.markValue
        }
      }
      $putAchievementVideo(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
            this.$refs.military.clearSelection()
            this.getList()
          } else {
            this.$message.error(re.message)
          }
        })
    },
    /**
     * 批量标记剪辑或编辑人员
     * @param {String} type  操作类型
     */
    onBatchEditOrCut(type) {
      if (!this.selected.length) {
        this.$message({
          message: '您还没勾选哦',
          type: 'error'
        })
        return
      }

      if (
        (type === 'cut' && !this.soldierCut) ||
        (type === 'edit' && !this.soldierEdit)
      ) {
        this.$message({
          message: `请选择${type === 'cut' ? '剪辑' : '编辑'}人员`,
          type: 'error'
        })
        return
      }
      const { saveFlowIds, updateFlowIds } = this.getParamsFlowIds()

      const data = { saveFlowIds, updateFlowIds, updateType: type === 'cut' ? 2 : 3 }

      if (type === 'cut') {
        const splitEdit = this.soldierCut.split('-')
        data.cutId = Number(splitEdit[0])
        data.cutName = splitEdit[1]
      } else {
        const splitEdit = this.soldierEdit.split('-')
        data.editId = Number(splitEdit[0])
        data.editName = splitEdit[1]
      }

      $putAchievementVideo(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
            this.$refs.military.clearSelection()
            if (type === 'cut') {
              // this.soldierCut = ''
            } else {
              // this.soldierEdit = ''
            }
            this.getList()
            // this.reload(true, undefined, undefined, SEARCH_MODEL)
          } else {
            this.$message.error(re.message)
          }
        })
    },
    getParamsFlowIds(row, rowType) {
      // console.log(rowType, '--row')
      const saveFlowIds = []
      const updateFlowIds = []
      const savePlatIds = []
      const updatePlatIds = []
      const list = row ? [row] : this.selected
      list.forEach(function(item) {
        const { hdStatus, cutId, editId, platId } = item
        if (!hdStatus && (rowType === 'cut' ? true : !cutId) && (rowType === 'edit' ? true : !editId)) {
          saveFlowIds.push(item.flowId)
          savePlatIds.push(platId)
        } else {
          updateFlowIds.push(item.flowId)
          updatePlatIds.push(platId)
        }
      })
      return { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds }
    },

    getParamsFlowIds2(row, hasOnly) {
      const saveFlowIds = []
      const updateFlowIds = []
      const savePlatIds = []
      const updatePlatIds = []
      const list = row ? [row] : this.selected
      list.forEach(function(item) {
        const { hdStatus, cutId, editId, platId } = item
        // console.log(!cutId && !editId, '--!cutId && !editId ')
        // if ((hasOnly ? true : !hdStatus) && !cutId && !editId) {
        if (!hdStatus && !cutId && !editId) {
          saveFlowIds.push(item.flowId)
          savePlatIds.push(platId)
        } else {
          updateFlowIds.push(item.flowId)
          updatePlatIds.push(platId)
        }
      })
      return { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds }
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
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData = Object.assign({}, this.searchData, data)
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
    },
    getPhoneModel(value) {
      const item = this.modelData.find(item => +item.modelId === +value)
      return (item || {}).modelId
    },
    handleMarkRadio(val) {
      if (this.markValueList[val]) {
       this.markValue = this.markValueList[val]
      } else {
        this.markValue = ''
      }
      this.markList = []
      this.formatList(val)
    },
    handleMarkValue(val) {
      if (val && this.markType) {
        this.markValueList[this.markType] = this.markValue
      }
    },
    confirmMark() {
      //  this.$confirm('确认批量修改?', '提示', {
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     type: 'warning'
      //   }).then(() => {
       this.onBatchMark()
    }
    // /**
    //  * 产品型号列表
    //  */
    // async getB2CPhoneModel() {
    //   const { code, data } = await $getB2CPhoneModel()
    //   if (+code === 1) {
    //     this.modelData = data || []
    //   }
    // }
  }
}
</script>
<style lang="scss" scoped>
.mark-title{
  width: 175px;
  font-size: 14px;
  color: #595959;
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
