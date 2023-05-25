<template>
  <div>
    <Wrap class="B-personAccount search-view">
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

        <el-form-item class="M-benchmarkPersonalSearchRange">
          <div class="flex">
            <el-input v-model="searchData.fansStart" type="number" min="0" placeholder="粉丝数大于多少" />
            <span class="m-r-5 m-l-5">至</span>
            <el-input v-model="searchData.fansEnd" type="number" min="0" placeholder="粉丝数小于多少" />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button v-log type="primary" data-burry_btn_name="search" @click="handleSearch">查询</el-button>
          <el-button v-log @click="handleExport(2)">导出</el-button>
        </el-form-item>
      </el-form>
    </Wrap>
    <Wrap class="m-t-16">
      <div class="table-view">
        <div class="flex m-b-24">
          <el-button v-log type="primary" @click="onAddPersonalAccount">添加对标账号</el-button>
          <el-button v-log type="primary" plain @click="onImport">批量导入账号</el-button>
        </div>
        <el-table
          ref="accounts"
          v-scrollbar
          v-loading="loading"
          :data="tableData"
          header-row-class-name="table-header"
          @sort-change="doSort"
        >
          <el-table-column prop="accountName" label="账号名" width="200" align="left">
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
                  content="查看"
                  icon-class="iconxiangqing"
                  @click="handleShow(s.row)"
                />
                <IconTip
                  v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
                  content="修改标签"
                  icon-class="iconbianji"
                  @click="onModifyTags(s.row)"
                />
                <IconTip
                  v-log="{ accountName: s.row.accountName, accountId: s.row.accountId }"
                  content="删除"
                  icon-class="iconshanchu"
                  @click="delAccount(s.row)"
                />
              </div>
            </template>
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
      </div>
      <v-del
        v-if="dialogStatus.del"
        :userid="searchData.user_id"
        :subject="dialogData.del"
        :status.sync="dialogStatus.del"
        @del="onDelConfirm"
      />
      <v-auth
        v-if="dialogStatus.auth"
        :userid="searchData.user_id"
        :status.sync="dialogStatus.auth"
        @success="addAccountSuccess"
      />
      <v-tags
        v-if="dialogStatus.tags"
        v-model="dialogStatus.tags"
        :userid="searchData.user_id"
        :subject="dialogData.tags"
        :status="dialogStatus.tags"
        @update="getList"
      />

      <v-import-acounts :show="importDrawerStatus" :config="importConf" @close="onImportClose" @success="getList" />
    </Wrap>
  </div>
</template>
<script>
import mixin from '../_mods/mixin'
import manageMixin from '../_mods/manage-mixin'
import importAcounts from '@/components/ImportAcounts'
import { $getListData } from '@/api/account-manage'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import { $condition } from '@/api/video-manage'
import { $getCondition } from '@/api/video-manage'
import { AccountCard, IconTip } from 'components'

export default {
  name: 'ManagePersonalAccounts',
  components: {
    vImportAcounts: importAcounts,
    platformSelect,
    accountSelect,
    AccountCard,
    IconTip
  },
  mixins: [mixin, manageMixin],
  data() {
    return {
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
      tagValues: [],
      paramsConfig: { accountType: 2, methodId: 1 },
      accountList: [],
      types: {
        tagValues: []
      },
      searchData: {
        accountId: '',
        platId: '',
        note: '',
        fansStart: '',
        fansEnd: '',
        pageCount: 20,
        queryType: 1,
        accountType: 2
      },
      methodId: 2,
      importDrawerStatus: false,
      importConf: {
        methodId: 2,
        tplFile: '/static/files/personal_accounts_import_tpl.xls',
        title: '导入对标账号'
      },
      pageBurryType: 'beach_marking'
    }
  },
  created() {
  // if (false) {
  // this.getPlatAndUser();
  // } else {
    // this.getSelectAccount()
    this.getTags()
    // 非 mcn 用户可以直接加载数据
    this.getCondition()
    this.getList()
  // }
  },
  methods: {
    addAccountSuccess() {
      this.onSearchChange()
      this.getList()
    },
    async getCondition() {
      const res = await $getCondition({
        ...this.paramsConfig
      })
      if (res.code === 1) {
        this.types.tagValues = res.data.tagValues
      }
    },
    async onSearchChange(platId) {
      this.$bus.$emit('platChange')
      const res = await $condition({
        ...this.paramsConfig,
        platId
      })
      if (res.code === 1) {
        this.accountList = res.data
      }
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
      query.methodId = 1
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
    onAddPersonalAccount() {
      this.onAddAccount()
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
</style>
