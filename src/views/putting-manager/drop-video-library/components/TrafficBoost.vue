<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
      >
        <template v-slot:normal="target">
          <el-form-item label="平台任务创建时间">
            <el-date-picker
              v-model="target.model.createdaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item label="推广开始时间">
            <el-date-picker
              v-model="target.model.promotedaterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
        </template>
      </Search>
    </wrap>
    <wrap class="m-t-24">
      <TrafficBoostSummary
        ref="summary"
        :search-data="searchData"
        :plat-owner="platOwner"
      />
    </wrap>
    <wrap class="m-t-24">
      <VTable ref="table" :search-data="searchData" :plat-owner="platOwner" />
    </wrap>
  </div>
</template>

<script>
import { Search } from 'components'
import {
  reactive,
  getCurrentInstance,
  ref
} from '@vue/composition-api'
import qs from 'qs'
import dayjs from 'dayjs'
import { copy } from '@/utils'
import { $getKuaishouTrafficBoostAccount } from '@/api/traffic-boost'
import TrafficBoostSummary from './TrafficBoostSummary.vue'
import TrafficBoostTable from './TrafficBoostTable.vue'

export default {
  components: {
    VTable: TrafficBoostTable,
    TrafficBoostSummary,
    Search
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy

    const formConf = reactive({
      normal: [],
      hasExport: $permission('export_code_trafficBoot')
    })

    const platOwner = ref('助推')
    const searchData = ref({
      platOwner: platOwner.value
    })

    $nextTick(() => {
      const timeEnd = dayjs().format('YYYY-MM-DD')
      const timeStart = dayjs().add(-7, 'day').format('YYYY-MM-DD')
      $set($refs.search.form, 'createdaterange', [
        `${timeStart}`,
        `${timeEnd}`
      ])
      searchData.value.createTime = timeStart + ' 00:00:00'
      searchData.value.endTime = timeEnd + ' 23:59:59'
      handleGetList()
    })

    const normalFormItemMap = {}

    const getKuaishouTrafficBoostAccount = () => {
      $getKuaishouTrafficBoostAccount().then((res) => {
        if (res.code === 1) {
          normalFormItemMap.accountId.data = res.data
        }
      })
    }
    getKuaishouTrafficBoostAccount()

    const buildFormConf = () => {
      let normal = [
        {
          type: 'input',
          key: 'plat',
          conf: {
            placeholder: '快手',
            disabled: true
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请选择账号',
            allowCreate: false,
            isAccountName: false
          },
          optionLabelKey: 'accountName',
          optionValKey: 'accountId'
        },
        {
          type: 'input',
          key: 'supplementOrderNo',
          conf: {
            placeholder: '流量助推订单ID'
          }
        },
        {
          type: 'input',
          key: 'orderId',
          conf: {
            placeholder: '平台订单ID'
          }
        },
        {
          type: 'input',
          key: 'taskName',
          conf: {
            placeholder: '请输入平台任务名称关键词'
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
    buildFormConf()

    const handleGetList = () => {
      $nextTick(() => {
        $refs.summary.getClickCount()
        $refs.table.getList()
      })
    }

    // 时间添加时分秒
    const formatData = (data) => {
      const params = copy(data)

      if (params.createdaterange) {
        // 平台任务创建时间
        params.createTime = params.createdaterange[0] + ' 00:00:00'
        params.endTime = params.createdaterange[1] + ' 23:59:59'
        delete params.createdaterange
      } else {
        params.createTime = ''
        params.endTime = ''
      }

      if (params.promotedaterange) {
        // 推广时间
        params.promotionBeginTime = params.promotedaterange[0] + ' 00:00:00'
        params.closingTime = params.promotedaterange[1] + ' 23:59:59'
        delete params.promotedaterange
      } else {
        params.promotionBeginTime = ''
        params.closingTime = ''
      }
      return params
    }

    const onSubmit = (data) => {
      const params = formatData(data)
      Object.assign(searchData.value, params)
      handleGetList()
    }

    const onExport = (data) => {
      const params = formatData(Object.assign({}, searchData.value, data))
      for (var key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      window.open(
        `/api/kuaishou/flow/boost/exportKuaishouFlowBoostOrderList?${qs.stringify(params)}`
      )
    }

    return {
      searchData,
      formConf,
      onSubmit,
      onExport,
      // onChange,
      platOwner
    }
  }
}
</script>
