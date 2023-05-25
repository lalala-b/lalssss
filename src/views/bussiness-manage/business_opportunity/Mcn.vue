
<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <el-form-item label="访问时间">
            <el-date-picker
              v-model="target.model.inquiryTime"
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
      <div v-if="$permission('add_mcn_business_opportunity')" class="flex flex-justify-end m-b-20">
        <el-button type="primary" @click="handleAddOpportunity">添加MCN商机</el-button>
      </div>
      <VTable
        ref="table"
        :normal-form-item-map="{
          ...normalFormItemMap,
          customerNameAndIdBOList: {
            ...normalFormItemMap.customerNameAndIdBOList,
            data: customerList
          },
          businessUserInfo: {
            ...normalFormItemMap.businessUserInfo,
            data: businessUserList
          }
        }"
        :search-data="searchData"
        @getList="handleGetList"
      />
    </wrap>

    <OpportunityDialog
      v-if="showOpportunityDialog"
      :normal-form-item-map="{
        ...normalFormItemMap,
        customerNameAndIdBOList: {
          ...normalFormItemMap.customerNameAndIdBOList,
          data: customerList,
        },
        businessUserInfo: {
          ...normalFormItemMap.businessUserInfo,
          data: businessUserList
        }
      }"
      :type="opportunityDialogType"
      :show="showOpportunityDialog"
      @close="showOpportunityDialog = false"
      @getList="handleGetList"
    />

  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './_com/Table'
import SummaryItems from './_com/SummaryItems'
import { copy } from '@/utils'
import {
  $getBusinessOpportunityScreen,
  $companyGetCustomer
} from '@/api/bussiness-manage'
import OpportunityDialog from './components/OpportunityDialog.vue'

import qs from 'qs'
import dayjs from 'dayjs'
export default {
  components: {
    VTable: Table,
    SummaryItems,
    Search,
    OpportunityDialog
  },
  setup(props) {
    const { $permission, $refs, $nextTick, $route, $set } = getCurrentInstance().proxy
    const useSearch = () => {
      const formConf = reactive({
        normal: [],
        // hasExport: $permission('mcn_export')
        hasExport: $permission('manager_export')
      })

      const states = reactive({
        showOpportunityDialog: false,
        opportunityDialogType: 'add',
        customerList: [],
        businessUserList: []
      })

      const searchData = ref({})

      $nextTick(() => {
        if (($refs.search || {}).form) {
          const { query = {}} = $route
          $refs.search.form = {
            ...$refs.search.form,
            businessUserId: query.id ? +query.id : undefined,
            opportunityId: query.opportunityId ? +query.opportunityId : undefined,
            inquiryTime: query.time ? query.time.split(',') : '',
            inquireTimeStart: query.time ? query.time.split(',')[0] + ' 00:00:00' : '',
            inquireTimeEnd: query.time ? query.time.split(',')[1] + ' 23:59:59' : ''
          }

          if (!query.opportunityId) {
            if (query.time && query.time.length) {
              $set($refs.search.form, 'inquiryTime', [`${query.time.split(',')[0]}`, `${query.time.split(',')[1]}`])
            } else {
              const time = dayjs().format('YYYY-MM-DD')
              $set($refs.search.form, 'inquiryTime', [`${time}`, `${time}`])
              $refs.search.form.inquireTimeStart = time + ' 00:00:00'
              $refs.search.form.inquireTimeEnd = time + ' 23:59:59'
            }
          }

          const params = copy($refs.search.form)

          if (query.accountId) {
            params.accountId = query.accountId

            if (!query.time) {
              $set($refs.search.form, 'inquiryTime', '')
              params.inquireTimeStart = null
              params.inquireTimeEnd = null
            }
          }

          delete params.inquiryTime
          Object.assign(searchData.value, params)
        }

        $nextTick(() => {
          handleGetList()
        })
      })

      const handleGetList = () => {
        $nextTick(() => {
          const { query = {}} = $route
          if (query.accountId) {
            searchData.value.accountId = query.accountId
          }

          $refs.summary && $refs.summary.getClickCount()
          $refs.table && $refs.table.getList()
        })
      }

      const normalFormItemMap = {}
      const buildFormConf = () => {
        let normal = [
          {
            type: 'select',
            key: 'companyId',
            _key: 'companys',
            data: [],
            conf: { placeholder: '客户' },
            optionLabelKey: 'newsContent',
            optionValKey: 'id'
          },
          {
            type: 'select',
            key: 'customId',
            _key: 'customerNameAndIdBOList',
            data: [],
            conf: { placeholder: '客户联系人' },
            optionLabelKey: 'customerName',
            optionValKey: 'customerId'
          },
          {
            type: 'select',
            key: 'businessTeamId',
            _key: 'crmTeamInfoBOList',
            data: [],
            conf: {
              placeholder: '商务小组'
              // hidden: true
            },
            optionLabelKey: 'crmTeamName',
            optionValKey: 'crmTeamId'
          },
          {
            type: 'select',
            key: 'businessUserId',
            _key: 'businessUserInfo',
            data: [],
            conf: { placeholder: '商务人员' },
            optionLabelKey: 'name',
            optionValKey: 'id'
          },
          {
            type: 'select',
            key: 'coopStatus',
            data: [
              {
                id: '0',
                val: '等待结果'
              },
              {
                id: '1',
                val: '确认合作'
              },
              {
                id: '2',
                val: '暂不合作'
              }
            ],
            conf: { placeholder: '合作状态' },
            optionLabelKey: 'val',
            optionValKey: 'id'
          },
          {
            type: 'input',
            key: 'requirementDesc',
            conf: {
              placeholder: '需求描述',
              clearable: true
            }
          },
          {
            type: 'input',
            key: 'opportunityId',
            conf: {
              placeholder: '商机ID',
              clearable: true,
              number: true
            }
          }
        ]
        normal = normal.filter(function(item, index) {
          if (item.permissionName && !$permission(item.permissionName)) {
            return false
          }
          item.index = index
          normalFormItemMap[item._key || item.key] = item
          return true
        })
        formConf.normal = normal
      }

      const formatData = (data) => {
        const params = copy(data)
        if (params.inquiryTime) {
          params.inquireTimeStart = params.inquiryTime[0] + ' 00:00:00'
          params.inquireTimeEnd = params.inquiryTime[1] + ' 23:59:59'
        } else {
          params.inquireTimeStart = ''
          params.inquireTimeEnd = ''
        }
        delete params.inquiryTime
        return params
      }

      const handleChangeCompany = async(val) => {
        const { code, data } = await $companyGetCustomer({ companyId: val })
        if (+code === 1) {
          normalFormItemMap.customerNameAndIdBOList.data = data
        }
      }

      const onChange = (val, item, type, index, model) => {
        console.log(item.key, 'item.key')
        switch (item.key) {
          case 'companyId':
            model.customId = ''
            if (!val) {
              normalFormItemMap.customerNameAndIdBOList.data = states.customerList
            } else {
              normalFormItemMap.customerNameAndIdBOList.data = []
              handleChangeCompany(val)
            }
            break
          case 'businessTeamId':
            model.businessUserId = ''
            if (val) {
              normalFormItemMap.businessUserInfo.data = states.businessUserList.filter(item => (+item.orgId === +val))
            } else {
              normalFormItemMap.businessUserInfo.data = states.businessUserList
            }
            break
        }
      }

      const onSubmit = (data) => {
        const mergeData = { ...data }
        const params = formatData(mergeData)
        Object.assign(searchData.value, params, { accountId: '' })
        handleGetList()
      }

      const getScreenList = async() => {
        const { code, data } = await $getBusinessOpportunityScreen()
        if (+code === 1) {
          for (const key in normalFormItemMap) {
            if (key === 'customerNameAndIdBOList') {
              normalFormItemMap[key].data = data[key]
              states.customerList = data[key]
            } else if (key === 'businessUserInfo') {
              normalFormItemMap[key].data = data[key]
              states.businessUserList = data[key]
              console.log(states.businessUserList, 'states.businessUserList')
            } else {
              normalFormItemMap[key].data = data[key]
            }
          }
        }
      }

      const handleAddOpportunity = () => {
        states.showOpportunityDialog = true
      }

      const onExport = (data) => {
        const mergeData = { ...data }
        const params = formatData(mergeData)
        Object.assign(searchData.value, params, { accountId: '' })
        window.open(
          `/api/quotient/channel/opportunity/downloadOpportunityList?${qs.stringify({
            ...searchData.value
          })}`
        )
      }

      buildFormConf()
      getScreenList()

      return {
        searchData,
        summaryItems,
        formConf,
        onSubmit,
        onExport,
        onChange,
        handleGetList,
        states,
        normalFormItemMap,
        handleAddOpportunity
      }
    }

    const {
      formConf,
      onSubmit,
      onExport,
      onChange,
      searchData,
      states,
      handleGetList,
      summaryItems,
      normalFormItemMap,
      handleAddOpportunity
    } = useSearch()

    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      onChange,
      ...toRefs(states),
      summaryItems,
      handleGetList,
      normalFormItemMap,
      handleAddOpportunity
    }
  }
}
</script>
