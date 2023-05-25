<template>
  <div
    class="video-info-wrap"
    :attrs="$attrs"
  >
    <a
      class="info-coverImg"
      :href="info.url"
      target="_blank"
      :underline="false"
    >
      <el-image class="info-coverImg" :src="info.coverImg" fit="cover" />
    </a>
    <div class="info-data-wrap">
      <a
        :href="info.url"
        target="_blank"
        :underline="false"
      >
        <h2 :class="{'deleted': info.isDeleted}">{{ info.isDeleted === 1 ? '(已删除)' : '' }}{{ info.title }}</h2>
      </a>
      <slot name="link" />
      <p>发布时间：{{ info.addTime }}</p>
      <div class="account-info">
        <el-image class="account-avt" :src="info.avatarUri" />
        <a :href="info.accountLoginUrl" target="_blank">{{ info.nickName }}</a>
        <el-tooltip v-if="info.platId" class="account-icon-wrap" effect="dark" :content="info.platName" placement="top">
          <el-image fit="contain" class="plat-img" :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${info.platId}.png`" />
        </el-tooltip>
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {}
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .video-info-wrap {
    display: flex;
    .info-coverImg {
      margin-right: 10px;
      flex-shrink: 0;
      width: 80px;
      height: 100px;
    }
    .info-data-wrap {
      overflow: hidden;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: left;
      h2 {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        height: 24px;
        line-height: 24px;
        color: rgb(41, 151, 255);
        font-size: 14px;
        &.deleted {
          color: #999;
        }
        // width: 610px;
      }
      p {
        font-size: 12px;
        color: #999;
      }
    }
    .account-info {
      display: flex;
      align-items: center;
      .account-avt {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
    .account-icon-wrap {
      display: flex;
      align-items: center;
      margin-left: 5px;
      width: 1.3em;
    }
  }
</style>
