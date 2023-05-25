<template>
  <el-dialog
    title="数据信息"
    :visible.sync="show"
    :before-close="handleClose"
    :width="_width + 'px'"
  >
    <div class="flex header">
      <div class="flex">
        <div class="column-item-0">账号名</div>
        <div v-if="!from" class="column-item-0">平台</div>
        <div v-if="!from" class="column-item-0">签约团队</div>
        <div v-if="!from" class="column-item-0">签约小组</div>
        <div v-if="from==='studio'" class="column-item-0">工作室</div>
      </div>
      <div
        v-for="(itemM, indexM) in tableData.months"
        :key="indexM"
        class="column-item"
      >
        {{ itemM }}
      </div>
    </div>
    <div class=" flex">
      <div>
        <div
          v-for="(item, index) in tableData.terms"
          :key="index"
          class="flex column0-wrapper"
        >
          <div class="column-item-0">
            <template v-if="tableData.terms[index].length>10">
              <el-tooltip placement="top">
                <div slot="content">{{ tableData.terms[index] }}</div>
                <span>{{ tableData.terms[index].substring(0,10)+'...' }}</span>
              </el-tooltip>
            </template>
            <template v-else>{{ tableData.terms[index] }}</template>
          </div>
          <div v-if="!from" class="column-item-0">{{ tableData.platNames[index] }}</div>
          <div v-if="!from" class="column-item-0">{{ tableData.accountTeams[index] }}</div>
          <div v-if="!from" class="column-item-0">{{ tableData.accountGroups[index] }}</div>
          <div v-if="from==='studio'" class="column-item-0">{{ tableData.accountTeams[index] }}</div>
        </div>
      </div>
      <div v-for="(itemM, IndexM) in tableData.values" :key="IndexM+'m'" class="column-item">
        <div v-for="(itemV, indexV) in itemM" :key="indexV+'v'" class="column-inner">
          {{ itemV.value }}
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="exportExcel">导出Excel</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
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
    },
    from: {
      type: String,
      default: ''
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
    watch(
      () => props.trackInfoList,
      (val) => {
        if (val && Object.keys(val) && Object.keys(val).length) {
          states.monthList = val.monthList
          states.tableData = val
          console.log(states.tableData)

          // getSummaries()
          // states.monthList = val.cates
          if (props.from === 'medium') {
            states._width = val.months.length < 3 ? 800 : (val.months.length + 1) * 100
          } else {
            states._width = val.months.length < 3 ? 800 : (val.months.length + 4) * 100
          }

          // states.tableData.length = val.terms ? val.terms.length : 0
          // if (!states.tableData.length) return
          // val.terms.forEach((item, k) => {
          //   states.tableData[k] = { trackName: item, data: [] }
          //   for (let i = 0; i < val.values.length; i++) {
          //     states.tableData[k].data.push(val.values[i][k])
          //   }
          // })
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
    }
  }
})
</script>
<style lang="scss" scoped>
.border-table{
  border-right: 1px solid #ececec;
}
.header{
  background: #f5f7fa;
  color: #333;
  font-weight: 600;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}
.header-prv{
  width: 360px;
}
.column0{
  width: 360px;
}
.column0-wrapper{
  border-bottom: 1px solid #ececec;
}
.column {
  display: flex;
  border-bottom: 1px solid #ececec;
  height: 47px;
  color: #333;
  &-item {
    flex: 1;
    line-height: 47px;
    text-align: center;
    border-left: 1px solid #ececec;
  }
  &-item:last-child {
     border-right: 1px solid #ececec;
  }
  &-item-0 {
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #ececec;
    width: 100px;
    height: 47px;
    .el-tooltip{
      line-height: 20px;
    }
  }
  &-inner{
    line-height: 47px;
    border-bottom: 1px solid #ececec;
  }
}
</style>
