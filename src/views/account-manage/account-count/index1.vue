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
        <template v-slot:prv="target">
          <platformSelect v-model="target.model.platId" :inline="true" :query="paramsConfig" @platChange="getAccountInventoryCondition(arguments[0], target.model)" />
          <accountSelect :inline="true" :no-ajax="true" :list="accountList" :form="target.model" :has-account="true" :params="paramsConfig" :conf="{ allowCreate: false }" />
          <el-select
            v-model="target.model.accountStatus"
            placeholder="请选择账号状态"
            class="m-r-16"
          >
            <el-option
              v-for="item in accountStatusList"
              :key="item.val"
              :label="item.text"
              :value="item.val"
            />
          </el-select>
          <el-cascader
            v-model="target.model.accountBelong"
            placeholder="请选择账号归属"
            class="m-r-10"
            :options="orgInfoConditionVOS"
            :props="{ checkStrictly: true, value: 'id', label: 'orgName', children: 'childOrgList', expandTrigger: 'hover' }"
            clearable
            filterable
          />
        </template>
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <div class="table-btn-view m-b-16">
        <el-button v-log type="primary" @click="addAccount">添加我的账号</el-button>
      </div>
      <el-table
        ref="accounts"
        v-scrollbar
        header-row-class-name="table-header"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column label="账号信息" width="120" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="accountStatus" label="账号状态" width="120px">
          <template slot-scope="{ row }">
            {{ getAccountStatusName(row.accountStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="粉丝总量" width="120px">
          <template slot-scope="{ row }">
            {{ row.fansNum|toThousandsW }}
          </template>
        </el-table-column>
        <el-table-column prop="lastAddTime" width="100px">
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
        <el-table-column prop="mcnName" label="mcn机构">
          <template slot-scope="{row}">
            <template v-if="row.mcnName">
              <AccountCard :info="{accountName:row.mcnName,accountImg:row.accountImg}" />
            </template>
            <template v-else>
              --
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称" />
        <el-table-column label="账号归属" prop="accountBelong" width="180px">
          <!-- <template slot-scope="{row}">
            {{}}
          </template> -->
        </el-table-column>
        <el-table-column prop="operatorName" label="运营负责人" />
        <el-table-column label="绑定用户" width="180px">
          <template slot-scope="{ row }">
            <template v-if="row.bindUser">
              <div class="flex">
                <div v-if="row.bindUser.split(',').length > 2" class="flex">
                  <div v-for="(tag,index) in row.bindUser.split(',')" :key="index"><span v-if="index<2">{{ tag }}<i v-if="index<=1">,</i></span></div>
                  <span>...</span>
                </div>
                <p v-else>
                  {{ row.bindUser }}
                </p>
                <IconTip
                  content="账号绑定记录"
                  icon-class="iconlianxiren"
                  @click="handleBindingRecord(row)"
                />
                <!-- <el-dropdown v-if="row.bindUser.split(',').length > 2">
                  <span class="el-dropdown-link">
                    {{ row.bindUser.split(',')[0] }}<i class="el-icon-arrow-down el-icon--right" />
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="tag in row.bindUser.split(',')" :key="tag">{{ tag }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
              </div>
            </template>
            <p v-else>无</p>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="platName" label="平台" width="180px" />
        <el-table-column prop="accountName" label="账号">
          <template slot-scope="s">
            <el-link
              v-if="s.row.accountLoginUrl"
              type="primary"
              :href="s.row.accountLoginUrl"
              target="_blank"
              :underline="false"
            >{{ s.row.accountName }}</el-link>
            <p v-else>{{ s.row.accountName }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" width="160px">
          <template slot-scope="{ row }">
            {{ row.phone || '--' }}
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width="140px" fixed="right">
          <template slot-scope="s">
            <IconTip
              v-log="{ accountId:s.row.accountId, accountName: s.row.accountName }"
              content="编辑"
              icon-class="iconbianji"
              @click="handleEdit(s.row)"
            />
            <IconTip
              v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
              content="查看"
              icon-class="iconxiangqing"
              @click="handleShow(s.row)"
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
    <!-- <el-dialog title="编辑账号" :visible.sync="editVisible" width="30%" :before-close="handleEditClose">
      <el-form
        ref="editForm"
        :model="editForm"
        :rules="rules"
      >
        <el-form-item label="平台">
          {{ editForm.platName }}
        </el-form-item>
        <el-form-item label="账号名">
          {{ editForm.accountName }}
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="editForm.phone" maxlength="11" placeholder="输入开通账号的手机号" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button v-log="{ accountId: editForm.accountId, accountName: editForm.accountName, operation_module: '编辑账号取消' }" @click="editVisible = false">取 消</el-button>
        <el-button v-log="{ accountId: editForm.accountId, accountName: editForm.accountName, operation_module: '编辑账号确定' }" type="primary" @click="handleEditConfirm">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 账号绑定记录 -->
    <BindDialog v-if="showRecords" v-model="showRecords" :row="row" />
    <EditDialog v-if="editVisible" v-model="editVisible" :row="row" :is-edit="isEdit" @success="getList" @handleRecords="handleBindingRecord" />
  </div>
</template>

<script>
import qs from 'qs'
import { Search, IconTip, AccountCard } from 'components'
import commonMixin from '../_com/commonMixin'
import tableMixin from '@/mixins/table'
import accountDialog from '../my-account/componnets/acconunt-dialog.vue'
import BindDialog from './_com/bind-dialog.vue'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import EditDialog from './_com/editDialog.vue'
import { $getAccountInventoryCondition, $getAccountInventoryList, $addAccountInventory, $getAccountAboutUserInfo, $getAccountAttribution } from '@/api/account-manage'

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
    IconTip,
    accountDialog,
    platformSelect,
    accountSelect,
    BindDialog,
    AccountCard,
    EditDialog
  },
  mixins: [tableMixin, commonMixin],
  data() {
    const MOBILE_REG_EXP = /^1\d{10}$/
    return {
      editVisible: false,
      dialogStatus: false,
      accountList: [],
      addAjax: $addAccountInventory,
      searchData: {
        pageNum: 1
      },
      paramsConfig: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      editForm: {
        accountId: '',
        belongName: '',
        platName: '',
        accountName: '',
        phone: ''
      },
      rules: {
        phone: {
          required: false,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value && !MOBILE_REG_EXP.test(value)) {
              callback(new Error('请输入正确的手机号'))
              return
            }
            callback()
          }
        }
      },
      normalFormItemMap: {},
      formConf: {},
      total: 0,
      accountStatusList: [
        { val: 0, text: '用户绑定中' },
        { val: 1, text: '已删除' },
        { val: 2, text: '从未绑定' }
      ],
      orgInfoConditionVOS: [],
      bindUserList: [],
      showRecords: false,
      row: {},
      isEdit: false
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
    }
  },
  watch: {
    'searchData.pageNum'(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.getList(newVal)
      }
    }
  },
  created() {
    this.getAccountAboutUserInfo()
// this.buildFormConf()
    // this.loadBaseSearchData()
    this.getAccountInventoryCondition()
    this.getAccountAttribution()
    this.getList()
  },
  methods: {
    getAccountStatusName(status) {
      switch (status) {
          case 0:
            return '已绑定'
          case 1:
            return '删除已绑定'
          case 2:
            return '从未绑定'
      }
    },
    /**
     * 加载表格数据
     * @param  {Number}  pageNum  加载的页面
     */
    getList(pageNum = 1) {
      this.loading = true
      const query = this.searchData
      this.getListData(query).then((re) => {
        // 新数据格式
        // if (re.code === 1) {
        this.tableData = re.data
        this.total = re.total
        // } else {
        //   this.$message.error(re.message)
        // }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    // handleAct() {},
    // async handleEditConfirm() {
    //   if (!this.editForm.belongName && !this.editForm.phone) {
    //     this.handleEditClose()
    //     return
    //   }

    //   var form = this.$refs['editForm']
    //   var validateResult
    //   try {
    //     validateResult = await form.validate()
    //   } catch (e) {
    //     validateResult = false
    //   }
    //   if (!validateResult) {
    //     return
    //   }
    //   const res = await $updateAccountInventory(this.editForm)
    //   if (res && res.code === 1) {
    //     this.$message.success('编辑成功')
    //     this.getList()
    //     this.handleEditClose()
    //   } else {
    //     console.log('出错了', res)
    //   }
    // },
    // handleEditClose() {
    //   this.editVisible = false
    // },
    addAccount() {
      this.dialogStatus = true
    },
    handleEdit(row) {
      for (const key in this.editForm) {
        this.editForm[key] = row[key] || ''
      }
      this.isEdit = true
      this.editVisible = true
      this.row = row
    },
    handleShow(row) {
      this.isEdit = false
      this.editVisible = true
      this.row = row
      // this.videoDialogData = Object.assign({ dialogType: 'adv' }, row)
      // this.dialogShow = true
    },
    handleBindingRecord(row) {
      this.showRecords = true
      this.row = row
      console.log(row)
    },
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      const search = this.searchData
      console.log('------1------', search)
      console.log('------2------', data)
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
      window.open(`/api/account/inventory/exportInventory?${qs.stringify(this.searchData)}`)
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
      return $getAccountInventoryList(query).then(res => res)
    },
    getAccountInventoryCondition(id = '', model) {
      this.$bus.$emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $getAccountInventoryCondition({
        ...this.paramsConfig,
        platId: id
      }).then(res => {
        this.accountList = res.data || []
      })
    },
    // 获取运营负责人 、 账号绑定人员 、 手机卡使用人 、 实名人姓名等信息接口
    async getAccountAboutUserInfo() {
      const res = await $getAccountAboutUserInfo()
      if (res.code === 1) {
        this.bindUserList = res.data || []
        this.buildFormConf()
      }
    },
    async getAccountAttribution() {
      const res = await $getAccountAttribution()
      if (res.code === 1) {
        this.orgInfoConditionVOS = res.data || []
      }
    },
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      var normal = [
        {
          type: 'select',
          key: 'operatorId',
          data: this.bindUserList,
          conf: {
            placeholder: '请选择运营负责人'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'bindUserId',
          data: this.bindUserList,
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
          data: this.bindUserList,
          conf: {
            placeholder: '请选择手机卡使用人'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'realCelebrityId',
          data: this.bindUserList,
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
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        SEARCH_MODEL[item.key] = ''
      })
      console.log('---', normal)
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
