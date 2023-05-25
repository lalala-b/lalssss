<template>
  <div>
    <Wrap>
      <div class="xingtuVideo-wrap">
        <div class="flex flex-dir-col">
          <h3 data-bold>
            <div v-if="platId==='25'">
              <svg data-v-c8a70580="" data-v-5c48a1c0="" aria-hidden="true" class="el-tooltip svg-icon" aria-describedby="el-tooltip-9676" tabindex="0">
                <use data-v-c8a70580="" xlink:href="#icon-xintu" />
              </svg>
              巨量星图数据
              <IconTip icon-class="iconwenhao" content="统计近30天达人星图视频的数据，不包含被删除视频后的数据" />
            </div>
            <div v-else-if="platId==='26'">
              <svg data-v-c8a70580="" data-v-5c48a1c0="" aria-hidden="true" class="el-tooltip svg-icon" aria-describedby="el-tooltip-5145" tabindex="0">
                <use data-v-c8a70580="" xlink:href="#icon-juxing" />
              </svg>
              磁力聚星数据
              <!-- <IconTip icon-class="iconwenhao" content="统计近30天达人星图视频的数据，不包含被删除视频后的数据" /> -->
            </div>
          </h3>
          <div class="flex flex-align-center flex-justify-between flex-wrap">
            <template v-if="platId==='25'">
              <div v-for="item in xtVideoDataList" :key="item.title" class="video-item flex flex-center flex-dir-col" style="width:20%; margin-top:10px;">
                <p class="item-title">{{ item.title }}<IconTip v-if="item.tipContent" icon-class="iconwenhao" :content="item.tipContent" /></p>
                <p>{{ item.value | toThousandsW }}</p>
              </div>
            </template>
            <template v-else-if="platId==='26'">
              <div v-for="item in ksVideoDataList" :key="item.title" class="video-item flex flex-center flex-dir-col" style="width:20%; margin-top:10px;">
                <p class="item-title">{{ item.title }}<IconTip v-if="item.tipContent" icon-class="iconwenhao" :content="item.tipContent" /></p>
                <p>{{ item.value | toThousandsW }}</p>
                <!-- <span v-if="item.desc" class="normal">{{ item.desc }}</span> -->
              </div>
            </template>
          </div>
        </div>
        <!-- <ul class="summer-list m-t-10">
          <li v-for="item in summerList" :key="item.key">
            <h4>{{ item.text }}</h4>
            <p>{{ item.val | toThousandsW }}</p>
          </li>
        </ul> -->
      </div>
    </Wrap>
    <Sum class="m-t-16" :time-list="timeList" :summer-list="summerList" @search="handleTimeRangeChange">
      <template slot="tipContent">
        新增粉丝：时间段内账号粉丝增量<br>
        新增标题：时间段内账号发布视频数量<br>
        新增流量：账号所有发布视频在时间段内的新增流量汇总<br>
        新增点赞：账号所有发布视频在时间段内的新增点赞汇总<br>
        新增评论：账号所有发布视频在时间段内的新增评论汇总<br>
        新增转发：账号所有发布视频在时间段内的新增转发汇总<br>
      </template>
    </Sum>
    <Wrap class="m-t-16">
      <div class="flex flex-wrap">
        <div
          class="chart-item w-50"
        >
          <Title title="粉丝趋势" icon="iconfensi_fill" class="p-0" />
          <VChart type="line" :config="config" :data="chartsData.fansLine" :loading="fansLoading" />
        </div>
        <div class="chart-item w-50">
          <Title title="点赞趋势" icon="icondianzan_fill" class="p-0" />
          <VChart :loading="videoLineLoading" :config="config" :data="chartsData.link" />
        </div>
        <div class="chart-item w-50">
          <Title title="评论趋势" icon="iconpinglun_fill" class="p-0" />
          <VChart :loading="videoLineLoading" :config="config" :data="chartsData.comment" />
        </div>
        <div class="chart-item w-50">
          <Title title="转发趋势" icon="iconzhuanfa_fill" class="p-0" />
          <VChart :loading="videoLineLoading" :config="config" :data="chartsData.forward" />
        </div>
      </div>
    </Wrap>
    <Wrap class="m-t-24">
      <div class="charts-container">
        <div class="chart-item">
          <p class="chart-name bold">最近15条视频数据表现</p>
          <el-radio-group v-model="nowTypes" class="m-t-24" size="small" @change="hanleEchartChange">
            <template v-for="item in typeList">
              <el-radio-button
                :key="item.label"
                data-burry_btn_name="tab"
                :data-burry_title="item.val"
                :label="item.val"
              >{{ item.label }}</el-radio-button>
            </template>
          </el-radio-group>
          <p class="m-t-24 m-b-10">最近15条视频种最低{{ typeMap[nowTypes].text }}为<strong>{{ typeMap[nowTypes].min }}</strong>  最高{{ typeMap[nowTypes].text }}为<strong>{{ typeMap[nowTypes].max }}</strong></p>
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
      </div>
    </Wrap>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { $getVideoList } from '@/api/details'
import { $accountFansChart, $accountVideoChart, $getAccountDataNum } from '@/api/account-manage'
import Sum from '../_com/Sum'
import { VChart, Title } from 'components'
import IconTip from '@/components/IconTip'
export default {
  components: {
    Sum,
    VChart,
    Title,
    IconTip
  },
  props: {
    accountType: {
      type: [Number, String],
      default: '0'
    },
    xtInfo: {
      type: Object,
      default: () => ({})
    },
    ksInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      fansLoading: false,
      videoLineLoading: false,
      videoBarLoading: false,
      btnType: '',
       timeList: [
        {
          label: '0',
          text: '昨日',
          value: 0,
          start: -1
        },
        {
          label: '1',
          text: '近7日',
          value: -7,
          start: -1
        },
        {
          label: '2',
          text: '近30日',
          value: -30,
          start: -1
        }
      ],
      summerList: [
        {
          text: '新增粉丝',
          key: 'addFans',
          val: '--'
        },
        {
          text: '新增视频',
          key: 'addTitle',
          val: '--'
        },
        {
          text: '新增播放量',
          key: 'addFlow',
          val: '--'
        },
        {
          text: '新增点赞量',
          key: 'addDig',
          val: '--'
        },
        {
          text: '新增评论量',
          key: 'addCom',
          val: '--'
        },
        {
          text: '新增转发量',
          key: 'addShare',
          val: '--'
        }
      ],
      xtVideoDataList: {
        expectPlayVolume: {
          title: '预期播放量',
          value: '',
          tipContent: '近30天达人星图视频的预期播放量，数据来源为星图平台，每周更新一次，可能存在一定偏差'
        },
        playMedian: {
          title: '播放中位数',
          value: '',
          tipContent: '达人最近30天的星图视频播放中位数'
        },
        expectCpm: {
          title: '预期CPM',
          value: '',
          tipContent: '近30天，达人20-60s视频的预期CPM，数据来源为星图平台，每周更新一次，可能存在一定偏差'
        },
        workInteractionRate: {
          title: '互动率',
          value: '',
          tipContent: '近30天星图视频互动率'
        },
        completePlayRate: {
          title: '完播率',
          value: '',
          tipContent: '近30天星图视频完播率'
        },
        // avgDurationTime: {
        //   title: '平均时长',
        //   value: '',
        //   tipContent: '近30天星图视频平均时长'
        // },
        avgLike: {
          title: '平均点赞',
          value: '',
          tipContent: '近30天星图视频平均点赞'
        },
        avgComment: {
          title: '平均评论',
          value: '',
          tipContent: '近30天星图视频平均评论'
        },
        avgShare: {
          title: '平均转发',
          value: '',
          tipContent: '近30天星图视频平均转发'
        },
        fansActiveRate: {
          title: '粉丝活跃率',
          value: '',
          tipContent: ''
        },
        fansIncreaseRate: {
          title: '粉丝增长率',
          value: '',
          tipContent: ''
        }
      },
      ksVideoDataList: {
        expectPlayVolume: {
          title: '预估播放量',
          value: ''
          // tipContent: '近30天达人星图视频的预期播放量，数据来源为星图平台，每周更新一次，可能存在一定偏差'
        },
        expectCpm: {
          title: '预期CPM',
          value: ''
          // tipContent: '近30天，达人20-60s视频的预期CPM，数据来源为星图平台，每周更新一次，可能存在一定偏差'
        },
        completePlayRate: {
          title: '完播率',
          value: '',
          tipContent: '达人近期发布的视频中，被完整播放的概率，仅统计7日自然流量的数据'
        },
        interactRate: {
          title: '互动率',
          value: '',
          tipContent: '达人近期发布的作品中，被点赞、评论、分享的概率，仅统计7日自然流量的数据'
        },
        playMedian: {
          title: '播放量中位数',
          value: '',
          tipContent: '达人近期发布的视频中，处于中位数水平的自然流量7日播放量'
        },
        viewCntAvg: {
          title: '平均播放量',
          value: '',
          tipContent: '近15个视频的平均播放量'
        },
        likeCntAvg: {
          title: '平均点赞量',
          value: '',
          tipContent: '近15个视频的平均点赞量'
        },
        commentCntAvg: {
          title: '平均评论量',
          value: '',
          tipContent: '近15个视频的平均评论量'
        },
        forwardCntAvg: {
          title: '平均分享量',
          value: '',
          tipContent: '近15个视频的平均分享量'
        }
      },
      nowTypes: 'thumbUpCount',
      config: {
        yAxis: [{
          type: 'value'
        }, {
          type: 'value'
        }],
        seriesConfig: {
          type: 'line',
          data: null
        }
      },
      videoColumConfig: {
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
        grid: {
          left: 80,
          right: 50,
          top: 10,
          bottom: 20
        },
        legend: {
          show: false
        }
      },
      chartsData: {
        fansLine: null,
        link: null,
        comment: null,
        forward: null,
        videoColumn: null,
        o_videoColumn: null
      },
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
      typeList: [{
        label: '点赞量',
        val: 'thumbUpCount'
      }, {
        label: '评论量',
        val: 'commentCount'
      }, {
        label: '转发量',
        val: 'forwardedCount'
      }]
    }
  },
  computed: {
    isInWard() {
      const accountType = [2, 30]
      return !accountType.includes(Number(this.accountType))
    }
  },
  watch: {
    isInWard(val) {
      if (!val) {
        this.summerList = this.summerList.filter(item => item.key !== 'addFlow')
      }
      if (val) {
        this.typeMap.flowCount = {
          text: '播放量',
          max: 0,
          min: 0
        }
        this.typeList.unshift({
          label: '播放量',
          val: 'flowCount'
        })
        this.nowTypes = 'flowCount'
      }
    },

    xtInfo: {
      handler(val) {
        const arr = []
        Object.keys(val).forEach(item => {
          const obj = {}
          obj.name = item
          obj.value = val[item]
          arr.push(obj)
        })
        arr.forEach(item => {
          if (item.name in this.xtVideoDataList) {
            this.xtVideoDataList[item.name].value = item.value
          }
        })
        Object.values(this.xtVideoDataList).forEach(item => {
          if (item.title.indexOf('率') !== -1) {
            item.value = this.toRateNumber(item.value)
          }
        })
        // console.log(this.xtVideoDataList, 'xtVideoDataList')
      },
      immediate: true
    },

    ksInfo: {
      handler(val) {
        const arr = []
        Object.keys(val).forEach(item => {
          const obj = {}
          obj.name = item
          obj.value = val[item]
          arr.push(obj)
        })

        arr.forEach(item => {
          if (item.name in this.ksVideoDataList) {
            this.ksVideoDataList[item.name].value = item.value
          }
          // if (item.name === 'receiveOrderRateDesc') {
          //   this.ksVideoDataList['receiveOrderRate'].desc = item.value
          // }
          // if (item.name === 'completeOrderRateDesc') {
          //   this.ksVideoDataList['completeOrderRate'].desc = item.value
          // }
        })

        // console.log(arr, 'arr')
         Object.values(this.ksVideoDataList).forEach(item => {
          if (item.title.indexOf('率') !== -1) {
            item.value = this.toRateNumber(item.value)
          }
        })
        // console.log(this.ksVideoDataList, 'ksVideoDataList')
      },
      immediate: true
    }
  },
  // watch: {
  //   accountType(val) {
  //     this.getVideoListData()
  //   }
  // },
  created() {
    this.accountId = this.$route.params.accountId
    this.platId = this.$route.params.platId

    this.accountFansChart()
    this.accountVideoLine()
    this.getVideoListData()
  },
  methods: {
    // 将数据转为百分率形式
    toRateNumber(str) {
      return ((Math.round((str * 10000))) / 100.00).toFixed(1) + '%'
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
    handleTimeRangeChange(timerange) {
      const params = {}
      if (timerange) {
        params.startDate = timerange[0]
        params.endDate = timerange[1] + ' 23:59:59'
      }
      this.getAccountTotalData(params)
    },
    handleBtnChange() {},
    // 获取统计数据
    getAccountTotalData(parmas) {
      $getAccountDataNum({
        ...parmas,
        accountId: this.accountId,
        platId: this.platId
      }).then(res => {
        this.summerList.forEach(item => {
          item.val = res.data[item.key] || 0
        })
      })
    },
    // 获取粉丝动态
    accountFansChart() {
      this.fansLoading = true
      $accountFansChart({
        accountId: this.accountId
      }).then(res => {
        if (res.code === 1) {
          const fansLine = {
            cates: res.data.cates ? res.data.cates.map(item => item.typeName) : [],
            terms: res.data.terms || [],
            values: res.data.values || []
          }
          this.chartsData.fansLine = fansLine
        this.fansLoading = false
        }
      }).catch(err => {
        this.fansLoading = false
      })
    },
    // 获取视频数据动态
    accountVideoLine() {
      this.videoLineLoading = true
      $accountVideoChart({
        accountId: this.accountId
      }).then(res => {
        if (res.code === 1) {
          if (!res.data.cates) {
            const none = {
              cates: [],
              terms: [],
              values: []
            }
            this.chartsData.link = none
            this.chartsData.comment = none
            this.chartsData.forward = none
            this.videoLineLoading = false
            return
          }
          const echartMap = {
            link: ['allDig', 'addDig'], // 点赞
            comment: ['allCom', 'addCom'], // 评论
            forward: ['allShare', 'addShare'] // 分享
          }
          ;['link', 'comment', 'forward'].forEach((item, index) => {
            const arr = echartMap[item]
            const cates = []
            const values = []
            arr.forEach(item => {
              const index = res.data.cates.findIndex(i => i.typeCode === item)
              cates.push(res.data.cates[index].typeName)
              values.push(res.data.values[index])
            })
            this.chartsData[item] = {
              terms: res.data.terms,
              cates,
              values
            }
          })
        } else {
          this.$message.error(res.message)
        }
        this.videoLineLoading = false
      }).catch(err => {
        this.videoLineLoading = false
      })
    },
    // 获取15条视频数据
    getVideoListData() {
      this.videoBarLoading = true
      $getVideoList({ size: 15, accountId: this.accountId, platId: this.platId }).then(res => {
        if (res.code === 1) {
          this.chartsData.o_videoColumn = res.data
          this.formatVideoBarData()
        } else {
          this.$message.error(res.message)
        }
        this.videoBarLoading = false
      }).catch(err => {
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
          value.unshift(item[key])
        })
        videoBar.cates.push(this.typeMap[key].text)
        videoBar.values.push(value)
        if (value.length) {
          const max = Math.max(...value)
          const min = Math.min(...value)
          this.typeMap[key].max = max
          this.typeMap[key].min = min
        }
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
  @include themify($themes) {
    .live-time {
      display: flex;
      align-items: center;
    }
    .chart-name {
      font-size: 16px;
      line-height: 32px;
      color: themed('font_color');
    }
    .w-50 {
      width: 50%;
    }
    .video-item{
      position:relative;
      p {
        line-height: 32px;
        font-size: 24px;
        font-weight: bold;
        color: $--color-primary;
      }

      .item-title{
        color: #333;
        font-size: 14px;
        font-weight: normal;
      }

      .normal{
        position:absolute;
        top:6%;
        right:21%;
        border:1px solid #ccc;
        color:#ccc;
        border-radius:8px;
        padding:2px 8px;
        font-size:12px;
      }
    }
    h3 {
      font-size: 16px;
    }
    .svg-icon {
      width: 1.2em;
      height: 1.2em;
      vertical-align: middle;
      fill: currentColor;
      overflow: hidden;
    }
  }
</style>
