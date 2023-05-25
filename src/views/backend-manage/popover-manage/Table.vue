
<template>
  <div class="table-view">
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      @sort-change="doSort"
    >
      <el-table-column prop="id" label="弹窗id">
        <template slot-scope="{ row }">
          {{ row.id || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationTitle" label="弹窗标题">
        <template slot-scope="{ row }">
          {{ row.notificationTitle || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationFrequency" label="频率">
        <template slot-scope="{ row }">
          {{ FREQUENCY_ARR[row.notificationFrequency || 0] || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationPriority" label="优先级">
        <template slot-scope="{ row }">
          {{ row.notificationPriority || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="termValidity" label="有效期">
        <template slot-scope="{ row }">
          {{ row.termValidity || '--' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationForceRead" label="强制阅读开关">
        <template slot-scope="{ row }">
          {{ row.notificationForceRead ? '开启' : '关闭' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationUrl" label="URL链接">
        <template slot-scope="{ row }">
          {{ row.notificationUrl ? `https://${row.notificationUrl}` :'--' }}
        </template>
      </el-table-column>

      <el-table-column prop="notificationStatus" label="状态">
        <template slot-scope="{ row }">
          {{ row.notificationStatus ? '上架' : '下架' }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="text"
            @click="handleEdit(row)"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="20"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>

    <AddPopverManageDialog
      v-if="showDialog"
      v-model="showDialog"
      type="edit"
      :detail="detail"
      @success="getList"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $getNotificationList } from '@/api/popover-manage'
import { useTableSort } from '@/hook'
import AddPopverManageDialog from './AddPopverManageDialog'
import { copy } from '@/utils'

export default defineComponent({
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    extFields: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    AddPopverManageDialog
  },
  setup(props) {
    const { $message, $router } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      showDialog: false,
      tableData: [],
      detail: {},
      FREQUENCY_ARR: ['当日首次登陆弹出', '每次登录弹出']
    })

    const handleGoDetail = (row) => {}

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $getNotificationList({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data.loginNotificationInfos
            state.total = res.data.total
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          state.loading = false
          $message.error(err.message || '网络错误')
        })
    }

    const handleEdit = (row) => {
      state.showDialog = true
      state.detail = row
    }

    // 排序
    const { doSort } = useTableSort(props.searchData, getList)
    return {
      ...toRefs(state),
      doSort,
      getList,
      handleGoDetail,
      handleEdit
    }
  }
})
</script>
<style lang="scss" scoped>
::v-deep {
  .video-list {
    flex-direction: row-reverse;
    .flex-wrap {
      flex-wrap: nowrap;
    }
  }
  .account-card {
    &__image {
      width: 66px;
      height: 66px;
      margin-right: 8px;
    }
    &__name {
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
      margin-bottom: 10px;
    }
  }
  .video-info {
    margin-right: 20px;
    &-right {
      width: 230px;
    }
    &-coverImg {
      width: 50px;
      height: 70px;
      border-radius: 0;
    }
    &-right__title {
      font-size: 14px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    .info-coverImg {
      width: 50px;
      height: 70px;
    }
  }
  .flex-align-center {
    align-items: flex-start;
  }
  .info-text {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 17px;
    margin-top: 4px;
  }
}
.info-p {
  display: flex;
  span:last-child {
    margin-left: 20px;
  }
}
</style>

