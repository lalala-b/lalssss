<template>
  <el-dialog
    title="数据信息"
    :visible.sync="show"
    :before-close="handleClose"
    :width="_width+'px'"
  >
    <div class="header flex">
      <div class="header-item-0">赛道</div>
      <div
        v-for="(itemM, indexM) in monthList"
        :key="indexM"
        class="header-item"
      >
        {{ itemM }}
      </div>
    </div>
    <div v-for="(item, index) in tableData" :key="index" class="column flex">
      <div class="column-item-0">{{ item.trackName }}</div>
      <div
        v-for="(inerItem, InerIndex) in item.data"
        :key="InerIndex"
        class="column-item"
      >
        <div class="column-item-inner">
          {{ formatUnit(inerItem.value)|emptyFill }}
          <!-- {{ inerItem.value>0?(inerItem.value/10000).toFixed(2)+'w':'--' }} -->
        </div>
        <div class="column-item-inner">
          {{ inerItem.percent>0?(inerItem.percent*100).toFixed(2)+'%':'--' }}
        </div>
      </div>
    </div>
    <div slot="footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  defineComponent,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import { useToggle } from '@/hook'
import qs from 'qs'
import { formatUnit } from '@/utils'
export default defineComponent({
  props: {
    value: Boolean,
    trackInfoList: {
      type: Object,
      default: () => {
        return {}
      }
    },
    api: {
      type: String,
      default: ''
    },
    paramsObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props, { emit }) {
    const { show, handleClose } = useToggle(props)

    const states = reactive({
      tableColumn: [],
      tableData: [],
      loading: false,
      pageNum: 1,
      total: 1,
      // sumList: [],
      monthList: [],
      _width: 800
    })
    // const getSummaries = (param) => {
    //   const { cates, values } = props.trackInfoList
    //   const percentArr = []
    //   const numArr = []
    //   const sum = []
    //   values.forEach((item, index) => {
    //     let num = 0
    //     let radio = 0
    //     for (let k = 0; k < item.length - 1; k++) {
    //       num += Number(item[k].value)
    //       radio += Number(item[k].percent)
    //     }
    //     percentArr.push((radio * 100).toFixed(2))
    //     numArr.push(num)
    //   })
    //   percentArr.forEach((item, index) => {
    //     numArr[index] = (numArr[index] / 10000).toFixed(2) + 'w'
    //     sum.push(numArr[index])
    //     sum.push(Number(item).toFixed(0) + '%')
    //   })
    //   sum.unshift('总计')
    //   states.sumList = sum
    // }
    watch(
      () => props.trackInfoList,
      (val) => {
        if (val && Object.keys(val) && Object.keys(val).length) {
          // getSummaries()
          states.monthList = val.cates
          states._width = val.cates.length < 3 ? 600 : val.cates.length * 2 * 86 + 100
          console.log(states._width)
          states.tableData.length = val.terms ? val.terms.length : 0
          if (!states.tableData.length) return
          val.terms.forEach((item, k) => {
            states.tableData[k] = { trackName: item, data: [] }
            for (let i = 0; i < val.values.length; i++) {
              states.tableData[k].data.push(val.values[i][k])
            }
          })
        }
      },
      {
        immediate: true,
        deep: true
      }
    )
    const exportExcel = () => {
      window.open(
        `${props.api}?${qs.stringify({
          ...props.paramsObj
        })}`
      )
    }
    return {
      ...toRefs(states),
      show,
      handleClose,
      exportExcel,
      formatUnit
      // getSummaries
    }
  }
})
</script>
<style lang="scss" scoped>
.sum {
  border-bottom: 1px solid #ececec;
  height: 47px;
  background: #f5f7fa;
  color: #333;
  font-weight: 600;
  &-item-0{
    line-height:47px;
    text-align: center;
    width: 100px;
    border-left: 1px solid #ececec;
  }
  &-item {
    flex: 1;
    line-height: 47px;
    text-align: center;
    border-left: 1px solid #ececec;
  }
  &-item:last-child {
    //  padding-right: 22px;
    border-right: 1px solid #ececec;
  }
}
.header {
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
  height: 56px;
  background: #f5f7fa;
  color: #333;
  font-weight: 600;
  &-item-0{
    text-align: center;
    line-height: 56px;
    border-left: 1px solid #ececec;
    width: 100px;
  }
  &-item {
    flex: 1;
    border-left: 1px solid #ececec;
    line-height: 56px;
    text-align: center;
  }
  &-item:last-child {
    border-right: 1px solid #ececec;
  }
}
.column {
  border-bottom: 1px solid #ececec;
  height: 47px;
  color: #333;
  &-item {
    display: flex;
    flex: 1;
    line-height: 47px;
    text-align: center;
    border-left: 1px solid #ececec;
    &-inner {
      flex: 1;
      border-left: 1px solid #ececec;
    }
    &-inner:first-child {
      border-left: none;
    }
  }
  &-item-0{
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ececec;
    width: 100px;
  }
  &-item:last-child {
    border-right: 1px solid #ececec;
  }
}
</style>
