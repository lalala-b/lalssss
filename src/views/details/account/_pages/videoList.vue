<template>
  <div class="video-wrap">
    <Sum :time-list="timeList" :def-index="defIndex" :summer-list="summerList" :show-tip="false" @search="handleTimeRangeChange">
      <!-- <template slot="tipContent">
        新增粉丝：时间段内账号粉丝增量<br>
        新增标题：时间段内账号发布视频数量<br>
        新增流量：账号所有发布视频在时间段内的新增流量汇总<br>
        新增点赞：账号所有发布视频在时间段内的新增点赞汇总<br>
        新增评论：账号所有发布视频在时间段内的新增评论汇总<br>
        新增转发：账号所有发布视频在时间段内的新增转发汇总<br>
      </template> -->
    </Sum>
    <Wrap class="m-t-16">
      <div class="video-list-search flex flex-justify-between flex-align-center">
        <h3 class="flex flex-align-center"><i class="iconfont iconshipinjiankong" type="primary" />
          视频列表
          <el-radio-group
            v-if="+platId === 26 || +platId === 25"
            v-model="searchData.videoSource"
            size="small"
            class="m-l-10"
            @change="getList(1)"
          >
            <el-radio-button label="0">个人作品</el-radio-button>
            <el-radio-button label="1">{{ +platId === 25 ? "星图作品" : "聚星作品" }}</el-radio-button>
          </el-radio-group>
        </h3>
        <div class="flex flex-align-center">
          <el-checkbox
            v-model="searchData.isDeleted"
            class="flex flex-align-center m-r-24"
            true-label="1"
            false-label="0"
            @change="getList(1)"
          >屏蔽已删除视频</el-checkbox>
          <el-checkbox-group
            v-model="checkList"
            class="flex m-r-24 m-l-24"
            @change="handleCheckChange"
          >
            <el-checkbox
              class="m-r-24"
              label="relatioinComponent"
            >关联组件</el-checkbox>
            <!-- <el-checkbox label="relatioinApplets">关联小程序 <svg-icon icon-class="link" /></el-checkbox> -->
            <el-checkbox
              label="relatioinVideoServiceDownload"
            >网服下载</el-checkbox>
          </el-checkbox-group>
          <el-input v-model="title" placeholder="请输入视频标题">
            <el-button slot="append" type="primary" @click="handleSeach">搜索</el-button>
          </el-input>
        </div>
      </div>
      <el-table
        v-loading="loading"
        v-scrollbar
        class="m-t-24"
        header-row-class-name="table-header"
        row-class-name="table-row"
        tooltip-effect="dark"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column class-name="table-title" prop="titleName" label="视频" align="left" width="480">
          <template slot-scope="{row}">
            <VideoInfo :info="row" :options="videoOptions">
              <template slot="rec">
                <a
                  v-if="row.recTitle"
                  :href="row.recLink"
                  target="_blank"
                  class="rec-title"
                >
                  <svg-icon icon-class="ele" />
                  {{ row.recTitle }}
                </a>
                <a
                  v-if="row.videoServiceTitle && row.videoServiceType === 1001"
                  :href="row.videoServiceUrl"
                  target="_blank"
                  class="rec-title"
                >
                  <svg-icon icon-class="menu" />
                  {{ row.videoServiceTitle }}
                </a>
              </template>
            </VideoInfo>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="addTime" label="发布时间" sortable="custom" /> -->
        <el-table-column v-if="isInWard" prop="flowCount" label="流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="点赞" sortable="custom" />
        <el-table-column prop="commentCount" label="评论" sortable="custom" />
        <el-table-column prop="forwardedCount" label="转发" sortable="custom" />
        <el-table-column label="操作">
          <template slot-scope="s">
            <IconTip content="查看详情" icon-class="iconxiangqing" @click="handleShow(s.row)" />
            <!-- <el-link type="primary" :underline="false" @click="addAdvCaseShow(s.row)">添加为广告案例</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pagenation-view m-t-24"
        layout="prev, pager, next, jumper"
        background
        :page-size="20"
        :current-page.sync="searchData.pageNum"
        :total="total"
        @current-change="getList"
      />
    </Wrap>
    <!-- <add-adv-case
      v-model="dialogStatus"
      :dialog-data="dialogData"
    /> -->
  </div>
</template>
<script>
import { copy } from '@/utils'
import { $getVideoList, $getVideoTotalData } from '@/api/details'
import tableMixin from '@/mixins/table'
import { VideoInfo, IconTip } from 'components'

// import addAdvCase from '../_com/addAdvCase'
import Sum from '../_com/Sum'
export default {
  components: {
    VideoInfo,
    Sum,
    IconTip
    // addAdvCase
  },
  mixins: [tableMixin],
  props: {
    accountType: {
      type: [String, Number],
      default: ''
    }
  },
  inject: ['$info'],
  data() {
    return {
      platId: null,
      defIndex: 2,
      timeList: [
        {
          label: '1',
          text: '昨日',
          value: 0,
          start: -1
        },
        {
          label: '2',
          text: '近7日',
          value: -7,
          start: 0
        },
        {
          label: '3',
          text: '近30日',
          value: -30,
          start: 0
        }
      ],
      summerList: [
        {
          text: '视频量',
          key: 'videoNum',
          val: '--'
        },
        {
          text: '集均播放量',
          key: 'avgPlay',
          val: '--'
        },
        {
          text: '集均点赞量',
          key: 'avgLike',
          val: '--'
        },
        {
          text: '集均评论量',
          key: 'avgComment',
          val: '--'
        },
        {
          text: '集均转发量',
          key: 'avgForwarded',
          val: '--'
        }
      ],
      title: '',
      searchData: {
        timerange: null,
        title: '',
        pageNum: 1,
        isDeleted: '0',
        videoSource: '0'
      },
      total: 0,
      tableData: [],
      checkList: [],
      videoOptions: {
        coverImg: 'videoCoverUrl',
        duration: 'duration',
        title: 'titleName'
      }
      // dialogStatus: false,
      // dialogData: {}
    }
  },
  computed: {
    isInWard() {
      const accountType = [2, 30]
      return !accountType.includes(Number(this.accountType))
    }
  },
  created() {
    this.accountId = this.$route.params.accountId
    this.platId = this.$route.params.platId
    if (!this.isInWard) {
      this.summerList = this.summerList.filter(item => item.key !== 'avgPlay')
    }
    if (this.$info.accountInfo.selfOperateAccountFlag || this.$info.accountInfo.intermediaryAccountFlag || this.$info.accountInfo.signContractAccountFlag || this.$info.accountInfo.deliveryAccountFlag) {
       this.timeList.unshift(
        {
          label: '0',
          text: '今日',
          value: 0,
          start: 0
        }
      )
    }
    if (this.$info.accountInfo.selfOperateAccountFlag) {
      this.timeList.unshift(
        {
          label: '-1',
          text: '全部'
        }
      )
     }

    this.getList()
  },
  methods: {
    handleTimeRangeChange(timerange) {
      const params = {}
      if (timerange) {
        params.dateStart = timerange[0]
        params.dateEnd = timerange[1] + ' 23:59:59'
      }
      this.searchData.timerange = timerange
      this.getTotalData(params)
      this.getList(1)
    },
    // 搜索
    handleSeach() {
      this.searchData.title = this.title
      this.searchData.pageNum = 1
      this.getList()
    },
    // 组件选择
    handleCheckChange() {
      this.getList(1)
    },
    handleShow(row) {
      this.$router.push({
        path: `/details/video/${row.flowId}/${this.$route.params.accountId}`,
        query: {
          _blank: true
        }
      })
    },
    // // 广告案例组件显示
    // addAdvCaseShow(item) {
    //   this.dialogData = {
    //     flowId: item.flowId,
    //     titleName: item.titleName || '',
    //     brand: item.brand || '',
    //     url: item.url || '',
    //     topics: item.topics || ''
    //   }
    //   this.dialogStatus = true
    // },
    // 获取视频列表的统计数据
    getTotalData(parmas) {
      console.log(this.accountId)
      $getVideoTotalData({
        ...parmas,
        accountId: this.accountId,
        platId: this.platId
      }).then(res => {
        this.summerList.forEach(item => {
          item.val = res.data[item.key] || 0
        })
      })
    },
    // 视频列表
    getList(pageNum) {
      this.loading = true
      pageNum && (this.searchData.pageNum = pageNum)
      const params = copy(this.searchData)
      if (params.timerange) {
        params.dateStart = params.timerange[0]
        params.dateEnd = params.timerange[1] + ' 23:59:59'
        delete params.timerange
      }
      this.checkList.forEach(item => { params[item] = 1 })
      $getVideoList({
        ...params,
        platId: this.platId,
        accountId: this.accountId
      }).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
          this.total = res.total
        }
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  // @include themify($themes) {
    .video-wrap {
      .video-list {
        &-search {
          .search-title {
            width: 300px;
            span {
              flex-shrink: 0;
            }
            // ::v-deep .el-input-group__append {
            //   background: themed('search_bg');
            //   border-color: themed('search_bg');
            //   color: themed('search_font_color');
            // }
          }
        }
      }
    }
    .rec-title {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #8C8C8C;
      margin-right: 2px;
    }
      // ::v-deep .el-input-group__append {
        // overflow: hidden;
        // padding: 0;
      // }
      // ::v-deep .el-checkbox__label {
      //   color: themed('font_color');
      // }
    //   ::v-deep .el-table {
    //     background-color: transparent;
    //     &::before {
    //       display: none;
    //     }
    //     &__body {
    //       .table-row {
    //         color: themed('font_color');
    //         &:hover > td {
    //           background: themed('th_hover_bg');
    //         }
    //         &:nth-child(2n) {
    //           background: themed('th_bg');
    //         }
    //         &:nth-child(2n-1) {
    //           background: themed('th_odd_bg');
    //         }

    //       }
    //     }
    //     .table-header {
    //       th {
    //         background: themed('th_bg');
    //         color: themed('font_coor');
    //       }
    //     }
    //     // &__row {
    //     //   &:nth-child(2n) {
    //     //     background: #2f4666;
    //     //   }
    //     //   &:nth-child(2n-1) {
    //     //     background: #182a43;
    //     //   }
    //     // }
    //     td, .is-leaf {
    //       border-bottom: 1px solid themed('th_border_color');
    //     }
    //     .title-name {
    //       width: 100%;
    //       // span {
    //       //   overflow: hidden;
    //       //   text-overflow: ellipsis;
    //       //   white-space: nowrap;
    //       //   width: 100%;
    //       // }
    //     }
    //   }
    // }
  // }
</style>
