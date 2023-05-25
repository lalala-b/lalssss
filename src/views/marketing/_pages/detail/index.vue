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
              <strong>{{ summary[item.key] | toThousandFilter }}</strong>
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
            <el-table-column
              label="标题"
            >
              <template slot-scope="s">
                <el-link
                  type="primary"
                  :href="s.row.url"
                  target="_blank"
                >{{ s.row.titleName }}</el-link>
              </template>
            </el-table-column>
            <el-table-column
              prop="thumbUpCount"
              label="点赞量"
              sortable="custom"
            />
            <el-table-column
              prop="comment_count"
              label="评论量"
              sortable="custom"
            />
            <el-table-column
              prop="forwarded_count"
              label="转发量"
              sortable="custom"
            />
            <el-table-column
              prop="addTime"
              label="发布时间"
            />
            <el-table-column
              prop="updateTime"
              label="更新时间"
            />
            <template v-if="hasAdv">
              <el-table-column
                label="广告"
              >
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
              <el-table-column
                prop="lebal"
                label="案例"
              />
              <el-table-column
                label="操作"
                width="140"
              >
                <template slot-scope="s">
                  <el-link
                    v-if="s.row.adv_id === 1 && hasCase"
                    type="primary"
                    :underline="false"
                    icon="el-icon-aim"
                    @click="doSet(s.row)"
                  >{{ s.row.lebal ? "编辑案例" : "新增案例" }}</el-link>
                  <el-link
                    v-if="$permission('middleground')"
                    type="primary"
                    :underline="false"
                    @click="setSop(s.row)"
                  >
                    添加为广告案例
                  </el-link>
                  <el-link
                    v-if="hasAddToLaunch"
                    type="primary"
                    :underline="false"
                    :disabled="s.row.is_delivery === 1"
                    @click="setLaunch(s.row)"
                  >
                    添加为投放视频
                  </el-link>
                </template>
              </el-table-column>
            </template>
            <template v-else-if="!hasAdv && (hasAddToCase || hasAddToLaunch)">
              <el-table-column
                label="操作"
                width="140"
              >
                <template slot-scope="s">
                  <el-link
                    v-if="hasAddToCase"
                    type="primary"
                    :underline="false"
                    @click="setSop(s.row)"
                  >
                    添加为广告案例
                  </el-link>
                  <el-link
                    v-if="hasAddToLaunch"
                    type="primary"
                    :underline="false"
                    :disabled="s.row.is_delivery === 1"
                    @click="setLaunch(s.row)"
                  >
                    添加为投放视频
                  </el-link>
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
            <span>{{ dialogData.titleName }}</span>
          </el-form-item>
          <el-form-item label="行业类别:" :required="true">
            <el-select v-model="dialogData.topics" class="M-videosDialogFormSelect" placeholder="请选择">
              <el-option
                v-for="item in datas.tags.advTopics"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
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
    <v-launch-dialog :status.sync="launchDialogStatus" :subject="dialogData" @success="onEditSuccess" />
  </div>
</template>
<script>
import mixin from '../../_mods/mixin'
import videoMixin from '../../_mods/video-mixin'
import { $getMarketVideos } from '@/api/marketing'

export default {
  'mixins': [mixin, videoMixin],
  data() {
    return {
      'searchData': {
        'determined': '',
        'accountId': this.$route.query.id || '',
        'start': '',
        'end': '',
        'title': '',
        'adv_id': ''
      },
      'accountName': '',
      'summaryItems': [
        {
          'key': 'total',
          'text': '标题数'
        },
        {
          'key': 'fans',
          'text': '粉丝数'
        },
        {
          'key': 'all_dig',
          'text': '总点赞量'
        },
        {
          'key': 'avg_dig',
          'text': '集均点赞'
        }
      ],
      'summary': {
        'total': 0,
        'fansRange': 0,
        'all_dig': 0,
        'avg_dig': 0
      },
      'datas': {
        'tags': {}
      },
      'searchTypes': [
        {
          'text': '内容主题',
          'key': 'advTopics',
          'valKey': 'tagId',
          'nameKey': 'tagName'
        }
      ],
      'selectedSearch': {}
    }
  },
  computed: {
    hasAddToLaunch() { // 添加为投放视频
      // const rules = [1, 84, 85]
      // return this.from === 'bussiness' && rules.includes(this.user.mrid)
      return true
    }
  },
  created() {
    var { name, r } = this.$route.query
    if (name) {
      this.accountName = decodeURIComponent(name)
    } else {
      this.$emit('bus', 'MARKETING:get', 'accountName', data => {
        if (data) {
          this.accountName = data
        } else {
          this.$replace('/marketing')
        }
      })
    }
    if (r) {
      this.redirect = decodeURIComponent(r)
    } else {
      this.redirect = null
    }
    this.getAllTags()
    this.processPermission()
    this.getList()
  },
  'methods': {
  // 获取表格数据
    getListData(query) {
      return $getMarketVideos(query)
        .then(re => {
          if (re.code === 1) {
            Object.keys(this.summary).forEach(key => {
              this.summary[key] = re[key]
            })
          }
        })
    },
    // 返回
    goBack() {
      this.$emit('bus', 'MARKETING:del', 'accountName')
      this.$emit('bus', 'MARKETING:get', 'redirect', url => {
        this.$emit('bus', 'MARKETING:del', 'redirect')
        url = url || this.redirect || '/marketing'
        this.$replace(url)
      })
    }
  }
}
</script>
