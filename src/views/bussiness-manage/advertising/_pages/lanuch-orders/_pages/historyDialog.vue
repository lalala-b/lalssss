<template>
  <el-dialog
    title="历史移交记录"
    :visible.sync="show"
    :before-close="handleClose"
    width="600px"
  >
    <el-table
      ref="accounts"
      v-loading="loading"
      :data="tableData"
      header-row-class-name="table-header"
      @sort-change="doSort"
    >
      <el-table-column prop="createdTime" label="操作时间" width="170" />
      <el-table-column prop="operateName" label="操作人" />
      <el-table-column label="移交记录" width="200" align="left">
        <template slot-scope="{row}">
          <div v-if="row.oldAdvertiserUserName">
            广告师：{{ row.oldAdvertiserUserName }}->{{ row.advertiserUserName }}
          </div>
          <div v-if="row.oldCommissionerRealname">
            投放专员：{{ row.oldCommissionerRealname }}->{{ row.commissionerRealname }}
          </div>
          <div v-if="row.oldChoreographerName">
            编导：{{ row.oldChoreographerName }}->{{ row.choreographerName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="移交原因">
        <template slot-scope="{row}">{{ row.transferReason|emptyFill }}</template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { defineComponent, getCurrentInstance, reactive, ref, toRefs } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { useTableSort } from '@/hook'
import qs from 'qs'
import { $getTransferOrderLog } from '@/api/bussiness-manage'

export default defineComponent({
  props: {
    value: Boolean,
    orderId: {
      type: Number,
      default: 0
    }
  },

  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const { show, handleClose } = useToggle(props)
    const states = reactive({
      tableData: [],
      loading: false,
      pageNum: 1,
      total: 1
    })
    const getList = async() => {
      const res = await $getTransferOrderLog({ orderId: props.orderId })
      if (res.code === 1) {
        console.log(states.tableData)
        states.tableData = res.data
      } else {
        states.tableData = []
      }
    }
    getList()
    const { doSort } = useTableSort({}, getList)
    return {
      ...toRefs(states),
      show,
      handleClose,
      getList,
      doSort
    }
  }
})
</script>
