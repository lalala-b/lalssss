<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-18 16:35:09
 * @LastEditTime: 2020-01-10 13:55:25
 * @LastEditors: Linjie
-->
<template>
  <div id="app">
    <!-- 路由 -->
    <router-view />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import '@/views/qa/index'
import { objectMerge, deepClone } from '@/utils'
import { DEFAULT_LOG_MESSAGE, upLog } from '@/log'
export default {
  name: 'App',
  data() {
    return {
      microApp: null
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created() {
    window.onfocus = () => {
      if (localStorage.__Q_CACHE__AUTH_userInfo && this.userInfo.id !== JSON.parse(localStorage.__Q_CACHE__AUTH_userInfo).value.id) {
        location.reload()
      }
    }
    this.$bus.$on('upLog', (params) => {
      const upLoadInfo = {
        event_time: new Date().getTime(),
        event: 'click_app',
        page_id: this.$route.path,
        page_title: this.$route.meta.title,
        properties: params
      }
      upLog(objectMerge(deepClone(DEFAULT_LOG_MESSAGE), upLoadInfo))
    })
    this.checkTaskisThrough()
  },

  beforeDestroy() {
    this.$bus.$off('upLog')
  },
  mounted() {
  },
  methods: {
    checkTaskisThrough: function() {
      // if (this.userInfo.dailyQueryRecommendPuttingAccountFlag === 1) {
      // $getRecommendLimitInfo().then(res => {
      //   localStorage.setItem('recommendLimit', JSON.stringify({
      //     expires: dayjs(dayjs().format('YYYY-MM-DD 23:59:59')).valueOf(),
      //     limit: res.data.count
      //   }))
      //   if (res.data.count > 0) {
      //     this.$message.error('请先完成推荐账号反馈')
      //     this.$router.push('/putting-manager/account-recommend')
      //   }
      // })

      // if (to.path === '/putting-manager/account-recommend' || res.data.count === 0) {
      //   return next()
      // }
      // Message.error('需要完成所有账号反馈才能进行其它操作')
      // next(`/putting-manager/account-recommend`)
      // NProgress.done()
      // }
    }
  }
}
</script>
<style lang="scss">
  .M-select {
    margin-left: -180px;
    margin-top: -59px;
  }
</style>
