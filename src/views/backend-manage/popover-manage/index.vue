
<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
      />
    </wrap>

    <wrap class="m-t-24">
      <el-button
        type="primary"
        class="m-b-24"
        @click="handleAdd"
      >新增弹窗</el-button>
      <VTable ref="table" :search-data="searchData" />
      <AddPopverManageDialog
        v-if="showDialog"
        v-model="showDialog"
        @success="handleGetList"
      />
    </wrap>
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './Table'
import AddPopverManageDialog from './AddPopverManageDialog'

import qs from 'qs'

export default {
  components: {
    VTable: Table,
    Search,
    AddPopverManageDialog
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: [],
      hasExport: true
    })

    const states = reactive({
      showDialog: false
    })

    const searchData = ref({
      pageNum: 1
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
          type: 'input',
          key: 'content',
          data: [],
          conf: { placeholder: '弹窗标题' }
        },
        {
          type: 'select',
          key: 'notificationStatus',
          data: [
            {
              val: '0',
              label: '下架'
            },
            {
              val: '1',
              label: '上架'
            }
          ],
          conf: { placeholder: '弹窗状态' },
          optionLabelKey: 'label',
          optionValKey: 'val'
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

    const onSubmit = (data) => {
      Object.assign(searchData.value, data)
      handleGetList()
    }

    const onExport = (data) => {
      const params = Object.assign({}, searchData.value, data)

      window.open(
        `/api/notification/exportNotificationInfoList?${qs.stringify({
          ...params
        })}`
      )
    }

    const handleAdd = () => {
      states.showDialog = true
    }

    buildFormConf()
    handleGetList()
    return {
      searchData,
      formConf,
      onSubmit,
      ...toRefs(states),
      onExport,
      handleAdd,
      handleGetList
    }
  }
}
</script>
