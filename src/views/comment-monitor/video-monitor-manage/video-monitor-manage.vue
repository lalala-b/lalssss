<template>
  <div>
    <wrap class="search-view">
      <el-tag class="m-b-12" type="warning"><i class="el-icon-warning m-r-12" />管理哪些视频的评论区需要被爬取</el-tag>
      <Search ref="search" :config="formConf" @submit="onSubmit" @change="onChange">
        <template v-slot:normal="target">
          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="target.model.addTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="视频入库时间">
            <el-date-picker
              v-model="target.model.inDBTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="数据更新时间">
            <el-date-picker
              v-model="target.model.videoUpdateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <wrap>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号名称" width="220" align="left">
          <template slot-scope="{ row }">
            <template v-if="row.platId">
              <AccountCard :info="row" />
            </template>
            <template v-else>
              账号暂未收录
            </template>
          </template>
        </el-table-column>
        <el-table-column label="视频标题" width="266" align="left">
          <template slot-scope="{ row }">
            <VideoInfo :info="row" :options="{title: 'titleName', url: 'videoUrl', coverImg: 'videoCoverUrl'}" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="视频来源">
          <template slot-scope="{ row }">
            {{ !row.videoSource?'--':+row.videoSource===1?'监控账号':'喜欢列表' }}
          </template>
        </el-table-column> -->
        <el-table-column
          prop="createTime"
          sortable="custom"
          label="视频入库时间"
        />
        <el-table-column
          label="数据更新时间"
        >
          <template slot="header">
            数据更新时间
            <IconTip
              content="爬虫最近一次爬完该视频评论区的时间"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.dataUpdateTime||'--' }}
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-tag v-if="+row.videoStatus" type="success">爬取中</el-tag>
            <el-tag v-else type="danger">停止爬取</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <el-link type="primary" :underline="false" @click="handleStopOrOpen(row,1)">开始爬取</el-link>
              <el-link type="primary" :underline="false" @click="handleStopOrOpen(row,0)">停止爬取</el-link>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="total,prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, toRefs, ref } from '@vue/composition-api'
import { AccountCard, VideoInfo, IconTip } from 'components'
import { commonData } from '../_com/hooks.js'
import { useTableSort } from '@/hook'
import {
  $getMonitorAccountInfo,
  $getPlatInfo,
  $getMonitorVideoList
} from '@/api/comment-monitor'
import { copy } from '@/utils/index.js'

export default {
  components: {
    Search,
    AccountCard,
    VideoInfo,
    IconTip
  },
  setup(props, { emit }) {
    const { $message, $confirm, $nextTick, $set, $refs } = getCurrentInstance().proxy
    const { commentStatusList, formatData, getStatusTxt } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: false
    })
    const states = reactive({
      accountList: [],
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      loading: false,
      tableData: [],
      total: 0
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
         {
          type: 'input',
          key: 'videoTitle',
          conf: {
            placeholder: '请输入视频标题'
          }
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '全部平台'
          }
        },
         {
          type: 'select',
          key: 'accountId',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            placeholder: '请选择账号',
            allowCreate: true,
            defaultFirst: true,
            isAccountName: true
          }
        },
        {
          type: 'select',
          key: 'videoStatus',
          data: commentStatusList,
          conf: {
            placeholder: '请选择状态'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        }
        // {
        //   type: 'select',
        //   key: 'videoSource',
        //   data: [{
        //     dictLabel: '监控账号',
        //     dictValue: '1'
        //   }, {
        //     dictLabel: '喜欢列表',
        //     dictValue: '2'
        //   }],
        //   conf: {
        //     placeholder: '请选择视频来源'
        //   },
        //   optionLabelKey: 'dictLabel',
        //   optionValKey: 'dictValue'
        // }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }

   const getPlatInfo = () => {
      $getPlatInfo()
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.platId.data = res.data || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const getMonitorAccountInfo = (val) => {
      $getMonitorAccountInfo({
        platId: val
      })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = [{ accountId: '-1', accountName: '暂无账号' }].concat(res.data || [])
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'platId':
          model.accountId = ''
          normalFormItemMap.accountId.data = []
          getMonitorAccountInfo(val)
          break
      }
    }

    const getList = function() {
      states.loading = true
      const params = copy(searchData.value)
      if (params.accountName === '暂无账号') {
        params.accountId = -1
        delete params.accountName
      }
      return $getMonitorVideoList({
        ...params
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data
            states.total = res.total || 0
          } else {
            states.tableData = []
            states.total = 0
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const onSubmit = (data) => {
      const params = formatData(data)
      params.pageNum = 1
      Object.assign(searchData.value, params)
      getList()
    }
    const handleStopOrOpen = (row, type) => {
       $confirm(`是否确认${getStatusTxt(type)}账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          console.info('12423r214')
        })
    }
    const { doSort } = useTableSort(searchData.value, getList)
    buildFormConf()
    getPlatInfo()
    getMonitorAccountInfo()
    $nextTick(() => {
      $set($refs.search.form, 'videoStatus', '1')
      searchData.value.videoStatus = '1'
      getList()
    })
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      onChange,
      doSort,
      getList,
      handleStopOrOpen
    }
  }
}
</script>
