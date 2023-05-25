<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
      >
        <template v-slot:normal>
          <el-form-item label="已定档期">
            <div class="flex">
              <SelectMoreMonth
                ref="moreMonth"
                :schedule="schedule"
                @submitMonth="submitMonth"
                @resetBtn="resetBtn"
              />
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
          <span class="data-title">{{ title }}-抖音账号-赛道变现数据</span>
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
                <p
                  class="popover-p"
                  @click="
                    handleViewData(
                      strackData.tiktokTrackAccountAnalysisDataBOS,
                      25
                    )
                  "
                >
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(25)">导出</p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div class="chartBox">
        <EchartBar
          v-if="showEcharts"
          :echarts-data="strackData.tiktokTrackAccountAnalysisDataBOS"
          :unit="1"
        />
      </div>
    </wrap>
    <wrap v-loading="loading" class="wrapper-hover m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <img class="item-logo" src="@/assets/plat_26.png">
          <span class="data-title">{{ title }}-快手账号-赛道变现数据</span>
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
                <p
                  class="popover-p"
                  @click="
                    handleViewData(
                      strackData.kuaishouTrackAccountAnalysisDataBOS,
                      26
                    )
                  "
                >
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(platId)">导出</p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div class="chartBox">
        <EchartBar
          v-if="showEcharts"
          :echarts-data="strackData.kuaishouTrackAccountAnalysisDataBOS"
          :unit="1"
        />
      </div>
    </wrap>
    <!-- <wrap v-loading="loading" class="m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">B站账号-赛道变现数据</span>
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
      <div class="chartBox">
        <EchartBar v-if="showEcharts" :echarts-data="strackData.biliTrackAccountAnalysisDataBOS" />
      </div>
    </wrap>
    <wrap v-loading="loading" class="m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">小红书账号-赛道变现数据</span>
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
      <div class="chartBox">
        <EchartBar v-if="showEcharts" :echarts-data="strackData.xiaohongshuTrackAccountAnalysisDataBOS" />
      </div>
    </wrap> -->
    <!-- <TrackPieData v-if="showPieDialog" v-model="showPieDialog" :type="'sign'" :api="'/api/sign/contract/account/analysis/exportDistribution'" :params-obj="paramsObj" /> -->
    <TrackData
      v-if="showDialog"
      v-model="showDialog"
      :params-obj="paramsObj"
      :api="'/api/industry/analysis/jump/export'"
      :track-info-list="trackInfoList"
    />
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
import { $getJumpData, $getQueryCondition } from '@/api/track-anlysis'
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
    const { $route, $store, $message, $refs, $nextTick, $set } =
      getCurrentInstance().proxy

    const formConf = reactive({
      normal: []
    })
    const states = reactive({
      loading: false,
      schedule: '',
      platId: 25,
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
      updatedTime: '',
      trackInfoList: {},
      EchartType: '',
      showPieDialog: false,
      paramsObj: {},
      showEcharts: false,
      title: ''
    })
    const searchData = ref({})
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'groupId',
          data: [],
          conf: {
            placeholder: '请选择商务团队',
            clearable: true,
            filterable: true
          },
          optionLabelKey: 'crmGroupName',
          optionValKey: 'crmGroupId'
        },
        {
          type: 'select',
          key: 'teamId',
          data: [],
          conf: {
            placeholder: '请选择商务小组',
            clearable: true,
            filterable: true
          },
          optionLabelKey: 'crmTeamName',
          optionValKey: 'crmTeamId'
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
        Object.assign(searchData.value, data, {
          belongMonthList: $refs.moreMonth.resultTimes || []
        })
        getRankData()
      }, 0)
    }
    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'groupId': // 签约团队
          model.teamId = ''
          normalFormItemMap.teamId.data = []
          normalFormItemMap.teamId.data = states.crmTeamInfoBOList.filter(
            (item) => {
              if (item.crmGroupId === val) return item
            }
          )
          break
      }
    }

    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      try {
        $getJumpData(searchData.value)
          .then((res) => {
            states.loading = false
            states.showEcharts = true
            if (res.code === 1 && res.data) {
              states.updatedTime = res.data.updatedTime
              const objList = copy(res.data)
              delete objList.updatedTime
              states.strackData = formatEchartData(objList || {})
            } else {
              states.strackData = {}
              states.updatedTime = ''
            }
          })
          .catch((err) => {
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
        `/api/sign/contract/account/analysis/exportData?${qs.stringify({
          ...searchData.value,
          platId: plat
        })}`
      )
    }
    const handleExportPieData = (plat) => {
      window.open(
        `/api/industry/analysis/jump/export?${qs.stringify({
          ...searchData.value,
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
    const getRankCondition = async() => {
      const res = await $getQueryCondition()
      normalFormItemMap.groupId.data = res.data.crmGroupInfoBOList || []
      normalFormItemMap.teamId.data = res.data.crmTeamInfoBOList || []
      states.crmTeamInfoBOList = res.data.crmTeamInfoBOList || []
      if (searchData.groupId) {
        normalFormItemMap.teamId.data = states.crmTeamInfoBOList.filter(
          (item) => {
            if (+item.crmGroupId === +searchData.groupId) return item
          }
        )
      }
    }
    buildFormConf()
    if (Object.keys($route.query).length) {
      states.title = $route.query.firstField || $route.query.secondField
      states.schedule = $route.query.months || ''
      $nextTick(() => {
        $set($refs.search.form, 'groupId', +$route.query.groupId || '')
        $set($refs.search.form, 'teamId', +$route.query.teamId || '')
      })
      searchData.value.groupId = $route.query.groupId || ''
      searchData.value.teamId = $route.query.teamId || ''
    }
    getRankData()
    getRankCondition()
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
.popover {
  opacity: 0;
}
.wrapper-hover:hover {
  .popover {
    opacity: 1;
  }
}
// .chartBox {
//   height: 380px;
// }
.item-logo {
  width: 30px;
  margin-right: 8px;
}
</style>
