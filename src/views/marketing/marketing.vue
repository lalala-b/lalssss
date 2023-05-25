<template>
  <div class="P-marketing" data-burry_page_type="marketing">
    <template v-if="!detail">
      <div class="P-marketingTab">
        <el-tabs v-model="actName" @tab-click="handleAct">
          <el-tab-pane v-for="item in tabs" :key="item.name" :lazy="true" :label="item.title" :name="item.name">
            <keep-alive>
              <component :is="`v-${item.name}`" @bus="onBus" />
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </template>
    <v-detail v-if="detail" :id="detailId" @bus="onBus" />
  </div>
</template>
<script>
import Detail from './_pages/detail'
import Article from './_pages/article'
import Skill from './_pages/skill'
import Sop from './_pages/sop'
import Case from './_pages/case'

import Cache from '@/utils/cache'
import { isFunction, isUndefined } from '@/components/common'

// 页面缓存实例
const MARKETING_CACHE = new Cache({
  'prefix': '_MARKETING_',
  'type': 1
})
export default {
  components: {
    vArticle: Article,
    vSkill: Skill,
    vSop: Sop,
    vCase: Case,
    VDetail: Detail
  },
  data() {
    var detailId = (this.$route.query || {}).id
    var detail = Boolean(detailId)
    return {
      actTab: null,
      actName: null,
      detailId,
      detail,
      pageBurryType: 'study_ku'
    }
  },
  computed: {
    tabs() {
      const tabs = [
        {
          title: '热门文章',
          name: 'article',
          permissionName: 'market_acticle'
        },
        {
          title: '灵感热点',
          name: 'skill',
           permissionName: 'market_skill'
        },
        {
          title: 'SOP账号',
          name: 'sop',
           permissionName: 'market_sop'
        },
        {
          title: '广告案例',
          name: 'case',
          permissionName: 'market_case'
        }
      ]
      return tabs.filter(item => this.$permission(item.permissionName))
    }
  },
  watch: {
    $route(nVal) {
      if (nVal.query.id && nVal.query.id !== this.detailId) {
        this.detailId = nVal.query.id
        this.detail = true
      } else if (!nVal.query.id) {
        this.detailId = 0
        this.detail = false
      }
    }
  },
  beforeDestroy() {
    MARKETING_CACHE.clean()
  },
  created() {
    var at = this.$route.query.at || 0
    const defTab = this.tabs[at]
    this.actName = defTab?.name
    this.actTab = `v-${defTab?.name}`
  },
  methods: {
    /**
     * 类型切换响应函数
     * @param  {String} name 类型名称
    */
    handleAct(e) {
      const { name, index } = e
      if (`v-${name}` !== this.actTab) {
        this.actTab = `v-${name}`
        this.actName = name
        this.$router.push(`/marketing?at=${index}`)
      }
    },
    /**
     * 消息响应函数
     * @param  {String}   com  消息名称
     * @param  {String}   key  操作名称
     * @param  {String}   val  消息数据
     * @param  {Function} cb   回调函数
     */
    onBus(com, key, val, cb) {
      if (isFunction(val) && isUndefined(cb)) {
        cb = val
        val = null
      }
      let dat
      switch (com) {
          case 'MARKETING:save':
            MARKETING_CACHE.set(key, val)
            break

          case 'MARKETING:get':
            dat = MARKETING_CACHE.get(key)
            break

          case 'MARKETING:del':
            MARKETING_CACHE.del(key)
            break
      }

      if (cb) {
        cb(dat)
      }
    }
  }
}
</script>
