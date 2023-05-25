<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
      >
        <template v-slot:normal>
          <el-form-item class="month" label="成单时间">
            <div class="flex">
              <SelectMoreMonth ref="moreMonth" @submitMonth="submitMonth" @resetBtn="resetBtn" />
              <IconTip
                type="popover"
                class="icon-tip"
                icon-class="iconwenhao"
                content="有效数据统计于2022年2月之后，所以仅支持筛选2022年2月后的数据"
              />
            </div>
          </el-form-item>
        </template>
      </Search>
    </wrap>

    <wrap v-loading="loading" class="wrapper-hover m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <img class="item-logo" src="@/assets/plat_25.png">
          <span class="data-title">抖音账号-赛道变现数据</span>
          <IconTip
            class="icon-tip"
            type="popover"
            content=" 数据来源于最近12个月类型为视频工单的自营订单，金额为自营订单的流水金额。需要查看全部赛道数据，可使用导出功能。 PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
            icon-class="iconwenhao"
          />
          <div class="data-time">
            <span>数据最近更新时间：</span>
            <span>{{ updatedTime }}</span>
          </div>
        </div>
        <div class="popover">
          <el-popover
            placement="top-start"
            popper-class="my-popover"
            width="150"
            trigger="hover"
          >
            <template>
              <div>
                <p class="popover-p" @click="handleViewData(strackData.tiktokTrackAccountAnalysisDataBOS,25)">
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(25)">
                  导出
                </p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div>
        <EchartBar v-if="showEcharts" :echarts-data="strackData.tiktokTrackAccountAnalysisDataBOS" />
      </div>
    </wrap>
    <wrap v-loading="loading" class="wrapper-hover m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <img class="item-logo" src="@/assets/plat_26.png">
          <span class="data-title">快手账号-赛道变现数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content=" 数据来源于最近12个月类型为视频工单的自营订单，金额为自营订单的流水金额。需要查看全部赛道数据，可使用导出功能。 PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
            icon-class="iconwenhao"
          />
          <div class="data-time">
            <span>数据最近更新时间：</span>
            <span>{{ updatedTime }}</span>
          </div>
        </div>
        <div class="popover">
          <el-popover
            placement="top-start"
            popper-class="my-popover"
            width="150"
            trigger="hover"
          >
            <template>
              <div>
                <p class="popover-p" @click="handleViewData(strackData.kuaishouTrackAccountAnalysisDataBOS,26)">
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(26)">
                  导出
                </p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div>
        <EchartBar v-if="showEcharts" :echarts-data="strackData.kuaishouTrackAccountAnalysisDataBOS" />
      </div>
    </wrap>
    <!-- <wrap v-loading="loading" class="m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">B站账号-赛道变现数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content="数据来源于最近12个月类型为视频工单的自营订单，金额为自营订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
            icon-class="iconwenhao"
          />
          <div class="data-time">
            <span>数据最近更新时间：</span>
            <span>{{ updatedTime }}</span>
          </div>
        </div>
        <el-popover
          placement="top-start"
          popper-class="my-popover"
          width="150"
          trigger="hover"
        >
          <template>
            <div>
              <p class="popover-p" @click="handleViewData(strackData.biliTrackAccountAnalysisDataBOS,2)">
                查看数据
              </p>
              <p class="popover-p" @click="handleExportData(2)">
                导出
              </p>
            </div>
          </template>
          <i slot="reference" class="iconfont icondiandiandianshu" />
        </el-popover>
      </div>
      <EchartBar v-if="showEcharts" :echarts-data="strackData.biliTrackAccountAnalysisDataBOS" />
    </wrap> -->
    <!-- <wrap v-loading="loading" class="m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">小红书账号-赛道变现数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content="数据来源于最近12个月类型为视频工单的自营订单，金额为自营订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
            icon-class="iconwenhao"
          />
          <div class="data-time">
            <span>数据最近更新时间：</span>
            <span>{{ updatedTime }}</span>
          </div>
        </div>
        <el-popover
          placement="top-start"
          popper-class="my-popover"
          width="150"
          trigger="hover"
        >
          <template>
            <div>
              <p class="popover-p" @click="handleViewData(strackData.xiaohongshuTrackAccountAnalysisDataBOS,45)">
                查看数据
              </p>
              <p class="popover-p" @click="handleExportData(45)">
                导出
              </p>
            </div>
          </template>
          <i slot="reference" class="iconfont icondiandiandianshu" />
        </el-popover>
      </div>
      <EchartBar v-if="showEcharts" :echarts-data="strackData.xiaohongshuTrackAccountAnalysisDataBOS" />
    </wrap> -->
    <div v-loading="loading" class="flex m-t-24">
      <wrap class="track-item wrapper-hover">
        <div class="flex flex-justify-between">
          <div class="flex flex-align-center">
            <img class="item-logo" src="@/assets/plat_25.png">
            <span class="data-title">抖音达人-赛道分布</span>
            <div class="data-time">
              <span>数据最近更新时间：</span>
              <span>{{ updatedTime }}</span>
            </div>
          </div>
          <div class="popover">
            <el-popover
              placement="top-start"
              popper-class="my-popover"
              width="150"
              trigger="hover"
            >
              <template>
                <div>
                  <p class="popover-p" @click="handleViewData(trackPieData.tiktokTrackAccountAnalysisDistributionBOS,25,'pie')">
                    查看数据
                  </p>
                  <p class="popover-p" @click="handleExportPieData(25)">
                    导出
                  </p>
                </div>
              </template>
              <i slot="reference" class="iconfont icondiandiandianshu" />
            </el-popover>
          </div>
        </div>
        <div>
          <TrackPie v-if="showEcharts" :pie-data="trackPieData.tiktokTrackAccountAnalysisDistributionBOS" />
        </div>
      </wrap>
      <wrap class="track-item wrapper-hover">
        <div class="flex flex-justify-between">
          <div class="flex flex-align-center">
            <img class="item-logo" src="@/assets/plat_26.png">
            <span class="data-title">快手达人-赛道分布</span>
            <div class="data-time">
              <span>数据最近更新时间：</span>
              <span>{{ updatedTime }}</span>
            </div>
          </div>
          <div class="popover">
            <el-popover
              placement="top-start"
              popper-class="my-popover"
              width="150"
              trigger="hover"
            >
              <template>
                <div>
                  <p class="popover-p" @click="handleViewData(trackPieData.kuaishouTrackAccountAnalysisDistributionBOS,26,'pie')">
                    查看数据
                  </p>
                  <p class="popover-p" @click="handleExportPieData(26)">
                    导出
                  </p>
                </div>
              </template>
              <i slot="reference" class="iconfont icondiandiandianshu" />
            </el-popover>
          </div>
        </div>
        <div>
          <TrackPie :pie-data="trackPieData.kuaishouTrackAccountAnalysisDistributionBOS" />
        </div>
      </wrap>
    </div>
    <!-- <div v-loading="loading" class="flex m-t-24">
      <wrap class="track-item">
        <div class="flex flex-justify-between">
          <div class="flex flex-align-center">
            <span class="data-title">B站达人-赛道分布</span>
            <div class="data-time">
              <span>数据最近更新时间：</span>
              <span>{{ updatedTime }}</span>
            </div>
          </div>
          <el-popover
            placement="top-start"
            popper-class="my-popover"
            width="150"
            trigger="hover"
          >
            <template>
              <div>
                <p class="popover-p" @click="handleViewData(trackPieData.biliTrackAccountAnalysisDistributionBOS,2,'pie')">
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportPieData(2)">
                  导出
                </p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
        <TrackPie v-if="showEcharts" :pie-data="trackPieData.biliTrackAccountAnalysisDistributionBOS" />
      </wrap>
      <wrap class="track-item">
        <div class="flex flex-justify-between">
          <div class="flex flex-align-center">
            <span class="data-title">小红书达人-赛道分布</span>
            <div class="data-time">
              <span>数据最近更新时间：</span>
              <span>{{ updatedTime }}</span>
            </div>
          </div>
          <el-popover
            placement="top-start"
            popper-class="my-popover"
            width="150"
            trigger="hover"
          >
            <template>
              <div>
                <p class="popover-p" @click="handleViewData(trackPieData.xiaohongshuTrackAccountAnalysisDistributionBOS,45,'pie')">
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportPieData(45)">
                  导出
                </p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
        <TrackPie v-if="showEcharts" :pie-data="trackPieData.xiaohongshuTrackAccountAnalysisDistributionBOS" />
      </wrap>
    </div> -->
    <TrackPieData v-if="showPieDialog" v-model="showPieDialog" :api="'/api/account/analysis/exportDistribution'" :params-obj="paramsObj" />
    <TrackData v-if="showDialog" v-model="showDialog" :api="'/api/account/analysis/exportData'" :params-obj="paramsObj" :track-info-list="trackInfoList" />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  getCurrentInstance
} from '@vue/composition-api'
import {
  Search,
  IconTip,
  EchartBar,
  TrackPie,
  TrackData,
  TrackPieData,
  SelectMoreMonth
} from 'components'
import { $getSelfData } from '@/api/track-anlysis'
import { $getOrgList } from '@/api/operating-manage'
import qs from 'qs'
import { copy } from '@/utils'
export default defineComponent({
  components: {
    Search,
    IconTip,
    EchartBar,
    TrackPie,
    TrackData,
    SelectMoreMonth,
    TrackPieData
  },
  setup(props) {
    const { $message, $refs, $nextTick } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: []
    })
    const states = reactive({
      signTeamList: [],
      deleteItem: [],
      showDialog: false,
      strackData: {
      tiktokTrackAccountAnalysisDataBOS: {},
      kuaishouTrackAccountAnalysisDataBOS: {},
      xiaohongshuTrackAccountAnalysisDataBOS: {},
      biliTrackAccountAnalysisDataBOS: {}
      },
      trackPieData: {
        tiktokTrackAccountAnalysisDistributionBOS: {},
        kuaishouTrackAccountAnalysisDistributionBOS: {},
        xiaohongshuTrackAccountAnalysisDistributionBOS: {},
        biliTrackAccountAnalysisDistributionBOS: {}
      },
      loading: false,
      updatedTime: '',
      trackInfoList: {},
      EchartType: '',
      showPieDialog: false,
      paramsObj: {},
      showEcharts: false
    })

    const searchData = ref({})
    const normalFormItemMap = {}
   const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'workTeamId',
          data: [],
          conf: {
            placeholder: '工作室',
            clearable: true,
            filterable: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })

      formConf.normal = normal
    }
    const onSubmit = (data) => {
      $refs.moreMonth.closeMonthDialog()
      setTimeout(() => {
        Object.assign(searchData.value, data, { belongMonthList: $refs.moreMonth.resultTimes || [] })
        getRankData()
      }, 0)
    }
     const getOrgList = () => {
      $getOrgList().then(res => {
        normalFormItemMap.workTeamId.data = res.data
      })
      .catch((err) => {
          console.error(err)
        })
    }

    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      $getSelfData(searchData.value).then((res) => {
        states.loading = false
        states.showEcharts = true
        if (res.code === 1 && res.data) {
          if (res.data.trackAccountAnalysisData) {
            states.updatedTime = res.data.updatedTime
            states.strackData = formatEchartData(res.data.trackAccountAnalysisData || {})
            states.trackPieData = foramtPieData(res.data.trackAccountAnalysisdistribution || {})
          }
        } else {
          states.strackData = {}
          states.trackPieData = {}
          states.updatedTime = ''
        }
      }).catch(err => {
       console.log(err)
      })
    }
    const formatEchartData = (objList = {}) => {
      const obj = {
        tiktokTrackAccountAnalysisDataBOS: {},
        biliTrackAccountAnalysisDataBOS: {},
        xiaohongshuTrackAccountAnalysisDataBOS: {},
        kuaishouTrackAccountAnalysisDataBOS: {}
      }
      for (const k in objList) {
        if (objList[k].terms.length) {
          obj[k].cates = objList[k].months
          obj[k].terms = objList[k].terms
          obj[k].termTotal = objList[k].totalValues
          obj[k].values = objList[k].values
        }
      }
      return obj
    }
    const foramtPieData = (objList = {}) => {
      const obj = {
        tiktokTrackAccountAnalysisDistributionBOS: {
          terms: [],
          values: [],
          otherType: [],
          percents: []
        },
        kuaishouTrackAccountAnalysisDistributionBOS: {
          terms: [],
          values: [],
          otherType: [],
          percents: []
        },
        xiaohongshuTrackAccountAnalysisDistributionBOS: {
          terms: [],
          values: [],
          otherType: [],
          percents: []
        },
        biliTrackAccountAnalysisDistributionBOS: {
          terms: [],
          values: [],
          otherType: [],
          percents: []
        }
      }
      for (const k in objList) {
        (objList[k].distributionBOS || []).forEach(item => {
          obj[k].terms.push(item.trackName)
          obj[k].values.push(item.accountNum)
          obj[k].percents.push(item.accountPercent)
        })
        obj[k].otherType = objList[k].otherType
      }
      return obj
    }
    const handleViewData = (data, platId, type = '') => {
      states.paramsObj = {
          ...searchData.value,
          platId
        }
      if (type) {
        states.showPieDialog = true
      } else {
         states.trackInfoList = data
         states.showDialog = true
      }
    }
    const handleExportData = (plat) => {
      window.open(
        `/api/account/analysis/exportData?${qs.stringify({
          ...searchData.value,
          platId: plat
        })}`
      )
    }
    const handleExportPieData = (plat) => {
      console.log(searchData.value)
      window.open(
        `/api/account/analysis/exportDistribution?${qs.stringify({
          ...searchData.value,
          platId: plat
        })}`
      )
    }
    const resetBtn = () => {
      searchData.value.belongMonthList = []
    }
    const submitMonth = (dates) => {
      const dateList = copy(dates)
      const date = dateList && dateList.length ? dateList.sort() : []
      searchData.value.belongMonthList = date
    }
    buildFormConf()
    getOrgList()
    $nextTick(() => {
       searchData.value.belongMonthList = $refs.moreMonth.resultTimes
       getRankData()
    })
    return {
      ...toRefs(states),
      formConf,
      onSubmit,
      searchData,
      handleViewData,
      handleExportData,
      handleExportPieData,
      submitMonth,
      resetBtn
    }
  }
})
</script>

<style lang="scss" scoped>
.data-title {
  font-size: 16px;
  font-weight: 500;
  margin-right: 4px;
}
.data-time {
  font-size: 12px;
  color: #939090;
  margin-left: 14px;
}

.iconwenhao:before {
  color: #939090 !important;
}
.track-item {
  flex: 1;
}
.track-item:nth-child(2n) {
  margin-left: 16px;
}
.icon-tip {
  ::v-deep {
    .iconfont {
      color: #939090;
    }
  }
}
.icondiandiandianshu {
  color: #939090;
}
.popover-p {
  line-height: 24px;
  padding-left: 20px;
  cursor: pointer;
}
.popover-p:first-child {
  border-bottom: 1px solid #eee;
}
.popover-p:hover {
  color: rgb(96, 162, 255);
}
.my-popover {
  padding: 20px 0px;
}
.popover{
  opacity: 0;
}
.wrapper-hover:hover{
  .popover{
    opacity: 1;
  }
}
// .chartBox {
//   height: 380px;
// }
.item-logo{
  width: 30px;
  margin-right: 8px;
}
</style>

