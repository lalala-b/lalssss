<template>
  <Wrap class="user-info">
    <div class="user-info-head">
      <img class="user-info-head__image" :src="accountInfo.accountImg">
      <div>
        <div class="user-info__username" data-bold>{{ accountInfo.accountName }}
          <i v-if="accountInfo.xingtuGrade" class="user-info__leavel" data-bold>{{ accountInfo.xingtuGrade }}</i>
          <img class="user-info__plat" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${accountInfo.platId}.png`" alt="">
          <a v-if="accountInfo.xingtuIndexUrl" :href="accountInfo.xingtuIndexUrl" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" :content="THIRD_INDEX_URL_MAP[accountInfo.platId].tip" placement="top">
              <svg-icon :icon-class="THIRD_INDEX_URL_MAP[accountInfo.platId].iconClass" />
            </el-tooltip>
          </a>
          <!-- <a v-if="accountInfo.juxingIndexUrl" :href="accountInfo.juxingIndexUrl" target="_blank" class="m-l-5 user-info__xt">
            <el-tooltip effect="dark" content="聚星主页链接" placement="top">
              <svg-icon icon-class="juxing" />
            </el-tooltip>
          </a> -->
          <el-tooltip v-if="accountInfo.organizationStarFlag" class="m-r-5" effect="dark" content="机构达人" placement="top">
            <svg-icon icon-class="jigoudaren" />
          </el-tooltip>
          <el-tooltip v-if="accountInfo.corporateStarFlag" class="m-r-5" effect="dark" content="支持对公" placement="top">
            <svg-icon icon-class="zhichiduigong" />
          </el-tooltip>
        </div>
        <p class="user-info__id">{{ accountInfo.platName }}号：<strong>{{ accountInfo.uniqueId || accountInfo.eid || accountInfo.getDataUrl || '--' }}</strong></p>
        <p class="account-tag">
          <template v-if="accountInfo.sysAccountTag">
            <el-tag v-for="item in accountInfo.sysAccountTag.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>

          <template v-if="accountInfo.accountTagInfoBOList&&accountInfo.accountTagInfoBOList.length">
            <template v-for="(item, index) in accountInfo.accountTagInfoBOList">
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

          <template v-if="accountInfo.tagValue">
            <el-tag v-for="item in accountInfo.tagValue.split(',')" :key="item" class="m-r-5 m-b-5" size="mini">{{ item }}</el-tag>
          </template>
        </p>
        <!-- <p>
          <template v-if="accountInfo.accountTag">
            <el-tag v-for="item in accountInfo.accountTag.split(',')" :key="item" class="m-r-10" size="mini">{{ item }}</el-tag>
          </template>
          <template v-else>--</template>
        </p> -->
      </div>
    </div>
    <div class="user-info__detail">
      <div class="flex">
        <p>性别：<strong>{{ accountInfo.sex || '--' }}</strong></p>
        <p class="p2">年龄：<strong>{{ accountInfo.birthday || '--' }}</strong></p>
      </div>
      <div class="flex">
        <p class="p2">地区：<strong>{{ city || '--' }}</strong></p>
        <p>账号风格：<strong>{{ accountInfo.accountStyle || '--' }}</strong></p>
      </div>
      <div class="flex">
        <p>简介：<strong>{{ accountInfo.accountProfile || '--' }}</strong></p>
      </div>
      <div v-if="accountInfo.mcnName " class="flex">
        <p>所属机构：<strong>{{ accountInfo.mcnName }}</strong></p>
      </div>
    </div>
    <p class="user-info__times">系统收录时间：<strong>{{ accountInfo.createdTime || '--' }}</strong></p>
  </Wrap>
</template>
<script>
import { THIRD_INDEX_URL_MAP } from '@/const'

export default {
  components: {
  },
  props: {
    accountInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return { THIRD_INDEX_URL_MAP }
  },
  computed: {
    city() {
      const { provinceName, cityName } = this.accountInfo

      const cityArray = []
      if (provinceName) {
        cityArray.push(provinceName)
      }
      if (cityName) {
        cityArray.push(cityName)
      }

      return cityArray.join('-')
    }
  }
}
</script>

<style scoped lang="scss">
    .user-info {
      color: #000;
      // padding: 0;
      &-head {
        display: flex;
        &__image {
          overflow: hidden;
          flex-shrink: 0;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin-right: 12px;
        }
      }
      &__username {
        font-size: 16px;
        line-height: 24px;
        word-break: break-all;
      }
      &__leavel {
        display: inline-block;
        vertical-align: middle;
        width: 19px;
        height: 16px;
        text-align: center;
        line-height: 14px;
        font-size: 12px;
        background: url('../../_img/leavel_bg.png') 50% 0 no-repeat;
        background-size: 100% auto;
        color: rgba(255, 255, 255, 0.85);
      }
      &__plat {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        vertical-align: middle;
      }
      &__id {
        margin: 6px 0;
        line-height: 16px;
        font-size: 12px;
        color: #999999;
      }
      &__detail {
        margin-top: 14px;
        p {
          flex: 1;
          margin-bottom: 8px;
          color: rgba(0, 0, 0, 0.85);
          &:nth-child(n+2) {
            margin-right: 24px
          }
        }
      }
      &__times {
        margin-top: 16px;
        line-height: 22px;
        color: #999999;
        font-size: 14px;
      }
    }
</style>
