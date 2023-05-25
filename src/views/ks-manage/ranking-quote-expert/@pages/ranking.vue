<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-15 18:21:15
 * @LastEditTime: 2020-11-11 17:36:42
 * @LastEditors: Linjie
-->
<template>
  <Wrap>
    <TagSelect
      :inline="false"
      :data="tags"
      label-key="dictLabel"
      val-key="dictValue"
      @change="handleChangeTags"
    >
      <span slot="left" class="search-label" data-bold>内容主题</span>
    </TagSelect>
    <div class="m-t-24">
      <span class="search-label" data-bold>榜单发布时间</span>
      <el-date-picker
        v-model="searchData.statDay"
        type="date"
        placeholder="榜单发布时间"
        value-format="yyyy-MM-dd"
        @change="getList"
      />
    </div>
    <div class="m-t-24 flex flex-justify-between">
      <div class="updata-times">
        <span class="search-label">数据更新时间：</span>{{ modifyTime }}
      </div>
      <IconTip class="hover-tip" type="popover" label="榜单规则" icon-class="iconwenhao">
        <p v-for="(item, index) in tipMap[id]" :key="index">{{ item }}</p>
      </IconTip>
    </div>

    <!-- </template>
    </tags> -->
    <div v-loading="loading" class="table-view">
      <el-table
        ref="accounts"
        v-scrollbar
        :data="tableData"
        class="sticky-head"
        header-row-class-name="table-header"
        @sort-change="doSort"
      >
        <el-table-column label="排名" prop="rank_num" width="80">
          <template slot-scope="{row}">
            <RankColumn :level="row.rankNum" />
          </template>
        </el-table-column>
        <el-table-column label="头像昵称" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="{imgUrl: 'avatarUrl', name: 'accountName', accountUrl: 'authorUrl' }" />
          </template>
        </el-table-column>
        <el-table-column label="粉丝数" prop="fansNum" sortable="custom">
          <template slot-scope="{row}">
            {{ row.fansNum | toThousandsW }}
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="id === '6720184315054915588'" label="涨粉数" prop="incrFollower" sortable="custom" /> -->
        <el-table-column label="预曝光量" prop="preexposeNum" sortable="custom">
          <template slot-scope="{row}">
            {{ row.preexposeNum | toThousandsW }}
          </template>
        </el-table-column>
        <el-table-column label="预期CPM" prop="cpmNum" sortable="custom" />
        <el-table-column label="互动率" prop="interactRate" sortable="custom">
          <!-- <template slot-scope="s">
            {{ (s.row.personalInterateRate * 100).toFixed(2) }}%
          </template> -->
        </el-table-column>
        <el-table-column :label="scoreLabel" prop="performanceCost" sortable="custom" />
        <el-table-column label="报价" prop="quotedPrice" sortable="custom">
          <template slot-scope="{row}">
            {{ row.quotedPrice | toThousandsW }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row}">
            <IconTip content="详情" icon-class="iconxiangqing" @click="goDetail(row)" />
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="10"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </div>
  </Wrap>
</template>
<script>
import { IconTip, TagSelect, RankColumn } from 'components'
import tableMixin from '@/mixins/table'
import { $getCLHotUser } from '@/api/ks-manage'
import { $getDataByDictType } from '@/api'

import AccountCard from '@/components/AccountCard'

export default {
  components: {
    RankColumn,
    AccountCard,
    TagSelect,
    IconTip
  },
  mixins: [tableMixin],
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      searchData: {
        billboardType: '',
        statDay: '',
        contentType: '',
        pageNum: 1,
        size: 10
      },
      total: 0,
      tags: [],
      tipMap: Object.freeze({
        '6': ['【数据来源】：磁力聚星', '【更新频率】：每日更新一次', '【筛选规则】：根据达人近期涨粉量进行排序，以粉丝增量的绝对值为主要衡量标准。'],
        '3': ['【数据来源】：磁力聚星', '【更新频率】：每日更新一次', '【筛选规则】：综合评估达人近期作品（包括日常视频与快接单视频）播放量、完播率等数据，评估达人内容传播表现。'],
        '4': ['【数据来源】：磁力聚星', '【更新频率】：每日更新一次', '【筛选规则】：综合评估达人近期快接单作品的封面点击率、链接点击率、链接点击单价等，以达人的转化表现为主要衡量标准。'],
        '5': ['【数据来源】：磁力聚星', '【更新频率】：每日更新一次', '【筛选规则】：综合评估达人近期预估CPM、历史快接单视频转化成本、粉丝价值等，以达人的商业性价比为主要衡量标准。']
      }),
      modifyTime: '' // 数据更新时间
    }
  },
  computed: {
    scoreLabel() {
      const labelMap = {
        '6': '涨粉分',
        '3': '传播分',
        '4': '转化分',
        '5': '性价比分'
      }
      return labelMap[this.id]
    }
  },
  created() {
    this.searchData.billboardType = this.id
    this.getList()
    this.getTags()
  },
  methods: {
    getList() {
      this.loading = true
      $getCLHotUser(this.searchData).then((res) => {
        if (res.code === 1) {
          this.modifyTime = res.data.modifyTime
          this.tableData = res.data.list
          this.total = res.total
        } else {
          this.$message.error(res.message)
        }
        this.loading = false
      }).catch((err) => {
        if (err.__CANCEL__) {
          return
        }
        if (err.message) {
          this.$message.error(err.message)
        }
        this.loading = false
      })
    },
    getTags() {
      // kuaishou_account_tag
      $getDataByDictType({
         dictTypes: ['kuaishou_account_tag']
      }).then((res) => {
        if (res.code === 1) {
          this.tags = res.data.kuaishou_account_tag
          const all = {
            dictLabel: '全部',
            dictValue: ''
          }
          this.tags.unshift(all)
        } else {
          this.$message.error(res.message)
        }
      }).catch((err) => {
        if (err.__CANCEL__) return
        this.$message.error(err)
        this.loading = false
      })
    },
    handleChangeTags(tag) {
      this.searchData.contentType = tag
      this.searchData.pageNum = 1
      this.getList()
    },
    getIndex(index) {
      return index + (this.searchData.pageNum - 1) * this.searchData.size + 1
    },
    search() {
      this.searchData.pageNum = 1
      this.getList()
    },
    goDetail({ accountId = '', platId = '', accountType }) {
      this.$router.push({
        path: `/details/account/${platId}/${accountId}`,
        query: {
          accountType,
          _blank: true
        }
      })
      // document.querySelector('.app-main').scrollTo(0, 0)
    }
  }
}
</script>
<style lang="scss" scoped>
  .table-view {
    margin-top: 12px;
  }
  .search-label {
    flex-shrink: 0;
    text-align: right;
    display: inline-block;
    width: 98px;
    font-size: 14px;
    line-height: 22px;
    font-weight: 400;
    margin-right: 8px;
    color: rgba(0, 0, 0, 0.85);
  }
  .updata-times {
    .search-label {
      margin-right: 0;
    }
  }

  .level-icon {
    font-size: 32px;
  }
  .hover-tip {
    ::v-deep {
        .tooltip-label {
          font-size: 14px;
        }
    }
  }

</style>
