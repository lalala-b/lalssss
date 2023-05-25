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
          <!-- <el-form-item>
            <el-select v-model="target.model.accountIds" :multiple-limit="5" multiple placeholder="账号">
              <el-option
                v-for="item in accountList"
                :key="item.accountId"
                :label="item.accountName"
                :value="item.accountId"
              />
            </el-select>
          </el-form-item> -->
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
          <span class="data-title">账号营收分析</span>
          <IconTip
            class="icon-tip"
            type="popover"
            content="数据来源于最近12个月类型为视频工单的签约订单，金额为签约订单的流水金额。需要查看全部数据，可使用导出功能。"
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
      <div class="chartBox">
        <EchartBar v-if="showEcharts" :echarts-data="strackData" :type="'1'" />
      </div>
    </wrap>
    <AccountAnalysisDialog
      v-if="showDialog"
      v-model="showDialog"
      :params-obj="paramsObj"
      :api="'/api/account/analysis/sign/export'"
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
  SelectMoreMonth
} from 'components'
import AccountAnalysisDialog from './_com/AccountAnalysisDialog'
import {
  $getSignAccountData,
  $getAccountInfo,
  $getSignSearch
} from '@/api/track-anlysis'
import qs from 'qs'
import { copy } from '@/utils'
export default defineComponent({
  components: {
    Search,
    IconTip,
    EchartBar,
    SelectMoreMonth,
    AccountAnalysisDialog
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
      accountList: [],
      showExport: true
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
      params.accountIds = params.id
      delete params.id
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
        Object.assign(searchData.value, params, {
          belongMonthList: $refs.moreMonth.resultTimes || []
        })
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
      $getSignSearch().then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.platId.data = res.data.plats
          normalFormItemMap.signGroupId.data = res.data.signGroupInfoList
          normalFormItemMap.id.data = res.data.accountInfoBOS
          // states.accountList = res.data.accountInfoBOS
          normalFormItemMap.signTeamId.data = res.data.signTeamList
          states.signTeamList = res.data.signTeamList
        }
      })
    }
    const getAccountList = (val) => {
      $getAccountInfo({ platId: val }).then((res) => {
        if (res.code === 1 && res.data) {
          normalFormItemMap.id.data = res.data
          // states.accountList = res.data
        }
      })
    }
    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'signGroupId': // 签约团队
          model.signTeamId = ''
          if (val && +val === 947) {
            normalFormItemMap.signTeamId.data = []
          } else {
             normalFormItemMap.signTeamId.data = states.signTeamList
          }
          break
        case 'platId': // 平台
          model.id = ''
          normalFormItemMap.id.data = []
          getAccountList(val)
          break
      }
    }
    const getRankData = () => {
      states.loading = true
      states.showEcharts = false
      const params = formatDateTime(searchData.value)
      try {
        $getSignAccountData(params)
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
      states.paramsObj = {
        ...searchData.value
      }
      states.showDialog = true
    }

    const handleExportData = () => {
      const params = formatDateTime(searchData.value)
      window.open(
        `/api/account/analysis/sign/export?${qs.stringify({
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
