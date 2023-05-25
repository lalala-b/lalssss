<template>
  <div>
    <Wrap>
      <h2 v-html="accountName" />
      <div class="search-view m-t-10">
        <el-form :model="searchData" :inline="true">
          <el-form-item>
            <el-input v-model="searchData.title" placeholder="标题" />
          </el-form-item>

          <el-form-item class="search-rang">
            <el-input v-model="searchData.start" type="number" min="0" placeholder="点赞量大于多少" />
            <span class="m-l-5 m-r-5">至</span>
            <el-input v-model="searchData.end" type="number" min="0" placeholder="点赞量小于多少" />
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="getList">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- <summary-items :summary-items="summaryItems" /> -->
      <Statistics :data="summaryItems" />
    </Wrap>
    <Wrap class="m-t-16">
      <div class="table-view">
        <el-table
          ref="accounts"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          class="m-t-24"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column align="left" label="视频" width="400">
            <template slot-scope="s">
              <VideoInfo :info="s.row" :options="{coverImg: 'videoCoverUrl', title: 'titleName'}" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="thumbUpCount" label="点赞量" sortable="custom" />
          <el-table-column align="center" prop="commentCount" label="评论量" sortable="custom" />
          <el-table-column align="center" prop="forwardedCount" label="转发量" sortable="custom" />
          <el-table-column align="center" prop="addTime" label="发布时间" />
          <el-table-column align="center" prop="updateTime" label="更新时间" />
          <el-table-column v-if="hasAddToCase" align="center" label="操作" fixed="right">
            <template slot-scope="s">
              <IconTip content="添加为广告案例" icon-class="iconad_fill" @click="addAdvCaseShow(s.row)" />
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
      <add-adv-case
        :dialog-data="dialogData"
        :dialog-status="dialogStatus"
        :adv-topics="advTopics"
        @closeDialog="dialogStatus = false"
      />
    </Wrap>
  </div>
</template>
<script>
import { copy } from '@/components/common'
import tableMixin from '@/mixins/table'
import { $getTikTokVideoList } from '@/api/dy-manage'
import { $getAllMarketTags } from '@/api/marketing'
import { Statistics, VideoInfo, IconTip } from 'components'
import addAdvCase from '../_pages/addAdvCase'
export default {
  components: {
    Statistics,
    addAdvCase,
    VideoInfo,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    return {
      accountName: '',
      searchData: {
        accountId: '', // 账号ID
        title: '', // 标题
        platId: '', // 平台ID
        start: '', // 点赞开始数
        end: '', // 点赞结束数
        determined: '', // 排序规则
        pageNum: 1, // 页码
        timerange: '' // 时间
      },
      tableData: [],
      loading: false,
      total: 0,
      summaryItems: [
        {
          key: 'total',
          text: '标题数',
          val: 0
        },
        {
          key: 'allFans',
          text: '粉丝数',
          val: 0
        },
        {
          key: 'allDig',
          text: '总点赞量',
          val: 0
        },
        {
          key: 'avgDig',
          text: '集均点赞',
          val: 0
        }
      ],
      advTopics: [],
      dialogData: {
        flowId: '',
        titleName: '',
        brand: '',
        url: '',
        topics: ''
      },
      dialogStatus: false
    }
  },
  computed: {
    hasAddToCase() {
      return this.$permission('middleground') && this.from === 'dy'
    }
  },
  created() {
    const accountId = this.$route.params.accountId
    const { accountName, name, type, accountType, from } = this.$route.query
    this.searchData.accountId = accountId
    this.searchData.accountType = accountType || 1
    this.searchData.type = type || 2
    this.accountName = accountName || name
    this.from = from
    this.getList()
    this.getTags()
  },
  methods: {
    isDelete(type) {
      if (type === 1) {
        return '(已删除)'
      }
    },
    getList() {
      this.loading = true
      const params = copy(this.searchData)
      if (params.timerange) {
        params.startTime = params.timerange[0]
        params.endTime = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      $getTikTokVideoList(params).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data.dataList
          this.summaryItems.forEach((item) => {
            item.val = res.data[item.key]
          })
          this.total = res.data.total
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        this.loading = false
      })
    },
    getTags() {
      $getAllMarketTags().then((res) => {
        if (res.code === 1) {
          this.advTopics = res.data.advTopics
        }
      })
    },
    addAdvCaseShow(item) {
      this.dialogData = {
        flowId: item.flowId,
        titleName: item.titleName || '',
        brand: item.brand || '',
        url: item.url || '',
        topics: item.topics || ''
      }
      this.dialogStatus = true
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .search-rang {
    display: inline-block;
    .el-input {
        width: 150px;
        display: inline-block;
    }
  }
  .con .table-header {
    color: #303133;
    font-size: 14px;
    font-weight: 500;
  }
  .table-view {
    padding: 0;
  }
</style>
