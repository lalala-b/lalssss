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
          <span class="data-title">一级行业营收数据</span>
          <IconTip
            class="icon-tip"
            type="popover"
            content="数据来源于最近12个月的商单，金额为商单的销售收入。需要查看全部赛道数据，可使用导出功能"
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
                <p
                  class="popover-p"
                  @click="handleViewData(strackData.firstFieldData, 1)"
                >
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(1)">导出</p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div class="chartBox">
        <EchartBar
          v-if="showEcharts"
          :source="'business'"
          :industry-type="'1'"
          :search-data="searchData"
          :echarts-data="strackData.firstFieldData"
        />
      </div>
    </wrap>
    <wrap v-loading="loading" class="wrapper-hover m-t-24">
      <div class="flex flex-justify-between">
        <div class="flex flex-align-center m-b-16">
          <span class="data-title">二级行业营收数据</span>
          <IconTip
            type="popover"
            class="icon-tip"
            content="数据来源于最近12个月的商单，金额为商单的销售收入。需要查看全部赛道数据，可使用导出功能"
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
                <p
                  class="popover-p"
                  @click="handleViewData(strackData.secondFieldData, 2)"
                >
                  查看数据
                </p>
                <p class="popover-p" @click="handleExportData(2)">导出</p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div class="chartBox">
        <EchartBar
          v-if="showEcharts"
          :source="'business'"
          :industry-type="'2'"
          :search-data="searchData"
          :echarts-data="strackData.secondFieldData"
        />
      </div>
    </wrap>
    <TrackData
      v-if="showDialog"
      v-model="showDialog"
      :track-info-list="trackInfoList"
      :api="'/api/industry/analysis/export'"
      :params-obj="paramsObj"
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
import qs from 'qs'
import {
  Search,
  IconTip,
  EchartBar,
  TrackPie,
  TrackData,
  SelectMoreMonth
} from 'components'
import { $getBusinessData, $getQueryCondition } from '@/api/track-anlysis'
import { copy } from '@/utils'
export default defineComponent({
  components: {
    Search,
    IconTip,
    EchartBar,
    TrackPie,
    TrackData,
    SelectMoreMonth
  },
  setup(props) {
    const { $store, $message, $refs } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: []
    })
    const states = reactive({
      signTeamList: [],
      deleteItem: [],
      showDialog: false,
      strackData: {
        firstFieldData: {},
        secondFieldData: {}
      },
      loading: false,
      updatedTime: '',
      crmTeamInfoBOList: [],
      trackInfoList: {},
      paramsObj: {},
      showEcharts: false
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
    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      $getBusinessData(searchData.value)
        .then((res) => {
          states.loading = false
          states.showEcharts = true
          if (res.code === 1 && res.data) {
            states.updatedTime = res.data.updatedTime
            const objList = {
              firstFieldData: res.data.firstFieldData || {},
              secondFieldData: res.data.secondFieldData || {}
            }
            states.strackData = formatEchartData(objList || {})
          } else {
            states.updatedTime = ''
            states.strackData = {}
          }
        })
        .catch((err) => {
          console.log(err)
        })
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

    const formatEchartData = (objList = {}) => {
      const obj = {
        firstFieldData: {},
        secondFieldData: {}
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
    const handleViewData = (data, type) => {
      states.trackInfoList = data
      states.paramsObj = { ...searchData.value, industryType: type }
      states.showDialog = true
    }
    const handleExportData = (type) => {
      window.open(
        `/api/industry/analysis/export?${qs.stringify({
          ...searchData.value,
          industryType: type
        })}`
      )
    }
    const getRankCondition = async() => {
      const res = await $getQueryCondition()
      normalFormItemMap.groupId.data = res.data.crmGroupInfoBOList || []
      normalFormItemMap.teamId.data = res.data.crmTeamInfoBOList || []
      states.crmTeamInfoBOList = res.data.crmTeamInfoBOList || []
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
    getRankData()
    getRankCondition()
    return {
      did: $store.getters.user.userInfo.did,
      ...toRefs(states),
      formConf,
      onSubmit,
      searchData,
      onChange,
      submitMonth,
      handleViewData,
      handleExportData,
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
</style>
