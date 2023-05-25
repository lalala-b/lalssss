<template>
  <div v-loading="accountDataLoading">
    <div class="portrait-data-wrap">
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

    <!-- 地区分布 -->
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
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import UserPortraitPie from './userPortraitPie.vue'
import RegionalDistributionMap from './regionalDistributionMap.vue'
import RegionalDistributionBar from './regionalDistributionBar.vue'

export default defineComponent({
  props: {
    echartsDataForSex: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    echartsDataForDevice: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    echartsDataForAge: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    echartsPieDataForRegional: {
      type: Object | Array,
      default() {
        return () => ({})
      }
    },
    echartsBarDataForRegional: {
      type: Object | Array,
      default() {
        return () => ({})
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
    RegionalDistributionBar
  },

  setup(props) {
    // const states = reactive({
    //   echartsDataForSex: [],
    //   echartsDataForDevice: [],
    //   echartsDataForAge: [],
    //   echartsPieDataForRegional: {},
    //   echartsBarDataForRegional: {}
    // })

    // const getChartsData = (data) => {
    //   return [...Object.keys(data)].map(item => {
    //     const obj = {}
    //     obj.name = item
    //     obj.value = data[item]
    //     return obj
    //   })
    // }

    // watch(() => props.userInfo, (val) => {
    //   const echartsDataForSex = val.saxDistributionsAudience.content
    //   const echartsDataForDevice = val.deviceDistributionsAudience.content
    //   const echartsDataForAge = val.ageDistributionsAudience.content
    //   states.echartsBarDataForRegional = val.topRegionDistributions.content
    //   states.echartsPieDataForRegional = val.topRegionDistributionsAudience.content
    //   states.echartsDataForSex = getChartsData(echartsDataForSex)
    //   states.echartsDataForDevice = getChartsData(echartsDataForDevice)
    //   states.echartsDataForAge = getChartsData(echartsDataForAge)
    // })

    // return {
    //   ...toRefs(states)
    // }
  }
})
</script>

<style lang="scss" scoped>
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
