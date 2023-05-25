<template>
  <div>
    <wrap class="search-view">
      <Search ref="search" :config="formConf" @submit="onSubmit" @change="onSearchChange" />
    </wrap>
    <wrap class="m-t-24">
      <div class="flex flex-justify-end">
        <el-button
          class="m-b-10"
          icon="el-icon-circle-plus-outline"
          size="small"
          type="primary"
          @click="hanleAddClick"
        >新增</el-button>
      </div>
      <VTable ref="table" :search-data="searchData" />
    </wrap>
    <AddDialog
      v-if="showDialog"
      v-model="showDialog"
      :type="'add'"
      @success="getList"
      @close="showDialog = false"
    />
  </div>
</template> <script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './_com/Table.vue'
import AddDialog from './_com/AddDialog.vue'
import { $getPlatInfo, $getDetailMedAccounts, $getAccountwithPlatId } from '@/api/sys'
export default {
  components: { Search, VTable: Table, AddDialog },
  setup() {
    const { $refs, $nextTick } = getCurrentInstance().proxy
    const formConf = reactive({ normal: [] })
    const searchData = ref({})
    const states = reactive({
      showDialog: false
    })
    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: { placeholder: '请选择平台' },
          optionLabelKey: 'platName',
          optionValKey: 'platId'
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: { placeholder: '请选择账号' },
          optionLabelKey: 'accountName',
          optionValKey: 'accountId'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const onSearchChange = (val, item, type, index, model) => {
      if (item.key === 'platId') {
        model.accountId = ''
        normalFormItemMap.accountId.data = []
        getMedAccounts(val)
      }
    }
    const getPlatInfo = function() {
      $getPlatInfo().then((res) => {
        if (res.code === 1) {
          normalFormItemMap.platId.data = res.data || []
        }
      })
    }
    const getMedAccounts = (val = '') => {
      let $api
      if (val) {
        $api = $getAccountwithPlatId
      } else {
        $api = $getDetailMedAccounts
      }
      $api({ platId: val }).then((res) => {
        if (res.code === 1) {
          normalFormItemMap.accountId.data = res.data || []
        }
      })
    }
    const getList = () => {
      $nextTick(() => {
        $refs.table.getList()
      })
    }
    const onSubmit = (data) => {
      searchData.value = data
      getList()
    }
    const hanleAddClick = () => {
      states.showDialog = true
    }
    buildFormConf()
    getPlatInfo()
    getMedAccounts()
    return {
      formConf,
      onSubmit,
      ...toRefs(states),
      searchData,
      hanleAddClick,
      getList,
      onSearchChange
    }
  }
}
</script>
