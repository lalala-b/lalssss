<template>
  <div class="P-announcements">
    <div class="P-announcementsTab">
      <el-tabs v-model="actName" @tab-click="handleAct">
        <el-tab-pane v-for="item in tabs" :key="item.name" :label="item.title" :name="item.name" />
      </el-tabs>
    </div>
    <div class="P-announcementsCon">
      <div class="P-announcementsSearch">
        <v-search
          ref="search"
          :config="formConf"
          @submit="onSubmit"
          @change="onSearchChange"
        />
      </div>
      <div class="P-announcementsList">
        <el-collapse v-if="total" v-model="act" accordion>
          <el-collapse-item
            v-for="(item, i) in items"
            :key="item.art_id"
            :title="(i + 1)+'. '+item.title"
            :name="i"
          >
            <div class="P-announcementsListItem" :data-index="i + 1">
              {{ item.content }}
            </div>
          </el-collapse-item>
        </el-collapse>
        <div v-else class="P-announcementsListEmpty">
          暂无数据
        </div>
        <div v-if="total" class="P-announcementsListPager">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="pageSize"
            :total="total"
            :current-page.sync="nowPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Search from '@/components/Search'
import { extend, copy } from '@/components/common'
import { $getArtNotice } from '@/api/announcements'

export default {
  data() {
    return {
      'formConf': {
        'normal': [
          {
            'type': 'input',
            'key': 'keyword',
            'conf': {
              'placeholder': '请输入关键词'
            }
          }
        ]
      },
      'tabs': [
        {
          'title': '公告',
          'name': 'announce',
          'ajaxRequest': $getArtNotice,
          'query': {
            'type': 2,
            'onlyPushed': 1,
            'firstCate': 3
          }
        },
        {
          'title': '消息提醒',
          'name': 'tip',
          'ajaxRequest': $getArtNotice,
          'query': {
            'type': 2,
            'only_unread': 0,
            'firstCate': 5
          }
        }
      ],
      'searchData': {},
      'items': [],
      'nowPage': 1,
      'total': 0,
      'pageSize': 20,
      'act': 0,
      'actName': '',
      'actTab': ''
    }
  },
  'components': {
    'vSearch': Search
  },
  created() {
    var { id, at } = this.$route.query
    at = at || 0
    const defTab = this.tabs[at]
    this.actTab = defTab
    this.actName = defTab.name

    this.actId = id && Number(id) || null
    this.searchData = defTab.query
    this.getList()
  },
  'methods': {
    onSearchChange() {
      // console.log(arguments)
    },
    async getList() {
      this.loading = true
      const re = await this.actTab.ajaxRequest(this.searchData)
      this.loading = false
      if (re.code === 1) {
        this.items = re.data
        this.total = re.total
        if (this.actId) {
          const act = re.data.findIndex(item => {
            return item.art_id === this.actId
          })
          if (act !== -1) {
            this.act = act
          }
        }
      }
    },
    onSubmit(data) {
      var keyword = data.keyword
      this.searchData.type = keyword ? 1 : 2
      this.searchData.keyword = keyword
      this.nowPage = 1
      this.searchData.pageNum = 1
      this.getList()
    },
    /**
         * 类型切换响应函数
         * @param  {String} name 类型名称
         */
    handleAct(e) {
      const name = e.name
      this.actName = name
      var tab = this.tabs[
        name === 'tip' ? 1 : 0
      ]
      this.actTab = tab
      this.$refs.search.form.keyword = ''
      this.searchData = extend(copy(this.searchData), tab.query)
      this.getList()
    }
  },
  'watch': {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.searchData.pageNum = nVal
        this.getList(nVal)
      }
    },
    '$route.query'(nVal, oVal) {
      if (nVal !== oVal && nVal.at !== undefined) {
        var tab = this.tabs[
          nVal.at
        ]
        if (tab && nVal.at.name !== this.actTab.name) {
          this.actTab = tab
          this.actName = tab.name
          const needRefresh = this.nowPage === 1
          this.nowPage = 1
          this.searchData = extend({ 'pageNum': 1 }, this.searchData, tab.query)
          if (needRefresh) {
            this.getList(nVal)
          }
        }
      }
    }
  }
}
</script>
<style lang="scss">
   @import "@/assets/container";
  .P-announcements {
      &Tab {
          margin:  0 0 24px;
          .el-tabs__nav-wrap {
              background-color: #fff;
          }
      }
      &Con {
        @include con()
      }

      &List {
          margin: 24px 0;

          &Pager {
              margin: 20px 0 24px;
              text-align: center;
              .el-pagination {
                  display: inline-block;
              }
          }

          &Empty {
              height: 60px;
              line-height: 60px;
              text-align: center;
          }
      }
      .el-collapse-item__header {
          padding-left: 10px;
      }
      &Item {
          text-indent: 10px;
      }
  }
</style>
