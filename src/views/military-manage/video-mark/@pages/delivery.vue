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
    <Wrap class="m-t-16 table-view">
      <div class="military-control-view">
        <div class="unmark">
          <el-link type="danger" :underline="false">视频类型、编辑人员、剪辑人员都标记完整才能计算军功，截至当前存在{{ unmark }}条未标记完整！</el-link>
        </div>
        <div class="controls">
          <div v-if="militaryLockStatus" class="control-item">
            <el-form :inline="true">
              <el-form-item>
                <el-select
                  v-model="videoType"
                  clearable
                  filterable
                  placeholder="视频类型"
                  @visible-change="checkVideoItems"
                >
                  <el-option
                    v-for="item in videoTypeItems"
                    :key="item.junType"
                    :label="item.junType"
                    :value="item.junType"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button v-log type="primary" plain @click="onBatchMark">批量标记视频类型</el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
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
          <el-table-column type="selection" :selectable="hasEditMark" />
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
                  v-if="s.row.url"
                  :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                  :href="s.row.url"
                  :underline="false"
                  target="_blank"
                >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="addTime" label="发布时间" width="110" /> -->
          <!-- <el-table-column prop="platName" label="平台" /> -->
          <!-- <el-table-column prop="accountName" label="账号" /> -->
          <el-table-column prop="flowCount" label="总流量" sortable="custom" width="200" />
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
          <el-table-column label="视频类型" width="168" prop="junType" />
          <el-table-column label="编辑人员" width="120" prop="editName" />
          <el-table-column v-if="militaryLockStatus" label="操作">
            <template slot-scope="scope">
              <div v-if="hasEditMark(scope.row)">
                <el-link v-log type="primary" @click="handleEdit(scope.row)">编辑</el-link>
              </div>
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
            @current-change="getSignList"
          />
        </div>
      </div>
    </Wrap>
    <upload-dialog
      :dialog-data="uploadData"
      :show.sync="showUpload"
      readonly
      @uploadSuccess="onSubmit(searchData)"
    />
    <el-dialog title="编辑" :visible.sync="showDialog" width="40%" :before-close="handleClose">
      <el-form ref="form" :model="editData" :rule="editRules" label-width="120px">
        <el-form-item label="标题：">
          <el-link
            v-if="editData.url"
            type="primary"
            :href="editData.url"
            target="_blank"
          >{{ editData.titleName }}</el-link>
          <p v-else>{{ editData.titleName }}</p>
        </el-form-item>
        <el-form-item label="发布时间：">{{ editData.addTime }}</el-form-item>
        <el-form-item label="平台：">{{ editData.platName }}</el-form-item>
        <el-form-item label="账号：">{{ editData.accountName }}</el-form-item>
        <el-form-item label="编辑人员：">{{ editData.editName }}</el-form-item>
        <el-form-item label="剪辑人员：">{{ editData.cutName }}</el-form-item>
        <el-form-item label="视频类型：" prop="junType">
          <el-select v-model="editData.junType" filterable clearable>
            <el-option
              v-for="item in newVideoTypeItems"
              :key="item.junType"
              :value="item.junType"
              :label="item.junType"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="流量：" prop="flowCount">
          <el-input-number v-model="editData.flowCount" />
        </el-form-item>

        <el-form-item label="上传视频素材：">
          <el-upload
            ref="uploadVideo"
            v-loading="uploadLoading"
            class="upload-view"
            :on-success="uploadVideoSuccess"
            :before-upload="beforeUpload"
            :show-file-list="false"
            drag
            :limit="1"
            accept=".mp4"
            name="file"
            element-loading-text="正在上传视频..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.6)"
            :action="'/api/video/input/uploadVideo'"
          >

            <div v-if="editData.videoUrl" class="upload-wrap el-upload-list--picture-card">
              <img
                class="pic"
                src="@/assets/video.png"
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click.stop.prevent="openUrl(editData.videoUrl)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  class="el-upload-list__item-delete"
                  @click.stop.prevent="delectVideo"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
            <div v-else>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将视频文件拖到此处，或点击上传
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传图片素材：">
          <el-upload
            drag
            accept="*"
            :limit="1"
            class="upload-view"
            :on-success="uploadPhotoSuccess"
            :show-file-list="false"
            :action="'/api/admin/uploadImage'"
            name="file"
          >
            <img v-if="editData.imgUrl" :src="`${editData.imgUrl}`" class="pic">
            <div v-else>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将图片文件拖到此处
              </div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button v-log="{operation_module: '确定编辑'}" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mixin from '../@coms/mixin'
import commonMixin from '../../@mods/common-mixin'
import uploadDialog from '../../@mods/upload-dialog/index'
import { VideoInfo, AccountCard } from 'components'
import VirtualCascader from '@/components/VirtualCascader'

import {
  extend,
  copy,
  isArray,
  checkFilterRule,
  filterByRule
} from '@/components/common'
const SEARCH_MODEL = {
  platId: '',
  accountId: '',
  editId: '',
  titleName: '',
  junType: '',
  flowStart: '',
  flowEnd: '',
  startTime: '',
  endTime: '',
  timerange: [],
  pageNum: 1,
  size: 20,
  determined: ''
}
import { $getJunType } from '@/api/putting-manager'
import { $getSignCondition, $getVideoType, $getSignList, $updateSign, $getPuttingVideoUnSign, $getByPlatId, $putAchievementVideo } from '@/api/military-manage'
import { deepClone } from '@/utils'
import qs from 'qs'
import './delivery.scss'
import { downloadFile } from '@/utils/download'

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
    uploadDialog,
    AccountCard,
    VideoInfo,
    VirtualCascader
  },
  mixins: [commonMixin, mixin],
  data() {
    return {
      loading: false,
      editData: {
        orderNumber: '',
        hdSoldierId: '',
        videoUrl: '',
        imgUrl: '',
        platName: '',
        junType: '',
        flowCount: '',
        editName: '',
        cutName: '',
        accountName: '',
        url: '',
        titleName: '',
        addTime: '',
        platId: '',
        flowId: '',
        brand: '',
        businessType: '',
        accountId: ''
      },
      nowPage: 1,
      editRules: {
        junType: [
          { required: true, message: '请选择视频类型', trigger: 'blur' }
        ],
        flowCount: [
          { required: true, message: '请输入视频流量', trigger: 'blur' }
        ]
      },
      uploadData: {},
      showUpload: false,
      dateArr: [],
      searchData: {
        ...SEARCH_MODEL
      },
      showDialog: false,
      method_id: 2,
      unmark: 0,
      formConf: {},
      optionsData: {},
      videoType: '',
      videoTypeItems: [],
      newVideoTypeItems: [],
      defVideoType: [],
      soldiers: [],
      videoTypes: [],
      selected: [],
      soldierCut: '',
      soldierEdit: '',
      uploadLoading: false,
      virtualData: []
    }
  },
  computed: {
    uploadPhotoUrl() {
      // return this.$request.buildUrl("/comment/upload_photo");
      return ''
    }
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.nowPage = nVal
        this.getMulitaryDeliveryList(
          this.buildReqData(this.searchData, nVal, SEARCH_MODEL)
        ).then(re => {
          if (re) {
            this.processTableData(re.list)
            this.tableData = re.list
            this.total = re.total
          }
        })
      }
    }
  },
  mounted() {
    this.buildFormConf()
    this.getSignCondition()
    this.getSignList()
    // this.getVideoType(1)
    // this.loadBaseSearchData();
    // this.getUnmarkDelivery();
  },
  methods: {
    openUrl(url) {
      window.open(url)
    },
    delectVideo() {
      this.editData.videoUrl = ''
      this.$refs.uploadVideo.clearFiles()
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
            res = await $getByPlatId({
              platId: val
            })
            if (res.code === 1) {
              this.normalFormItemMap.accountId.data = res.data.accountInfo || []
            }
            break
          default:
            this.searchData[item.key] = val
      }
    },
    async getSignList() {
      this.loadUnmark()
      const params = deepClone(this.searchData)
      if (params.timerange && params.timerange.length) {
        params.startTime = params.timerange[0] + ' 00:00:00'
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      this.loading = true
      try {
        const res = await $getSignList(params)
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
    async getVideoType(platId) {
      const res = await $getVideoType({
        platId
      })
      if (res.code === 1) {
        this.videoTypeItems = res.data
      }
    },
    async getSignCondition() {
      const res = await $getSignCondition()
      if (res.code === 1) {
        this.normalFormItemMap.platId.data = res.data.plats
        this.normalFormItemMap.accountId.data = res.data.accounts
        this.normalFormItemMap.editId.data = res.data.employeeNameVO
        this.normalFormItemMap.junType.data = res.data.videoType
        this.videoTypeItems = res.data.videoType
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
          key: 'editId',
          data: [],
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          conf: {
            placeholder: '请输入人员名称'
          }
        }
      ]
      normal = filterByRule(normal)
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        SEARCH_MODEL[item.key] = ''
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: checkFilterRule([])
      }
    },
    beforeUpload() {
      this.uploadLoading = true
    },
    uploadVideoSuccess(res) {
      this.uploadLoading = false
      if (res.code === 1) {
        this.editData.videoUrl = res.data
      }
    },
    uploadPhotoSuccess(res) {
      this.uploadLoading = false
      if (res.code === 1) {
        this.editData.imgUrl = res.data
      }
    },
    handleConfirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          $updateSign(this.editData)
            .then(res => {
              if (res) {
                if (res.code === 1) {
                  this.$message.success('编辑成功')
                  this.onSubmit({}, this.nowPage)
                  this.handleClose()
                } else {
                  this.$message.error(res.message)
                }
              }
            }).catch(err => {
              if (err.__CANCEL__) {
                return
              }
              if (err.message) {
                this.$message.error(err.message)
              } else {
                this.$message.error('编辑失败，请重试')
              }
              console.log(err)
            })
        }
      })
    },
    handleClose() {
      this.showDialog = false
    },
    async handleEdit(row) {
      const editData = this.editData
      for (const key in editData) {
        editData[key] = row[key] || ''
      }
      // this.getEditVideoType(row.platId);
      this.showDialog = true
      const res = await $getJunType({ accountId: this.editData.accountId, brandTag: this.editData.brand, dictValue: this.editData.businessType })
      if (+res.code === 1) {
        this.newVideoTypeItems = res.data || []
      }
    },
    hasEditMark(row) {
      // 控制是否可以操作标记人员
      return row.lockStatus !== 1 && this.militaryLockStatus
    },
    handleUpload(rowData) {
      this.uploadData = JSON.parse(JSON.stringify(rowData))
      this.showUpload = true
    },
    loadUnmark() {
      $getPuttingVideoUnSign().then(re => {
        if (re.code === 1) {
          this.unmark = re.data
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
      var reqData = extend(this.searchData, data)
      if (reqData.timerange && reqData.timerange.length) {
        reqData.startTime = reqData.timerange[0] + ' 00:00:00'
        reqData.endTime = reqData.timerange[1] + ' 23:59:59'
        delete reqData.timerange
      }

      // if (this.$refs.search.$refs.cascader) {
      //   reqData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      // reqData.b2cPhoneModelId = reqData.b2cPhoneModelId && reqData.b2cPhoneModelId.length ? reqData.b2cPhoneModelId[reqData.b2cPhoneModelId.length - 1] : ''
      reqData.b2cPhoneModelIds = this.virtualData
      window.location.href = `/api/achievement/putting/video/sign/export?${qs.stringify(reqData)}&componentId=${this.$componentId}`
      downloadFile('/api/achievement/putting/video/sign/export', {
        ...reqData,
        componentId: this.$componentId
      })
    },
    /**
     * 表格选择响应函数
     * @param {Array} val 当前选中的数组
     */
    handleSelectionChange(val) {
      console.log(val)
      this.selected = val
    },
    getParamsFlowIds2(row) {
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
    // 批量标记视频类型
    onBatchMark() {
      // if (this.searchChangeButNotSubmit) {
      //   this.$message({
      //     message: '搜索条件已改变，请先查询数据',
      //     type: 'warning'
      //   })
      //   return
      // }

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

      if (!this.videoType) {
        this.$message({
          message: '请选择视频类型',
          type: 'error'
        })
        return
      }
      const { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds } = this.getParamsFlowIds2()

      const data = { saveFlowIds, updateFlowIds, savePlatIds, updatePlatIds, updateType: 1, junType: this.videoType }

      $putAchievementVideo(data)
        .then(re => {
          if (re.code === 1) {
            this.$message({
              message: re.message,
              type: 'success'
            })
            this.$refs.military.clearSelection()
            this.getSignList()
            // this.reload(true, undefined, 'post', SEARCH_MODEL)
          } else {
            this.$message.error(re.message)
          }
        })
    },
    // 批量标记视频
    // onBatchMark() {
    //   if (this.searchChangeButNotSubmit) {
    //     this.$message.error('搜索条件已改变，请先查询数据')
    //     return
    //   }

    //   if (!this.selected.length) {
    //     this.$message.error('您还没勾选哦')
    //     return
    //   }

    //   if (!this.videoType) {
    //     this.$message.error('请选择视频类型')
    //     return
    //   }
    //   const hdSoilderIds = this.selected.map(function(item) {
    //     return item.hdSoldierId
    //   })
    //   $putBatchSign({
    //     hdSoilderIds,
    //     junType: this.videoType
    //   }).then(re => {
    //     if (re.code === 1) {
    //       this.$message.success(re.message)
    //       this.$refs.military.clearSelection()
    //       this.videoType = ''
    //       this.onSubmit({}, this.nowPage)
    //     } else {
    //       this.$message.error(re.message || '网路错误')
    //     }
    //   })
    // },
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
      this.searchChangeButNotSubmit = false
      this.searchData = extend(this.searchData, data)

      // if (this.$refs.search.$refs.cascader) {
      //   this.searchData.b2cPhoneModelIdStrs = this.$refs.search.$refs.cascader.getCheckedNodes().filter(item => {
      //     return !item.hasChildren
      //   }).map(item => {
      //     return item.data.modelId
      //   }).join(',')
      // }
      this.searchData.b2cPhoneModelIds = this.virtualData
      // this.searchData.b2cPhoneModelId = this.searchData.b2cPhoneModelId && this.searchData.b2cPhoneModelId.length ? this.searchData.b2cPhoneModelId[this.searchData.b2cPhoneModelId.length - 1] : ''
      this.searchData.pageNum = 1
      this.getSignList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .military-control-view {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
