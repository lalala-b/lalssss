<template>
  <Wrap>
    <Search @onSubmit="handleSubmit" />
    <Statistics v-if="editAuth" :dark="true" class="statistics" :data="summaryItems" />
    <div>
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        class="m-t-16"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="视频信息" width="400" align="left">
          <template slot-scope="{row}">
            <VideoInfo :info="row">
              <template v-slot:link>
                <div class="video-link-info">
                  <span class="m-r-5">组件类型：{{ linkType[row.linkUseType] }}</span>
                  <span>组件渠道号：{{ row.androidDeliveryName }}</span>
                </div>
              </template>
            </VideoInfo>
          </template>
        </el-table-column>
        <el-table-column prop="advertiserRealname" label="广告师" />
        <el-table-column prop="deliveryName" label="投放专员" />
        <el-table-column prop="fansNum" label="粉丝数" sortable="custom" />
        <el-table-column v-if="editAuth" prop="flowCount" label="总流量" sortable="custom" />
        <el-table-column prop="thumbUpCount" label="点赞数" sortable="custom" />
        <el-table-column prop="deliveryMoney" label="投放价格" sortable="custom" />
        <template v-if="editAuth">
          <el-table-column prop="cpm" label="CPM" sortable="custom" />
          <el-table-column prop="cptClick" label="组件点击量" sortable="custom" />
          <el-table-column prop="appNewDeviceQty" label="安卓新增激活" sortable="custom">
            <template slot-scope="s">
              {{ s.row.appNewDeviceQty | toThousands }}
            </template>
          </el-table-column>

          <!-- <el-table-column label="操作" width="80">
            <template slot-scope="s">
              <el-link
                v-log="{ flowId: s.row.flowId, orderId: s.row.flowId, titleName: s.row.titleName }"
                type="primary"
                @click="handleShowDetail(s.row)"
              >查看详情</el-link>
            </template>
          </el-table-column> -->
        </template>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </div>
    <!-- <Dialog v-if="showDialog" v-model="showDialog" :row-info="rowInfo" /> -->
  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance, ref } from '@vue/composition-api'
import { Statistics, VideoInfo } from 'components'
import Search from './search.vue'
// import Dialog from '@/views/bussiness-manage/advertising/_pages/launch/_components/dialog.vue'
import { copy } from '@/utils'
import { LINK_TYPE } from '@/const'
import { $getVideoPuttingListNew } from '@/api/putting-manager'

import { useTableSort } from '@/hook'
export default defineComponent({
  components: { Statistics, VideoInfo, Search },
  setup() {
    const { $message, $route } = getCurrentInstance().proxy
    const { accountId } = $route.params
    const searchData = {
      accountId,
      size: 20
    }
    const summaryItems = ref([
      {
        key: 'titleNum',
        val: 0,
        text: '标题'
      },
      {
        key: 'flowCountNum',
        val: 0,
        text: '流量'
      },
      {
        key: 'thumbUpCountNum',
        val: 0,
        text: '点赞'
      },
      {
        key: 'cptClickNum',
        val: 0,
        text: '组件点击量'
      },
      {
        key: 'deliveryMoneyNum',
        val: 0,
        text: '投放价格'
      },
      {
        key: 'cpm',
        val: 0,
        text: 'CPM'
      }
    ])
    const tableData = ref([])
    const total = ref(0)
    const loading = ref(false)
    const editAuth = ref(0)

    const getList = async() => {
      loading.value = true
      const params = copy(searchData)
      if (params.timerange) {
        params.addTimeStart = params.timerange[0] || ''
        params.addTimeEnd = params.timerange[1] || ''
        if (params.addTimeEnd) {
          params.addTimeEnd += ' 23:59:59'
        }
        delete params.timerange
      }
      try {
        const res = await $getVideoPuttingListNew(params)
        if (res.code === 1 && res.data) {
          summaryItems.value.forEach(t => {
            t.val = res.data[t.key] || 0
          })
          tableData.value = res.data.list || []
          total.value = res.data.total || 0
          editAuth.value = res.data.editAuth || 0
        } else {
          $message.error(res.message)
        }
        loading.value = false
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        loading.value = false
        $message.error(err.message)
      }
    }

    const handleSubmit = (data) => {
      console.log(data, 'data')
      searchData.pageNum = 1
      Object.assign(searchData, data)
      getList()
    }

    const { doSort } = useTableSort(searchData, getList)

    getList()

    const linkType = LINK_TYPE

    const rowInfo = ref({})
    const showDialog = ref(false)
    const handleShowDetail = (row) => {
      const { flowId, androidDeliveryName, orderId } = row
      rowInfo.value = { flowId, androidDeliveryName, orderId }
      showDialog.value = true
    }

    return {
      showDialog,
      loading,
      editAuth,
      tableData,
      summaryItems,
      searchData,
      getList,
      doSort,
      total,
      linkType,
      rowInfo,
      handleSubmit,
      handleShowDetail
    }
  }
})
</script>
