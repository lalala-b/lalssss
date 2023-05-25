<template>
  <div class="P-teamVideo">
    <Wrap class="search-view m-b-16">
      <v-search
        ref="search"
        :config="formConf"
        :inline="true"
        is-burry
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <departmentSelect v-model="target.model.orgId" :inline="true" />
          <platformSelect v-model="target.model.platId" :inline="true" :query="paramsConfig" @platChange="getAccountCondition" />
          <accountSelect :inline="true" :list="accountList" :form="target.model" :has-account="true" :params="paramsConfig" />
          <el-form-item>
            <el-input v-model="target.model.titleName" placeholder="请输入标题" />
          </el-form-item>
          <el-form-item label="流量区间">
            <div class="flex">
              <el-input
                v-model="target.model.flowStart"
                type="number"
                placeholder="流量最小值"
                min="0"
                @change="onSearchChange(target.model.flowStart, {'key': 'flowStart'}, 'adv')"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="target.model.flowEnd"
                type="number"
                placeholder="流量最大值"
                min="0"
                @change="onSearchChange(target.model.flowEnd, {'key': 'flowEnd'}, 'adv')"
              />
            </div>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="target.model.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="onSearchChange(target.model.timerange, {'key': 'timerange'}, 'adv')"
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap>
      <Statistics :loading="countLoading" class="m-b-16" :data="dataNum" dark :has-icon="true" />
      <div v-loading="loading" class="table-view">
        <el-table
          v-scrollbar
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <!-- <el-table-column type="selection" v-if="hasSelection"></el-table-column> -->
          <el-table-column class-name="table-title" label="视频" width="400" align="left">
            <template slot-scope="{row}">
              <VideoInfo :info="row" :options="videoOptions" />
              <!-- <el-link
                v-if="s.row.url"
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :disabled="s.row.url === ''"
                target="_blank"
                :underline="false"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
              <p v-else>{{ s.row.titleName }}</p> -->
            </template>
          </el-table-column>
          <!-- <el-table-column prop="addTime" label="发布时间" width="100">
          <template slot-scope="scope">{{ scope.row.addTime.replace(/\-/g, ".") }}</template>
        </el-table-column> -->
          <!-- <el-table-column prop="platName" label="平台" /> -->
          <el-table-column prop="accountName" label="账号" width="220" align="left">
            <template slot-scope="{row}">
              <AccountCard :info="row" :options="{accountUrl:'url'}" />
            </template>
          </el-table-column>
          <el-table-column prop="addedFlow" label="今日新增流量" sortable="custom" width="130" />
          <el-table-column prop="flowCount" label="总流量" sortable="custom" />
          <el-table-column prop="thumbUpCount" label="点赞数" sortable="custom" />
          <el-table-column prop="commentCount" label="评论数" sortable="custom" />
          <el-table-column prop="forwardedCount" label="转发数" sortable="custom" />
          <el-table-column label="操作" width="140">
            <template slot-scope="s">
              <IconTip
                v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
                content="查看详情"
                icon-class="iconxiangqing"
                @click="showVideoDetail(s.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="pagenation-view">
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
    <VideoDialog :show.sync="dialogShow" :show-tabs="['data']" :dialog-data="videoDialogData" />
  </div>
</template>
<script>
import Search from '@/components/Search'
import VideoDialog from '@/components/VideoDetailDialog'
import accountSelect from '@/components/AccountSelect'
import IconTip from '@/components/IconTip'
import tableMixin from '@/mixins/table'
import {
  copy
} from '@/components/common'
import { $getTeamVideoInfo, $getTeamVideoCount, $condition } from '@/api/video-manage'
import departmentSelect from '@/components/DepartmentSelect'
import platformSelect from '@/components/PlatformSelect'
import VideoInfo from '@/components/VideoInfo'
import AccountCard from '@/components/AccountCard'
import Statistics from '@/components/Statistics'
import dayjs from 'dayjs'
import qs from 'qs'

// 搜索参数 model
const DATA_MODEL = {
  methodId: 2,
  accountType: 1,
  pageNum: 1,
  size: 20,
  accountId: '',
  titleName: '',
  flowStart: '',
  flowEnd: '',
  dateStart: '',
  dateEnd: '',
  orgId: '',
  platId: '',
  determined: ''
}

export default {
  components: {
    vSearch: Search,
    VideoDialog,
    departmentSelect,
    platformSelect,
    accountSelect,
    VideoInfo,
    AccountCard,
    IconTip,
    Statistics
  },
  mixins: [tableMixin],
  data() {
    this.videoOptions = {
      coverImg: 'videoCoverUrl',
      title: 'titleName'
    }
    return {
      paramsConfig: {
        accountType: 1, methodId: 2
      },
      dataNum: [
        {
          text: '总流量',
          key: 'allFlow',
          val: null,
          icon: 'iconzongliuliang'
        },
        {
          text: '标题',
          key: 'total',
          val: null,
          icon: 'iconshipinshu'
        },
        {
          text: '集均播放量',
          key: 'avgFlow',
          val: null,
          icon: 'iconpingjunbofangliang'
        }
      ],
      videoDialogData: {},
      dialogShow: false,
      countLoading: false,
      formConf: {},
      searchData: {
        ...DATA_MODEL
      },
      accountList: []
    }
  },
  mounted() {
    this.buildFormConf()
    this.$nextTick(() => {
      const timeEnd = dayjs().format('YYYY-MM-DD')
      const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
      this.$set(this.$refs.search.form, 'timerange', [
        `${timeStart}`,
        `${timeEnd}`
      ])
      this.searchData.timerange = [`${timeStart}`, `${timeEnd}`]
      this.getList()
      this.getTeamVideoCount()
    })
  },
  methods: {
    getTeamVideoCount() {
      this.countLoading = true
      const data = copy(this.searchData)
      if (data.timerange) {
        data.dateStart = data.timerange[0]
        data.dateEnd = data.timerange[1] + ' 23:59:59' || ''
        delete data.timerange
      }
      $getTeamVideoCount(data).then(res => {
        if (res.code === 1) {
          this.dataNum.forEach(item => {
            item.val = res.data[item.key]
          })
        } else {
          this.$message.error(res.message)
        }
        this.countLoading = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.countLoading = false
      })
    },

    async getAccountCondition(platId = '') {
      this.$bus.$emit('platChange')
      const res = await $condition({
        ...this.paramsConfig,
        platId
      })
      if (+res.code === 1) {
        this.accountList = res.data || []
      }
    },
    showVideoDetail(rowData) {
      this.videoDialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      var normal = [
      ]
      var formConf = {
        normal,
        hasExport: this.$permission('team_video_export')
      }
      var advFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        advFormItemMap[item.key] = item
      })
      this.advFormItemMap = advFormItemMap
      this.formConf = formConf
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {},
    /**
     * 获取业务数据
     * @param  {Object}   data   请求参数
     * @return {Object}          promise 对象
     */
    getList() {
      const data = copy(this.searchData)
      if (data.timerange) {
        data.dateStart = data.timerange[0]
        data.dateEnd = data.timerange[1] + ' 23:59:59' || ''
        delete data.timerange
      }
      this.loading = true
      $getTeamVideoInfo(data).then(re => {
        if (re.code === 1) {
          re.data.list && re.data.list.forEach(item => {
            item._tag_loading = false
            item._audit_status_loading = false
          })
          this.tableData = re.data.list || []
          this.total = re.data.total
          this.loading = false
        } else {
          this.$message.error(re.message)
          this.loading = false
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
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      this.searchData.determined = ''
      this.searchData = Object.assign({}, this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
      this.getTeamVideoCount()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      data = Object.assign({}, this.searchData, data)
      if (data.timerange) {
        data.dateStart = data.timerange[0]
        data.dateEnd = data.timerange[1] + ' 23:59:59' || ''
        delete data.timerange
      }
      window.location.href = `/api/video/monitor/export?${qs.stringify(data)}&componentId=${this.$componentId}`
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
