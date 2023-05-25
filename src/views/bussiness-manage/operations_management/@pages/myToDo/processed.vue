<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
      >
        <template v-slot:prv="target">
          <platformSelect
            v-model="target.model.platId"
            :inline="true"
            :query="config"
            @platChange="getSelfAccount(arguments[0], target.model)"
          />
          <accountSelect
            :inline="true"
            :no-ajax="true"
            :list="accountList"
            :form="target.model"
            :has-account="true"
            :params="config"
            :conf="{ allowCreate: false ,placeholder:'账号' }"
          />
        </template>
      </Search>
    </wrap>
    <VTable ref="table" :source="'processed'" :search-data="searchData" />
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { $addAccountInventory } from '@/api/account-manage'
import { $getWaitInfo } from '@/api/operating-manage'
import VTable from '../../_com/Table.vue'
import platformSelect from '@/components/PlatformSelect/index.vue'
import accountSelect from '@/components/AccountSelect/index.vue'
import { commonData } from '../../_com/hooks.js'
export default {
  components: {
    Search,
    accountSelect,
    platformSelect,
    VTable
  },
  setup(props, { emit }) {
    const { $refs, $nextTick } = getCurrentInstance().proxy
    const { statusList, formatAccount } = commonData()
    const formConf = reactive({
      normal: [],
      hasExport: false
    })
    const states = reactive({
      addAjax: $addAccountInventory,
      config: { methodId: 1, accountType: 1, conf: { allowCreate: false }},
      accountList: []
    })
    const searchData = ref({
      platId: '',
      pageNum: 1
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'transferOrderStatus',
          data: statusList,
          conf: {
            placeholder: '请选择审批状态'
          },
          optionLabelKey: 'dictLabel',
          optionValKey: 'dictValue'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }

    const getSelfAccount = (id = '', model) => {
      emit('platChange')
      if (model) {
        model.accountId = ''
      }
      $getWaitInfo({ platId: id })
        .then((res) => {
          if (res.code === 1) {
            states.accountList = res.data
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }

    const handleGetList = () => {
      $nextTick(() => {
        $refs.table.getList('processed')
      })
    }
    const onSubmit = (data) => {
      const params = formatAccount(data)
      Object.assign(searchData.value, params)
      handleGetList()
    }

    buildFormConf()
    getSelfAccount()
    handleGetList()
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      getSelfAccount
    }
  }
}
</script>
