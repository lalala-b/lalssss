<template>
  <div class="vchart">
    <div v-if="pieData.values&&pieData.values.length" class="vchart-bg m-t-32">
      <div class="vchart-pie">
        <VChart
          type="pie"
          :data="pieData"
          :formater="tooltipFormaterUnit()"
        />
      </div>
      <div class="other-pie">
        <div v-if="otherType.length" class="other-title">其他类型</div>
        <div class="other-content">
          <div v-for="(item,index) in otherType" :key="index" class="track-name">
            <p><span>{{ item.trackName }}</span> {{ ((item.accountPercent||0)*100).toFixed(2) }}%</p>
          </div>
          <div v-if="pieData.otherType.length>10" class="track-name">......</div>
        </div>
      </div>
    </div>
    <div v-else class="echart-no-data">暂无数据</div>
  </div>
</template>

<script>
import { defineComponent, reactive, toRefs, watch } from '@vue/composition-api'
import { VChart } from 'components'
import { isArray } from '@/utils'
export default defineComponent({
  components: {
    VChart
  },
  props: {
    pieData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    const states = reactive({
      data: {},
      peiConfig: {
        legend: {
          show: false
        },
        tooltip: {
           trigger: 'item',
            formatter: function(a) {
              const i = a.dataIndex
              const data = props.pieData
              const radio = ((data.percents[i] || 0) * 100).toFixed(2)
              return `${a.name}<br/>${a.marker}账号数：${a.value}(${radio}%)`
            }
        },
        seriesC: {
          center: ['58%', '50%'],
          label: {
            normal: {
              //  formatter: '{b}\n{d}%',
              formatter: function(a) {
                const i = a.dataIndex
                const data = props.pieData
                const radio = ((data.percents[i] || 0) * 100).toFixed(2)
                return `${a.name}\n${radio}%`
              },
              textStyle: {
                color: 'auto' // 改变标示文字的颜色
              }
            }
          },
          roseType: 'area',
          radius: ['0%', '60%']
        }
      },
      otherType: []
    })
    watch(
      () => props.pieData,
      (val) => {
        if (val && Object.keys(val).length) {
          states.data = props.pieData
          if (val.otherType) {
            val.otherType.forEach((item, index) => {
              if (index < 10) {
                states.otherType.push(item)
              }
            })
          }
        }
      },
      {
        deep: true,
        immediate: true
      }
    )
    const tooltipFormaterUnit = (unit = '') => {
      return (options) => {
        options.legend = states.peiConfig.legend
        // const formatter = ''
        if (isArray(options.series) && options.series.length) {
          options.series[0] = {
            ...options.series[0],
            ...states.peiConfig.seriesC
          }
        //  formatter = `{b}<br /><span style="background:${BaseTheme.color[0]};display:inline-block;width:10px;height:10px;border-radius:50%; margin-right:6px"></span>{a0}: {c}(%)`
        }
        options.tooltip = states.peiConfig.tooltip
        return options
      }
    }
    return {
      ...toRefs(states),
      tooltipFormaterUnit
    }
  }
})
</script>

<style lang="scss" scoped>
.vchart{
  display: flex;
  flex: 1;
  justify-content: center;
}
.vchart-bg {
  background: rgb(43, 36, 95);
  width: 100%;
}
.vchart-pie {
  flex: 1;
}
.other-pie {
  padding: 0 24px 16px;
  display: flex;
  color: #fff;
  .other-title {
    width: 70px;
    color: #2c8ab2;
  }
  .other-content{
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  p {
    color: #c9aaf1;
    line-height: 16px;
  }
}
.echart-no-data{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 380px;
  color: #bbb;
}
.track-name{
  margin-right: 16px;
}
</style>
