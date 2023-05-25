<template>
  <el-dialog
    width="500px"
    :visible.sync="show"
    :title="title"
  >
    <div v-if="!isBatch">{{ userInfo }}</div>
    <el-form
      ref="form"
      :model="editInfo"
      :rules="rules"
    >
      <el-form-item label="当月投放预算" prop="curMonthBudgetAmount">
        <el-input-number v-model="editInfo.curMonthBudgetAmount" :precision="2" :min="0" :max="1000" /> 万元
      </el-form-item>
      <el-form-item v-if="nextMonthFlag" label="下月投放预算" prop="nextMonthBudgetAmount">
        <el-input-number v-model="editInfo.nextMonthBudgetAmount" :precision="2" :min="0" :max="1000" /> 万元
      </el-form-item>
    </el-form>
    <p class="tip-red">一旦确认后下单限制立即生效，已提交的订单不参与此限制！</p>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show = false">取 消</el-button>
      <el-button :loading="loading" type="primary" @click="handleUpdate">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { $editBudgetNum } from '@/api/putting-manager'
export default {
  props: {
    isBatch: {
      type: Boolean,
      default: false
    },
    nextMonthFlag: {
      type: Boolean,
      default: false
    },
    orgNameD: {
      type: String,
      default: ''
    },
    orgNameF: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    },
    curMonthBudgetAmount: {
      type: Number,
      default: 0
    },
    nextMonthBudgetAmount: {
      type: Number,
      default: 0
    },
    userIdList: {
      type: Array,
      default() {
        return []
      }
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      editInfo: {
        curMonthBudgetAmount: undefined,
        nextMonthBudgetAmount: undefined
      },
      rules: {
        curMonthBudgetAmount: [{ required: true, message: '请输入当月投放预算', trigger: 'blur' }],
        nextMonthBudgetAmount: [{ required: true, message: '请输入下月投放预算', trigger: 'blur' }]
      }
    }
  },
  computed: {
    title() {
      return this.isBatch ? '批量修改预算' : '修改预算'
    },
    show: {
      get() {
        return this.value
      },
      set() {
        this.$emit('input', false)
      }
    },
    userInfo() {
      return `${this.orgNameD}-${this.orgNameF}   ${this.userName}`
    }
  },
  created() {
    this.editInfo.curMonthBudgetAmount = this.curMonthBudgetAmount || undefined
    this.editInfo.nextMonthBudgetAmount = this.nextMonthBudgetAmount || undefined
    if (!this.nextMonthFlag) {
      // 离职 无需下月预算
      this.editInfo.nextMonthBudgetAmount = 0
    }
  },
  methods: {
    async handleUpdate() {
      try {
        await this.$refs.form.validate()
        this.loading = true
        $editBudgetNum({ ...this.editInfo, userIdList: this.userIdList }).then(res => {
          if (res.code === 1) {
            this.show = false
            this.$message.success('修改成功')
            this.$emit('update')
          } else {
            this.$message.error(res.message)
          }
        }).catch(err => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        }).finally(_ => {
          this.loading = false
        })
      } catch (err) { console.error(err) }
    }
  }
}
</script>
