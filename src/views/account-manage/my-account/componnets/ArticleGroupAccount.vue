<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <!-- <platformSelect v-model="target.model.platId" :inline="true" :query="paramsConfig" @platChange="getArticleAccountNameCondition(arguments[0], target.model)" /> -->
          <accountSelect :inline="true" :list="accountList" :form="target.model" :has-account="true" :params="paramsConfig" />
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
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <div class="flex m-b-10">
        <el-button
          v-log
          type="primary"
          @click="addAccount"
        >添加我的账号</el-button>
        <el-button
          v-if="$permission('add_douyin_account')"
          v-log
          type="primary"
          @click="handleAddDouyinAccount"
        >添加抖音账号</el-button>
      </div>
      <el-table
        ref="accounts"
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
        <el-table-column prop="belongName" label="账号统一名称">
          <template slot-scope="{ row }">
            {{ row.belongName | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="belongTeam" label="账号归属" />
        <el-table-column
          prop="fansNum"
          label="总粉丝量"
          sortable="custom"
          width="136"
        />
        <!-- <el-table-column prop="fansIncrementNumWeek" label="近7日涨粉数" sortable="custom" width="136" />
        <el-table-column prop="addFansMonth" label="近30日涨粉数" sortable="custom" width="148" />
        <el-table-column prop="avgFlowWeek" label="近7天集均流量" sortable="custom" width="148" />
        <el-table-column prop="avgFlowMonth" label="近30天集均流量" sortable="custom" width="148" /> -->
        <el-table-column label="操作" width="160px" fixed="right">
          <template slot-scope="s">
            <div class="flex flex-justify-center">
              <IconTip
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="查看"
                icon-class="iconxiangqing"
                @click="handleShow(s.row)"
              />
              <!-- <IconTip
                v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
                content="编辑"
                icon-class="iconbianji"
                @click="handleEdit(s.row)"
              /> -->
              <!-- isOver:0 未过期 1 已过期 -->
              <!-- @click="() => +s.row.platId === 25 ? handleAddDouyinAccount(s.row.accountId) : handleBind(s.row)" -->
              <template v-if="s.row.isOver">
                <IconTip
                  v-if="$permission('add_douyin_account')"
                  v-log="{
                    accountId: s.row.accountId,
                    accountName: s.row.accountName,
                  }"
                  content="账号已过期，请重新绑定账号"
                  icon-class="iconrebind-account"
                  @click="
                    () =>
                      +s.row.platId === 25
                        ? handleAddDouyinAccount(s.row.accountId)
                        : handleBind(s.row)
                  "
                />
                <IconTip
                  v-else
                  v-log="{
                    accountId: s.row.accountId,
                    accountName: s.row.accountName,
                  }"
                  content="账号已过期，请重新绑定账号"
                  icon-class="iconrebind-account"
                  @click="() => handleBind(s.row)"
                />
              </template>
              <IconTip
                v-if="!s.row.operatorFlag"
                v-log="{
                  accountId: s.row.accountId,
                  accountName: s.row.accountName,
                }"
                content="删除"
                icon-class="iconshanchu"
                @click="handleDel(s.row)"
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
        />
      </div>
    </Wrap>
    <account-dialog
      v-if="dialogStatus"
      :is-jump="isJump"
      :re-bind-data="reBindData"
      :is-rebind="isRebind"
      :is-my-account="true"
      :page-num="searchData.pageNum"
      :dialog-status.sync="dialogStatus"
      :tab-type="'article'"
      @success="addAccountSuccess"
    />
    <EditDialog
      v-if="editVisible"
      v-model="editVisible"
      :account-info="editForm"
      @success="getList"
    />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  getCurrentInstance,
  computed
} from '@vue/composition-api'
import qs from 'qs'
import Search from '@/components/Search'
import accountDialog from './acconunt-dialog'
import platformSelect from '@/components/PlatformSelect'
import accountSelect from '@/components/AccountSelect'
import AccountCard from '@/components/AccountCard'
import EditDialog from './edit.vue'
import IconTip from '@/components/IconTip'
import { $delAccount, $selfArticleAccountList, $getArticlePlatCondition, $getArticleAccountNameCondition } from '@/api/account-manage'
import { useTableSort } from '@/hook'
import { useStore } from '@/views/putting-manager/hook'
export default defineComponent({
  components: {
    'v-search': Search,
    accountDialog,
    platformSelect,
    accountSelect,
    AccountCard,
    IconTip,
    EditDialog
  },
  setup(props, { emit }) {
    const { $message, $router, $confirm } = getCurrentInstance().proxy
    const { doSort } = useTableSort(searchData, getList)

    const states = reactive({
      paramsConfig: { methodId: 1, accountType: 1 },
      accountList: [],
      loading: false,
      tableData: [],
      accountConfig: {
        conf: {
          filterable: true,
          clearable: true,
          allowCreate: true,
          defaultFirst: true
        },
        optionValKey: 'accountId',
        optionLabelKey: 'accountName',
        data: []
      },
      editForm: {
        accountImg: '',
        accountId: '',
        belongName: '',
        platId: '',
        platName: '',
        accountName: '',
        bindPhone: '',
        xingtuIndexUrl: '',
        accountLoginUrl: ''
      },
      editVisible: false,
      allAccounts: [],
      total: 0,
      isRebind: false,
      reBindData: {},
      isJump: false,
      dialogStatus: false
    })
    const store = useStore()
    const userInfo = computed(() => store.userInfo.value)
    const searchData = ref({
      pageNum: 1
    })
    const formConf = reactive({
      normal: [],
      hasExport: true
    })
    const normalFormItemMap = reactive({})
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
        }
        // {
        //   type: 'select',
        //   key: 'belongName',
        //   data: [],
        //   conf: {
        //     placeholder: '请输入账号',
        //     defaultFirst: true,
        //     clearable: true,
        //     filterable: true
        //   },
        //   optionValKey: 'belongName',
        //   optionLabelKey: 'belongName'
        // }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    // 获取平台
    const getArticlePlatCondition = (id = '', model) => {
      if (model) {
        model.accountId = ''
      }
      $getArticlePlatCondition().then((res) => {
        normalFormItemMap.platId.data = res.data
      })
    }
    // 获取账号
    const getArticleAccountNameCondition = (id = '', model) => {
       emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $getArticleAccountNameCondition({
        platId: id
      }).then((res) => {
        states.accountList = res.data
        // normalFormItemMap.belongName.data = res.data
      })
    }
    const getList = async() => {
      states.loading = true
      try {
        const res = await $selfArticleAccountList(searchData.value)
        if (res.code === 1) {
          states.loading = false
          states.tableData = res.data
          states.total = res.total
        }
      } catch (error) {
        states.loading = false
        $message.error(error)
      }
    }
    const addAccountSuccess = (val) => {
      getArticleAccountNameCondition()
      getList(val)
    }
    const addAccount = () => {
      states.reBindData = {}
      states.isRebind = false
      states.dialogStatus = true
      states.isJump = false
    }
    const handleShow = (rowData) => {
      if ([25, 26].includes(rowData.platId)) {
        $router.push({
          path: `/details/account/${rowData.platId}/${rowData.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (rowData.platId === 2) {
        $router.push({
          path: `/details/bilibili-account/${rowData.platId}/${rowData.accountId}`,
          query: {
            accountType: rowData.accountType,
            _blank: true
          }
        })
      } else if (rowData.platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${rowData.platId}/${rowData.accountId}`,
          query: {
            accountType: rowData.accountType,
            _blank: true
          }
        })
      } else {
        window.open(
          `#/account-manage/account-detail?accountId=${rowData.accountId}`
        )
      }
    }
    const handleEdit = (row) => {
      for (const key in states.editForm) {
        states.editForm[key] = row[key] || ''
      }
      states.editVisible = true
    }
    const handleBind = (row) => {
      states.reBindData = row
      states.dialogStatus = true
      states.isJump = false
      states.isRebind = true
    }
    const handleDel = (rowData) => {
      $confirm('是否确认删除此账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          emit('upLog', {
            accountId: rowData.accountId,
            accountName: rowData.accountName,
            operation_module: '删除确定'
          })
          const res = await $delAccount({
            accountId: rowData.accountId
          })
          if (res.code === 1) {
            getList()
            $message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            $message({
              type: 'info',
              message: '删除失败'
            })
          }
        })
        .catch((err) => {})
    }

    const onSubmit = (data) => {
      Object.assign(searchData.value, data)
      getList()
    }
    const onExport = (data) => {
     Object.assign(searchData.value, data)
      window.open(
        `/api/account/monitor/selfArticleAccountList?${qs.stringify(
          { ...searchData.value, useType: 2 }
        )}`
      )
    }
    const onSearchChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'platId': // 签约团队
          model.belongName = ''
          model.accountId = ''
          states.accountList = []
          getArticleAccountNameCondition(val)
          break
        case 'note':
          searchData.value.note = val
          break
        default:
          searchData.value[item.key] = val
      }
    }
    const handleAddDouyinAccount = (accountId) => {
      let url = `https://api.qpmcn.com/api/token/toOAuthScan?userId=${userInfo.value.userid}`
      if (['number', 'string'].indexOf(typeof accountId) > -1) {
        url += `&accountId=${accountId}`
      }
      window.open(url, '_self')
    }
    buildFormConf()
    getArticlePlatCondition()
    getArticleAccountNameCondition()
    addAccountSuccess()
    return {
      ...toRefs(states),
      searchData,
      formConf,
      onSubmit,
      onExport,
      onSearchChange,
      addAccountSuccess,
      addAccount,
      handleShow,
      handleEdit,
      handleBind,
      handleDel,
      handleAddDouyinAccount,
      doSort
    }
  }
})
</script>

<style lang="scss" scoped>
.buttonGroup {
  position: sticky;
  top: 0px;
  display: block;
  width: 100%;
  background: #f5f5f5;
  padding-top: 24px;
  padding-bottom: 10px;
  transform: translateY(-24px);
  z-index: 2;
}

.body {
  margin-top: -10px;
}

.video-detail {
  &-header {
    padding: 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    &__fans {
      font-size: 14px;
      color: #d9d9d9;
      .iconfont {
        font-size: 14px;
        margin-right: 4px;
      }
    }
    &__data {
      font-size: 20px;
      color: #272727;
      line-height: 20px;
      > li {
        margin-right: 50px;
      }
      .iconfont {
        margin-right: 5px;
        font-size: 18px;
        color: #d9d9d9;
      }
    }
    ::v-deep {
      .video-info {
        &-coverImg {
          width: 100px;
          height: 134px;
          border-radius: 6px;
          margin-right: 12px;
        }
        &-right__title {
          margin-bottom: 8px;
        }
      }
    }
  }
  &-content {
    padding: 24px;
    > h3 {
      font-size: 14px;
      font-weight: 500;
      color: #272727;
      line-height: 20px;
    }
    &__time {
      margin-left: 36px;
      font-size: 12px;
      font-weight: 400;
      color: #595959;
      line-height: 16px;
    }
    &__list {
      > li {
        width: 25%;
        margin-top: 16px;
        font-size: 12px;
        color: #595959;
        line-height: 16px;
      }
    }
  }
  .container {
    > li {
      display: inline-block;
      width: 33.33%;
      margin-top: 16px;
    }
  }
}
</style>
