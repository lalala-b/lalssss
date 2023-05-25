<template>
  <el-tabs v-model="activeName" class="el-tabs-wrap">
    <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.label" :name="item.name">
      <iframe v-if="item.name === activeName" :src="item.url" frameborder="0" />
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import { defineComponent, ref, computed, reactive } from '@vue/composition-api'
import { $getDataByDictType } from '@/api'

export default defineComponent({
  setup() {
    const activeName = ref('week')
    const states = reactive({
      week_trends: '',
      day_trends: ''
    })

    const tabs = computed(() => {
      const tabs = [
        {
          name: 'week',
          label: '周趋势',
          url: states.week_trends
        },
        {
          name: 'day',
          label: '日趋势',
          url: states.day_trends
        }
      ]
      return tabs
    })

    // 根据字典表获取报表链接
    const getDataByDictType = async() => {
      const res = await $getDataByDictType({
        dictTypes: ['qucik_data_trends_link']
      })
      if (res.code === 1 && res.data) {
        const linkData = res.data['qucik_data_trends_link']
        linkData.forEach(item => {
          if (item.dictLabel === 'week_trends') {
            states.week_trends = item.dictValue
          } else if (item.dictLabel === 'day_trends') {
            states.day_trends = item.dictValue
          }
        })
      }
    }

    getDataByDictType()

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
