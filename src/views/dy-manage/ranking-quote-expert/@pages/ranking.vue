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
      model="array"
      @change="handleChangeTags"
    >
      <span slot="left" class="search-label" data-bold>内容主题</span>
    </TagSelect>
    <!-- <tags
      :id="id"
      :tags="tags"
      @changeTags="handleChangeTags"
    >
      <template v-slot> -->
    <div class="m-t-24">
      <span class="search-label" data-bold>榜单发布时间</span>
      <el-date-picker
        v-model="searchData.statDt"
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
      <!-- <el-popover
        placement="top"
        width="240"
        trigger="hover"
        class=""
      >

        <el-link slot="reference" :underline="false">

          <i class="iconfont " />
        </el-link>
      </el-popover> -->
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
        <el-table-column label="排名" prop="newRank" width="80">
          <template slot-scope="{row}">
            <RankColumn :level="row.newRank" />
          </template>
        </el-table-column>
        <el-table-column label="达人头像昵称" align="left">
          <template slot-scope="{ row }">
            <AccountCard :info="row" :options="{imgUrl: 'avatarUri', name: 'nickName' }" />
          </template>
        </el-table-column>
        <el-table-column label="达人粉丝数" prop="follower" sortable="custom" />
        <el-table-column v-if="id === '6720184315054915588'" label="涨粉数" prop="incrFollower" sortable="custom" />
        <el-table-column label="预期播放量" prop="positiveVv" sortable="custom" />
        <el-table-column label="互动率" prop="personalInterateRate" sortable="custom">
          <template slot-scope="s">
            {{ (s.row.personalInterateRate * 100).toFixed(2) }}%
          </template>
        </el-table-column>
        <el-table-column :label="scoreLabel" prop="score" sortable="custom" />
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
import { $getXingtuHotUser, $getXtHotUserTag } from '@/api/dy-manage'
import AccountCard from '@/components/AccountCard'

export default {
  components: {
    AccountCard,
    TagSelect,
    RankColumn,
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
        listId: '',
        statDt: '',
        tag: '',
        pageNum: 1,
        size: 10
      },
      tags: [],
      tipMap: Object.freeze({
        '6766936376500813837': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期作品的有效视频数据、性价比、信用分、有效涨粉、星图种草指数等加权取值进行排序，以内容数据为主要衡量标准。', '【达人优势】：综合能力高，具有较大的商业价值。'],
        '6720184315054915588': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：评估创作者近15日有效涨粉数据进行排序。', '【达人优势】：达人处于高速涨粉阶段，具有较长的传播周期。'],
        '6766936436621967367': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期预估CPM、历史CPC、受众及粉丝价值等，衡量达人的商业性价比进行排序。', '【达人优势】：此类达人报价合理，性价比高，具有较高打造爆款几率。'],
        '6758055829141717005': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者内容组件点击、成交、内容播放互动等数据，评估达人种草能力进行排序。', '【达人优势】：具有较高种草及商业转化概率。'],
        '6773632101414600718': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：百万粉丝量级，星图指数较高且各项数据综合能力高的优质达人。', '【达人优势】：榜单内达人处于高速成长阶段，相对具有较高性价比，处于投放红利期。'],
        '6772128960131104776': ['【数据来源】：星图', '【更新频率】：每日更新一次', '【筛选规则】：综合评估创作者近期作品（包括日常作品与星图任务作品）视频播放、互动、完播率等数据，评估达人内容传播能力。 ', '【达人优势】：内容具有较强创意、传播能力。']
      }),
      modifyTime: '' // 数据更新时间
    }
  },
  computed: {
    scoreLabel() {
      const labelMap = {
        '6766936376500813837': '达人指数',
        '6720184315054915588': '涨粉指数',
        '6758055829141717005': '种草指数',
        '6773632101414600718': '精选潜力指数',
        '6772128960131104776': '传播指数指数'
      }
      return labelMap[this.id]
    }
  },
  created() {
    this.searchData.listId = this.id
    this.getList()
    this.getTags()
  },
  methods: {
    getList() {
      this.loading = true
      $getXingtuHotUser(this.searchData).then((res) => {
        if (res.code === 1) {
          this.modifyTime = res.data.modifyTime
          this.tableData = res.data.list
          this.total = res.data.total
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
      $getXtHotUserTag({ listId: this.searchData.listId }).then((res) => {
        if (res.code === 1) {
          this.tags = res.data
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
      this.searchData.tag = tag
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
