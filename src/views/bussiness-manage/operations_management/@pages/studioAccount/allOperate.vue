<template>
  <wrap>
    <el-button-group class="m-b-20">
      <el-button
        v-for="item in typeArr"
        :key="item.key"
        :type="item.key === type ? 'primary' : ''"
        @click="handleClick(item.key)"
      >
        {{ item.value }}
      </el-button>
    </el-button-group>
    <template
      v-for="item in typeArr"
    >
      <AllOperateDetail
        v-if="item.key === type"
        :key="item.key"
        :type="type"
      />
    </template>
  </wrap>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api'
import AllOperateDetail from './_com/allOperateDetail.vue'

export default {
  components: {
    AllOperateDetail
  },
  setup() {
    const state = reactive({
      type: 'douyin',
      typeArr: [
        {
          key: 'douyin',
          value: '抖音'
        },
        {
          key: 'kuaishou',
          value: '快手'
        },
        {
          key: 'bilibili',
          value: 'B站'
        },
        {
          key: 'xiaohongshu',
          value: '小红书'
        },
        {
          key: 'other',
          value: '其他平台'
        }
      ]
    })

    const handleClick = (type) => {
      state.type = type
    }

    return {
      ...toRefs(state),
      handleClick
    }
  }
}
</script>
