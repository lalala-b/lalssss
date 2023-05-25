
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
          <el-form-item label="访问时间">
            <el-date-picker
              v-model="target.model.visitTime"
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
      <VTable
        ref="table"
        :search-data="searchData"
        @replace="handleReplace"
      />
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './_com/RankTable'
import { copy } from '@/utils'
import {
  $getRankCondition
} from '@/api/bussiness-manage'

import qs from 'qs'

export default {
  components: {
    VTable: Table,
    Search
  },
  setup(props, { emit }) {
    const { $permission, $refs, $nextTick, $set, $router } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      // hasExport: $permission('rank_business_opportunity_export')
      hasExport: $permission('manager_export')
    })

    const states = reactive({
      businessTeamList: []
    })

    const searchData = ref({})
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
          key: 'orgId',
          data: [],
          conf: { placeholder: '请选择商务团队' },
          optionLabelKey: 'crmGroupName',
          optionValKey: 'crmGroupId',
          permissionName: 'rank_business_group'
        },
        {
          type: 'select',
          key: 'businessTeamId',
          data: [],
          conf: { placeholder: '请选择商务小组' },
          optionLabelKey: 'crmTeamName',
          optionValKey: 'crmTeamId',
          permissionName: 'rank_business_team'
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

    const formatData = (data) => {
      const params = copy(data)
      if (params.visitTime) {
        params.startTime = params.visitTime[0] + ' 00:00:00'
        params.endTime = params.visitTime[1] + ' 23:59:59'
        delete params.visitTime
      } else {
        params.startTime = ''
        params.endTime = ''
        delete params.visitTime
      }
      return params
    }

    const getRankCondition = async() => {
      const res = await $getRankCondition()
      normalFormItemMap.orgId.data = res.data.businessGroupInfoList || []
      normalFormItemMap.businessTeamId && (normalFormItemMap.businessTeamId.data = res.data.businessTeamInfoBOList || [])
      states.businessTeamList = res.data.businessTeamInfoBOList || []
    }

    const onChange = (val, item, type, index, model) => {
      switch (item.key) {
        case 'orgId':
          model.businessTeamId = ''
          if (val) {
            normalFormItemMap.businessTeamId.data = states.businessTeamList.filter(item => (+item.crmGroupId === +val))
          } else {
            normalFormItemMap.businessTeamId.data = states.businessTeamList
          }
          break
      }
    }

    const onSubmit = (data) => {
      const params = formatData(data)
      Object.assign(searchData.value, params)
      handleGetList()
    }

    const onExport = (data) => {
      const params = formatData(Object.assign({}, searchData.value, data))

      window.open(
        `/api/quotient/opportunity/rankingList/downloadOpportunityRankingList?${qs.stringify({
          ...params
        })}`
      )
    }

    const handleReplace = ({ activeName, id }) => {
      const time = ($refs.search.form.visitTime || []).join(',')
      $router.push({
          path: `/bussiness-manage/business_opportunity_manage`,
          query: {
            activeName,
            id,
            time,
            _blank: true
          }
        })
    }

    buildFormConf()
    handleGetList()
    getRankCondition()
    return {
      searchData,
      formConf,
      onSubmit,
      onChange,
      ...toRefs(states),
      handleReplace,
      onExport
    }
  }
}
</script>
