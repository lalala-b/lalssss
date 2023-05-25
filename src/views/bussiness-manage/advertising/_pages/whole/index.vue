<template>
  <div class="P-advertisingWhole">
    <div class="P-advertisingWholeCon">
      <div class="P-advertisingWholeSearch">
        <el-form :inline="true" :model="searchData">
          <el-form-item>
            <el-select
              v-model="searchData.accountId"
              placeholder="请输入账号"
              filterable
              remote
              clearable
              :loading="searchLoading"
              :remote-method="onSearchAccounts"
            >
              <el-option
                v-for="item in accountData"
                :key="item.val"
                :label="item.text"
                :value="item.val"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input v-model="searchData.title" clearable placeholder="请输入标题" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              clearable
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading">
        <div class="P-advertisingWholeTable">
          <el-table
            ref="flow"
            v-scrollbar
            v-loading="loading"
            :data="tableData"
            header-row-class-name="P-advertisingWholeTableHead"
            row-class-name="P-advertisingWholeTableRow"
            @sort-change="doSort"
          >
            <el-table-column
              v-if="hasSelection"
              type="selection"
            />
            <el-table-column
              prop="platName"
              label="标题"
              width="333"
            >
              <el-link
                :type="(s.row.isDeleted || s.row.url === '') ? 'info' : 'primary'"
                :href="s.row.url"
                :disabled="s.row.url === ''"
                target="_blank"
                :underline="false"
              >{{ s.row.isDeleted === 1 ? '(已删除)' : '' }}{{ s.row.titleName }}</el-link>
            </el-table-column>

            <el-table-column
              prop="accountName"
              label="账号"
            />

            <el-table-column
              prop="flowCount"
              label="总流量"
              sortable="custom"
            />
            <el-table-column
              prop="thumbUpCount"
              label="点赞量"
              sortable="custom"
            />

            <el-table-column
              prop="commentCount"
              label="评论量"
              sortable="custom"
            />
            <el-table-column
              prop="forwardedCount"
              label="转发量"
              sortable="custom"
            />

            <el-table-column
              prop="addTime"
              label="发布时间"
              width="170px"
            />
            <el-table-column
              prop="update_time"
              label="更新时间"
            />
            <template v-if="hasCase">

              <el-table-column
                label="广告"
              >
                <template slot-scope="s">
                  <el-select
                    v-if="s.row.advId === 1 && hasAdv"
                    v-model="s.row.advId"
                    placeholder="请选择"
                    @change="detailChangeAdv(s.row)"
                  >
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                  </el-select>
                  <div v-else>{{ ADV_MAP[s.row.advId] }}</div>
                </template>
              </el-table-column>
              <el-table-column
                label="案例"
              >
                <template slot-scope="s">
                  {{ s.row.lebal }}
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="140"
              >
                <template slot-scope="s">
                  <el-button
                    v-if="s.row.advId === 1 && hasCase"
                    type="primary"
                    @click="doSet(s.row)"
                  >{{ s.row.lebal ? "编辑案例" : "新增案例" }}</el-button>
                </template>
              </el-table-column>

            </template>
          </el-table>
        </div>
        <div v-if="total" class="P-advertisingWholeTablePager">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="nowPage"
          />
        </div>
      </div>
    </div>
    <v-case v-if="dialogData" :status.sync="caseDialogStatus" :subject="dialogData" />
  </div>
</template>
<script>
import Case from 'components'
import mixin from '../../_mods/mixin'
import { toOptions, checkFilterRule } from '@/components/common'

const ADV_MAP = {
  '1': '是',
  '0': '否'
}

export default {
  'mixins': [mixin],
  data() {
    return {
      'searchData': {
        'accountId': '',
        'title': '',
        'start': '',
        'end': '',
        'advId': 1,
        'determined': ''
      },
      'accountData': [],
      'searchLoading': false,
      'hasCase': false,
      'hasSelection': false,
      'caseDialogStatus': false,
      'dialogData': null,
      'selected': [],
      'total': 0,
      ADV_MAP
    }
  },
  'components': {
    'vCase': Case
  },
  created() {
    // 是否有案例操作
    this.hasCase = checkFilterRule(
      [
        { 'key': 'mrid', 'val': 1 },
        { 'key': 'action_id', 'val': 19, 'compute': '~' }
      ]
      , this.user
    )

    // 是否能标记广告
    this.hasAdv = checkFilterRule(
      [
        { 'key': 'mrid', 'val': 1 },
        { 'key': 'action_id', 'val': 4, 'compute': '~' }
      ]
      , this.user
    )

    // 是否要显示多选框
    this.hasSelection = Boolean(this.hasCase)
    this.getList(1)
  },
  'methods': {
    /**
         * 获取表格数据
         */
    getListData(query) {
      return this.$request({
        'url': '/getMarketVideos',
        query,
        'raw': true
      })
    },
    // 搜索
    onSubmit() {
      this.nowPage = 1
      this.getList(1)
    },
    // 输入搜索账号
    onSearchAccounts(accountName) {
      if (accountName) {
        this.searchLoading = true
        this.$request({
          'url': '/searchMarketAccount',
          'query': {
            accountName
          }
        })
          .then(
            re => {
              this.searchLoading = false
              if (re) {
                this.accountData = toOptions(
                  re
                  , { 'valKey': 'accountId', 'textKey': 'accountName' }
                )
              }
            }
            , err => {
              this.searchLoading = false
            }
          )
      } else {
        this.accountData = []
      }
    },
    /**
         * 修改广告类型
         * @param  {Object}  row  要修改的数据
         */
    detailChangeAdv(row) {
      this.$request({
        'url': '/changeMarketCaseAdv',
        'data': {
          'flowId': row.flowId,
          'advId': row.advId
        },
        'method': 'post'
      })
        .then(
          re => {
            if (re) {
              this.$tip('修改成功', 'success')
            }
          }
          , err => {}
        )
        .catch(err => {
          console.error(err)
        })
    },
    /**
         * 绑定或编辑案例
         * @param  {Object}  row  要绑定的数据
         */
    doSet(row) {
      this.dialogData = row
      this.caseDialogStatus = true
    },
    /**
         * 表格选择响应函数
         * @param {Array} val 当前选中的数组
         */
    handleSelectionChange(val) {
      this.selected = val
    }
  }
}
</script>
