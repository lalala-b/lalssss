<template>
  <div>
    <Wrap class="search-view">
      <v-search
        ref="search"
        :config="formConf"
        :inline="true"
        @submit="onSubmit"
        @change="onSearchChange"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <departmentSelect v-model="searchData.orgId" :inline="true" />
          <platformSelect v-model="searchData.platId" :inline="true" :query="paramsConfig" @platChange="getAccountCondition(arguments[0], target.model)" />
          <accountSelect
            :inline="true"
            :list="accountList"
            :form="searchData"
            :has-account="true"
            :params="paramsConfig"
            :conf="{ allowCreate: false }"
          />
          <el-form-item label="粉丝量区间">
            <div class="flex">
              <el-input v-model="searchData.fansStart" type="number" placeholder="粉丝量最小值" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="searchData.fansEnd" type="number" placeholder="粉丝量最大值" />
            </div>
          </el-form-item>
        </template>
      </v-search>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <el-table
        ref="accounts"
        v-scrollbar
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="账号" width="240" align="left">
          <template slot-scope="{row}">
            <AccountCard :info="row" />
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称" />
        <el-table-column label="归属团队">
          <template slot-scope="{ row }">{{ row.dname }}-{{ row.fname }}</template>
        </el-table-column>
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom" width="146" />
        <el-table-column prop="fansIncrementNumWeek" label="近7日涨粉数" sortable="custom" width="130" />
        <el-table-column prop="addFansMonth" label="近30日涨粉数" sortable="custom" width="146" />
        <el-table-column prop="avgFlowWeek" label="近7天集均流量" sortable="custom" width="148" />
        <el-table-column prop="avgFlowMonth" label="近30天集均流量" sortable="custom" width="148" />
        <el-table-column label="操作">
          <template slot-scope="s">
            <div class="table-todo flex flex-justify-center">
              <IconTip
                v-if="hasShowBtn"
                v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }"
                icon-class="iconxiangqing"
                data-type="look"
                content="查看"
                @click="handleShow(s.row)"
              />
              <!-- <IconTip
                v-if="$permission('team_account_move')"
                v-log="{ accountId: s.row.accountId, accountName: s.row.accountName }"
                icon-class="iconinteration"
                data-type="move"
                content="移交"
                @click="handleMove(s.row)"
              /> -->
            </div>
            <!-- <el-link type="primary" :underline="false" @click="handleDel(s.row)">删除</el-link> -->
          </template>
        </el-table-column>
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
        />
      </div>
    </Wrap>
    <Wrap class="export-view m-t-16">
      <p class="export-title">一键导出各个账户筛选时间段内在全网发布视频的流量</p>
      <el-form ref="exp" :model="exp" :inline="true">
        <departmentSelect v-model="exp.orgId" :inline="true" />

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="exp.timerange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="doExport()">导出Excel</el-button>
        </el-form-item>
      </el-form>
    </Wrap>
    <el-dialog title="移交账号" :visible.sync="dialogVisible" width="30%" @close="handleMoveClose">
      <div class="move-account">
        <el-row>
          <el-col :span="6">平台：{{ editData.platName }}</el-col>
          <el-col :span="8">账号：{{ editData.accountName }}</el-col>
          <el-col :span="10">当前归属：{{ editData.dname }}-{{ editData.fname }}</el-col>
        </el-row>
        <el-row class="m-t-24">
          <el-col>
            <el-form ref="moveForm" inline :model="moveForm" :rules="moveFormRules">
              <!-- <el-form-item prop="typeId">
                <el-select v-model="moveForm.typeId" @change="dChange">
                  <el-option
                    v-for="item in moveFormOptions.typeId"
                    :key="item.id"
                    :value="item.val"
                    :label="item.text"
                  ></el-option>
                </el-select>
              </el-form-item>-->
              <el-form-item prop="d_id">
                <el-select v-model="moveForm.d_id" @change="getFOptions(true)">
                  <el-option
                    v-for="item in editData.orgType === 1 ? pirateOrgList : qianpaiOrgList"
                    :key="item.id"
                    :value="item.id"
                    :label="item.orgName"
                  />
                </el-select>
              </el-form-item>
              <el-form-item v-if="editData.orgType === 1" prop="f_id">
                <el-select v-model="moveForm.f_id">
                  <el-option
                    v-for="item in f_list"
                    :key="item.id"
                    :value="item.id"
                    :label="item.orgName"
                  />
                </el-select>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  toOptions,
  copy
} from '@/components/common'
import Search from '@/components/Search'
import AccountCard from '@/components/AccountCard'
import IconTip from '@/components/IconTip'

import mixin from '../bench-mark/_mods/mixin'
import tableMixin from '@/mixins/table'
import { $transferAccount, $getSysPlatAccount, $getTeamAccounts } from '@/api/account-manage'
import { $condition } from '@/api/video-manage'
import departmentSelect from '@/components/DepartmentSelect/index.vue'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import qs from 'qs'
import { $getRansferDTeam, $updateAccountBelong } from '@/api'

const SEARCH_MODEL = {
  platId: '',
  accountId: '',
  fansStart: '',
  fansEnd: '',
  pageNum: 0,
  size: 20,
  orgId: ''
}

export default {
  components: {
    'v-search': Search,
    departmentSelect,
    platformSelect,
    accountSelect,
    AccountCard,
    IconTip
  },
  mixins: [mixin, tableMixin],
  data() {
    return {
      paramsConfig: { methodId: 2, accountType: 1 },
      accountList: [],
      exp: {
        orgId: '',
        timerange: []
      },
      moveForm: {
        d_id: '',
        f_id: '',
        accountId: ''
      },
      moveFormRules: {
        d_id: [{ required: true, message: '请选择军', trigger: 'blur' }],
        f_id: [{ required: true, message: '请选择团', trigger: 'blur' }]
      },
      dialogVisible: false,
      dialogType: '',
      searchData: {
        ...SEARCH_MODEL
      },
      normalFormItemMap: {},
      formConf: {},
      allAccounts: [],
      total: 0,
      editData: {},
      departmentConfig: [],
      pirateOrgList: [],
      qianpaiOrgList: [],
      f_list: []
    }
  },
  computed: {
    hasShowBtn() {
      return true
    },
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
    this.buildFormConf()
    // this.getList()
    this.getDOptions()
  },
  methods: {
    handleEditSave(index, type) {
      const { moveForm } = this
      if (!moveForm.d_id) {
        this.$message('请选择团')
        return
      }

      const data = {
        accountId: moveForm.accountId,
        orgIdForD: moveForm.d_id,
        orgIdForF: moveForm.f_id
      }
      $updateAccountBelong(data).then((res) => {
        if (res.code === 1) {
          this.$message.success('修改成功')
          // this.getMutiBindAccounts()
          this.handleMoveClose()
          this.getList()
          this.$bus.$emit('upLog', { accountId: data.accountId, operation_module: '移交账号确定' })
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      })
    },
    /**
     * 移交账号获取列表
     */
    getDOptions() {
      $getRansferDTeam().then(res => {
        this.pirateOrgList = res.data.pirateOrgList
        this.qianpaiOrgList = res.data.qianpaiOrgList
      })
    },
    getFOptions(reset) {
      if (reset) {
        this.moveForm.f_id = ''
      }
      $getRansferDTeam({ orgId: this.moveForm.d_id }).then(res => {
        this.f_list = res.data.getListByOrgId
      })
    },
    getAccountCondition(id = '', model) {
      this.accountList = []
      this.$bus.$emit('platChange')
      this.searchData.accountId = ''
      this.searchData.belongName = ''
      this.searchData.accountName = ''
      $condition(
        {
          ...this.paramsConfig,
          platId: id
        }
      )
        .then(res => {
          this.accountList = res.data
        })
    },
    doExport() {
      const requestData = copy(this.exp)
      if (requestData.timerange && requestData.timerange.length) {
        requestData.beginDate = requestData.timerange[0] + ' 00:00:00'
        requestData.endDate = requestData.timerange[1] + ' 23:59:59'
        delete requestData.timerange
      } else {
        this.$message.error('请选择导出的时间范围')
        return
      }
      this.$bus.$emit('upLog', { operation_module: '导出Excel' })
      window.location.href = `/api/account/monitor/team/exportDataByOrgExcel?${qs.stringify(requestData)}&componentId=${this.$componentId}`
    },
    handleMoveClose() {
      this.moveForm = {
        d_id: '',
        f_id: ''
      }
      this.dialogVisible = false
    },
    moveConfirm() {
      this.$refs['moveForm'].validate(valid => {
        if (valid) {
          this.transferAccount()
        }
      })
    },
    async transferAccount() {
      const data = Object.assign(
        { accountId: this.editData.accountId },
        this.moveForm
      )
      const res = await $transferAccount(data)
      if (res.code === 1) {
        this.$message.success('移交成功')
        this.dialogVisible = false
        this.getList()
      }
    },
    addAccount() {
      this.dialogType = 'addVideoAccount'
    },
    handleShow(rowData) {
      if ([25, 26].includes(rowData.platId)) {
         this.$router.push({
          path: `/details/account/${rowData.platId}/${rowData.accountId}`,
          query: {
            _blank: true
          }
        })
      } else if (rowData.platId === 2) { // b站的用户详情信息
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
    async handleMove(rowData) {
      this.editData = JSON.parse(JSON.stringify(rowData))
      // this.moveFormOptions.d_id = await this.getDOptions()
      this.moveForm = {
        d_id: rowData.did,
        f_id: rowData.fid,
        accountId: rowData.accountId
      }
      if (this.editData.orgType === 1) {
        this.getFOptions(false)
      }
      this.dialogVisible = true
    },
    handleDel() {},
    /**
     * 搜索响应函数
     * @param  {Object}  data 搜索表单数据
     */
    onSubmit(data) {
      // const search = this.searchData
      // for (const key in data) {
      //   search[key] = data[key]
      // }
      // if (search.belongName) {
      //   search.accountId = ''
      //   search.accountName = ''
      // } else {
      //   if (search.accountName) {
      //     search.accountId = ''
      //   }
      // }
      this.searchData.pageNum = 1
      this.getList()
    },
    onExport() {
      window.location.href = `/api/account/monitor/team/exportTeamAccountExcel?${qs.stringify(this.searchData)}&componentId=${this.$componentId}`
    },
    async getPlatAccount({ platId = '', d_id = '', f_id = '', type_id = '' }) {
      const res = await $getSysPlatAccount({
        methodId: 1,
        platId,
        d_id,
        f_id
        // typeId
      })

      let accountList = []
      if (platId) {
        accountList = res.accounts
      } else {
        const accountMap = {}
        res.accounts.forEach(item => {
          if (item.belongName && !accountMap[item.belongName]) {
            accountMap[item.belongName] = true
            item.accountName = item.belongName
            accountList.push(item)
          }
        })
      }
      this.allAccounts = [...accountList]
      if (this.normalFormItemMap.accountId) {
        this.normalFormItemMap.accountId.data = toOptions(accountList, {
          valKey: 'accountId',
          textKey: 'accountName'
        })
      }

      if (this.normalFormItemMap.platId && !this.normalFormItemMap.platId.data.length) {
        this.normalFormItemMap.platId.data = toOptions(res.plat, {
          valKey: 'platId',
          textKey: 'platName'
        })
      }
    },
    getMoveData() {},
    processSearchDataChange(sData, fMap) {
      if (sData.platId) {
        if (fMap.video_type) {
          fMap.video_type.data = []
        }
        this.getHdListByPlat(sData.platId, sData.type_id, sData.d_id)
      }
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
      // switch (item.key) {
      //     case 'platId':
      //       this.normalFormItemMap.accountId.data = []
      //       this.searchData.accountId = ''
      //       model.accountId = ''
      //       break
      // }

    },
    getListData(query) {
      return $getTeamAccounts(query)
    },
    /**
     * 构造搜索配置
     */
    buildFormConf() {
      var normal = []
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        SEARCH_MODEL[item.key] = ''
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: this.$permission('team_account_export')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.export-view {
  margin-top: 20px;
  background-color: #fff;
  padding: 24px;
  .export-title {
    font-weight: 500;
    margin: 10px;
    font-size: 16px;
    color: #353535;
  }
}
.table-todo {
  ::v-deep {
    .iconfont {
      font-size: 19px;
    }
    [data-type="look"] {
      .iconfont {
        color: $--color-primary;
      }
    }
    [data-type="move"] {
      .iconfont {
        color: #F86E21;
      }
    }
  }
}
</style>
