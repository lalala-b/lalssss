<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-09-08 20:14:01
 * @LastEditTime: 2020-12-31 15:52:51
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
      确认删除 <el-button type="text">{{ subject.account_name }}</el-button> 吗？
    </div>
    <div slot="footer" class="M-benchmarkDelDialogFooter">
      <el-button @click="onCancel">取消</el-button>
      <el-button type="primary" :loading="loading" @click="onConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
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
    onConfirm() {
      this.loading = true
      this.$request({
        'url': '/delBenchmarkAccount',
        'method': 'post',
        'data': {
          'user_id': this.userid,
          'account_id': this.subject.account_id
        }
      })
        .then(
          re => {
            this.loading = false
            this.$emit('del', true, this.subject)
            this.onCancel()
          }
          , err => {
            this.loading = false
          }
        )
    }
  }
}
</script>
