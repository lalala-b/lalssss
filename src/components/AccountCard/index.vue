<template>
  <div class="account-card flex">
    <a class="account-card__image" target="_blank" @click="handleToHref">
      <img :src="info[config.imgUrl]" alt="">
    </a>
    <div class="account-card__info flex flex-dir-col flex-justify-center flex-align-start">
      <p class="account-card__name">
        <el-tooltip
          effect="dark"
          :disabled="info[config.name]&&info[config.name].length>5?false:true"
          :content="info[config.name]"
          placement="top"
        >
          <a class="text-over-hidden-1" target="_blank" @click="handleToHref" v-html="info[config.name]" />
        </el-tooltip>

        <el-tooltip v-if="info[config.platId]" effect="dark" :content="info[config.platName]" placement="top">
          <a :href="getAccountUrl(info)" target="_blank">
            <img class="account-card__name-plat" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${info[config.platId]}.png`" alt="">
          </a>
        </el-tooltip>
        <a v-if="info[config.xingtuUrl] && config.platId" :href="info[config.xingtuUrl]" target="_blank" class="account-card__name-xt">
          <el-tooltip
            effect="dark"
            :content="(THIRD_INDEX_URL_MAP[info[config.platId] || 25] || {}).tip"
            placement="top"
          >
            <svg-icon :icon-class="(THIRD_INDEX_URL_MAP[info[config.platId] || 25] || {}).iconClass || ''" />
          </el-tooltip>
        </a>
        <slot name="icon" />
      </p>
      <slot />
      <p v-if="(info.sysAccountTag || info.accountTag || info.tagValue || (info.accountTagInfoBOList || []).length) && showTags" class="account-card__tag">
        <template v-if="info.sysAccountTag">
          <template v-for="item in info.sysAccountTag.split(',')">
            <el-tag v-if="item" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>
        </template>
        <template v-if="info.accountTag">
          <template v-for="item in info.accountTag.split(',')">
            <el-tag v-if="item" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>
        </template>
        <template v-if="(info.accountTagInfoBOList || []).length">
          <template v-for="(item, index) in info.accountTagInfoBOList">
            <template v-if="item.tagName">
              <el-tag
                v-if="!(item.accountTagInfoBOList || []).length"
                :key="item.tagName"
                :type="+(item.tagStyle || {}).styleCode === 0
                  ? 'primary' :
                    +(item.tagStyle || {}).styleCode === 1 ? 'danger' :
                    +(item.tagStyle || {}).styleCode === 2 ? 'success' : 'primary'"
                class="m-r-5 m-b-5"
                size="mini"
              >
                {{ item.tagName }}
                <i v-if="+(item.tagStyle || {}).styleCode === 1" class="iconfont iconhuo" />
              </el-tag>
              <el-popover
                v-else
                :key="item.tagName"
                placement="top"
                popper-class="accountCardPopper"
                width="150"
                trigger="hover"
              >
                <div class="tagPopover">
                  <template v-for="(it, idx) in item.accountTagInfoBOList">
                    <el-tag
                      :key="`${it.md5Id}_${idx}`"
                      class="m-b-5"
                      size="mini"
                      :type="+(it.tagStyle || {}).styleCode === 0
                        ? 'primary' :
                          +(it.tagStyle || {}).styleCode === 1 ? 'danger' :
                          +(it.tagStyle || {}).styleCode === 2 ? 'success' : 'primary'"
                    >
                      {{ it.tagName }}
                      <i v-if="+(item.tagStyle || {}).styleCode === 1" class="iconfont iconhuo" />
                    </el-tag>
                    <br :key="`${it.tagName}_${index}_${idx}`">
                  </template>
                </div>
                <el-tag
                  slot="reference"
                  class="m-r-5 m-b-5"
                  size="mini"
                  :type="+(item.tagStyle || {}).styleCode === 0
                    ? 'primary' :
                      +(item.tagStyle || {}).styleCode === 1 ? 'danger' :
                      +(item.tagStyle || {}).styleCode === 2 ? 'success' : 'primary'"
                >
                  {{ item.tagName }}
                  <i v-if="+(item.tagStyle || {}).styleCode === 1" class="iconfont iconhuo" />
                </el-tag>
              </el-popover>
            </template>
          </template>
        </template>
        <template v-else>
          <template v-if="info.tagValue">
            <template v-for="item in info.tagValue.split(',')">
              <el-tag v-if="item" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
            </template>
          </template>
        </template>

      </p>
      <slot name="last" />
    </div>
  </div>
</template>
<script>
import { THIRD_INDEX_URL_MAP } from '@/const'

const DEFAULT_CONFIG = {
  imgUrl: 'accountImg',
  name: 'accountName',
  platName: 'platName',
  platId: 'platId',
  xingtuUrl: 'xingtuIndexUrl',
  accountUrl: 'accountLoginUrl',
  accountId: 'accountId'
}

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    showTags: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      THIRD_INDEX_URL_MAP
    }
  },
  computed: {
    config() {
      return Object.assign({}, DEFAULT_CONFIG, this.options)
    }
  },
  methods: {
    handleToHref() {
      if ([25, 26].includes(this.info.platId)) {
        if (!this.info[this.config.accountId]) return
        this.$router.push({
        path: `/details/account/${this.info.platId}/${this.info[this.config.accountId]}`,
        query: {
          _blank: true
        }
      })
      } else if (this.info.platId === 2) {
        this.$router.push({
          path: `/details/bilibili-account/${this.info.platId}/${this.info[this.config.accountId]}`,
          query: {
            accountType: this.info.accountType,
            _blank: true
          }
        })
      } else if (this.info.platId === 45) {
        this.$router.push({
          path: `/details/red-book-account/${this.info.platId}/${this.info[this.config.accountId]}`,
          query: {
            accountType: this.info.accountType,
            _blank: true
          }
        })
      } else {
        window.open(this.info[this.config.accountUrl])
      }
    },

    getAccountUrl(info) {
      const urlMap = {
        25: 'https://www.douyin.com/user/',
        26: 'https://www.kuaishou.com/profile/',
        2: 'https://space.bilibili.com/',
        45: 'https://www.xiaohongshu.com/user/profile/'
      }

      return `${urlMap[info.platId]}${+info.platId === 26 ? info.eid : info.getDataUrl}`
    }
  }
}
</script>
<style lang="scss" scoped>
  .account-card {
    // padding: 16px;
    // background-color: #fff;
    &__image {
      overflow: hidden;
      width: 32px;
      height: 32px;
      margin-right: 4px;
      border-radius: 50%;
      flex-shrink: 0;
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
    &__info {
      // flex: 1;
    }
    &__name {
      word-break: break-word;
      font-size: $--font-size-base;
      color: $--color-text-primary;
      line-height: 24px;
      text-align: left;
      vertical-align: middle;
      cursor: pointer;
      margin-bottom: 4px;

      &:hover {
        color: $--color-primary;
      }
      > a {
        vertical-align: middle;
      }
      &-plat {
        width: 18px;
        height: 18px;
        margin-left: 2px;
        margin-right: 2px;
        vertical-align: middle;
      }
      &-xt {
        font-size: 18px;
        margin-right: 5px;
        margin-left: 5px;
        line-height: 1;
      }
      // i {}
    }
    &__id {
      margin-top: 2px;
      line-height: 16px;
      font-size: $--font-size-small;
      color: $--color-text-placeholder;
    }
    &__label {
      margin-top: 3px;
    }
    &__tag {
      ::v-deep {
        .el-tag--mini {
          height: auto;
          min-height: 22px;
          white-space: initial;
        }
      }
    }
  }

  .tagPopover {
    text-align: center;
    max-width: 150px;
  }

  ::v-deep {
    .el-popover {
      min-width: 0px !important;
      width: 70px !important;
    }
  }

  .iconhuo {
    font-size: 12px;
  }
</style>
