<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-21 15:27:19
 * @LastEditTime: 2020-12-26 19:51:05
 * @LastEditors: Linjie
-->
<template>
  <div class="detail">
    <Wrap class="p-d-0">
      <div class="detail-account flex flex-justify-between">
        <AccountCard :info="accountDetaild">
          <div class="account-id">{{ accountDetaild.platName }}号：{{ accountDetaild.uniqueId || accountDetaild.eid || accountDetaild.getDataUrl || '--' }}</div>
          <!-- <div class="m-t-5">
            <el-tag v-if="accountDetaild.tagValue" size="small">{{ accountDetaild.tagValue }}</el-tag>
          </div> -->
        </AccountCard>
        <!-- <el-image :src="accountDetaild.accountImg" class="detail-account-img" />
        <div>
          <h3 class="detail-account-name">{{ accountDetaild.accountName }}</h3>
          <div class="flex detail-account-plat">
            <img :src="`//qpmcn-1255305554.cos.ap-beijing.myqcloud.com/plat_${accountDetaild.platId}.png`" alt="">
            {{ accountDetaild.uniqueId || accountDetaild.eid || accountDetaild.getDataUrl }}
          </div>
          <div class="m-t-5">
            <el-tag v-if="accountDetaild.tagValue" size="small">{{ accountDetaild.tagValue }}</el-tag>
          </div>
        </div> -->
        <span class="detail-account-time">账号收录时间：{{ accountType == 3 || accountType == 1 ? accountDetaild.createTime : accountDetaild.addTime }}</span>
      </div>
      <!-- 投放账号 -->
      <template v-if="accountType == 3">
        <div class="m-t-24 detail-list">
          <Title class="p-0" title="达人信息" />
          <ul class="flex flex-wrap">
            <li>星图报价：{{ accountDetaild.quotePrice | toThousands }}</li>
            <li>所属机构：{{ accountDetaild.belongTeam }}</li>
            <li>对接人：{{ accountDetaild.meetUserName }}</li>
            <li />
            <li>合作次数：{{ accountDetaild.orderPutCount }}</li>
          </ul>
        </div>
        <div class="detail-list">
          <Title class="p-0" title="联系方式" />
          <ul class="flex flex-wrap">
            <li>手机号码：{{ accountDetaild.phone }}</li>
            <li>微信号：{{ accountDetaild.wechatNumber }}</li>
            <li>QQ：{{ accountDetaild.qqNumber }}</li>
            <li>邮箱：{{ accountDetaild.email }}</li>
            <li>座机：{{ accountDetaild.fixedPhoneCode }}-{{ accountDetaild.fixedPhoneNumber }}</li>
            <li>其他：{{ accountDetaild.otherContact }}</li>
          </ul>
        </div>
      </template>
      <!-- 签约账号 -->
      <template v-else-if="accountType == 1">
        <div class="m-t-24 detail-list">
          <Title class="p-0" title="达人信息" />
          <ul class="flex flex-wrap">
            <li>1-20s报价：{{ accountDetaild.twentySecondPrice | toThousands }}</li>
            <li>21-60s报价：{{ accountDetaild.quotePrice | toThousands }}</li>
            <li>60s+报价：{{ accountDetaild.oversixtySecondPrice | toThousands }}</li>
            <li>直播报价：{{ accountDetaild.livePrice | toThousands }}</li>
            <li>达人地区：{{ accountDetaild.provinceName }} <template v-if="accountDetaild.provinceName && accountDetaild.cityName">-</template> {{ accountDetaild.cityName }}</li>
            <li>达人联系方式：{{ accountDetaild.phone }}</li>
            <li>签约经纪人：{{ accountDetaild.brokerUserName }}</li>
            <li>签约时间：{{ accountDetaild.signContractDate }}</li>
            <li>达人分成比例：{{ accountDetaild.outMoneyRatio }}%
              <IconTip
                type="popover"
                placement="top-start"
                width="300"
                trigger="hover"
                content="达人分成：请按照合同的实际分成比例填写，例如机构与达人的分成为3：7，则达人分成比例填写70%"
                icon-class="iconwenhao"
              />
            </li>
            <li>对接商务：{{ accountDetaild.businessUserName }}</li>
            <li>商务微信：{{ accountDetaild.businessWechat }}</li>
            <li>是否保量：{{ accountDetaild.quantityFlag ? '是' : '否' }}</li>
            <li>保量详情：{{ accountDetaild.quantityInfo }}</li>
            <li>是否底薪：{{ accountDetaild.baseSalaryFlag ? '是' : '否' }}</li>
            <li>底薪详情：{{ accountDetaild.baseSalaryInfo }}</li>
            <li>最多共担返点：{{ accountDetaild.maxBearRatio === undefined ? '--' : `${accountDetaild.maxBearRatio || 0}%` }}</li>
            <li class="cart">购物车权益：
              <el-tag v-if="(accountDetaild.talentInterest || {}).cartInterest" size="small">
                {{ [
                  !+accountDetaild.talentInterest.cartInterest.isFree ? '付费' : +accountDetaild.talentInterest.cartInterest.isFree === 1 ? '免费' : '',
                  +accountDetaild.talentInterest.cartInterest.isFree !== 1 ? `${accountDetaild.talentInterest.cartInterest.trailerAdditionalPrice}元` : '',
                  accountDetaild.talentInterest.cartInterest.isHasCommission ? '有佣金要求' : '无佣金要求',
                  accountDetaild.talentInterest.cartInterest.isHasCommission ? `${accountDetaild.talentInterest.cartInterest.commissionRatio || 0}%` : ''
                ].filter(item => item !== '').join('-') }}
              </el-tag>
              <span v-else>--</span>
            </li>
            <li class="cart">信息流权益：
              <el-tag v-if="(accountDetaild.talentInterest || {}).msgFlowInterest" size="small">
                {{ [
                  !+accountDetaild.talentInterest.msgFlowInterest.isFree ? '付费' : +accountDetaild.talentInterest.msgFlowInterest.isFree === 1 ? '免费' : '',
                  +accountDetaild.talentInterest.msgFlowInterest.isFree !== 1 ? `${accountDetaild.talentInterest.msgFlowInterest.msgAdditionalPrice}元` : '',
                  `${!+accountDetaild.talentInterest.msgFlowInterest.msgDuration ? '0' : +accountDetaild.talentInterest.msgFlowInterest.msgDuration === 1 ? '1-3' : +data.talentInterest.msgFlowInterest.msgDuration === 2 ? '2-4' : '6-12'}个月`
                ].filter(item => item !== '').join('-') }}
              </el-tag>
              <span v-else>--</span>
            </li>
            <li>线下商单权益：
              {{ (accountDetaild.talentInterest || {}).offlineOrderInterest === 0 ? '不接受线下商单' : (accountDetaild.talentInterest || {}).offlineOrderInterest === 1 ? '接受线下商单' : '--' }}
            </li>
            <li>是否加入乾派MCN：{{ accountDetaild.joinMcnFlag ? '是' : '否' }}</li>
            <li>账号状态：{{ accountDetaild.accountStatus == 0 ? '上架' : '下架' }}</li>
            <li class="block">达人详细地址：{{ accountDetaild.darenAddress }}</li>
            <li class="block">
              过往合作行业类别：
              <template v-if="accountDetaild.customFieldName">
                <el-tag
                  v-for="item in accountDetaild.customFieldName.split(',')"
                  :key="item"
                  class="m-r-5"
                  size="small"
                >{{ item }}</el-tag>
              </template>
            </li>
            <li class="block">过往合作客户：{{ accountDetaild.cooperationCustomer }}</li>
            <li class="block">备注：{{ accountDetaild.remark }}</li>
          </ul>
        </div>
      </template>
      <!-- 商务账号 -->
      <template v-else-if="accountType == 7">
        <div class="m-t-24 detail-list">
          <Title class="p-0" title="达人信息" />
          <ul class="flex flex-wrap">
            <li>21-60s报价：{{ accountDetaild.quotePrice | toThousands }}</li>
            <li>对接人：{{ accountDetaild.accountContacts }}</li>
            <li>合作次数：{{ accountDetaild.accountUseCount }}</li>
            <li>联系方式：{{ accountDetaild.bindPhone }}</li>
            <li>返点：{{ accountDetaild.rebate }}</li>
            <li>达人地区：{{ accountDetaild.provName }} - {{ accountDetaild.cityName }}</li>
            <li>商务负责人：{{ accountDetaild.realName }}</li>
            <li>账号状态：{{ accountDetaild.accountStatus == 0 ? '上架' : '下架' }}</li>
          </ul>
        </div>
      </template>
      <!-- 媒介账号 -->
      <template v-else>
        <div class="m-t-24 detail-list">
          <Title class="p-0" title="达人信息" />
          <ul class="flex flex-wrap">
            <li>{{ +accountDetaild.platId === 2 ? '定制视频' : +accountDetaild.platId === 45 ? '视频笔记' : '21-60s' }}报价：{{ accountDetaild.quotePrice | toThousands }}</li>
            <li>所属机构：{{ accountDetaild.belongTeam }}</li>
            <li>对接人：{{ accountDetaild.accountContacts }}</li>
            <li>合作次数：{{ accountDetaild.accountUseCount }}</li>
            <li>联系方式：{{ accountDetaild.bindPhone }}</li>
            <li>返点：{{ accountDetaild.rebate }}</li>
            <li>达人地区：{{ accountDetaild.provName }} - {{ accountDetaild.cityName }}</li>
            <li>媒介采买人：{{ accountDetaild.realName }}</li>
            <li>账号状态：{{ accountDetaild.accountStatus == 0 ? '上架' : '下架' }}</li>
          </ul>
        </div>
      </template>
    </Wrap>
    <div class="flex m-t-16">
      <Wrap class="flex1">
        <Title title="账号动态" class="p-0" />
        <ul class="detail-total-list flex flex-align-center m-t-16">
          <li>
            <span>粉丝数</span>
            <strong data-num>{{ accountDetaild.allFans || 0 | toThousandFilter }}</strong>
          </li>
          <li>
            <span>视频数量</span>
            <strong data-num>{{ accountDetaild.allTitle || accountDetaild.allFlowTitle || 0 | toThousandFilter }}</strong>
          </li>
          <li>
            <span>集均点赞</span>
            <strong data-num>{{ accountDetaild.avgDig || 0 | toThousandFilter }}</strong>
          </li>
        </ul>
        <Title title="粉丝趋势" icon="iconfensi_fill" class="title-item" />
        <VChart type="line" :loading="loadingFans" :config="lineConfig" :data="chartsData.fansLine" />
      </Wrap>
      <Wrap class="flex1 video-wrap flex flex-dir-col">
        <Title title="最近15条视频数据表现" class="p-0" />
        <div class="chart-item flex1 flex flex-dir-col">
          <el-radio-group v-model="nowTypes" class="chart-btn-wrap" size="small" @change="hanleEchartChange">
            <template v-for="item in typeList">
              <el-radio-button
                :key="item.label"
                data-burry_btn_name="tab"
                :data-burry_title="item.val"
                :label="item.val"
              >{{ item.label }}</el-radio-button>
            </template>
          </el-radio-group>
          <div class="video-wrap-tip flex flex-algin-center">
            <div>
              最低{{ typeMap[nowTypes].text }}：<strong data-num>{{ typeMap[nowTypes].min | toThousandFilter }}</strong>
            </div>
            <div>
              最高{{ typeMap[nowTypes].text }}：<strong data-num>{{ typeMap[nowTypes].max | toThousandFilter }}</strong>
            </div>
          </div>
          <VChart
            ref="videoChart"
            :loading="videoBarLoading"
            type="bar"
            :config="videoColumConfig"
            :data="chartsData.videoColumn"
            :formater="formaterVideoConfig"
            @click="handleVideoEchatClick"
          />
        </div>
      </Wrap>
    </div>
    <Wrap class="m-t-16 table-view">
      <Title title="视频列表" class="p-0 m-r-5" />
      <v-search
        ref="search"
        :inline="true"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onSearchChange"
      >
        <template v-slot:normal="target">
          <el-form-item>
            <flex-row>
              <el-input v-model="target.model.flowLikeStart" type="number" placeholder="点赞量大于多少" min="0" />
              <span class="m-r-5 m-l-5">至</span>
              <el-input v-model="target.model.flowLikeEnd" type="number" placeholder="点赞量小于多少" min="0" />
            </flex-row>
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="target.model.timerange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
        <template v-slot:btns="target">
          <el-checkbox v-model="target.model.flowIsDeleted" class="m-l-10" true-label="1" false-label="0">屏蔽已删除视频</el-checkbox>
          <el-checkbox v-if="accountDetaild.orderPutCount > 0 || accountDetaild.accountUseCount > 0" v-model="target.model.isWork" class="m-l-10" true-label="1" false-label="0">历史合作投放视频</el-checkbox>
        </template>
      </v-search>
      <Statistics :data="summaryItems" />
      <el-table
        ref="accounts"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        header-row-class-name="table-header"
        class="m-t-16"
        @sort-change="doSort"
      >
        <el-table-column label="视频" prop="titleName" width="480">
          <template slot-scope="{row}">
            <VideoInfo :info="row" :options="{title: 'titleName', coverImg: 'videoCoverUrl'}" />
          </template>
        </el-table-column>
        <el-table-column label="点赞量" prop="thumbUpCount" sortable="custom" />
        <el-table-column label="评论量" prop="commentCount" sortable="custom" />
        <el-table-column label="转发量" prop="forwardedCount" sortable="custom" />
        <el-table-column label="发布时间" prop="addTime" sortable="custom" />
        <el-table-column label="更新时间" prop="updateTime" sortable="custom" />
      </el-table>
      <div class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import tableMinxin from '@/mixins/table'
import { Title, VChart, Statistics, VideoInfo, IconTip } from 'components'
import search from '@/components/Search'
import { copy, objectMerge } from '@/utils'
import { $getPuttingOrMJAccountVideoList, $orderPutAccountDetail } from '@/api/bussiness-manage'
import { $accountFansChart } from '@/api/account-manage'
import { AccountCard } from 'components'

export default {
  components: {
    vSearch: search,
    VideoInfo,
    IconTip,
    Statistics,
    VChart,
    AccountCard,
    Title
  },
  mixins: [tableMinxin],
  data() {
    this.videoColumConfig = {
      yAxis: {
        type: 'value'
      },
      xAxis: { boundaryGap: true },
      seriesConfig: {
        type: 'bar',
        markLine: {
          label: {
            formatter: (params) => {
              return params.value > 10000 ? (params.value / 10000).toFixed(2) + 'w' : params.value
            }
          },
          precision: 0,
          data: [
            { type: 'average' }
          ]
        }
      },
      legend: {
        show: false
      }
    }
    this.lineConfig = {
      legend: {
        // selectedMode: 'single'
      },
      yAxis: [{
        type: 'value'
      }, {
        type: 'value'
      }],
      seriesConfig: {
        type: 'line',
        data: null
      }
    }
    return {
      accountType: 3, // 3 - 投放账号 5 - 媒介账号
      typeList: [{
        label: '点赞量',
        val: 'thumbUpCount'
      }, {
        label: '评论量',
        val: 'commentCount'
      }, {
        label: '转发量',
        val: 'forwardedCount'
      }],
      typeMap: {
        thumbUpCount: {
          text: '点赞量',
          max: 0,
          min: 0
        },
        commentCount: {
          text: '评论量',
          max: 0,
          min: 0
        },
        forwardedCount: {
          text: '转发量',
          max: 0,
          min: 0
        }
      },
      nowTypes: 'thumbUpCount',
      formConf: {
        normal: [
          {
            type: 'input',
            key: 'title',
            conf: {
              placeholder: '请输入标题'
            }
          }
        ],
        hasExport: false
      },
      summaryItems: [
        {
          key: 'total',
          text: '标题数',
          val: 0
        },
        {
          key: 'allDig',
          text: '点赞',
          val: 0
        },
        {
          key: 'avgDig',
          text: '集均点赞',
          val: 0
        }
      ],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime()
        }
      },
      loadingFans: true,
      videoBarLoading: true,
      chartsData: {
        fansLine: null,
        videoColumn: null,
        o_videoColumn: null
      },
      searchData: {
        // timerange: [start, end],
        determined: '',
        size: 15
      },
      accountDetaild: {}
    }
  },
  created() {
    const type = this.$route.query.type || 3
    if (type == 5) {
      this.$route.meta.title = '媒介账号详情'
    }
    this.accountType = type
    this.getList()
    this.getAccountDetail()
    this.accountFansChart()
  },
  mounted() {
    // this.$set(
    //   this.$refs.search.form, 'timerange', this.searchData.timerange
    // )
  },
  methods: {
    accountFansChart() {
      this.loadingFans = true
      $accountFansChart({ accountId: this.$route.query.accountId }).then(res => {
        if (res.code === 1) {
          this.chartsData.fansLine = {
            cates: res.data.cates.map(item => item.typeName),
            terms: res.data.terms,
            values: res.data.values
          }
        }
        this.loadingFans = false
      }).catch(err => {
        if (err.__CANCEL__) return
        this.loadingFans = false
      })
    },
    // 视频列表
    getList() {
      this.loading = true
      if (!this.getChart) {
        this.videoBarLoading = true
      }
      const params = copy(this.searchData)
      params.accountId = this.$route.query.accountId
      params.accountType = this.accountType
      params.signContract = this.$route.query.signContract
      if (params.timerange) {
        params.startTime = params.timerange[0]
        params.endTime = params.timerange[1] + ' 59:59:59'
        delete params.timerange
      }
      $getPuttingOrMJAccountVideoList(params).then(res => {
        if (res.code === 1) {
          this.tableData = res.data.accountDetailPlusBOList || []
          this.total = res.data.total
          this.summaryItems.map(item => {
            item.val = res.data[item.key] || 0
            return item
          })
          console.log(this.getChart)
          if (!this.getChart) {
            if (res.data.total > 0) {
              this.chartsData.o_videoColumn = [...(res.data.accountDetailPlusBOList || [])]
              this.formatVideoBarData()
            }
            this.getChart = true
          }
        } else {
          this.$message.error(res.message)
        }
        this.videoBarLoading = false
        this.loading = false
      }).catch(err => {
        if (err.__CANCEL__) {
          return
        }
        this.$message.error(err.message)
        this.loading = false
        this.videoBarLoading = false
      })
    },

    // 格式化video数据
    formatVideoBarData() {
      const videoBar = {
        cates: [],
        terms: [],
        values: []
      }

      videoBar.terms = this.chartsData.o_videoColumn.map(item => {
        return dayjs(item.addTime).format('MM-DD')
      })
      videoBar.terms.reverse()

      for (const key in this.typeMap) {
        const value = []
        this.chartsData.o_videoColumn.forEach(item => {
          value.push(item[key])
        })
        videoBar.cates.push(this.typeMap[key].text)
        videoBar.values.push(value.reverse())
        const max = Math.max(...value)
        const min = Math.min(...value)
        this.typeMap[key].max = max
        this.typeMap[key].min = min
      }
      this.chartsData.videoColumn = videoBar
    },
    // echart配置修改
    formaterVideoConfig(config) {
      const selected = {}
      this.typeList.forEach((item, index) => {
        selected[item.label] = index === 0
      })

      config.legend.selected = selected

      config.tooltip.formatter = (info) => {
        if (!info || !info.length) {
          return
        }

        if (info[0].componentType === 'markLine') {
          return `平均${this.typeMap[this.nowTypes].text}：${info.data.value}`
        }
        const data = this.chartsData.o_videoColumn

        if (!data) {
          return
        }

        const item = data[data.length - info[0].dataIndex - 1]
        if (!item) {
          return
        }
        return [
          `标题: ${item.titleName}`,
          `${this.typeMap[this.nowTypes].text}: ${item[this.nowTypes]}`,
          `发布时间: ${item.addTime}`
        ].join('<br />')
      }
      return config
    },
    hanleEchartChange(s) {
      for (const key in this.typeMap) {
        let type = 'legendUnSelect'
        if (key === s) {
          type = 'legendSelect'
        }
        this.$refs.videoChart.$chart.dispatchAction({
          type,
          name: this.typeMap[key].text
        })
      }
    },
    // 获取账号信息
    getAccountDetail() {
      $orderPutAccountDetail({ accountId: this.$route.query.accountId, accountType: this.accountType }).then(res => {
        if (res.code === 1) {
          this.accountDetaild = res.data || {}
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    onSubmit(data) {
      this.searchData.pageNum = 1
      objectMerge(this.searchData, data)
      this.getList()
    },
    onExport() {},
    onSearchChange() {},
    handleVideoEchatClick(chart) {
      if (chart.componentType === 'series') {
        const data = this.chartsData['o_videoColumn']
        if (!data) {
          return
        }
        const item = data[data.length - chart.dataIndex - 1]
        if (item && item.url) {
          const win = window.open(item.url)
          if (!win) {
            this.$message.error('请允许在本页打开新窗口')
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .detail {
    ::v-deep {
      .account-card {
        &__image {
          width: 64px;
          height: 64px;
          border-radius: 50%;
        }
      }
    }
    &-account {
      position: relative;
      &-time {
        position: absolute;
        right: 0;
        top: 0;
        font-size: 12px;
        color: #BFBFBF;
        line-height: 16px;
      }
    }
    // &-account {
    //   position: relative;
    //   &-img {
    //     flex-shrink: 0;
    //     width: 64px;
    //     height: 64px;
    //     border-radius: 50%;
    //     margin-right: 12px;
    //   }
    //   &-name {
    //     font-size: 16px;
    //     color: #272727;
    //     line-height: 22px;
    //   }
    //   &-plat {
    //     font-size: 12px;
    //     color: #BFBFBF;
    //     line-height: 16px;
    //     img {
    //       width: 14px;
    //       height: 14px;
    //       margin-right: 3px;
    //     }
    //   }
    //   &-time {
    //     position: absolute;
    //     right: 0;
    //     top: 0;
    //     font-size: 12px;
    //     color: #BFBFBF;
    //     line-height: 16px;
    //   }
    // }
    &-list {
      > ul {
        margin-top: 8px;
        li {
          &.block {
            width: 100%;
            max-width: 100%;
          }
          width: 20%;
          max-width: 245px;
          font-size: 16px;
          color: #595959;
          line-height: 22px;
          margin-bottom: 24px;
        }

        .cart {
          width: 40%;
          max-width: 490px;
          font-size: 16px;
          color: #595959;
          line-height: 22px;
          margin-bottom: 24px;
        }
      }
    }
    &-total {
      &-list {
        background: rgba(0, 95, 246, 0.05);
        height: 92px;
        border-radius: 4px;
        li {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-items: center;
          align-items: center;
          span {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
            line-height: 20px;
          }
          strong {
            margin-top: 8px;
            font-size: 30px;
            color: $--color-primary;
            line-height: 32px;
          }
        }
      }
    }
    .video-wrap {
      position: relative;
      .chart-btn-wrap {
        position: absolute;
        top: 24px;
        right: 24px;
      }
      &-tip {
        margin-top: 7px;
        margin-bottom: 34px;
        > div {
          display: flex;
          align-items: flex-end;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.85);
          margin-right: 43px;
          strong {
            font-size: 24px;
            color: $--color-primary;
          }
        }
      }
      ::v-deep {
        .m-chart {
          flex: 1;
        }
        .m-chartCon {
          height: 100%;
        }
      }
    }
  }
  ::v-deep {
    .total-wrap {
      background: rgba(0, 95, 246, 0.05);
    }
    .table-view {
      .q-title {
        display: inline-block;
        line-height: 32px;
        vertical-align: top;
      }
    }
  }
  .account-id {
    line-height: 1.2;
    color: $--color-text-secondary;
  }

</style>
