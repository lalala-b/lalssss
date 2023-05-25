<template>
  <el-dialog
    :visible="show"
    :title="type === 'brand' ? '品牌合作历史' : '行业合作历史'"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div>
      <AccountCard :info="currentItem" />
    </div>
    <div>
      <el-table
        v-scrollbar
        :data="tableData"
        style="width: 100%"
        :show-header="false"
        max-height="400px"
      >
        <el-table-column prop="filedName">
          <template slot-scope="{ row }">
            {{ (row[`${type}Name`] || '--') }}（{{ (row.count || 0) }}次）
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleGoWorker(row)">
              查看工单
            </el-button>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button :loading="btnLoading" @click="handleExport">导 出</el-button>
      <el-button type="primary" @click="handleClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { defineComponent, computed, reactive, toRefs, getCurrentInstance } from '@vue/composition-api'
import qs from 'qs'
import { AccountCard } from 'components'

export default defineComponent({
  props: {
    type: {
      type: String,
      default: ''
    },
    currentItem: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const states = reactive({
      btnLoading: false
    })

    const { $componentId, $router } = getCurrentInstance().proxy

    const tableData = computed(() => {
      return props.type === 'brand' ? props.currentItem.accountBrandData : props.currentItem.accountFiledData
    })

    const handleGoWorker = (row) => {
      let url = ''
      if (props.type === 'brand') {
        url = $router.resolve({
          path: '/bussiness-manage/workorder',
          query: {
            activeName: 'order',
            tabName: '视频工单',
            brandId: row.brandId,
            accountId: row.accountId
          }
        })
      } else {
        url = $router.resolve({
          path: '/bussiness-manage/workorder',
          query: {
            activeName: 'order',
            tabName: '视频工单',
            fieldId: row.filedId,
            accountId: row.accountId
          }
        })
      }

      window.open(url.href, '_blank')
    }

    const handleClose = () => {
      emit('close')
    }

    const handleExport = () => {
      const { accountId, accountName } = props.currentItem
      location.href = `/api/account/info/${props.type}/export?${qs.stringify({ accountId, accountName })}&componentId=${$componentId}`
    }

    return {
      ...toRefs(states),
      tableData,
      handleGoWorker,
      handleClose,
      handleExport
    }
  }
})
</script>
