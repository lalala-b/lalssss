<template>
  <Wrap>
    <div>
      <TagSelect
        :data="releaseTime"
        label="发布时间"
        label-key="tagName"
        val-key="listId"
        class="m-b-24"
        @change="handleChangeTime"
      />
      <TagSelect
        :data="tags"
        label="内容主题"
        model="array"
        class="m-b-24"
        @change="handleChangeTags"
      />
      <div class="flex search-view">
        <el-input v-model="searchData.title" class="m-r-24" placeholder="请输入标题" />
        <el-input v-model="searchData.nickName" class="m-r-24" placeholder="请输入账号" />
        <el-button
          type="primary"
          @click="search"
        >查询</el-button>
      </div>
      <div class="flex flex-justify-between times-tip">
        <p>数据更新时间：{{ modifyTime }}</p>
        <IconTip class="hover-tip" type="popover" label="数据说明" icon-class="iconwenhao">
          <p>【数据来源】：星图</p>
          <p>【更新频率】：周，具体以平台时间为准</p>
          <p>【榜单规则】:根据达人星图作品的内容表现指数进行排序，该指数主要参考星图作品传播/受众/创意/性价比/转化/舆论的六个数据维度表现，评估该作品的内容优质性，以此帮助星图用户及时/高效的发掘优质商业内容创意，发现优质创意达人。</p>
        </IconTip>
      </div>
    </div>
    <div v-loading="loading" class="table-view">
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
        <el-table-column align="left" label="视频信息" width="500">
          <template slot-scope="{ row }">
            <VideoInfo :info="row" />
          </template>
        </el-table-column>
        <el-table-column label="账号信息" width="200" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" :options="accountOption" />
          </template>
        </el-table-column>
        <el-table-column label="流量" prop="play" sortable="custom" />
        <el-table-column label="点赞" prop="digg" sortable="custom" />
        <el-table-column label="评论" prop="comment" sortable="custom" />
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
import tableMixin from '@/mixins/table'
import { TagSelect, IconTip } from 'components'
import { $getXingtuHotFlow, $getXtHotFlowTag } from '@/api/dy-manage'
import VideoInfo from '@/components/VideoInfo'
import AccountCard from '@/components/AccountCard'
export default {
  components: {
    TagSelect,
    VideoInfo,
    IconTip,
    AccountCard
  },
  mixins: [tableMixin],
  data() {
    return {
      accountOption: {
        imgUrl: 'avatarUri',
        // accountUrl: 'url',
        name: 'nickName'
      },
      releaseTime: [
        { 'listId': '6809501918948229133', 'tagName': '近7日' },
        { 'listId': '6809501925868830728', 'tagName': '近30日' },
        { 'listId': '6809501933783482381', 'tagName': '近90天' },
        { 'listId': '6809501941530361869', 'tagName': '近180日' }
      ],
      releaseTimeIndex: 0,
      tags: [],
      tagIndex: 0,
      searchData: {
        listId: '6809501918948229133',
        tag: '',
        title: '',
        nickName: '',
        determined: '',
        pageNum: 1,
        size: 10
      },
      modifyTime: ''
    }
  },
  created() {
    this.getTags()
    this.getList()
  },
  methods: {
    // 更改发布时间选项
    handleChangeTime(listId) {
        this.searchData.listId = listId
        this.searchData.tag = ''
        this.searchData.pageNum = 1
        this.tagIndex = 0
        this.getTags()
        this.getList()
    },
    // 更改内容主题选项
    handleChangeTags(tag, index) {
      // if (index !== this.tagIndex) {
        // this.tagIndex = index
        this.searchData.tag = tag
        this.searchData.pageNum = 1
        this.getList()
      // }
    },
    // 获取内容主题
    getTags() {
      const listId = this.searchData.listId
      $getXtHotFlowTag({ listId }).then((res) => {
        if (res.code === 1) {
          this.tags = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        this.$message.error(err)
      })
    },
    // 点击查询
    search() {
      this.searchData.pageNum = 1
      this.getList()
    },
    getList() {
      this.loading = true
      $getXingtuHotFlow(this.searchData).then((res) => {
        if (res.code === 1) {
          this.modifyTime = res.data.modifyTime
          this.tableData = res.data.list
          this.total = res.data.total
        } else {
          this.$message.error(res.msg)
        }
        this.loading = false
      }).catch((err) => {
        this.$message.error(err)
        this.loading = false
      })
    },
    // 序号
    getIndex(index) {
      return index + (this.searchData.pageNum - 1) * this.searchData.size + 1
    }
  }
}
</script>
<style lang="scss" scoped>
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
  .el-tabs__content {
    overflow: visible;
  }
  .times-tip {
    font-size: 14px;
    margin: 24px 0 8px 0;
    ::v-deep {
      .tooltip-label {
        font-size: 14px;
      }
    }
  }
</style>
