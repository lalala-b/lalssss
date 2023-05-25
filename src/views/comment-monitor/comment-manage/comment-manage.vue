<template>
  <div>
    <wrap class="search-view">
      <el-tag
        class="m-b-12"
        type="warning"
      ><i class="el-icon-warning m-r-12" />显示爬取的评论区数据详情</el-tag>
      <Search
        ref="search"
        :config="formConf"
        @export="onExport"
        @submit="onSubmit"
        @change="onChange"
      >
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
          <el-form-item label="评论发布时间">
            <el-date-picker
              v-model="target.model.cmtTime"
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
    <wrap class="m-t-16 m-b-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </wrap>
    <wrap>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号名称" min-width="220" align="left">
          <template slot-scope="{ row }">
            <template v-if="row.accountId">
              <AccountCard :info="row" />
            </template>
            <template v-else>账号暂未收录</template>
          </template>
        </el-table-column>
        <el-table-column label="视频标题" min-width="266" align="left">
          <template slot-scope="{ row }">
            <VideoInfo
              :info="row"
              :options="{ title: 'titleName', url: 'videoUrl',coverImg: 'videoCoverUrl' }"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="视频来源">
          <template slot-scope="{ row }">
            {{ !row.videoSource?'--':+row.videoSource===1?'监控账号':'喜欢列表' }}
          </template>
        </el-table-column> -->
        <el-table-column label="评论账号名" min-width="220" align="left">
          <template slot-scope="{ row }">
            <template v-if="+row.nullCommentFlag===0">
              <AccountCard :info="row" :options="{imgUrl: 'cmtAccountImg', name: 'cmtAccountName', accountUrl: 'cmtAccountLoginUrl',xingtuUrl:'cmtXingtuIndexUrl',accountId:'cmtAccountId' }" />
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column label="评论内容" min-width="180" align="left">
          <template slot-scope="{ row }">
            <template v-if="+row.nullCommentFlag===0">
              <OverPopover v-if="row.cmtText" :content="row.cmtText" :show-count="30" />
              <img v-else :src="row.animateUrl">
            </template>
            <template v-else>评论审核中/已删除</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="diggCount"
          sortable="custom"
          min-width="220"
          label="评论点赞量"
        >
          <template slot-scope="{ row }">
            <div class="toolsBox">
              <template v-if="editLikeCId !== row.cid">
                {{ +row.nullCommentFlag === 0 ? row.diggCount : '--' }}
              </template>
              <template v-else>
                <el-input-number v-model="editLikeNum" class="likeInput" :controls="false" size="small" :precision="0" :min="0" :max="100000000" />
              </template>
              <p v-if="row.updateDiggCountFlag">（手动编辑）</p>
            </div>
            <div v-if="$permission('edit-comment-like') && +nullCommentFlag !== 1" :class="['toolsBox', 'icons']">
              <i v-show="editLikeCId !== row.cid" class="icon el-icon-edit-outline editIcon" @click="() => handleEditLike(row)" />
              <span v-show="editLikeCId === row.cid">
                <i class="icon el-icon-check editIcon" @click="() => handleConfirmEditLike(row)" />
                <i class="icon el-icon-close editIcon" @click="handleCancelEditLike" />
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="cmtTime"
          sortable="custom"
          label="评论发布时间"
          min-width="168"
        >
          <template slot-scope="{ row }">
            <template v-if="+row.nullCommentFlag===0">
              {{ row.cmtTime }}
            </template>
            <template v-else>--</template>
          </template>
        </el-table-column>
        <el-table-column
          prop="spiderTime"
          sortable="custom"
          min-width="168"
        >
          <template slot="header">
            数据更新时间
            <IconTip
              content="爬虫最近一次爬完该视频评论区的时间"
              icon-class="iconwenhao"
            />
          </template>
        </el-table-column>
        <el-table-column label="评论归属人" min-width="120px">
          <template slot-scope="{ row }">
            {{ row.belongUserName|| '--' }}
          </template>
        </el-table-column>
        <el-table-column v-if="$permission('edit-commnet-belong')" label="操作" fixed="right" min-width="120px">
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <!-- <el-link type="primary" :underline="false">启用</el-link>
              <el-link type="primary" :underline="false">停用</el-link> -->
              <el-link type="primary" :underline="false" @click="handleEditBelong(row)">编辑评论归属</el-link>
            </div>
          </template>
        </el-table-column>
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
    <BindUserIdsDialog
      v-if="showbindDialog"
      v-model="showbindDialog"
      :bind-multiple="false"
      :account-id="cid"
      :user-ids="userIds"
      @close="handleClose"
      @update="onSubmit"
    />
  </div>
</template>
<script>
import { getCurrentInstance, reactive, toRefs, ref } from '@vue/composition-api'
import { Search, Statistics, AccountCard, OverPopover, VideoInfo, IconTip } from 'components'
import BindUserIdsDialog from '../_com/bindUserIdsDialog.vue'
import { copy } from '@/utils'
import {
  $getMonitorAccountInfo,
  $getPlatInfo,
  $getCommentList,
  $getAccountUserInfo,
  $getSummaryData,
  $editCommentLike
} from '@/api/comment-monitor'
import { commonData } from '../_com/hooks.js'
import { useTableSort } from '@/hook'
import qs from 'qs'

export default {
  components: {
    Search,
    AccountCard,
    OverPopover,
    VideoInfo,
    IconTip,
    Statistics,
    BindUserIdsDialog
  },
  setup(props, { emit }) {
    const { $message, $nextTick, $set, $refs } = getCurrentInstance().proxy
    const { formatData } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: true
    })
    const states = reactive({
      accountList: [],
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      loading: false,
      tableData: [],
      total: 0,
      cid: '',
      userIds: [],
      editLikeCId: '',
      editLikeNum: 0,
      showbindDialog: false,
      summaryItems: [
        {
          key: 'videoTotal',
          text: '被评论的视频条数',
          val: 0
        },
        {
          key: 'commentTotal',
          text: '评论总条数',
          val: 0
        },
        {
          key: 'nullCommentCount',
          text: '审核中/已删除条数',
          val: 0
        },
        {
          key: 'diggCount',
          text: '总点赞量',
          val: 0
        }
      ]
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
          key: 'cmtText',
          conf: {
            placeholder: '请输入评论内容'
          }
        },
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
          key: 'belongUserId',
          data: [],
          conf: {
            placeholder: '请选择评论归属人'
          },
          optionLabelKey: 'name',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'nullCommentFlag',
          data: [{
            dictLabel: '审核中/已删除',
            dictValue: '1'
          }, {
            dictLabel: '正常',
            dictValue: '0'
          }],
          conf: {
            placeholder: '请选择评论状态'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        }
        // {
        //   type: 'select',
        //   key: 'videoSource',
        //   data: [{
            // dictLabel: '监控账号',
            // dictValue: '1'
        //   }, {
        //     dictLabel: '喜欢列表',
        //     dictValue: '2'
        //   }],
        //   conf: {
        //     placeholder: '请选择视频来源'
        //   },
          // optionLabelKey: 'dictLabel',
          // optionValKey: 'dictValue'
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
      return $getCommentList({
        ...searchData.value
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
      if (data) {
        const params = formatData(data)
        if (params.accountName === '暂无账号') {
          params.accountId = -1
          delete params.accountName
        }
        params.pageNum = 1
        Object.assign(searchData.value, params)
      }
      getList()
      getSummaryData()
    }
    const onExport = (data) => {
      const params = formatData(data)
      if (params.accountName === '暂无账号') {
        params.accountId = -1
        delete params.accountName
      }
      params.pageNum = 1
      Object.assign(searchData.value, params)
      window.open(
        `/api/hd/comment/info/exportCommentList?${qs.stringify({
          ...searchData.value
        })}`
      )
    }
    const getAccountUserInfo = async() => {
      const res = await $getAccountUserInfo()
      if (res.code === 1) {
        normalFormItemMap.belongUserId.data = res.data || []
        normalFormItemMap.belongUserId.data = [{ id: '-1', name: '无归属人' }].concat(normalFormItemMap.belongUserId.data)
      }
    }
    const getSummaryData = () => {
      $getSummaryData({ ...searchData.value }).then(res => {
        if (res.code === 1) {
          states.summaryItems.forEach(item => {
            item.val = res.data[item.key]
          })
        } else {
          $message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) return
        $message.error(err.message)
      })
    }
    const handleClose = () => {
      states.showbindDialog = false
    }
    const handleEditBelong = (row) => {
      states.cid = row.cid
      states.userIds = row.belongUserId ? [row.belongUserId] : []
      states.showbindDialog = true
    }

    const handleEditLike = (row) => {
      states.editLikeNum = row.nullCommentFlag === 0 ? row.diggCount : 0
      states.editLikeCId = row.cid
    }

    const handleConfirmEditLike = async(scope) => {
      try {
        states.loading = true
        const { code, message } = await $editCommentLike({ cid: states.editLikeCId, diggCount: states.editLikeNum })
        if (+code === 1) {
          $message.success('')
          states.editLikeCId = 0
          states.editLikeNum = 0
          getList()
          getSummaryData()
        } else {
          $message.error(message)
          states.loading = false
        }
      } catch (e) {
        $message.error(e.message || '网络错误')
        states.loading = false
      }
    }

    const handleCancelEditLike = () => {
      states.editLikeNum = 0
      states.editLikeCId = ''
    }

    const { doSort } = useTableSort(searchData.value, getList)
    buildFormConf()
    getPlatInfo()
    getMonitorAccountInfo()
    getAccountUserInfo()

    $nextTick(() => {
      $set($refs.search.form, 'nullCommentFlag', '0')

      const params = copy($refs.search.form)

      Object.assign(searchData.value, params)

      $nextTick(() => {
        getList()
        getSummaryData()
      })
    })
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      doSort,
      getList,
      onExport,
      onChange,
      handleEditBelong,
      handleClose,
      handleEditLike,
      handleConfirmEditLike,
      handleCancelEditLike
    }
  }
}
</script>
<style lang="scss" scoped>
.toolsBox {
  display: inline-block;
  vertical-align: middle;
}

.icons {
  margin-left: 6px;
}

.editIcon {
  cursor: pointer;
}

.likeInput {
  width: 120px;
  margin-right: 6px;

  input {
    padding: 0 24px 0 0 !important;
  }
}
</style>
