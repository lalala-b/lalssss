<template>
  <div class="operate flex flex-justify-center flex-dir-col">
    <div class="flex flex-justify-between flex-align-center">
      <h3 class="operate-title">英雄榜</h3>
      <div class="operate-header flex-justify-between flex-align-center">
        <div>
          <span class="date-text m-r-12">绩效月</span>
          <el-select
            v-model="curMonth"
            placeholder="请选择"
            @change="selectMonth"
          >
            <el-option
              v-for="item in performMonths"
              :key="item.dateStart + '至' + item.dateEnd"
              :label="item.dateStart + '至' + item.dateEnd"
              :value="item.dateStart + '至' + item.dateEnd"
            />
          </el-select>
        </div>
        <div class="m-l-16 m-r-16">
          <el-checkbox v-if="isShowAll && $permission('show_all_herolist')" v-model="showAllCheckBox" class="showAllCheckBox" @change="handleChangeShowAll">显示全部</el-checkbox>
          <el-radio-group v-model="params.rankingType" @change="handleGetList">
            <el-radio-button label="0">总榜排名</el-radio-button>
            <el-radio-button label="1">本军排名</el-radio-button>
          </el-radio-group>
        </div>
        <div v-if="performWeeks && performWeeks.length" class="weeks">
          <el-radio-group v-model="weekType" @change="handleSelectWeek">
            <el-radio-button
              label="0"
            >账号月排名</el-radio-button>
            <el-radio-button
              v-for="(item, index) in performWeeks"
              :key="index"
              :label="index + 1"
            >第{{ weekList[index] }}周</el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
    <VTable ref="VTable" :params="{...params, showAll: isShowAll && showAllCheckBox && $permission('show_all_herolist')}" :curent-month="curentMonth" />
  </div>
</template>

<script>
import {
  computed,
  getCurrentInstance,
  reactive,
  toRefs,
  watch
} from '@vue/composition-api'
import VTable from './_com/Table.vue'
import { $getPerformanceWeek } from '@/api/home'

export default {
  components: {
    VTable
  },
  props: {
    performMonths: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { $refs, $nextTick, $store } = getCurrentInstance().proxy
    const states = reactive({
      curMonth: '',
      rankingType: '0',
      weekType: '0',
      heroList: [],
      performWeeks: [],
      weekList: ['一', '二', '三', '四', '五'],
      loading: false,
      params: {
        achievementsStart: '',
        achievementsEnd: '',
        statisticsType: '2',
        rankingType: '0',
        dId: $store.state.user.userInfo.did,
        curUserId: $store.state.user.userInfo.id
      },
      showAllCheckBox: true,
      isShowAll: true
    })
    watch(
      () => props.performMonths,
      (val) => {
        if (val && val.length) {
          states.curMonth = val[0].dateStart + '至' + val[0].dateEnd
          states.params.achievementsStart = val[0].dateStart
          states.params.achievementsEnd = val[0].dateEnd
          getPerformanceWeek()
          $nextTick(() => {
            $refs.VTable.getList()
          })
        }
      }
    )
    const curentMonth = computed(() => {
      const curMonth = states.curMonth.split('至')
      if (props.performMonths && props.performMonths.length && curMonth[0] === props.performMonths[0].dateStart) {
        return true
      } else {
        return false
      }
    })

    const handleChangeShowAll = (val) => {
      $nextTick(() => {
        handleGetList(0)
      })
    }

    const handleGetList = (val) => {
      if (+val === 0) {
        states.isShowAll = true
      } else {
        states.isShowAll = false
      }

      states.params.statisticsType = +states.weekType ? 1 : 2
      $nextTick(() => {
        $refs.VTable.getList()
      })
    }
    const handleSelectWeek = (val) => {
      console.info('----', val, states.performWeeks)
      if (+val === 0) {
        const arr = states.curMonth.split('至')
        states.params.achievementsStart = arr[0]
        states.params.achievementsEnd = arr[1]
      } else {
        const curTime = states.performWeeks[val - 1] || {}
        states.params.achievementsStart = curTime.dateStart
        states.params.achievementsEnd = curTime.dateEnd
      }
      $nextTick(() => {
        handleGetList()
      })
    }
    const selectMonth = async(val) => {
      const str = val
      states.params.achievementsStart = str.split('至')[0]
      states.params.achievementsEnd = str.split('至')[1]
      states.params.statisticsType = '2'
      states.weekType = '0'
      getPerformanceWeek()
      handleGetList()
    }
    const getPerformanceWeek = () => {
      try {
        const params = {
          dateStart: states.params.achievementsStart,
          dateEnd: states.params.achievementsEnd
        }
        $getPerformanceWeek(params).then((res) => {
          if (res.code === 1 && res.data) {
            states.performWeeks = res.data
            return res.data
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
    getPerformanceWeek()
    return {
      ...toRefs(states),
      selectMonth,
      handleChangeShowAll,
      handleGetList,
      handleSelectWeek,
      curentMonth
    }
  }
}
</script>

<style lang="scss" scoped>
.operate {
  width: 100%;
  background: #fff;
  border-radius: 4px;
  padding: 16px 24px;
  &-title {
    text-align: center;
  }
  &-header {
    display: flex;
    align-items: center;
  }

  ::v-deep {
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      -webkit-box-shadow: 0px 0 0 0 #d9d9d9 !important;
      box-shadow: 0px 0 0 0 #d9d9d9 !important;
    }
    .date-text {
      font-size: 14px;
    }
    .el-input {
      height: 28px;
      width: 216px;
      .el-input__inner {
        height: 28px;
        padding: 0 8px;
      }
      .el-input__suffix {
        display: none;
      }
    }
    .el-radio-group {
      width: 140px;
      .el-radio-button__inner {
        width: 70px;
        padding: 4px 0;
      }
    }
    .el-table th,
    .el-table td {
      height: 24px;
      background: #fff;
      border-bottom: none;
      padding: 0;
    }
    .el-table .cell {
      padding-left: 0;
    }
    .weeks {
      .el-radio-group {
        min-width: 480px;
        // display: flex;
        justify-content: space-between;
        .el-radio-button__inner {
          width: 80px;
          // padding: 4px 4px;
          // border: 1px solid #d9d9d9;
        }
      }
    }
    .el-table::before {
      width: 0;
    }
    .el-table .el-table__fixed-right::before,
    .el-table__fixed::before {
      width: 0;
    }
  }
}

.showAllCheckBox {
  vertical-align: middle;
  margin-right: 6px;
}
</style>
