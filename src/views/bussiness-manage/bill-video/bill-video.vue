<template>
  <Wrap class="P-advertisingAdlib">
    <div class="header-btn m-b-20">
      <div class="adv-info-wrap">
        <span>公司名称：{{ advInfo.companyName }}</span>
        <span>品牌：{{ advInfo.brandName }}</span>
        <span>合作产品：{{ advInfo.quotientName }}</span>
        <span>客户联系人：{{ advInfo.customerName }}</span>
      </div>
    </div>
    <div class="P-advertisingAdlibCon">
      <div class="P-advertisingAdlibSearch">
        <Statistics :data="summaryItems" :loading="loading" />
        <el-form class="search-wrap" :inline="true">
          <el-form-item label="流量区间">
            <el-input
              v-model="searchData.flowStart"
              type="number"
              placeholder="流量最小值"
              min="0"
            />
            <span class="m-r-5 m-l-5">至</span>
            <el-input
              v-model="searchData.flowEnd"
              type="number"
              placeholder="流量最大值"
              min="0"
            />
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="searchData.times"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
            <el-button v-if="this.$permission('middleground')" type="primary" plain @click="onExport">导出</el-button>
            <el-button type="primary" plain @click="show = true">数据趋势图</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading">
        <div class="P-advertisingAdlibTable">
          <el-table
            ref="flow"
            v-scrollbar
            v-loading="loading"
            :data="tableData"
            header-row-class-name="P-advertisingAdlibTableHead"
            row-class-name="P-advertisingAdlibTableRow"
            @sort-change="doSort"
          >
            <el-table-column label="标题" width="333">
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

            <el-table-column prop="accountName" label="账号" />

            <el-table-column prop="flowCount" label="总流量" sortable="custom" />
            <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />

            <el-table-column prop="commentCount" label="评论量" sortable="custom" />
            <el-table-column prop="forwardedCount" label="转发量" sortable="custom" />

            <el-table-column prop="addTime" label="发布时间" width="170px" />

            <el-table-column prop="flowMoney" label="执行金额" />

            <el-table-column label="操作" width="140">
              <template slot-scope="s">
                <el-button size="small" type="primary" @click="handleShow(s.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total" class="P-advertisingAdlibTablePager">
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
    </div>
    <el-dialog
      title="数据趋势图"
      :visible.sync="show"
      width="50%"
      @close="show = false"
    >
      <div>
        <VChart
          v-if="chartsData.line"
          ref="chart"
          :data="chartsData.line"
          :config="lineConfig"
        />
      </div>
    </el-dialog>
    <VideoDialog
      :show.sync="dialogShow"
      :dialog-data="dialogData"
    />
  </Wrap>
</template>
<script>
import qs from 'qs'
import Statistics from '@/components/Statistics'
import VideoDialog from '@/components/VideoDetailDialog'
import mixin from './_mods/mixin'
import { $getVideoDataByQuotientId, $getQuotientChart } from '@/api/bussiness-manage'
import VChart from '@/components/VChart'
import { copy } from '@/components/common'

const ADV_MAP = {
  '1': '是',
  '0': '否'
}

export default {
  components: {
    Statistics,
    VideoDialog,
    VChart
  },
  mixins: [mixin],

  data() {
    return {
      dialogShow: false,
      show: false,
      searchData: {
        times: '',
        flowStart: '',
        flowEnd: '',
        quotientId: '',
        determined: ''
      },
      determined: 'addTime',
      formConf: {},
      allChartsData: {},
      summaryItems: [
        {
          key: 'sumAccount',
          text: '账号',
          val: 0
        },
        {
          key: 'total',
          text: '标题',
          val: 0
        },
        {
          key: 'sumFlow',
          text: '流量',
          val: 0
        },
        {
          key: 'sumDig',
          text: '点赞',
          val: 0
        },
        {
          key: 'sumCom',
          text: '评论',
          val: 0
        },
        {
          key: 'sumShare',
          text: '转发',
          val: 0
        },
        {
          key: 'sumFolwMoney',
          text: '执行金额',
          val: 0
        }
      ],
      lineConfig: {
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }]
      },
      chartsData: {
        line: null
      },
      advInfo: {
        companyName: '',
        brandName: '',
        quotientName: '',
        customerName: ''
      },
      accountData: [],
      dialogData: {},
      ADV_MAP
    }
  },
  computed: {
    imgSrc() {
      return ''
    }
  },
  created() {
    const { quotientId, companyName, brandName, quotientName, customerName } = this.$route.query
    this.advInfo = { companyName, brandName, quotientName, customerName }
    this.searchData.quotientId = quotientId
    this.getList()
    this.getVideoPic()
  },
  methods: {
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      if (data.time) {
        data.start = data.time[0]
        data.end = data.time[1]
        delete data.time
      }
      $getVideoDataByQuotientId(data).then((res) => {
        if (res.code === 1) {
          this.summaryItems = this.summaryItems.map((item) => {
            item.val = res.data[item.key]
            return item
          })
          this.tableData = res.data.videoDataByQuotientIdBOList
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      }).finally(() => { this.loading = false })
    },
    dialogClose() {
      this.dialogShow = false
    },
    dialogComfirm() {
      this.dialogShow = false
    },
    handleShow(rowData) {
      this.dialogData = Object.assign({}, rowData)
      this.dialogData.quotientId = '' // 展示视频数据
      this.dialogShow = true
    },
    getVideoPic() {
      const query = {
        quotientId: this.$route.query.quotientId || ''
      }
      $getQuotientChart(query).then(res => {
        if (res.code === 1) {
          this.chartsData.line = res.data
          this.chartsData.line.cates = this.chartsData.line.cates.map(item => item.typeName)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    onExport() {
      window.location.href = `/api/order/video/downloadVideoDataByQuotientId?${qs.stringify(this.searchData)}&componentId=${this.$componentId}`
    }
  }
}
</script>
<style lang="scss">
  @import "./bill-video";
</style>
