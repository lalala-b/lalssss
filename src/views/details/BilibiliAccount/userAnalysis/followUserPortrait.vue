<template>
  <el-card shadow="always">
    <div class="follow-head">
      <span>
        关注用户画像
      </span>
    </div>

    <div v-loading="fansTrendLoading" class="user-trend-wrap">
      <div class="trend-head">
        <span>关注用户趋势</span>

        <div ref="trendTab" class="trend-tab">
          <span class="active">总量</span> \
          <span>增量</span>
        </div>
      </div>

      <div class="trend-charts-wrap">
        <FollowUserLine v-if="Object.keys(fanNumTrendList).length" :data="fanNumTrendList" :line-id="1" :cur-type="curType" />
      </div>
    </div>

    <UserPortrait
      :echarts-data-for-sex="echartsDataForSex"
      :echarts-data-for-device="echartsDataForDevice"
      :echarts-data-for-age="echartsDataForAge"
      :echarts-pie-data-for-regional="echartsPieDataForRegional"
      :echarts-bar-data-for-regional="echartsBarDataForRegional"
      :account-data-loading="accountDataLoading"
    />

    <!-- <div class="portrait-data-wrap">
      <div class="pie-box">
        <div class="title">性别分布</div>
        <div class="pie-wrap">
          <UserPortraitPie v-if="echartsDataForSex.length" :data="echartsDataForSex" :pie-id="1" />
        </div>
      </div>

      <div class="pie-box">
        <div class="title">设备分布</div>
        <div class="pie-wrap">
          <UserPortraitPie v-if="echartsDataForDevice.length" :data="echartsDataForDevice" :pie-id="2" />
        </div>
      </div>

      <div class="pie-box">
        <div class="title">年龄分布</div>
        <div class="pie-wrap">
          <UserPortraitPie v-if="echartsDataForAge.length" :data="echartsDataForAge" :pie-id="3" />
        </div>
      </div>
    </div>

    <div class="regional-distribution-wrap">
      <div class="title">地区分布</div>
      <div class="map-wrap">
        <div class="map-china-wrap">
          <RegionalDistributionMap v-if="Object.keys(echartsPieDataForRegional).length" :data="echartsPieDataForRegional" :map-id="1" />
        </div>
        <div class="map-bar-wrap">
          <RegionalDistributionBar v-if="Object.keys(echartsBarDataForRegional).length" :data="echartsBarDataForRegional" :bar-id="2" />
        </div>
      </div>
    </div> -->
  </el-card>
</template>

<script>
import { defineComponent, reactive, watch, toRefs, onMounted, getCurrentInstance } from '@vue/composition-api'
import UserPortraitPie from '../userPortraitPie.vue'
import RegionalDistributionMap from '../regionalDistributionMap.vue'
import RegionalDistributionBar from '../regionalDistributionBar.vue'
import FollowUserLine from './followUserLine.vue'
import UserPortrait from '../userPortrait.vue'

export default defineComponent({
  props: {
    userInfo: {
      type: Object,
      default() {
        return () => ({})
      }
    },
    fanNumTrendList: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    fansTrendLoading: {
      type: Boolean,
      default() {
        return false
      }
    },
    accountDataLoading: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  components: {
    UserPortraitPie,
    RegionalDistributionMap,
    RegionalDistributionBar,
    FollowUserLine,
    UserPortrait
  },

  setup(props, { emit }) {
    const { $refs } = getCurrentInstance().proxy

    const states = reactive({
      echartsDataForSex: [],
      echartsDataForDevice: [],
      echartsDataForAge: [],
      echartsPieDataForRegional: {},
      echartsBarDataForRegional: {},
      curType: 'total'
    })

    const getChartsData = (data) => {
      return [...Object.keys(data)].map(item => {
        const obj = {}
        obj.name = item
        obj.value = data[item]
        return obj
      })
    }

    watch(() => props.userInfo, (val) => {
      if (Object.keys(val || {}).length) {
        const echartsDataForSex = val.saxDistributionsAudience.content
        const echartsDataForDevice = val.deviceDistributionsAudience.content
        const echartsDataForAge = val.ageDistributionsAudience.content
        states.echartsBarDataForRegional = val.topRegionDistributions.content
        states.echartsPieDataForRegional = val.topRegionDistributionsAudience.content
        states.echartsDataForSex = getChartsData(echartsDataForSex)
        states.echartsDataForDevice = getChartsData(echartsDataForDevice)
        states.echartsDataForAge = getChartsData(echartsDataForAge)
      }
    }, {
      immediate: true
    })

    const changeTrendTabActive = () => {
      const trendTab = $refs.trendTab
      const child = [...trendTab.children]
      child.forEach(item => {
        item.addEventListener('click', (e) => {
          child.forEach(childItem => {
            childItem.classList.remove('active')
          })
          e.target.classList.add('active')
          const text = e.target.innerText
          switch (text) {
            case '总量':
              states.curType = 'total'
              break
            case '增量':
              states.curType = 'increment'
              break
            default:
              states.curType = 'total'
              break
          }
        })
      })
    }

    onMounted(() => {
      changeTrendTabActive()
    })

    return {
      ...toRefs(states)
    }
  }
})
</script>

<style lang="scss" scoped>
.follow-head {
  font-size: 16px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-trend-wrap {
  margin-top: 24px;

  .trend-head {
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-content: space-between;

    .trend-tab {
      color: #8d9099;
      cursor: pointer;
    }

    .active {
      color: #33bdf5;
    }
  }

  .trend-charts-wrap {
    margin-top: 32px;
    text-align: right;
    width: 100%;
    height: 380px
  }
}

.portrait-data-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;

  .pie-box {
    // max-height: 310px;
    position: relative;
    border: 1px solid #d9dde4;
    border-radius: 4px;
    width: 32%;

    .title {
      background: rgba(242,245,247,.4);
      padding: 16px 20px;
      border-bottom: 1px solid #d9dde4;
      font-weight: 600;
      font-size: 14px;
    }

    .pie-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}

.regional-distribution-wrap {
  position: relative;
  border: 1px solid #d9dde4;
  border-radius: 4px;
  margin-top: 32px;

   .title {
      background: rgba(242,245,247,.4);
      padding: 16px 20px;
      border-bottom: 1px solid #d9dde4;
      font-weight: 600;
      font-size: 14px;
    }

  .map-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 400px;

    .map-bar-wrap {
      width: 40%;
      height: 100%;
    }

    .map-china-wrap {
      width: 52%;
      height: 100%;
    }
  }
}
</style>
