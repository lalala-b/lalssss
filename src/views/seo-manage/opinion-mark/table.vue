
<template>
  <div class="table-view">
    <el-table v-scrollbar v-loading="loading" :data="tableData" @sort-change="doSort">
      <el-table-column label="视频标题" width="266" align="left">
        <template slot-scope="{ row }">
          <VideoInfo :info="row" :options="{title: 'titleName', url: 'shareUrl', coverImg: 'coverUrl'}" />
        </template>
      </el-table-column>

      <el-table-column label="账号名称" width="220" align="left">
        <template slot-scope="{ row }">
          <template v-if="row.accountId">
            <AccountCard :info="row" />
          </template>
          <template v-else>
            <el-tooltip
              v-if="row.platId"
              effect="dark"
              :content="row.platName"
              placement="top"
            >
              <a :href="row.accountUrl" target="_blank">
                <img class="platImg" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${row.platId}.png`" alt="">
              </a>
            </el-tooltip>
            账号暂未收录
          </template>
        </template>
      </el-table-column>

      <el-table-column
        prop="videoType"
        label="视频类型"
      >
        <template slot-scope="{ row }">
          {{ row.videoType || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="spiderTime"
        label="数据更新时间"

        sortable="custom"
      >
        <template slot-scope="{ row }">
          {{ row.spiderTime || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="seoKeyWord"
        label="SEO搜索关键词"
      >
        <template slot-scope="{ row }">
          {{ row.seoKeyWord || '--' }}
        </template>
      </el-table-column>

      <el-table-column
        prop="opinion"
        label="舆论倾向"
      >
        <template slot-scope="{ row }">
          <div class="flex flex-align-center flex-justify-center">
            <template v-if="row.opinion === null">
              --
            </template>
            <template v-else>
              <el-tag :type="+row.opinion === 1 ? 'success' : +row.opinion === 0 ? 'warning' : 'danger'">
                {{ (opinionData.find(item => +item.dictValue === +row.opinion) || {}).dictLabel }}
              </el-tag>
            </template>
            <IconTip
              content="编辑"
              icon-class="iconbianji"
              @click="handleEdit(row)"
            />
          </div>
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

    <el-dialog
      title="设置舆论倾向"
      :visible.sync="showDialog"
      :before-close="handleClose"
      width="570px"
    >
      <el-select v-model="selectOpinion" placeholder="请选择舆论倾向">
        <el-option v-for="item in opinionData" :key="item.dictValue" :label="item.dictLabel" :value="item.dictValue" />
      </el-select>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { THIRD_INDEX_URL_MAP } from '@/const'
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { AccountCard, VideoInfo, IconTip } from 'components'
import { $getOpinionMarkList, $setOpinion } from '@/api/seo'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'

export default defineComponent({
  components: {
    AccountCard,
    VideoInfo,
    IconTip
  },
  props: {
    searchData: {
      type: Object,
      default: () => {}
    },
    opinionData: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { $message } = getCurrentInstance().proxy
    const state = reactive({
      total: 0,
      loading: true,
      tableData: [],
      showDialog: false,
      selectOpinion: null,
      selectRow: {}
    })

    const handleEdit = (row) => {
      state.showDialog = true
      state.selectRow = row
      state.selectOpinion = row.opinion === null ? null : String(row.opinion)
    }

    const handleClose = () => {
      state.showDialog = false
    }

    const handleConfirm = async() => {
      const { code, message } = await $setOpinion({
        thirdId: state.selectRow.thirdId,
        platId: state.selectRow.platId,
        opinion: state.selectOpinion === null ? null : +state.selectOpinion
      })

      if (+code === 1) {
        $message.success('设置成功')
        state.showDialog = false
        getList()
      } else {
        $message.error(message)
      }
    }

    const getList = function() {
      state.loading = true
      const searchData = copy(props.searchData)

      return $getOpinionMarkList({
        ...searchData
      })
        .then((res) => {
          state.loading = false
          if (res.code === 1) {
            state.tableData = res.data
            state.total = res.total
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
    // 排序
    const { doSort } = useTableSort(props.searchData, getList)

    return {
      ...toRefs(state),
      doSort,
      getList,
      handleEdit,
      handleClose,
      handleConfirm,
      THIRD_INDEX_URL_MAP
    }
  }
})
</script>
<style lang="scss" scoped>
.platImg {
  width: 18px;
  height: 18px;
  margin-left: 2px;
  margin-right: 2px;
  vertical-align: middle;
}
// ::v-deep {
//   .video-list {
//     flex-direction: row-reverse;
//     .flex-wrap {
//       flex-wrap: nowrap;
//     }
//   }
//   .account-card {
//     &__image {
//       width: 66px;
//       height: 66px;
//       margin-right: 8px;
//     }
//     &__name {
//       font-family: PingFangSC-Medium, PingFang SC;
//       font-weight: 500;
//       color: #272727;
//       line-height: 20px;
//       margin-bottom: 10px;
//     }
//   }
//   .video-info {
//     margin-right: 20px;
//     &-right {
//       width: 230px;
//     }
//     &-coverImg {
//       width: 50px;
//       height: 70px;
//       border-radius: 0;
//     }
//     &-right__title {
//       font-size: 14px;
//       font-family: PingFangSC-Medium, PingFang SC;
//       font-weight: 500;
//       color: #272727;
//       line-height: 20px;
//     }
//     .info-coverImg {
//       width: 50px;
//       height: 70px;
//     }
//   }
//   .flex-align-center {
//     align-items: flex-start;
//   }
//   .info-text {
//     font-size: 12px;
//     font-weight: 400;
//     color: #8c8c8c;
//     line-height: 17px;
//     margin-top: 4px;
//   }
// }
// .info-p {
//   display: flex;
//   span:last-child {
//     margin-left: 20px;
//   }
// }
</style>

