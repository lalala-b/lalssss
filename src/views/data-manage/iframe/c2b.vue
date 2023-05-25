<template>
  <el-tabs v-model="activeName" class="el-tabs-wrap">
    <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
      <iframe v-if="item.name === activeName" :src="item.url" frameborder="0" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const activeName = ref('haidao')
    const tabs = [{
      name: 'haidao',
      label: '海盗C2B基本面',
      url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=a4f27ca8-0d5e-459a-ab50-a45df48c417c&accessToken=860a7728f70240fcb595e077cf11a686'
    }, {
      name: 'zhuanzhuan',
      label: '转转C2B转化',
      url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=edb76af1-c9a2-43fa-82cc-5e0d6eb62730&accessToken=79abe14ee6a6aa539bb460cc7943fd46'
    }, {
      name: 'zlj',
      label: '找靓机C2B转化',
      url: 'https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=63871b83-f7d4-4b23-a711-35bed29ae1f1&accessToken=e21c2221f80fccb0260ac10be6999abc'
    }]
    return {
      activeName,
      tabs
    }
  }
})
</script>
<style lang="scss" scoped>
.el-tabs-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  ::v-deep {
    .el-tabs__content {
      flex: 1;
      .el-tab-pane, iframe {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
