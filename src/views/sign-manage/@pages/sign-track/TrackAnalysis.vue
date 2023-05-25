<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="已定档期">
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
          <el-form-item label="签约时间">
            <el-date-picker
              v-model="target.model.signContractDate"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            />
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
            content="数据来源于最近12个月类型为视频工单的签约订单，金额为签约订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
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
            content="数据来源于最近12个月类型为视频工单的签约订单，金额为签约订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
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
    <wrap v-loading="loading" class="wrapper-hover m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <img class="item-logo" src="@/assets/plat_2.png">
          <span class="data-title">B站账号-赛道变现数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content="数据来源于最近12个月类型为视频工单的签约订单，金额为签约订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
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
      </div>
      <div>
        <EchartBar v-if="showEcharts" :echarts-data="strackData.biliTrackAccountAnalysisDataBOS" />
      </div>
    </wrap>
    <!--
    <wrap v-loading="loading" class="m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">小红书账号-赛道变现数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content="数据来源于最近12个月类型为视频工单的签约订单，金额为签约订单的流水金额。需要查看全部赛道数据，可使用导出功能。PS：由于部分账号绑定多个赛道标签，导致一个账号的变现数据会被算入到多个赛道中，所以此处统计的数据会比实际变现金额要大"
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
      <div>
        <EchartBar v-if="showEcharts" :echarts-data="strackData.xiaohongshuTrackAccountAnalysisDataBOS" />
      </div>
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
          <TrackPie v-if="showEcharts" :pie-data="trackPieData.kuaishouTrackAccountAnalysisDistributionBOS" />
        </div>
      </wrap>
    </div>
    <div v-loading="loading" class="flex m-t-24">
      <wrap class="track-item wrapper-hover">
        <div class="flex flex-justify-between">
          <div class="flex flex-align-center">
            <img class="item-logo" src="@/assets/plat_2.png">
            <span class="data-title">B站达人-赛道分布</span>
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
        </div>
        <div>
          <TrackPie v-if="showEcharts" :pie-data="trackPieData.biliTrackAccountAnalysisDistributionBOS" />
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
    <TrackPieData v-if="showPieDialog" v-model="showPieDialog" :type="'sign'" :api="'/api/sign/contract/account/analysis/exportDistribution'" :params-obj="paramsObj" />
    <TrackData v-if="showDialog" v-model="showDialog" :params-obj="paramsObj" :api="'/api/sign/contract/account/analysis/exportData'" :track-info-list="trackInfoList" />
  </div>
</template>

<script>
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  toRefs,
  ref
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
import { $getTrackData, $getSignCondition, $getSignTeamInfo } from '@/api/track-anlysis'
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
    const { $store, $message, $refs, $nextTick } =
      getCurrentInstance().proxy
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

    const searchData = ref({
      signContractDate: ''
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'signGroupId',
          data: [],
          conf: {
            placeholder: '签约团队',
            clearable: true,
            filterable: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'id'
        },
        {
          type: 'select',
          key: 'signTeamId',
          data: [],
          conf: {
            placeholder: '签约小组',
            clearable: true,
            filterable: true
          },
          optionLabelKey: 'orgName',
          optionValKey: 'orgId'
        }
      ]

      // 上吉签 不渲染签约小组
      if (+$store.getters.user.userInfo.did === 947) {
        normal.splice(1, 1)
      }
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const formatDateTime = (data) => {
      const params = copy(data)
      if (params.signContractDate && params.signContractDate.length) {
        params.signContractDateBegin = params.signContractDate[0] + ' 00:00:00'
        params.signContractDateEnd = params.signContractDate[1] + ' 23:59:59'
      } else {
        delete params.signContractDateBegin
        delete params.signContractDateEnd
      }
      delete params.signContractDate
      return params
    }
    const onSubmit = (data) => {
      $refs.moreMonth.closeMonthDialog()
      const params = copy(data)
      if (params.signContractDate && params.signContractDate.length) {
        params.signContractDateBegin = params.signContractDate[0] + ' 00:00:00'
        params.signContractDateEnd = params.signContractDate[1] + ' 23:59:59'
      }
      setTimeout(() => {
        console.log($refs.moreMonth.resultTimes)
        Object.assign(searchData.value, params, { belongMonthList: $refs.moreMonth.resultTimes || [] })
        const monthList = searchData.value.belongMonthList || []
        if (monthList.length && params.signContractDateBegin) {
          const month = new Date(params.signContractDateBegin).getMonth() + 1
          const year = new Date(params.signContractDateBegin).getFullYear()
          const signTime = `${year}-${month > 10 ? month : '0' + month}`
          if (monthList[monthList.length - 1] < signTime) {
            $message('签约时间月份不得大于已定档期')
            return
          }
        }
        getRankData()
      }, 0)
    }
    const getProjectSearchList = () => {
      $getSignCondition().then((res) => {
        if (res.code === 1 && res.data) {
          if (normalFormItemMap.signGroupId) {
            normalFormItemMap.signGroupId.data = res.data
          }
        }
      })
    }
    const getTeamIdList = (val) => {
      $getSignTeamInfo({ signGroupId: val }).then((res) => {
        if (res.code === 1 && res.data) {
          if (normalFormItemMap.signTeamId) {
            normalFormItemMap.signTeamId.data = res.data
            states.signTeamList = res.data
          }
        }
      })
    }
    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'signGroupId': // 签约团队
          model.signTeamId = ''
          normalFormItemMap.signTeamId.data = []
          if (val) {
            getTeamIdList(val)
          }
          // $nextTick(() => {
          //   // 上吉签
          //   if (+val === 947) {
          //     const item = formConf.normal.splice(1, 1)
          //     states.deleteItem = item
          //   } else {
          //     if (formConf.normal.length === 3) return
          //     const newNormal = [...formConf.normal]
          //     newNormal.splice(1, 0, ...states.deleteItem)
          //     formConf.normal = newNormal
          //   }
          // })
          break
      }
    }

    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      const params = formatDateTime(searchData.value)
      try {
        $getTrackData(params).then((res) => {
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
      } catch (err) {
       $message.error(err)
      }
    }
    const formatEchartData = (objList = {}) => {
      const obj = {
        tiktokTrackAccountAnalysisDataBOS: {},
        biliTrackAccountAnalysisDataBOS: {},
        xiaohongshuTrackAccountAnalysisDataBOS: {},
        kuaishouTrackAccountAnalysisDataBOS: {}
      }
      // eslint-disable-next-line no-unused-vars
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
      // eslint-disable-next-line no-unused-vars
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
      const params = formatDateTime(searchData.value)
      states.paramsObj = {
        ...params,
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
      const params = formatDateTime(searchData.value)
      window.open(
        `/api/sign/contract/account/analysis/exportData?${qs.stringify({
          ...params,
          platId: plat
        })}`
      )
    }
    const handleExportPieData = (plat) => {
      const params = formatDateTime(searchData.value)
      window.open(
        `/api/sign/contract/account/analysis/exportDistribution?${qs.stringify({
          ...params,
          platId: plat
        })}`
      )
    }
    const submitMonth = (dates) => {
      const dateList = copy(dates)
      const date = dateList && dateList.length ? dateList.sort() : []
      searchData.value.belongMonthList = date
    }
    const resetBtn = () => {
      searchData.value.belongMonthList = []
    }
    buildFormConf()
    getProjectSearchList()
    $nextTick(() => {
       searchData.value.belongMonthList = $refs.moreMonth.resultTimes
       getRankData()
    })

    return {
      did: $store.getters.user.userInfo.did,
      ...toRefs(states),
      formConf,
      onSubmit,
      searchData,
      onChange,
      handleViewData,
      handleExportData,
      submitMonth,
      handleExportPieData,
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
</style>
<style lang="scss">
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

.item-logo{
  width: 30px;
  margin-right: 8px;
}
</style>
