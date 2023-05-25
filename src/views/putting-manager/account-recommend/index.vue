<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-10 18:24:35
 * @LastEditTime: 2020-12-25 17:50:21
 * @LastEditors: Linjie
-->
<template>
  <Wrap>
    <div class="recommend-title flex flex-justify-between flex-align-center">
      <p>适合投放的账号单击“添加为投放账号”按钮，暂时不合适但后续可能合作的账号单击“观望中”按钮，若达人类型不合适无法插入广告等完全不能合作的单击“不再推荐”按钮后续系统永久不再推荐。</p>
      <el-button type="text" icon="el-icon-refresh" size="mini" @click="getList">刷新</el-button>
    </div>
    <div class="flex flex-align-center  m-b-10">
      <p v-if="limitCount > 0" class="tip-red">当前剩余{{ limitCount }}个账号未反馈推荐结果！</p>
    </div>
    <div class="table-view">
      <el-table
        ref="flow"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        cell-class-name="table-cell"
        header-row-class-name="table-header"
      >
        <el-table-column align="left" label="账号信息" width="200" type="index">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="{imgUrl: 'userAvatar'}" />
          </template>
        </el-table-column>
        <el-table-column prop="tagName" label="内容主题" />
        <el-table-column prop="fansNum" label="粉丝数" />
        <el-table-column prop="nealy7dAddfans" label="近7日涨粉数" />
        <el-table-column prop="nealy30dAddfans" label="近30日涨粉数" />
        <el-table-column prop="nealy7ThumbUpAvg" label="近7日集均点赞" />
        <el-table-column prop="nealy30ThumbUpAvg" label="近30日集均点赞" />
        <el-table-column prop="nealy7dMedianThumbs" label="近7日点赞量中位数" />
        <el-table-column prop="nealy30dMedianThumbs" label="近30日点赞量中位数" />
        <el-table-column prop="cpm" label="CPM">
          <template slot="header">
            <IconTip
              icon-class="iconwenhao"
              content="预期CPM：数据来源为星图平台，每月更新一次，可能存在一定偏差，仅供参考，最新数据以星图平台的为准。"
              label="CPM"
            />
          </template>
          <template slot-scope="s">
            <div> {{ s.row.cpm | toThousands }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="s">
            <div class="table-todo-wrap">
              <el-link type="primary" @click="onDo(s.row, 'view')">查看详情</el-link>
              <el-link :type="s.row.refuseStatus === 2 ? 'info' :'primary'" @click="onDo(s.row, 'add')">添加为投放账号</el-link>
              <el-link :type="s.row.refuseStatus === 1 ? 'info' :'primary'" :disabled="s.row.refuseStatus === 2" @click="onDo(s.row, 'cancel')">不再推荐</el-link>
              <!-- <IconTip content="查看详情" icon-class="iconxiangqing" @click="onDo(s.row, 'view')" />
              <IconTip icon-class="icontoufang" content="添加为投放账号" @click="onDo(s.row, 'add')" />
              <IconTip icon-class="iconbuzaituijian_fill" content="不在推荐" :disabled="s.row.refuseStatus === 2" @click="onDo(s.row, 'cancel')" /> -->
              <el-link :type="s.row.refuseStatus === 3 ? 'info' :'primary'" :disabled="s.row.refuseStatus === 2 || s.row.refuseStatus === 3" @click="onDo(s.row, 'waitSee')">观望中</el-link>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="showMoreBtn" class="flex flex-justify-center m-t-24">
        <el-link type="primary" :underline="false" @click="hanldMore">查看更多账号</el-link>
      </div>
    </div>
    <!-- 添加为投放账号 -->
    <LaunchAccountDialog
      v-if="hasLaunchAccount"
      v-model="hasLaunchAccount"
      :data="editData"
      page-type="account-recommend"
      account-source-type="2"
      @success="handleAddSuccess"
    />
    <!-- 不再推荐 -->
    <CancelDialog
      v-if="hasCancel"
      v-model="hasCancel"
      :account-id="editAccountId"
      :refuse-id="refuseId"
      @updateTable="updateTable"
    />
    <!-- 需求提报 -->
    <DemandDiglog
      v-if="showDeman"
      v-model="showDeman"
      :data="editData"
      :source="demandSource"
      @success="getList"
      @handleBusinessDialog="handleBusinessDialog"
    />
    <BusinessLinePutDialog v-if="showBusinessLineDialog" v-model="showBusinessLineDialog" :account-id="dialogInfo.accountId" :business-line="dialogInfo.businessLine" :business-line-date="dialogInfo.businessLineDate" />
  </Wrap>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters } from 'vuex'
import { $getRecommendLimitInfo } from '@/api'
import { $getRecommendList } from '@/api/bussiness-manage'
import { $updateStatus } from '@/api/putting-manager'
import LaunchAccountDialog from './_components/LaunchAccountDialog'
import CancelDialog from './_components/cancel-dialog.vue'
import { AccountCard, IconTip } from 'components'
import DemandDiglog from '@/views/putting-manager/component/DemandDiglog.vue'

import './index.scss'

export default {
  components: {
    LaunchAccountDialog,
    CancelDialog,
    AccountCard,
    IconTip,
    DemandDiglog
  },
  data() {
    return {
      tableData: [],
      editAccountId: 0,
      refuseId: null,
      editData: {},
      hasCancel: false,
      hasLaunchAccount: false,
      showDeman: false,
      showMore: false,
      demandSource: 0,
      limitCount: 0,
      loading: true,
      dialogInfo: {},
      showBusinessLineDialog: false
    }
  },
  computed: {
    ...mapGetters(['user']),
    showMoreBtn() {
      return this.limitCount === 0 && !this.loading && this.showMore && this.tableData.length > 0
    }
  },
  created() {
    this.size = 5
    let hasClickRecommentdMore = localStorage.getItem('hasClickRecommentdMore')
    if (hasClickRecommentdMore) {
      hasClickRecommentdMore = JSON.parse(hasClickRecommentdMore)
      if (hasClickRecommentdMore.value && hasClickRecommentdMore.expires > dayjs().valueOf()) {
        this.showMore = false
        this.size = 20
      } else {
        this.showMore = true
      }
    } else {
        this.showMore = true
    }
    this.getList()
    if (this.user.userInfo.dailyQueryRecommendPuttingAccountFlag === 1) {
      this.minusLimit()
    }
  },
  methods: {
    hanldMore() {
      localStorage.setItem('hasClickRecommentdMore', JSON.stringify({
        expires: dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf(),
        value: true
      }))
      this.size = 20
      this.getList()
      this.showMore = false
    },
    handleDemandShow(target, event) {
      if (event.target.className !== 'demand-btn') return
      // this.accountInfo = row
      this.showDeman = true
    },
    onDo(row, type) {
      switch (type) {
          case 'view':
            // if (this.limitCount > 0 && this.user.userInfo.dailyQueryRecommendPuttingAccountFlag === 1) {
            //   this.$message.error(`当前剩余${this.limitCount}个账号未反馈推荐结果！请先完成推荐账号反馈。`)
            //   return
            // }
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
            if (row.refuseStatus === 2) {
              this.$message.info('该账号已添加过投放账号')
              return
            }
            this.editData = row
            this.editData.accountImg = row.userAvatar
            this.hasLaunchAccount = true
            break
          case 'cancel':
            this.editAccountId = row.accountId
            this.refuseId = row.refuseId
            this.hasCancel = true
            break
          case 'waitSee':
            this.handleWaitSee({ refuseId: row.refuseId })
            break
      }
    },
     // 观望中
    handleWaitSee({ refuseId }) {
      $updateStatus({ refuseId, refuseStatus: 3 }).then(res => {
        if (res.code === 1) {
          this.$message.success('操作成功')
          this.getList()
          this.minusLimit()
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
    async minusLimit() {
      const res = await $getRecommendLimitInfo()
      localStorage.setItem('recommendLimit', JSON.stringify({
        expires: dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf(),
        limit: res.data.count
      }))
      this.limitCount = res.data.count
      if (res.data.count === 0 && !this.hasShowTip) {
        this.hasShowTip = true
        this.$message.success('今日已完成全部推荐账号的反馈，请继续进行日常投放管理。')
      }
      // let recommendLimit = localStorage.getItem('recommendLimit')
      // recommendLimit && (recommendLimit = JSON.parse(recommendLimit))
      // if (recommendLimit) {
      //   recommendLimit.limit = recommendLimit.limit - 1
      //   localStorage.setItem('recommendLimit', JSON.stringify(recommendLimit))
      // }
    },
    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      $getRecommendList({ size: this.size }).then(res => {
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
    },

    updateTable() {
      this.getList()
      this.minusLimit()
    },

    handleAddSuccess() {
      const { accountName } = this.editData
      this.$message({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: `${accountName}添加成功，单击<a class="demand-btn">需求提报</a>填写提交需求信息！`,
        duration: 5000,
        type: 'success',
        onClick: this.handleDemandShow,
        onClose: this.minusLimit
      })
      this.getList()
    },
    handleBusinessDialog(val) {
      this.dialogInfo = val
      this.showBusinessLineDialog = true
    }

  }
}
</script>
<style lang="scss" scoped>
  .recommend-title {
    height: 60px;
    font-size: 16px;
    margin-top: -24px;
    p {
      font-size: 14px;
      color: $--color-danger;
    }
  }
</style>
