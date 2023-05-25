
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
          <!-- <el-form-item label="访问时间">
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
          </el-form-item> -->
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="target.model.createTime"
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
      <div v-if="$permission('add_xiangqian_business_opportunity')" class="flex flex-justify-end m-b-20">
        <el-button type="primary" @click="handleAddOpportunity">添加商机</el-button>
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
  $companyGetCustomer,
  $getNewIndustryTypeTags,
  $findPlatInfo,
  $selectAccountCondition
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
      if (['/bussiness-manage/my-desk', '/bussiness-manage/my-team-desk'].includes($route.path)) {
        formConf.hasExport = false
      }
      const states = reactive({
        showOpportunityDialog: false,
        opportunityDialogType: 'add',
        customerList: [],
        businessUserList: [],
        businessTeamList: []
      })

      const searchData = ref({})

      const handlePlatId = (platId) => {
        return [2, 25, 26, 45].includes(+platId) ? +platId : 0
      }

      $nextTick(() => {
        const { query = {}} = $route
        if (!$refs.search) return
        $refs.search.form = {
          ...$refs.search.form,
          businessUserId: query.id ? +query.id : undefined,
          opportunityId: query.opportunityId ? +query.opportunityId : undefined,
          platId: query.platId ? [handlePlatId(+query.platId)] : [],
          accountIdMock: query.accountId ? +query.accountId : undefined, // 从自营账号库跳转过来携带的accountId
          createTime: query.time ? query.time.split(',') : '',
          createTimeStart: query.time ? query.time.split(',')[0] + ' 00:00:00' : '',
          createTimeEnd: query.time ? query.time.split(',')[1] + ' 23:59:59' : ''
        }

        if (query.time && query.time.length) {
          $set($refs.search.form, 'createTime', [`${query.time.split(',')[0]}`, `${query.time.split(',')[1]}`])
        } else {
            if (!query.accountId) {
              const time = dayjs().format('YYYY-MM-DD')
              $set($refs.search.form, 'createTime', [`${time}`, `${time}`])
              $refs.search.form.createTimeStart = time + ' 00:00:00'
              $refs.search.form.createTimeEnd = time + ' 23:59:59'
            }
            if (query.id) {
              $set($refs.search.form, 'createTime', ['', ''])
              $refs.search.form.createTimeStart = ''
              $refs.search.form.createTimeEnd = ''
              searchData.value.createTimeStart = ''
              searchData.value.createTimeEnd = ''
            }
        }

        if (!query.opportunityId) {
          if (query.time && query.time.length) {
            $set($refs.search.form, 'createTime', [`${query.time.split(',')[0]}`, `${query.time.split(',')[1]}`])
          }
        }

        if (query.accountId && query.platId) {
          $set($refs.search.form, 'accountIdMock', +query.accountId)
          $set($refs.search.form, 'platId', [handlePlatId(+query.platId)])
          if (query.time) {
            $set($refs.search.form, 'createTime', [`${query.time.split(',')[0]}`, `${query.time.split(',')[1]}`])
          }
          getAccountList([handlePlatId(+query.platId)])
        } else {
          getAccountList()
        }

        const params = copy($refs.search.form)
        if (query.accountId) {
          params.accountId = query.accountId
        }
        delete params.createTime
        Object.assign(searchData.value, params)
        handleGetList()
      })

      const handleGetList = () => {
        // console.log(searchData.value, 'searchData.value')
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
          data: [],
          conf: { placeholder: '请选择商务团队' },
          optionLabelKey: 'crmGroupName',
          optionValKey: 'crmGroupId'
        },
        {
          type: 'select',
          key: 'businessTeamId',
          data: [],
          conf: { placeholder: '请选择商务小组' },
          optionLabelKey: 'crmTeamName',
          optionValKey: 'crmTeamId'
        },
          // {
          //   type: 'select',
          //   key: 'businessGroupId',
          //   _key: 'crmGroupInfoBOList',
          //   data: [],
          //   conf: { placeholder: '商务小组' },
          //   optionLabelKey: 'crmGroupName',
          //   optionValKey: 'crmGroupId'
          // },
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
              placeholder: '联系人负责的行业'
            },
            props: { checkStrictly: true, expandTrigger: 'hover', value: 'tagId', label: 'tagName', children: 'childNodeTags' },
            optionValKey: 'tagId',
            optionLabelKey: 'tagName'
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
            type: 'select',
            key: 'platId',
            data: [],
            conf: {
              placeholder: '推荐账号平台',
              clearable: true,
              multiple: true
            },
            optionLabelKey: 'platName',
            optionValKey: 'platId'
          },
          {
            type: 'select',
            key: 'accountIdMock',
            data: [],
            conf: {
              placeholder: '推荐账号',
              clearable: true
            },
            optionLabelKey: 'accountName',
            optionValKey: 'accountId'
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
        if (params.createTime && !params.createTime[0]) {
          delete params.createTime
          return params
        }
        if (params.createTime) {
          params.createTimeStart = params.createTime[0] + ' 00:00:00'
          params.createTimeEnd = params.createTime[1] + ' 23:59:59'
        } else {
          params.createTimeStart = ''
          params.createTimeEnd = ''
        }
        delete params.createTime
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
          case 'businessGroupId':
          model.businessTeamId = ''
          if (val) {
            normalFormItemMap.businessTeamId.data = states.businessTeamList.filter(item => (+item.crmGroupId === +val))
            normalFormItemMap.businessUserInfo.data = states.businessUserList.filter(item => (item.dId === val))
          } else {
            normalFormItemMap.businessTeamId.data = states.businessTeamList
            normalFormItemMap.businessUserInfo.data = states.businessUserList
          }
          break
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
              normalFormItemMap.businessUserInfo.data = states.businessUserList.filter(item => (item.orgId === val))
            } else {
              normalFormItemMap.businessUserInfo.data = states.businessUserList
            }
            break
          case 'platId':
            model.accountIdMock = ''
            normalFormItemMap.accountIdMock.data = []
            getAccountList(val)
            break
        }
      }

      const onSubmit = (data) => {
        if (data && data.fieldId && data.fieldId.length && Array.isArray(data.fieldId)) {
          data.fieldId = data.fieldId[data.fieldId.length - 1]
        }
        const mergeData = { ...data }
        const params = formatData(mergeData)
        // Object.assign(searchData.value, params, { accountId: '' })
        Object.assign(searchData.value, params)
        // if (searchData.value.createTime && searchData.value.createTime.length) {
        //   searchData.value.createTimeStart = searchData.value.createTime[0] + ' 00:00:00'
        //   searchData.value.createTimeEnd = searchData.value.createTime[1] + ' 23:59:59'
        //   delete searchData.value.createTime
        // } else {
        //   delete searchData.value.createTimeStart
        //   delete searchData.value.createTimeEnd
        // }
        handleGetList()
      }

      const onExport = (data) => {
        if (data && data.fieldId && data.fieldId.length && Array.isArray(data.fieldId)) {
          data.fieldId = data.fieldId[data.fieldId.length - 1]
        }
        const mergeData = { ...data }
        const params = formatData(mergeData)
        // Object.assign(searchData.value, params, { accountId: '' })
        Object.assign(searchData.value, params)
        window.open(
          `/api/quotient/channel/opportunity/downloadOpportunityList?${qs.stringify({
            ...searchData.value,
            type: 1
          })}`
        )
      }

      // 获取商机的筛选条件
      const getBusinessOpportunityScreen = async() => {
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
            if (key === 'businessGroupId') {
               normalFormItemMap[key].data = data.crmGroupInfoBOList
            }
            if (key === 'businessTeamId') {
              normalFormItemMap[key].data = data.crmTeamInfoBOList
              states.businessTeamList = data.crmTeamInfoBOList || []
            }
          }
        }
      }

      // 获取联系人行业的筛选数据
      const getNewIndustryTypeTags = async() => {
        const { code, data } = await $getNewIndustryTypeTags()
        if (+code === 1) {
           normalFormItemMap.industryCategoryList.data = data || []
        }
      }

      // 获取推荐平台的筛选数据
      const getPlatList = async() => {
        const { code, data } = await $findPlatInfo()
        if (+code === 1) {
           normalFormItemMap.platId.data = data || []
        }
      }

      // 获取推荐账号的筛选数据
      const getAccountList = async(platIds = []) => {
        const { code, data } = await $selectAccountCondition({
          platIds
        })
        if (+code === 1) {
           normalFormItemMap.accountIdMock.data = data || []
        }

        // console.info(normalFormItemMap.accountId.data, 'normalFormItemMap.accountId.data')
      }

      const handleAddOpportunity = () => {
        states.showOpportunityDialog = true
      }

      const getScreenList = () => {
        getBusinessOpportunityScreen()
        getNewIndustryTypeTags()
        getPlatList()
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
