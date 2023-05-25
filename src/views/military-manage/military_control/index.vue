<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-26 11:15:45
 * @LastEditTime: 2020-12-08 14:38:49
 * @LastEditors: Linjie
-->
<template>
  <div class="military-wrap">
    <el-steps class="steps-wrapper" :active="setps" align-center simple finish-status="success">
      <el-step title="过滤无需审核" />
      <el-step class="second-step" title="更新节点流量及节点点赞量" />
      <el-step title="备份数据" />
      <el-step class="last-step" title="计算军功" />
    </el-steps>
    <div class="flex flex-align-center m-t-24">
      选择时间段：
      <el-date-picker
        v-model="dateStart"
        disabled
        type="date"
        placeholder="开始时间"
      />
      -
      <el-date-picker
        v-model="dateEnd"
        :disabled="disabledDateEnd"
        class="m-r-10"
        type="date"
        placeholder="结束时间"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions"
      />
      <div v-if="active < 3">
        <el-button :loading="active === 2" type="primary" @click="filterIgnoreData">{{ active === 2 ? '过滤中...' : '过滤无需审核' }}</el-button>
      </div>
      <div v-else-if="active < 5">
        <el-button :loading="active === 4" type="primary" @click="updateNodeFlow">{{ active === 4 ? '更新中...' : '更新节点流量' }}</el-button>
      </div>
      <div v-else-if="active < 7">
        <el-button :loading="active === 6" type="primary" @click="backUpData">{{ active === 6 ? '备份中...' : '备份数据' }}</el-button>
      </div>
      <div v-else-if="active < 9">
        <el-button :loading="active === 8" type="primary" @click="plusStartCalculation">{{ active === 8 ? '计算中...' : '计算军工' }}</el-button>
      </div>
      <el-button type="primary" class="el-icon-refresh m-l-10" @click="getLastSoilderDate">刷新</el-button>
    </div>
  </div>
</template>
<script>
import { $getLastSoilderDate, $filterIgnoreData, $updateNodeFlow, $backUpData, $plusStartCalculation } from '@/api/military-manage'
import { parseTime } from '@/utils'

export default {
  name: 'MilitaryControl',
  data() {
    return {
      setps: 0,
      disabledDateEnd: false,
      dateStart: '',
      dateEnd: '',
      active: 1
    }
  },
  computed: {
    pickerOptions() {
      return {
        disabledDate: (time) => {
          return time.getTime() > Date.now() || time.getTime() < new Date(this.dateStart)
        }
      }
    }
  },
  created() {
    this.getLastSoilderDate()
  },
  methods: {
    // 获取计算军工的开始日期
    getLastSoilderDate() {
      $getLastSoilderDate().then((res) => {
        if (res.code === 1) {
          this.dateStart = res.data.startSoilderDate
          this.active = res.data.processStatus
          this.setps = Math.floor((res.data.processStatus - 1) / 2)
          if (res.data.endSoilderDate) {
            this.dateEnd = res.data.endSoilderDate
            this.disabledDateEnd = true
          } else {
            this.disabledDateEnd = false
          }
        }
      })
    },
    // 过滤无需审核
    filterIgnoreData() {
      this.packFn($filterIgnoreData, '过滤无需审核')
    },
    // 更新节点流量
    updateNodeFlow() {
      this.packFn($updateNodeFlow, '更新节点流量')
    },
    // 备份数据
    backUpData() {
      this.packFn($backUpData, '备份数据')
    },
    // 计算军工
    plusStartCalculation() {
      this.packFn($plusStartCalculation, '计算军工', { skipSoilderCal: 1 })
    },
    async packFn(fn, tip, params = {}) {
      try {
        await this.checkTime(tip)
        const dateEnd = this.dateEnd.includes(' 23:59:59') ? this.dateEnd : this.dateEnd + ' 23:59:59'
        const dateStart = this.dateStart
        this.active = this.active + 1
        const res = await fn({
          dateStart,
          dateEnd,
          ...params
        })
        if (res.code === 1) {
          this.disabledDateEnd = true
        } else {
          this.$message.error(res.message)
        }
        this.getLastSoilderDate()
      } catch (err) {
        if (err.__CANCEL__) {
          return
        }
        this.getLastSoilderDate()
        this.$message.error(err.message)
      }
    },
    checkTime(tip) {
      const { dateStart, dateEnd } = this
      if (!dateEnd) {
        return Promise.reject({ message: '请选择结束日期' })
      }
      return this.$confirm(
        `${tip}时间段：${parseTime(dateStart, '{y}-{m}-{d}')}～${dateEnd}, \n 请确认开始${tip}！`,
        '操作确认',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
    }
  }
}
</script>
<style lang="scss">
  .military-wrap {
    padding: 24px;
    background: #ffffff;
  }
  .steps-wrapper{
      padding: 13px 5% !important;
    }
  .second-step{
    flex-basis: 41% !important;
  }
  .last-step{
    flex-basis: 9% !important;
  }
</style>
