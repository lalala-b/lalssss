<template>
  <el-dialog
    title="设置月度收支"
    :visible="showMonthDialog"
    width="500px"
    :before-close="close"
  >
    <el-form
      ref="addForm"
      v-loading="loading"
      :rules="formRules"
      :model="formData"
      class="norm-form form"
      label-width="150px"
    >
      <el-form-item label="绩效年月">
        <el-date-picker
          v-model="formData.performanceYearMonth"
          :clearable="false"
          type="month"
          format="yyyy-MM"
          @change="handleSchedulTime"
        />
      </el-form-item>
      <el-form-item label="实际营收总额" prop="allActualReceivable">
        <el-input
          v-model="formData.allActualReceivable"
          placeholder="请输入金额"
          @keydown.native="hanleToDown"
          @input="
            formData.allActualReceivable = /^\d+\.?\d{0,2}$/.test(arguments[0])||arguments[0] == '' ? arguments[0] : arguments[0]=inputValue"
        />
      </el-form-item>
      <el-form-item label="目标流水" prop="targetOrderMoney">
        <el-input
          v-model="formData.targetOrderMoney"
          placeholder="请输入金额"
          @keydown.native="hanleToDown"
          @input="
            formData.targetOrderMoney = /^\d+\.?\d{0,2}$/.test(arguments[0])||arguments[0] == '' ? arguments[0] : arguments[0]=inputValue"
        />
      </el-form-item>
      <el-form-item label="其余支出总额" prop="otherActualReceivable">
        <el-input
          v-model="formData.otherActualReceivable"
          placeholder="请输入金额"
          @keydown.native="hanleToDown"
          @input="
            formData.otherActualReceivable = /^\d+\.?\d{0,2}$/.test(arguments[0])||arguments[0] == '' ? arguments[0] : arguments[0]=inputValue"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button
        :loading="loading"
        type="primary"
        @click="dialogConfirm"
      >确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  ref,
  getCurrentInstance
} from '@vue/composition-api'
import day from 'dayjs'
import { copy } from '@/utils'
import {
  $setMonthPayment,
  $editMonthPayment,
  $getMonthPayment
} from '@/api/sign-contract'

export default defineComponent({
  props: {
    showMonthDialog: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const { $message } = getCurrentInstance().proxy
    const addForm = ref('')
    const formRules = reactive({
      allActualReceivable: [
        {
          validator: (rule, value, callback) => {
            if (value > 1000000000) {
              callback(new Error('仅支持输入含10亿以内的数字'))
              return
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      targetOrderMoney: [
        {
          validator: (rule, value, callback) => {
            if (value > 1000000000) {
              callback(new Error('仅支持输入含10亿以内的数字'))
              return
            }
            callback()
          },
          trigger: 'change'
        }
      ],
      otherActualReceivable: [
        {
          validator: (rule, value, callback) => {
            if (value > 1000000000) {
              callback(new Error('仅支持输入含10亿以内的数字'))
              return
            }
            callback()
          },
          trigger: 'change'
        }
      ]
    })
    const states = reactive({
      loading: false,
      id: '',
      formData: {
        performanceYearMonth: day(new Date()).format('YYYY-MM')
      }
    })
    const close = () => {
      emit('close')
    }
    const handleSchedulTime = (val) => {
      getMonthPayment({ performanceYearMonth: day(val).format('YYYY-MM') })
    }

    const dialogConfirm = async() => {
      await addForm.value.validate()
      const params = copy(states.formData)
      // close()
      if (states.id) {
        $editMonthPayment({
          ...params,
          performanceYearMonth: day(params.performanceYearMonth).format(
            'YYYY-MM'
          ),
          id: states.id
        }).then((res) => {
          emit('getList')
          emit('getStatisticsList')
          if (+(res || {}).code === 1) {
            close()
          } else {
            $message.error((res || {}).message || '系统错误')
          }
        })
      } else {
        $setMonthPayment({
          ...params,
          performanceYearMonth: day(params.performanceYearMonth).format(
            'YYYY-MM'
          )
        }).then((res) => {
          if (res && res.code === 1) {
            close()
          } else {
            $message.error((res || {}).message || '系统错误')
          }
        })
      }
    }
    const getMonthPayment = (data = {}) => {
      const params = copy(states.formData)
      states.loading = true
      $getMonthPayment({
        performanceYearMonth: params.performanceYearMonth,
        ...data
      })
        .then((res) => {
          if (res && res.code === 1) {
            const {
              allActualReceivable,
              otherActualReceivable,
              targetOrderMoney,
              id
            } = res.data || {}

            states.id = id || ''

            states.formData = {
              ...states.formData,
              allActualReceivable: allActualReceivable || '',
              otherActualReceivable: otherActualReceivable || '',
              targetOrderMoney: targetOrderMoney || ''
            }
            states.loading = false
          } else {
            $message.error((res || {}).message || '系统错误')
            states.loading = false
          }
        })
        .catch(() => {
          states.loading = false
        })
    }
    const inputValue = ref('')
    const hanleToDown = (e) => {
      inputValue.value = e.target.value
    }

    getMonthPayment()

    return {
      close,
      ...toRefs(states),
      dialogConfirm,
      handleSchedulTime,
      formRules,
      addForm,
      hanleToDown,
      inputValue
    }
  }
})
</script>

<style lang="scss" scoped>
.form {
  &-title {
    font-size: 14px;
    color: #333;
    margin-bottom: 8px;
  }
  &-border {
    border: 1px solid #d9d9d9;
    padding: 16px 32px;
  }
  ::v-deep {
    .video {
      .el-link--primary {
        width: 260px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .el-link--danger {
        font-size: 12px;
        margin-left: 20px;
      }
    }
  }
}
</style>
