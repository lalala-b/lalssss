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
                :nums="defaultNums"
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
          <span class="data-title">账号营收分析</span>
          <IconTip
            class="icon-tip"
            type="popover"
            content="数据来源于最近12个月类型为视频工单的工作室订单，金额为工作室订单的执行金额。需要查看全部数据，可使用导出功能。"
            icon-class="iconwenhao"
          />
          <div v-if="showExport" class="data-time">
            <span>数据最近更新时间：</span>
            <span>{{ updatedTime }}</span>
          </div>
        </div>
        <div v-if="showExport" class="popover">
          <el-popover
            placement="top-start"
            popper-class="my-popover"
            width="150"
            trigger="hover"
          >
            <template>
              <div>
                <p class="popover-p" @click="handleViewData">查看数据</p>
                <p class="popover-p" @click="handleExportData">导出</p>
              </div>
            </template>
            <i slot="reference" class="iconfont icondiandiandianshu" />
          </el-popover>
        </div>
      </div>
      <div>
        <EchartBar v-if="showEcharts" :echarts-data="strackData" :type="'1'" />
      </div>
    </wrap>
    <AccountAnalysisDialog
      v-if="showDialog"
      v-model="showDialog"
      :params-obj="paramsObj"
      :api="'/api/account/analysis/self/export'"
      :track-info-list="trackInfoList"
      :from="'studio'"
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
  TrackPieData,
  SelectMoreMonth
} from 'components'
import AccountAnalysisDialog from '@/views/sign-manage/@pages/sign-track/_com/AccountAnalysisDialog.vue'

import { $getStudioAccountList, $getStudioSelfList, $getselfCondition } from '@/api/operating-manage'

import qs from 'qs'
import { copy } from '@/utils'
export default defineComponent({
  components: {
    Search,
    IconTip,
    EchartBar,
    TrackPie,
    AccountAnalysisDialog,
    SelectMoreMonth,
    TrackPieData
  },
  setup(props) {
    const { $store, $message, $refs, $nextTick } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: []
    })
    const states = reactive({
      signTeamList: [],
      deleteItem: [],
      showDialog: false,
      strackData: {},
      loading: false,
      updatedTime: '',
      trackInfoList: {},
      paramsObj: {},
      showEcharts: false,
      showExport: true,
      defaultNums: 12
    })

    const searchData = ref({
    })
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
          optionValKey: 'orgId'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '平台'
          }
        },
        {
          type: 'select',
          key: 'id',
          data: [],
          optionLabelKey: 'accountName',
          optionValKey: 'accountId',
          conf: {
            multiple: true,
            placeholder: '账号',
            limit: 5,
            deCollapseTags: true
          }
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const getselfCondition = () => {
      $getselfCondition()
        .then((res) => {
          normalFormItemMap.workTeamId.data = res.data.teamList
          normalFormItemMap.platId.data = res.data.plats
          normalFormItemMap.id.data = res.data.accountInfoBOS
        })
        .catch((err) => {
          console.error(err)
        })
    }
    const formatSearchData = (data) => {
      const params = copy(data)
      params.accountIds = params.id
      delete params.id
      return params
    }
    const onSubmit = (data) => {
      $refs.moreMonth.closeMonthDialog()
      const params = copy(data)
      setTimeout(() => {
        console.log($refs.moreMonth.resultTimes)
        Object.assign(searchData.value, params, {
          belongMonthList: $refs.moreMonth.resultTimes || []
        })
        getRankData()
      }, 0)
    }
    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'platId':
          model.id = ''
          normalFormItemMap.id.data = []
          getAccountList(val)
          break
      }
    }
    const getAccountList = (platId) => {
      try {
        $getStudioAccountList({ platId }).then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.id.data = res.data
        }
      })
      } catch (err) {
        console.log(err)
      }
    }
    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      const params = formatSearchData(searchData.value)
      try {
        $getStudioSelfList(params)
          .then((res) => {
            states.loading = false
            states.showEcharts = true
            if (res.code === 1 && res.data && res.data.terms && res.data.terms.length) {
              states.showExport = true
              states.updatedTime = res.data.updatedTime
              states.trackInfoList = res.data
              states.strackData = formatEchartData(res.data)
            } else {
              states.showExport = false
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
    const splitData = (data = [], type) => {
      let list = copy(data)
      if (type === 1) {
        list = list.map((item) => {
          item = item && item.length > 15 ? item.splice(0, 15) : item
          return item
        })
      } else {
        if (list.length > 15) {
          return list.splice(0, 15)
        }
      }
      return list
    }
    const formatEchartData = (objList = {}) => {
      const obj = {}
      obj.accountTeams = splitData(objList.accountTeams)
      obj.platIds = splitData(objList.platIds)
      obj.terms = splitData(objList.terms)
      obj.accountIds = splitData(objList.accountIds)
      obj.termTotal = splitData(objList.totalValues)
      obj.values = splitData(objList.values, 1)
      obj.cates = objList.months
      return obj
    }
    const handleViewData = () => {
      const params = formatSearchData(searchData.value)
      states.paramsObj = {
        ...params
      }
      states.showDialog = true
    }

    const handleExportData = () => {
      const params = formatSearchData(searchData.value)
      window.open(
        `/api/account/analysis/self/export?${qs.stringify({
          ...params
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
    getselfCondition()
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
      submitMonth,
      resetBtn,
      handleViewData,
      handleExportData
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
