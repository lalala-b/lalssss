<template>
  <el-dialog
    title="设置发布时间"
    :visible.sync="videoTimeVisible"
    width="40%"
    :before-close="handleVideoTimeClose"
  >
    <el-radio-group v-model="publicType">
      <el-radio :label="0">立即发布</el-radio>
      <el-radio :label="1">定时发布</el-radio>
    </el-radio-group>
    <div v-if="publicType" class="flex video-dialog m-t-16">
      <span>请选择时间：</span>
      <el-select
        v-model="dateValue"
        placeholder="请选择"
        @change="handleSelectDate"
      >
        <el-option
          v-for="(item, index) in dateList"
          :key="index"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <div class="hour-select">
        <el-select
          v-model="hourValue"
          placeholder="请选择"
          @change="handleSelectHour"
        >
          <el-option
            v-for="(item, index) in hourList"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disable"
          />
        </el-select>
        <span>时</span>
      </div>
      <div class="hour-select">
        <el-select v-model="miniteValue" placeholder="请选择">
          <el-option
            v-for="item in miniteList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disable"
          />
        </el-select>
        <span>分</span>
      </div>
    </div>
    <p class="m-t-32">确定后，系统将提醒中台同事，由中台同事在{{ +platId===25?'星图':'聚星' }}进行操作</p>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleVideoTimeClose">取 消</el-button>
      <el-button type="primary" :loading="btnLoading" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  getCurrentInstance,
  watch
} from '@vue/composition-api'
import { $confirmReleaseTime } from '@/api/juxing-detail'
import { getDay, timestampToTime } from '@/utils/index'
export default defineComponent({
  props: {
    videoTimeVisible: {
      type: Boolean,
      default: false
    },

    // 平台类型 dy: 抖音  ks: 快手
    platformType: {
      type: String,
      default: 'dy'
    }
  },
  setup(props, { emit }) {
    const { $route, $message } = getCurrentInstance().proxy
    const $orderData = inject('$orderData')
    const addStimpValue = props.platformType === 'ks' ? (1000 * 60) : (60 * 60 * 1000)
    const states = reactive({
      btnLoading:false,
      publicType: 1,
      dateValue: '',
      hourValue: '',
      miniteValue: '',
      dateList: [], // 系统当前时间往后推7天
      hourList: [],
      miniteList: [],
      disableFlag: false,
      platId: $orderData.midDeliveryVideoNewBaseInfoBO.platId,
      nowTime: timestampToTime(Date.now() + addStimpValue).slice(-8, -3) // 当前时间：14:23
    })
    states.dateValue = timestampToTime().slice(0, 10) // 获取到当前日期：12-14
    watch(
      () => states.publicType,
      () => {
        initDateList()
      }
    )
    const clearList = () => {
      states.dateList = []
      states.hourList = []
      states.miniteList = []
    }

    const initDateList = () => {
      clearList()
      states.disableFlag = false
      if (states.dateValue > timestampToTime().slice(0, 10)) {
        states.disableFlag = true
      }
      // 日期从今天往后推7天
      for (let k = 0; k <= 7; k++) {
        const day = getDay(k).split('-')
        states.dateList.push({
          value: getDay(k),
          label: `${day[1]}月${day[2]}日`
        })
      }
      const initHourMinite = (time, now) => {
        const arr = []
        for (let i = 0; i < time; i++) {
          arr.push({
            value: i < 10 ? `0${i}` : i,
            label: i < 10 ? `0${i}` : i,
            disable: states.disableFlag ? false : i < now
          })
        }

        return arr
      }
      const setDefaultDate = () => {
        const hourList = initHourMinite(24, +states.nowTime.split(':')[0])
        const miniteList = initHourMinite(60, +states.nowTime.split(':')[1])
        const defaultHour = hourList.find((item) => !item.disable).value
        const defaultMinite = miniteList.find((item) => !item.disable).value
        states.hourValue = defaultHour
        states.miniteValue = defaultMinite
      }
      setDefaultDate()
      // 获取时间
      states.hourList = initHourMinite(24, +states.nowTime.split(':')[0])
      // 获取分钟
      states.miniteList = initHourMinite(60, +states.nowTime.split(':')[1])
    }
    const handleSelectHour = (val) => {
      if (val > +states.nowTime.split(':')[0] || states.disableFlag) {
        states.miniteList.forEach((item) => {
          item.disable = false
        })
      } else {
        initDateList()
        states.hourValue = val
      }
    }

    const handleSelectDate = (val) => {
      if (val > timestampToTime().slice(0, 10)) {
        states.hourList.forEach((item) => {
          item.disable = false
        })
        states.miniteList.forEach((item) => {
          item.disable = false
        })
      } else {
        initDateList()
      }
    }
    const handleConfirm = () => {
      try {
        // ${timestampToTime().slice(0, 10)} ${defaultHour}:${defaultMinte}
        const thirdVideoPublishTime = !+states.publicType
          ? '立即发布'
          : `${states.dateValue} ${states.hourValue}:${states.miniteValue}`
        console.info(!+states.publicType ? '立即发布' : '定时发布')
        const params = {
          orderId: $route.query.orderId,
          thirdOrderId: $orderData.orderPaymentInfoVO.thirdOrderId,
          platId: $orderData.midDeliveryVideoNewBaseInfoBO.platId,
          thirdVideoPublishTime
        }
        states.btnLoading = true
        $confirmReleaseTime(params).then((res) => {
          $message.success(res.message)
          emit('update')
          handleVideoTimeClose()
          states.btnLoading = false
        })
      } catch (error) {
        states.btnLoading = false
        handleVideoTimeClose()
        $message.error(error.message)
      }
    }
    const handleVideoTimeClose = () => {
      emit('close')
    }
    initDateList()
    return {
      ...toRefs(states),
      handleVideoTimeClose,
      handleConfirm,
      handleSelectHour,
      handleSelectDate
    }
  }
})
</script>
<style lang="scss" scoped>
.third-video-box {
  font-size: 14px;
  .third-title {
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
  .video-cover-box {
    position: relative;
    width: 196px;
    height: 350px;
    border-radius: 4px;
    margin-right: 32px;
  }
}
.video-dialog {
  display: flex;
  align-items: center;
  ::v-deep {
    .el-select {
      width: 120px;
    }
    .hour-select {
      margin-left: 8px;
      .el-select {
        width: 90px;
        margin-right: 2px;
      }
    }
  }
}
</style>
