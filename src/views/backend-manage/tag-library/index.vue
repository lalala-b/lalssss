
<template>
  <div>
    <wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @change="onChange"
      />
    </wrap>

    <wrap class="m-t-24">
      <div class="flex tools">
        <el-button type="primary" @click="handleShowAddDialog">新增标签</el-button>
      </div>
      <VTable
        ref="table"
        :plat-info="platInfo"
        :search-data="searchData"
      />
    </wrap>

    <AddDialog :show="showAddDialog" :plat-info="platInfo" @close="handleCloseAddDialog" @confirm="handleConfirm" />
  </div>
</template>
<script>
import { Search } from 'components'
import { getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import Table from './table'
import { copy } from '@/utils'
import qs from 'qs'
import { $getTagLibraryCondition, $getPlatTagTypeList } from '@/api/tag-library'
import AddDialog from './addDialog.vue'

export default {
  components: {
    VTable: Table,
    Search,
    AddDialog
  },
  setup() {
    const { $permission, $refs, $nextTick, $set } = getCurrentInstance().proxy
    const formConf = reactive({
      normal: []
    })

    const states = reactive({
      platInfo: [],
      showAddDialog: false
    })

    const searchData = ref({})

    $nextTick(() => {
      $set($refs.search.form, 'platId', '25')
      getPlatTagTypeList(25)

      const params = copy($refs.search.form)

      Object.assign(searchData.value, params)

      $nextTick(() => {
        handleGetList()
      })
    })

    const handleGetList = () => {
      $nextTick(() => {
        $refs.table.getList()
      })
    }

    const handleShowAddDialog = () => {
      states.showAddDialog = true
    }

    const handleCloseAddDialog = () => {
      states.showAddDialog = false
    }

    const handleConfirm = () => {
      states.showAddDialog = false
      handleGetList()
    }

    const normalFormItemMap = {}
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'platId',
          data: [],
          conf: { placeholder: '平台', clearable: false },
          optionLabelKey: 'platName',
          optionValKey: 'platId'
        },
        {
          type: 'select',
          key: 'tagType',
          data: [],
          conf: { placeholder: '标签类型' },
          optionLabelKey: 'tagTypeName',
          optionValKey: 'tagType'
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

    const getCondition = async() => {
      const { code, data } = await $getTagLibraryCondition()

      if (+code === 1) {
        normalFormItemMap.platId.data = data.platInfos || []
        states.platInfo = data.platInfos || []
      }
    }

    const getPlatTagTypeList = async(platId) => {
      const res = await $getPlatTagTypeList({ platId })
      normalFormItemMap.tagType.data = res.data || []
    }

    const onChange = (val, item, type, index, model) => {
      if (item.key === 'platId') {
        getPlatTagTypeList(val)
      }
    }

    const onSubmit = (data) => {
      Object.assign(searchData.value, data)
      handleGetList()
    }

    buildFormConf()
    getCondition()
    return {
      searchData,
      formConf,
      onSubmit,
      onChange,
      handleShowAddDialog,
      handleCloseAddDialog,
      getPlatTagTypeList,
      handleConfirm,
      ...toRefs(states)
    }
  }
}
</script>
<style lang="scss" scoped>
.tools {
  margin-bottom: 20px;
  justify-content: flex-end;
}
</style>
