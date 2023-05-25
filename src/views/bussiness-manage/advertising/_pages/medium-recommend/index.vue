<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-10 18:24:35
 * @LastEditTime: 2020-12-25 17:50:21
 * @LastEditors: Linjie
-->
<template>
  <Wrap class="P-contents">
    <div class="table-view">
      <el-button v-log class="m-b-10" type="text" icon="el-icon-refresh" size="mini" @click="getList">刷新</el-button>
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column align="center" width="60" label="头像" type="index">
          <template slot-scope="{ row }">
            <img :src="row.userAvatar" alt="" style="width: 50px">
          </template>
        </el-table-column>
        <el-table-column prop="accountName" label="账号名" width="100" align="left">
          <template slot-scope="{ row }">
            <div>
              <a type="primary" :underline="false" target="_blank" :href="row.accountLoginUrl">{{ row.accountName }}</a>
              <a v-if="row.xingtuIndexUrl" class="m-l-5" :href="row.xingtuIndexUrl" underline="false" target="_blank">
                <svg-icon icon-class="xintu" />
              </a>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="tagName" label="内容主题" />
        <el-table-column prop="fansNum" label="粉丝数" sortable="custom" />
        <el-table-column prop="nealy7dAddfans" label="近7日涨粉数" sortable="custom" />
        <el-table-column prop="nealy30dAddfans" label="近30日涨粉数" sortable="custom" />
        <el-table-column prop="nealy7ThumbUpAvg" label="近7日集均点赞" sortable="custom" />
        <el-table-column prop="nealy30ThumbUpAvg" label="近30日集均点赞" sortable="custom" />
        <el-table-column prop="nealy7dMedianThumbs" label="近7日点赞量中位数" sortable="custom" />
        <el-table-column prop="nealy30dMedianThumbs" label="近30日点赞量中位数" sortable="custom" />
        <el-table-column prop="cpm" label="CPM" sortable="custom">
          <template slot="header">
            <el-popover
              placement="top-start"
              trigger="hover"
              width="300"
              content="预期CPM：数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
            >
              <div slot="reference">
                CPM
                <i class="el-icon-question" />
              </div>
            </el-popover>
          </template>
          <template slot-scope="s">
            <div> {{ s.row.cpm | toThousands }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template slot-scope="s">
            <el-link type="primary" @click="onDo(s.row, 'view')">查看详情</el-link>
            <el-link type="primary" @click="onDo(s.row, 'add')">添加为媒介账号</el-link>
            <el-link :type="s.row.refuseStatus === 1 ? '' :'primary'" @click="onDo(s.row, 'cancel')">不再推荐</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 不再推荐 -->
    <CancelDialog
      v-if="hasCancel"
      v-model="hasCancel"
      :account-id="editAccountId"
      :refuse-id="refuseId"
      from="recommend"
      @updateTable="getList"
    />
    <AddMediumAccount
      v-if="showDialog"
      v-model="showDialog"
      :account-id="editAccountId"
      :account-info="accountInfo"
      from="recommend"
      @update="getList"
    />
  </Wrap>
</template>
<script>
import tableMinx from '@/mixins/table'
import { $getMediumRecommendList } from '@/api/bussiness-manage'
import CancelDialog from '@/views/putting-manager/account-recommend/_components/cancel-dialog'
import AddMediumAccount from './AddMediumAccount'

export default {
  components: { CancelDialog, AddMediumAccount },
  mixins: [tableMinx],
  data() {
    return {
      searchData: {
        determined: ''
      },
      tableData: [],
      editAccountId: null,
      refuseId: null,
      editData: {},
      hasCancel: false,
      showDialog: false,
      accountInfo: {
        platName: '',
        accountImg: '',
        accountName: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onDo(row, type) {
      switch (type) {
          case 'view':
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
                path: `/dy-manage/details/${row.accountId}`,
                query: {
                  accountId: row.accountId,
                  accountName: row.accountName,
                  from: 'dy',
                  type: '1',
                  accountType: row.accountType,
                  _blank: true
                }
              })
            }
            break
          case 'add':
            this.editAccountId = row.accountId
            this.accountInfo = {
              platName: row.platName,
              accountImg: row.userAvatar,
              accountName: row.accountName
            }
            this.showDialog = true
            break
          case 'cancel':
            this.editAccountId = row.accountId
            this.refuseId = row.id
            this.hasCancel = true
            break
      }
    },
    /**
     * 获取列表数据
     */
    getList(pageNum = 1) {
      this.loading = true
      $getMediumRecommendList(this.searchData).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.loading = false
        this.$message.error(err.message)
      })
    }
  }
}
</script>
