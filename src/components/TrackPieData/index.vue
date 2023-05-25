<template>
  <el-dialog
    title="数据信息"
    :visible.sync="show"
    :before-close="handleClose"
    width="600px"
  >
    <!--  :summary-method="getSummaries"
      show-summary -->
    <el-table
      ref="accounts"
      v-loading="loading"
      border
      header-row-class-name="table-header"
      :data="tableData"
    >
      <el-table-column prop="accountTag" label="赛道">
        <template slot-scope="{ row }">
          {{ row.accountTag }}
        </template>
      </el-table-column>
      <el-table-column prop="accountNum" label="达人数量">
        <template slot-scope="{ row }">
          {{ row.accountNum|emptyFill }}
        </template>
      </el-table-column>
      <el-table-column prop="accountPercent" label="达人占比">
        <template slot-scope="{ row }">
          {{ row.accountPercent|emptyFill }}
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs } from '@vue/composition-api'
import { useToggle } from '@/hook'
import { $getPieData, $getSignPieData } from '@/api/track-anlysis'
import qs from 'qs'

export default defineComponent({
  props: {
    value: Boolean,
    type: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    paramsObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const states = reactive({
      tableColumn: [],
      tableData: [],
      loading: false
    })
    const getSummaries = (param) => {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '总计'
          return
        }
        const values = data.map((item) => Number(item[column.property]))
        if (!values.every((value) => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          if (index === 2) {
            sums[index] = sums[index].toFixed(0) + '%'
          }
        } else {
          sums[index] = 'N/A'
        }
      })
      return sums
    }

    const getPieData = () => {
      states.loading = true
      const $api = props.type === 'sign' ? $getSignPieData : $getPieData
      $api({ ...props.paramsObj })
        .then((res) => {
          states.loading = false
          if (res.code === 1 && res.data) {
            states.tableData = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    }
    const exportExcel = () => {
      window.open(
        `${props.api}?${qs.stringify({
          ...props.paramsObj
        })}`
      )
    }
    getPieData()
    return {
      ...toRefs(states),
      show,
      handleClose,
      exportExcel,
      getSummaries
    }
  }
})
</script>
