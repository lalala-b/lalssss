<template>
  <div class="operate flex flex-dir-col">
    <div class="operate-header flex-align-center flex flex-justify-between">
      <h3 class="operate-title">我运营的账号</h3>
      <div class="flex flex-align-center">
        <div>
          <span class="date-text m-r-12">绩效月</span>
          <el-select
            v-model="curMonth"
            placeholder="请选择"
            class="m-r-16"
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
        <el-radio-group v-model="params.rankingType" @change="handleStaticType">
          <el-radio-button label="0">总榜排名</el-radio-button>
          <el-radio-button label="1">本军排名</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <template v-if="showMonthRank">
      <PrvTable ref="VTable2" :params="params" />
    </template>
    <template v-else>
      <CurTable ref="VTable1" :params="params" />
    </template>
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
import CurTable from './_com/CurTable.vue'
import PrvTable from './_com/PrvTable.vue'
export default {
  components: {
    CurTable,
    PrvTable
  },
  props: {
    performMonths: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const { $refs, $permission, $nextTick, $store } = getCurrentInstance().proxy
    const states = reactive({
      curMonth: '',
      params: {
        achievementsStart: '',
        achievementsEnd: '',
        rankingType: '0',
        dId: $store.state.user.userInfo.did,
        curUserId: $store.state.user.userInfo.id
      }
    })
    watch(
      () => props.performMonths,
      (val) => {
        if (val && val.length) {
          states.curMonth = val[0].dateStart + '至' + val[0].dateEnd
          states.params.achievementsStart = val[0].dateStart
          states.params.achievementsEnd = val[0].dateEnd
          $nextTick(() => {
            $refs.VTable1.getList()
          })
        }
      }
    )

    const showMonthRank = computed(() => {
      if (
        props.performMonths &&
        Object.keys(props.performMonths).length &&
        states.curMonth !==
          props.performMonths[0].dateStart +
            '至' +
            props.performMonths[0].dateEnd
      ) {
        return true
      } else {
        return false
      }
    })
    const selectMonth = (val) => {
      const str = val
      states.params.achievementsStart = str.split('至')[0]
      states.params.achievementsEnd = str.split('至')[1]
      states.params.determined = ''
      handleGetList()
    }
    const handleStaticType = (val) => {
      handleGetList()
    }
    const handleGetList = () => {
      if (showMonthRank.value) {
        $nextTick(() => {
          $refs.VTable2.getList()
        })
      } else {
        $nextTick(() => {
          console.log($refs)
          $refs.VTable1.getList()
        })
      }
    }
    return {
      ...toRefs(states),
      showMonthRank,
      selectMonth,
      handleStaticType
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
}
::v-deep {
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
  .operate-header {
    .el-radio-group {
      width: 140px;
      .el-radio-button__inner {
        width: 70px;
        padding: 4px 0;
      }
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
    border: none;
    box-shadow: none;
  }
  .weeks {
    .el-radio-group {
      min-width: 536px;
      display: flex;
      justify-content: space-between;
      .el-radio-button__inner {
        width: 80px;
        padding: 4px 4px;
        border: 1px solid #d9d9d9;
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
</style>
