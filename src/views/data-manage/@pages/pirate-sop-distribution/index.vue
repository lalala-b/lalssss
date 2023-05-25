<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-10 18:24:26
 * @LastEditTime: 2020-12-18 14:16:56
 * @LastEditors: Linjie
-->
<template>
  <div class="iframe-wrap" style="height: 100%;">
    <iframe width="100%" height="100%" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" :src="url" />
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
import { $getDataByDictType } from '@/api'
export default defineComponent({
  setup() {
    const url = ref('')
    const getDataByDictType = () => {
      $getDataByDictType({
        dictTypes: ['pirate_sop_distribution']
      }).then((res) => {
        if (res.code === 1 && res.data) {
          const data = res.data.pirate_sop_distribution ? res.data.pirate_sop_distribution : []
          url.value = Object.keys(data).length ? data[0].dictValue : ''
        }
      })
    }
    getDataByDictType()
    return {
      url
    }
  }
})
</script><style lang="scss" scoped>
  .iframe-wrap {
    position: absolute;
    top: 0px;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
  }
</style>
