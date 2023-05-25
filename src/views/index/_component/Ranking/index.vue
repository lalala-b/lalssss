<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-09-14 10:15:10
 * @LastEditTime: 2020-12-31 11:29:00
 * @LastEditors: Linjie
-->
<template>
  <VideoList
    :loading="flowLoading"
    class="ranking-item"
    title="每日视频热榜"
    :list="rankingFlow"
    @click="handleClick"
  />
</template>
<script>
import VideoList from './VideoList'
import { $getHotList } from '@/api/pirate'
import { date } from '@/components/common'
import { checkMenuPermission } from '@/permission'

export default {
  components: {
    VideoList
  },
  data() {
    return {
      flowLoading: false,
      rankingFlow: []
    }
  },
  created() {
    this.getDYHotFlow()
  },
  methods: {
    async getDYHotFlow() {
      this.flowLoading = true
      const yesterday = new Date().getTime() - 3600 * 1000 * 24 * 1
      const params = {
        pageNum: 1,
        size: 6,
        dateStart: date('Y-m-d', new Date(yesterday)),
        dateEnd: date('Y-m-d 23:59:59', new Date(yesterday)),
        source: 1
      }
      try {
        const res = await $getHotList(params)
        if (res.code === 1) {
          res.data.forEach((item, index) => {
            item.rankImg = require(`../../_src/ranking-level_${index + 1}.png`)
          })
          this.rankingFlow = res.data
        }
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
      }
      this.flowLoading = false
    },

    handleClick() {
      console.log(checkMenuPermission('pirate_flow'))
      if (checkMenuPermission('pirate_flow')) {
        this.$router.push({ name: `pirate_flow` })
      } else {
          this.$alert('你没有该页面的查看权限', {
            confirmButtonText: '确定'
          })
      }
    }
  }
}
</script>
