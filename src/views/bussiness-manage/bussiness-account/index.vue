<template>
  <div class="P-advertisingLaunch">
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:btns>
          <el-button v-if="$permission('commercial_affairs_account_add')" v-log type="primary" @click="handleAddAccount">添加商务账号</el-button>
        </template>
      </v-search>
    </Wrap>
    <Wrap class="m-t-16">
      <Statistics :data="summaryItems" :loading="loading" />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-end m-b-24">
        <el-button
          v-if="$permission('commercial_affairs_account_batch_import')"
          type="primary"
          @click="importDrawerStatus = true"
        >批量导入账号</el-button>
        <el-button v-if="$permission('commercial_affairs_account_change_status')" v-log type="primary" size="small" plain @click="updateCheckAccountStatus(0)">批量上架</el-button>
        <el-button v-if="$permission('commercial_affairs_account_change_status')" v-log type="danger" size="small" plain @click="updateCheckAccountStatus(1)">批量下架</el-button>
      </div>
      <el-table
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
        @selection-change="handleListSelect"
      >
        <el-table-column v-if="$permission('commercial_affairs_account_change_status')" :selectable="checkVerifyPermission" type="selection" />
        <el-table-column prop="accountStatus" label="账号状态" width="90">
          <template slot-scope="{ row }">
            <el-select
              v-if="$permission('commercial_affairs_account_change_status') && row.editOperatorPermissions"
              v-model="row.accountStatus"
              size="mini"
              @change="hanleAccountStatus(row)"
            >
              <el-option
                v-for="item in accountStatusList"
                :key="item.value"
                :value="item.value"
                :label="item.label"
              />
            </el-select>
            <div v-else>{{ row.accountStatus === 0 ? '上架': '下架' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号信息" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row">
              <template v-slot>
                <div v-if="row.upUpNameAndLeader" class="m-t-5" style="text-align:left;"><el-tag size="mini" type="danger">{{ row.upUpNameAndLeader }}</el-tag></div>
              </template>
            </AccountCard>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom" width="120">
          <template slot-scope="{row}">{{ row.fansNum | toThousandsW }}</template>
        </el-table-column>
        <el-table-column prop="sixPrice" label="21-60s报价" sortable="custom" width="132">
          <template slot="header">
            <IconTip
              content="抖音账号数据来源为星图平台，系统每月自动更新一次（每月第二日），可能存在一定偏差，支持编辑校准。其他平台数据以用户编辑数值为准。"
              label="21-60s报价"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{row}">{{ row.sixPrice | toThousandsW }}</template>
        </el-table-column>
        <el-table-column prop="rebate" label="返点" sortable="custom" />
        <el-table-column prop="cpm" label="CPM" sortable="custom" width="90">
          <template slot="header">
            <IconTip
              content="预期CPM：数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
              label="CPM"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="s">
            <div> {{ s.row.cpm | toThousands }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="省市地址">
          <template slot-scope="scope">
            <!-- {{ scope.row.provName }}-{{ scope.row.cityName }} -->
            {{ scope.row.provNameAndCityName }}
          </template>
        </el-table-column>
        <el-table-column prop="groupName" label="商务小组" />
        <el-table-column prop="realName" label="商务负责人" width="72" />
        <el-table-column prop="accountUseCount" label="投放次数" sortable="custom" />
        <el-table-column prop="avgLikeWeek" label="近7天集均点赞量" sortable="custom" />
        <el-table-column prop="avgLikeMonth" label="近30天集均点赞量" sortable="custom" />
        <el-table-column label="操作" width="140">
          <template slot-scope="s">

            <IconTip
              v-log
              content="查看"
              class="m-r-10"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
            />
            <IconTip
              v-if="s.row.editOperatorPermissions"
              content="编辑"
              icon-class="iconbianji"
              class="m-r-10"
              @click="handleEdit(s.row)"
            />
            <el-popconfirm
              v-if="s.row.delOperatorPermissions && s.row.accountUseCount === 0"
              :title="`确定删除账号${s.row.accountName}？`"
              @confirm="handleDeletAccount(s.row)"
            >
              <IconTip
                slot="reference"
                content="删除"
                icon-class="iconshanchu"
                class="m-r-10"
                :disabled="s.row.accountUseCount > 0"
              />
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
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

    <ImportAcounts
      v-if="importDrawerStatus"
      :show="importDrawerStatus"
      :config="importConf"
      template-url="/api/account/commercial/affairs/downLoadCommercialAffairsAccounTemplate"
      :is-off-line="true"
      fail-url="/api/account/commercial/affairs/downloadErrorData"
      :prev-status-url="prevStatusUrl"
      @close="importDrawerStatus = false"
    />
    <AccountDialog
      v-if="showDialog"
      v-model="showDialog"
      :account-id="accountId"
      :is-edit="isEdit"
      :user-list="optionsData.userList"
      :tag-list="optionsData.tagList"
      @update="getList"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import qs from 'qs'
import Search from '@/components/Search'
import tableMixin from '@/mixins/table'
import { Statistics, AccountCard, IconTip } from 'components'
import ImportAcounts from '@/components/ImportAcounts'
import { $getDataByDictType } from '@/api'
import { $getCommercialPrvImportStatus, $getUserIdByMeduimOrgId, $getCommercialList, $getCommercialCondition, $getCommercialMedAccounts, $editCommercialAccountStatus, $delCommercialAccount, $getMediumOrgCondition } from '@/api/bussiness-manage'
import { copy } from '@/components/common'
import { unique } from '@/utils'
import AccountDialog from './_mods//AccountDialog.vue'

export default {
  components: {
    vSearch: Search,
    Statistics,
    ImportAcounts,
    AccountCard,
    AccountDialog,
    IconTip
  },
  mixins: [tableMixin],
  data() {
    return {
      prevStatusUrl: $getCommercialPrvImportStatus,
      editType: '',
      accountLoading: false,
      hasAccount: false,
      showDialog: false,
      accountList: [],
      formConf: {},
      accountId: null,
      searchData: {
        accountId: '',
        accountName: '',
        accountStatus: 0,
        platId: '',
        accountType: '',
        pageNum: 1
      },
      // inputTags: [],
      optionsData: {
        belongTeams: [],
        // 省
        provinceList: [],
        // 市
        cityList: [],
        // 平均播放量区间
        playRange: [],
        // 60s星图报价区间
        xingtuPrice: [],
        // 粉丝区间
        fansRange: [],
        // 媒介采买人
        userList: [],
        // 达人类型
        tagValue: []
      },
      // 统计数据
      summaryItems: [
        {
          key: 'accountNum',
          text: '账号数量',
          val: 0
        },
        {
          key: 'onlineAccountNum',
          text: '上架账号数量',
          val: 0
        },
        {
          key: 'cooperationAccountCount',
          text: '合作投放账号数量',
          val: 0
        }
      ],
      // 上架下架状态
      accountStatusList: [{
        value: 0,
        label: '上架'
      }, {
        value: 1,
        label: '下架'
      }],
      normalFormItemMap: {},
      importConf: {
        pageType: 2,
        methodId: 3,
        title: '导入商务账号',
        url: '/api/account/commercial/affairs/batchImport'
      },
      isEdit: false,
      checkAccountListIds: [],
      importDrawerStatus: false // 批量导入账号弹窗
    }
  },
  computed: {
    ...mapGetters([
      'realname'
    ])
  },
  created() {
    this.buildFormConf()
    this.getFilterData()
    this.getFilterList()
    this.getList()
    this.$bus.$on('updateMediumOrg', this.handleUpdate)
  },
  beforeDestroy() {
    this.$bus.$off('updateMediumOrg')
  },
  methods: {
    checkVerifyPermission(row) {
      return row.editOperatorPermissions
    },
    /**
     * 构造搜索表单
     */
    buildFormConf() {
      const normal = [
        {
          type: 'select',
          key: 'accountStatus',
          data: this.accountStatusList,
          conf: {
            placeholder: '请选择账号状态'
          },
          value: 0,
          optionValKey: 'value',
          optionLabelKey: 'label'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: {
            placeholder: '全部平台'
          },
          optionValKey: 'platId',
          optionLabelKey: 'platName'
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请输入账号',
            allowCreate: true,
            defaultFirst: true
          },
          optionValKey: 'accountId',
          optionLabelKey: 'accountName'
        },

        {
          type: 'select',
          key: 'tagValue',
          data: [],
          conf: {
            placeholder: '达人类型'
          }
        },
         {
          type: 'select',
          key: 'fansRange',
          data: [],
          conf: {
            placeholder: '粉丝量级别'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'sixPrice',
          data: [],
          conf: {
            placeholder: '21-60s报价'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'cpm',
          data: [],
          conf: {
            placeholder: '请选择cpm'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'maxAgeLabel',
          data: [],
          conf: {
            placeholder: '粉丝年龄'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'cascader',
          key: 'sixRange',
          data: [],
          conf: {
            placeholder: '粉丝性别分布',
            props: { value: 'dictValue', label: 'dictLabel', emitPath: true, checkStrictly: true }

          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },
        {
          type: 'select',
          key: 'maxPhoneLabel',
          data: [],
          conf: {
            placeholder: '粉丝手机系统'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        },

        {
          type: 'select',
          key: 'isCommerce',
          data: [{
            text: '是',
            val: 1
          }, {
            text: '否',
            val: 0
          }],
          conf: {
            placeholder: '是否开通购物车'
          }
        },
        {
          type: 'input',
          key: 'provNameAndCityName',
          data: '',
          conf: {
            placeholder: '请输入省市地址'
          }
        },
        {
          type: 'select',
          key: 'accountContacts',
          data: [],
          conf: {
            placeholder: '账号对接人'
          }
        },
        {
          type: 'select',
          key: 'meetUserId',
          data: [],
          conf: {
            placeholder: '商务负责人'
          },
          optionValKey: 'userId',
          optionLabelKey: 'realname'
        }
        // {
        //   type: 'select',
        //   key: 'cpm',
        //   data: [],
        //   conf: {
        //     placeholder: '请选择cpm'
        //   },
        //   optionValKey: 'dictValue',
        //   optionLabelKey: 'dictLabel'
        // },

        // {
        //   type: 'select',
        //   key: 'playRange',
        //   data: [],
        //   conf: {
        //     placeholder: '平均播放量'
        //   }
        // }
      ]
      const formConf = {
        normal,
        hasExport: this.$permission('commercial_affairs_account_export')
      }
      const normalFormItemMap = {}
      formConf.normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = formConf
    },
    // 获取下拉框选项 CPM
    getFilterList() {
      $getDataByDictType({
        dictTypes: ['sign_contract_account_price_range', 'sign_contract_account_fans_range', 'sys_search_cpm', 'fans_age_kuaishou_condition_age', 'daren_library_query_condition_phone', 'daren_library_query_condition_fans', 'daren_library_query_condition_60s', 'daren_library_query_condition_sex', 'daren_library_query_condition_sex_rate']
      }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.cpm.data = res.data.sys_search_cpm
          this.normalFormItemMap.maxAgeLabel.data = res.data.fans_age_kuaishou_condition_age
          this.normalFormItemMap.maxPhoneLabel.data = res.data.daren_library_query_condition_phone
          this.normalFormItemMap.sixPrice.data = res.data.sign_contract_account_price_range
          this.normalFormItemMap.fansRange.data = res.data.sign_contract_account_fans_range
          this.normalFormItemMap.sixRange.data = res.data.daren_library_query_condition_sex.map(item => ({ ...item, children: res.data.daren_library_query_condition_sex_rate }))
        }
      })
    },
    // 获取搜索数据
    getFilterData() {
      $getCommercialCondition().then((res) => {
        if (res.code === 1) {
          this.normalFormItemMap.platId.data = res.data.plats || []
          // this.normalFormItemMap.meetUserId.data = res.data.meetAccounts || []
          this.normalFormItemMap.tagValue.data = res.data.tagValues.map(item => ({ val: item, text: item }))
          // this.normalFormItemMap.mechanismId.data = res.data.belongs.map(item => ({ val: item.id, text: item.mcnName }))
          this.normalFormItemMap.accountContacts.data = res.data.accountContacts.map(item => ({ val: item, text: item }))
          this.normalFormItemMap.accountId.data = unique(res.data.accounts || [], 'accountId')
          this.normalFormItemMap.meetUserId.data = res.data.commercialAffairsUsers || []
          this.optionsData.userList = [...res.data.commercialAffairsUsers] || []
          this.optionsData.tagList = [...res.data.tagValues]
        } else {
          this.$message.error(res.message)
        }
      })
      // $getFilterRange().then(res => {
      //   if (res.code === 1) {
      //     this.normalFormItemMap.fansRange.data = res.data.fansRange.map(item => ({ val: item, text: item }))
      //     this.normalFormItemMap.priceRange.data = res.data.priceRange.map(item => ({ val: item, text: item }))
      //     // this.normalFormItemMap.playRange.data = res.data.playRange.map(item => ({ val: item, text: item }))
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    // 弹窗打开
    dialogOpen() {
      if (this.addForm.provId) {
        this.provinceChange(this.addForm.provId, false)
      }
    },
    // 查看
    handleShow(row) {
      if ([25, 26].includes(row.platId)) {
       this.$router.push({
          path: `/details/account/${row.platId}/${row.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (row.platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${row.platId}/${row.accountId}`,
          query: {
             accountType: row.accountType,
            _blank: true
          }
        })
      } else if (row.platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${row.platId}/${row.accountId}`,
          query: {
            accountType: row.accountType,
            _blank: true
          }
        })
      } else {
        this.$router.push({
          path: '/order-account-detail',
          query: {
            accountId: row.accountId,
            accountName: row.accountName,
            type: 7,
            _blank: true
          }
        })
      }
    },
    // 编辑媒介账号-获取信息
    handleEdit(row) {
      this.editType = 'edit'
      this.isEdit = true
      this.accountId = row.accountId
      this.showDialog = true
    },

    /**
     * 搜索内容变化响应函数
     * @param  {Mix}     val    新的值
     * @param  {Object}  item   组件配置
     * @param  {String}  type   区域类型
     * @param  {Number}  index  位置
     * @param  {Object}  model  搜索表单数据
     */
    onSearchChange(val, item, type, index, model) {
      if (item.key === 'platId') {
        model.accountId = ''
        this.normalFormItemMap.accountId.data = []
        $getCommercialMedAccounts({ platId: val, methodId: 1 }).then(res => {
          this.normalFormItemMap.accountId.data = unique(res.data || [], 'accountId')
        })
      }
    },
    /**
     * 表单查询函数
     */
    onSubmit(data) {
      data = copy(data)
      this.searchData = Object.assign(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    /**
     * 导出响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onExport(data) {
      const params = Object.assign({}, this.searchData, data)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      location.href = `/api/account/commercial/affairs/export?${qs.stringify(params)}&componentId=${this.$componentId}`
    },

    handleAddAccount() {
      this.editType = 'add'
      this.showDialog = true
      this.isEdit = false
    },
    // 删除账号
    handleDeletAccount(row) {
      if (row.accountUseCount > 0) {
        return this.$message.error('投放次数大于0的账号不可删除')
      }
      $delCommercialAccount({ accountId: row.accountId }).then(res => {
        if (res.code === 1) {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },

    getList() {
      this.loading = true
      const params = copy(this.searchData)
      if (params.cpm) {
        params.cpmStart = params.cpm.split('-')[0]
        params.cpmEnd = params.cpm.split('-')[1] || ''
        delete params.cpm
      }
      if (params.sixRange) {
        params.maxSexLabel = params.sixRange[0]
        params.maxSexRate = params.sixRange[1]
        delete params.sixRange
      }
      $getCommercialList(params).then((res) => {
        if (res.code === 1) {
          this.tableData = res.data.list
          this.total = res.data.total
          this.summaryItems = this.summaryItems.map(item => {
            item.val = res.data[item.key] || 0
            return item
          })
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
      })
    },

    // 列表选择
    handleListSelect(s) {
      this.checkAccountListIds = s.map(item => item.accountId)
    },
    // 更改账号状态
    hanleAccountStatus(row) {
      const accountIds = []
      const accountStatus = row.accountStatus
      accountIds.push(row.accountId)
      this.updateAccountStatus({ accountIds, accountStatus })
    },
    // 批量更新账号状态
    updateCheckAccountStatus(accountStatus) {
      if (this.checkAccountListIds.length === 0) {
        return this.$message.error('请选择要批量操作的数据')
      }
      this.updateAccountStatus({ accountIds: this.checkAccountListIds, accountStatus })
    },
    updateAccountStatus({ accountIds = [], accountStatus = 0 }) {
      $editCommercialAccountStatus({ accountStatus, accountIds }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.getList()
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },

    handleUpdate() {
      $getMediumOrgCondition().then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.mechanismId.data = res.data.baseMcnInfos.map(item => ({ val: item.id, text: item.mcnName }))
        }
      })
    },
    getUserIdByMeduimOrgId(val) {
      $getUserIdByMeduimOrgId({ mechanismId: val }).then(res => {
        if (res.code === 1) {
          this.addForm.meetUserId = res.data
        }
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.add-form {
  .plat-info {
    margin-top: 10px;
    img {
      width: 50px;
      height: 50px;
    }
  }
  .input-new-tag {
    width: 120px;
  }
  .the-tag {
    margin: 0 4px 0 0;
  }
  .dialog-footer {
    text-align: center;
  }
}
</style>
<style lang="scss">

</style>
