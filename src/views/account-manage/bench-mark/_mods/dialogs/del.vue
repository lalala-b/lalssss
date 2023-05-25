<!--
 * @Author: Luoxd
 * @Description:
 * @Date: 2020-08-25 09:45:52
 * @LastEditTime: 2020-12-17 16:30:26
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    class="M-benchmarkDelDialog"
    title="删除确认"
    :visible.sync="status"
    @close="onCancel"
  >
    <div class="M-benchmarkDelDialogText">
      确认删除 <el-button type="text">{{ subject.accountName }}</el-button> 吗？
    </div>
    <div slot="footer" class="M-benchmarkDelDialogFooter">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
// account/monitor/benchmarking?accountId=2&accountType=2
import { $delBenchmarkAccount } from '@/api/account-manage'
import './del.scss'
export default {
  'props': {
    'status': {
      'type': Boolean,
      default() {
        return false
      }
    },
    'subject': {
      'type': Object,
      default() {
        return {}
      }
    },
    'userid': {
      'type': Number,
      default() {
        return 0
      }
    }
  },
  data() {
    return {
      'loading': false
    }
  },
  'methods': {
  // 取消删除
    onCancel() {
      this.$emit('close')
      this.$emit('update:status', false)
    },
    // 确认删除
    async onConfirm() {
      this.loading = true
      const re = await $delBenchmarkAccount({
        accountId: this.subject.accountId,
        accountType: 2
      })
      if (re.code === 1) {
        this.loading = false
        this.$emit('del', true, this.subject)
        this.$bus.$emit('upLog', { operation_module: '删除确定', accountId: this.subject.accountId })
        this.onCancel()
      } else {
        this.loading = false
      }
    }
  }
}
</script>
