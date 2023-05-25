<template>
  <el-dialog
    width="95%"
    :title="isAccountQuotesLib ? '账号档期' : '档期管理'"
    :close-on-click-modal="false"
    append-to-body
    top="-10%"
    :visible.sync="showDialog"
    @close="onCancel"
  >
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" size="medium" @click="showDialog = false">关闭</el-button>
    </span>
    <el-alert
      v-if="!isAccountQuotesLib"
      :closable="false"
      center
      title="若达人某天因为各种原因无法接单，可以单击日历具体时间进行封档"
      type="success"
    />
    <div class="accountMsgWrap">
      <img :src="accountDqMsg.accountImg" alt="">

      <div class="msgLeft">
        <div>
          <span>平台：{{ accountDqMsg.platName || '--' }}</span>
          <span>账号名称：{{ accountDqMsg.accountName || '--' }}</span>
        </div>

        <div>
          <span>账号归属：{{ accountDqMsg.accountBelong || `${accountDqMsg.dname}-${accountDqMsg.fname}` || '--' }}</span>
          <span>粉丝量：{{ accountDqMsg.fansNum ? accountDqMsg.fansNum.toString().indexOf('.') === -1 ? `${(accountDqMsg.fansNum / 10000).toFixed(1)}w` : `${accountDqMsg.fansNum}w` : '--' }}</span>
        </div>

        <!-- <div>账号归属：{{ accountDqMsg.accountBelong }}</div>
        <div>粉丝量：{{ accountDqMsg.fansNum && accountDqMsg.fansNum.toString().indexOf('.') === -1 ? (accountDqMsg.fansNum / 10000).toFixed(1) : accountDqMsg.fansNum }}w</div> -->
      </div>
    </div>
    <el-calendar v-model="value">
      <template slot="dateCell" slot-scope="{ data }">
        <div
          style="width: 100%; height: 100%; position: relative"
          :class="
            changeStyle(data.day) === 'block'
              ? 'dq-block'
              : changeStyle(data.day) === 'envelope'? 'dq-envelope' : 'normal'
          "
          :style="{background: changeStyle(data.day) === 'block' ? getBackground(data.day) : ''}"
          @mouseenter="
            handleShowOperator($event, changeStyle(data.day), 'show', data.day)
          "
          @mouseleave="
            handleShowOperator($event, changeStyle(data.day), 'hide', data.day)
          "
        >
          <div style="padding: 6px">
            {{
              data.day.split('-')[2].indexOf('0') === 0
                ? data.day.split('-')[2].slice(1)
                : data.day.split('-')[2]
            }}
            <div>
              <div v-for="(item,index) in calendarData" :key="index" style="width:100%;">
                <div v-if="item.slotDate===data.day" style="position: relative; margin-top: 10px">
                  {{ item.text }}
                </div>
              </div>
            </div>

            <div v-if="changeStyle(data.day) === ''" class="envelopeDq">
              <div class="fengdang" @click="showFdConfirmWrap">封档</div>
              <div v-show="isfdOperateShow" class="confirmWrap">
                <span @click="confirm(data.day, changeStyle(data.day))">确定</span>
                <span @click="cancel">取消</span>
              </div>
            </div>

            <div
              v-else-if="changeStyle(data.day) === 'envelope'"
              class="envelopeDq"
            >
              <div class="fengdang" @click="showDqjfConfirmWrap">档期解封</div>
              <div v-show="isdqjfOperateShow" class="confirmWrap">
                <span @click="confirm(data.day, changeStyle(data.day))">确定</span>
                <span @click="cancel">取消</span>
              </div>
            </div>

            <div v-else-if="changeStyle(data.day) === 'block'" ref="workOrderWrap" class="workOrderWrap" :style="{top: -70-(productorContent.length-1)*30+'px'}">
              <span
                v-for="item in productorContent"
                :key="item.workId"
                :title="`${item.quotientName}(${getWorkStatus(item.workerStatus)})`"
                :style="{color:item.workerStatus === 0 || item.workerStatus === 1 ? 'rgb(255, 98, 0)' : 'rgb(0, 0, 0)'}"
                @click="watchWorkOrder(item.workId)"
              >
                {{ item.quotientName }}({{ getWorkStatus(item.workerStatus) }})
              </span>
            </div>
          </div>
        </div>
      </template>
    </el-calendar>
  </el-dialog>
</template>

<script>
import {
  $addDqManagementData,
  $updateDqManagementData,
  $getDqManagementData
} from '@/api/sign-contract'
export default {
  props: {
    // data: {
    //   type: Array,
    //   default: () => ([])
    // },
    accountDqMsg: {
      type: Object,
      default: () => ({})
    },
    accountId: {
      type: Number,
      default: 0
    },
    show: {
      type: Boolean,
      default: false
    },
    isAccountQuotesLib: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      value: new Date(),
      calendarData: [],
      isfdOperateShow: false,
      isdqjfOperateShow: false,
      showDialog: false,
      productorContent: []
    }
  },

  watch: {
    show(newVal) {
      this.showDialog = newVal
      this.getDqManagementData()
    },
    accountDqMsg(newVal) {
    //   const val = newVal
      console.log(newVal, 'accountDqMsgObj')
    //   this.accountDqMsgObj = val
    //   // const fansNum = this.accountDqMsgObj.fansNum
    //   // this.accountDqMsgObj.fansNum = fansNum.toString().indexOf('.') === -1 ? (fansNum / 10000).toFixed(1) : fansNum
    },
    immediate: true
  },

  methods: {
    changeStyle(date) {
      let str = ''
      if (this.calendarData.length) {
        this.calendarData.forEach((item) => {
          if (item.slotDate === date) {
            str = item.slotType ? 'envelope' : 'block'
          }
        })
      }
      return str
    },

    getBackground(date) {
      const item = this.calendarData.find((item) => item.slotDate === date)
      const item1 = item.details.find(item => item.workerStatus === 0 || item.workerStatus === 1)
      return item1 ? 'rgb(255, 223, 203)' : 'rgb(225, 227, 230)'
    },

    getWorkStatus(num) {
      switch (+num) {
        case 0: return '商业信息待录入'
        case 1: return '待履约'
        case 2: return '已履约'
        case 3: return '已核账'
        case 4: return '撤单'
      }
    },

    handleShowOperator(e, type, operate, date = '') {
      switch (type) {
        case 'block': {
          const children = e.target.children[0].children[1]
          if (operate === 'show') {
            children.style.visibility = 'visible'
            children.style.opacity = '1'
            children.style.width = ''
            const item = this.calendarData.find((item) => item.slotDate === date)
            this.productorContent = item.details
          } else {
            children.style.visibility = 'hidden'
            children.style.opacity = '0'
          }
          break
        }
        case 'envelope': {
          if (this.isAccountQuotesLib) {
            return
          }
          const children1 = e.target.children[0].children[0]
          const children2 = e.target.children[0].children[1]
          if (operate === 'show') {
            children1.style.zIndex = '-1'
            children2.style.opacity = '1'
          } else {
            children1.style.zIndex = '1'
            children2.style.opacity = '0'
            this.isdqjfOperateShow = false
            children2.style.width = '100%'
          }
          break
        }
        case '': {
          if (this.isAccountQuotesLib) {
            return
          }
          const children = e.target.children[0].children[1]
          if (operate === 'show') {
            children.style.opacity = '1'
          } else {
            children.style.opacity = '0'
            this.isfdOperateShow = false
            children.style.width = '100%'
          }
          break
        }
        default:
          break
      }
    },

    showDqjfConfirmWrap(e) {
      if (this.isAccountQuotesLib) {
        return
      }
      // e.target.parentNode.style.height = '80%'
      this.isdqjfOperateShow = true
    },

    showFdConfirmWrap(e) {
      if (this.isAccountQuotesLib) {
        return
      }
      // e.target.parentNode.style.height = '80%'
      this.isfdOperateShow = true
    },

    watchWorkOrder(workId) {
      this.$router.push({
        path: '/bussiness-manage/workorder',
        query: {
          activeName: 'order',
          workId: workId,
          tabName: '视频工单'
        }
      })
    },

    confirm(date, type) {
      if (this.isAccountQuotesLib) {
        return
      }
      const slotType = type === '' ? 1 : 0
      const paramsObj = {
        accountId: this.accountId,
        slotDate: date,
        slotType
      }
      if (slotType) {
        $addDqManagementData(paramsObj)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success('封档成功')
              this.getDqManagementData()
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            if (err.__CANCEL__) {
              return
            }
            this.$message.error(err.message)
          })
      } else {
        paramsObj.slotType = 1
        $updateDqManagementData(paramsObj)
          .then((res) => {
            if (res.code === 1) {
              this.$message.success('解封成功')
              this.getDqManagementData()
            } else {
              this.$message.error(res.message)
            }
          })
          .catch((err) => {
            if (err.__CANCEL__) {
              return
            }
            this.$message.error(err.message)
          })
      }
    },

    cancel(e) {
      if (this.isAccountQuotesLib) {
        return
      }
      const parent = e.target.parentNode.parentNode
      parent.style.width = '100%'
      this.isfdOperateShow = false
      this.isdqjfOperateShow = false
    },

    // 关闭弹出框
    onCancel() {
      this.$emit('closeCalendarWrap')
    },

    // 获取档期数据
    getDqManagementData() {
      $getDqManagementData({ accountId: this.accountId })
        .then((res) => {
          if (res.code === 1) {
            const calendarData = res.data
            this.calendarData = calendarData.map((item) => {
              if (item.slotType) {
                item.text = '档期已封'
              } else {
                item.text = `已 定`
                // （${item.details.length}）
              }
              return item
            })
          } else {
            this.$message.error(res.message)
          }
        })
        .catch((err) => {
          if (err.__CANCEL__) {
            return
          }
          this.$message.error(err.message)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
div,span{
  caret-color: transparent;
}
.dq-block {
  background: rgb(249, 208, 208);
}

.dq-envelope {
  background: rgb(208, 208, 208);
}

p {
  margin: 4px 0;
}

.normal {
  background: rgb(237, 247, 240);
}

.envelopeDq {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  color: #fff;
  flex-direction: column;
}

.confirmWrap {
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 10;
  border: 2px solid rgb(188, 202, 240);
  background: rgba(0, 0, 0, 0.6);
  box-sizing: border-box;

  span {
    margin: 0 6px;

    &:hover {
      color: rgb(188, 202, 240);
    }
  }
}

.fengdang {
  width: 100%;
  height: 100%;
  border: 2px solid rgb(188, 202, 240);
  background: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

::v-deep .el-calendar,
::v-deep .el-calendar__body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  // transform: scale(0.92);
  width:90%;
  margin: 0 auto;
}

::v-deep .el-calendar__header {
  width: 90%;

  .el-calendar__title {
    font-weight: bold;
    font-size: 20px;
  }
}

::v-deep .el-calendar-table {
  width: 100%;

  .el-calendar-day {
    text-align: center;
    // width: 180px;
    height: 100px;
    padding: 2px;
    font-size: 18px;
    font-weight: bold;
  }
}

::v-deep .el-calendar__button-group {
  .el-button {
    padding: 6px 10px;
    font-size: 18px;

    &:nth-child(2) {
      display: none;
    }
  }
}

::v-deep .el-calendar-table td.is-today {
  color: #595959;
}

::v-deep .el-calendar-table td.is-selected {
  background: transparent;
}

::v-deep .el-alert {
  width: 82%;
  padding: 24px 16px;
  margin: 0 auto;
  margin-bottom: 60px;

  &--success.is-light {
    background: rgb(255, 223, 203);
    color: rgb(255, 98, 0);
  }

  .el-alert__title {
    font-size: 20px;
  }
}

::v-deep .el-dialog {
  transform: scale(0.7);
}

::v-deep .el-dialog__header {
  .el-dialog__title,
  .el-dialog__headerbtn {
    font-size: 20px;
  }
}

::v-deep .dialog-footer {
  .el-button {
    width: 100px;
    height: 45px;
    font-size: 18px;
    position: relative;
    right: 40px;
    bottom: 10px;
  }
}

.accountMsgWrap {
  width: 82%;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    width: 12%;
  }

  .msgLeft {
    // margin-left: 160px;
    font-size: 20px;
    width:70%;

    div {
      margin-bottom: 36px;
      display: flex;
      width: 100%;
      justify-content: flex-start;

      span {
        text-align: left;
        margin-right: 90px;
        width: 50%;
        // flex:1;
        &:last-child{
          margin-right: 0;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

.workOrderWrap {
  position: absolute;
  top: -70px;
  left: -30px;
  width: 140%;
  // height: auto;
  padding: 10px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px#888888;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  visibility: hidden;
  font-weight: 600;
  font-size: 20px;

  span {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    height:30px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -60px;
    transform: translate(7%, -50%);
    width: 0;
    height: 0;
    border: 20px solid #fff;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    z-index: 2;
  }

  &::before {
    content: '';
    border: 20px solid #888888;
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-bottom: 20px solid transparent;
    position: absolute;
    bottom: -62px;
    transform: translate(7%, -50%);
    z-index: 1;
    filter: blur(2px);
  }
}
</style>
