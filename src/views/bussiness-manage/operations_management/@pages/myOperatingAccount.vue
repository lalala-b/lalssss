<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
      >
        <template v-slot:prv="target">
          <platformSelect
            v-model="target.model.platId"
            :inline="true"
            :query="config"
            @platChange="getSelfAccount(arguments[0], target.model)"
          />
          <accountSelect
            :inline="true"
            :no-ajax="true"
            :list="accountList"
            :form="target.model"
            :has-account="true"
            :params="config"
            :conf="{ allowCreate: false, placeholder: '账号' }"
          />
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input
                v-model="target.model.fansStart"
                type="number"
                placeholder="粉丝量最小值"
              />
              <span class="m-r-5 m-l-5">至</span>
              <el-input
                v-model="target.model.fansEnd"
                type="number"
                placeholder="粉丝量最大值"
              />
            </div>
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <Wrap class="table-view m-t-16">
      <el-table
        ref="accounts"
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号" width="240" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称" width="136" />
        <el-table-column label="SOP类型" width="136">
          <template slot-scope="{ row }">
            {{ row.sopType|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom">
          <template slot-scope="{ row }">
            {{ row.fansNum | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="fansIncrementNumWeek"
          label="近7日涨粉数"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.fansIncrementNumWeek | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="addFansMonth"
          label="近30日涨粉数"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.addFansMonth | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgFlowWeek"
          label="近7天集均流量"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.avgFlowWeek | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          prop="avgFlowMonth"
          label="近30天集均流量"
          sortable="custom"
        >
          <template slot-scope="{ row }">
            {{ row.avgFlowMonth | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right">
          <template slot-scope="s">
            <div class="flex flex-justify-center">
              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="账号详情"
                icon-class="iconxiangqing"
                @click="handleGoDetail(s.row)"
              />

              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                :class="s.row.viewFlag ? 'remove-ing' : ''"
                :content="s.row.viewFlag ? '该账号移交已在移交中' : '移交申请'"
                icon-class="iconinteration"
                @click="handleRemove(s.row, 'remove')"
              />
              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                :class="s.row.editAccountInfoFlag ? 'remove-ing' : ''"
                :content="
                  s.row.editAccountInfoFlag
                    ? '该账号已在修改报备中'
                    : '修改报备'
                "
                icon-class="iconicon_edit"
                @click="handleRemove(s.row, 'modify')"
              />
              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="编辑"
                icon-class="iconbianji"
                @click="handleEdit(s.row)"
              />
            </div>
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
    </Wrap>
    <RemoveDialog
      v-if="removeDialog"
      v-model="removeDialog"
      :dialog-type="dialogType"
      :row="row"
      @getList="getList"
      @close="removeDialog = false"
    />
    <EditSop
      v-if="editDialog"
      v-model="editDialog"
      :row="row"
      @getList="getList"
      @close="editDialog = false"
    />
  </div>
</template>
<script>
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { Search, AccountCard, IconTip } from 'components'
import RemoveDialog from '@/views/bussiness-manage/operations_management/_com/RemoveDialog.vue'

import EditSop from '@/views/bussiness-manage/operations_management/_com/EditSop.vue'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import { $getAccountInfo, $getSelfAccountList } from '@/api/operating-manage'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'
import { commonData } from '@/views/bussiness-manage/operations_management/_com/hooks.js'
import qs from 'qs'

export default {
  components: {
    Search,
    IconTip,
    AccountCard,
    accountSelect,
    platformSelect,
    RemoveDialog,
    EditSop
  },
  setup(props, { emit }) {
    const { $message, $router, $permission } = getCurrentInstance().proxy
    const { formatAccount } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: $permission('order-export')
    })
    const states = reactive({
      accountList: [],
      tableData: [],
      total: 0,
      loading: false,
      row: {},
      removeDialog: false,
      dialogType: 'remove',
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      editDialog: false
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
    const getSelfAccount = (id = '', model) => {
      emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $getAccountInfo({ platId: id })
        .then((res) => {
          if (res.code === 1) {
            states.accountList = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const getList = function() {
      states.loading = true
      const params = copy(searchData.value)
      return $getSelfAccountList({
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
      const params = formatAccount(data)
      Object.assign(searchData.value, params)
      getList()
    }
    const onExport = (data) => {
      const params = formatAccount(data)
      searchData.value = Object.assign(searchData.value, params)
      window.open(
        `/api/account/transfer/order/selfAccount/export?${qs.stringify({
          ...searchData.value
        })}`
      )
    }
    const handleRemove = (row, type) => {
      if (
        (type === 'remove' && !row.viewFlag) ||
        (type === 'modify' && !row.editAccountInfoFlag)
      ) {
        states.removeDialog = true
        states.row = row
        states.dialogType = type
      }
    }
    // 查看
    const handleGoDetail = ({
      accountId = '',
      platId = '',
      accountName,
      accountType
    }) => {
      if ([25, 26].includes(platId)) {
        $router.push({
          path: `/details/account/${platId}/${accountId}`,
          query: {
            accountType: accountType,
            name: accountName,
            platId: platId,
            _blank: true
          }
        })
      } else if (platId === 2) {
        $router.push({
          path: `/details/bilibili-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else if (platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${platId}/${accountId}`,
          query: {
            accountType,
            _blank: true
          }
        })
      } else {
        window.open(`#/account-manage/account-detail?accountId=${accountId}`)
      }
    }
    // 编辑
    const handleEdit = (row) => {
      states.editDialog = true
      states.row = row
    }
    getSelfAccount()
    getList()
    // 排序
    const { doSort } = useTableSort(searchData.value, getList)
    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      ...toRefs(states),
      doSort,
      getList,
      handleGoDetail,
      handleRemove,
      getSelfAccount,
      handleEdit
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .remove-ing {
    .iconinteration:before {
      color: #9f9fa0;
    }
    .iconicon_edit:before {
      color: #9f9fa0;
    }
  }
  .iconicon_edit:before {
    font-size: 18px;
  }
}
</style>
