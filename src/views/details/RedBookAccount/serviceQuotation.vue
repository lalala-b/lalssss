<template>
  <el-card v-loading="accountDataLoading" shadow="always">
    <div>
      <div v-for="item in servicePrices" :key="item.prop" class="custom-video">
        <div class="vidoe-text">{{ item.label }}</div>
        <div class="video-price">¥ {{ item.value | toThousands }}</div>
      </div>
    </div>
  </el-card>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'

export default defineComponent({
  props: {
    accountDetail: {
      type: Object,
      default() {
        return {}
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  setup(props, { emit }) {
    const states = reactive({
      servicePrices: [
        {
          prop: 'picturePrice',
          label: '图文笔记一口价',
          value: ''
        },
        {
          prop: 'videoPrice',
          label: '视频笔记一口价',
          value: ''
        }
      ]
    })

    watch(() => props.accountDetail, (val) => {
      if (Object.keys(val || {}).length) {
        states.servicePrices.forEach(item => {
          item.value = val[item.prop]
        })
      }
    }, {
      immediate: true
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
  .custom-video {
      border: 1px solid #dadae1;
      border-radius: 6px;
      margin-top: 24px;
      padding: 20px 24px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;

      &:hover {
        border: 1px solid #33bdf5
      }

      &:first-child {
        margin-top: 0;
      }

      .video-price {
        font-size: 18px;
        font-weight: 600;
        margin-top: 6px;
      }
  }
</style>
