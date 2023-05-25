<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-02 20:25:48
 * @LastEditTime: 2020-12-14 17:12:20
 * @LastEditors: Linjie
-->

<template>
  <Wrap>
    <v-search
      ref="search"
      :config="formConf"
      @submit="onSubmit"
      @change="onSearchChange"
      @export="onExport"
    >
      <template slot="btns">
        <el-button type="primary" @click="addShow = true">添加关联账号</el-button>
      </template>
    </v-search>

    <el-table
      ref="flow"
      v-scrollbar
      v-loading="loading"
      :data="tableData"
      header-row-class-name="table-header"
      @sort-change="doSort"
    >
      <el-table-column align="left" prop="accountName" label="账号名" width="200">
        <template slot-scope="{ row }">
          <AccountCard :info="row" />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="fansNum" label="粉丝量" sortable="custom" />
      <el-table-column align="center" prop="addFansWeek" label="近7日涨粉数" sortable="custom" />
      <el-table-column align="center" prop="addFansMonth" label="近30日涨粉数" sortable="custom" />
      <el-table-column align="center" prop="avgLikeWeek" label="近7日集均点赞量" sortable="custom" width="144px" />
      <el-table-column align="center" prop="avgLikeMonth" label="近30日集均点赞量" sortable="custom" width="144px" />
      <el-table-column align="center" prop="nealyWeekMedianThumbs" label="近7日集点赞量中位数" sortable="custom" width="144px" />
      <el-table-column align="center" prop="nealyMonthMedianThumbs" label="近30日集点赞量中位数" sortable="custom" width="144px" />
      <el-table-column align="center" label="操作">
        <template slot-scope="{row}">
          <IconTip content="查看详情" icon-class="iconxiangqing" @click="goDetail(row)" />
        </template>
      </el-table-column>
    </el-table>
    <div class="pagenation-view m-t-24">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :page-size="searchData.size"
        :hide-on-single-page="true"
        :total="total"
        :current-page.sync="searchData.pageNum"
        @current-change="getList"
      />
    </div>
    <addAccount :status.sync="addShow" @success="getList(1)" />
  </Wrap>
</template>
<script>
import AccountCard from '@/components/AccountCard'
import Search from '@/components/Search'
import table from '@/mixins/table'
import addAccount from './addAccount'
import { packApi } from '@/http'
import { copy, objectMerge } from '@/utils'
import { $getContendAccountList, $getAccountList } from '@/api/contend'
import IconTip from '@/components/IconTip'

export default {
  components: {
    VSearch: Search,
    AccountCard,
    addAccount,
    IconTip
  },
  mixins: [table],
  props: {
    fansRange: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      formConf: {},
      searchData: {
        size: 20,
        pageNum: 1
      },
      addShow: false
    }
  },
  watch: {
    fansRange(val) {
      this.normalFormItemMap.fansRange.data = val
    }
  },
  created() {
    this.$bus.$on('centendChange', (competeName) => {
      this.searchData.competeName = competeName
      this.searchData.pageNum = 1
      this.searchData.accountName = ''
      this.getList()
      this.getAccountList(competeName)
    })
    this.buildFormConf()
    // this.getList()
  },
  methods: {
    buildFormConf() {
      var normal = [
        {
          type: 'select',
          key: 'accountName',
          data: [],
          conf: {
            placeholder: '请选择账号名'
          },
          optionValKey: 'accountName',
          optionLabelKey: 'accountName'
        },
        {
          type: 'select',
          key: 'fansRange',
          data: [],
          conf: {
            placeholder: '粉丝量'
          },
          optionValKey: 'dictValue',
          optionLabelKey: 'dictLabel'
        }
      ]
      var normalFormItemMap = {}
      normal.forEach(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
      })
      this.normalFormItemMap = normalFormItemMap
      this.formConf = {
        normal,
        hasExport: false
      }
    },
    getList(pageNum) {
      this.loading = true
      const parmas = copy(this.searchData)
      pageNum && (parmas.pageNum = pageNum)
      packApi($getContendAccountList, parmas).then(res => {
        this.tableData = res.data
        this.total = res.total
      }).finally(() => {
        this.loading = false
      })
    },
    getAccountList(competeName) {
      $getAccountList({ type: 2, competeName }).then(res => {
        if (res.code === 1) {
          this.normalFormItemMap.accountName.data = res.data || []
        }
      })
    },
    onSubmit(data) {
      data = copy(data)
      this.searchData = objectMerge(this.searchData, data)
      this.searchData.pageNum = 1
      this.getList()
    },
    onSearchChange() {},
    onExport() {},
    goDetail(row) {
      const { accountId, accountType, platId } = row
      if (!accountId) return
      console.log(row)

      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          accountType,
          _blank: true
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .pagenation-view {
    text-align: center;
  }
  .table-header {
    color: rgb(48, 49, 51);
    font-size: 14px;
    font-weight: 500;
    text-align: center;
  }
</style>
