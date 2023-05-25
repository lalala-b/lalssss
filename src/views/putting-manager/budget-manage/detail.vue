<template>
  <el-dialog
    width="500px"
    :visible.sync="show"
    title="查看预算详情"
  >
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column label="时间" prop="cntDate" />
      <el-table-column label="预算上限" prop="budgetAmount">
        <span slot-scope="{ row }">{{ row.budgetAmount | toThousandsW }}</span>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { $getBudgetDetail } from '@/api/putting-manager'
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    }
  },
  created() {
    this.getDetailData()
  },
  methods: {
    getDetailData() {
      this.loading = true
      $getBudgetDetail({ userId: this.userId }).then(res => {
        if (res.code === 1) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      }).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>
