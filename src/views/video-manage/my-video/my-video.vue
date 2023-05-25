<template>
  <div class="P-myVideo">
    <Wrap class="m-b-16 search-view">
      <v-search
        ref="search"
        :inline="true"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="流量区间">
            <div class="flex">
              <el-input v-model="target.model.flowStart" type="number" placeholder="流量最小值" min="0" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.flowEnd" type="number" placeholder="流量最大值" min="0" />
            </div>
          </el-form-item>
          <el-form-item label="时间范围">
            <el-date-picker
              v-model="target.model.dateArr"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap>
      <Statistics class="m-b-16" :data="dataNum" dark :has-icon="true" :loading="countLoading" />
      <div v-loading="loading" class="table-view">
        <el-table
          v-scrollbar
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column class-name="table-title" label="视频" width="400" align="left">
            <template slot-scope="{row}">
              <VideoInfo :info="row" :options="videoOptions" />
            </template>
          </el-table-column>
          <el-table-column prop="accountName" label="账号" width="220" align="left">
            <template slot-scope="{row}">
              <AccountCard :info="row" />
            </template>
          </el-table-column>
          <el-table-column prop="addTime" label="发布时间" sortable="custom" width="102" />
          <el-table-column prop="addedFlow" label="今日新增流量" />
          <el-table-column prop="flowCount" label="总流量" sortable="custom" />
          <el-table-column prop="thumbUpCount" label="点赞数" sortable="custom" />
          <el-table-column prop="commentCount" label="评论数" sortable="custom" />
          <el-table-column prop="forwardedCount" label="转发数" sortable="custom" />
          <el-table-column label="操作">
            <template slot-scope="s">
              <IconTip
                v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
                content="查看详情"
                icon-class="iconxiangqing"
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
    </Wrap>
    <VideoDialog :show.sync="dialogShow" :show-tabs="['data']" :dialog-data="videoDialogData" />
  </div>
</template>
<script>
import Search from '@/components/Search'
import Statistics from '@/components/Statistics'
import VideoInfo from '@/components/VideoInfo'
import AccountCard from '@/components/AccountCard'
import IconTip from '@/components/IconTip'
import dayjs from 'dayjs'
import VideoDialog from '@/components/VideoDetailDialog'
import { copy } from '@/components/common'
import { $getPlatCondition, $condition, $getTeamVideoCount } from '@/api/video-manage'
import { $getV1VideoInfo } from '@/api/video-manage'
import qs from 'qs'
import tableMixin from '@/mixins/table'

export default {
  components: {
    vSearch: Search,
    VideoDialog,
    Statistics,
    VideoInfo,
    AccountCard,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    this.videoOptions = {
      coverImg: 'videoCoverUrl',
      title: 'titleName'
    }
    return {
      countLoading: false,
      dataNum: [
        {
          text: '总流量',
          key: 'allFlow',
          val: '',
          icon: 'iconzongliuliang'
        },
        {
          text: '标题',
          key: 'total',
          val: '',
          icon: 'iconshipinshu'
        },
        {
          text: '集均播放量',
          key: 'avgFlow',
          val: '',
          icon: 'iconpingjunbofangliang'
        }
      ],
      normalFormItemMap: {},
      videoDialogData: {},
      dialogShow: false,
      formConf: {},
      searchData: {
        methodId: 1,
        accountType: 1,
        pageNum: 1,
        size: 20,
        platId: '',
        accountId: '',
        titleName: '',
        flowStart: '',
        flowEnd: '',
        dateStart: '',
        dateEnd: '',
        determined: '',
        dateArr: ''
      }
    }
  },
  created() {
    this.buildFormConf()
    this.getPlatAccount()
    this.getAccountCondition()
    this.$nextTick(() => {
      const timeEnd = dayjs().format('YYYY-MM-DD')
      const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
      this.$set(this.$refs.search.form, 'dateArr', [
        `${timeStart}`,
        `${timeEnd}`
      ])
      this.searchData.dateArr = [`${timeStart}`, `${timeEnd}`]
      this.getList()
      this.getTeamVideoCount()
    })
  },
  methods: {
    getTeamVideoCount() {
      this.countLoading = true
      const data = copy(this.searchData)
      if (data.dateArr) {
        data.dateStart = data.dateArr[0]
        data.dateEnd = data.dateArr[1] + ' 23:59:59' || ''
        delete data.dateArr
      }
      $getTeamVideoCount(data).then(res => {
        if (res.code === 1) {
          this.dataNum.forEach(item => {
            item.val = res.data[item.key]
          })
        } else {
          this.$message.error(res.message)
        }
        this.countLoading = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.countLoading = false
      })
    },
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '请选择平台',
            allowCreate: true,
            defaultFirst: true
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true,
            hasAccount: true
          }
        },
        {
          type: 'input',
          key: 'titleName',
          conf: {
            placeholder: '请输入标题'
          }
        }
      ]
      this.formConf = {
        normal,
        hasExport: true
      }
      const normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
    },
    getPlatAccount(onlyAccount = false) {
      return $getPlatCondition({
        methodId: 1,
        accountType: 1
      }).then(re => {
        if (re.code === 1) {
          this.normalFormItemMap.platId.data = re.data
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    getAccountCondition(platId) {
      $condition({
        methodId: 1,
        platId,
        accountType: 1
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountId.data = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    showVideoDetail(rowData) {
      this.videoDialogData = Object.assign({ dialogType: 'adv' }, rowData)
      this.dialogShow = true
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {
      switch (item.key) {
          case 'platId':
            this.getAccountCondition(val)
            break
      }
    },
    /**
     * 获取业务数据
     * @param  {Object}   data   请求参数
     * @return {Object}          promise 对象
     */
    getList() {
      this.loading = true
      const data = copy(this.searchData)
      if (data.dateArr) {
        data.dateStart = data.dateArr[0]
        data.dateEnd = data.dateArr[1] + ' 23:59:59'
        delete data.dateArr
      }
      $getV1VideoInfo(data).then(re => {
        if (re.code === 1) {
          // this.dataNum.forEach(item => {
          //   item.val = re.data[item.key]
          // })
          this.tableData = re.data.list
          this.total = re.data.total
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
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      data = copy(data)
      data.pageNum = 1
      this.searchData = Object.assign(this.searchData, data)
      this.$bus.$emit('upLog')
      this.getList()
      this.getTeamVideoCount()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      data = copy(Object.assign(this.searchData, data))
      if (data.dateArr) {
        data.dateStart = data.dateArr[0]
        data.dateEnd = data.dateArr[1] + ' 23:59:59'
        delete data.dateArr
      }
      window.location.href = `/api/video/monitor/export?${qs.stringify(data)}&componentId=${this.$componentId}`
    }
  }
}
</script>
<style lang="scss" scoped>
  // .P-myVideo {
  //   background-color: #fff;
  // }
</style>
