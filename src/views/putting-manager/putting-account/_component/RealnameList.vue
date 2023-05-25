<template>
  <el-dialog
    title="账号对接信息"
    :append-to-body="true"
    :visible="show"
    width="700px"
    @close="handleClose"
  >
    <div class="flex flex-align-center flex-justify-between">
      <AccountCard :info="info" />
      <span class="m-r-24">是否合作：{{ info.isPartner === 0 ? '否' : '是' }}</span>
    </div>
    <div class="m-t-10">账号添加时间：{{ info.createTime }}</div>
    <div class="m-t-10">仅展示近10条{{ businessLine }}对接信息</div>
    <el-table
      v-scrollbar
      v-loading="loading"
      :data="tableData"
    >
      <el-table-column prop="realname" label="对接人" />
      <el-table-column prop="beginDate" label="保护期开始日期" />
      <el-table-column prop="endDate" label="保护期结束日期" />
      <el-table-column prop="remark" label="备注">
        <template slot-scope="{ row }">
          <el-tooltip
            effect="dark"
            :content="row.remark"
            placement="top"
          >
            <p class="text-over-hidden-5">{{ row.remark }}</p>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api'
import AccountCard from '@/components/AccountCard'
import { useToggle } from '@/hook'
import { $getMeetList } from '@/api/bussiness-manage'
export default {
  components: {
    AccountCard
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    info: {
      type: Object,
      default() {
        return {}
      }
    },
    businessLine: {
      type: String,
      default: ''
    }
  },
  setup(props, ctx) {
    const { show, handleClose } = useToggle(props)
    const state = reactive({
      tableData: [],
      loading: true
    })

    $getMeetList({ businessLine: props.businessLine, accountId: props.info.accountId, size: 10 }).then(res => {
      if (res.code === 1) {
        state.tableData = res.data
      } else {
        ctx.root.$message(res.message)
      }
    }).finally(_ => {
      state.loading = false
    })

    return {
      show,
      handleClose,
      ...toRefs(state)
    }
  }
}
</script>
