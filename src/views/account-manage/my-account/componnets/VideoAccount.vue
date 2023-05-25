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
          <platformSelect v-model="target.model.platId" :inline="true" :query="paramsConfig" @platChange="getAccountInfoListCondition(arguments[0], target.model)" />
          <accountSelect :inline="true" :list="accountList" :form="target.model" :has-account="true" :params="paramsConfig" />
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input v-model="target.model.fansStart" type="number" placeholder="粉丝量最小值" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.fansEnd" type="number" placeholder="粉丝量最大值" />
            </div>
          </el-form-item>
        </template>

      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <div class="flex m-b-10">
        <el-button v-log type="primary" @click="addAccount">添加我的账号</el-button>
        <el-button v-if="$permission('add_douyin_account')" v-log type="primary" @click="handleAddDouyinAccount">添加抖音账号</el-button>
      </div>
      <el-table
        ref="accounts"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称">
          <template slot-scope="{row}">
            {{ row.belongName|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="belongTeam" label="账号归属" />
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom" width="136" />
        <el-table-column prop="fansIncrementNumWeek" label="近7日涨粉数" sortable="custom" width="136" />
        <el-table-column prop="addFansMonth" label="近30日涨粉数" sortable="custom" width="148" />
        <el-table-column prop="avgFlowWeek" label="近7天集均流量" sortable="custom" width="148" />
        <el-table-column prop="avgFlowMonth" label="近30天集均流量" sortable="custom" width="148" />
        <el-table-column label="操作" width="120px" fixed="right">
          <template slot-scope="s">
            <div class="flex flex-justify-center">
              <IconTip
                v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
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
                  v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
                  content="账号已过期，请重新绑定账号"
                  icon-class="iconrebind-account"
                  @click="() => +s.row.platId === 25 ? handleAddDouyinAccount(s.row.accountId) : handleBind(s.row)"
                />
                <IconTip
                  v-else
                  v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
                  content="账号已过期，请重新绑定账号"
                  icon-class="iconrebind-account"
                  @click="() => handleBind(s.row)"
                />
              </template>
              <IconTip
                v-if="!s.row.operatorFlag"
                v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
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
    <account-dialog v-if="dialogStatus" :is-jump="isJump" :re-bind-data="reBindData" :is-rebind="isRebind" :is-my-account="true" :page-num="searchData.pageNum" :dialog-status.sync="dialogStatus" @success="addAccountSuccess" />
    <EditDialog v-if="editVisible" v-model="editVisible" :account-info="editForm" @success="getList" />
  </div>
</template>

<script>
import qs from 'qs'
import { mapState } from 'vuex'
import Search from '@/components/Search'
import mixin from '../../bench-mark/_mods/mixin'
import commonMixin from '../../_com/commonMixin'
import tableMixin from '@/mixins/table'
import accountDialog from './acconunt-dialog'
import IconTip from '@/components/IconTip'
import { $delAccount, $getSelfAccounts } from '@/api/account-manage'
import { $condition } from '@/api/video-manage'
import platformSelect from '@/components/PlatformSelect'
import accountSelect from '@/components/AccountSelect'
import AccountCard from '@/components/AccountCard'
import EditDialog from './edit.vue'

const SEARCH_MODEL = {
  platId: '',
  accountId: '',
  belongName: '',
  accountName: '',
  fansStart: '',
  fansEnd: '',
  pageNum: 1
}

export default {
  components: {
    'v-search': Search,
    accountDialog,
    platformSelect,
    accountSelect,
    AccountCard,
    IconTip,
    EditDialog
  },
  mixins: [mixin, tableMixin, commonMixin],
  data() {
    return {
      editVisible: false,
      dialogStatus: false,
      accountList: [],
      searchData: {
        pageNum: 1
      },
      paramsConfig: { methodId: 1, accountType: 1 },
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
      normalFormItemMap: {},
      formConf: {},
      allAccounts: [],
      total: 0,
      isRebind: false,
      reBindData: {},
      isJump: false
    }
  },
  computed: {
    searchStr() {
      // 查询字段字符串
      const str = []
      for (const key in this.searchData) {
        str.push(`${key}=${this.searchData[key]}`)
      }
      return `?${str.join('&')}`
    },
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    'searchData.pageNum'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getList(newVal)
      }
    }
  },
  created() {
    this.buildFormConf()
    // this.loadBaseSearchData()
    this.getList()
    // this.getAccountInfoListCondition()
  },
  mounted() {
    const { code, accountId } = this.$route.query
    // 从开放平台跳回
    if (code) {
      // 重新绑定
      this.isJump = true
      if (accountId) {
        this.dialogStatus = true
        this.reBindData = { accountId }
        this.isRebind = true
      } else {
        this.dialogStatus = true
        this.isRebind = false
      }
    }
  },
  methods: {
    addAccountSuccess(val) {
      this.getAccountInfoListCondition()
      this.getList(val)
    },
    addAccount() {
      this.reBindData = {}
      this.isRebind = false
      this.dialogStatus = true
      this.isJump = false
    },
    handleShow(rowData) {
      if ([25, 26].includes(rowData.platId)) {
        this.$router.push({
          path: `/details/account/${rowData.platId}/${rowData.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (rowData.platId === 2) {
        this.$router.push({
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
        window.open(`#/account-manage/account-detail?accountId=${rowData.accountId}`)
      }
    },
    handleEdit(row) {
      for (const key in this.editForm) {
        this.editForm[key] = row[key] || ''
      }
      this.editVisible = true
    },
    handleBind(row) {
      this.reBindData = row
      this.dialogStatus = true
      this.isJump = false
      this.isRebind = true
    },
    handleDel(rowData) {
      this.$confirm('是否确认删除此账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        this.$bus.$emit('upLog', { accountId: rowData.accountId, accountName: rowData.accountName, operation_module: '删除确定' })
        const res = await $delAccount({
          accountId: rowData.accountId
        })
        if (res.code === 1) {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        }
      }).catch(err => {})
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      const search = this.searchData
      for (const key in data) {
        search[key] = data[key]
      }
      if (search.belongName) {
        search.accountId = ''
        search.accountName = ''
      } else {
        if (search.accountName) {
          search.accountId = ''
        }
      }
      search.pageNum = 1
      this.getList()
    },
    onExport() {
      window.open(`/api/account/monitor/exportAccountExcel?${qs.stringify(this.searchData)}`)
    },
    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     */
    onSearchChange(val, item, type, index, model) {
      switch (item.key) {
          case 'accountId':
            this.handleAccountChange(val, item.data)
            break
          case 'platId':
            this.normalFormItemMap.accountId.data = []
            this.searchData.accountId = ''
            model.accountId = ''
            this.searchData.platId = val
            break

          case 'note':
            this.searchData.note = val
            break
          default:
            this.searchData[item.key] = val
      }
    },
    getListData(query) {
      return $getSelfAccounts(query).then(res => res)
    },
    getAccountInfoListCondition(id = '', model) {
      this.$bus.$emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $condition({
        ...this.paramsConfig,
        platId: id
      }).then(res => {
        this.accountList = res.data
      })
    },
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      var normal = [
        // {
        //   type: 'select',
        //   key: 'accountId',
        //   data: [],
        //   optionLabelKey: 'accountName',
        //   optionValKey: 'accountId',
        //   conf: {
        //     placeholder: '请输入账号',
        //     allowCreate: true,
        //     defaultFirst: true
        //   }
        // }
        // {
        //   type: "input",
        //   label: "流量区间",
        //   key: "fansStart",
        //   conf: {
        //     placeholder: "流量最小值"
        //   },
        //   hide: true
        // },
        // {
        //   type: "input",
        //   label: "至",
        //   key: "fansEnd",
        //   conf: {
        //     placeholder: "流量最大值"
        //   },
        //   hide: true
        // }
      ]
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        SEARCH_MODEL[item.key] = ''
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: true
      }
    },

    handleAddDouyinAccount(accountId) {
      let url = `https://api.qpmcn.com/api/token/toOAuthScan?userId=${this.userInfo.userid}`
      if (['number', 'string'].indexOf(typeof accountId) > -1) {
        url += `&accountId=${accountId}`
      }
      window.open(url, '_self')
    }
  }
}
</script>

<style scoped lang="scss">
</style>
