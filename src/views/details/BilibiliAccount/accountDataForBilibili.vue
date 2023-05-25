<template>
  <el-card v-loading="accountDataLoading" shadow="always">
    <div class="personal-head">
      <div class="head-left">
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <img
          :src="userInfo.headImg"
        />
      </div>

      <div class="head-right">
        <div class="account-name">
          <span>{{ userInfo.nickname || '--' }}</span>
          <img class="plat-logo" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_2.png`" alt="">
          <a v-if="userInfo.mcnId" :href="`https://huahuo.bilibili.com/#/upper/page/${userInfo.upperMid}?cn_id=${userInfo.mcnId}`" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" :content="THIRD_INDEX_URL_MAP['2'].tip" placement="top">
              <svg-icon :icon-class="THIRD_INDEX_URL_MAP['2'].iconClass" />
            </el-tooltip>
          </a>
        </div>
        <div class="uid-wrap">
          <span>uid：</span>
          <span>{{ userInfo.upperMid || '--' }}</span>
        </div>
      </div>
    </div>

    <div class="baseMsg-wrap">
      <div class="msg-item" :class="(userInfo.characterTag || []).length ? 'm-t-4' : ''">
        性别：{{ userInfo.genderDesc || '--' }}
      </div>

      <div class="msg-item">
        人设：
        <template v-if="(userInfo.characterTag || []).length">
          <el-tag v-for="(item, index) in userInfo.characterTag" :key="index" size="mini" class="tag-item">
            {{ item }}
          </el-tag>
        </template>
        <span v-else>--</span>
      </div>

      <div class="msg-item" :class="(userInfo.tags || []).length ? 'm-t-4' : ''">
        地区：{{ userInfo.regionDesc || userInfo.secondRegionDesc ? `${userInfo.regionDesc}-${userInfo.secondRegionDesc}` : '--' }}
      </div>

      <div class="msg-item">
        内容类型：
        <template v-if="(userInfo.tags || []).length">
          <el-tag v-for="(item, index) in userInfo.tags" :key="index" size="mini" class="tag-item">
            {{ item }}
          </el-tag>
        </template>
        <span v-else>--</span>
      </div>

      <div class="msg-item">
        个性签名：
        <span class="info-text">{{ userInfo.signature || '--' }}</span>
      </div>
    </div>

    <div class="recording-time">系统收录时间：{{ userInfo.spiderTime || '--' }}</div>
  </el-card>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { THIRD_INDEX_URL_MAP } from '@/const'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  setup(props) {
    return {
      THIRD_INDEX_URL_MAP
      // ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.personal-head {
  display: flex;
  margin-top: 10px;

  .head-left {
    position: sticky;
    top: 0px;
    cursor: pointer;

    img {
      width: 60px;
      height: 60px;
      line-height: 60px;
      font-size: 30px;
      border-radius: 50%;
    }
  }

  .head-right {
    margin-left: 20px;
    cursor: pointer;

    .account-name {
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 10px;
      display: flex;
      align-items: center;

      .plat-logo {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        // margin-right: 4px;
        // vertical-align: middle;
      }

      a {
        height: 24px;
      }
    }

    .uid-wrap {
      font-size: 14px;
    }
  }
}

.baseMsg-wrap {
  margin-top: 30px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  // align-items: flex-start;
  padding: 0 10px;
  text-align: center;

  .msg-item {
    width: 50%;
    text-align: left;
    margin-bottom: 12px;

    &:last-child {
      width: 100%;
    }
  }
}

.tag-item {
  margin-right: 4px;
  margin-bottom: 4px;
}

.recording-time {
  margin-top: 20px;
  padding: 0 10px;
  color: #b3b5b5;
  font-size: 14px;
  font-weight: 600;
}

.m-t-4 {
  margin-top: 4px;
}
</style>
