<template>
  <div>
    <FollowUserPortrait
      :user-info="userInfo"
      :fan-num-trend-list="fanNumTrendList"
      :account-data-loading="accountDataLoading"
      :fans-trend-loading="fansTrendLoading"
    />
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import FollowUserPortrait from './followUserPortrait.vue'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    fanNumTrendList: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    fansTrendLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },

  components: {
    FollowUserPortrait
  },

  setup(props, { emit }) {
    return {
      // ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
