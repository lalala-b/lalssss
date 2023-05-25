<template>
  <Wrap>
    <Search @onSubmit="onSubmit" />
    <Statistics :dark="true" :data="summaryItems" :loading="loading" />
    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      header-row-class-name="table-header"
      class="m-t-16"
      @sort-change="doSort"
    >
      <el-table-column class-name="table-title" label="视频信息" width="400" align="left">
        <template slot-scope="{row}">
          <VideoInfo :info="row" :options="{ coverImg: 'videoCoverUrl', title: 'titleName' }" />
        </template>
      </el-table-column>

      <el-table-column prop="fieldName" label="行业类别" />

      <el-table-column prop="flowCount" label="总流量" sortable="custom" />
      <el-table-column prop="thumbUpCount" label="点赞量" sortable="custom" />

      <!-- <el-table-column prop="commentCount" label="评论量" sortable="custom" />
          <el-table-column prop="forwardedCount" label="转发量" sortable="custom" /> -->
      <el-table-column prop="addTime" label="发布时间" width="102" sortable="custom" />
      <el-table-column prop="flowMoney" label="执行金额" sortable="custom" />
      <el-table-column prop="brandName" label="品牌" />
      <el-table-column prop="quotientName" label="合作产品" />
      <el-table-column label="视频优势">
        <template slot-scope="{ row }">
          <el-tag v-for="item in formatViodeoText(row.videoAdvantage)" :key="item" style="margin-bottom: 6px;">{{ item }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="140">
        <template slot-scope="s">
          <IconTip
            v-log="{ flowId: s.row.flowId, titleName: s.row.titleName }"
            content="查看"
            class="m-r-10"
            icon-class="iconxiangqing"
            @click="handleShow(s.row)"
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
    <VideoDetailDialog :show.sync="showDialog" :dialog-data="dialogData" />

  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { Statistics, IconTip, VideoInfo, AccountCard, VideoDetailDialog } from 'components'
import EditDialog from '@/views/bussiness-manage/workorder/_pages/order/EditDialog.vue'
import Search from './search.vue'
import { useVideo } from '../hooks'

const useDialog = () => {
  const showDialog = ref(false)
  const dialogData = ref(null)
  const handleShow = (row, type = 'detail') => {
    dialogData.value = row
    showDialog.value = true
}
  return {
    dialogData,
    showDialog,
    handleShow
  }
}

export default defineComponent({
  components: { Statistics, IconTip, Search, EditDialog, VideoInfo, AccountCard, VideoDetailDialog },
  setup() {
    const { $route } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const {
      loading,
      summaryItems,
      tableData,
      total,
      getList,
      onSubmit,
      setSearchData,
      searchData,
      doSort
    } = useVideo()
    setSearchData({ accountId })
    getList()

    const videoAdvantageList = ref([
      { label: '数据好', value: 1 },
      { label: '创意好', value: 2 },
      { label: '转化好', value: 3 }
    ])
    const formatViodeoText = (text) => {
      if (!text) {
        return ''
      }
      const textName = []
      text.split(',').forEach(t => {
        if (t && videoAdvantageList.value[t - 1]) {
          textName.push(videoAdvantageList.value[t - 1].label)
        }
      })
      return textName
    }

    const {
      showDialog,
      dialogData,
      handleShow
    } = useDialog()
    return {
      doSort,
      loading,
      summaryItems,
      tableData,
      onSubmit,
      showDialog,
      dialogData,
      handleShow,
      total,
      getList,
      searchData,
      formatViodeoText
    }
  }
})
</script>
