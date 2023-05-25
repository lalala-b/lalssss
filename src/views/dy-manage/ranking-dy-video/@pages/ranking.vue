<template>
  <Wrap class="p-t-16">
    <TagSelect :data="playTime" val-key="durationRange" label-key="durationRange" label="播放时长:" @change="changeRang" />
    <div class="search-view flex m-t-24 m-b-24">
      <el-input v-model="searchData.title" class="m-r-24" placeholder="请输入标题" clearable />
      <el-input v-model="searchData.nickName" class="m-r-24" placeholder="请输入账号" clearable />
      <el-button
        v-log="{ title:searchData.title, nickName: searchData.nickName }"
        type="primary"
        @click="search"
      >查询</el-button>
    </div>
    <p class="update-times">数据更新时间：{{ modifyTime }}</p>
    <div v-loading="loading">
      <el-table
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        class="sticky-head"
        @sort-change="doSort"
      >
        <el-table-column
          label="序号"
          type="index"
          :index="getIndex"
          width="50"
        />
        <el-table-column label="视频信息" width="500" align="left">
          <template slot-scope="{row}">
            <VideoInfo :info="row" />
          </template>
        </el-table-column>
        <el-table-column label="账号信息" width="200" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="accountOption" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="标题" width="300">
          <template slot-scope="s">
            <el-link
              type="primary"
              :href="s.row.url"
              target="_blank"
              :underline="false"
            >{{ s.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="缩略图">
          <template slot-scope="s">
            <img :src="s.row.coverImg" class="cover-img">
          </template>
        </el-table-column>
        <el-table-column label="账号" prop="" width="200">
          <template slot-scope="s">
            <div class="account-item">
              <img :src="s.row.avatarUri">
              <span>{{ s.row.nickName }}</span>
            </div>
          </template>
        </el-table-column> -->
        <el-table-column label="播放时长" prop="duration" />
        <el-table-column label="流量" prop="play" sortable="custom" />
        <el-table-column label="点赞" prop="digg" sortable="custom" />
        <el-table-column label="评论" prop="comment" sortable="custom" />
        <el-table-column label="转发" prop="share" sortable="custom" />
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="10"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </div>
  </Wrap>
</template>
<script>
import { TagSelect, VideoInfo, AccountCard } from 'components'
import tableMixin from '@/mixins/table'

import { $getDyHotFlow } from '@/api/dy-manage'
export default {
  components: {
    VideoInfo,
    AccountCard,
    TagSelect
  },
  mixins: [tableMixin],
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      searchData: {
        listId: '',
        durationRange: '',
        title: '',
        nickName: '',
        determined: '',
        pageNum: 1,
        size: 10
      },
      playTime: [
        { 'durationRange': '全部' },
        { 'durationRange': '0~15s' },
        { 'durationRange': '15~30s' },
        { 'durationRange': '30~60s' },
        { 'durationRange': '60s+' }
      ],
      accountOption: {
        imgUrl: 'avatarUri',
        accountUrl: 'url',
        name: 'nickName'
      },
      modifyTime: '' // 数据更新时间
    }
  },
  created() {
    this.searchData.listId = this.id
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true
      $getDyHotFlow(this.searchData).then((res) => {
        if (res.code === 1) {
          this.modifyTime = res.data.modifyTime
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    changeRang(rang) {
      this.searchData.durationRange = rang === '60s+' ? '60s~' : rang
      this.searchData.pageNum = 1
      this.getList()
    },
    getIndex(index) {
      return index + (this.searchData.pageNum - 1) * this.searchData.size + 1
    },
    search() {
      this.searchData.pageNum = 1
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .p-t-6 {
    padding-top: 6px;
  }
  .update-times {
    font-size: 14px;
    margin-bottom: 8px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
  }
  .sticky-head {
    overflow: visible;
    ::v-deep {
      .el-table__header-wrapper {
        overflow: visible;
        position: sticky;
        top: -24px;
        z-index: 10;
        table {
          position: sticky;
          top: 0;
          thead {
            position: relative;
            th {
              position: sticky;
              top: 0;
              z-index: 10;
            }
          }
        }
      }
    }
  }
</style>
