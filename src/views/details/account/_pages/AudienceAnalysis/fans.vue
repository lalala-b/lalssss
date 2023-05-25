<template>
  <Wrap>
    <p>更新时间：{{ lastUpdateTime }}</p>
    <div class="flex flex-wrap m-t-16">
      <div
        v-for="item in charts"
        :key="item.key"
        class="chart-item w-50 m-b-24"
      >

        <Title v-if="item.key === 9" :title="item.title" class="p-0  m-b-16">
          <el-tooltip
            slot="right"
            placement="top"
            content="统计范围：近7天粉丝每周观看达人视频的次数"
          >
            <i class="iconfont iconwenhao" />
          </el-tooltip>
        </Title>

        <Title v-else :title="item.title" class="p-0  m-b-16" />
        <VChart :type="item.type" :config="item.config || {}" :data="item.data" :loading="loading" />
      </div>
    </div>
  </Wrap>
</template>
<script>
import { defineComponent, getCurrentInstance } from '@vue/composition-api'
import { Title, VChart } from 'components'
import { useEchart } from '../hooks'

export default defineComponent({
  components: { Title, VChart },
  setup() {
    const { accountId, platId } = getCurrentInstance().proxy.$route.params
    const { charts, loading, lastUpdateTime } = useEchart(accountId, platId, 'Fans')
    return {
      charts,
      loading,
      lastUpdateTime
    }
  }
})
</script>
<style lang="scss" scoped>
  .w-50 {
    width: 50%;
  }
</style>
