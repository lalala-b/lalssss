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
          <el-form-item>
            <el-cascader
              v-model="target.model.accountBelong"
              placeholder="请选择账号归属"
              class="m-r-10"
              :options="orgInfoConditionVOS"
              :props="{
                checkStrictly: true,
                value: 'id',
                label: 'orgName',
                children: 'childOrgList',
                emitPath: false,
                expandTrigger: 'hover'
              }"
              clearable
              filterable
            />
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
        <el-table-column prop="fansNum" label="总粉丝量" sortable="custom">
          <template slot-scope="{ row }">
            {{ row.fansNum | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="belongName" label="账号统一名称" width="136" />
        <el-table-column label="SOP类型" width="136">
          <template slot-scope="{ row }">
            {{ row.sopType|emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="belongTeam" label="账号归属">
          <template slot-scope="{ row }">
            {{ row.belongTeam | emptyFill }}
          </template>
        </el-table-column>
        <el-table-column prop="curOperatorName" label="运营负责人" />
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
  </div>
</template>
<script>
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { Search, AccountCard, IconTip } from 'components'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import { $getAccountInfo, $orgAccountList, $getAccountAboutUserInfo, $getAccountOrgList } from '@/api/operating-manage'

import { $getDataByDictType } from '@/api'
import { useTableSort } from '@/hook'
import { copy } from '@/utils'
import { commonData } from '../../_com/hooks.js'
import qs from 'qs'

export default {
  components: {
    Search,
    IconTip,
    AccountCard,
    accountSelect,
    platformSelect
  },
  setup(props, { emit }) {
    const { $message, $router, $permission } = getCurrentInstance().proxy
    const { formatAccount } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: $permission('team-opreate-export')
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
      editDialog: false,
      orgInfoConditionVOS: []
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
          key: 'sopType',
          data: [],
          conf: {
            placeholder: '请选择SOP类型'
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
    // 获取运营负责人
    const getAccountAboutUserInfo = () => {
      $getAccountAboutUserInfo()
        .then((res) => {
          if (res.code === 1) {
              normalFormItemMap.operatorId.data =
                res.data || []
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
        })
    }
     const getByDictSopType = () => {
      $getDataByDictType({
        dictTypes: ['haidao_sop_type']
      }).then(res => {
        if (res.data) {
          normalFormItemMap.sopType.data = res.data.haidao_sop_type || []
        }
      })
    }
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
    const getTreeData = (data) => {
      for (var i = 0; i < data.length > 0; i++) {
        if (data[i].childOrgList == null || data[i].childOrgList.length <= 0) {
          data[i].childOrgList = undefined
        } else {
          getTreeData(data[i].childOrgList)
        }
      }
      return data
    }
    const getAccountAttribution = () => {
      $getAccountOrgList()
        .then((res) => {
          if (res.code === 1) {
            states.orgInfoConditionVOS = getTreeData(res.data || [])
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
      return $orgAccountList({
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
        `/api/account/inventory/info/orgAccount/export?${qs.stringify({
          ...searchData.value
        })}`
      )
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
    // 排序
    const { doSort } = useTableSort(searchData.value, getList)
    buildFormConf()
    getByDictSopType()
    getAccountAboutUserInfo()
    getAccountAttribution()
    getSelfAccount()
    getList()
    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      ...toRefs(states),
      doSort,
      getList,
      handleGoDetail,
      getSelfAccount
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
