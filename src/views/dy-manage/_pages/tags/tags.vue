<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-05 14:34:06
 * @LastEditTime: 2020-12-15 14:58:38
 * @LastEditors: Linjie
-->
<template>
  <div class="search-view">
    <div v-for="tagType in tagsData" :key="tagType.key" class="search-item">
      <p class="search-item-title">{{ tagType.text }}</p>
      <div class="search-item-tag">
        <div v-for="(item, index) in tagType.list" :key="item[tagType.valKey]" data-type="tag">
          <template v-if="item._isCustom">
            <slot :name="item.customName" :item="item" :target="tagType" />
          </template>
          <template v-else>
            <el-tag
              v-log
              data-burry_btn_name="tab"
              :data-burry_title="item[tagType.valName]"
              :effect="(tagType.selecteIndex === index ? 'dark': 'plain')"
              :type="(tagType.selecteIndex === index ? '':'info')"
              size="small"
              @click="onTag(tagType, index)"
            >{{ item[tagType.labelName] }}</el-tag>
          </template>
        </div>
      </div>
    </div>
    <slot name="normal" />
  </div>
</template>
<script>
export default {
  props: {
    tagsData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    onTag(tagType, index) {
      if (tagType.selecteIndex !== index) {
        tagType.selecteIndex = index
      }
      const item = {
        name: tagType.valKey,
        val: tagType.list[tagType.selecteIndex][tagType.valName]
      }
      this.$emit('handleTagClick', item)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-view {
  .search-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 25px;
    line-height: 30px;
    .search-item-title {
      flex-shrink: 0;
      width: 96px;
      text-align: left;
      font-weight: bold;
      font-size: 16px;
      color: #000;
    }
    .search-item-tag {
      display: flex;
      flex-wrap: wrap;
      & > div {
          margin-left: 10px;
          cursor: pointer;
      }
    }
    .custom-input {
      display: flex;
      align-items: center;
      .el-input {
        margin: 0 10px;
      }
    }
  }
  .el-input {
    width: 200px;
  }
}

.tag {
    margin-right: 10px;
}
</style>
