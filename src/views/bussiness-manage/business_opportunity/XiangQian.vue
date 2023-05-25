
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
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.dateArr"
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
      <SummaryItems ref="summary" department="xiangqian" :search-data="searchData" />
    </wrap>
    <wrap class="m-t-24">
      <div v-if="$permission('add_xiangqian_business_opportunity')" class="flex flex-justify-end m-b-20">
        <el-button type="primary" @click="handleAddOpportunity">添加向乾商机</el-button>
      </div>
      <VTable
        ref="table"
        department="xiangqian"
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
      department="xiangqian"
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
import qs from 'qs'
import dayjs from 'dayjs'
import OpportunityDialog from './components/OpportunityDialog.vue'

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
        // hasExport: $permission('xiangqian_export')
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
        const { query = {}} = $route
        $refs.search.form = {
          ...$refs.search.form,
          businessUserId: query.id ? +query.id : undefined,
          opportunityId: query.opportunityId ? +query.opportunityId : undefined,
          inquiryTime: query.time ? query.time.split(',') : '',
          inquireTimeStart: query.time ? query.time.split(',')[0] + ' 00:00:00' : '',
          inquireTimeEnd: query.time ? query.time.split(',')[1] + ' 23:59:59' : ''
        }

        if (query.time && query.time.length) {
          $set($refs.search.form, 'inquiryTime', [`${query.time.split(',')[0]}`, `${query.time.split(',')[1]}`])
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
        }
        delete params.inquiryTime

        Object.assign(searchData.value, params)
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
          $refs.summary.getClickCount()
          $refs.table.getList()
        })
      }

      const normalFormItemMap = {}
      const buildFormConf = () => {
        let normal = [
          {
            type: 'select',
            key: 'businessGroupId',
            _key: 'crmGroupInfoBOList',
            data: [],
            conf: { placeholder: '商务小组' },
            optionLabelKey: 'crmGroupName',
            optionValKey: 'crmGroupId'
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
            key: 'companyId',
            _key: 'companys',
            data: [],
            conf: { placeholder: '客户' },
            optionLabelKey: 'newsContent',
            optionValKey: 'id'
          },
          {
            type: 'select',
            key: 'isNewCustomerFlag',
            data: [
              {
                id: 1,
                val: '是'
              },
              {
                id: 0,
                val: '否'
              }
            ],
            conf: { placeholder: '是否新客户' },
            optionLabelKey: 'val',
            optionValKey: 'id'
          },
          {
            type: 'cascader',
            key: 'fieldId',
            _key: 'industryCategoryList',
            data: [],
            conf: {
              placeholder: '行业类别'
            },
            props: { checkStrictly: true, expandTrigger: 'hover', value: 'id', label: 'newsContent', children: 'child' },
            optionValKey: 'id',
            optionLabelKey: 'newsContent'
          },
          {
            type: 'select',
            key: 'brandId',
            _key: 'brandInfoList',
            data: [],
            conf: {
              placeholder: '品牌'
            },
            optionValKey: 'id',
            optionLabelKey: 'newsContent'
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
            type: 'input',
            key: 'requirementDesc',
            conf: {
              placeholder: '需求描述',
              clearable: true
            }
          },
          {
            type: 'select',
            key: 'opportunityQuality',
            data: [
              {
                id: '0',
                val: '低'
              },
              {
                id: '1',
                val: '中'
              },
              {
                id: '2',
                val: '高'
              }
            ],
            conf: { placeholder: '商机优质度' },
            optionLabelKey: 'val',
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
          case 'businessGroupId':
            model.businessUserId = ''
            if (val) {
              normalFormItemMap.businessUserInfo.data = states.businessUserList.filter(item => (item.orgId === val))
            } else {
              normalFormItemMap.businessUserInfo.data = states.businessUserList
            }
            break
        }
      }

      const onSubmit = (data) => {
        if (data && data.fieldId && data.fieldId.length && Array.isArray(data.fieldId)) {
          data.fieldId = data.fieldId[data.fieldId.length - 1]
        }
        const mergeData = { ...data }
        if (mergeData.dateArr && mergeData.dateArr.length) {
          data.createTimeStart = mergeData.dateArr[0] + '00:00:00'
          data.createTimeEnd = mergeData.dateArr[1] + '00:00:00'
        }
        const params = formatData(mergeData)
        Object.assign(searchData.value, params, { accountId: '' })
        handleGetList()
      }

      const onExport = (data) => {
        if (data && data.fieldId && data.fieldId.length && Array.isArray(data.fieldId)) {
          data.fieldId = data.fieldId[data.fieldId.length - 1]
        }
        const mergeData = { ...data }

        const params = formatData(mergeData)
        Object.assign(searchData.value, params, { accountId: '' })

        window.open(
          `/api/quotient/channel/opportunity/downloadOpportunityList?${qs.stringify({
            ...searchData.value,
            type: 1
          })}`
        )
      }

      const getScreenList = async() => {
        const { code, data } = await $getBusinessOpportunityScreen({ type: 1 })
        if (+code === 1) {
          for (const key in normalFormItemMap) {
            if (key === 'customerNameAndIdBOList') {
              normalFormItemMap[key].data = data[key]
              states.customerList = data[key]
            } else if (key === 'businessUserInfo') {
              normalFormItemMap[key].data = data[key]
              states.businessUserList = data[key]
            } else {
              normalFormItemMap[key].data = data[key]
            }
          }
        }
      }

      const handleAddOpportunity = () => {
        states.showOpportunityDialog = true
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
