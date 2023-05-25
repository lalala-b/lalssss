<template>
  <Wrap>
    <el-tabs v-model="activeName">
      <el-tab-pane label="已合作工单" name="order">
        <OrderList />
      </el-tab-pane>
      <el-tab-pane label="已合作广告视频" name="video">
        <VideoList />
      </el-tab-pane>
    </el-tabs>
  </Wrap>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import OrderList from './orderList/'
import VideoList from './videoList/'
export default defineComponent({
  components: { OrderList, VideoList },
  setup() {
    const activeName = ref('order')
    return {
      activeName
    }
  }
})
</script>
