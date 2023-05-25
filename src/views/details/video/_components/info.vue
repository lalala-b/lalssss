<template>
  <div class="C-info">
    <a :href="data.url" target="_blank" data-bold class="data-title text-over-hidden-2">{{ data.titleName }}</a>
    <div class="flex">
      <p class="data-text m-r-24">发布时间：{{ data.addTime }}</p>
      <p class="data-text">视频时长：{{ data.videoDuration ? (data.videoDuration + '秒') : '--' }}</p>
    </div>
    <div v-if="data.selfOperateAccountFlag" class="flex m-t-10">
      <p class=" m-r-24">视频类型：{{ data.junType }}</p>
      <p class="m-r-24">编辑人员：{{ data.editName }}</p>
      <p class="">剪辑人员：{{ data.cutName }}</p>
    </div>
    <div class="data-timer">
      <p class="data-text">更新时间：{{ data.updateTime }}</p>
      <p class="data-text">收录时间：{{ data.createdTime }}</p>
    </div>
    <div class="m-t-8">
      <a
        v-if="data.recTitle"
        :href="data.recLink"
        target="_blank"
        class="rec-title"
      >
        <svg-icon icon-class="ele" />
        {{ data.recTitle }}
      </a>
    </div>
    <div class="m-t-8">
      <a
        v-if="data.videoServiceTitle && data.videoServiceType === 1001"
        :href="data.videoServiceUrl"
        target="_blank"
        class="rec-title"
      >
        <svg-icon icon-class="menu" />
        {{ data.videoServiceTitle }}
      </a>
    </div>
    <Flow class="C-info__flow" />
    <!-- <p class="data-text">视频热词：
        <el-tag
          size="small"
          v-for="tag in tags"
          :key="tag.name"
          closable
          :type="tag.type">
          {{tag.name}}
        </el-tag>
      </p> -->
  </div>
</template>
<script>
import Flow from './flow.vue'

export default {
  components: { Flow },
  data() {
    return {
      labels: [
        { name: '搞笑' }
      ],
      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ]
    }
  },
  inject: ['$response'],
  computed: {
    data() {
      return this.$response.detailData
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-info {
    // align-items: center;
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: relative;
    &__flow {
      flex: 1;
      align-items: flex-end;
      margin-top: 16px;
    }
    &__line {
      position: absolute;
      right: 0;
      top: 0;
      height: 90%;
      border-left: 1px solid $--border-color-lighter;
    }
    .data-label {
      background-color: rgb(121, 140, 247);
      color: rgb(21, 44, 247);
      padding: 2px 4px;
      display: inline-block;
      border-radius: 6px;
    }
    .data-timer {
      position: absolute;
      right: 24px;
      top: 0;
    }
    .data-title {
      margin-right: 214px;
      font-size: 16px;
      line-height: 24px;
    }
    .data-text {
      margin-top: 4px;
      line-height: 20px;
      color: #BFBFBF;
    }
    .rec-title {
      display: flex;
      align-items: center;
      line-height: 16px;
      font-size: 12px;
      border-radius: 4px;
      padding: 4px 9px;
      margin-right: 2px;
      background: rgba(10, 200, 224, 0.1);
      color: #595959;
      &:hover {
        color: $--color-primary;
      }
    }
    ::v-deep .el-tag {
      margin-right: 10px;
    }
    .m-t-8 {
      margin-top: 8px;
    }
  }
</style>
