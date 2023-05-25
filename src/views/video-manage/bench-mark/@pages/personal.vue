<template>
  <div class="B-personVideo" data-burry_sub_page_type="flow_board">
    <Wrap class="search-view">
      <v-search
        v-if="formConf"
        ref="search"
        :config="formConf"
        is-burry
        @submit="onSubmit"
        @export="exportData"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <el-form-item>
            <el-radio-group v-model="nowType" @change="onTypeChange($event, target)">
              <el-radio-button
                v-for="item in types.board"
                :key="item.label"
                data-burry_btn_name="tab"
                :data-burry_title="item.text"
                :label="item.label"
              >{{ item.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              @change="handleTimeChange"
            />
          </el-form-item>
          <platformSelect v-model="target.model.platId" :inline="true" :query="paramsConfig" @platChange="getAccount" />
          <accountSelect :list="accountList" :form="target.model" :params="paramsConfig" />
        </template>
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <el-table
        ref="accounts"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="视频" width="400" align="left">
          <template slot-scope="{row}">
            <VideoInfo :info="row" :options="videoOptions" />
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号" width="220" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="addTime" width="102" />
        <!-- <el-table-column label="平台" prop="platName" /> -->
        <el-table-column label="流量" prop="flowCount" sortable="custom" />
        <el-table-column label="点赞" prop="thumbUpCount" sortable="custom" />
        <el-table-column label="评论" prop="commentCount" sortable="custom" />
        <el-table-column label="转发" prop="forwardedCount" sortable="custom" />
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
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import { date, copy } from '@/components/common'
import search from '@/components/Search'
import { $getBenchVideo, $condition, $getCondition } from '@/api/video-manage'
import platformSelect from '@/components/PlatformSelect'
import accountSelect from '@/components/AccountSelect'
import VideoInfo from '@/components/VideoInfo'
import AccountCard from '@/components/AccountCard'
import qs from 'qs'
// 一天的时间戳
const A_DAY = 864e5

export default {
  name: 'Billboard',
  components: {
    vSearch: search,
    platformSelect,
    accountSelect,
    VideoInfo,
    AccountCard
  },
  mixins: [tableMixin],
  data() {
    this.videoOptions = {
      // coverImg: 'videoCoverUrl',
      title: 'titleName'
    }
    return {
      loading: false,
      methodId: 2,
      determined: '-add_time',
      paramsConfig: { methodId: 1, accountType: 2 },
      searchData: {
        platId: '',
        f_id: '',
        d_id: '',
        beginDate: '',
        endDate: '',
        pageNum: 1,
        title: '',
        note: '',
        accountId: '',
        accountName: '',
        belongName: '',
        timerange: [],
        methodId: 1,
        determined: ''
      },
      normalFormItemMap: {},
      formConf: null,
      types: {
        board: [
          { text: '日榜', label: 1 },
          { text: '周榜', label: 7 },
          { text: '月榜', label: 30 }
        ],
        plats: [
          { text: '抖音', val: 25 },
          { text: '快手', val: 26 }
        ],
        notes: []
      },
      nowType: 1,
      pageBurryType: 'beach_marking',
      accountList: []
    }
  },
  created() {
    this.buildFormConf()
    this.setDay(this.types.board[0].label)
    this.getAccount()
    this.getCondition()
    this.getList()
  },
  methods: {
    async getCondition() {
      const res = await $getCondition({
        ...this.paramsConfig
      })
      if (res.code === 1) {
        this.normalFormItemMap.note.data = res.data.tagValues.map(t => {
          return {
            text: t,
            val: t
          }
        })
      }
    },
    async getAccount(platId = '') {
      this.$bus.$emit('platChange')
      $condition({
        ...this.paramsConfig,
        platId
      }).then(res => {
        if (res && res.code === 1) {
          this.accountList = res.data
        }
      }).catch(err => {})
    },
    /**
     * 导出数据
     * @param {Object} 导出参数
     */
    exportData(data) {
      data = Object.assign({}, this.searchData, data, this.paramsConfig)
      if (data.timerange) {
        data.beginDate = data.timerange[0] || ''
        data.endDate = data.timerange[1] || ''
        if (data.beginDate) {
          data.beginDate = `${data.beginDate} 00:00:00`
        }
        if (data.endDate) {
          data.endDate = `${data.endDate} 23:59:59`
        }
        delete data.timerange
      }
      window.location.href = `/api/video/monitor/bench/exportBenchmarkingVideoList?${qs.stringify(data)}&componentId=${this.$componentId}`
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      Object.assign(this.searchData, data)
      this.nowPage = 1
      this.getList()
    },
    getList() {
      const data = copy(this.searchData)
      if (data.timerange) {
        data.beginDate = data.timerange[0] || ''
        data.endDate = data.timerange[1] || ''
        if (data.beginDate) {
          data.beginDate = `${data.beginDate} 00:00:00`
        }
        if (data.endDate) {
          data.endDate = `${data.endDate} 23:59:59`
        }
        delete data.timerange
      }
      Object.assign(data, this.paramsConfig)
      $getBenchVideo(data).then(re => {
        if (re.code === 1) {
          this.tableData = re.data
          this.total = re.total
        } else {
          this.$message.error(re.message)
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
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'note',
          data: [],
          conf: {
            placeholder: '请选择账号标签'
          }
        },
        {
          type: 'input',
          key: 'title',
          conf: {
            placeholder: '请输入标题'
          }
        }
      ]
      var formConf = {
        normal,
        hasExport: true,
        firstSlot: true
      }
      var normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    onSearchChange() {},
    handleTimeChange() {
      this.nowType = -1
    },
    /**
     * 时间段类型切换
     * @param  {Number}  val  时间偏移值
     */
    onTypeChange(val) {
      if (val) {
        this.$bus.$emit('upLog', {
          operation_module: this.types.board.find(item => (item.label === val)).text
        })
        this.setDay(val)
      } else {
        this.searchData.timerange = ['', '']
      }
      this.searchData.pageNum = 1
      this.getList()
    },
    /**
     * 设置时间选择区间
     * @param  {Number}  day  偏移时间
     */
    setDay(day = 1) {
      var ts = A_DAY * day
      var start = ''
      var end = ''
      if (ts) {
        start = date('Y-m-d', new Date(Date.now() - ts))
        end = date('Y-m-d', new Date(Date.now() - A_DAY))
      }
      this.searchData.timerange = [start, end]
    }
  }
}
</script>
<style scoped lang="scss">
@import "../../../../assets/container.scss";
.M-benchmarkBillboard {
  &Con {
    @include con();
    margin: 0 0 24px;
    &:last-child {
      margin: 0;
    }
  }

  &Search {
    &Rang {
      display: inline-block;
      .el-input {
        width: 150px;
        display: inline-block;
      }
    }
  }

  &Table {
    margin: 24px 0;

    &Head {
      background: #f6f8fa;
      th {
        text-align: center;
        background: #f6f8fa;
        &:nth-child(1) {
          text-align: left;
        }
      }
    }

    &Row {
      td {
        text-align: center;
        &:nth-child(1) {
          text-align: left;
        }
      }
    }

    &Pager {
      margin: 20px 0 24px;
      text-align: center;
      .el-pagination {
        display: inline-block;
      }
    }
  }
}
</style>
