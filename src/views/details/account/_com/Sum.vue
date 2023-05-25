<template>
  <div class="sum">
    <div class="sum-options flex flex-align-center flex-justify-between">
      <h3 data-bold>
        <i class="iconfont iconshuju" type="primary" />
        新增数据
      </h3>
      <div class="flex flex-align-center">
        <el-radio-group v-model="timeIndex" class="m-r-10" @change="handleRadioChange">
          <el-radio-button
            v-for="item in timeList"
            :key="item.label"
            data-burry_btn_name="tab"
            :data-burry_title="item.text"
            :label="item.label"
          >{{ item.text }}</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="timerange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          size="small"
          @change="handleTimeRangeChange"
        />
        <IconTip v-if="showTip" class="m-l-16" placement="top-start" label="数据说明" icon-class="iconwenhao">
          <div>
            <slot name="tipContent" />
          </div>
        </IconTip>
        <!-- <el-tooltip v-if="showTip" class="item" effect="dark" placement="top-start">
          <div slot="content">
            <slot name="tipContent" />
          </div>
          <span>数据说明 <i class="iconfont iconwenhao" /></span>
        </el-tooltip> -->
      </div>
    </div>
    <Statistics :data="summerList" />
    <!-- <ul class="summer-list m-t-10">
      <li v-for="item in summerList" :key="item.key">
        <h4>{{ item.text }}</h4>
        <p>{{ item.val | toThousandsW }}</p>
      </li>
    </ul> -->
  </div>
</template>
<script>
import dayjs from 'dayjs'
import IconTip from '@/components/IconTip'
import Statistics from '@/components/Statistics'
export default {
  components: {
    IconTip,
    Statistics
  },
  props: {
    timeList: {
      type: Array,
      default: () => []
    },
    defIndex: {
      type: [Number, String],
      default: 2
    },
    summerList: {
      type: Array,
      default: () => []
    },
    showTip: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      timeIndex: 0,
      timerange: null
    }
  },
  mounted() {
    this.timeIndex = this.defIndex
    this.handleRadioChange(this.defIndex)
  },
  methods: {
    handleRadioChange(value) {
      if (value >= 0) {
        console.log(this.timeList)
        console.log(value)
        const selectTime = this.timeList.find(item => item.label == value)
        const times = selectTime.value
        const start = selectTime.start
        if (times !== undefined && times !== null) {
          const timerange = [
            dayjs().add(start, 'day').format('YYYY-MM-DD'),
            dayjs().add(times + start, 'day').format('YYYY-MM-DD')
          ]
          if (times < 0) {
            timerange.reverse()
          }
          this.timerange = timerange
        } else {
          this.timerange = null
        }
      } else {
        this.timerange = null
      }
      this.$emit('search', this.timerange)
    },
    handleTimeRangeChange() {
      if (!this.timerange) {
        this.timeIndex = -1
      } else {
        this.timeIndex = -2
      }
      this.$emit('search', this.timerange)
    }
  }
}
</script>

<style lang="scss" scoped>
.sum {
  background: #fff;
  &-options {
    padding: 32px 24px 16px 26px;
    > h3 {
      font-size: 16px;
    }
  }
}
.summer-list {
  display: flex;
  justify-content: space-between;
  padding: 0 60px;
  // flex-wrap: wrap;
  li {
    display: flex;
    flex-direction: column;
    align-items: center;
    // width: 25%;
    padding: 10px 0;
    // &.w-50 {
    //   width: 50%;
    // }
    h4 {
      font-weight: 500;
      font-size: 16px;
      line-height: 32px;
    }
    p {
      line-height: 32px;
      font-size: 18px;
      font-weight: bold;
    }
  }
}
::v-deep {
  .tooltip-label {
    font-size: 16px;
    align-items: center;
  }
}
</style>
