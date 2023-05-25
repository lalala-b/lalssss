<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-02 16:52:00
 * @LastEditTime: 2020-11-24 17:44:12
 * @LastEditors: Linjie
-->
<template>
  <Wrap class="P-pirate" data-burry_page_type="pirate">
    <div class="search-view">
      <el-form ref="form" :model="searchData" :inline="true">
        <el-form-item v-if="$permission('pirate_flow_org')">
          <el-select
            v-model="searchData.typeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in orgData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-radio-group v-model="nowTypes.list" @change="onTypeChange">
            <el-radio-button
              v-for="item in types.list"
              :key="item.label"
              data-burry_btn_name="tab"
              :data-burry_title="item.text"
              :label="item.label"
            >{{ item.text }}</el-radio-button>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="searchData.timerange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="clearNowTypesList"
          />
        </el-form-item>

        <el-form-item>
          <el-select v-model="searchData.platId" placeholder="全部平台" clearable value-key="val">
            <el-option v-for="item in platformData" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button v-log type="primary" data-burry_btn_name="search" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div v-loading="loading" class="table-view">
      <el-table
        ref="flow"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column class-name="table-title" label="视频信息" width="400" align="left">
          <template slot-scope="{ row }">
            <VideoInfo :info="row" :options="{title: 'titleName', coverImg: 'videoCoverUrl'}" />
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号" align="left" width="200">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="flowCount" label="流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />
        <el-table-column prop="commentCount" label="评论量" sortable="custom" />
        <el-table-column prop="forwardedCount" label="分享量" sortable="custom" />
        <el-table-column prop="addTime" width="102" label="发布时间" sortable="custom" />
        <el-table-column label="操作">
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
    <VideoDetailDialog :show.sync="dialogShow" :show-tabs="['data']" :dialog-data="videoDialogData" />
  </Wrap>
</template>
<script>
import { VideoDetailDialog, VideoInfo, AccountCard, IconTip } from 'components'
import { date, copy } from '@/components/common'
import { $getHotList, $getCondition } from '@/api/pirate'
import tableMixin from '@/mixins/table'
const A_DAY = 864e5

export default {
  components: {
    VideoDetailDialog,
    VideoInfo,
    AccountCard,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    return {
      videoDialogData: {},
      dialogShow: false,
      searchData: {
        determined: '',
        typeId: '',
        platId: ''
      },
      platformData: [],
      orgData: [],
      types: {
        list: [
          { text: '榜单', label: 0 },
          { text: '日榜', label: 1 },
          { text: '周榜', label: 7 },
          { text: '月榜', label: 30 }
        ]
      },
      nowTypes: {
        list: 1
      }
    }
  },
  created() {
    this.onTypeChange(1)
    this.getCondition()
  },
  methods: {
    async getCondition() {
      const res = await $getCondition()
      if (res.code === 1) {
        this.platformData = res.data.platList.map(item => {
          return {
            value: item.platId,
            label: item.platName
          }
        })
        this.orgData = res.data.orgList.map(item => {
          return {
            value: item.orgId,
            label: item.orgName
          }
        })
      }
    },
    showVideoDetail(rowData) {
      this.videoDialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },
    /**
     * 榜单类型切换响应函数
     * @param  {Object} val  榜单类型
     */
    onTypeChange(val) {
      this.$bus.$emit('upLog', {
        operation_module: this.types.list.find(item => (item.label === val)).text
      })
      var ts = A_DAY * val
      var start = ''
      var end = ''
      if (ts) {
        start = date('Y-m-d', new Date(Date.now() - ts))
        end = date('Y-m-d', new Date())
      }
      if (this.searchData.timerange === undefined) {
        this.$set(this.searchData, 'timerange', [start, end])
      } else {
        this.searchData.timerange = [start, end]
      }
      this.getList()
    },
    /**
     * 获取列表数据
     * @param  {Number}  pageNum  页码
     * @return {Object}            Promise 对象
     */
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      if (data.timerange) {
        data.dateStart = data.timerange[0]
        data.dateEnd = data.timerange[1]
        delete data.timerange
      }
      return $getHotList(data).then(re => {
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
    // 时间改变后，要清空tag选择的高亮状态
    clearNowTypesList() {
      this.nowTypes.list = ''
    }
  }
}
</script>
