<template>
  <el-card v-loading="accountDataLoading" shadow="always">
    <div class="personal-head">
      <div class="head-left">
        <!-- eslint-disable-next-line vue/html-self-closing -->
        <img
          :src="accountDetailInfo.headPhoto"
        />
      </div>

      <div class="head-right">
        <div class="account-name">
          <span>{{ accountDetailInfo.accountName || '--' }}</span>
          <img class="plat-logo" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_45.png`" alt="">
          <a v-if="accountDetailInfo.userId" :href="`https://pgy.xiaohongshu.com/solar/blogger-detail/${accountDetailInfo.userId}`" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" :content="THIRD_INDEX_URL_MAP['45'].tip" placement="top">
              <svg-icon :icon-class="THIRD_INDEX_URL_MAP['45'].iconClass" />
            </el-tooltip>
          </a>
        </div>
        <div class="red-book-id-wrap">
          <span>小红书号：</span>
          <span>{{ accountDetailInfo.redId || '--' }}</span>
        </div>
      </div>
    </div>

    <div class="baseMsg-wrap">
      <div class="msg-item">
        性别：{{ accountDetailInfo.gender || '--' }}
      </div>

      <div class="msg-item" :class="(accountDetailInfo.tags || []).length ? 'm-t-4' : ''">
        地区：{{ accountDetailInfo.locationCity || '--' }}
      </div>

      <div class="msg-item">
        内容类型：
        <template v-if="(accountDetailInfo.contentTags || []).length">
          <span v-for="(item, index) in accountDetailInfo.contentTags" :key="index">
            <el-tag
              v-if="!(item.taxonomy2Tags || []).length"
              :key="`${item}_${index}`"
              size="mini"
              class="tag-item"
            >
              {{ item.taxonomy1Tag }}
            </el-tag>
            <el-popover
              v-else
              :key="`${item}_${index}`"
              placement="top"
              trigger="hover"
            >
              <div class="tagPopover">
                <el-tag
                  v-for="(it) in item.taxonomy2Tags"
                  :key="it"
                  size="mini"
                  class="tag-item"
                >
                  {{ it }}
                </el-tag>
              </div>
              <el-tag
                slot="reference"
                class="tag-item"
                size="mini"
              >
                {{ item.taxonomy1Tag }}
              </el-tag>
            </el-popover>
          </span>
        </template>
        <span v-else>--</span>
      </div>
    </div>

    <div class="recording-time">系统收录时间：{{ accountDetailInfo.spiderTime || '--' }}</div>
  </el-card>
</template>

<script>
import { defineComponent, reactive, watch, toRefs } from '@vue/composition-api'
import { THIRD_INDEX_URL_MAP } from '@/const'

export default defineComponent({
  props: {
    accountDetail: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    accountDataLoading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const states = reactive({
      accountDetailInfo: {}
    })

    watch(() => props.accountDetail, (val) => {
      if (Object.keys(val || {}).length) {
        states.accountDetailInfo = { ...val }
        if (states.accountDetailInfo.contentTags) {
          states.accountDetailInfo.contentTags = JSON.parse(states.accountDetailInfo.contentTags)
        }
      }
    }, {
      immediate: true
    })

    const handleGenerateSecondTag = (tagsArr) => {
      console.info(tagsArr, '---tagsArr')
    }

    return {
      THIRD_INDEX_URL_MAP,
      ...toRefs(states),
      handleGenerateSecondTag
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

    .red-book-id-wrap {
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
  cursor: pointer;
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

.tagPopover {
  text-align: center;
}
</style>
