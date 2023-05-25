<template>
  <div class="surge-wrap">
    <div>
      <el-radio-group v-model="searchData.topListType" @change="handleSearch">
        <el-radio-button label="1">流量</el-radio-button>
        <el-radio-button label="2">点赞</el-radio-button>
      </el-radio-group>
    </div>
    <div class="flex flex-justify-between m-t-10">
      <div>
        榜单日期：
        <el-date-picker
          v-model="searchData.statDay"
          type="date"
          placeholder="选择日期"
          class="m-r-10"
          value-format="yyyy-MM-dd"
          @change="handleSearch"
        />
        <el-checkbox v-model="searchData.onlyAdvFlowFlag" :true-label="1" false-label="" @change="handleSearch">仅看广告视频</el-checkbox>
      </div>
      <div>
        <IconTip
          placement="bottom"
          width="220"
          trigger="hover"
          type="popover"
          icon-class="iconwenhao"
          label="数据说明"
        >
          <p v-if="searchData.topListType==1">海盗自营账号发布视频，在榜单统计日按照当日新增流量排行TOP100。</p>
          <p v-else>海盗自营账号发布视频，在榜单统计日按照当日新增点赞排行TOP100。</p>
          <p>其中广告视频为军功系统中被标记为含S/A/B/C类型的视频。</p>
          <p>榜单不含过期账号视频。</p>
        </IconTip>
      </div>
    </div>
    <div class="table-view m-t-24">
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="indexMethod"
          width="80"
        />
        <el-table-column
          label="视频信息"
          width="400"
          align="left"
        >
          <template slot-scope="{row}">
            <VideoInfo :info="row" />
          </template>
        </el-table-column>
        <el-table-column lang="账号信息" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" :options="{name: 'nickName', imgUrl: 'avatarUri'}" />
          </template>
        </el-table-column>
        <el-table-column
          v-if="searchData.topListType == 1"
          label="日新增流量"
        >
          <span slot-scope="{ row }">{{ row.flowPv | toThousandsW }}</span>
        </el-table-column>
        <el-table-column
          v-else
          label="日新增点赞量"
        >
          <span slot-scope="{ row }">{{ row.thumbUpPv | toThousandsW }}</span>
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="s">
            <IconTip
              v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
              icon-class="iconxiangqing"
              content="查看详情"
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
    <BackToTop />
    <VideoDetailDialog :show.sync="dialogShow" :show-tabs="['data']" :dialog-data="videoDialogData" />
  </div>
</template>
<script>
import BackToTop from '@/components/BackToTop'
import { IconTip, VideoInfo, AccountCard, VideoDetailDialog } from 'components'
import { $getSoaringList } from '@/api/pirate'
import dayjs from 'dayjs'
export default {
  components: { VideoInfo, BackToTop, VideoDetailDialog, IconTip, AccountCard },
  data() {
    return {
      searchData: {
        statDay: dayjs().add(-1, 'day').format('YYYY-MM-DD'),
        topListType: 1,
        onlyAdvFlowFlag: '',
        pageNum: 1
      },
      tableData: [],
      loading: false,
      total: 0,
      videoDialogData: {},
      dialogShow: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    indexMethod(index) {
      return (index + 1) + (this.searchData.pageNum - 1) * 20
    },
    getList() {
      this.loading = true
      $getSoaringList(this.searchData).then(res => {
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
        this.$message.error(err.message)
        this.loading = false
      })
    },
    showVideoDetail(rowData) {
      this.videoDialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },
    handleSearch() {
      this.searchData.pageNum = 1
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .surge-wrap {
    min-height: 100%;
    background: #fff;
    padding: 24px;
  }
  .table-view {
    padding: 0;
  }
</style>
