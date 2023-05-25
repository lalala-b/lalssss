<template>
  <div class="M-marketingAccountDetail">
    <div class="M-marketingAccountDetailCon">
      <el-page-header :content="accountName" @back="goBack" />
      <div class="M-marketingAccountDetailSearch">
        <el-form :model="searchData" :inline="true">
          <el-form-item>
            <el-input v-model="searchData.title" placeholder="标题" />
          </el-form-item>

          <el-form-item class="M-marketingAccountDetailSearchRang">
            <el-input v-model="searchData.flow_start" type="number" min="0" placeholder="点赞量大于多少" />
            <span class="m-r-5 m-l-5">至</span>
            <el-input v-model="searchData.flow_end" type="number" min="0" placeholder="点赞量小于多少" />
          </el-form-item>

          <el-form-item>
            <el-date-picker
              v-model="searchData.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSearch()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading">
        <div class="M-marketingAccountDetailSummary">
          <ul>
            <li v-for="item in summaryItems" :key="item.key">
              <span>{{ item.text }}</span>
              <strong>{{ summary[item.key] | toThousands }}</strong>
            </li>
          </ul>
        </div>

        <div class="M-marketingAccountDetailTable">
          <el-table
            ref="accounts"
            v-scrollbar
            v-loading="loading"
            :data="tableData"
            header-row-class-name="P-accountsTableHead"
            row-class-name="P-accountsTableRow"
            @sort-change="doSort"
          >
            <el-table-column class-name="table-title" label="标题">
              <template slot-scope="s">
                <el-link type="primary" :href="s.row.url" target="_blank">{{ s.row.title_name }}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="thumb_up_count" label="点赞量" sortable="custom" />
            <el-table-column prop="comment_count" label="评论量" sortable="custom" />
            <el-table-column prop="forwarded_count" label="转发量" sortable="custom" />
            <el-table-column prop="add_time" label="发布时间" width="170px" />
            <el-table-column prop="update_time" label="更新时间" />
            <template v-if="hasAdv">
              <el-table-column label="广告">
                <template slot-scope="s">
                  <el-select
                    v-if="s.row.adv_id === 1 && hasAdv"
                    v-model="s.row.adv_id"
                    placeholder="请选择"
                    @change="detailChangeAdv(s.row)"
                  >
                    <el-option label="是" :value="1" />
                    <el-option label="否" :value="0" />
                  </el-select>
                  <div v-else>{{ ADV_MAP[s.row.adv_id] }}</div>
                </template>
              </el-table-column>
              <el-table-column prop="lebal" label="案例" />
              <el-table-column label="操作" width="140">
                <template slot-scope="s">
                  <el-link
                    v-if="hasAddToLaunch"
                    type="primary"
                    :underline="false"
                    :disabled="s.row.is_delivery === 1"
                    @click="setLaunch(s.row)"
                  >添加为投放视频</el-link>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </div>
        <div v-if="total" class="M-marketingAccountDetailTablePager">
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
    <el-dialog
      class="M-videosDialog"
      title="添加为广告案例"
      :visible.sync="dialogStatus"
      @close="onCancel"
    >
      <div class="M-videosDialogForm">
        <el-form ref="form" :model="dialogData" label-width="120px">
          <el-form-item label="URL链接:">
            <span>{{ dialogData.url }}</span>
          </el-form-item>
          <el-form-item label="标题:">
            <span>{{ dialogData.title_name }}</span>
          </el-form-item>
          <el-form-item label="行业类别:" :required="true">
            <el-select
              v-model="dialogData.topics"
              class="M-videosDialogFormSelect"
              placeholder="请选择"
            >
              <el-option
                v-for="item in datas.tags.adv_topic"
                :key="item.tag_id"
                :label="item.tag_name"
                :value="item.tag_id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌:" :required="true">
            <el-input v-model="dialogData.brand" />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="M-videosDialogFooter">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" :loading="maskLoading" @click="onConfirm">确定</el-button>
      </div>
    </el-dialog>
    <v-case v-if="dialogData" :status="caseDialogStatus" :subject="dialogData" @close="onCaseClose" />
    <v-launch-dialog
      :status.sync="launchDialogStatus"
      :subject="dialogData"
      @success="onEditSuccess"
    />
  </div>
</template>
<script>
import mixin from './mixin'
import videoMixin from './videoMixin'

export default {
  mixins: [mixin, videoMixin],
  data() {
    return {
      hasAdv: true,
      hasAddToLaunch: true,
      searchData: {
        determined: '',
        account_id: this.$route.query.id || '',
        start: '',
        end: '',
        title: '',
        adv_id: ''
      },
      summaryItems: [
        {
          key: 'title_count',
          text: '标题数'
        },
        {
          key: 'fans_count',
          text: '粉丝数'
        },
        {
          key: 'all_dig',
          text: '总点赞量'
        },
        {
          key: 'avg_dig',
          text: '集均点赞'
        }
      ],
      summary: {
        title_count: 0,
        fans_count: 0,
        all_dig: 0,
        avg_dig: 0
      },
      datas: {
        tags: {}
      },
      searchTypes: [
        {
          text: '内容主题',
          key: 'adv_topic',
          valKey: 'tag_id',
          nameKey: 'tag_name'
        }
      ],
      selectedSearch: {}
    }
  },
  computed: {
    account_id() {
      return this.$route.query.id
    },
    accountName() {
      return decodeURIComponent(this.$route.query.name)
    }
  },
  created() {
    this.getAllTags()
    this.processPermission()
    this.getList()
    this.getDataNum()
  },
  methods: {
    // 数据指标
    getDataNum() {
      this.$request({
        url: '/getAdvAccountDataNum',
        query: {
          account_id: this.account_id
        }
      }).then(res => {
        if (res) {
          Object.keys(this.summary).forEach(key => {
            this.summary[key] = res[key]
          })
        }
      })
    },
    // 获取表格数据
    getListData(query) {
      return this.$request({
        url: '/getAdvAccountDetail',
        query,
        raw: true
      }).then(
        re => {
          return re
        },
        err => {
          return err
        }
      )
    },
    // 返回
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
