<template>
  <el-dialog
    width="60%"
    title="视频列表"
    :visible="show"
    append-to-body
    @close="handleClose"
  >
    <div class="video-search m-b-24">
      <el-row>
        <el-col :span="8">
          <el-input
            v-model="videoSearchData.title"
            placeholder="请输入标题"
            style="width:240px"
            clear=""
          />
        </el-col>
        <el-col :span="10">
          <el-date-picker
            v-model="videoSearchData.timerange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getVideoList">查询</el-button>
        </el-col>
      </el-row>
    </div>
    <el-table
      ref="videoTable"
      v-scrollbar
      v-loading="loading"
      :data="videoTableData"
      @selection-change="handleSelectVideo"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column property="date" label="标题">
        <template slot-scope="scope">
          <el-link
            :type="(scope.row.isDeleted || scope.row.url === '') ? 'info' : 'primary'"
            target="_blank"
            :href="scope.row.url"
          >{{ scope.row.isDeleted ? '（已删除）' : '' }}{{ scope.row.titleName }}</el-link>
        </template>
      </el-table-column>
      <el-table-column property="addTime" label="添加时间" />
    </el-table>
    <div class="dialog-pager m-t-24">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="10"
        :total="total"
        :current-page.sync="videoSearchData.pageNum"
        @current-change="getVideoList"
      />
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $accountVideoList } from '@/api/account-manage'

export default defineComponent({
  props: {
    value: Boolean,
    selectedVideo: {
      type: Object,
      default: () => {}
    },
    accountId: Number,
    platId: Number
  },
  setup(props, { emit }) {
    const { $nextTick, $message, $refs } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const videoSearchData = reactive({
      pageNum: 1,
      timerange: null
    })
    const selectedVideoList = ref([props.selectedVideo])
    const videoTableData = ref([])
    const total = ref(0)
    const handleSelectVideo = (val) => {
      if (val.length > 1) {
       $refs.videoTable.clearSelection()
       $refs.videoTable.toggleRowSelection(val.pop())
      } else {
       selectedVideoList.value = val.pop()
      }
    }
    const processCheckedRow = () => {
      const videos = selectedVideoList.value
      videoTableData.value.forEach(item => {
        const isChosend = videos.findIndex(v => v.flowId === item.flowId)
        if (isChosend >= 0) {
          $refs.videoTable.toggleRowSelection(item, true)
        }
        item.isChosend = isChosend >= 0
      })
    }

    const loading = ref(false)
    const getVideoList = () => {
      loading.value = true
      const { accountId, platId } = props
      const params = Object.assign({ accountId, platId }, videoSearchData)
      if (params.timerange) {
        params.startDate = params.timerange[0]
        params.endDate = params.timerange[1] + ' 23:59:59'
      } else {
        params.startDate = ''
        params.endDate = ''
      }
      delete params.timerange

      $accountVideoList(params).then(res => {
        if (res.code === 1) {
          videoTableData.value = res.data
          total.value = res.total
          $nextTick(() => {
            processCheckedRow()
          })
        } else {
          $message(res.message)
        }
        loading.value = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        $message(err.message)
        loading.value = false
      })
    }
    getVideoList()
    const handleConfirm = () => {
      emit('success', selectedVideoList)
      handleClose()
    }
    return {
      getVideoList,
      videoSearchData,
      videoTableData,
      total,
      loading,
      show,
      handleClose,
      handleConfirm,
      handleSelectVideo
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep{
  thead {
    .el-table-column--selection {
      .cell {
        display: none;
      }
    }
  }
}
</style>
