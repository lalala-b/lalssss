<template>
  <div>
    <el-card v-loading="accountDataLoading" shadow="always">
      <div class="service-head">
        <span>服务报价</span>
      </div>

      <div class="content-wrap">
        <div v-for="item in userInfo.upperPrices" :key="item.price_id" class="custom-video">
          <div>
            <span class="vidoe-text">{{ item.cooperation_type_desc }}</span>
            <span class="video-price"> ¥ {{ item.platform_price | toThousands }}</span>
          </div>
          <i class="el-icon-circle-plus" />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    userInfo: {
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
    return {
    }
  }
})
</script>

<style lang="scss" scoped>
.service-head {
  font-size: 16px;
  font-weight: 600;
}

.content-wrap {
  .custom-video {
      text-align: center;
      border: 1px solid #dadae1;
      border-radius: 6px;
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;

      &:hover {
        border: 1px solid #33bdf5
      }

      .video-price {
        margin-left: 16px;
      }

      i {
        color: #33bdf5;
        font-size: 20px;
      }
  }
}
</style>
