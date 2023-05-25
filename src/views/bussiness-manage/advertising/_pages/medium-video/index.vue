<template>
  <div class="P-advertisingLaunch">
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="时间范围">
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
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>

    <Wrap class="m-t-16">
      <div v-if="extFields && extFields.length" class="checkbox-view m-b-10">
        <el-checkbox-group v-model="extCols">
          <el-checkbox
            v-for="item in extFields"
            :key="item.fieldId"
            :label="item.fieldName"
          >{{ item.chnName }}</el-checkbox>
        </el-checkbox-group>
      </div>

      <div class="table-view">
        <el-table
          ref="flow"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column class-name="table-title" align="left" label="视频信息" width="400">
            <template slot-scope="{row}">
              <VideoInfo
                :info="row"
                :options="{
                  coverImg: 'videoCoverUrl',
                  title: 'titleName'
                }"
              />
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="账号信息" width="200" align="left">
            <template slot-scope="{row}">
              <AccountCard :info="row">
                <template slot="icon">
                  <el-tooltip v-if="row.isCommerce" effect="dark" content="视频购物车" placement="top">
                    <svg-icon icon-class="shops" class="svg-icon" />
                  </el-tooltip>
                </template>
              </AccountCard>
            </template>
          </el-table-column>
          <el-table-column prop="fansNum" label="粉丝数" sortable="custom" width="100" />
          <el-table-column prop="brandName" label="品牌方" />
          <el-table-column prop="executeUserName" label="执行人" />
          <el-table-column prop="meetUserName" label="媒介采买人" />
          <el-table-column prop="flowCount" label="流量" sortable="custom" width="80" />
          <template v-for="item in extFields">
            <el-table-column
              v-if="extColsStatus[item.fieldName]"
              :key="item.fieldId"
              :prop="item.fieldName"
              :label="item.chnName"
              sortable="custom"
              width="100"
            />
          </template>
          <el-table-column prop="addTime" label="发布时间" width="170px" />
          <el-table-column prop="flowMoney" label="执行金额" sortable="custom" />
          <el-table-column prop="cpm" label="CPM" sortable="custom">
            <template slot-scope="{row}">{{ row.cpm | toThousands }}</template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right">
            <template slot-scope="s">
              <IconTip
                v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
                content="查看"
                class="m-r-10"
                icon-class="iconxiangqing"
                @click="onCellBtn(s.row, 'detail')"
              />
              <IconTip
                v-if="$permission('middleground')"
                v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
                content="编辑"
                icon-class="iconbianji"
                @click="hanldeEdit(s.row)"
              />
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

    <el-dialog
      class="P-advertisingLaunchDialog"
      :width="dialogWidth"
      :title="dialogTitle"
      :visible.sync="dialogStatus"
      @close="onCancel"
    >
      <div v-if="dialogType === 'del'" class="P-advertisingLaunchDialogText">确认删除这条视频吗？</div>
      <div v-else class="P-advertisingLaunchDialogInfo">
        <div v-show="!video.playing" class="P-advertisingLaunchDialogInfoBox">
          <div class="P-advertisingLaunchDialogInfoTitle m-t-24">{{ dialogData.titleName }}</div>
          <div class="P-advertisingLaunchDialogInfoSummary">
            <div class="P-advertisingLaunchDialogInfoSummaryCol">
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="flow">
                <i>流量：</i>
                <span>{{ dialogData.flowCount || 0 }}</span>
              </div>
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="plat">
                <i>平台：</i>
                <span>{{ dialogData.platName || "" }}</span>
              </div>
            </div>
            <div class="P-advertisingLaunchDialogInfoSummaryCol">
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="up">
                <i>点赞：</i>
                <span>{{ dialogData.thumbUpCount || 0 }}</span>
              </div>
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="account">
                <i>账号：</i>
                <span>{{ dialogData.accountName }}</span>
              </div>
            </div>
            <div class="P-advertisingLaunchDialogInfoSummaryCol">
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="commend">
                <i>评论：</i>
                <span>{{ dialogData.commendCount || 0 }}</span>
              </div>
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="fans">
                <i>粉丝：</i>
                <span>{{ dialogData.fansNum || 0 }}</span>
              </div>
            </div>
            <div class="P-advertisingLaunchDialogInfoSummaryCol">
              <div class="P-advertisingLaunchDialogInfoSummaryItem" data-type="forwarded">
                <i>转发：</i>
                <span>{{ dialogData.forwardedCount || 0 }}</span>
              </div>
            </div>
          </div>
          <div class="P-advertisingLaunchDialogInfoCon">
            <div class="P-advertisingLaunchDialogInfoSub">
              <ul>
                <li>
                  <i>执行金额：</i>
                  <span data-b="1">{{ dialogData.flowMoney || 0 }}</span>
                </li>
                <li>
                  <i>CPM：</i>
                  <span data-b="1">{{ dialogData.cpm | toThousands }}</span>
                </li>
                <li>
                  <i>媒介采买人：</i>
                  <span>{{ dialogData.meetUserName || "" }}</span>
                </li>
                <li>
                  <i>执行人：</i>
                  <span>{{ dialogData.executeUserName || "" }}</span>
                </li>
                <li>
                  <i>品牌方：</i>
                  <span>{{ dialogData.brandName || "" }}</span>
                </li>
                <li>
                  <i>备注：</i>
                  <span>{{ dialogData.note || "" }}</span>
                </li>
              </ul>
              <ul>
                <li>
                  <i>最近编辑时间：</i>
                  <span>{{ dialogData.updateTime || "" }}</span>
                </li>
                <li>
                  <i>发布时间：</i>
                  <span>{{ dialogData.addTime || "" }}</span>
                </li>
              </ul>
            </div>
            <div class="P-advertisingLaunchDialogInfoWords">
              <div v-loading="dialogData._wcLoading" class="P-advertisingLaunchDialogInfoWordsImg">
                <div v-if="dialogData.wordcloudImg">
                  <img :src="dialogData.wordcloudImg" @error="dialogData.wordcloudImg = ''">
                </div>
                <div v-else class="P-advertisingLaunchDialogInfoWordsEmpty">暂无数据</div>
              </div>
              <div class="P-advertisingLaunchDialogInfoWordsFn">
                <button
                  :disabled="!dialogData.uploadUrl"
                  @click="playVideo(dialogData.uploadUrl)"
                >
                  <i class="el-icon-caret-right" />查看视频内容
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-show="video.playing" class="P-advertisingLaunchDialogInfoVideo">
          <div class="P-advertisingLaunchDialogInfoVideoClose" @click="hideVideo">返回</div>
          <video :src="video.url" controls />
        </div>
      </div>
      <div v-show="dialogType === 'del'" slot="footer" class="P-contentsDialogFooter">
        <el-button @click="onCancel">取消</el-button>
        <el-button :loading="dialogLoading" type="primary" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>

    <!--编辑-->
    <el-dialog title="编辑" :visible.sync="editVisible" width="30%" :before-close="editClose">
      <el-form ref="editForm" :model="editForm" status-icon label-width="100px">
        <el-form-item label="视频名称：">
          <el-link type="primary" target="_blank" :href="editForm.url">{{ editForm.titleName }}</el-link>
        </el-form-item>
        <el-form-item label="流量：" prop="flowCount">
          <el-input-number v-model="editForm.flowCount" type="password" />
        </el-form-item>
        <el-form-item label="视频上传：">
          <el-upload
            class="upload-view"
            :on-success="uploadVideoSuccess"
            :before-upload="beforeUpload"
            drag
            :limit="1"
            accept="*"
            name="video"
            :action="uploadVideoUrl"
          >
            <img
              v-if="editForm.videoUrl"
              src="@/assets/video.png"
              class="pic"
            >
            <div v-else>
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将视频文件拖到此处，或点击上传
                <em>点击上传</em>
              </div>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="备注：" prop="bakNote">
          <el-input v-model.number="editForm.bakNote" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import qs from 'qs'
import Search from '@/components/Search'
import tableMixin from '@/mixins/table'
import { $getmedVideoList, $editMedVideo, $getMedAccountFilterData, $getFilterRange, $getMedAccounts } from '@/api/bussiness-manage'
import {
  copy
} from '@/components/common'
import { Statistics, VideoInfo, AccountCard, IconTip } from 'components'
import { unique } from '@/utils'

export default {
  components: {
    vSearch: Search,
    Statistics,
    VideoInfo,
    AccountCard,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    // 可控制的列
    var extFields = [
      { status: true, fieldName: 'thumbUpCount', chnName: '点赞数' },
      { status: true, fieldName: 'commentCount', chnName: '评论数' },
      { status: true, fieldName: 'forwardedCount', chnName: '转发数' }
    ]
    // 可控制列显示状态
    var extColsStatus = {}
    // 可控制列选择状态
    var extCols = []

    extFields.forEach(item => {
      extCols.push(item.fieldName)
      extColsStatus[item.fieldName] = item.status
    })

    return {
      formConf: {},
      searchData: {
        accountId: '',
        platId: '',
        meetUserId: '',
        executeId: '',
        brandIds: '',
        tagValue: '',
        moneyRange: '',
        cpmRange: '',
        flowRange: '',
        determined: '',
        timerange: ''
      },
      summaryItems: [
        {
          key: 'accountCount',
          text: '账号',
          val: 0
        },
        {
          key: 'titleCount',
          text: '标题',
          val: 0
        },
        {
          key: 'flowCount',
          text: '流量',
          val: 0
        },
        {
          key: 'likeCount',
          text: '点赞',
          val: 0
        },
        {
          key: 'moneyCount',
          text: '执行金额',
          val: 0
        },
        {
          key: 'cpmCount',
          text: 'CPM总和',
          val: 0
        }
      ],
      extFields,
      extCols,
      extColsStatus,
      dialogType: 'detail',
      dialogStatus: false,
      dialogLoading: false,
      launchDialogStatus: false,
      dialogData: {},
      video: {
        url: '',
        playing: false
      },
      editVisible: false,
      editForm: {
        flowId: '',
        flowCount: '',
        bakNote: '',
        url: '',
        titleName: '',
        bakVideo: []
      },
      uploading: false
    }
  },
  computed: {
    uploadVideoUrl() {
      return '/api/video/input/uploadVideo'
    },
    // 浮层标题
    dialogTitle() {
      switch (this.dialogType) {
          case 'del':
            return '删除确认'
          case 'detail':
            return '视频详细信息'
          default:
            return ''
      }
    },
    // 浮层宽
    dialogWidth() {
      if (this.dialogType === 'del') {
        return '50%'
      }
      return '960px'
    }
  },
  watch: {
    extCols(nVal) {
      Object.keys(this.extColsStatus).forEach(key => {
        const status = nVal.indexOf(key) !== -1
        this.extColsStatus[key] = status
      })
    }
  },
  created() {
    this.buildFormConf()
    this.getFilterData()
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      const params = copy(this.searchData)
      if (params.timerange) {
        params.timeStart = params.timerange[0]
        params.timeEnd = params.timerange[1] + ' 59:59:59'
        delete params.timerange
      }
      $getmedVideoList(params).then((res) => {
        if (res.code === 1) {
          this.summaryItems.forEach(item => {
            item.val = res.data[item.key]
          })
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => console.error(err)).finally(() => {
        this.loading = false
      })
    },
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: {
            placeholder: '全部平台'
          },
          optionValKey: 'platId',
          optionLabelKey: 'platName'
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          },
          optionValKey: 'accountId',
          optionLabelKey: 'accountName'
        },
        // {
        //   type: 'select',
        //   key: 'isCommerce',
        //   data: [{
        //     text: '是',
        //     val: 1
        //   }, {
        //     text: '否',
        //     val: 0
        //   }],
        //   conf: {
        //     placeholder: '是否开通购物车'
        //   }
        // },
        {
          type: 'select',
          key: 'meetUserId',
          data: [],
          conf: {
            placeholder: '媒介采买人'
          },
          optionValKey: 'userId',
          optionLabelKey: 'realname'
        },
        {
          type: 'select',
          key: 'executeId',
          data: [],
          conf: {
            placeholder: '执行人'
          },
          optionValKey: 'userId',
          optionLabelKey: 'realname'
        },
        {
          type: 'select',
          key: 'brandId',
          data: [],
          conf: {
            placeholder: '品牌方'
          },
          optionValKey: 'brandIds',
          optionLabelKey: 'brandName'
        },
        {
          type: 'select',
          key: 'tagValue',
          data: [],
          conf: {
            placeholder: '达人类型'
          }
        },
        {
          type: 'select',
          key: 'moneyRange',
          data: [],
          conf: {
            placeholder: '执行金额'
          }
        },
        {
          type: 'select',
          key: 'cpmRange',
          data: [],
          conf: {
            placeholder: 'CPM'
          }
        },
        {
          type: 'select',
          key: 'flowRange',
          data: [],
          conf: {
            placeholder: '流量'
          }
        }
      ]
      const formConf = {
        normal,
        // hasExport: this.$permission('middleground')
        hasExport: this.$permission('manager_export')
      }
      const normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    getFilterData() {
      $getMedAccountFilterData().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.plats || []
          this.normalFormItemMap.brandId.data = res.data.brands || []
          this.normalFormItemMap.executeId.data = res.data.executeAccounts || []
          this.normalFormItemMap.meetUserId.data = res.data.meetAccounts || []
          this.normalFormItemMap.accountId.data = unique(res.data.accounts || [], 'accountId')
          this.normalFormItemMap.tagValue.data = res.data.tagValues.map(item => ({ val: item, text: item }))
        } else {
          this.$message.error(res.message)
        }
      })
      $getFilterRange().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.cpmRange.data = res.data.cpmRange.map(item => ({ val: item, text: item }))
          this.normalFormItemMap.moneyRange.data = res.data.moneyRange.map(item => ({ val: item, text: item }))
          this.normalFormItemMap.flowRange.data = res.data.flowRange.map(item => ({ val: item, text: item }))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    hanldeEdit(rowData) {
      const editForm = this.editForm
      for (const key in editForm) {
        editForm[key] = rowData[key] || ''
        if (key === 'bakVideo' && editForm[key]) {
          editForm[key] = JSON.parse(editForm[key])
        }
      }
      this.editVisible = true
    },
    filePreview(file) {
      // 文件预览
      if (file.response.data) {
        window.open(file.response.data)
      }
    },
    uploadVideoSuccess(re, file) {
      if (re && re.code === 1) {
        this.editForm.bakVideo.push({
          name: file.name,
          url: file.response.data
        })
      }
      this.uploading = false
    },
    beforeUpload(file) {
      if (file.size > this.uploadSizeLimit) {
        this.$message.error('请上传小于30M的文件')
        return false
      }
      this.uploading = true
    },
    editClose() {
      this.editVisible = false
    },
    editConfirm() {
      const params = Object.assign({}, this.editForm)
      params.bakVideo = JSON.stringify(params.bakVideo)
      $editMedVideo(params).then(res => {
        if (res.code === 1) {
          this.$message.success('编辑成功')
          this.editVisible = false
          this.getList()
          this.$bus.$emit('upLog', { titleName: params.titleName, flowId: params.flowId, operation_module: '编辑确定' })
        } else {
          this.$message.error(res.message)
        }
      }).catch(e => {
        this.$message.error('编辑失败')
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
        this.normalFormItemMap.accountId.data = []
        $getMedAccounts({ platId: val, methodId: 2 }).then(res => {
          this.normalFormItemMap.accountId.data = unique(res.data || [], 'accountId')
        })
      }
    },
    /**
     * 表格按钮点击响应函数
     * @param  {Object}  row   对应行数据
     * @param  {String}  type  操作类型
     */
    onCellBtn(row, type) {
      this.dialogData = copy(row)
      this.dialogType = type
      if (type === 'edit') {
        this.launchDialogStatus = true
      } else {
        if (type === 'detail') {
          // this.getWordcloud({
          //   thirdId: row.thirdId
          // })
        }
        this.dialogStatus = true
      }
    },
    /**
     * 获取词云图片
     * @param  {Object}  query  请求参数
     */
    getWordcloud(query) {
      this.dialogData._wcLoading = true
      return this.$request({
        url: '/getMarketWordcloud',
        query
      }).then(
        re => {
          this.dialogData._wcLoading = false
          if (re && re.img_url) {
            this.dialogData.wordcloudImg = this.$request.buildUrl(re.img_url)
          }
        },
        err => {
          this.dialogData._wcLoading = false
          console.error(err)
        }
      )
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      data = copy(data)
      this.searchData = Object.assign(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      location.href = `/api/business/foreign/medVideo/export?${qs.stringify(data)}&componentId=${this.$componentId}`
    },
    /**
     * 浮层取消
     */
    onCancel() {
      this.launchDialogStatus = false
      this.dialogStatus = false
      this.dialogData = {}
      this.dialogType = 'detail'
      this.video.url = ''
      this.video.playing = false
    },
    /**
     * 浮层确认操作
     */
    onConfirm() {
      switch (this.dialogType) {
          case 'detail':
            this.onCancel()
            break
      }
    },
    /**
     * 播放视频
     * @param  {String}  url  视频地址
     */
    playVideo(url) {
      if (url) {
        window.open(url)
        // this.video.url = url
        // this.video.playing = true
      }
    },
    // 隐藏视频
    hideVideo() {
      this.video.playing = false
      this.video.url = ''
    },
    /**
     * 编辑完成事件响应函数
     * @param  {Object}  data  新数据
     */
    onEditSuccess(data) {
      this.onSubmit()
    }
  }
}
</script>
<style lang="scss" scoped>
    @import './index';
</style>
