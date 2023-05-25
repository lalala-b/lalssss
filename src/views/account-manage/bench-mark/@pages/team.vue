<template>
  <div class="B-teamAccount">
    <Wrap class="search-view">
      <el-form :model="searchData" :inline="true">
        <platformSelect v-model="searchData.platId" :inline="true" :query="paramsConfig" @platChange="onSearchChange(searchData.platId)" />
        <accountSelect :inline="true" :list="accountList" :form="searchData" :params="paramsConfig" />
        <el-form-item>
          <el-select v-model="searchData.tagValue" placeholder="请选择账号标签" filterable clearable>
            <el-option
              v-for="item in types.tagValues"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="flex">
            <el-input v-model="searchData.fansStart" type="number" min="0" placeholder="粉丝数大于多少" />
            <span class="m-r-5 m-l-5">至</span>
            <el-input v-model="searchData.fansEnd" type="number" min="0" placeholder="粉丝数小于多少" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button v-log type="primary" data-burry_btn_name="search" @click="handleSearch">查询</el-button>
          <el-button v-if="$permission('bench_mark_export')" v-log @click="handleExport(1)">导出</el-button>
        </el-form-item>
      </el-form>
    </Wrap>
    <Wrap v-loading="loading" class="table-view m-t-16">
      <el-table
        ref="accounts"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column prop="accountName" label="账号名" width="200">
          <template slot-scope="{row}">
            <AccountCard :info="row" :show-tags="false" />
          </template>
        </el-table-column>
        <el-table-column label="标签">
          <template slot-scope="s">
            <div class="tag-wrap">
              <el-tag v-for="tag in s.row.tagValue" :key="tag" class="tag ">{{ tag }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="fansNum" label="粉丝数" sortable="custom" />
        <el-table-column prop="fansIncrementNumWeek" label="近7日涨粉数" sortable="custom" />
        <el-table-column prop="addFansMonth" label="近30日涨粉数" sortable="custom" />
        <el-table-column label="操作">
          <template slot-scope="s">
            <div class="flex flex-justify-center">
              <IconTip
                v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
                content="添加为对标账号"
                icon-class="iconad"
                @click="handleAddToMark(s.row)"
              />
              <IconTip
                v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
                content="查看"
                icon-class="iconxiangqing"
                @click="handleShow(s.row)"
              />
            </div></template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="20"
          :total="total"
          :current-page.sync="nowPage"
        />
      </div>
    </Wrap>
    <v-del
      :userid="searchData.user_id"
      :subject="dialogData.del"
      :status.sync="dialogStatus.del"
      @del="onDelConfirm"
    />
    <v-auth :status.sync="dialogStatus.auth" :userid="searchData.user_id" @success="getList" />
    <v-tags
      :userid="searchData.user_id"
      :subject="dialogData.tags"
      :status.sync="dialogStatus.tags"
    />
    <v-import-acounts :show="importDrawerStatus" :config="importConf" @close="onImportClose" />

    <AddBenchMark v-if="showMarkDialog" v-model="showMarkDialog" :dialog-data="markDialogData" :save="handleAddBench" />
  </div>
</template>
<script>
import mixin from '../_mods/mixin'
import manageMixin from '../_mods/manage-mixin'
import { ImportAcounts, PlatformSelect, AccountSelect, AccountCard, IconTip, AddBenchMark } from 'components'
import { $condition, $getTeamCondition } from '@/api/video-manage'
import { $getListData, $postAddTeamBenkmark } from '@/api/account-manage'

export default {
  name: 'ManageBillboardAccounts',
  components: {
    AddBenchMark,
    vImportAcounts: ImportAcounts,
    PlatformSelect,
    AccountSelect,
    AccountCard,
    IconTip
  },
  mixins: [mixin, manageMixin],
  data() {
    return {
      showMarkDialog: false,
      markDialogData: {},
      tags: [],
      inputTag: '',
      paramsConfig: { accountType: 2, methodId: 2 },
      accountList: [],
      types: {
        tagValues: []
      },
      searchData: {
        user_id: 875,
        accountId: '',
        platId: '',
        tagValue: '',
        fansStart: '',
        fansEnd: '',
        pageCount: 20,
        queryType: 2,
        accountType: 2
      },
      importDrawerStatus: false,
      importConf: {
        methodId: 2,
        tplFile: '/static/files/billboard_accounts_import_tpl.xls',
        title: '导入对标账号',
        query: {
          user_id: 875
        }
      },
      methodId: 1,
      pageBurryType: 'beach_marking'
    }
  },
  computed: {
  // hasExport() {
  //   let rules = [1, 11, 12, 21, 31, 61, 62, 71, 81, 82, 84, 86];
  //   return rules.includes(this.user.mrid);
  // }
  },
  created() {
    this.getSelectAccount(false, 2)
    this.getTags()
    this.getList()
    this.getCondition()
  },
  methods: {
    async getCondition() {
      const res = await $getTeamCondition({
        ...this.paramsConfig
      })
      if (res.code === 1) {
        this.types.tagValues = res.data
      }
    },
    async onSearchChange(platId) {
      this.searchData.accountId = ''
      this.$bus.$emit('platChange')
      const res = await $condition({
        ...this.paramsConfig,
        platId
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
    },
    // 添加为对标账号
    handleAddToMark(row) {
      this.markDialogData = JSON.parse(JSON.stringify(row))
      this.showMarkDialog = true
    },
    // 确认设为对标账号
    handleAddBench({ tagValue }, fn) {
      const data = { ...this.paramsConfig }
      data.tagValue = tagValue.join(',')
      data.userUrl = this.markDialogData.authorUrl
      data.accountId = this.markDialogData.accountId
      $postAddTeamBenkmark(data).then((res) => {
        // console.log(res)
        if (res.code === 1) {
          this.$message.success(res.message)
          fn()
          this.getList()
          this.$bus.$emit('upLog', { accountId: data.accountId, accountName: this.markDialogData.accountName, operation_module: '添加对标账号确定' })
        } else {
          this.$message.error(res.message)
        }
      })
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
        this.$router.push({
          path: `/dy-manage/details/${rowData.accountId}`,
          query: {
            accountType: rowData.accountType,
            name: rowData.accountName,
            platId: rowData.platId || '',
            _blank: true
          }
        })
      }
    },
    // 获取表格数据
    getListData(query) {
      query.methodId = 2
      return $getListData(query)
        .then(re => {
          if (re.code === 1 && re.data) {
            // 预处理标签
            re.data.forEach(item => {
              if (item.tagValue) {
                item.tagValue = item.tagValue.split(',')
              }
            })
          }
          return re
        })
    },
    onAuthAdd(status) {
      if (status) {
        this.getList()
      }
    },
    /**
     * 打开上传界面
     */
    onImport() {
      this.importDrawerStatus = true
    },
    onImportClose() {
      this.importDrawerStatus = false
    },
    handleSearch() {
      this.onSearch()
    }
  }
}
</script>
<style scoped lang="scss">
::v-deep {
  .iconfont {
    font-size: 20px;
    color: $--color-primary;
  }
}
.tag{
  // margin-right: 10px;
  margin: 0 5px 10px;
}
.tag-wrap {
  margin: 0 0 -10px;
}
.input-new-tag {
  width: 100px;
}
</style>
