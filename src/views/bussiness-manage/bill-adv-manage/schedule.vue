<!--
 * @Author: Linjie
 * @Description:
 * @Date: 2020-11-10 15:38:11
 * @LastEditTime: 2020-12-05 14:20:58
 * @LastEditors: Linjie
-->
<template>
  <div class="schedule-wrap">
    <div class="edit-info flex">
      <el-image class="avatar" fit="contain" :src="orderInfo.accountImg">
        <div slot="placeholder" class="image-slot">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
      <div class="edit-info-right">
        <div class="edit-info-item">
          <span>平台：{{ orderInfo.platName }}</span>
          <span>账号名称：{{ orderInfo.accountName }}</span>
          <span>ID：{{ orderInfo.uniqueId || orderInfo.eid || orderInfo.getDataUrl || '--' }}</span>
        </div>
        <div class="edit-info-item">账号归属：{{ orderInfo.accountBelong }}</div>
        <div class="edit-info-item">粉丝量：{{ orderInfo.fansNum }}</div>
      </div>
    </div>
    <div class="flex m-t-24">
      <span class="m-r-24">工单总数量：{{ orderInfo.workerOrderCount.workerOrderCount }}</span>
      <span class="m-r-24">已完成工单数量：{{ orderInfo.workerOrderCount.overCount }}</span>
      <span class="m-r-24">未完成工单数量：{{ orderInfo.workerOrderCount.notOverCount }}</span>
    </div>
    <p class="red m-t-24">注意：日历中汇总日期内已定排期的工单数量，若都已完成则灰色背景，若存在未完成则红色背景</p>
    <div class="schedule-time-wrap">
      <div v-for="item in times" :key="item.month" class="el-calendar">
        <div class="el-calendar__header">
          <div class="el-calendar__title">
            <i v-if="parseTime(item.month, '{y}-{m}') == nowTimes">*</i>{{ parseTime(item.month, '{y}年{m}月') }}
          </div>
          <div class="el-calendar-tip">当月已定排期{{ item.workerOrderCount }}工单：已完成{{ item.overCount }}单，未完成{{ item.notOverCount }}单</div>
        </div>
        <div class="el-calendar__body">
          <table cellspacing="0" cellpadding="0" class="el-calendar-table">
            <thead><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></thead>
            <tbody>
              <tr v-for="i in 6" :key="i" class="el-calendar-table__row">
                <td v-for="day in item.day.slice((i - 1) * 7, i * 7)" :key="day" :class="day.type">
                  <div class="el-calendar-day">
                    <el-popover
                      v-if="getDayCount(day, item.month)"
                      placement="top-start"
                      width="200"
                      trigger="hover"
                    >
                      <div v-for="quotient in getDayQuotientName(day, item.month)" :key="quotient">{{ quotient }}</div>
                      <template slot="reference">
                        <span>{{ day.value }}</span>
                        <i class="account-num" :class="getCountIsFinish(day, item.month)? '' : 'err'">{{ getDayCount(day, item.month) }}</i>
                      </template>
                    </el-popover>
                    <span v-else>{{ day.value }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import calendar from '@/utils/calendar'
import { parseTime } from '@/utils'
import { $getAdvAccountSchedule } from '@/api/bill-adv-manage'
export default {
  data() {
    return {
      orderInfo: {
        workerOrderCount: [],
        dayWorkerOrderCount: []
      },
      quotientNameMap: {},
      times: [],
      nowTimes: parseTime(new Date(), '{y}-{m}')
    }
  },
  created() {
    this.parseTime = parseTime
    const accountId = this.$route.query.accountId
    $getAdvAccountSchedule({ accountId }).then(res => {
      if (res.code === 1) {
        const quotientNameMap = {}
        this.orderInfo = res.data
        res.data.dayWorkerOrderCount.forEach(item => {
          quotientNameMap[item.addTime] = item.quotientName || ''
        })
        this.quotientNameMap = quotientNameMap
        this.initTimes()
      } else {
        this.$message.error(res.message)
      }
    })
  },
  methods: {
    initTimes() {
      const times = []
      this.orderInfo.monthWorkerOrderCount.forEach(item => {
        const time = parseTime(item.addTime, '{y}-{m}-{d}')
        const timesDay = calendar(time)
        times.push({
          month: item.addTime,
          day: timesDay,
          workerOrderCount: item.workerOrderCount,
          overCount: item.overCount,
          notOverCount: item.notOverCount
        })
      })
      this.times = times
    },
    getDayCount(day, month) {
      if (day.type === 'current') {
        const date = month + '-' + (day.value < 10 ? '0' + day.value : day.value)
        const accountIndex = this.orderInfo.dayWorkerOrderCount.findIndex(item => {
          return item.addTime === date
        })
        if (accountIndex >= 0) {
          return this.orderInfo.dayWorkerOrderCount[accountIndex].workerOrderCount
        }
        return 0
      } else {
        return 0
      }
    },
    getDayQuotientName(day, month) {
      const d = day.value < 10 ? '0' + day.value : day.value
      const dayQuotientName = this.quotientNameMap[`${month}-${d}`].split(',')
      return dayQuotientName
    },
    getCountIsFinish(day, month) {
      if (day.type === 'current') {
        const date = `${month}-${day.value}`
        const accountIndex = this.orderInfo.dayWorkerOrderCount.findIndex(item => {
          return item.addTime === date
        })
        if (accountIndex >= 0) {
          return !(this.orderInfo.dayWorkerOrderCount[accountIndex].notOverCount > 0)
        }
        return false
      } else {
        return false
      }
    }
  }

}
</script>
<style lang="scss">
  .schedule-wrap {
    background: #fff;
    padding: 24px;
  }
  .edit-info {
    .edit-info-right {
      flex: 1;
    }
    .el-image {
      flex-shrink: 0;
      width: 100px;
      height: 100px;
      margin-right: 80px;
    }
    .edit-info-item {
      display: flex;
      line-height: 30px;
      padding-right: 50px;
      color: rgb(32, 31, 31);
      > span {
        margin-right: 100px;
      }
    }
  }
  .el-calendar__header {
    flex-direction: column;
    align-items: center;
  }
  .schedule-time-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    > .el-calendar {
      width: 32%;
    }
    .el-calendar__header,
    .el-calendar__body {
      max-width: 280px;
      padding: 10px;
    }
    .el-calendar__header {
      border: 0;
    }
    .el-calendar__body {
       border: 1px solid rgb(223, 230, 236);
    }
    .el-calendar-table__row {
      > td {
        position: relative;
        &::after {
          content: "";
          display: block;
          width: 100%;
          padding-top: 100%;
        }
      }
      .el-calendar-day {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        padding: 0;
        span {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
        }
        .account-num {
          position: absolute;
          right: 0;
          top: 5px;
          height: 14px;
          width: 14px;
          text-align: center;
          line-height: 14px;
          border-radius: 20px;
          font-size: 12px;
          background: #ccc;
          color: #fff;
          &.err {
            background: #d70a25;
          }
        }
      }
    }
  }
  .el-calendar-tip {
    color: rgb(217, 0, 27);
  }
  .el-calendar__title {
    font-size: 18px;
    i {
      font-size: 18px;
      color: #d70a25;
    }
  }
  .red {
    color: #d70a25;
  }
</style>
