<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-02 20:25:48
 * @LastEditTime: 2020-12-14 17:12:31
 * @LastEditors: Linjie
-->

<template>
  <Wrap>
    <v-search
      ref="search"
      :config="formConf"
      @submit="onSubmit"
      @change="onSearchChange"
      @export="onExport"
    >
      <template v-slot:normal="target">
        <!-- <div class="slot-form"> -->
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="target.model.dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <!-- </div> -->
      </template>
    </v-search>
    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      header-row-class-name="table-header"
      @sort-change="doSort"
    >
      <el-table-column align="left" prop="titleName" label="视频" width="344">
        <template slot-scope="{row}">
          <VideoInfo :info="row" :options="videoOption" />
        </template>
      </el-table-column>
      <el-table-column align="left" prop="accountName" label="账号名称" width="200">
        <template slot-scope="{row}">
          <AccountCard :info="row" />
        </template>
      </el-table-column>
      <el-table-column prop="fansNum" label="粉丝量" sortable="custom" />
      <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />
      <el-table-column prop="commentCount" label="评论量" sortable="custom" />
      <el-table-column prop="forwardedCount" label="转发量" sortable="custom" />
      <el-table-column prop="addTime" label="发布时间" sortable="custom" width="105" />
      <el-table-column prop="updateTime" label="更新时间" sortable="custom" width="105" />
    </el-table>
    <div class="pagenation-view m-t-24">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="searchData.size"
        :hide-on-single-page="true"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
  </Wrap>
</template>
<script>
import Search from '@/components/Search'
import VideoInfo from '@/components/VideoInfo'
import AccountCard from '@/components/AccountCard'
// import IconTip from '@/components/IconTip'
import table from '@/mixins/table'
import { packApi } from '@/http'
import { copy, objectMerge } from '@/utils'
import { $getContendVideoList, $getAccountList } from '@/api/contend'
export default {
  components: {
    VSearch: Search,
    VideoInfo,
    AccountCard
    // IconTip
  },
  mixins: [table],
  props: {
    fansRange: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formConf: {},
      searchData: {
        size: 20,
        pageNum: 1
      },
      videoOption: {
        title: 'titleName',
        coverImg: 'videoCoverUrl'
      }
    }
  },
  watch: {
    fansRange(val) {
      this.normalFormItemMap.fansRange.data = val
    }
  },
  created() {
    this.$bus.$on('centendChange', (competeName) => {
      this.searchData.competeName = competeName
      this.searchData.pageNum = 1
      this.searchData.accountName = ''
      this.getList()
      this.getAccountList(competeName)
    })
    this.buildFormConf()
  },
  methods: {
    buildFormConf() {
      var normal = [
        {
          type: 'input',
          key: 'titleName',
          data: [],
          conf: {
            placeholder: '请输入标题'
          }
        },
        {
          type: 'select',
          key: 'accountName',
          data: [],
          conf: {
            placeholder: '请输入账号名'
          },
          optionValKey: 'accountName',
          optionLabelKey: 'accountName'
        },
        {
          type: 'select',
          key: 'fansRange',
          data: [],
          conf: {
            placeholder: '粉丝量'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        }
      ]
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: false
      }
    },
    getList() {
      this.loading = true
      const parmas = copy(this.searchData)
      if (parmas.dateArr) {
        parmas.startTime = parmas.dateArr[0]
        parmas.endTime = parmas.dateArr[1]
        delete parmas.dateArr
      }
      packApi($getContendVideoList, parmas).then(res => {
        this.tableData = res.data
        this.total = res.total
      }).finally(err => {
        this.loading = false
      })
    },
    getAccountList(competeName) {
      $getAccountList({ type: 1, competeName }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountName.data = res.data || []
        }
      })
    },
    onSubmit(data) {
      data = copy(data)
      this.searchData = objectMerge(this.searchData, data)

      this.searchData.pageNum = 1
      this.getList()
    },
    onSearchChange() {},
    onExport() {}
  }
}
</script>
<style lang="scss" scoped>
  .pagenation-view {
    text-align: center;
  }
</style>
