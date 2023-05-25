<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:prv="target">
          <departmentSelect ref="department" v-model="target.model.orgId" :inline="true" :has-permission="false" />
          <el-form-item>
            <el-select v-model="target.model.videoAdvantage" multiple placeholder="视频优势">
              <el-option
                v-for="item in videoAdvantageList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:normal="target">
          <el-form-item label="时间范围" prop="timerange">
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
        <template v-slot:btns="target">
          <el-button v-log type="primary" plain @click="handleSearchReset(target)">重置</el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column v-if="hasSelection" type="selection" />
        <el-table-column class-name="table-title" label="视频信息" width="400" align="left">
          <template slot-scope="{row}">
            <VideoInfo :info="row" :options="{ coverImg: 'videoCoverUrl', title: 'titleName' }" />
          </template>
        </el-table-column>

        <el-table-column prop="accountName" label="账号信息" align="left" width="200">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="fieldName" label="行业类别" />

        <el-table-column prop="flowCount" label="总流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />

        <!-- <el-table-column prop="commentCount" label="评论量" sortable="custom" />
          <el-table-column prop="forwardedCount" label="转发量" sortable="custom" /> -->
        <el-table-column prop="addTime" label="发布时间" width="170px" sortable="custom" />
        <el-table-column prop="flowMoney" label="执行金额" sortable="custom" />
        <el-table-column prop="brandName" label="品牌" />
        <el-table-column prop="quotientName" label="合作产品" />
        <el-table-column label="视频优势">
          <template slot-scope="{ row }">
            <el-tag v-for="item in formatViodeoText(row.videoAdvantage)" :key="item" style="margin-bottom: 6px;">{{ item }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="s">
            <IconTip
              v-log="{ flowId: s.row.flowId, titleName: s.row.titleName, operation_module: '查看' }"
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
            />
            <IconTip
              v-if="$permission('adlib_edit')"
              v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
              content="编辑"
              icon-class="iconbianji"
              class="m-r-10"
              @click="handleEdit(s.row)"
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
    </Wrap>
    <VideoDialog :show.sync="dialogShow" :dialog-data="dialogData" />
    <!-- 编辑广告库 -->
    <EditDialog v-if="editDialog.show" v-model="editDialog.show" :data="editDialog.data" @updateTable="getList" />
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import VideoDialog from '@/components/VideoDetailDialog'
import Search from '@/components/Search'
import { Statistics, VideoInfo, AccountCard, IconTip } from 'components'
import departmentSelect from '@/components/DepartmentSelect/index.vue'
import { $getLibraryCondition, $getAdlibList, $getByPlatId, $getNewIndustryTypeTags } from '@/api/bussiness-manage'
// import { $getLibraryCondition, $getAdlibList, $getByPlatId, $getIndustryTypeTags, $getIndustryTypeList } from '@/api/bussiness-manage'
import qs from 'qs'
import EditDialog from './_components/edit-dialog.vue'

import { copy } from '@/components/common'

const ADV_MAP = {
  '1': '是',
  '0': '否'
}

export default {
  components: {
    vSearch: Search,
    VideoDialog,
    departmentSelect,
    EditDialog,
    Statistics,
    VideoInfo,
    AccountCard,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    return {
      dialogShow: false,
      editDialog: {
        show: false,
        data: null
      },
      videoAdvantageList: [
        { label: '数据好', value: 1 },
        { label: '创意好', value: 2 },
        { label: '转化好', value: 3 }
      ],
      searchData: {
        accountId: '',
        title: '',
        dateStart: '',
        dateEnd: '',
        pageNum: 1,
        advId: 1,
        determined: ''
      },
      determined: '-addTime',
      formConf: {},
      summaryItems: [
        {
          key: 'sumFlowCount',
          text: '总流量',
          val: null
        },
        {
          key: 'sumTitle',
          text: '标题数',
          val: null
        },
        {
          key: 'avgFlowCount',
          text: '集均播放量',
          val: null
        },
        {
          key: 'sumFlowMoney',
          text: '总执行金额',
          val: null
        },
        {
          key: 'sumThumbUpCount',
          text: '总点赞量',
          val: null
        }
      ],
      accountData: [],
      searchLoading: false,
      hasCase: false,
      hasSelection: false,
      caseDialogStatus: false,
      dialogData: {},
      selected: [],
      total: 0,
      ADV_MAP
    }
  },
  computed: {
  },
  created() {
    this.buildFormConf()
    this.getLibraryCondition()
    // this.getIndustryTypeList()
    this.getList()
  },
  methods: {
    formatViodeoText(text) {
      if (!text) {
        return ''
      }
      const textName = []
      text.split(',').forEach(t => {
        if (t && this.videoAdvantageList[t - 1]) {
          textName.push(this.videoAdvantageList[t - 1].label)
        }
      })
      return textName
    },
    /**
     * 查询列表
     */
    async getList() {
      const data = copy(this.searchData)
      // console.log(data.fieldId, 'fieldId')
      // if (data.fieldId) {
      //   data.fieldId = data.fieldId[data.fieldId.length - 1]
      // }
      if (data.timerange) {
        data.dateStart = data.timerange[0] || ''
        data.dateEnd = data.timerange[1] || ''
        if (data.dateEnd) {
          data.dateEnd += ' 23:59:59'
        }
        delete data.timerange
      }
      this.loading = true
      const res = await $getAdlibList(data)
      if (res.code === 1) {
        this.summaryItems.forEach(item => {
          item.val = res.data[item.key]
        })
        // Object.keys(this.summary).forEach(key => {
        //   this.summary[key] = res.data[key]
        // })
        this.tableData = res.data.advertisementLibraryVOList
        this.total = res.data.total
      }
      this.loading = false
    },
    async getLibraryCondition() {
      try {
        const res = await $getLibraryCondition()
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.platInfo
          this.normalFormItemMap.accountId.data = res.data.accountInfo
          this.normalFormItemMap.flowMoneys.data = res.data.executePriceList
          this.normalFormItemMap.quotientName.data = res.data.quotientNames
          this.normalFormItemMap.brandName.data = res.data.brandList
        }
        const { code, data } = await $getNewIndustryTypeTags()
        if (+code === 1) {
          this.normalFormItemMap.fieldId.data = data || []
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }
    },
    handleShow(rowData) {
      this.dialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },
    handleEdit(rowData) {
      this.editDialog.show = true
      this.editDialog.data = rowData
    },

    /**
     * 构造搜索配置
     */
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
          type: 'input',
          key: 'titleName',
          conf: {
            placeholder: '请输入标题'
          }
        },
        {
          type: 'select',
          key: 'flowMoneys',
          data: [],
          optionLabelKey: 'executePriceKey',
          optionValKey: 'executePriceValue',
          conf: {
            placeholder: '执行金额'
          }
        },
        {
          type: 'select',
          key: 'brandName',
          data: [],
          optionLabelKey: 'newsContent',
          optionValKey: 'newsContent',
          conf: {
            placeholder: '品牌'
          }
        },
        {
          type: 'select',
          key: 'quotientName',
          data: [],
          optionLabelKey: 'producationName',
          optionValKey: 'producationName',
          conf: {
            placeholder: '合作产品'
          }
        },
        {
          type: 'cascader',
          key: 'fieldId',
          _key: 'industryTypeTags',
          data: [],
          conf: {
            placeholder: '行业类别',
            clearable: true
          },
          props: { checkStrictly: true, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' },
          optionValKey: 'tagId',
          optionLabelKey: 'tagName'
        }
        // {
        //   type: 'cascader',
        //   key: 'fieldId',
        //   _key: 'industryTypeTags',
        //   data: [],
        //   conf: {
        //     placeholder: '行业类别',
        //     clearable: true
        //   },
        //   props: { checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'newsContent', children: 'child' },
        //   optionValKey: 'id',
        //   optionLabelKey: 'newsContent'
        // }
      ]
      var formConf = {
        normal,
        hasExport: true
      }
      var normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      const params = copy(data)
      if (params && params.fieldId && params.fieldId.length && Array.isArray(params.fieldId)) {
        params.fieldId = params.fieldId[params.fieldId.length - 1]
      }
      this.searchData = Object.assign({}, this.searchData, params)
      this.searchData.videoAdvantage = this.searchData.videoAdvantage.sort().join(',')
      this.searchData.determined = ''
      this.searchData.pageNum = 1
      this.getList()
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
        // 平台
        $getByPlatId({ platId: val }).then(res => {
          if (res.code === 1) {
            this.normalFormItemMap.accountId.data = res.data
          }
        })
      }
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = copy(data)
       if (params && params.fieldId && params.fieldId.length && Array.isArray(params.fieldId)) {
        params.fieldId = params.fieldId[params.fieldId.length - 1]
      }
      data = Object.assign({}, this.searchData, params)
      data.videoAdvantage = data.videoAdvantage.sort().join(',')
      if (data.timerange) {
        data.dateStart = data.timerange[0] || ''
        data.dateEnd = data.timerange[1] || ''
        if (data.dateEnd) {
          data.dateEnd += ' 23:59:59'
        }
        delete data.timerange
      }
      window.location.href = `/api/business/foreign/library/export?${qs.stringify(data)}&componentId=${this.$componentId}`
    },
    /**
     * 重置
     */
    handleSearchReset(target) {
      target.reset()
      this.searchData.dateStart = ''
      this.searchData.dateEnd = ''
      target.model.videoAdvantage = []
      this.$refs.department.reset()
    }
    // getIndustryTypeList() {
    //   $getIndustryTypeList().then(res => {
    //     if (res.code === 1 && res.data) {
    //       this.normalFormItemMap.fieldId.data = res.data
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //   })
    // }
  }
}
</script>
