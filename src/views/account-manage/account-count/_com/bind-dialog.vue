<template>
  <el-dialog
    title="账号绑定记录"
    :visible.sync="show"
    width="610px"
    :before-close="handleClose"
  >
    <div v-loading="loading">
      <div class="flex">
        <div>
          <AccountCard :info="bindInfo">
            <template v-slot>
              <div
                v-if="bindInfo.upUpNameAndLeader"
                class="m-t-5"
                style="text-align: left"
              >
                <el-tag size="mini" type="danger">{{
                  bindInfo.upUpNameAndLeader
                }}</el-tag>
              </div>
            </template>
          </AccountCard>
          <p class="bind-text m-t-10">ID:{{ getID(bindInfo) }}</p>
          <p class="entry-time">系统收录时间：{{ bindInfo.collectionTime }}</p>
        </div>
        <div class="flex">
          总粉丝量：{{ bindInfo.fansNum | toThousandsW }}
        </div>
      </div>
      <el-table
        class="m-t-24"
        header-row-class-name="table-header"
        :data="tableData"
      >
        <el-table-column label="绑定人" prop="bindUserName" width="100px" />
        <el-table-column label="绑定状态" prop="bindStatus" width="100px">
          <template slot-scope="{ row }">
            {{ row.isDelete?'已删除':'用户绑定中' }}
          </template>
        </el-table-column>
        <el-table-column label="绑定时间" prop="bindTime" width="180px" />
        <el-table-column label="删除时间" prop="deleteTime" width="180px">
          <template slot-scope="{ row }">
            {{ row.deleteTime | emptyFill }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  toRefs
} from '@vue/composition-api'
import { $getAccountBindInfo } from '@/api/account-manage'
import { AccountCard } from 'components'
import { useToggle } from '@/hook'
import { getAccountStatusName, getID } from './hook'
export default defineComponent({
  props: {
    row: {
      type: Object,
      default() {
        return {}
      }
    },
    value: Boolean
  },
  components: {
    AccountCard
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)
    const { $message } = getCurrentInstance().proxy
    const states = reactive({
      tableData: [],
      loading: true,
      bindInfo: {}
    })
    const getAccountBindInfo = async function() {
      try {
        console.log('accountId: ', props.row)
        const res = await $getAccountBindInfo({
          accountId: props.row.accountId
        })
        if (res.code === 1 && res.data) {
          states.bindInfo = res.data
          states.tableData = res.data.accountBindUserInfo || []
        } else {
          $message.error(res.message)
        }
        states.loading = false
      } catch (err) {
        states.loading = false
      }
    }
    getAccountBindInfo()
    return {
      ...toRefs(states),
      show,
      handleClose,
      getAccountStatusName,
      getID
    }
  }
})
</script>
<style scoped>
.bind-text {
  font-size: 12px;
  line-height: 24px;
  color: #837e7e;
}
.entry-time {
  font-size: 14px;
  color: #837e7e;
}
</style>
