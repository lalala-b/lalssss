<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-15 18:21:15
 * @LastEditTime: 2020-09-18 10:51:25
 * @LastEditors: Linjie
-->
<template>
  <div class="search-view">
    <div class="search-item">
      <div class="search-item-title">内容主题</div>
      <div class="search-item-tag">
        <div v-for="(item, index) in tags" :key="item" data-type="tag">
          <el-tag
            :data-burry_title="item"
            :effect="(index === sIndex ? 'dark': 'plain')"
            :type="(index === sIndex ? '':'info')"
            size="small"
            @click="handleChanegTags(index, item)"
          >{{ item }}</el-tag>
        </div>
      </div>
    </div>
    <slot />
    <el-popover
      placement="bottom"
      width="220"
      trigger="hover"
      class="hover-tip"
    >
      <p v-for="(item, index) in tipMap[id]" :key="index">{{ item }}</p>
      <el-link slot="reference" :underline="false">数据说明<i class="el-icon-question" /></el-link>
    </el-popover>
  </div>
</template>
<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    },
    tags: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      sIndex: 0,
      tipMap: {
        '6766936376500813837': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期作品的有效视频数据、性价比、信用分、有效涨粉、星图种草指数等加权取值进行排序，以内容数据为主要衡量标准。', '【达人优势】：综合能力高，具有较大的商业价值。'],
        '6720184315054915588': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：评估创作者近15日有效涨粉数据进行排序。', '【达人优势】：达人处于高速涨粉阶段，具有较长的传播周期。'],
        '6766936436621967367': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期预估CPM、历史CPC、受众及粉丝价值等，衡量达人的商业性价比进行排序。', '【达人优势】：此类达人报价合理，性价比高，具有较高打造爆款几率。'],
        '6758055829141717005': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者内容组件点击、成交、内容播放互动等数据，评估达人种草能力进行排序。', '【达人优势】：具有较高种草及商业转化概率。'],
        '6773632101414600718': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：百万粉丝量级，星图指数较高且各项数据综合能力高的优质达人。', '【达人优势】：榜单内达人处于高速成长阶段，相对具有较高性价比，处于投放红利期。'],
        '6772128960131104776': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期作品（包括日常作品与星图任务作品）视频播放、互动、完播率等数据，评估达人内容传播能力。 ', '【达人优势】：内容具有较强创意、传播能力。']
      }
    }
  },
  methods: {
    handleChanegTags(index, item) {
      if (index !== this.sIndex) {
        this.sIndex = index
        this.$emit('changeTags', item)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
    .search-view {
      position: relative;
      padding: 0;
      .search-item {
        display: flex;
        align-items: flex-start;
        padding-right: 90px;
        .search-item-title{
          flex-shrink: 0;
          width: 96px;
          text-align: left;
          color: #000;
          font-weight: bold;
          font-size: 16px;
        }
        .search-item-tag{
          display: flex;
          flex-wrap: wrap;
          &>div{
            margin-left: 10px;
            margin-bottom: 10px;
            cursor: pointer;
          }
        }
        .custom-input{
          display: flex;
          align-items: center;
          .el-input{
            margin: 0 10px;
          }
        }
      }
    .hover-tip {
      position: absolute;
      right: 0;
      top: 0;
      height: 28px;
      line-height: 28px;
    }
    .el-input {
      width: 200px;
      margin-right: 10px;
    }
  }

  .tag{
      margin-right: 10px;
  }
</style>
