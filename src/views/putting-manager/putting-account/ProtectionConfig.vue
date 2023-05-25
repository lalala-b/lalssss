<template>
  <Wrap class="table-view">
    <el-tag class="m-b-12" type="warning">
      <i
        class="el-icon-warning m-r-12"
      />能够配置投放账号的保护期是否冻结（默认周日周一统一冻结）
    </el-tag>

    <div v-loading="loading" class="calendar">
      <el-calendar v-model="selectDate">
        <template
          slot="dateCell"
          slot-scope="{date, data}"
        >
          <div
            :class="freezeDayArr.findIndex(item => item.deadlineDate === data.day) > -1 ? 'freezeDay' : 'commonDay'"
            @click="handleClick(data.day)"
          >
            {{ +data.day.split('-').slice(2)[0] }}
            <p
              v-if="freezeDayArr.findIndex(item => item.deadlineDate === data.day) > -1"
            >
              已冻结
              <IconTip
                v-if="freezeDayArr.find(item => item.deadlineDate === data.day).remark"
                :content="freezeDayArr.find(item => item.deadlineDate === data.day).remark"
                icon-class="iconwenhao"
              />
            </p>
          </div>
        </template>
      </el-calendar>
    </div>

    <el-dialog v-if="showFreezeRemark" title="冻结原因" :visible.sync="showFreezeRemark">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item label=" " prop="remark">
          <el-input
            v-model="form.remark"
            autocomplete="off"
            placeholder="请输入冻结原因"
            maxlength="20"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showFreezeRemark = false">取 消</el-button>
        <el-button v-loading="btnLoading" type="primary" @click="handleConfirm">确 定</el-button>
      </div>
    </el-dialog>
  </Wrap>
</template>

<script>
import { $getFreezeDay, $getSysCurTime, $executeThawDay, $executeFreezeDay } from '@/api/protection-config'
import { dateFormat } from '@/utils'
import IconTip from '@/components/IconTip'

export default {
  components: {
    IconTip
  },
  data() {
    return {
      selectDate: '',
      freezeDayArr: [],
      currentDate: '',
      loading: false,
      btnLoading: false,
      showFreezeRemark: false,
      dateMap: ['日', '一', '二', '三', '四', '五', '六'],
      form: {
        remark: ''
      },
      rules: {
        remark: [{ required: true, message: '请输入冻结原因', trigger: ['change', 'blur'] }]
      }
    }
  },
  watch: {
    selectDate: {
      handler: function(val, oldVal) {
        // 当前的月份
        const currentMonth = dateFormat('YYYY-mm', new Date(val))
        // 上一次的月份
        const oldMonth = dateFormat('YYYY-mm', new Date(oldVal))

        // 上次和这次不一样，重新获取
        if (currentMonth !== oldMonth) {
          const range = this.getMonthTimeRange(val)
          this.getFreezeDay({ dateStart: range[0], dateEnd: range[1] })
        }
      },
      immediate: true
    },
    showFreezeRemark(val) {
      if (!val) {
        this.form = { remark: '' }
      }
    }
  },
  mounted() {
    this.getSysCurTime()
  },
  methods: {
    formartDate(val) {
      if (+val >= 10) {
        return val
      } else {
        return `0${val}`
      }
    },
    getMonthTimeRange(val) {
      const startDate = new Date(val)
      startDate.setMonth(startDate.getMonth() - 1)
      startDate.setDate(1)
      const startTime = startDate.getFullYear() + '-' + this.formartDate(startDate.getMonth() + 1) + '-' + this.formartDate(startDate.getDate())

      const endDate = new Date(val)
      endDate.setMonth(endDate.getMonth() + 2)
      endDate.setDate(0)
      const endTime = endDate.getFullYear() + '-' + this.formartDate(endDate.getMonth() + 1) + '-' + this.formartDate(endDate.getDate())

      return [startTime, endTime]
    },

    async getFreezeDay(val) {
      this.loading = true
      try {
        const { code, data, message } = await $getFreezeDay(val)
        if (+code === 1) {
          this.freezeDayArr = data
        } else {
          this.$message.error(message)
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },

    async getSysCurTime() {
      const res = await $getSysCurTime()
      this.currentDate = res.data.split(' ')[0] || dateFormat('YYYY-mm-dd', new Date())
      this.selectDate = res.data.split(' ')[0] || dateFormat('YYYY-mm-dd', new Date())
    },

    async handleConfirm() {
      await this.$refs.form.validate()

      const { code, message } = await $executeFreezeDay({ deadlineDate: dateFormat('YYYY-mm-dd', new Date(this.selectDate)), remark: this.form.remark })
      this.btnLoading = true
      try {
        if (+code === 1) {
          this.$message.success('冻结成功')
          const range = this.getMonthTimeRange(this.selectDate)
          this.getFreezeDay({ dateStart: range[0], dateEnd: range[1] })
          this.showFreezeRemark = false
        } else {
          this.$message.error(message)
        }
        this.btnLoading = false
      } catch (e) {
        this.btnLoading = false
      }
    },

    handleClick(day) {
      // 在当前时间之前，不可操作
      if (new Date(day).getTime() < new Date(this.currentDate).getTime()) return

      const isFreeze = this.freezeDayArr.findIndex(item => item.deadlineDate === day) > -1

      if (isFreeze) {
        this.$confirm(`是否解冻${+day.split('-')[1]}月${+day.split('-')[2]}日（周${this.dateMap[new Date(day).getDay()]}）的保护期？`, '', {
          confirmButtonText: '解冻',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const { code, message } = await $executeThawDay({ deadlineDate: day })
          if (+code === 1) {
            this.$message.success('解冻成功')
            const range = this.getMonthTimeRange(day)
            this.getFreezeDay({ dateStart: range[0], dateEnd: range[1] })
          } else {
            this.$message.error(message)
          }
        })
      } else {
        const twoDayAgo = dateFormat('YYYY-mm-dd', new Date(new Date(day).getTime() - 48 * 3600 * 1000))
        this.$confirm(`是否冻结${+day.split('-')[1]}月${+day.split('-')[2]}日（周${this.dateMap[new Date(day).getDay()]}）的保护期？<div style="color: #ff0000">冻结后如需要解冻，需要提前2天（${+twoDayAgo.split('-')[1]}月${+twoDayAgo.split('-')[2]}日（周${this.dateMap[new Date(twoDayAgo).getDay()]}）进行操作。</div>`, '', {
          confirmButtonText: '冻结',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning'
        }).then(() => {
          this.showFreezeRemark = true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar {
  ::v-deep {
    .el-button--mini {
      padding: 7px 15px;
    }

    .el-calendar__title {
      font-weight: bold;
      font-size: 14px;
    }

    .el-calendar-day {
    }

    .el-calendar-table td {
      border-color: #fff;
    }

    .el-calendar-table .el-calendar-day {
      padding: 0px;

      div {
        height: 100%;
        padding: 8px;
      }
    }

    .el-calendar__button-group {
      & button {
        &:nth-child(2) {
          display: none;
        }
      }
    }
  }

  .commonDay {
    background: rgb(237, 247, 240);
  }

  .freezeDay {
    background: #e96a6a;
    color: #fff;
  }
}

</style>
