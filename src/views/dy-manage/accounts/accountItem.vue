<template>
  <div class="list-card flex">
    <div class="list-card__info">
      <AccountCard :info="info" :options="{accountUrl: 'authorUrl'}" :show-tags="false">
        <!-- <p class="user-info__id m-t-8">ID：<strong>{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</strong></p> -->
        <p v-if="(info.sysAccountTag || info.tagValue || info.tagName)" class="account-card__tag">
          <template v-if="info.sysAccountTag">
            <template v-for="item in info.sysAccountTag.split(',')">
              <el-tag v-if="item" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
            </template>
          </template>
          <template v-if="info.tagValue">
            <template v-for="item in info.tagValue.split(',')">
              <el-tag v-if="item" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
            </template>
          </template>
          <template v-if="info.tagName">
            <el-tag v-for="item in info.tagName.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>
        </p>
      </AccountCard>
      <p class="userInfoId m-t-8">ID：<strong>{{ info.uniqueId || info.eid || info.getDataUrl || '--' }}</strong></p>
      <el-popover
        v-if="info.accountProfile"
        placement="top"
        width="488"
        trigger="hover"
      >
        <div v-html="info.accountProfile" />
        <div slot="reference" class="user-info__profile text-over-hidden-2">
          简介：<span v-html="info.accountProfile" />
        </div>
      </el-popover>
    </div>
    <ul class="list-card__data">
      <li>
        <h3 data-num>{{ info.titleAll | toThousandsW }}</h3>
        <p>作品数</p>
      </li>
      <li>
        <h3 data-num>{{ info.fansNum | toThousandsW }}</h3>
        <p>粉丝数</p>
      </li>
      <li>
        <h3 data-num>{{ info.nealy7dAddfans | toThousandsW }}</h3>
        <p>近7日涨粉丝</p>
      </li>
      <li>
        <h3 data-num>{{ info.nealy30dAddfans | toThousandsW }}</h3>
        <p>近30日涨粉丝</p>
      </li>
      <li>
        <h3 data-num>{{ info.cpm | toThousands }}</h3>
        <p>CPM</p>
      </li>
      <li>
        <h3 data-num>{{ info.thumbAll | toThousandsW }}</h3>
        <p>点赞量</p>
      </li>
      <li>
        <h3 data-num>{{ info.nealy7ThumbUpAvg | toThousandsW }}</h3>
        <p>近7日集均点赞</p>
      </li>
      <li>
        <h3 data-num>{{ info.nealy30ThumbUpAvg | toThousandsW }}</h3>
        <p>近30日集均点赞</p>
      </li>
    </ul>
    <div class="list-card__btns flex flex-align-center flex-justify-center">
      <div v-if="info.updatedTime" class="list-card__btns-time">
        <div>数据更新时间</div>
        <div>{{ info.updatedTime }}</div>
      </div>
      <IconTip icon-class="iconxiangqing" :content="info.accountId? '账号详情': '暂未收录'" @click="goDetail" />
      <IconTip v-if="$permission('dy_account_tags')" icon-class="iconbianji" content="修改内容主题" @click="$emit('handleShowTopic', info, index)" />
      <IconTip v-if="$permission('dy_accounts_mark')" icon-class="iconjingpin" content="添加为对标账号" @click="$emit('handleMark', info)" />
      <IconTip v-if="$permission('dy_account_sop')" icon-class="iconsop" content="添加为SOP账号" @click="$emit('handleShowSop', info, index)" />
      <IconTip v-if="info.readySignContractAccountFlag" icon-class="iconqianyue" :content="'添加为预备签约账号'" @click="addSignProgress(info.accountId)" />

      <!-- <el-button type="primary" plain size="mini" @click="goDetail">查看视频列表</el-button>
      <el-button type="primary" plain size="mini" @click="$emit('handleMark', info)">添加为对标账号</el-button>
      <el-button type="primary" plain size="mini" @click="$emit('handleShowTopic', info, index)">修改内容主题</el-button>
      <el-button type="primary" plain size="mini" @click="$emit('handleShowSop', info, index)">添加为SOP账号</el-button> -->
    </div>
  </div>
</template>

<script>
import AccountCard from '@/components/AccountCard'
import IconTip from '@/components/IconTip'
import { $addReadyAccountFromBase } from '@/api/sign-progress'

export default {
  components: {
    AccountCard,
    IconTip
  },
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      lock: false
    }
  },
  methods: {
    openUrl(url) {
      window.open(url)
    },
    goDetail() {
      const { accountId, accountType, platId } = this.info
      if (!accountId) return
      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          accountType,
          _blank: true
        }
      })
      // this.$router.push({
      //   path: `/dy-manage/details/${accountId}`,
      //   query: {
      //     accountId,
      //     accountName,
      //     accountType: accountType || 1,
      //     type: 1,
      //     from: 'dy',
      //     _blank: true
      //   }
      // })
    },
    async addSignProgress(accountId) {
      if (this.lock === true) {
        return
      }

      this.lock = true
      try {
        const { code, message } = await $addReadyAccountFromBase({ accountId })
        if (+code === 1) {
          this.$message.success('添加成功')
          this.$emit('update')
          this.lock = false
        } else {
          this.$message.error(message)
          this.lock = false
        }
      } catch (e) {
        this.$message.error(e)
        this.lock = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .account-card {
    &__image {
      width: 82px;
      height: 82px;
      margin-right: 8px;
      img {
        width: 82px;
        height: 82px;
      }
    }
    &__name {
      font-size: 20px;
    }
  }
}
.list-card {
  width: 100%;
  border: 1px solid #F0F0F0;
  min-height: 156px;
  border-radius: 4px;
  &:hover{
    box-shadow: 0 8px 18px #edeff7;
  }
  // box-shadow: 0 8px 18px #edeff7;
  &__info {
    width: 340px;
    padding: 16px;
  }
  &__data {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 25%;
      h3 {
        color:#272727;
        font-size: 20px;
        line-height: 32px;
        font-weight: bold;
      }
      p {
        font-size: 14px;
        color: #8C8C8C;
        line-height: 22px
      }
    }
  }
  &__btns {
    position: relative;
    width: 160px;
    color: $--color-primary;
    ::v-deep {
      .tooltip-label {
        margin: 0 6px;
      }
      .iconfont {
        font-size: 24px;
        color: $--color-primary;
        margin-left: 0;
      }
    }
    &-time {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 12px;
      text-align: right;
      color: #595959;
    }
  }

}
.user-info__profile {
  color: #999;
  cursor: pointer;
}
.m-t-8 {
  margin-top: 8px;
}

.userInfoId {
  color: #999;
}
</style>
