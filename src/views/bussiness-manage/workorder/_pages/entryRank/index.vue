
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
          <el-form-item label="商单成单时间">
            <el-date-picker
              v-model="target.model.businessCreateTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              :clearable="true"
            />
          </el-form-item>
          <el-form-item label="工单绩效月">
            <el-date-picker
              v-model="target.model.orderTime"
              type="monthrange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM"
              value-format="yyyy-MM"
              :clearable="true"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>

    <wrap class="m-t-24">
      <VTable
        ref="table"
        :search-data="searchData"
      />
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './Table'
import { copy, getMonthStartEnd } from '@/utils'
import {
  $getEntryRankingCondition
} from '@/api/bussiness-manage'

import qs from 'qs'

export default {
  components: {
    VTable: Table,
    Search
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: []
    })

    const states = reactive({})

    const searchData = ref({})

    $nextTick(() => {
      const { firstDay, lastDay } = getMonthStartEnd()
      $set($refs.search.form, 'businessCreateTime', [firstDay, lastDay])
      searchData.value.productTimeBegin = firstDay + ' 00:00:00'
      searchData.value.productTimeEnd = lastDay + ' 23:59:59'
    })

    const handleGetList = () => {
      $nextTick(() => {
        $refs.table.getList()
      })
    }

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'crmGroupId',
          data: [],
          conf: { placeholder: '商务小组' },
          optionLabelKey: 'crmGroupName',
          optionValKey: 'crmGroupId'
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

    const getEntryRankingCondition = async() => {
      const { code, data } = await $getEntryRankingCondition()
      if (+code === 1) {
        normalFormItemMap.crmGroupId.data = data.businessGroupInfoBOList || []
      }
    }

    const formatData = (data) => {
      const params = copy(data)
      if (params.businessCreateTime) {
        params.productTimeBegin = params.businessCreateTime[0] + ' 00:00:00'
        params.productTimeEnd = params.businessCreateTime[1] + ' 23:59:59'
        delete params.businessCreateTime
      } else {
        params.productTimeBegin = ''
        params.productTimeEnd = ''
        delete params.businessCreateTime
      }

      if (params.orderTime) {
        params.monthMoneyNewStart = params.orderTime[0]
        params.monthMoneyNewEnd = params.orderTime[1]
        delete params.orderTime
      } else {
        params.monthMoneyNewStart = ''
        params.monthMoneyNewEnd = ''
        delete params.orderTime
      }

      return params
    }

    const onChange = (val, item, type, index, model) => {}

    const onSubmit = (data) => {
      const params = formatData(data)
      Object.assign(searchData.value, params)

      Object.assign(searchData.value, params)
      handleGetList()
    }

    buildFormConf()
    handleGetList()
    getEntryRankingCondition()
    return {
      searchData,
      formConf,
      onSubmit,
      onChange,
      ...toRefs(states)
    }
  }
}
</script>
