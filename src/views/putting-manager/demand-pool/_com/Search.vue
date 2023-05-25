<template>
  <Search
    ref="search"
    :config="formConf"
    @submit="onSubmit"
    @change="onSearchChange"
    @export="onExport"
  >
    <template v-slot:normal="target">
      <el-form-item label="预期投放价格">
        <div class="flex">
          <el-input v-model="target.model.preDeliveryAmountMin" type="number" placeholder="金额最小值" />
          <span class="m-r-5 m-l-5">至</span>
          <el-input v-model="target.model.preDeliveryAmountMax" type="number" placeholder="金额最大值" />
        </div>
      </el-form-item>
      <el-form-item label="预计发布时间">
        <el-date-picker
          v-model="target.model.daterange"
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
</template>
<script>
import Search from '@/components/Search'
import { reactive, toRefs, onMounted, defineComponent } from '@vue/composition-api'
import { $getRequirementCondition, $getRequirementAccount } from '@/api/putting-manager'
import { $getDataByDictType } from '@/api'
import { copy, unique } from '@/utils'
import { useStore } from '../../hook'

export default defineComponent({
  components: { Search },
  props: {
    source: {
      type: String,
      default: 'MyDemand'
    },
    defaultParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const state = reactive({
      formConf: {}
    })

    const { setBrandNameList, setChargingModeList, brandNameList, chargingModeList } = useStore()

    const normalFormItemMap = {}

    const buildFormConf = function() {
      let normal = [
        {
          type: 'select',
          key: 'requirementStatus',
          data: [],
          conf: {
            placeholder: '请选择需求状态'
          },
          auth: ['MyDemand', 'MyWaitDemand'],
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        // {
        //   type: 'select',
        //   key: 'requirementExamineStatus',
        //   data: [
        //     { value: 0, label: '待审核' },
        //     { value: 4, label: '待定' }],
        //   conf: {
        //     placeholder: '需求审核状态'
        //   },
        //   auth: ['toAudit'],
        //   optionLabelKey: 'label',
        //   optionValKey: 'value'
        // },
        {
          type: 'select',
          key: 'requirementExamineStatus',
          data: [
            { value: 0, label: '待审核人群画像' },
            { value: 4, label: '待线下沟通' },
            { value: 5, label: '待审核资金未核算达人' }],
          conf: {
            placeholder: '审核状态'
          },
          auth: ['toAudit'],
          optionLabelKey: 'label',
          optionValKey: 'value'
        },
        {
          type: 'select',
          key: 'advertiserUserId',
          data: [],
          conf: {
            placeholder: '请选择广告师'
          },
          auth: ['MyWaitDemand'],
          optionLabelKey: 'realname',
          optionValKey: 'userId'
        },
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: {
            placeholder: '请选择平台'
          },
          optionLabelKey: 'platName',
          optionValKey: 'platId'
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请选择账号'
          },
          optionLabelKey: 'accountName',
          optionValKey: 'accountId'
        },
        {
          type: 'select',
          key: 'chargeType',
          data: chargingModeList || [],
          conf: {
            placeholder: '请选择计费方式'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'brandTag',
          data: brandNameList || [],
          conf: {
            placeholder: '请选择品牌标签'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'input',
          key: 'id',
          conf: {
            placeholder: '需求ID搜索'
          },
          auth: ['toAudit']
        },
        {
          type: 'select',
          key: 'businessTag',
          data: [],
          conf: {
            placeholder: '请选择业务标签'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        },
        {
          type: 'select',
          key: 'commissionerUserId',
          data: [],
          conf: {
            placeholder: '请选择投放专员'
          },
          optionLabelKey: 'realname',
          optionValKey: 'userId',
          auth: ['!MyWaitDemand']
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        if (item.auth) {
          if (item.auth.slice(0, 1) === '!') {
            return !item.auth.includes(props.source)
          }
          return item.auth.includes(props.source)
        }
        return true
      })
      state.formConf = {
        normal,
        hasExport: true
      }
    }

    const getCondition = function() {
      $getRequirementCondition({ ...props.defaultParams }).then(res => {
        if (res.code === 1) {
          normalFormItemMap.requirementStatus.data = res.data.requirementStatusList
          normalFormItemMap.advertiserUserId.data = res.data.advertiserList
          normalFormItemMap.platId.data = res.data.requirementAccountPlatBOList
          normalFormItemMap.accountId.data = res.data.requirementAccountBOList
          normalFormItemMap.chargeType.data = res.data.chargingModeList
          normalFormItemMap.brandTag.data = res.data.brandNameList
          normalFormItemMap.commissionerUserId.data = res.data.commissionerList
          setBrandNameList(res.data.brandNameList)
          setChargingModeList(res.data.chargingModeList)
        }
      })
    }

    // 根据平台Id获取账号数据
    const getRequirementAccount = function(platId) {
      $getRequirementAccount({ platId, ...props.defaultParams }).then(res => {
        normalFormItemMap.accountId.data = res.data
      })
    }

    const getDataByDictType = function(dictTypes) {
      if (dictTypes) {
        dictTypes = [dictTypes]
      } else {
        dictTypes = ['zz_putting_business_tag', 'zlj_putting_business_tag']
      }
      $getDataByDictType({
        dictTypes
      }).then(res => {
        if (res.code === 1) {
          let data = []
          for (const key in res.data) {
            data = [...data, ...res.data[key]]
          }
          normalFormItemMap.businessTag.data = unique(data, 'dictValue')
        }
      })
    }

    const onSubmit = function(data) {
      const searchData = copy(data)
      if (searchData.daterange) {
        searchData.preReleaseVideoBeginTime = searchData.daterange[0]
        searchData.preReleaseVideoEndTime = searchData.daterange[1]
        delete searchData.daterange
      } else {
        searchData.preReleaseVideoBeginTime = ''
        searchData.preReleaseVideoEndTime = ''
        delete searchData.daterange
      }
      emit('onSubmit', searchData)
    }

    const onSearchChange = function(val, item, type, index, model) {
      switch (item.key) {
          case 'platId':
            model.accountId = ''
            normalFormItemMap.accountId.data = []
            getRequirementAccount(val)
            break
          case 'brandTag':
            console.log(val, 'val')
            model.businessTag = ''
            getDataByDictType(val)
      }
    }

    const onExport = function(data) {
      const searchData = copy(data)
      if (searchData.daterange) {
        searchData.preReleaseVideoBeginTime = searchData.daterange[0]
        searchData.preReleaseVideoEndTime = searchData.daterange[1]
        delete searchData.daterange
      }
      emit('onExport', searchData)
    }

    onMounted(() => {
      buildFormConf()
      getCondition()
      getDataByDictType()
    })

    return {
      ...toRefs(state),
      onSubmit,
      onSearchChange,
      onExport
    }
  }
})
</script>
