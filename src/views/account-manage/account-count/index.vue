<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
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
            :conf="{ allowCreate: false }"
          />
          <el-form-item>
            <el-select
              v-model="target.model.accountStatus"
              placeholder="请选择账号状态"
              clearable
            >
              <el-option
                v-for="item in accountStatusList"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-cascader
              v-model="target.model.careOrgId"
              placeholder="请选择账号保管部门"
              :options="orgInfoConditionVOS"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'orgName',
                children: 'childOrgList',
                emitPath: false,
              }"
              clearable
              filterable
            />
          </el-form-item>
          <el-form-item>
            <el-cascader
              v-model="target.model.accountBelong"
              placeholder="请选择账号归属部门"
              :options="orgInfoConditionVOS"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'orgName',
                children: 'childOrgList',
                emitPath: false,
              }"
              clearable
              filterable
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <Wrap class="table-view m-t-16">
      <div class=" table-btn-view m-b-16">
        <el-button
          v-log
          type="primary"
          @click="addAccount"
        >添加我的账号</el-button>
        <el-tooltip class="item" :disabled="showBatchBtn" effect="dark" content="请选择要修改的账号" placement="top">
          <span>
            <el-button class="m-l-12" type="primary" :disabled="!showBatchBtn" @click="handleBatchEdit">批量编辑</el-button>
          </span>
        </el-tooltip>
      </div>
      <el-table
        ref="accounts"
        v-loading="loading"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" />
        <el-table-column label="账号信息" width="200" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="accountStatus" label="账号当前状态" width="100">
          <template slot-scope="{ row }">
            {{ getAccountStatusName(row.accountStatus) }}
            <el-tooltip
              v-if="+row.accountStatus === 1"
              class="tooltip"
              :content="
                +row.delType === 0
                  ? '不是海盗账号'
                  : +row.delType === 1
                    ? '不再运营/注销账号'
                    : +row.delType === 2
                      ? `${row.delReason}`
                      : '暂无'
              "
              placement="top"
            >
              <span>
                <i class="iconfont el-icon-circle-close" />
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="粉丝总量">
          <template slot-scope="{ row }">
            {{ row.fansNum | toThousandsW }}
          </template>
        </el-table-column>
        <el-table-column prop="lastAddTime" width="180px">
          <template slot="header">
            最近一次发布时间
            <IconTip
              type="popover"
              content="若最近一次发布时间距离当前时间较长，可能是账号废弃或者被封"
              icon-class="iconwenhao"
            />
          </template>
          <template slot-scope="{ row }">
            {{ row.lastAddTime | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column
          class-name="mac-wrapper"
          width="180"
          prop="mcnName"
          label="MCN机构"
        >
          <template slot-scope="{ row }">
            <template v-if="row.mcnName">
              <AccountCard
                v-if="row.mcnAvatarUri"
                :info="{
                  accountName: row.mcnName,
                  accountImg: row.mcnAvatarUri,
                }"
              />
              <span v-else>{{ row.mcnName }}</span>
            </template>
            <template v-else> -- </template>
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称" />
        <el-table-column label="账号保管部门" prop="careOrgName">
          <template slot-scope="{ row }">
            {{ row.careOrgName || '--' }}
          </template>
        </el-table-column>
        <el-table-column label="账号归属部门" prop="accountBelong">
          <template slot-scope="{ row }">
            {{ row.accountBelong || '--' }}
          </template>
        </el-table-column>
        <el-table-column prop="operatorName" label="运营负责人">
          <template slot-scope="{ row }">
            {{ row.operatorName | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column label="绑定用户">
          <template slot-scope="{ row }">
            <div class="flex">
              <template v-if="row.bindUser">
                <div class="flex">
                  <div v-if="row.bindUser.split(',').length > 2" class="flex">
                    <div
                      v-for="(tag, index) in row.bindUser.split(',')"
                      :key="index"
                    >
                      <span
                        v-if="index < 2"
                      >{{ tag }}<i v-if="index <= 1">,</i></span>
                    </div>
                    <span>...</span>
                  </div>
                  <p v-else>
                    {{ row.bindUser }}
                  </p>
                </div>
              </template>
              <IconTip
                content="账号绑定记录"
                icon-class="iconlianxiren"
                @click="handleBindingRecord(row)"
              />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="102">
          <template slot-scope="s">
            <IconTip
              v-log="{
                accountName: s.row.accountName,
                accountId: s.row.accountId,
              }"
              content="查看"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
            />
            <IconTip
              v-if="+s.row.accountStatus !== 1"
              v-log="{
                accountId: s.row.accountId,
                accountName: s.row.accountName,
              }"
              content="编辑"
              icon-class="iconbianji"
              @click="handleEdit(s.row)"
            />
            <IconTip
              v-if="$permission('backend_account_count_delete') && +s.row.accountStatus !== 1"
              content="删除"
              class="delete"
              icon-class="el-icon-delete"
              @click="handleShowDeleteDialog(s.row)"
            />
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
    <account-dialog
      v-if="dialogStatus"
      :dialog-status.sync="dialogStatus"
      :plat-params="{ account_type: 7 }"
      :has-tip="false"
      :has-qianshuju="false"
      :has-demo="false"
      :save-ajax="addAjax"
      @success="getList"
    />
    <!-- 账号绑定记录 -->
    <BindDialog v-if="showRecords" v-model="showRecords" :row="row" />
    <EditDialog
      v-if="editVisible"
      v-model="editVisible"
      :row="row"
      :user-cards="userCards"
      :is-edit="isEdit"
      :org-info-condition-v-o-s="orgInfoConditionVOS"
      @success="getList"
      @handleRecords="handleBindingRecord"
    />

    <DeleteDialog
      :show="showDeleteDialog"
      :account-id="deleteAccountId"
      @close="handleCloseDeleteDialog"
      @confirm="handleConfirmDelete"
    />
    <EditBatchDialog
      v-if="showBatchEdit"
      v-model="showBatchEdit"
      :account-ids="selectedArr"
      :user-cards="userCards"
      :org-info-condition-v-o-s="orgInfoConditionVOS"
      @success="getList"
      @clearSelect="handleClearSelection"
    />
  </div>
</template>
<script>
import { Search, AccountCard, IconTip } from 'components'
import { useTableSort } from '@/hook'
import { computed, getCurrentInstance, reactive, ref, toRefs, watch } from '@vue/composition-api'
import { copy } from '@/utils'
import {
  $getAccountInventoryCondition,
  $getAccountInventoryList,
  $addAccountInventory,
  $getAccountAboutUserInfo,
  $getAccountAttribution
} from '@/api/account-manage'
import accountDialog from '../my-account/componnets/acconunt-dialog.vue'
import BindDialog from './_com/bind-dialog.vue'
import EditDialog from './_com/editDialog.vue'
import EditBatchDialog from './_com/editBatchDialog.vue'
import DeleteDialog from './_com/deleteDialog.vue'
import qs from 'qs'
import { getAccountStatusName } from './_com/hook'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
export default {
  components: {
    Search,
    IconTip,
    accountDialog,
    DeleteDialog,
    BindDialog,
    AccountCard,
    EditDialog,
    accountSelect,
    platformSelect,
    EditBatchDialog
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: true
    })
    const states = reactive({
      addAjax: $addAccountInventory,
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      platInfo: [],
      accountList: [],
      editVisible: false,
      dialogStatus: false,
      tableData: [],
      accountStatusList: [
        { val: 0, text: '用户绑定中' },
        { val: 1, text: '已删除' },
        { val: 2, text: '从未绑定' }
      ],
      total: 0,
      loading: false,
      orgInfoConditionVOS: [],
      bindUserList: [],
      showRecords: false,
      row: {},
      isEdit: false,
      userCards: [],
      showDeleteDialog: false,
      deleteAccountId: '',
      selectedArr: [],
      showBatchEdit: false
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
     const showBatchBtn = computed(() => {
        return !!states.selectedArr.length
      })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'operatorId',
          data: [],
          conf: {
            placeholder: '请选择运营负责人'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'bindUserId',
          data: [],
          conf: {
            placeholder: '请选择账号绑定人员'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'joinMcnFlag',
          data: [
            { joinMcnFlag: 1, McnName: '是' },
            { joinMcnFlag: 0, McnName: '否' }
          ],
          conf: {
            placeholder: '是否加入乾派MCN'
          },
          optionLabelKey: 'McnName',
          optionValKey: 'joinMcnFlag'
        },
        {
          type: 'select',
          key: 'joinMcnFlagCertification',
          data: [
            { joinMcnFlagCertification: 1, joinMcnName: '是' },
            { joinMcnFlagCertification: 0, joinMcnName: '否' }
          ],
          conf: {
            placeholder: '是否加入乾派MCN完成对公认证'
          },
          optionLabelKey: 'joinMcnName',
          optionValKey: 'joinMcnFlagCertification'
        },
        {
          type: 'input',
          key: 'phone',
          conf: {
            placeholder: '请输入手机号码',
            maxLength: 11
          }
        },
        {
          type: 'select',
          key: 'usePhoneUserId',
          data: [],
          conf: {
            placeholder: '请选择手机卡使用人'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'realCelebrityId',
          data: [],
          conf: {
            placeholder: '请选择实名人姓名'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'input',
          key: 'idCardNum',
          data: [],
          conf: {
            placeholder: '请输入实名人身份证号'
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const getSelfAccount = (id = '', model) => {
      emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $getAccountInventoryCondition({
        ...states.config,
        platId: id
      })
        .then((res) => {
          if (res.code === 1) {
            states.accountList = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const onChange = (val, item, type, index, model) => {}
    // 获取运营负责人 、 账号绑定人员 、 手机卡使用人 、 实名人姓名
    const getAccountAboutUserInfo = () => {
      $getAccountAboutUserInfo()
        .then((res) => {
          if (res.code === 1) {
            normalFormItemMap.bindUserId.data =
              normalFormItemMap.usePhoneUserId.data =
              normalFormItemMap.realCelebrityId.data =
              normalFormItemMap.operatorId.data =
                res.data || []
            states.userCards = res.data || []
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    }
    const getAccountAttribution = () => {
      $getAccountAttribution()
        .then((res) => {
          if (res.code === 1) {
            states.orgInfoConditionVOS = res.data
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    }
    const getList = function() {
      states.loading = true
      const params = copy(searchData.value)
      console.log(searchData.value)
      return $getAccountInventoryList({
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
    // 不选平台选择传belong_name
    // 选了平台有accountId的选项传accountId
    // 选了平台没accountId的选项传accountName
    const formatAccount = (data) => {
      const params = copy(data)
      if (params.platId) {
        if (params.accountName) {
          params.belongName = ''
          params.accountId = ''
        } else {
          params.belongName = ''
        }
      } else {
        if (params.belongName) {
          params.accountId = ''
          params.accountName = ''
        }
      }
      return params
    }
    const onSubmit = (data) => {
      const params = formatAccount(data)
      Object.assign(searchData.value, params)
      getList()
    }
    const onExport = (data) => {
      const params = formatAccount(data)
      Object.assign(searchData.value, params)
      window.open(
        `/api/account/inventory/exportInventory?${qs.stringify({
          ...searchData.value
        })}`
      )
    }

    const handleShowDeleteDialog = ({ accountId }) => {
      states.showDeleteDialog = true
      states.deleteAccountId = accountId
    }

    const handleCloseDeleteDialog = () => {
      states.showDeleteDialog = false
    }

    const handleConfirmDelete = () => {
      states.showDeleteDialog = false
      getList()
    }

    const addAccount = () => {
      states.dialogStatus = true
    }
    const handleEdit = (row) => {
      states.isEdit = true
      states.editVisible = true
      states.row = row
    }
    const handleShow = (row) => {
      states.isEdit = false
      states.editVisible = true
      states.row = row
    }
    const handleBindingRecord = (row) => {
      states.showRecords = true
      states.row = row
    }
    const handleSelectionChange = (val) => {
      states.selectedArr = [];
      (val || []).forEach(item => {
        states.selectedArr.push(item.accountId)
      })
    }
    const handleClearSelection = () => {
      states.selectedArr = []
    }

    const handleBatchEdit = () => {
      if (showBatchBtn.value) {
        states.showBatchEdit = true
      }
    }
    getAccountAboutUserInfo()
    getAccountAttribution()
    getSelfAccount()
    buildFormConf()
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
      getAccountStatusName,
      addAccount,
      handleShowDeleteDialog,
      handleCloseDeleteDialog,
      handleConfirmDelete,
      handleEdit,
      handleShow,
      handleBindingRecord,
      onChange,
      getSelfAccount,
      handleSelectionChange,
      handleClearSelection,
      handleBatchEdit,
      showBatchBtn
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .mac-wrapper {
    .account-card__image {
      height: 48px;
      width: 68px;
    }
  }

  .delete {
    i {
      color: #ff0000 !important;
    }
  }

  .tooltip {
    vertical-align: middle;

    i {
      color: #ff0000 !important;
    }
  }
}
</style>
