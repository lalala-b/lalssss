<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-05 13:43:16
 * @LastEditTime: 2020-12-18 10:31:33
 * @LastEditors: Linjie
-->
<template>
  <Wrap>
    <TagSelect
      v-for="item in tagsData"
      :key="item.key"
      v-model="searchData[item.key]"
      :data="item.list"
      :val-key="item.valKey"
      :label-key="item.labelName"
      class="m-b-24"
      @change="handleSearch"
    >
      <span slot="left" class="tag-label">{{ item.text }}：</span>
      <template v-if="item.custom" slot="right">
        <el-tag
          v-if="!item._status"
          effect="dark"
          size="small"
          @click="item._status = true;"
        >自定义</el-tag>
        <div v-else class="flex">
          <el-input
            v-model="item._start"
            class="w-150"
            type="number"
            min="0"
            size="small"
            placeholder="开始值"
            autocomplete="off"
            @change="handleCustomChange(item)"
            @keydown.enter="handleCustomChange(item)"
          />w
          <span>-</span>
          <el-input
            v-model="item._end"
            class="w-150"
            type="number"
            min="0"
            size="small"
            placeholder="结束值"
            autocomplete="off"
            @change="handleCustomChange(item)"
            @keydown.enter="handleCustomChange(item)"
          />w
        </div>
      </template>
    </TagSelect>
    <el-form class="search-view" inline>
      <el-form-item>
        <!-- <el-select
          v-model="searchData.accountId"
          placeholder="请输入账号"
          filterable
          clearable
          remote
          :filter-method="onSearchAccounts"
        >
          <el-option
            v-for="item in accountData"
            :key="item.accountId"
            :label="item.accountName"
            :value="item.accountId"
          />
        </el-select> -->
        <el-input
          v-model="searchData.accountName"
          placeholder="请输入账号"
          filterable
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchData.title" placeholder="请输入标题" autocomplete="off" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" data-burry_btn_name="search" @click="getList">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-view">
      <div class="M-accountsTable">
        <el-table
          ref="accounts"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column class-name="table-title" label="视频" align="left" width="500">
            <template slot-scope="s">
              <VideoInfo :info="s.row" :options="{ coverImg: 'videoCoverUrl', title:'titleName' }" />
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="账号名称" align="left" width="200">
            <template slot-scope="{row}">
              <AccountCard :info="row" />
            </template>
          </el-table-column>
          <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />
          <el-table-column prop="commentCount" label="评论量" sortable="custom" />
          <el-table-column prop="forwardedCount" label="转发量" sortable="custom" />
          <el-table-column prop="addTime" width="100" label="发布时间" />
          <el-table-column prop="updateTime" width="100" label="更新时间" />
          <el-table-column v-if="$permission('dy_manage_videos_add_adv_case')" label="操作" width="140">
            <template slot-scope="s">
              <IconTip v-if="$permission('dy_manage_videos_add_adv_case')" content="添加为广告案例" icon-class="iconad_fill" @click="addAdvCaseShow(s.row)" />
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
      </div>
    </div>
    <add-adv-case
      :dialog-data="dialogData"
      :dialog-status="dialogStatus"
      :adv-topics="otherNeedTagsData.advTopics"
      @closeDialog="dialogStatus = false"
    />
  </Wrap>
</template>
<script>
import addAdvCase from '../_pages/addAdvCase'
import { date, copy } from '@/components/common'
import { TagSelect, IconTip, VideoInfo, AccountCard } from 'components'
import tableMixin from '@/mixins/table'
import { $getTikTokAllVideoList, $getAllCountByPlatId } from '@/api/dy-manage'
import { $getAllMarketTags } from '@/api/marketing'
export default {
  components: {
    addAdvCase,
    TagSelect,
    IconTip,
    VideoInfo,
    AccountCard
  },
  mixins: [tableMixin],
  data() {
    const A_DAY = 864e5
    const today = Date.now()
    const todayStr = date('Y-m-d 23:59:59', new Date(today))
    const endDateStr = 'Y-m-d 00:00:00'
    return {
      tagsData: [
        {
          text: '内容主题',
          key: 'topics',
          valKey: 'tagId',
          labelName: 'tagName',
          selecteIndex: 0,
          all: true,
          list: []
        },
        {
          text: '点赞数',
          key: 'diggs',
          valKey: 'typeCode',
          labelName: 'typeName',
          selecteIndex: 0,
          list: [],
          custom: true,
          all: true,
          _status: false
        },
        {
          text: '发布时间',
          key: 'date',
          valKey: 'typeCode',
          labelName: 'typeName',
          selecteIndex: 0,
          list: [{
            typeName: '近7日',
            typeCode: [
              todayStr,
              date(endDateStr, new Date(today - A_DAY * 7))
            ]
          }, {
            typeName: '近30日',
            typeCode: [
              todayStr,
              date(endDateStr, new Date(today - A_DAY * 30))
            ]
          }, {
            typeName: '近90日',
            typeCode: [
              todayStr,
              date(endDateStr, new Date(today - A_DAY * 90))
            ]
          }]
        }
      ],
      otherNeedTagsData: {
        advTopics: []
      },
      searchData: {
        platId: 25,
        accountId: '', // 账号ID
        title: '', // 标题
        digg: '', // 点赞数
        startTime: date(endDateStr, new Date(today - A_DAY * 7)),
        endTime: todayStr,
        accountName: '', // 账号名
        determined: '', // 排序规则
        pageNum: 1
      },
      accountData: [],
      dialogData: { // 广告案例弹窗数据
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
    topicsTags() {
      return copy(this.tagsData.find((item) => item.key === 'topics')).list.filter(item => item.tagId !== '')
    }
  },
  created() {
    this.getAllTags()
    this.getList()
    this.getAllCount()
  },
  methods: {
    getList() {
      this.loading = true
      const params = copy(this.searchData)
      if (params.diggs) {
        params.digg = params.diggs
        delete params.diggs
      }
      if (params.date) {
        params.startTime = params.date[1]
        params.endTime = params.date[0]
        delete params.date
      }
      if (params.topics) {
        params.tagId = params.topics
        delete params.topics
      }
      $getTikTokAllVideoList(params).then((res) => {
        if (res.code === 1) {
          this.total = res.total
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    // 获取所有账号数据
    getAllCount() {
      $getAllCountByPlatId({ platId: 25 }).then((res) => {
        if (res.code === 1) {
          this.accountData = res.data.splice(0, 100)
          this.accountDataCatch = res.data
        }
      })
    },
    // 自定义账号搜索
    onSearchAccounts(accountName) {
      this.accountData = this.accountDataCatch.filter((item) => {
        return item.accountName.indexOf(accountName) >= 0
      }).splice(0, 100)
    },
    handleTagClick(tagData) {
      if (tagData) {
        if (Array.isArray(tagData.name)) {
          tagData.name.forEach((item, index) => {
            this.searchData[item] = tagData.val[index]
          })
        } else {
          this.searchData[tagData.name] = tagData.val
        }
        this.getList()
      }
    },
    // 添加广告案例弹窗显示、数据初始化
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
    onImport() {},
    handleSearch() {
      this.tableData = []
      this.loading = true
      this.searchData.pageNum = 1
      this.total = 0
      this.$bus.$emit('upLog', { operation_module: '搜索', ...this.searchData })
      this.getList()
    },
    getAllTags() {
        $getAllMarketTags().then((res) => {
        if (res.code === 1) {
          this.tagsData.forEach((item) => {
            if (item.list && item.list.length === 0) {
              item.list = res.data[item.key] || []
            }
            if (item.all) {
              const all = {
                [item.valKey]: '',
                [item.labelName]: '全部'
              }
              item.list.unshift(all)
            }
          })
          if (this.otherNeedTagsData) {
            for (const key in this.otherNeedTagsData) {
              this.otherNeedTagsData[key] = res.data[key]
            }
          }
        }
      })
    },
    handleCustomChange(item) {
      if (item._start && item._end) {
        if (item._end < item._start) {
          this.$message.error('结束值应大于开始值')
          return
        }
        this.searchData[item.key] = `${item._start * 10000}-${item._end * 10000}`
        this.searchData.pageNum = 1
        this.getList()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tag-label {
  width: 70px;
  text-align-last: justify;
}
// @import '../accounts/accounts.scss';

// .P-accounts {
//     font-size: 14px;
// }
</style>
