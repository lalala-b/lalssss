<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-12-17 19:46:20
 * @LastEditTime: 2020-12-25 17:51:52
 * @LastEditors: Linjie
-->
<template>
  <el-dialog
    class="C-backend-cancel"
    width="40%"
    title="推荐结果反馈"
    :visible="value"
    @close="$emit('input', false)"
  >
    <div class="add-form">
      <el-form ref="addForm" label-width="80px" :model="addForm" :rules="addFormRules">
        <el-form-item label="原因" prop="recommendFeedback">
          <el-input
            v-model="addForm.recommendFeedback"
            maxlength="100"
            type="textarea"
            :rows="10"
            :placeholder="`请输入账号推荐不合适的原因。
示例：达人类型为政务资讯，投放不合适。`"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$emit('input', false)">取 消</el-button>
        <el-button :loading="loading" type="primary" @click="dialogConfirm">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { $cancelRecommend, $getRefuseByAccountId, $cancelMedRecommend, $getMedRefuseByAccountId } from '@/api/bussiness-manage'

export default {
  props: {
    value: {
      type: Boolean
    },
    accountId: {
      type: [Number, String],
      default: ''
    },
    refuseId: {
      type: [Number, String],
      default: ''
    },
    from: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      addForm: {
        recommendFeedback: ''
      },
      addFormRules: {
        recommendFeedback: [{ required: true, message: '请输入账号推荐不合适的原因', trigger: 'blur' }]
      }
    }
  },
  created() {
    let $api = $getRefuseByAccountId
    if (this.from === 'recommend') {
      $api = $getMedRefuseByAccountId
    }
    $api({ accountId: this.accountId }).then((res) => {
      if (res.code === 1 && res.data) {
        this.addForm.recommendFeedback = res.data.recommendFeedback
      }
    })
  },
  methods: {
    async cancelRecommend() {
      this.loading = true
      try {
        let $api = $cancelRecommend
        if (this.from === 'recommend') {
          $api = $cancelMedRecommend
        }
        const params = {
          accountId: this.accountId,
          userId: this.$store.state.user.userInfo.id,
          recommendFeedback: this.addForm.recommendFeedback,
          refuseId: this.refuseId
        }
        const res = await $api(params)
        if (res.code === 1) {
          this.$emit('input', false)
          this.$emit('updateTable')
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }

        this.loading = false
      } catch (error) {
        if (error.__CANCEL__) {
          return
        }
        this.loading = false
      }
    },
    dialogConfirm() {
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.cancelRecommend()
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .C-backend-cancel {
    .dialog-footer {
      text-align: center;
    }
  }
</style>
