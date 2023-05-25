<template>
  <div class="P-advertisingLaunch">
    <Wrap class="search-view">
      <Search
        ref="search"
        :config="formConf"
        @submit="onSubmit"
        @export="onExport"
        @change="onChange"
      />
    </Wrap>
    <Wrap class="table-view m-t-16">
      <div class="flex flex-justify-end m-b-12">
        <el-button
          v-if="$permission('upload_black_List')"
          type="primary"
          @click="handleShielding"
        >上传黑名单</el-button>
      </div>
      <el-table
        ref="table"
        v-scrollbar
        v-loading="loading"
        :data="tableData"
        @sort-change="doSort"
      >
        <el-table-column prop="accountId" label="账号ID" />
        <el-table-column prop="platName" label="平台" />
        <el-table-column prop="accountName" label="账号名称" />
        <el-table-column prop="createUserName" label="创建人" />
        <el-table-column prop="createdTime" label="创建时间" />
        <el-table-column label="操作" width="152" fixed="right">
          <template slot-scope="s">
            <el-link
              v-log
              size="small"
              type="primary"
              @click="handleRemove(s.row.accountId)"
            >移除黑名单</el-link>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="total" class="pagenation-view">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :page-size="searchData.size"
          :total="total"
          :current-page.sync="searchData.pageNum"
          @current-change="getList"
        />
      </div>
    </Wrap>
    <BlackDialog
      v-if="showBlackDialog"
      v-model="showBlackDialog"
      @update="updateData"
    />
  </div>
</template>
<script>
import {
  defineComponent,
  reactive,
  getCurrentInstance,
  toRefs,
  ref
} from '@vue/composition-api'
import { Search } from 'components'
import { useTableSort } from '@/hook'
import BlackDialog from './_component/BlackDialog.vue'
import {
  $getBlackPlat,
  $getBlackAccount,
  $getBlackList,
  $removeBlackAccount
} from '@/api/putting-manager'
import { copy } from '@/utils'
import qs from 'qs'
export default defineComponent({
  components: {
    Search,
    BlackDialog
  },
  setup(props) {
    const { $store, $message } =
      getCurrentInstance().proxy

    const formConf = reactive({
      normal: [],
      hasExport: true
    })
    const searchData = ref({
      size: 20,
      pageNum: 1
    })

    const states = reactive({
      loading: false,
      tableData: [],
      total: 0,
      showBlackDialog: false
    })
    const formatAccountName = (data) => {
      const params = copy(data)
      const { accountName, belongName } = params
      if (belongName || accountName) {
          params.accountName = belongName || accountName
      }
      return params
    }

    const onChange = (val, item, _, __, model) => {
      switch (item.key) {
        case 'platId': // 签约团队
          model.accountId = ''
          model.accountName = ''
          model.belongName = ''
          normalFormItemMap.accountId.data = []
          getBlackAccount(val)
          break
      }
    }

    const normalFormItemMap = reactive({})
    const buildFormConf = () => {
      let normal = [
        {
          type: 'select',
          key: 'platId',
          data: [],
          optionLabelKey: 'platName',
          optionValKey: 'platId',
          conf: {
            placeholder: '全部平台'
          }
        },
        {
          type: 'select',
          key: 'accountId',
          data: [],
          conf: {
            placeholder: '请输入账号',
            defaultFirst: true,
            clearable: true,
            filterable: true
          },
          optionValKey: 'accountId',
          optionLabelKey: 'accountName'
        }
      ]
      normal = normal.filter(function(item, index) {
        item.index = index
        normalFormItemMap[item.key] = item
        return true
      })
      formConf.normal = normal
    }
    const getBlackPlat = async() => {
      const res = await $getBlackPlat()
      if (res.code === 1) {
        normalFormItemMap.platId.data = res.data
      }
    }
    const getBlackAccount = async(platId = '') => {
      const res = await $getBlackAccount({ platId })
      if (res.code === 1) {
        normalFormItemMap.accountId.data = res.data
      }
    }
    const getList = function() {
      states.loading = true
      return $getBlackList({
        ...searchData.value,
        type: 2
      })
        .then((res) => {
          states.loading = false
          if (res.code === 1) {
            states.tableData = res.data || []
            states.total = res.total
          } else {
            $message.error(res.message)
          }
        })
        .catch((err) => {
          if (err && err.__CANCEL__) return
          states.loading = false
          $message.error(err.message || '网络错误')
        })
    }
    const onSubmit = (data) => {
      const params = formatAccountName(data)
      Object.assign(searchData.value, { ...params })
      getList()
    }
    const onExport = (data) => {
       const params = formatAccountName(data)
      Object.assign(searchData.value, { ...params })
      window.open(
        `/api/business/foreign/blockAccount/blockAccountList?type=1&${qs.stringify({
          ...searchData.value
        })}`
      )
    }
    const handleShielding = () => {
      states.showBlackDialog = true
    }
    const handleRemove = (accountId) => {
       $removeBlackAccount({ accountId }).then(res => {
        if (res.code === 1) {
          $message.success('账号已移除黑名单')
          getList()
        } else {
          $message.error(res.message)
        }
       })
    }
    const updateData = () => {
      getList()
      getBlackPlat()
      getBlackAccount()
    }
    buildFormConf()
    getBlackPlat()
    getBlackAccount()
    getList()
    const { doSort } = useTableSort(searchData.value, getList)
    return {
      ...toRefs(states),
      did: $store.getters.user.userInfo.did,
      formConf,
      onSubmit,
      searchData,
      onChange,
      doSort,
      getList,
      onExport,
      handleRemove,
      handleShielding,
      updateData
    }
  }
})
</script>

<style scoped>
</style>
