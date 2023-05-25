<template>
  <div>
    <wrap class="search-view">
      <el-tag class="m-b-12" type="warning">
        <i
          class="el-icon-warning m-r-12"
        />管理海盗用于评论的官方账号（如：转转回收、转转二手）
      </el-tag>
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="更新时间">
            <el-date-picker
              v-model="target.model.updateTime"
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
      <el-tooltip
        style="width: 100px"
        class="item"
        effect="dark"
        content="待上线"
        placement="top"
      >
        <div>
          <el-button class="m-b-12" type="primary" disabled>添加账号</el-button>
        </div>
      </el-tooltip>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column prop="platName" label="平台" />
        <el-table-column
          label="账号类型"
          width="240"
          align="left"
        >
          <template slot-scope="{ row }">
            <span>{{ accountTypeMap[row.accountType] || '-' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="账号名称"
          prop="accountName"
          width="240"
          align="left"
        >
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column
          prop="bindUserName"
          label="账号归属人"
        >
          <template slot-scope="{ row }">
            {{ row.bindUserName.length?row.bindUserName[0]:'--' }}
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          sortable="custom"
          width="168"
          label="更新时间"
        />
        <!-- <el-table-column prop="addUserName" label="创建人" /> -->
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-tag v-if="+row.accountStatus" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="{ row }">
            <div class="flex flex-justify-center">
              <el-link
                v-if="!+row.accountStatus"
                type="primary"
                :underline="false"
                @click="handleStopOrOpen(row, 1)"
              >启用</el-link>
              <el-link
                v-else
                type="primary"
                :underline="false"
                @click="handleStopOrOpen(row, 0)"
              >停用</el-link>
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
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, toRefs, ref } from '@vue/composition-api'
import {
  $getListComment,
  $getCommentPlatInfo,
  $getCommentAccountInfo,
  $editCommentAccountStatus,
  $getBindAccountUserInfo
} from '@/api/comment-monitor'
import { AccountCard } from 'components'
import { commonData } from '../_com/hooks.js'
import { useTableSort } from '@/hook'

export default {
  components: {
    Search,
    AccountCard
  },
  setup(props, { emit }) {
    const { $message, $confirm, $nextTick, $set, $refs } = getCurrentInstance().proxy
    const { statusList, getStatusTxt, formatData1, formatAccount, accountTypeList } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: false
    })

    const accountTypeMap = {}

    accountTypeList.forEach(item => {
      accountTypeMap[item.dictValue] = item.dictLabel
    })

    const states = reactive({
      accountList: [],
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      loading: false,
      tableData: [],
      total: 0,
      platIdList: [],
      accountIdList: [],
      accountTypeMap
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
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
          key: 'commentAccountType',
          data: accountTypeList,
          conf: {
            placeholder: '请选择账号类型'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'bindUserId',
          data: [],
          conf: {
            placeholder: '请选择账号归属人'
          },
          optionLabelKey: 'name',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'accountStatus',
          data: statusList,
          conf: {
            placeholder: '请选择状态'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }

    const getPlatInfo = () => {
      $getCommentPlatInfo()
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.platId.data = res.data || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    // 获取账号归属人
    const getBindAccountUserInfo = () => {
      $getBindAccountUserInfo()
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.bindUserId.data = res.data || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const getCommentAccountInfo = (val) => {
      $getCommentAccountInfo({
        platId: val
      })
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.accountId.data = res.data || []
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
          getCommentAccountInfo(val)
          break
      }
    }
    const getList = function() {
      states.loading = true
      return $getListComment({
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
      const _params = formatAccount(data)
      const params = formatData1(_params)
      params.pageNum = 1
      Object.assign(searchData.value, params)
      getList()
    }
    const handleStopOrOpen = (row, type) => {
      $confirm(`是否确认${getStatusTxt(type)}账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res = await $editCommentAccountStatus({
            accountId: row.accountId,
            accountStatus: type
          })
          if (res.code === 1) {
            $message.success(res.message)
            getList()
          }
        } catch (error) {
          console.info(error)
        }
      })
    }
    const { doSort } = useTableSort(searchData.value, getList)
    buildFormConf()
    getPlatInfo()
    getCommentAccountInfo()
    getBindAccountUserInfo()
    $nextTick(() => {
      $set($refs.search.form, 'accountStatus', '1')
      searchData.value.accountStatus = '1'
      getList()
    })
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      doSort,
      getList,
      onChange,
      handleStopOrOpen
    }
  }
}
</script>
