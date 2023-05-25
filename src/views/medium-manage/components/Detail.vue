<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      >
        <template v-slot:normal="target">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.createdaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="视频发布时间">
            <el-date-picker
              v-model="target.model.videodaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="已定档期">
            <el-date-picker
              v-model="target.model.scheduledaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <SummaryItems ref="summary" :search-data="searchData" />
    </wrap>
    <wrap class="m-t-24">
      <VTable ref="table" :search-data="searchData" @getList="handleGetList" />
    </wrap>
  </div>
</template>

<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import SummaryItems from '../_com/SummaryItems.vue'
import Table from '../_com/Table'
import { copy, getMonthStartEnd } from '@/utils'
import {
  $getMediumScreen,
  $getMediumBusinessPeople
} from '@/api/medium-manage'
import {
  $getOrderAccountList,
  $getMoreMediumAccounts
} from '@/api/sign-contract'
import qs from 'qs'

export default {
  components: {
    VTable: Table,
    SummaryItems,
    Search
  },
  setup() {
    const { $permission, $refs, $nextTick, $message, $set } =
      getCurrentInstance().proxy

    const useSearch = () => {
      const formConf = reactive({
        normal: [],
        // hasExport: $permission('medium-order-detail-export')
        hasExport: $permission('manager_export')
      })
      const states = reactive({})

      const searchData = ref({})
      $nextTick(() => {
        // const timeEnd = dayjs().format('YYYY-MM-DD')
        // const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
        // $set($refs.search.form, 'videodaterange', [
        //   `${timeStart}`,
        //   `${timeEnd}`
        // ])
        // searchData.value.videoCreateStartTime = timeStart + ' 00:00:00'
        // searchData.value.videoCreateEndTime = timeEnd + ' 23:59:59'

        const time = getMonthStartEnd()
        const timeArr = [
          `${time.firstDay}`,
          `${time.lastDay}`
        ]
        $set($refs.search.form, 'scheduledaterange', timeArr)
        $set($refs.search.form, 'workOrderStatus', [0, 1, 2, 3])

        const data = {
          scheduledaterange: timeArr,
          workOrderStatus: '0,1,2,3'
        }
        const res = formatData(data)
        Object.assign(searchData.value, res)

        handleGetList()
      })
      const handleGetList = () => {
        $nextTick(() => {
          $refs.summary.getClickCount()
          $refs.table.getList()
        })
      }
      // 时间添加时分秒
      const formatData = (data) => {
        const params = copy(data)
        if (params.videodaterange) {
          // 视频发布时间
          params.videoReleaseTimeBegin = params.videodaterange[0] + ' 00:00:00'
          params.videoReleaseTimeEnd = params.videodaterange[1] + ' 23:59:59'
          delete params.videodaterange
        } else {
          params.videoReleaseTimeBegin = ''
          params.videoReleaseTimeEnd = ''
        }

        if (params.createdaterange) {
          // 视频创建时间
          params.createdTimeBegin = params.createdaterange[0] + ' 00:00:00'
          params.createdTimeEnd = params.createdaterange[1] + ' 23:59:59'
          delete params.createdaterange
        } else {
          params.createdTimeBegin = ''
          params.createdTimeEnd = ''
        }

        if (params.scheduledaterange) {
          // 档期时间
          params.scheduledBegin = params.scheduledaterange[0] + ' 00:00:00'
          params.scheduledEnd = params.scheduledaterange[1] + ' 23:59:59'
          delete params.scheduledaterange
        } else {
          params.scheduledBegin = ''
          params.scheduledEnd = ''
        }

        return params
      }
      const onChange = (val, item, type, index, model) => {
        switch (item.key) {
          case 'businessGroupIdList':
            model.businessDockingPeopleId = ''
            normalFormItemMap.businessDockingPeopleId.data = []
            getBusinessPeople(val)
            break
          case 'platId':
            model.accountId = ''
            normalFormItemMap.accountId.data = []
            getMoreMediumAccounts(val)
        }
      }

      const getBusinessPeople = async(orgIdList) => {
        try {
          const { code, data, message } = await $getMediumBusinessPeople({
            orgIdList
          })
          if (+code === 1) {
            normalFormItemMap.businessDockingPeopleId.data = data || []
          } else {
            $message.error(message)
          }
        } catch (e) {
          $message.error(e)
        }
      }

      const normalFormItemMap = {}
      const buildFormConf = () => {
        let normal = [
          {
            type: 'select',
            key: 'workOrderStatus',
            data: [
              { dictValue: 0, dictLabel: '商务信息待录入' },
              { dictValue: 1, dictLabel: '待履约' },
              { dictValue: 2, dictLabel: '已履约' },
              { dictValue: 3, dictLabel: '已核账' },
              { dictValue: 4, dictLabel: '撤单' }
            ],
            conf: {
              placeholder: '工单状态',
              multiple: true,
              deCollapseTags: false
            },
            optionLabelKey: 'dictLabel',
            optionValKey: 'dictValue'
          },
          {
            type: 'select',
            key: 'businessGroupIdList',
            data: [],
            conf: {
              placeholder: '选择商务小组',
              multiple: true
            },
            optionLabelKey: 'orgName',
            optionValKey: 'orgId'
          },
          {
            type: 'select',
            key: 'businessDockingPeopleId',
            data: [],
            conf: {
              placeholder: '商务对接人'
            },
            optionLabelKey: 'businessMatchmakerName',
            optionValKey: 'businessMatchmakerId'
          },
          {
            type: 'select',
            key: 'mediumPrincipalId',
            data: [],
            conf: {
              placeholder: '媒介采买人'
            },
            permissionName: 'medium-head-select',
            optionLabelKey: 'realname',
            optionValKey: 'userId'
          },
          {
            type: 'select',
            key: 'mediumDeliveryUserId',
            data: [],
            conf: {
              placeholder: '媒介投放人'
            },
            permissionName: 'medium-putting-select',
            optionLabelKey: 'realname',
            optionValKey: 'userId'
          },
          {
            type: 'select',
            key: 'isRebate',
            data: [
              { val: '0', text: '否' },
              { val: '1', text: '是' }
            ],
            conf: {
              placeholder: '是否返款'
            }
          },
          {
            type: 'select',
            key: 'platId',
            data: [],
            optionLabelKey: 'platName',
            optionValKey: 'platId',
            conf: {
              placeholder: '平台',
              multiple: true
            }
          },
          {
            type: 'select',
            key: 'accountId',
            data: [],
            optionLabelKey: 'accountName',
            optionValKey: 'accountId',
            conf: {
              placeholder: '账号名称'
            }
          },
          {
            type: 'input',
            key: 'orderName',
            conf: {
              placeholder: '订单名称',
              maxLength: 30
            }
          },
          {
            type: 'input',
            key: 'workId',
            conf: {
              placeholder: '工单号或商单号',
              maxLength: 30
            }
          }
        ]
        normal = normal.filter(function(item, index) {
          if (item.permissionName && !$permission(item.permissionName)) {
            return false
          }
          item.index = index
          normalFormItemMap[item.key] = item
          return true
        })
        formConf.normal = normal
      }

      const getMediumScreen = () => {
        $getMediumScreen().then((res) => {
          if (res.code === 1 && res.data) {
            normalFormItemMap.businessGroupIdList.data =
              res.data.businessGroupInfo || []
            normalFormItemMap.mediumPrincipalId.data =
              res.data.mediumPrincipal || []
            normalFormItemMap.mediumDeliveryUserId.data =
              res.data.mediumDeliveryUser || []
            normalFormItemMap.platId.data =
              res.data.plats || []
          }
        })
      }
      const getOrderAccountList = (val) => {
        $getOrderAccountList({ platId: (val || []).join(','), methodId: 1 }).then((res) => {
          if (res.code === 1 && res.data) {
            normalFormItemMap.accountId.data = res.data || []
          }
        })
      }

      const getMoreMediumAccounts = (val) => {
        $getMoreMediumAccounts({ platList: val }).then((res) => {
          if (res.code === 1 && res.data) {
            normalFormItemMap.accountId.data = res.data || []
          }
        })
      }

      const onSubmit = (data) => {
        const mergeData = { ...data }
        const params = formatData(mergeData)
        params.orgId = params.fId || params.dId || ''
        delete params.dId
        delete params.fId

        if ((params.workOrderStatus || []).length) {
          params.workOrderStatus = (params.workOrderStatus || []).join(',')
        }

        params.platIdList = [...(params.platId || [])]
        delete params.platId

        Object.assign(searchData.value, params)
        handleGetList()
      }
      const onExport = (data) => {
        const propertyNameList = []

        const mergeData = { ...data }

        mergeData.platIdList = [...(mergeData.platId || [])]
        delete mergeData.platId

        const params = formatData(
          Object.assign({}, searchData.value, mergeData)
        )

        if ((params.workOrderStatus || []).length) {
          params.workOrderStatus = (params.workOrderStatus || []).join(',')
        }

        window.open(
          `/api/medium/mediumOrder/downloadMediumWorkerOrder?${qs.stringify({
            ...params,
            propertyNameList: [...new Set(propertyNameList)]
          })}`
        )
      }
      buildFormConf()
      getOrderAccountList('')
      getBusinessPeople('')
      getMediumScreen()
      return {
        searchData,
        summaryItems,
        formConf,
        onSubmit,
        onExport,
        onChange,
        handleGetList,
        states
      }
    }
    const {
      formConf,
      onSubmit,
      onExport,
      onChange,
      searchData,
      handleGetList,
      states,
      summaryItems
    } = useSearch()

    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      onChange,
      ...toRefs(states),
      summaryItems,
      handleGetList
    }
  }
}
</script>
