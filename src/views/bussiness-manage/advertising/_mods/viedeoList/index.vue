<template>
  <el-dialog
    width="60%"
    title="视频列表"
    append-to-body
    :visible="value"
    @close="handleCancel"
  >
    <div class="video-search">
      <el-row>
        <el-col :span="8">
          <el-input v-model="searchData.title" placeholder="请输入标题" style="width:200px" />
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="searchData.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-col>
        <el-col :span="6">
          <el-button :loading="loading" type="primary" @click="getList">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="videoTable"
      v-scrollbar
      :data="tableData"
    >
      <el-table-column
        width="55"
        label="操作"
      >
        <template slot-scope="scope">
          <el-radio v-model="selectFlowId" :label="scope.row.flowId" class="video-raido" />
        </template>
      </el-table-column>
      <el-table-column property="date" label="标题">
        <template slot-scope="scope">
          <el-link :type="scope.row.isDeleted === 1 ? 'info' : 'primary'" target="_blank" :href="scope.row.url">{{ scope.row.isDeleted === 1 ? '(已删除)' : '' }}{{ scope.row.titleName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column property="addTime" label="添加时间" align="center" />
    </el-table>
    <div class="dialog-pager m-t-24">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { $getQueryVideo } from '@/api/bussiness-manage'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    accountId: {
      type: [Number, String],
      required: true,
      default: ''
    },
    platId: {
      type: [Number, String],
      required: true,
      default: ''
    },
    flowId: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      tableData: [],
      selectFlowId: null,
      videoInfo: {},
      total: 0,
      searchData: {
        timeRange: null,
        title: '',
        pageNum: 1
      }
    }
  },
  watch: {
    selectFlowId(nVal, oVal) {
      if (nVal === null) {
        this.videoInfo = {}
      }
      if (nVal !== oVal) {
        this.videoInfo = this.tableData.find(item => (item.flowId === nVal))
      }
    }
  },
  created() {
    this.getList()
    this.selectFlowId = this.flowId
  },
  methods: {
    handleChangeTime() {},
    getList() {
      this.loading = true
      const { accountId, platId } = this
      const params = Object.assign({ accountId, platId }, this.searchData)
      if (params.timeRange) {
        params.startDate = params.timeRange[0] + ' 00:00:00'
        params.endDate = params.timeRange[1] + ' 23:59:59'
        delete params.timeRange
      }
      $getQueryVideo(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }

        this.loading = false
      }).catch(err => {
        if (err.__CANCEL) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },
    handleConfirm() {
      if (this.selectFlowId) {
        const { flowId, url, titleName, isDeleted, videoCoverUrl, addTime } = this.videoInfo
        this.$emit('confirm', { flowId, url, titleName, isDeleted, videoCoverUrl, addTime })
      }
      this.handleCancel()
    },
    handleCancel() {
      this.$emit('input', false)
    }
  }
}
</script>
