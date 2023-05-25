<template>
  <div id="boxArea" class="selectMonthBoxSquare rel clearFixed">
    <!-- el-input输入框：readonly和clearable属性不能同时使用 -->
    <el-input
      v-model="inputValue"
      class="inputStyle"
      type="text"
      placeholder="请选择查询月份"
      readonly
      @focus="showBox = true"
    >
      <i slot="prefix" class="el-input__icon el-icon-date" />
      <!-- 清空图标：有内容的时候渲染出来，鼠标hover到input框的时候再显示出来（即：输入框有内容并且鼠标悬浮时显示该图标） -->
      <!-- <i
        v-if="showClear"
        slot="suffix"
        class="el-input__icon el-icon-circle-close clearIconStyle"
        @click="resetMonth"
      /> -->
    </el-input>
    <!-- 年份月份选择弹框 -->
    <div v-if="showBox" class="selectContentBox">
      <div class="contentArea">
        <!-- 年份 -->
        <div class="contentArea-year">
          <div
            :class="curIndex == 0 ? 'cursor t-r icon-grey' : 'cursor t-r'"
            class="cursor"
            style="width: 15%"
            @click="reduceYear"
          >
            <i class="el-icon-d-arrow-left" />
          </div>
          <div>{{ OneY }}年</div>
          <div
            :class="
              curIndex == DateList.length - 1 ? 'cursor icon-grey' : 'cursor'
            "
            style="width: 15%"
            @click="addYear"
          >
            <i class="el-icon-d-arrow-right" />
          </div>
        </div>
        <!-- 月份 -->
        <div class="conterList">
          <el-checkbox-group
            v-model="optTime[curIndex].queryTime"
            class="flex flex-wrap"
            :max="max"
            @change="onChange"
          >
            <el-checkbox
              v-for="(item, index) in DateList[curIndex].queryTime"
              :key="index"
              :disabled="getDisabled(item, optTime[curIndex].TimeYear)"
              class="onSelect flex-x-center"
              :label="`${DateList[curIndex].TimeYear}-${
                item <= 9 ? `0${item}` : item
              }`"
            >
              {{ monthMap[item] }}月
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <!-- 按钮 -->
      <div class="buttonBox t-r">
        <!-- <p v-if="showTip">最多仅可选择12个月</p> -->
        <!-- <el-button
          class="buttonStyle"
          size="mini"
          type="primary"
          plain
          @click.stop="handleSubmit"
        >确定</el-button> -->
        <el-button
          class="buttonStyle"
          size="mini"
          plain
          @click.stop="resetMonth"
        >重置</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { copy } from '@/utils'
export default {
  props: {
    nums: {
      type: Number,
      default: 6
    },
    schedule: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      DateList: [], // 年份月份数组
      optTime: [], // 月份选中结果数组
      OneY: '', // 当前年份
      curIndex: 0, // 当前年份下标值
      optTimes: [], // 点击月份时的所有选中结果
      resultTimes: [], // 点击“确定”按钮后的选择结果
      showBox: false, // 是否显示月份选择弹框
      inputValue: '', // 输入框的绑定值
      showClear: false, // 是否显示输入框右边的“清空”小图标
      monthMap: {
        // 月份显示为中文
        1: '一',
        2: '二',
        3: '三',
        4: '四',
        5: '五',
        6: '六',
        7: '七',
        8: '八',
        9: '九',
        10: '十',
        11: '十一',
        12: '十二'
      },
      showTip: false,
      maxObj: {},
      max: 12
    }
  },
  watch: {
    nums: {
      immediate: true,
      handler(val) {
        if (val) {
          this.init()
        }
      }
    }
  },
  created() {},
  mounted() {
    this.closeMonthDialog()
  },
  methods: {
    closeMonthDialog() {
      const _this = this
      // 点击弹框外的任意位置关闭区域弹窗
      document.addEventListener('click', (e) => {
        // 获取弹窗对象
        const boxArea = document.getElementById('boxArea')
        // 判断弹窗对象中是否包含点击对象
        if (boxArea && !boxArea.contains(e.target)) {
          _this.inputValue = _this.optTimes.join(',')
          // 根据输入框是否有值来判断清空图标是否渲染
          _this.showClear = _this.inputValue !== ''
          // 将点击“确定”按钮的选择结果保存起来（该值将在哪里使用：在点击弹框以外区域关闭弹框时使用，mounted中）
          if (_this.optTimes.length) {
            const dataList = copy(_this.optTimes)
            _this.resultTimes = dataList.sort()
          } else {
            _this.resultTimes = _this.optTimes
          }
          this.showBox = false
        }
      })
    },
    // 初始化数据，获取前20年，然后循环 每一年里面都有12个月的 得到数组 opTime 和 DateList
    init() {
      const _this = this
      const _opt = []
      const _optTime = []
      const arr = new Array(12)
      const optDate = this.getDateList()
      optDate.map((item, index) => {
        // 月份选择时el-checkbox-group绑定的值
        _optTime[index] = {
          TimeYear: item,
          queryTime: []
        }
        // 给每一年份设置12个月份，el-checkbox初始化显示时使用
        _opt[index] = {
          TimeYear: item,
          queryTime: []
        }
        for (let i = 1; i <= arr.length; i++) {
          _opt[index].queryTime.push(i)
        }
      })
      _this.optTime = _optTime
      _this.DateList = _opt
      this.initTime()
    },
    setMonths() {
      const schedule = JSON.parse(this.schedule)
      if (schedule && schedule.length) {
        schedule.forEach((item, index) => {
          const year = item.split('-')[0]
          const month = item.split('-')[1]
          this.DateList.forEach((item, index) => {
            if (+item.TimeYear === +year) {
              this.curIndex = index
            }
          })
          const Item = this.optTime[this.curIndex]
          Item.queryTime.push(`${year}-${month}`)
        })
        this.onChange()
        this.resultTimes = this.optTimes
        this.$emit('submitMonth', this.optTimes)
        return
      }
    },
    initTime() {
      if (this.schedule) {
        this.setMonths()
        return
      }
      let monthNum = this.nums
      if (monthNum > 12) return
      const date = new Date()
      const currentMonth = date.getMonth() + 1
      const currentIndex = this.curIndex
      const Item = this.optTime[currentIndex]
      const year = Item.TimeYear
      const curentYear = date.getFullYear()
      if (monthNum === 12) {
        if (curentYear === 2022) {
          monthNum = this.nums - 1 - (12 - currentMonth)
        } else if (curentYear === 2023 && currentMonth === 1) {
          monthNum = this.nums - currentMonth
        }
      }
      if (monthNum <= currentMonth) {
        for (let k = 0; k < monthNum; k++) {
          const itemMonth = currentMonth - k
          if (itemMonth < 10) {
            Item.queryTime.push(`${year}-0${itemMonth}`)
          } else {
            Item.queryTime.push(`${year}-${itemMonth}`)
          }
        }
      } else if (monthNum > currentMonth) {
        const curNum = monthNum - currentMonth
        if (currentMonth > 0) {
          for (let k = 0; k < currentMonth; k++) {
            const itemMonth = currentMonth - k
            if (itemMonth < 10) {
              Item.queryTime.push(`${year}-0${itemMonth}`)
            } else {
              Item.queryTime.push(`${year}-${itemMonth}`)
            }
          }
        }

        if (curNum > 0) {
          for (let k = 0; k < curNum; k++) {
            const itemMonth = 12 - k
            if (itemMonth < 10) {
              this.optTime[currentIndex - 1].queryTime.push(
                `${year - 1}-0${itemMonth}`
              )
            } else {
              this.optTime[currentIndex - 1].queryTime.push(
                `${year - 1}-${itemMonth}`
              )
            }
          }
        }
      }
      this.onChange()
      this.resultTimes = this.optTimes
      this.$emit('submitMonth', this.optTimes)
    },
    // 获取近20年年份列表，倒序排列，最新一年在最前面
    getDateList() {
      const Dates = new Date('2022')
      const year = Dates.getFullYear()
      const optDate = []
      for (let i = year; i <= year + 4; i++) {
        optDate.push(i)
      }
      const curentYear = new Date().getFullYear()
      optDate.forEach((item, index) => {
        if (item === curentYear) {
          this.curIndex = index
          this.OneY = item
        }
      })
      return optDate
    },
    getDisabled(item, year) {
      if (this.DateList[this.curIndex].TimeYear === 2022 && item === 1) {
        return true
      }
      const date = new Date()
      if (date.getFullYear() < year) {
        return true
      }
      if (date.getFullYear() === year) {
        if (date.getMonth() + 1 < item) {
          return true
        }
      }
      if (date.getFullYear() > year) {
        return false
      }
      return false
    },
    // 重置
    resetMonth() {
      const _this = this
      // 将年份重置到当前年份
      const Dates = new Date()
      const year = Dates.getFullYear()
      _this.OneY = year
      // 将已选择的月份清空
      _this.optTimes = []
      for (const i in _this.optTime) {
        _this.optTime[i].queryTime = []
      }
      // 将输入框清空
      _this.inputValue = ''
      // 根据输入框是否有值来判断清空图标是否渲染，此处必然不渲染
      this.showClear = false
      // 将点击“确定”按钮的选择结果清空
      _this.resultTimes = []
      // 关闭月份选择弹框
      _this.showBox = false
      _this.$emit('resetBtn')
      _this.initTime()
    },
    // 左上角年份减少
    reduceYear() {
      const _this = this
      // 如果已经是最后一年了，则年份不能再减少了
      if (_this.curIndex === 0) return
      // 当前下标值+1，根据下标值获取年份值
      _this.curIndex = _this.curIndex - 1
      _this.OneY = _this.DateList[_this.curIndex].TimeYear
      this.getSameObj()
    },
    // 左上角年份增加
    addYear() {
      const _this = this
      if (_this.curIndex < this.DateList.length - 1) {
        _this.curIndex = _this.curIndex + 1
        _this.OneY = _this.DateList[_this.curIndex].TimeYear
      }
      this.getSameObj()
    },
    getSameObj() {
      this.optTime.forEach((item, index) => {
        this.maxObj[index] = item.queryTime.length
      })
      this.getMax()
    },
    getMax() {
      let result = 0
      for (const k in this.maxObj) {
        result += this.maxObj[k]
      }
      this.maxObj[this.curIndex]
      this.max = 12 - (result - this.maxObj[this.curIndex])
    },
    // 选择月份
    onChange() {
      const _this = this
      // 遍历optTime中已选择的月份，将已选结果塞到optTimes数组中
      const _opt = _this.optTime
      const arr = []
      for (const item in _opt) {
        if (_opt[item].queryTime.length > 0) {
          _opt[item].queryTime.filter((v) => {
            arr.push(v)
          })
        }
      }
      this.getSameObj()
      _this.optTimes = arr
      // 更新输入框的值
      _this.inputValue = _this.optTimes.join(',')
      // 根据输入框是否有值来判断清空图标是否渲染
      _this.showClear = _this.inputValue !== ''
    }
  }
}
</script>
<style lang="scss">
.selectMonthBoxSquare {
  width: 250px;
  .inputStyle {
    width: 250px;
    input {
      text-overflow: ellipsis;
    }
  }
  .clearIconStyle {
    display: none;
  }
  .inputStyle:hover .clearIconStyle {
    display: block;
  }
  .selectContentBox {
    position: absolute;
    top: 35px;
    left: 0;
    z-index: 2021;
    background: #ffffff;
    border: 1px solid #e5e5e5;
  }
  .conterList {
    .onSelect {
      width: 25% !important;
      margin: 20px 0 !important;
    }
    .columWidth {
      width: 33.33%;
    }
    .el-checkbox__input {
      display: none !important;
    }
    .el-checkbox__label {
      padding-left: 0px !important;
    }
  }
  .contentArea-year {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-bottom: 1px solid #e5e5e5;
  }
  .selectBox {
    width: 100px;
    input {
      height: 25px;
      line-height: 25px;
    }
    .el-input .el-input__icon {
      line-height: 25px;
    }
  }
  .tagStyle {
    margin-right: 10px;
    height: 25px;
    line-height: 25px;
  }
  .lableStyle {
    font-size: 14px;
  }
  .el-button--mini {
    padding: 5px 15px;
    font-size: 12px;
    border-radius: 3px;
  }
  .buttonBox {
    border-top: 1px solid #e5e5e5;
    padding: 10px 10px 10px 0;
  }
  .el-checkbox {
    text-align: center;
  }
  .icon-grey {
    color: rgb(176, 176, 176);
  }
}
</style>
