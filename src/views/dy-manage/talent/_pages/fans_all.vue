<template>
  <Wrap class="">
    <!-- 搜索层 -->
    <Search
      ref="Search"
      :query-data="queryData"
      :xingtu-tag-data="xingtuTagData"
      tip="按照统计日期的账号粉丝总量排序"
      @getData="getBillBoardData"
      @reset="resetListData"
      @clear="clear"
    />
    <!-- 无限list -->
    <ScrollList
      ref="List"
      :data="data"
      style="margin-top: 20px"
      type="fans_all"
      @getData="getBillBoardData"
    />
    <!-- 回到顶部 -->
    <BackToTop />
  </Wrap>
</template>
<script>
import Search from '../_com/search.vue'
import ScrollList from '../_com/scroll_list.vue'
import { $getBillBoardData } from '@/api/dy-manage'
import BackToTop from '@/components/BackToTop/index.vue'

export default {
  components: { Search, ScrollList, BackToTop },
  props: {
    queryData: {
      type: Object,
      default() {
        return {}
      }
    },
    xingtuTagData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      data: [],
      dataHeader: [
        { label: '排名', value: 'ranking' },
        { label: '账号', value: 'account' },
        { label: '粉丝增量', value: 'add_fans' },
        { label: '粉丝总量', value: 'fans_all' },
        { label: '操作', value: 'opera' }
      ]
    }
  },
  mounted() {
    // this.getBillBoardData()
  },
  deactivated() {
    this.reset()
    // this.getBillBoardData()
  },
  activated() {
    this.reset()
    this.getBillBoardData()
  },
  methods: {
    reset() {
      const search = this.$refs.Search
      this.$refs.List.count = 1
      search.xingtu = '全部'
      search.type = 1
      search.date = ''
      this.data = []
    },
    clear() {
      this.data = []
    },
    resetListData() {
      this.data = []
    },
    async getBillBoardData(pageNum, contentType) {
      const search = this.$refs.Search
      const list = this.$refs.List
      console.log(!search.form.date)
      if (!search || !search.form.date) {
        return
      }
      const params = {
        billboardCycle: search.form.type,
        billboardType: 4,
        // statDay: search.form.date,
        statDay: search.form.date,
        pageNum: pageNum || 1,
        size: 20,
        contentType: search.xingtu === '全部' ? '' : search.xingtu
      }

      if (pageNum === 1) {
        list.count = 1
        list.noData = false
      }
      list.hasLoading = true
      const res = await $getBillBoardData(params)
      if (res.code === 1) {
        if (res.data && res.data.length) {
          this.data.push(...res.data)
        } else {
          list.noData = true
        }
      }
      list.hasLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll-list {
  margin-top: 20px;
  background-color: #fff;
  padding: 10px;
}
</style>
