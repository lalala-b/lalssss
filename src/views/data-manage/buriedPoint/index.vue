<template>
  <wrap class="el-tabs-wrap">
    <iframe :src="url" frameborder="0" />
  </wrap>
</template>
<script>
import { defineComponent, ref, onMounted } from '@vue/composition-api'
import axios from 'axios'
import request from '@/http'

export default defineComponent({
  setup() {
    const url = ref('https://ldpqbi.zhuanspirit.com/token3rd/dashboard/view/pc.htm?pageId=d239707b-b4a5-467e-8cbb-d3a79ce01a10&accessToken=cdf3fb79cb0cdfc60b83c2407acf60d6&dd_orientation=auto')

    onMounted(async() => {
      // const res = request.get('https://feconf.zhuanzhuan.com/feconf/zlj?keys=qianshuju_buried_point')
      // console.info('----', res)
    })

    return {
      url
    }
  }
})
</script>
<style lang="scss" scoped>
.el-tabs-wrap {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 0;

  ::v-deep {
    iframe {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
