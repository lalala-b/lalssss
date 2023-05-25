<template>
  <div class="index">
    <Detail
      v-loading="summaryLoading"
      class="index-shadow"
      :summary="summary"
      :role-rang="roleRang"
    />
    <Banner class="m-t-20" />
    <!-- class="flex self-content m-t-12" -->
    <div v-if="$permission('proprietary_board')" class="my-board">
      <div v-if="$permission('my_operate_borad')" class="m-t-16">
        <MyOperating
          class="self-content-left index-shadow"
          :perform-months="performMonths"
        />
      </div>
      <div v-if="$permission('hero_borad')" class="m-t-16">
        <HeroesList
          class="self-content-right index-shadow"
          :perform-months="performMonths"
        />
      </div>
    </div>
    <template v-else>
      <div class="flex index-content m-t-20">
        <Ranking class="index-content-left index-shadow" />
        <Fans
          :loading="fansLoading"
          class="index-content-right index-shadow"
          :fanslist="fansRankList"
        />
      </div>
    </template>
    <Article class="index-shadow m-t-20" :list="articleList" />

    <el-dialog
      :visible.sync="showOverModal"
      title="账号提醒"
      width="30%"
      append-to-body
      :before-close="overModalClose"
    >
      <p class="overaccount-title">
        以下账号过期失效无法更新，请尽快重新绑定。
      </p>
      <div class="overaccount-content">
        <div v-for="item in overAccounts" :key="item.accountId" class="account">
          <AccountCard :info="item" class="m-t-10" />
          <!-- <img :src="item.accountImg" alt>
          {{ item.platName }}-{{ item.accountName }} -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overModalClose">忽略</el-button>
        <el-button type="primary" @click="goToAccountM">去绑定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      v-if="notificationList.length"
      :class="['notification', notificationList[activeIndex].notificationType !== 0 && 'specialNotification']"
      :visible.sync="showNotificationDialog"
      width="calc(100vw - 440px)"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <!-- 富文本 -->
      <div v-if="+notificationList[activeIndex].notificationType === 0" class="dialog">
        <div class="dialogBody">
          <div v-html="notificationList[activeIndex].notificationContent" />
        </div>
      </div>

      <!-- 图片 -->
      <div v-if="+notificationList[activeIndex].notificationType === 1">
        <img class="notificationImg" :src="notificationList[activeIndex].notificationContent">
      </div>

      <!-- 视频 -->
      <div v-if="+notificationList[activeIndex].notificationType === 2">
        <video class="notificationVideo" :src="notificationList[activeIndex].notificationContent" controls />
      </div>

      <span class="dialogFooter">
        <el-button
          v-if="notificationList[activeIndex].notificationUrl"
          :disabled="notificationList[activeIndex].time > 0"
          class="m-l-8"
          type="primary"
          @click="() => goDetail(notificationList[activeIndex].notificationUrl)"
        >查看详情</el-button>
        <el-button
          :disabled="notificationList[activeIndex].time > 0"
          @click="handleCloseNotification(activeIndex)"
        >{{
          notificationList[activeIndex].time > 0
            ? `${notificationList[activeIndex].time}秒后可关闭`
            : '关闭'
        }}</el-button>
      </span>
      <!-- <el-carousel
        indicator-position="none"
        :autoplay="false"
        height="500px"
        :arrow="notificationList[activeIndex].time > 0 ? 'never' : 'always'"
        @change="handleChangeCarousel"
      >
        <el-carousel-item
          v-for="(item, index) in notificationList"
          :key="item.id"
        >
          <div class="dialog">
            <div class="dialogBody">
              <div v-html="item.notificationContent" />

              <span class="dialogFooter">
                <el-button
                  v-if="item.notificationUrl"
                  :disabled="
                    activeIndex === index && item.time > 0
                  "
                  class="m-l-8"
                  type="primary"
                  @click="() => goDetail(item.notificationUrl)"
                >查看详情</el-button>
                <el-button
                  :disabled="
                    activeIndex === index && item.time > 0
                  "
                  @click="handleCloseNotification(index)"
                >{{
                  item.time > 0 ? `${item.time}秒后可关闭` : '关闭'
                }}</el-button>
              </span>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel> -->
    </el-dialog>

    <el-dialog
      :visible.sync="showBindFeishuDialog"
      title="飞书绑定通知"
      width="30%"
      append-to-body
      class="feishu"
      :close-on-click-modal="false"
      :before-close="handleCloseBindFeishu"
    >
      <p class="overaccount-title m-b-24">
        当前账号与飞书账号匹配不成功，将影响你接收飞书消息，系统将自动为你重新绑定，请手动选择属于你自己的飞书账号
      </p>
      <div class="overaccount-content">
        <el-cascader
          ref="feishuCascader"
          v-model="feishuDepartmentId"
          class="feishuCascader"
          :options="feishuDepartmentList"
          :props="{
            expandTrigger: 'hover',
            value: 'nodeOpenId',
            label: 'nodeName',
            children: 'feishuBindTreeVO',
          }"
          filterable
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCloseBindFeishu">关闭</el-button>
        <el-button
          type="primary"
          :loading="bindFeishuLoading"
          @click="handleBindFeishu"
        >确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Detail from './_component/Details.vue'
import Article from './_component/Articles.vue'
import Ranking from './_component/Ranking'
import Fans from './_component/Fans'
import Banner from './_component/Banner.vue'
import MyOperating from './_component/MyOperating/MyOperating.vue'
import HeroesList from './_component/HeroesList/HeroesList.vue'
import { AccountCard } from 'components'
import * as IndexRequest from '@/api/home'
import { $getFeishuDepartmentList, $bindFeishuDepartment } from '@/api'
import { $getHomeNotification } from '@/api/popover-manage'
import { $getBillboardIncreaseFans } from '@/api/pirate'
import { date } from '@/components/common'
export default {
  components: {
    Detail,
    Article,
    Ranking,
    AccountCard,
    Fans,
    Banner,
    MyOperating,
    HeroesList
  },
  data() {
    return {
      articleList: [], // 热门文章
      skillList: [], // 运营技巧
      selectedAccountList: [], // 精选账号
      noticesList: [], // 公告消息
      advertiseCaseList: [], // 广告案例
      contentList: [], // 内容创作
      fansRankList: [], // 粉丝排名
      summary: {
        img: '',
        items: []
      },
      fansLoading: false,
      overAccounts: [], // 过期账号
      showOverModal: false,
      summaryLoading: false,
      roleRang: null, // 1-海盗 2-乾派
      performMonths: [],
      notificationList: [],
      showNotificationDialog: true,
      activeIndex: 0,
      showBindFeishuDialog: false,
      feishuDepartmentList: [],
      feishuDepartmentId: '',
      bindFeishuLoading: false
    }
  },
  async created() {
    this.getList()
    // this.listNoticeAndOperSkill()
    // this.listContent()
    this.getListStatistics()
    this.getOverAccounts()
    this.getNewFans()
    this.getPerformanceMonth()
    await this.getHomeNotification()
    this.$nextTick(() => {
      const { orgType, feishuUserId } =
        ((this.$store.state || {}).user || {}).userInfo || {}
      // 没绑定飞书账号 需要弹出弹窗绑定
      if (orgType !== 1 && !feishuUserId) {
        this.getFeishuDepartmentList()
      }
    })
  },

  methods: {
    // 获取统计
    async getListStatistics() {
      try {
        this.summaryLoading = true
        const res = await IndexRequest.$getListStatistics()
        if (res.code === 1) {
          // this.areas.summary.items =
          this.roleRang = res.data.roleRang
          const items = []
          const {
            accountInfo,
            fansInfo,
            mouthAddFanInfo,
            mouthFlowInfo,
            mouthPublishContentInfo
          } = res.data
          items.push({
            text: '管理账号数量',
            all: accountInfo.allAccountNum,
            kuai: accountInfo.kuaishouAccountNum,
            tiktok: accountInfo.tiktokAccountNum
          })
          items.push({
            text: '账号累计粉丝',
            all: fansInfo.allAccountFansNum,
            kuai: fansInfo.kuaishouAccountFansNum,
            tiktok: fansInfo.tiktokAccountFansNum
          })
          items.push({
            text: '月新增粉丝',
            all: mouthAddFanInfo.allAccountMonthAddFansNum,
            kuai: mouthAddFanInfo.kuaishouAccountMonthAddFansNum,
            tiktok: mouthAddFanInfo.tiktokAccountMonthAddFansNum
          })
          items.push({
            text: '月发布内容',
            all: mouthPublishContentInfo.allMonthPublishNum,
            kuai: mouthPublishContentInfo.kuaishouMonthPublishNum,
            tiktok: mouthPublishContentInfo.tiktokMonthPublishNum
          })
          items.push({
            text: '月流量',
            all: mouthFlowInfo.allMonthFlowNum,
            kuai: mouthFlowInfo.kuaishouMonthFlowNum,
            tiktok: mouthFlowInfo.tiktokMonthFlowNum
          })
          this.summary.items = items
          this.summary.img = res.data.imgUrl || 'http://media.qpmcn.com/qp1.png'
          this.summaryLoading = false
        } else {
          this.$message.error(res.message)
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.summaryLoading = false
      }
    },
    /**
     * 获取热门文章|广告案例|精选账号
     */
    async getList() {
      const params = {
        firstCate: 1,
        oulyPushed: 1,
        pageNum: 1,
        size: 6
      }
      try {
        const res = await IndexRequest.$list({
          articleStr: JSON.stringify(params)
        })
        if (res.code === 1) {
          this.articleList = res.data.articleList
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }
    },
    /**
     * 获取公告|运营技巧
     */
    // async listNoticeAndOperSkill() {
    //   const notice = {
    //     firstCate: 3,
    //     onlyPushed: 1,
    //     pageNum: 1,
    //     size: 3
    //   }
    //   const operSkill = {
    //     firstCate: 2,
    //     sencondCate: 0,
    //     onlyPushed: 1,
    //     pageNum: 1,
    //     size: 5
    //   }
    //   try {
    //     const res = await IndexRequest.$listNoticeAndOperSkill({
    //       noticeStr: JSON.stringify(notice),
    //       operSkillStr: JSON.stringify(operSkill)
    //     })
    //     if (res.code === 1) {
    //       this.noticesList = res.data.noticeList
    //       this.skillList = res.data.operSkillList
    //     }
    //   } catch (err) {
    //     if (err.__CANCEL__) {
    //       return
    //     }
    //     this.$message.error(err.message)
    //   }
    // },
    /**
     * 获取首页-内容创作
     */
    // async listContent() {
    //   try {
    //     const res = await IndexRequest.$listContent()
    //     if (res.code === 1) {
    //       this.contentList = res.data
    //     }
    //   } catch (err) {
    //     if (err.__CANCEL__) {
    //       return
    //     }
    //     this.$message.error(err.message)
    //   }
    // },
    /**
     * 获取日新增粉丝排名
     */
    async getNewFans() {
      try {
        this.fansLoading = true
        const yesterday = new Date().getTime() - 3600 * 1000 * 24 * 1
        const params = {
          pageNum: 1,
          size: 6,
          dateStart: date('Y-m-d', new Date(yesterday)),
          dateEnd: date('Y-m-d 23:59:59', new Date(yesterday)),
          queryFansType: 1,
          source: 1
        }
        const res = await $getBillboardIncreaseFans(params)
        if (res.code === 1) {
          this.fansRankList = res.data
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }
      this.fansLoading = false
    },
    getOverAccounts() {
      IndexRequest.$getExpireAccountTips()
        .then((res) => {
          if (res.code === 1) {
            res = res.data
            if (res.length) {
              this.overAccounts = res
              this.showOverModal = true
            }
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    },
    overModalClose() {
      this.showOverModal = false
    },
    goToAccountM() {
      this.$router.push({
        path: '/account-manage/my-account'
      })
    },
    getPerformanceMonth() {
      try {
        IndexRequest.$getPerformanceMonth().then((res) => {
          if (res.code === 1 && res.data) {
            this.performMonths = res.data
          }
        })
      } catch (error) {
        console.log(error)
      }
    },

    countdown() {
      const notificationList = [...this.notificationList]
      if (notificationList[this.activeIndex].time <= 0) return
      setTimeout(() => {
        notificationList[this.activeIndex].time =
          notificationList[this.activeIndex].time - 1
        this.notificationList = notificationList
        if (notificationList[this.activeIndex].time > 0) {
          this.$nextTick(() => {
            this.countdown()
          })
        }
      }, 1000)
    },

    async getHomeNotification() {
      const res = await $getHomeNotification()
      if (+res.code === 1) {
        const notificationList = res.data.map((item) => {
          const newItem = { ...item }
          if (newItem.notificationForceRead) {
            newItem.time = 3
          } else {
            newItem.time = 0
          }
          return newItem
        })

        this.notificationList = notificationList

        this.$nextTick(() => {
          if (
            notificationList[this.activeIndex] &&
            notificationList[this.activeIndex].time > 0
          ) {
            this.countdown()
          }
        })
      }
    },

    goDetail(url) {
      window.open(`//${url}`)
    },
    handleCloseNotification(index) {
      const notificationList = [...this.notificationList]

      // 最后一个
      if (index === notificationList.length - 1) {
        this.activeIndex = 0
      }

      notificationList.splice(index, 1)
      if (!notificationList.length) {
        this.showNotificationDialog = false
      }
      this.notificationList = notificationList
      this.$nextTick(() => {
        this.countdown()
      })
    },

    handleChangeCarousel(index) {
      this.activeIndex = index
      this.$nextTick(() => {
        this.countdown()
      })
    },

    async getFeishuDepartmentList() {
      const { code, data } = await $getFeishuDepartmentList()
      if (+code === 1) {
        this.feishuDepartmentList = data
        this.$nextTick(() => {
          this.showBindFeishuDialog = true
        })
      }
    },

    handleCloseBindFeishu() {
      this.showBindFeishuDialog = false
    },

    async handleBindFeishu() {
      if (this.$refs.feishuCascader.getCheckedNodes(true)[0].hasChildren) {
        this.$message.error('请选择你的飞书账号')
        return
      }

      try {
        this.bindFeishuLoading = true
        const { code, data } = await $bindFeishuDepartment({
          openId: this.$refs.feishuCascader.getCheckedNodes(true)[0].value
        })
        this.bindFeishuLoading = false
        if (+code === 1) {
          this.$message.success('发送成功')
          this.showBindFeishuDialog = false
        } else {
          this.$message.error(data)
        }
      } catch (e) {
        this.$message.error(e)
        this.bindFeishuLoading = false
      }
    }
  }
}
</script>
<style scoped lang="scss">
.index {
  &-content {
    align-items: stretch;
    &-left {
      flex: 1;
      width: 1026px;
    }
    &-right {
      flex: 0.54;
      width: 569px;
      margin-left: 24px;
    }
  }
  &-shadow {
    box-shadow: 0px 8px 12px 0px rgba(56, 123, 193, 0.1);
  }
}
.self {
  // &-content {
  //   align-items: stretch;
  //   // &-left {
  //   //   flex: 1;
  //   //   min-width: 584px;
  //   // }
  //   // &-right {
  //   //   flex: 1;
  //   //   min-width: 584px;
  //   //   // margin-left: 8px;
  //   //   height: 500px;
  //   // }
  // }
  &-shadow {
    box-shadow: 0px 8px 12px 0px rgba(56, 123, 193, 0.1);
  }
}
//英雄榜及我运营的账号背景样式
::v-deep {
  .my-board {
    .hero-bg:nth-child(1) {
      .p-icon {
        i {
          color: #f3c793;
        }
      }
      td {
        background: #fffbf8 !important;
      }
      .account {
        background: #fff1ea !important;
      }
    }
    .hero-bg:nth-child(2) {
      .p-icon {
        i {
          color: #a8dad1;
        }
      }
      td {
        background: #f5fbf4 !important;
      }
      .account {
        background: #e9f4e7 !important;
      }
    }
    .hero-bg:nth-child(3) {
      .p-icon {
        i {
          color: #7aa4e7;
        }
      }
      td {
        background: #f2f7fd !important;
      }
      .account {
        background: #e1eaf6 !important;
      }
    }
    .el-table__header {
      th {
        background: #f8f8f8 !important;
      }
    }
  }
}

.notification {
  z-index: 2090 !important;

  .notificationImg {
    width: 100%;
    height: 100%;
    position: absolute;
    object-fit: contain;
  }

  .notificationVideo {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  ::v-deep {
    .el-dialog {
      height: calc(100vh - 280px);
      margin-top: 110px !important;
    }

    .el-dialog__header {
      padding: 0 !important;
      border: none;
    }

    .el-dialog__body {
      padding: 0 !important;
      height: 100%;
    }
  }
}

.specialNotification {
  ::v-deep {
    .el-dialog {
      background: none;
      border: none;
      box-shadow: none;
    }
  }
}

// .feishu {
//   z-index: 2190 !important;
// }

.dialogHeader {
  padding: 16px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.09);
  font-size: 16px;
  font-weight: bold;
}

.dialogBody {
  padding: 34px 54px;
  height: 100%;
  overflow-y: auto;
}

.dialog {
  position: relative;
  height: 100%;
}

.dialogFooter {
  position: absolute;
  bottom: -40px;
  right: 0px;
  left: 0;
  margin: auto;
  display: flex;
  flex-direction: row-reverse;
  width: fit-content;
  margin: auto;
}

.feishuCascader {
  width: 100%;
}
</style>
