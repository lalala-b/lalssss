<template>
  <div>
    <!-- 小红书蒲公英数据 -->
    <RecentComPerformance :account-detail="accountNewDetail" :account-data-loading="accountNewDataLoading" />

    <!-- 新增数据 -->
    <Wrap class="m-t-16 title-item">
      <div class="flex flex-justify-between flex-align-center">
        <Title title="新增数据" icon="iconshuju" />
        <div class="flex flex-align-center p-r-24">
          <el-radio-group
            v-model="quickDate"
            @change="getAccountDataNum"
          >
            <el-radio-button label>全部</el-radio-button>
            <el-radio-button label="1">昨日</el-radio-button>
            <el-radio-button label="7">近7日</el-radio-button>
            <el-radio-button label="30">近30日</el-radio-button>
          </el-radio-group>
          <el-date-picker
            v-model="topDateArr"
            class="m-l-16"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="getAccountDataNum"
          />
          <IconTip
            placement="top-start"
            trigger="hover"
            type="el-popover"
            icon-class="iconwenhao"
            class="m-l-16"
            label="数据说明"
          >
            <div>
              <p>新增粉丝：时间段内账号粉丝增量</p>
              <p>新增标题：时间段内账号发布视频数量</p>
              <p>新增流量：账号所有发布视频在时间段内的新增流量汇总</p>
              <p>新增点赞：账号所有发布视频在时间段内的新增点赞汇总</p>
              <p>新增评论：账号所有发布视频在时间段内的新增评论汇总</p>
              <p>新增转发：账号所有发布视频在时间段内的新增转发汇总</p>
            </div>
          </IconTip>
        </div>
      </div>
      <flex-row />
      <Statistics :data="dataNum" />
    </Wrap>

    <!-- 最近15条视频数据表现 -->
    <Wrap class="charts-container">
      <div class="chart-item block">
        <Title title="最近15条视频数据表现" icon="iconvideo_fill" class="title-item" />
        <!-- <div style="height: 300px;">
          <Bar v-if="chartsData.videoColumn" :props-option="chartsData.videoColumn" :config="spChartConf" />
        </div> -->
        <VChart
          name="video"
          type="bar"
          :config="spChartConf"
          :data="chartsData.videoColumn"
          :formater="formaterVideoConfig"
          :loading="videoBarLoading"
          @click="handleVideoEchatClick"
        />
      </div>
    </Wrap>

    <!-- 粉丝趋势 -->
    <Wrap class="charts-container">
      <div class="chart-item">
        <Title title="粉丝趋势" icon="iconfensi_fill" class="title-item" />
        <VChart type="line" :loading="fansLineLoading" :config="lineConfig" :data="chartsData.fansLine" />
        <!-- <linechart v-if="chartsData.fansLine" :config="lineConfig" :items="chartsData.fansLine" /> -->
      </div>
      <div v-if="chartsData.videoPlayLine" class="chart-item">
        <Title title="播放趋势" icon="iconfensi_fill" class="title-item" />
        <VChart
          ref="videoChart"
          type="line"
          :loading="videoLineLoading"
          :config="videoLineConfig"
          :data="chartsData.videoPlayLine"
        />
      </div>
      <div class="chart-item">
        <div class="flex flex-justify-between flex-align-center">
          <Title title="视频数据动态" icon="iconfensi_fill" class="title-item" />
          <el-radio-group
            v-if="chartsData.videoLine"
            v-model="nowTypes"
            class="m-r-24"
            size="small"
            @change="processVideoChart"
          >
            <template v-for="item in typeList">
              <el-radio-button
                :key="item.label"
                v-log="{ operation_module: '视频数据动态' + item.label}"
                data-burry_btn_name="tab"
                :data-burry_title="item.val"
                :label="item.val"
              >{{ item.label }}</el-radio-button>
            </template>
          </el-radio-group>
        </div>
        <VChart
          type="line"
          :loading="videoLineLoading"
          :config="videoLineConfig"
          :data="chartsData.videoLine"
        />
      </div>
    </Wrap>

    <!-- 账号作品 -->
    <Wrap class="m-t-16">
      <div class="flex flex-justify-between flex-align-center m-b-16 ">
        <Title title="账号作品" icon="iconvideo_fill" class="p-0" />
        <div>
          <el-input v-model="searchForm.title" placeholder="请输入标题" class="m-r-24">
            <el-button slot="append" v-log @click="onSubmit(listType)">查询</el-button>
          </el-input>
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onSubmit(listType)"
          />
        </div>
      </div>
      <div class="table-view">
        <div v-if="source" class="m-b-24">
          <el-button v-log :type="listType === 0 ? 'primary' : ''" @click="onSubmit(0)">全部视频列表</el-button>
          <el-button v-log :type="listType === 1 ? 'primary' : ''" @click="onSubmit(1)">商单广告视频列表</el-button>
        </div>
        <el-table
          ref="accounts"
          v-scrollbar
          v-loading="loading"
          header-row-class-name="table-header"
          :data="tableData"
          @sort-change="doSort"
        >
          <el-table-column class-name="table-title" prop="titleName" label="标题" align="left" width="400">
            <template slot-scope="s">
              <VideoInfo :info="s.row" :options="{coverImg: 'videoCoverUrl', title: 'titleName'}" />
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="发布时间" sortable="custom" width="170px" />
          <el-table-column v-if="listType === 0 && !(accountType == 5 && accountDetail.platName == '抖音')" prop="flowCount" label="总流量" sortable="custom" />
          <el-table-column v-if="listType === 0 && accountType == 5 && accountDetail.platName == '抖音'" prop="thumbUpCount" label="点赞量" sortable="custom" />
          <el-table-column v-if="listType === 1" prop="flowCount" label="流量" sortable="custom" />
          <el-table-column v-if="listType === 1" prop="thumbUpCount" label="点赞" sortable="custom" />
          <el-table-column v-if="listType === 1" prop="commentCount" label="评论" />
          <el-table-column v-if="listType === 1" prop="forwardedCount" label="转发" />
          <el-table-column v-if="listType === 1" prop="executeMoney" label="执行金额" />
          <el-table-column v-if="listType === 1" prop="brandName" label="品牌" />
          <el-table-column v-if="listType === 1" prop="quotientName" label="合作产品" />
          <el-table-column label="操作" width="200">
            <template slot-scope="s">
              <IconTip
                v-log="{ operation_module: '查看详情'}"
                content="查看详情"
                icon-class="iconxiangqing"
                @click="handleShow(s.row)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          class="pagenation-view"
          layout="prev, pager, next, jumper"
          :page-size="20"
          :current-page.sync="searchForm.pageNum"
          :total="total"
        />

      </div>
    </Wrap>

    <VideoDialog :show.sync="dialogShow" :show-tabs="['data']" :dialog-data="videoDialogData" :account-type="accountType" />

  </div>
</template>

<script>
import VideoDialog from '@/components/VideoDetailDialog'
import RecentComPerformance from './recentComPerformance.vue'
import { Statistics, IconTip, VChart, VideoInfo, Title } from 'components'
import { $accountVideoList, $accountVideoChart, $accountFansChart, $getAccountDataNum } from '@/api/account-manage'
import { $getWorkerOrderAdvVideo } from '@/api/bill-adv-manage'

export default {
  components: {
    VideoDialog,
    Statistics,
    IconTip,
    VChart,
    VideoInfo,
    Title,
    RecentComPerformance
    // Bar,
    // PullDown
  },
  props: {
    accountDetail: {
      type: Object,
      default: () => ({})
    },
    accountNewDetail: {
      type: Object,
      default: () => ({})
    },
    accountDataLoading: {
      type: Boolean,
      default: false
    },
    accountNewDataLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.videoEhartMap = {
      dig: ['allDig', 'addDig'], // 点赞
      com: ['allCom', 'addCom'], // 评论
      share: ['allShare', 'addShare'] // 转发
    }
    return {
      source: '',
      listType: 0,
      accountType: 1,
      dialogShow: false,
      videoDialogData: {},
      videoLineLoading: false,
      videoBarLoading: false,
      loading: false,
      tableData: [],
      topDateArr: [],
      dateArr: [],
      total: 0,
      searchForm: {
        pageNum: 1,
        title: '',
        startDate: '',
        end: '',
        determined: ''
      },
      quickDate: '',
      dataNum: [
        {
          text: '新增粉丝',
          key: 'addFans',
          val: ''
        },
        {
          text: '新增标题',
          key: 'addTitle',
          val: ''
        },
        {
          text: '新增流量',
          key: 'addFlow',
          val: ''
        },
        {
          text: '新增点赞',
          key: 'addDig',
          val: ''
        },
        {
          text: '新增评论',
          key: 'addCom',
          val: ''
        },
        {
          text: '新增转发',
          key: 'addShare',
          val: ''
        }
      ],
      chartsData: {
        videoColumn: null,
        fansLine: null,
        videoLine: null,
        videoPlayLine: null,
        o_videoColumn: null
      },
      lineConfig: {
        legend: {
          // selectedMode: 'single'
        },
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }],
        seriesConfig: {
          type: 'line',
          data: null
        }
      },
      spChartConf: {
        legend: {
          show: false
        },
        grid: {
          left: 80,
          right: 50,
          top: 10,
          bottom: 20
        },
        xAxis: { boundaryGap: true }
      },
      nowTypes: 'dig',
      typeList: [{
        label: '点赞量',
        val: 'dig'
      }, {
        label: '评论量',
        val: 'com'
      }, {
        label: '转发量',
        val: 'share'
      }]
    }
  },
  computed: {
    accountId() {
      return this.$route.params.accountId || ''
    },

    videoLineConfig() {
      return Object.assign({}, this.lineConfig, {
        // legend: {
        //   show: false
        // }
      })
    }
  },
  watch: {
    dateArr(newVal, oldVal) {
      if (newVal && newVal.length) {
        this.searchForm.startDate = newVal[0]
        this.searchForm.endDate = newVal[1]
      } else {
        this.searchForm.startDate = ''
        this.searchForm.endDate = ''
      }
    },

    'searchForm.pageNum'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.searchForm.pageNum = newVal
        this.getListData()
      }
    },

    quickDate(newVal, oldVal) {
      if (newVal !== oldVal) {
        switch (newVal) {
            case '': {
              this.topDateArr = []
              break
            }
            default: {
              const end = new Date()
              const start = new Date()
              start.setTime(
                start.getTime() - 3600 * 1000 * 24 * parseInt(newVal)
              )
              end.setTime(
                end.getTime() - 3600 * 1000 * 24
              )
              this.topDateArr = [start, end]
              break
            }
        }
      }
    }
  },

  created() {
    this.getAccountDataNum()
    this.accountFansChart()
    this.accountVideoLine()
    this.getListData()
    this.accountType = this.$route.query.accountType || 1
    this.source = this.$route.query.source || ''
  },

  methods: {
    handleShow(rowData) {
      this.videoDialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },

    async getListData(listType) {
      if (listType === null || listType === undefined) {
        listType = this.listType
      }
      if (!this.getChart) {
        this.videoBarLoading = true
      }
      this.loading = true
      const query = Object.assign(
        { accountId: this.accountId, size: 15 },
        this.searchForm
      )
      if (query.endDate && !query.endDate.includes('23:59:59')) {
        query.endDate += ' 23:59:59'
      }
      if (listType === 0) {
        // 全部视频列表
        try {
          const res = await $accountVideoList(query)
          if (res.code === 1) {
            this.tableData = res.data
            this.total = res.total
            if (!this.getChart) {
              const mapItem = {
                text: 'addTime',
                val: 'flowCount',
                name: 'videoColumn'
              }
              if (+this.accountType === 5 && this.accountDetail.platName === '抖音') {
                mapItem.val = 'thumbUpCount'
              }
              const dat = {
                terms: [],
                values: [],
                cates: ['最近15条视频数据表现']
              }

              const valDat = []
              res.data.forEach(item => {
                dat.terms.unshift(
                  item[mapItem.text]
                    .split(' ')[0]
                    .split('-')
                    .slice(1)
                    .join('.')
                )
                valDat.unshift(item[mapItem.val])
              })
              dat.values = valDat
              this.chartsData['videoColumn'] = dat
              this.chartsData['o_videoColumn'] = res.data
              this.getChart = true
              this.videoBarLoading = false
            }
            this.loading = false
            this.listType = listType
          }
        } catch (err) {
          if (err.__CANCEL__) {
            return
          }
          if (err.message) {
            this.$message.error(err.message)
          }
          this.loading = false
          this.videoBarLoading = false
        }
      } else {
        try {
          const res = await $getWorkerOrderAdvVideo(query)
          if (res.code === 1) {
            this.tableData = res.data
            this.total = res.total
            this.listType = listType
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
      }
    },
    /**
     * 排序
     * @param  {String}  prop   列名
     * @param  {String}  order  排序方式
     */
    doSort({ prop, order }) {
      let determined
      switch (order) {
          case 'ascending':
            determined = `${prop}`
            break

          case 'descending':
            determined = `-${prop}`
            break

          case null:
            determined = ''
            break
      }
      this.searchForm.determined = determined
      this.getListData()
    },

    async accountFansChart() {
      this.fansLineLoading = true
      const res = await $accountFansChart({
        accountId: this.accountId
      })
      if (res.code === 1) {
          const fansLine = {
            cates: res.data.cates.map(item => item.typeName),
            terms: res.data.terms,
            values: res.data.values
          }
          // if (this.accountType != 1) {
          //   ['allFlow', 'addFlow']
          // }
          this.chartsData.fansLine = fansLine
      } else {
        this.$message.error(res.message)
      }
      this.fansLineLoading = false
    },

    async accountVideoLine() {
      this.videoLineLoading = true
      const res = await $accountVideoChart({
        accountId: this.accountId
      })
      if (res.code === 1) {
        if (!res.data.cates) {
          this.videoLineLoading = false
          return
        }
        const _videoLine = {}
        res.data.cates.forEach((item, index) => {
          _videoLine[item.typeCode] = {
            cates: item.typeName,
            terms: res.data.terms,
            values: res.data.values[index]
          }
        })
        this._videoLine = _videoLine
        this.chartsData.videoLine = {
          terms: res.data.terms
        }

        const obj = ['allFlow', 'addFlow'].reduce((t, n) => {
          t.values.push(this._videoLine[n].values)
          t.cates.push(this._videoLine[n].cates)
          return t
        }, {
          values: [],
          cates: []
        })
        this.chartsData.videoPlayLine = {
          terms: res.data.terms,
          ...obj
        }
        this.processVideoChart()
      } else {
        this.$message.error(res.message)
      }
      this.videoLineLoading = false
    },

    processVideoChart() {
      const obj = this.videoEhartMap[this.nowTypes].reduce((t, n) => {
        t.values.push(this._videoLine[n].values)
        t.cates.push(this._videoLine[n].cates)
        return t
      }, {
        values: [],
        cates: []
      })
      this.chartsData.videoLine = {
        ...this.chartsData.videoLine,
        ...obj
      }
    },

    // 获取新增数据
    async getAccountDataNum() {
      const query = {
        accountId: this.accountId,
        startDate: this.topDateArr.length
          ? this.timestampToTime(this.topDateArr[0])
          : '',
        endDate: this.topDateArr.length
          ? `${this.timestampToTime(this.topDateArr[1])} 23:59:59`
          : ''
      }
      const res = await $getAccountDataNum(query)
      // console.log(res, '--res.data[item.key]')
      if (res.code === 1) {
        this.dataNum.forEach(item => {
          item.val = res.data[item.key]
        })
      }
    },

    // 时间戳转时间
    timestampToTime(timestamp) {
      var date = new Date(timestamp)
      var Y = date.getFullYear() + '-'
      var M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },

    onSubmit(listType) {
      console.log(listType)
      // if (listType !== undefined && listType !== null) {
      //   this.listType = listType
      // }
      this.searchForm.pageNum = 1
      this.getListData(listType)
    },

    formaterVideoConfig(config) {
      config.tooltip.formatter = (info) => {
        if (!info || !info.length) {
          return
        }

        const data = this.chartsData.o_videoColumn

        if (!data) {
          return
        }
        const item = data[data.length - info[0].dataIndex - 1]

        if (!item) {
          return
        }
        return [
          `标题: ${item.titleName}`,
          `总流量: ${item.flowCount}`,
          `发布时间: ${item.addTime}`
        ].join('<br />')
      }
      return config
    },

    // 柱状图点击事件
    handleVideoEchatClick(chart) {
      if (chart.componentType === 'series') {
        const data = this.chartsData['o_videoColumn']
        if (!data) {
          return
        }
        const item = data[data.length - chart.dataIndex - 1]
        if (item && item.url) {
          const win = window.open(item.url)
          if (!win) {
            this.$message.error('请允许在本页打开新窗口')
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 292px;
}
.page-container {
  .data-num-view {
    padding: 16px 0;
    height: auto;
    margin-top: 24px;
  }
  .head-info {
    ::v-deep {
      .account-card__image {
        height: 48px;
        width: 48px;
        img {
          height: 48px;
          width: 48px;
        }
      }
    }
    &__item {
      padding: 0 24px;
      border-left: 1px solid #F0F0F0;
    }
    .account-id {
      color: #BFBFBF;
      line-height: 16px;
    }
  }
  .charts-container {
    display: flex;
    margin-top: 16px;
    background-color: #fff;
    flex-wrap: wrap;
    .chart-item {
      width: 50%;
      position: relative;
      padding-bottom: 24px;
      &.block {
        width: 100%;
      }
      .chart-name {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        margin-bottom: 24px;
      }
    }
  }
}
.table-title {
  text-align: left;
}
::v-deep {
  .title-item {
    padding: 0 0 24px 0;
    .tooltip-label {
      font-size: 16px;
    }
  }
}
</style>
