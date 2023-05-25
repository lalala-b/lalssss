<template>
  <div class="P-advertisingSkill" data-burry_sub_page_type="in_skills">
    <div class="P-advertisingSkillCon">
      <div class="P-advertisingSkillSearch">
        <el-input v-model="keyword" style="width: 300px;" placeholder="请输入关键词" />
        <el-button
          type="primary"
          :loading="loading"
          data-burry_btn_name="search"
          style="margin-left: 20px;"
          @click="onSearch"
        >搜索</el-button>
      </div>
      <div :loading="loading">
        <div class="P-advertisingSkillTable">
          <el-table
            ref="tabTable"
            v-scrollbar
            v-loading="loading"
            :data="tableData"
            :show-header="false"
            row-class-name="P-advertisingSkillTableRow"
          >
            <el-table-column>
              <template slot-scope="s">
                <div class="P-advertisingSkillTableInfo">
                  <p>
                    <el-link
                      type="primary"
                      data-burry_btn_name="content"
                      :data-burry_title="s.row.title"
                      :underline="false"
                      :href="s.row.url"
                      target="_blank"
                    >{{ s.row.title }}</el-link>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column width="180">
              <template slot-scope="s">
                <div class="P-advertisingSkillTableInfo">
                  <span>{{ s.row.pushedTime }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="total" class="P-advertisingSkillTablePager">
          <el-pagination
            background
            layout="prev, pager, next, jumper"
            :page-size="20"
            :total="total"
            :current-page.sync="nowPage"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tableMixin from '@/mixins/table'
import { extend } from '@/components/common'
import { $getContentList } from '@/api/backend-manage'
import './index.scss'

export default {
  mixins: [tableMixin],
  data() {
    return {
      searchData: {
        pageNum: 1,
        type: 2,
        keyword: '',
        firstCate: 2,
        secondCate: 0,
        onlyPushed: 1
      },
      keyword: ''
    }
  },
  watch: {
    nowPage(nVal, oVal) {
      if (nVal !== oVal) {
        this.searchData.pageNum = nVal
        this.getList()
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    onSearch() {
      var data
      if (this.keyword) {
        data = {
          type: 1,
          keyword: this.keyword
        }
      } else {
        data = {
          type: 2,
          keyword: ''
        }
      }
      this.searchData = extend(
        {
          pageNum: 1
        },
        this.searchData,
        data
      )
      this.getList()
    },
    getList() {
      this.loading = true
      $getContentList(this.searchData)
        .then(re => {
          this.loading = false
          if (re.code === 1) {
            this.tableData = re.data.map(item => {
              if (item.pushed_time) {
                item.pushed_time = item.pushed_time.split(' ')[0]
              }
              return item
            })
            this.total = re.total
          }
        })
    }
  }
}
</script>
