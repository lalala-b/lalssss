<template>
  <div>
    <wrap class="search-view">
      <el-tag class="m-b-12" type="warning">
        <i class="el-icon-warning m-r-12" />管理哪些账号的新视频发布需要及时提醒
      </el-tag>
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.createdTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
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
      <el-button
        class="m-b-12"
        type="primary"
        @click="showDialog = true"
      >添加账号</el-button>
      <el-table
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号名称" width="240" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" sortable="custom" label="创建时间" />
        <el-table-column prop="updateTime" sortable="custom" label="更新时间" />
        <el-table-column prop="addUserName" label="创建人" />
        <el-table-column label="状态">
          <template slot-scope="{ row }">
            <el-tag v-if="+row.accountStatus" type="success">启用</el-tag>
            <el-tag v-else type="danger">停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提醒人" align="left">
          <template slot-scope="{ row }">
            {{ row.bindUserName?row.bindUserName.join(','): '--' }}
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
              <el-link
                slot="reference"
                type="primary"
                class="m-l-8"
                :underline="false"
                @click="handleShowDialog(row)"
              >编辑提醒人</el-link>
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

    <AddAccountDialog
      v-if="showDialog"
      v-model="showDialog"
      :edit-type="'add'"
      @close="handleClose"
      @update="getList"
    />
    <BindUserIdsDialog
      v-if="showbindDialog"
      v-model="showbindDialog"
      :account-id="accountId"
      :user-ids="userIds"
      @close="handleClose"
      @update="getList"
    />
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, toRefs, ref } from '@vue/composition-api'
import { AccountCard } from 'components'
import BindUserIdsDialog from '../_com/bindUserIdsDialog.vue'
import {
  $getMonitorUserInfo,
  $getMonitorAccountInfo,
  $getPlatInfo,
  $editAccountStatus,
  $getlistMonitorAccountInfo,
  $getAccountUserInfo
} from '@/api/comment-monitor'
import { commonData } from '../_com/hooks.js'
import { useTableSort } from '@/hook'
import AddAccountDialog from '../_com/AddAccountDialog.vue'
export default {
  components: {
    Search,
    AccountCard,
    AddAccountDialog,
    BindUserIdsDialog
  },
  setup(props, { emit }) {
    const { $message, $confirm, $nextTick, $set, $refs } =
      getCurrentInstance().proxy
    const { statusList, getStatusTxt, formatData1, formatAccount } =
      commonData()
    const formConf = reactive({
      normal: [],
      hasExport: false
    })
    const states = reactive({
      loading: false,
      tableData: [],
      total: 0,
      showDialog: false,
      showbindDialog: false,
      userIds: [],
      accountId: ''
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
          key: 'addUserId',
          data: [],
          conf: {
            placeholder: '请选择创建人'
          },
          optionLabelKey: 'userName',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'bindUserId',
          data: [],
          conf: {
            placeholder: '请选择提醒人'
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
    const handleShowDialog = (row) => {
      states.showbindDialog = true
      states.accountId = row.accountId + ''
      states.userIds = row.bindUserId
    }
    const getMonitorUserInfo = () => {
      try {
        $getMonitorUserInfo().then((res) => {
          if (res.code === 1) {
            normalFormItemMap.addUserId.data = res.data || []
          }
        })
      } catch (error) {
        console.info(error)
      }
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
            normalFormItemMap.accountId.data = res.data || []
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const getAccountUserInfo = async() => {
      const res = await $getAccountUserInfo()
      if (res.code === 1) {
        normalFormItemMap.bindUserId.data = res.data || []
      }
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
      return $getlistMonitorAccountInfo({
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
    const handleClose = () => {
      states.showDialog = false
      states.showbindDialog = false
    }
    const handleStopOrOpen = (row, type) => {
      $confirm(`是否确认${getStatusTxt(type)}账号?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        try {
          const res = await $editAccountStatus({
            accountId: row.accountId,
            accountStatus: type
          })
          if (res.code === 1) {
            $message.success(res.message)
            getList()
          } else {
            $message.error(res.message)
          }
        } catch (error) {
          if (error.__CANCEL__) {
            return
          }
          $message.error(error.message)
        }
      })
    }

    const { doSort } = useTableSort(searchData.value, getList)
    buildFormConf()
    getMonitorUserInfo()
    getPlatInfo()
    getMonitorAccountInfo()
    getAccountUserInfo()
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
      handleStopOrOpen,
      onChange,
      handleClose,
      handleShowDialog
    }
  }
}
</script>
